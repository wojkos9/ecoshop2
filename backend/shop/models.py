from django.db import models
from django.contrib.auth.models import User
import uuid
import os
import hashlib

class Category(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

def hash_upload(instance, filename):
    instance.image.open()
    contents = instance.image.read(instance.image.DEFAULT_CHUNK_SIZE)
    _, ext = os.path.splitext(filename)
    return "static/uploads/{0}_{1}{2}".format(instance.name.lower(), hashlib.sha256(contents).hexdigest(), ext)


class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, models.CASCADE, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    quantity = models.IntegerField()
    image = models.ImageField(upload_to=hash_upload, default="static/uploads/default.jpg")
    def __str__(self):
        return self.name

class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name="carts")

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name="orders")
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    delivered = models.BooleanField(default=False)

class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    quantity = models.IntegerField()

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    quantity = models.IntegerField()
