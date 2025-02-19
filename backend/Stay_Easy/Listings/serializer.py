from rest_framework import serializers
from .models import Listing,Category
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        required=True, 
        validators=[UniqueValidator(queryset=User.objects.all())] 
    )
    class Meta:
        model = User
        fields = ['username','email','password']
        
    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email = validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']    

class ListingSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required = False)
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=True
    )
    class Meta:
        model = Listing
        fields = ['id','title','description','image','price','location','country','owner','category']
     
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        return data  
    
    # def create(self, validated_data):
    #     # Get the category name from data
    #     category_name = validated_data.pop('category', None)

    #     # Find or create category
    #     category, _ = Category.objects.get(name=category_name)

    #     # Assign category object to validated_data
    #     validated_data['category'] = category

    #     # Create and return listing
    #     return Listing.objects.get(**validated_data)

    def to_representation(self, instance):
        """Return only category name instead of full object"""
        data = super().to_representation(instance)
        data['category'] = instance.category.name if instance.category else None
        return data