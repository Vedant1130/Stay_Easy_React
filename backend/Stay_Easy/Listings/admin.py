from django.contrib import admin
from .models import Listing 
from .models import Category 

admin.site.register(Listing)
admin.site.register(Category)
