# Generated by Django 4.1.3 on 2022-11-12 20:04

from django.db import migrations, models
import shop.models


class Migration(migrations.Migration):

    dependencies = [
        ("shop", "0003_product_quantity"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="image",
            field=models.ImageField(
                default="static/uploads/default.jpg", upload_to=shop.models.hash_upload
            ),
        ),
    ]
