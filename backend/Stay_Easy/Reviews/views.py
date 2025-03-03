from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from Listings.models import Listing
from .models import Review
from .serializer import ReviewSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only logged-in users can post reviews
def create_review(request, listing_id):
    try:
        listing = get_object_or_404(Listing, id=listing_id)  # Get the listing
        serializer = ReviewSerializer(data=request.data)

        if serializer.is_valid():
            review = serializer.save(author=request.user)  # Assign logged-in user as author
            listing.reviews.add(review)  # Add review to listing
            listing.save()
            
            res = Response()
            res.data = {'success': True, 'review': serializer.data}
            return res
        
        return Response({'success': False, 'errors': serializer.errors}, status=400)

    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, listing_id, review_id):
    try:
        listing = get_object_or_404(Listing, id=listing_id)
        review = get_object_or_404(Review, id=review_id)

        # Check if the logged-in user is the review author
        if request.user != review.author:
            return Response({'success': False, 'message': 'You are not authorized to delete this review'}, status=403)

        # Remove review from listing
        listing.reviews.remove(review)
        listing.save()

        # Delete the review
        review.delete()

        return Response({'success': True, 'message': 'Review Deleted'})

    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)