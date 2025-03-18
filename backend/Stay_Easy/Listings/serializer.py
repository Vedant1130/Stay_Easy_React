from rest_framework import serializers
from .models import Listing, Category ,Payment
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from Reviews.serializer import ReviewSerializer  # Import ReviewSerializer

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
    image = serializers.ImageField(required=False)
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=True
    )
    owner = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)  # Include reviews
    
    class Meta:
        model = Listing
        fields = ['id','title','description','image','price','location','country','owner','category', 'reviews']
        
    def get_owner(self, obj):
        """Return both ID and username of the owner"""
        return {
            "id": obj.owner.id,
            "username": obj.owner.username
        }
     
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        data['category'] = instance.category.name if instance.category else None
        return data
    
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['booking', 'order_id', 'payment_id', 'amount', 'status', 'created_at']    