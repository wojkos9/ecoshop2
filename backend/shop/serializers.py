from rest_framework import serializers
from .models import Product, Cart, Order

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "image"]

class AddCartSerializer(serializers.Serializer):
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quantity = serializers.IntegerField()
    is_add = serializers.BooleanField(default=False, required=False)

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "date", "amount", "delivered"]