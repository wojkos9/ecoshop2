from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path("getFacet", views.get_facet),
    path("createUser", views.create_user),
    path("login/", obtain_auth_token),
    path("user", views.get_user)
]