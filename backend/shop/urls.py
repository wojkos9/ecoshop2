from django.urls import path
from . import views

urlpatterns = [
    path("getFacet", views.get_facet),
    path("createUser", views.create_user),
    path("login/", views.login_user)
]