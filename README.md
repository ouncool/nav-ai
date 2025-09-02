# nav-ai


明白，我帮你把整个项目核心要点梳理成一份清单，方便直接交给其他 AI 或开发者快速接手：

---

## 项目目标

实现一个 **Excel 风格导航页**，功能完整，包括搜索、排序、单元格编辑和数据保存。

* 前端 HTML/JS/CSS 托管在 **Cloudflare Worker**
* 数据存储在 **Cloudflare KV**
* 支持 **硬编码密码保护保存操作**

---

## 技术栈

* **前端**：HTML + CSS + JS

  * 搜索、过滤、排序
  * 单元格可编辑 (`contenteditable`)
  * 保存按钮触发 API 写入 KV
* **后端/Worker**：Cloudflare Worker

  * API `/api/data` → GET 导航数据
  * API `/api/save` → POST 修改数据（带密码验证）
  * 静态资源返回（HTML/JS/CSS）
* **存储**：Cloudflare KV（键名 `nav_data`）

---

## 核心功能

1. **表格展示**

   * 列名固定：`名称`、`简介`、`内网地址`、`外网地址`、`备注`
   * 样式类似 Excel：边框、交替行背景、悬停高亮

2. **交互操作**

   * 搜索 / 过滤
   * 点击表头排序
   * 单元格编辑

3. **数据保存**

   * POST 到 `/api/save`
   * 验证硬编码密码
   * 写入 KV，实现持久化

4. **前端静态资源**

   * `index.html` → 表格 + 搜索框 + 按钮
   * `main.js` → 交互逻辑（搜索、排序、编辑、保存）
   * `style.css` → 表格样式

---

## 部署结构

```
project-root/
 ├─ worker.js          # Worker 主逻辑，处理 API + 静态文件
 ├─ wrangler.toml      # Worker 配置，KV 绑定 + site bucket
 └─ public/            # 前端资源
     ├─ index.html
     ├─ main.js
     └─ style.css
```

---

## 部署步骤

1. 安装 Wrangler CLI

   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. 创建 KV 命名空间

   ```bash
   wrangler kv:namespace create "MY_KV"
   ```

   * 拿到 `id` 填入 `wrangler.toml`

3. 安装依赖

   ```bash
   npm install @cloudflare/kv-asset-handler
   ```

4. 部署 Worker

   ```bash
   wrangler deploy
   ```

5. 访问 URL 查看导航页，使用密码保存数据

---

## 安全与注意点

* **硬编码密码**在 Worker 里，保存数据前验证
* KV 数据可以随时覆盖
* 所有前端逻辑完全静态，可直接用 Worker 返回

---
