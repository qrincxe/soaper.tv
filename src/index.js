import { Hono } from 'hono';
import { Soaper, headers } from './main.js';

const app = new Hono();

// Middleware to add CORS headers
app.use('*', async (c, next) => {
    c.header('Access-Control-Allow-Origin', '*');
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (c.req.method === 'OPTIONS') {
        return c.text('', 204);
    }
    await next();
});

app.get('/fetch/:id/:ss?/:ep?', async (c) => {
    // i want here app url 
    const fullUrl = c.req.url;
    let originUrl = new URL(fullUrl).origin
    const { id, ss, ep } = c.req.param();
    const sr = c.req.query('sr'); // Correct way to get query parameter in Hono
    const s = new Soaper(parseInt(id), ss ? parseInt(ss) : null, ep ? parseInt(ep) : null, sr ? parseInt(sr) : 0,`${originUrl}/proxy`);
    const res = await s.main();
    return c.json(res);
});




// here goes proxy 
app.get('/proxy/:url', async (c) => {
    const { url } = c.req.param();

    try {
        const res = await fetch(url, { headers });
        const contentType = res.headers.get('Content-Type');
        const data = await res.arrayBuffer();

        return c.body(data, 200, {
            'Content-Type': contentType,
            'Content-Length': data.byteLength.toString(),
        });
    } catch (error) {
        return c.json({ error: 'Failed to fetch the URL.' }, 500);
    }
});


export default app;
