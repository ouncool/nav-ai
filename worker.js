import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API: 读取数据
    if (url.pathname === "/api/data" && request.method === "GET") {
      const data = await env.MY_KV.get("nav_data");
      return new Response(data || "[]", {
        headers: { "Content-Type": "application/json" }
      });
    }

    // API: 保存数据
    if (url.pathname === "/api/save" && request.method === "POST") {
      const auth = request.headers.get("Authorization");
      if (auth !== "Bearer mypassword") { // 🔑 修改成你自己的密码
        return new Response("Unauthorized", { status: 401 });
      }
      const body = await request.text();
      await env.MY_KV.put("nav_data", body);
      return new Response("Saved");
    }

    // 静态文件（HTML/JS/CSS）
    try {
      return await getAssetFromKV({ request, waitUntil: ctx.waitUntil }, { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST });
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  }
};
