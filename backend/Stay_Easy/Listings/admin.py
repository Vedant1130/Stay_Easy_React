from django.contrib import admin
from .models import Listing 
from .models import Category 
from .models import Review

admin.site.register(Listing)
admin.site.register(Category)
admin.site.register(Review)
