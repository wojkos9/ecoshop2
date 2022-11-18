from django.forms import ValidationError
from django.http import JsonResponse, FileResponse
from .models import Order, OrderItem, Product, Category, Cart, CartItem
from .serializers import ProductSerializer, AddCartSerializer, OrderSerializer
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
import os

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

from django.contrib.auth.password_validation import validate_password

@api_view(['POST'])
def create_user(q: Request):
    d = q.data
    u = UserData(d.get("email"), d.get("password"), d.get("firstName"), d.get("lastName"))
    if User.objects.filter(email=u.email).exists():
        return HttpResponseForbidden("User with given email already exists")
    else:
        user = User.objects.create_user(u.email, u.email, u.password, first_name=u.firstName, last_name=u.lastName)
        try:
            validate_password(u.password, user)
        except ValidationError as e:
            user.delete()
            print()
            return HttpResponseForbidden(e)
        user.save()
        cc_id = q.data.get("currentCart")
        current_cart: Cart = Cart.objects.filter(id=cc_id).first() if cc_id else None
        if current_cart and not current_cart.owner:
            current_cart.owner = user
            current_cart.save()
        token = Token.objects.create(user=user)
        return JsonResponse({"token": token.key})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(q: Request):
    return HttpResponse(q.user.username)

@api_view(['GET'])
def create_cart(q: Request):
    cart = Cart.objects.create()
    if q.user and not q.user.is_anonymous and not Cart.objects.filter(owner=q.user).exists():
        cart.user = q.user
        cart.save()
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
def add_to_cart(request: Request):
    d = request.data
    ser = AddCartSerializer(data=d)
    if ser.is_valid():
        v = ser.validated_data
        cart: Cart = v.get("cart")
        product: Product = v.get("product")
        q = v.get("quantity")

        if cart.owner and cart.owner != request.user:
            print(cart.owner, request.user)
            return HttpResponseForbidden("No rights to alter cart")

        cart_p = CartItem.objects.filter(cart=cart, product=product).first()
        nq = (q + (cart_p.quantity if cart_p else 0)) if v.get("is_add") else q
        message = None
        if cart_p and cart_p.quantity > nq > product.quantity:
            nq = product.quantity
            message = "Product quantity decreased"
        elif nq > product.quantity or nq < 0:
            return HttpResponseForbidden("Invalid product quantity")

        if not cart_p:
            CartItem.objects.create(cart=cart, product=product, quantity=nq)
        elif nq == 0:
            CartItem.objects.filter(cart=cart, product=product).delete()
        else:
            CartItem.objects.filter(cart=cart, product=product).update(quantity=nq)
        ret = present_cart(cart)
        if message:
            ret = {**ret, "message": message}
        return JsonResponse(ret, safe=False)
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

def sanitize_name(name: str):
    return name.lower().replace(" ", "_")

import io
import zipfile
@api_view(['GET'])
def make_order(q: Request):
    not_in_stock = []
    cart = Cart.objects.filter(id=q.query_params.get("cart")).first()
    items = CartItem.objects.filter(cart=cart).all()
    for it in items:
        if not 0 < it.quantity <= it.product.quantity:
            not_in_stock.append(it.product.name)
    if not_in_stock:
        return HttpResponseForbidden(str(not_in_stock))

    order = Order.objects.create(owner=cart.owner, amount=0)
    amount = 0
    for it in items:
        q = it.quantity
        it.product.quantity -= q
        it.product.save()
        OrderItem.objects.create(order=order, product=it.product, quantity=it.quantity)
        amount += it.product.price * it.quantity
        it.delete()
    order.amount = amount
    order.save()

    return JsonResponse({"order": order.id})

@api_view(['GET'])
def download(q: Request):
    order = Order.objects.filter(id=q.query_params.get("order")).first()
    if order.delivered:
        return HttpResponseForbidden("Order delivered")
    buf = io.BytesIO()
    z = zipfile.ZipFile(buf, "w")
    for it in order.items.all():
        for i in range(1, it.quantity+1):
            p = it.product
            _, ext = os.path.splitext(p.image.path)
            z.write(p.image.path, f"{sanitize_name(p.name)}_{i}{ext}")

    z.close()
    buf.seek(0)

    resp = FileResponse(buf, as_attachment=True, filename=f"order_{order.id}.zip")
    order.delivered = True
    order.save()
    return resp

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(q: Request):
    if not q.user:
        return HttpResponseForbidden("Not authorized")
    return JsonResponse(OrderSerializer(q.user.orders.all(), many=True).data, safe=False)
