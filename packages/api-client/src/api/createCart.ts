import { Context } from "@vue-storefront/core";

export async function createCart(context: Context) {
    const url = new URL('/api/createCart', context.config.api.url);

    const { data } = await context.client.get(url.href);

    return data;
}
