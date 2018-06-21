import $C from './config.js';

export default function (user: any) {
    return fetch(`${$C.apiUrl}/v3/get`, {
        body: JSON.stringify({
            consumer_key: $C.consumerKey,
            access_token: user.access_token
        }),
        headers: $C.headers,
        method: 'POST'
    })
        .then(response => response.json())
}
