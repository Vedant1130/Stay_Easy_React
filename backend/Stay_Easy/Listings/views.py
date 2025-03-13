from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Listing,Category
from .serializer import ListingSerializer,UserRegistrationSerializer,CategorySerializer
from rest_framework import status
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.db.models import Q
from rest_framework.views import APIView
from .filters import ListingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view,permission_classes, authentication_classes
from rest_framework.decorators import parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import generics
from django.utils.timezone import now, timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.core.mail import send_mail
from django.utils.timezone import now
from .models import UserProfile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
import random
import logging
import secrets

from .models import Review

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get("username")
            password = request.data.get("password")

            # ✅ Validate request data
            if not username or not password:
                return Response({'success': False, 'message': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Check if user exists
            user = User.objects.filter(username=username).first()
            if not user:
                logger.error(f"Login failed: User '{username}' not found")
                return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            # ✅ Check if user is verified
            if not user.profile.is_verified:
                logger.warning(f"Login failed: {username} not verified")
                send_otp_email(user)

                return Response({
                    'success': False,
                    'message': 'Email not verified',
                    'data': {'email': user.email}
                   }, status=status.HTTP_403_FORBIDDEN)
                 

            # ✅ Authenticate user
            authenticated_user = authenticate(request, username=username, password=password)
            if authenticated_user:
                logger.info(f"User {username} authenticated successfully.")

                # ✅ Generate JWT Tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                response = Response({
                    "success": True,
                    "message": "Login successful",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "email": user.email
                }, status=status.HTTP_200_OK)

                # ✅ Store tokens in HttpOnly Cookies
                response.set_cookie(
                    key="access_token",
                    value=access_token,
                    httponly=True,
                    samesite='Lax',
                    secure='/'  # Secure in production
                )
                response.set_cookie(
                    key="refresh_token",
                    value=refresh_token,
                    httponly=True,
                    samesite='Lax',
                    secure='/'  # Secure in production
                )

                return response  # ✅ Return response with tokens

            # ❌ Incorrect password
            logger.warning(f"Login failed: Incorrect password for {username}.")
            return Response({'success': False, 'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            logger.exception(f"Unexpected error during login: {str(e)}")
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
         
class CustomRefreshTokenView(TokenRefreshView):
    def post(self,request,*args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            response = super().post(request,*args,**kwargs)
            tokens = response.data
            access_token = tokens['access']
            res = Response()
            res.data = {'refreshed':True}
            
            res.set_cookie(
              key="access_token",
              value=access_token,
              httponly=True,
              secure=True,
              samesite='None',
              path='/'
          )
            
            return res
        except:
            return Response({'refreshed':False})

class searchListings(APIView):
    permission_classes = [AllowAny] 
    def get(self, request):
        # query = request.GET.get('query', '')  # Search keyword
        location = request.GET.get('location', '')  # City and country

        listings = Listing.objects.all()


        if location:
            listings = listings.filter(
                Q(location__icontains=location) | Q(country__icontains=location)
            )

        serialized_listings = ListingSerializer(listings, many=True, context={'request': request})

        return Response({
            'listings': serialized_listings.data
        }, status=status.HTTP_200_OK)

class filter(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated if needed
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ListingFilter
    
class CategoryList(APIView):
    permission_classes = [AllowAny] 
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)    
            
@api_view(['POST'])
@permission_classes({AllowAny})
def logout(request):
    try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token',path='/',samesite='None')            
        res.delete_cookie('refresh_token',path='/',samesite='None')
        return res
    except:
        return Response({'success':False})           

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    if request.user.is_authenticated:
        return Response({"user": {"id": request.user.id, "username": request.user.username}})
    
    return Response({"error": "User not authenticated"}, status=401)

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # ✅ Create/Update UserProfile
        profile, created = UserProfile.objects.update_or_create(user=user)

        # ✅ Generate Secure OTP
        profile.otp = str(secrets.randbelow(900000) + 100000)
        profile.otp_expiry = now() + timedelta(minutes=10)
        profile.save()

        # ✅ Send OTP via Email
        send_mail(
            "Your OTP for StayEasy Verification",
            f"Hello {user.username},\nYour OTP is: {profile.otp}",
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
        
        logger.info(f"OTP sent to {user.email}")

        return Response(
            {"message": "OTP sent to your email. Please verify."},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def send_otp_email(user):
    profile = user.profile
    profile.otp = str(secrets.randbelow(900000) + 100000)
    profile.otp_expiry = now() + timedelta(minutes=10)
    profile.save()
    send_mail(
        'Your OTP Code',
        f'Your OTP code is {profile.otp}. It will expire in 10 minutes.',
        settings.EMAIL_HOST_USER,
        [user.email],
        fail_silently=False,
    )
    logger.info(f"OTP resent to {user.email}")

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return Response({"error": "Email and OTP are required!"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.filter(email=email).first()
    if not user:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

    profile = user.profile

    if profile.is_verified:
        return Response({"message": "User already verified!"}, status=status.HTTP_200_OK)

    if profile.otp != otp:
        return Response({"error": "Invalid OTP!"}, status=status.HTTP_400_BAD_REQUEST)

    if profile.otp_expiry and profile.otp_expiry < now():
        return Response({"error": "OTP has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

    profile.is_verified = True
    profile.otp = None  # Clear OTP after verification
    profile.otp_expiry = None
    profile.save()
    
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return Response({
        "message": "Email verified successfully!",
        "access_token": access_token,
        "refresh_token": str(refresh),
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username
        }
    }, status=status.HTTP_200_OK)
    
    logger.info(f"User {user.email} verified successfully")
    
    return Response({"message": "Email verified successfully!"}, status=status.HTTP_200_OK)

    
    
@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    email = request.data.get("email")
    username = request.data.get("username")

    try:
        # ✅ Allow OTP to be resent via username (for login) or email (registration)
        if email:
            user = User.objects.filter(email=email).first()
        elif username:
            user = User.objects.filter(username=username).first()
            email = user.email if user else None
        else:
            return Response({"error": "Email or Username is required!"}, status=status.HTTP_400_BAD_REQUEST)

        if not user:
            return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

        profile = user.profile
        profile.otp = str(secrets.randbelow(900000) + 100000)
        profile.otp_expiry = now() + timedelta(minutes=10)
        profile.save()

        # ✅ Send OTP to the email associated with the username
        send_mail(
            "Your OTP for StayEasy Verification",
            f"Hello {user.username},\nYour OTP is: {profile.otp}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        logger.info(f"New OTP sent to {email}")

        return Response({"message": "New OTP sent successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes({AllowAny})
def index(request):
    listings = Listing.objects.all()
    serializer = ListingSerializer(listings, many=True,context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def show_listing(request, id):
    try:
        # Retrieve the listing by its ID
        listing = Listing.objects.get(id=id)
    except Listing.DoesNotExist:
        return Response({"error": "Listing does not exist"}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the listing, passing the request context
    serializer = ListingSerializer(listing, context={'request': request})
    
    # Return the serialized data as a response
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
@permission_classes([IsAuthenticated])
def create_listing(request):
    try:
        if request.user.is_anonymous:
            return Response({"error": "User not authenticated"}, status=401)

        # Get the data from the request
        data = request.data.copy()  # Create a mutable copy

        # Ensure that a category is provided in the request
        category_id = data.get('category', None)
        if not category_id:
            return Response({"error": "Category is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get the category object
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Category not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Use the ListingSerializer to validate and save the data
        serializer = ListingSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save(owner=request.user)  # ✅ Assign owner here
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
@permission_classes([IsAuthenticated])
def update_listing(request, id):
    try:
        listing = Listing.objects.get(id=id)

        # Ensure only the owner can update
        if listing.owner != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ListingSerializer(listing, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Listing.DoesNotExist:
        return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_listing(request, id):
    try:
        listing = Listing.objects.get(id=id)

        # Ensure only the owner can delete
        if listing.owner != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        listing.delete()
        return Response({"message": "Listing deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    except Listing.DoesNotExist:
        return Response({"error": "Listing does not exist"}, status=status.HTTP_404_NOT_FOUND)
    