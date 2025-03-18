from django.contrib import admin
from .models import Listing 
from .models import Category 
from .models import Review
from .models import Payment
from .models import Booking

class ListingAdmin(admin.ModelAdmin):
    list_display = ['title','location','price','category']
    search_fields=['title']
    list_filter = ['location']
    
admin.site.register(Listing , ListingAdmin)
admin.site.register(Category)
admin.site.register(Review)
admin.site.register(Payment)
admin.site.register(Booking)

