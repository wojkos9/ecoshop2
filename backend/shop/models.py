from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, models.CASCADE, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    def __str__(self):
        return self.name
