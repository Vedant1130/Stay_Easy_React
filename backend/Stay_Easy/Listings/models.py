from django.db import models
from django.contrib.auth.models import User
from Reviews.models import Review
from django.db import models
from django.contrib.auth.models import User
import random

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_verified = models.BooleanField(default=False)  # Email verification field
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - Verified: {self.is_verified}"
    
    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        from django.utils.timezone import now, timedelta
        self.otp_expiry = now() + timedelta(minutes=10)  # OTP valid for 10 minutes
        self.save()

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name

class Listing(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=300, null=True)
    image = models.ImageField(upload_to='listing_images/', null=True, blank=True)
    price = models.FloatField()
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='listings')
    reviews = models.ManyToManyField(Review, related_name='listing_reviews', blank=True) 
    
    def __str__(self):
        return self.title
    
# ✅ NEW: Booking Model
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bookings")
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.IntegerField(default=1)
    total_price = models.FloatField()
    is_paid = models.BooleanField(default=False)  # Payment status
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.listing.title} ({self.check_in} to {self.check_out})"

# ✅ NEW: Payment Model
class Payment(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="payment")
    order_id = models.CharField(max_length=255, unique=True)
    payment_id = models.CharField(max_length=255, null=True, blank=True)
    amount = models.FloatField()
    status = models.CharField(max_length=50, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.order_id} - {self.status}"    
