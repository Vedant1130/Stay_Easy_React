from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")  # Show author username

    class Meta:
        model = Review
        fields = ['id', 'comment', 'rating', 'created_at', 'author', 'author_username']
        extra_kwargs = {'author': {'read_only': True}}  # Author is auto-set
