from django.http import JsonResponse
from .models import Product, Category
from .serializers import ProductSerializer
from rest_framework.request import Request
from django.contrib.auth.models import User
from django.http import HttpResponseForbidden, HttpResponse, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login

@api_view(['GET'])
def get_facet(q: Request):
    cat = q.query_params.get("cat")
    prods = Product.objects.filter(category__name=cat)
    return JsonResponse(ProductSerializer(prods, many=True).data, safe=False)

def create_cart(q):
    pass

from dataclasses import dataclass

@dataclass
class UserData:
    email: str
    password: str
    firstName: str
    lastName: str

@api_view(['POST'])
def create_user(q: Request):
    d = q.data
    u = UserData(d.get("email"), d.get("password"), d.get("firstName"), d.get("lastName"))
    if User.objects.filter(email=u.email).exists():
        return HttpResponseForbidden()
    else:
        user = User.objects.create_user(u.email, u.email, u.password, first_name=u.firstName, last_name=u.lastName)
        user.save()
        return HttpResponse("OK")

@api_view(['POST'])
def login_user(q: Request):
    d = q.data
    user = authenticate(q, username=d.get("username"), password=d.get("password"))
    if user is not None:
        login(q, user)
        return HttpResponse("OK")
    else:
        return HttpResponseForbidden()