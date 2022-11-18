import { Context } from "@vue-storefront/core";

export async function createUser(context: Context, params) {
    const url = new URL('/api/createUser', context.config.api.url);
    try {
        const { data } = await context.client.post(url.href, params);
        return data;
    } catch (e) {
        return {error: e.response.data};
    }
}
