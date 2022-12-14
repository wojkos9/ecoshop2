import { Context } from "@vue-storefront/core";

export async function makeOrder(context: Context, params) {
    const url = new URL('/api/makeOrder', context.config.api.url);
    params?.cart && url.searchParams.set("cart", params.cart);
    try {
        const { data } = await context.client.get(url.href);
        return data;
    } catch (e) {
        return { error: e.response.data };
    }
}
