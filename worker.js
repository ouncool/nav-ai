export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 读取数据
    if (url.pathname === "/api/data" && request.method === "GET") {
      const data = await env.MY_KV.get("nav_data");
      return new Response(data || "[]", {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 保存数据
    if (url.pathname === "/api/save" && request.method === "POST") {
      const auth = request.headers.get("Authorization");
      if (auth !== "Bearer mypassword") { // 🔑 修改这里的密码
        return new Response("Unauthorized", { status: 401 });
      }
      const body = await request.text();
      await env.MY_KV.put("nav_data", body);
      return new Response("Saved");
    }

    return new Response("Not Found", { status: 404 });
  }
};
