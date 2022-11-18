import { Context } from "@vue-storefront/core";

export async function cartAction(context: Context, action: "update" | "create" | "get", param: any) {
    let config;
    if (param?.token) {
        config = {headers: {
            "Authorization": `Token ${param.token}`
        }};
        delete param.token;
    }
    switch(action) {
        case "create": {
            const url = new URL('/api/createCart', context.config.api.url);
            const { data } = await context.client.get(url.href, config);
            return {id: data};
        }
        case "update": {
            const url = new URL('/api/addToCart', context.config.api.url);
            const {product: p, currentCart: cc, ...rest} = param;
            try {
                const { data } = await context.client.post(url.href, {cart: cc?.id, product: p?.id, ...rest}, config);
                return data;
            } catch (e) {
                return {error: e.response.data};
            }
        }
        case "get": {
            const url = new URL('/api/getCart', context.config.api.url);
            url.searchParams.set("id", param.currentCart);
            const { data } = await context.client.get(url.href, config);
            return data;
        }
        default: {
            return null;
        }

    }
}
