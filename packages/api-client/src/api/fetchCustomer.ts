import { Context } from "@vue-storefront/core";

export async function fetchCustomer(context: Context, token) {
    const url = new URL('/api/user', context.config.api.url);
    let config;
    if (token) {
        config = {headers: {
            "Authorization": `Token ${token}`
        }};
    }
    const { data } = await context.client.get(url.href, config);

    return {customer: data};
}
