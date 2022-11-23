import { Context } from "@vue-storefront/core";

export async function changePassword(context: Context, token, params) {
    const url = new URL('/api/changePassword', context.config.api.url);
    let config;
    if (token) {
        config = {headers: {
            "Authorization": `Token ${token}`
        }};
    }
    const { currentPassword, newPassword } = params;
    try {
        await context.client.post(url.href, { currentPassword, newPassword }, config);
        return {};
    } catch (e) {
        return { error: e.response.data };
    }
}