import $C from './config.js';

const authFlow = (details: chrome.identity.WebAuthFlowOptions): Promise<string> => new Promise((resolve, reject) => {
    try {
        chrome.identity.launchWebAuthFlow(details, (response: string | undefined) => resolve(response))
    } catch (e) {
        reject(e);
    }
});

fetch(`${$C.apiUrl}/v3/oauth/request`, {
    body: JSON.stringify({
        consumer_key: $C.consumerKey,
        redirect_uri: $C.redirectUri,
    }),
    headers: $C.headers,
    method: 'POST'
})
    .then(response => response.json())
    .then(json => json.code)
    .then(authCode => {
        const redirectUri = `${$C.redirectUri}?${authCode}`;

        return authFlow({
                url: `${$C.apiUrl}/auth/authorize?request_token=${authCode}&redirect_uri=${redirectUri}`,
                interactive: true
            });
    })
    .then((redirectUrl: string) => {
        if (redirectUrl) {
            const code = new URL(redirectUrl).search.replace('?', '');
            return fetch(`${$C.apiUrl}/v3/oauth/authorize`, {
                body: JSON.stringify({
                    consumer_key: $C.consumerKey,
                    code
                }),
                method: 'POST',
                headers: $C.headers,
            });
        }
        return Promise.reject();
    })
    .then(response => response.json())
    .then(json => fetch(`${$C.apiUrl}/v3/get`, {
        body: JSON.stringify({
            consumer_key: $C.consumerKey,
            access_token: json.access_token
        }),
        headers: $C.headers,
        method: 'POST'
    }))
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(e => console.warn(e));
