from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source="owner.username")  # Show User username

    class Meta:
        model = Review
        fields = ['id', 'comment', 'rating', 'created_at', 'owner', 'owner_username']
        extra_kwargs = {'owner': {'read_only': True}}  # Author is auto-set
