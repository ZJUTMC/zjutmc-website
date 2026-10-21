# zjutmc-website

浙工大 MC 方块社（ZJUTMC）官方网站。我们是浙江工业大学的 Minecraft（我的世界）学生社团，网站基于 [Hugo](https://gohugo.io/) + [Blowfish](https://blowfish.page/) 主题构建。

> 仓库：<https://github.com/ZJUTMC/zjutmc-website> · 主题上游：<https://github.com/nunocoracao/blowfish>

## 技术栈

| 组件 | 版本 / 说明 |
| --- | --- |
| Hugo | **extended** 版，`0.164.0` ≤ 版本 ≤ `0.167.0` |
| Blowfish | `v3.9.0`，以 **git submodule** 形式挂在 `themes/blowfish` |
| 配置 | 纯 TOML，拆分为 `config/_default/*.toml` |
| 样式 | 主题自带编译好的 Tailwind CSS；不执行 `npm install` 也能正常构建 |

> ⚠️ **Hugo 版本区间是硬约束。** 主题在 `themes/blowfish/config.toml` 里声明了 `[module.hugoVersion] extended = true` / `min = "0.164.0"` / `max = "0.167.0"`，超出区间构建会报警告甚至失败。
> 必须装 **extended** 版本，否则页面样式会全丢。查看本机版本：`hugo version`（输出里要带 `+extended`）。

## 本地开发

### 1. 克隆（含主题子模块）

```shell
git clone --recurse-submodules https://github.com/ZJUTMC/zjutmc-website.git
cd zjutmc-website
```

已经克隆过、但 `themes/blowfish` 是空目录的话：

```shell
git submodule update --init --recursive
```

### 2. 启动本地预览

```shell
hugo server
```

默认地址 <http://localhost:1313/>，带热重载：改内容或配置会自动刷新浏览器。

在 VS Code 中打开项目，进入“运行和调试”，选择 `Hugo: Chrome` 或 `Hugo: Edge`，按 `F5`。配置会自动启动 Hugo 并打开浏览器，包含草稿预览。需要本机已安装 Hugo extended 和对应浏览器。停止浏览器调试后，Hugo 服务继续运行；结束预览时，在任务终端按 `Ctrl+C`，或执行“任务: 终止任务”。

生产构建（输出到 `public/`，该目录不进版本库）：

```shell
hugo --gc --minify
```

## 目录结构

```
zjutmc-website/
├── config/_default/          # 站点全部配置（Hugo 拆分配置模式）
│   ├── hugo.toml             #   核心设置：主题、baseURL、默认语言、taxonomies…
│   ├── params.toml           #   主题外观与行为：配色、首页布局、文章/列表页开关…
│   ├── languages.en.toml     #   语言级设置：站点标题、作者卡片、社交链接
│   ├── menus.en.toml         #   导航菜单
│   ├── markup.toml           #   Goldmark 渲染设置（unsafe = true 必须保留）
│   └── module.toml           #   Hugo Module 挂载（当前用 submodule，此文件为空）
├── content/                  # 站点内容（Markdown）
├── assets/                   # 需要 Hugo Pipes 处理的资源（自定义 CSS 等）
├── layouts/                  # 站点级模板覆盖，优先级高于主题同名文件
├── data/                     # 结构化数据（如 data/authors/*.json）
├── i18n/                     # 站点级翻译表覆盖
├── static/                   # 原样拷贝的文件（图片、favicon、robots 等）
├── archetypes/default.md     # `hugo new` 的内容模板
├── themes/blowfish/          # 主题（git submodule，不要直接改）
└── public/                   # 构建产物，已 gitignore
```

## 配置要点

站点使用中文配置和 Blowfish 原生 `landing` 主页，正式域名为 `https://zjutmc.top/`。

- `config/_default/languages.zh-cn.toml`：站点名称、简介、Logo 和作者信息。
- `config/_default/menus.zh-cn.toml`：中文导航、皮肤站和帮助文档入口。
- `config/_default/params.toml`：全站使用 `zjutmc` 蓝黄白灰配色、悬浮导航、共享背景和原生卡片；仅浅色，关闭深色切换入口。
- `assets/css/schemes/zjutmc.css`：通过 Blowfish 原生颜色变量定义蓝色主色、黄色辅助色和白灰中性色。
- `content/_index.md`：通过 `heroCaption`、`heroLead`、`heroImage`、`heroButtons` 配置首屏，站点扩展字段 `heroTitleImage` 展示社团 Title 图片，正文使用主题自带的 `feature-grid` 和 `feature` 短代码。
- `layouts/partials/home/landing.html`：在原生 landing 布局中增加 Title 图片，保留文本标题作为无障碍名称。
- `assets/css/custom.css`：放宽文章正文的固定宽度，使用站点现有响应式内容容器。
- `layouts/partials/extend-head.html` 和 `assets/js/light-only.js`：通过主题扩展入口，在页面显示前清除历史深色偏好并固定浅色。
- `layouts/partials/favicons.html`：使用社团 Logo 生成浏览器及手机图标和网站 manifest，资源 URL 带内容指纹；`static/favicon.ico` 提供传统格式。
- `i18n/zh-cn.yaml`：将原生“最近文章”区域改为“社团活动”。
- `assets/img/README.md`：图片分类及社团素材来源；图片按 `site/`、`home/`、`about/`、`activities/<文章名>/` 存放。

主页通过 `mainSections = ["activities"]` 和 `homepage.showRecent` 展示三篇活动，活动列表使用相同的主题卡片。添加活动时，可参考已有页面的 `featureimage`（相对于 `assets/` 的封面路径）、`summary` 和 `description`。设为 `draft = false` 后会纳入正式构建；有明确发布日期时可填写 `date`，历史活动无需补填未经核实的日期。活动列表按 `weight` 排序。

全站背景 `assets/img/site/background.svg` 使用蓝黄柔光与浅灰线条，通过主题原生 `backgroundCanvas` 启用。首页 `heroImage` 共用校园复刻文章的 `img/activities/campus/cover.webp`，响应式展示高度为 `clamp(640px, 56.25vw, 1080px)`，并延后图片底部及滚动渐隐，展示更多建筑画面。优先使用主题设置；站点仅对图片标题、头图展示范围、固定浅色和正文宽度作小范围扩展，不修改主题子模块。

### 关于语言（`defaultContentLanguage`）

当前是单语言简体中文：

```toml
# config/_default/hugo.toml
defaultContentLanguage = "zh-cn"
```

- 该值是**顶层字符串**，必须与某个语言 key 对应 —— 在拆分配置模式下即 `config/_default/languages.<key>.toml` 的 `<key>`（符合 RFC 5646，如 `en`、`zh-cn`、`zh-tw`）。
- 修改默认语言时，**两处必须同时改**：`defaultContentLanguage` 与对应的 `languages.<key>.toml`。当前已配置 `languages.zh-cn.toml` 和 `menus.zh-cn.toml`。
- 中英双语时，主题自带的就绪模板可直接对照：`themes/blowfish/exampleSite/config/_default/languages.zh-cn.toml` 与 `menus.zh-cn.toml`；内容按语言分目录（`content/zh-cn/`、`content/en/`）。
- 中文语言配置已启用 `hasCJKLanguage = true`，用于中文字数统计和阅读时间估算。

## 内容创作

```shell
hugo new content posts/my-first-post.md          # 单文件
hugo new content posts/my-first-post/index.md    # 页面包（正文里要引用图片时用这种）
```

新建内容使用 `archetypes/default.md` 模板，front matter 为 TOML（`+++`），默认 `draft = true`。要连草稿一起预览：

```shell
hugo server -D          # -D = --buildDrafts
```

生产构建则会跳过草稿（`hugo.toml` 里 `buildDrafts = false`），所以写完记得把 `draft` 改成 `false`（或删掉该行）。

Front matter 的全部可用字段见主题文档：<https://blowfish.page/docs/front-matter/>

## 主题维护

主题是 git submodule，**不要在 `themes/blowfish/` 内直接改代码**（升级会全部丢失）。需要改样式或模板时，统一放在站点级目录，Hugo 会优先使用站点文件：

- 模板覆盖 → `layouts/`（例如 `layouts/partials/...`、`layouts/_default/...`）
- 自定义 CSS → `assets/css/custom.css`（主题会自动加载）

升级主题：

```shell
git submodule update --remote --merge   # 拉到上游 main 最新
git add themes/blowfish && git commit -m "⬆️ chore: bump blowfish"
```

升级后请重新跑一次 `hugo --gc --minify` 确认没有构建错误。上游主题的 `config/_default/*.toml` 若有新增字段，对照 `themes/blowfish/exampleSite/config/_default/` 补齐。

> 只有在需要改主题源码并重编译 Tailwind 时才要 `cd themes/blowfish && npm install && npm run build`；日常写内容不需要 Node 环境。

## 部署

站点是纯静态产物，`hugo --gc --minify` 产出的 `public/` 目录可直接托管（GitHub Pages、Netlify、Vercel、Cloudflare Pages 等）。

各平台的构建参数、缓存与重定向配置参考主题文档：<https://blowfish.page/docs/hosting-deployment/>

## 文档索引

- Blowfish 配置：<https://blowfish.page/docs/configuration/>
- 首页布局（`params.toml` 的 `[homepage] layout`）：<https://blowfish.page/docs/homepage-layout/>
- Front matter 速查：<https://blowfish.page/docs/front-matter/>
- 短代码（40+）：<https://blowfish.page/docs/shortcodes/>
- 缩略图与特色图：<https://blowfish.page/docs/thumbnails/>
- Hugo 官方文档：<https://gohugo.io/documentation/>
