import WebAPIClient from 'https://cdn.jsdelivr.net/gh/kanaaa224/home-server-web-api@master/dist/web-api-client.esm.min.js';

export const main = new WebAPIClient();

export const call = async (request = {}) => {
    const {
        baseURL = '',
        path    = '/',
        query   = {},
        headers = {},
        body    = null,
        method  = body !== null ? 'POST' : 'GET'
    } = request;

    const endpoint = new URL(baseURL);

    endpoint.pathname = `${endpoint.pathname.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

    for(const [ key, value ] of Object.entries(query)) endpoint.searchParams.set(key, value);

    const options = { method, headers: { ...headers } };

    if(body !== null) {
        options.headers['Content-Type'] ??= 'application/json';
        options.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);
    const text     = await response.text();

    const data   = text ? (response.headers.get('content-type')?.includes('json') ? JSON.parse(text) : text) : null;
    const result = { status: response.status, headers: Object.fromEntries(response.headers.entries()), data: data };

    if(!response.ok) throw new Error(JSON.stringify(result));

    return result;
};