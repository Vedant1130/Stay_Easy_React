from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")

    def __str__(self):
        return f"Review by {self.author.username} - {self.rating} Stars"
    
    # @property
    # def listing_instance(self):
    #     Listing = apps.get_model('Listings', 'Listing')
    #     return Listing.objects.get(id=self.listing.id)
