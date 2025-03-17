from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from Listings.models import Listing
from .models import Review
from django.db.models import Avg, Count

from .serializer import ReviewSerializer

@api_view(['POST'])
@permission_classes([AllowAny])  # Only logged-in users can post reviews
def create_review(request, listing_id):
    try:
        listing = get_object_or_404(Listing, id=listing_id)  # Get the listing
        serializer = ReviewSerializer(data=request.data)

        if serializer.is_valid():
            review = serializer.save(owner=request.user)  # Assign logged-in user as author
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
        if request.user != review.owner:
            return Response({'success': False, 'message': 'You are not authorized to delete this review'}, status=403)

        # Remove review from listing
        listing.reviews.remove(review)
        listing.save()

        # Delete the review
        review.delete()

        return Response({'success': True, 'message': 'Review Deleted'})

    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_reviews_summary(request, listing_id):
    try:
        # Fetch the listing
        listing = get_object_or_404(Listing, id=listing_id)

        # Fetch all reviews related to this listing
        reviews = listing.reviews.all()  # Use ManyToMany relationship

        # Calculate average rating (rounded to 1 decimal place)
        average_rating = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
        average_rating = round(average_rating, 1) if average_rating else 0

        # Count total reviews
        total_reviews = reviews.count()

        # Count reviews per rating (1-5)
        rating_counts = reviews.values('rating').annotate(count=Count('rating'))
        rating_distribution = {rating: 0 for rating in [1, 2, 3, 4, 5]}  # Default 0 for all

        for entry in rating_counts:
            rating_distribution[int(entry['rating'])] = entry['count']

        return Response({
            'success': True,
            'average_rating': average_rating,
            'total_reviews': total_reviews,
            'rating_distribution': rating_distribution
        })

    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)    