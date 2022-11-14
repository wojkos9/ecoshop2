from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path("getFacet", views.get_facet),
    path("createUser", views.create_user),
    path("createCart", views.create_cart),
    path("getCart", views.get_cart),
    path("addToCart", views.add_to_cart),
    path("searchProduct", views.search_product),
    path("login/", views.CustomAuthToken.as_view()),
    path("user", views.get_user),
    path("makeOrder", views.make_order),
    path("download", views.download)
]