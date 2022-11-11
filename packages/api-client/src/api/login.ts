import { Context } from "@vue-storefront/core";

export async function login(context: Context, params) {
    const url = new URL('/api/login/', context.config.api.url);

    const { data } = await context.client.post(url.href, params);

    return data;
}
