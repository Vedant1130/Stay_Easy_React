import django_filters
from .models import Listing, Category

class ListingFilter(django_filters.FilterSet):
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all(), field_name="category", label="Category")

    class Meta:
        model = Listing
        fields = ['category']