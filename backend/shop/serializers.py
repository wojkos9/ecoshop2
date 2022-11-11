from rest_framework import serializers
from .models import Product
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["name", "price"]

# class UserDataSerializer(serializers.ModelSerializer):
#     username = serializers.SerializerMethodField(source="email")
#     first_name = serializers.SerializerMethodField(source="firstName")
#     class Meta:
#         model = User
#         fields = "__all__"