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

from rest_framework.decorators import api_view,permission_classes
from rest_framework.decorators import parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import generics

from .models import Review

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self,request,*args, **kwargs):
        try:
          response = super().post(request,*args, **kwargs)
          tokens = response.data
        
          access_token = tokens['access']
          refresh_token = tokens['refresh']
        
          res = Response()
        
          res.data={'success':True,}
            
          res.set_cookie(
              key="access_token",
              value=access_token,
              httponly=True,
              secure=True,
              samesite='None',
              path='/'
          )
          res.set_cookie(
              key="refresh_token",
              value=refresh_token,
              httponly=True,
              secure=True,
              samesite='None',
              path='/'
          )
          return res
          
        except:
            return Response({'success':False})  
         
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

@api_view(['POST'])
@permission_classes({IsAuthenticated})
def is_authenticated(request):
    user = request.user
    return Response({"user": {"id": user.id, "username": user.username, "email": user.email}})

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)  
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    
