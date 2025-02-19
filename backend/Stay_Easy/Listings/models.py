from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name

class Listing(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=300,null=True)
    image = models.ImageField(upload_to='listing_images/', null=True, blank=True)
    price = models.FloatField()
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE,related_name='listings')
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,related_name='listings')
    
    def __str__(self):
        return self.title

