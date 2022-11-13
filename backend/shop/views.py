from django.http import JsonResponse
from .models import Product, Category, Cart, CartItem
from .serializers import ProductSerializer, AddCartSerializer
from rest_framework.request import Request
from django.contrib.auth.models import User
from django.http import HttpResponseForbidden, HttpResponse, HttpResponseServerError
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

@api_view(['GET'])
def get_facet(q: Request):
    cat = q.query_params.get("cat")
    prods = Product.objects.filter(category__name=cat)
    return JsonResponse(ProductSerializer(prods, many=True).data, safe=False)

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(q: Request):
    return HttpResponse(q.user.username)

@api_view(['GET'])
def create_cart(q: Request):
    cart = Cart.objects.create()
    return HttpResponse(cart.id)

def present_cart(cart: Cart):
    items = CartItem.objects.filter(cart=cart)
    return {"id": cart.id, "products": [{**ProductSerializer(i.product).data, "quantity": i.quantity} for i in items]}

@api_view(['GET'])
def get_cart(q: Request):
    cart_id = q.query_params.get("id")
    if not cart_id:
        return HttpResponseForbidden()
    cart = Cart.objects.filter(id=cart_id).first()
    if not cart:
        return HttpResponseForbidden()
    return JsonResponse(present_cart(cart), safe=False)

@api_view(['POST'])
def add_to_cart(q: Request):
    d = q.data
    ser = AddCartSerializer(data=d)
    if ser.is_valid():
        v = ser.validated_data
        cart = v.get("cart")
        product: Product = v.get("product")
        q = v.get("quantity")

        cart_p = CartItem.objects.filter(cart=cart, product=product).first()
        nq = (q + (cart_p.quantity if cart_p else 0)) if v.get("is_add") else q
        print(nq, v.get("is_add"))
        if nq > product.quantity or nq < 0:
            return HttpResponseForbidden("Too much")

        if not cart_p:
            CartItem.objects.create(cart=cart, product=product, quantity=nq)
        elif nq == 0:
            CartItem.objects.filter(cart=cart, product=product).delete()
        else:
            CartItem.objects.filter(cart=cart, product=product).update(quantity=nq)
        return JsonResponse(present_cart(cart), safe=False)
    else:
        print(ser.errors)
    return HttpResponseForbidden()

@api_view(['GET'])
def search_product(q: Request):
    term = q.query_params.get("term")
    products = []
    if term:
        matches = Product.objects.filter(name__icontains=term)
        products = ProductSerializer(matches, many=True).data
    return JsonResponse({"products": products}, safe=False)

def merge_carts(c_from: Cart, c_to: Cart):
    i_to = CartItem.objects.filter(cart=c_to)
    for it in c_from.items.all():
        it: CartItem
        Cart.objects
        p_to = i_to.filter(product=it.product)
        check_bounds = lambda q: min(it.product.quantity, q)
        if p_to.exists():
            nq = check_bounds(p_to.first().quantity + it.quantity)
            p_to.update(quantity=nq)
            it.delete()
        else:
            c_from.items.filter(product=it.product).update(cart=c_to)
    c_from.delete()

class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        cc_id = request.data.get("currentCart")
        current_cart: Cart = Cart.objects.filter(id=cc_id).first() if cc_id else None
        cart = Cart.objects.filter(owner=user).first()
        if cart and current_cart:
            if cc_id != cart.id:
                merge_carts(current_cart, cart)
        elif current_cart:
            current_cart.owner = user
            current_cart.save()
        token, created = Token.objects.get_or_create(user=user)
        resp_data = {
            'token': token.key,
            'email': user.email
        }
        if cart:
            resp_data["cart"] = present_cart(cart)
        return Response(resp_data)