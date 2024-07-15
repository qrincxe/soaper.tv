import { Hono } from "hono";
import { Soaper, headers } from "./main.js";
import SRTParser from "srt-parser-2";

const app = new Hono();

// Middleware to add CORS headers
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (c.req.method === "OPTIONS") {
    return c.text("", 204);
  }
  await next();
});

const stringToArrayBuffer = (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
};

app.get("/fetch/:id/:ss?/:ep?", async (c) => {
  const fullUrl = c.req.url;
  let originUrl = new URL(fullUrl).origin;
  const { id, ss, ep } = c.req.param();
  const sr = c.req.query("sr");
  const s = new Soaper(
    parseInt(id),
    ss ? parseInt(ss) : null,
    ep ? parseInt(ep) : null,
    sr ? parseInt(sr) : 0,
    `${originUrl}/proxy`
  );
  const res = await s.main();
  return c.json(res);
});

// Proxy endpoint
app.get("/proxy/:url", async (c) => {
  const { url } = c.req.param();
  const rqu = new URL(url)
  const fullUrl = c.req.url;
  let originUrl = new URL(fullUrl).origin;

  try {
    const res = await fetch(url, { headers });
    const contentType = res.headers.get("Content-Type");

    let data;

    if (url.trim().endsWith(".m3u8")) {
      data = await res.text();
      const splited = data.split("\n");
      splited.forEach((line, index) => {
        let trimed = line.trim()
        if (trimed.startsWith("https://")) {
          splited[index] = `${originUrl}/proxy/` + encodeURIComponent(line);
        }
        else if(trimed.startsWith('/')){
          splited[index] = `${originUrl}/proxy/` +encodeURIComponent(rqu.origin + line)
        }
        else{
          let matchPattern = line.match(/"\/[\w/?=.]+"/)
          if(matchPattern){

            splited[index] = splited[index].replace(/"\/[\w/?=.]+"/,`"${originUrl}/proxy/${encodeURIComponent(rqu.origin+matchPattern[0].replace('"'),'')}"` )
          }
        }
      });

      data = splited.join("\n")//.replace(/URI="/,`URI="${originUrl}/proxy/${encodeURIComponent(rqu+)}`);
      
      data = stringToArrayBuffer(data);
    } else if (url.trim().endsWith(".srt")) {
      const buffer = await res.arrayBuffer();
      let uint8Array = new Uint8Array(buffer);
      let decodedString = new TextDecoder().decode(uint8Array);
      const parser = new SRTParser();
      let subtitles = parser.fromSrt(decodedString);

      // Modify subtitles if needed
      if (subtitles.length > 0) {
        subtitles[0].text = ``;
      }

      data = stringToArrayBuffer(parser.toSrt(subtitles));
    } else {
      data = await res.arrayBuffer();
    }

    return c.body(data, 200, {
      "Content-Type": contentType,
      "Content-Length": data.byteLength.toString(),
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch the URL. " + error }, 500);
  }
});

export default app;
