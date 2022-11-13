from rest_framework import serializers
from django.db import models
from .models import Product, Cart
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "image"]

class AddCartSerializer(serializers.Serializer):
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quantity = serializers.IntegerField()
    is_add = serializers.BooleanField(default=False, required=False)

# class UserDataSerializer(serializers.ModelSerializer):
#     username = serializers.SerializerMethodField(source="email")
#     first_name = serializers.SerializerMethodField(source="firstName")
#     class Meta:
#         model = User
#         fields = "__all__"