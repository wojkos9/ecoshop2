import {
  CartGetters,
  AgnosticPrice,
  AgnosticTotals,
  AgnosticCoupon,
  AgnosticDiscount,
  AgnosticAttribute
} from '@vue-storefront/core';
import type { Cart, Product, CartItem } from '@vue-storefront/ecoshop-api';
import { productGetters } from './productGetters';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItems(cart: Cart): CartItem[] {
  return cart?.products ?? [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemName(item: CartItem): string {
  return item.name;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemImage(item: CartItem): string {
  return productGetters.getCoverImage(item as Product);//;'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081223_1_large.jpg';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemPrice(item: CartItem): AgnosticPrice {
  return {
    regular: item.price
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemQty(item: CartItem): number {
  return item.quantity;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemAttributes(item: CartItem, filterByAttributeName?: Array<string>): Record<string, AgnosticAttribute | string> {
  return {
    color: 'red'
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getItemSku(item: CartItem): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotals(cart: Cart): AgnosticTotals {
  const total = getItems(cart).reduce((p, c) => p + c.price * c.quantity, 0) as number;
  return {
    total,
    subtotal: total,
    special: total
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getShippingPrice(cart: Cart): number {
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotalItems(cart: Cart): number {
  return cart?.products?.length || 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFormattedPrice(price: number): string {
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCoupons(cart: Cart): AgnosticCoupon[] {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDiscounts(cart: Cart): AgnosticDiscount[] {
  return [];
}

export const cartGetters: CartGetters<Cart, CartItem> = {
  getTotals,
  getShippingPrice,
  getItems,
  getItemName,
  getItemImage,
  getItemPrice,
  getItemQty,
  getItemAttributes,
  getItemSku,
  getFormattedPrice,
  getTotalItems,
  getCoupons,
  getDiscounts
};
