export type TODO = unknown;

export type Setttings = TODO;

export type Endpoints = TODO;

export type BillingAddress = TODO;

export type Cart = {
    products: CartItem[]
};

export type CartItem = {
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export type Category = TODO;

export type Coupon = TODO;

export type Facet = {
    id: number;
    name: string;
    price: string;
    image: string;
}[];

export type FacetSearchCriteria = TODO;

export type Order = {
    id?: string;
    amount?: string;
    date?: string;
    delivered?: boolean;
    orders?: Order[];
};

export type OrderItem = TODO;

export type PasswordResetResult = TODO;

export type Product = {
    name: string;
    price: number;
    image: string;
};

export type ProductFilter = TODO;

export type Review = TODO;

export type ReviewItem = TODO;

export type User = TODO;

export type UserBillingAddress = TODO;

export type UserBillingAddressItem = TODO;

export type UserBillingAddressSearchCriteria = TODO;

export type UserShippingAddress = TODO;

export type UserShippingAddressItem = TODO;

export type UserShippingAddressSearchCriteria = TODO;

export type ShippingAddress = TODO;

export type ShippingMethod = TODO;

export type ShippingProvider = TODO;

export type Store = TODO;

export type Wishlist = TODO;

export type WishlistItem = TODO;
