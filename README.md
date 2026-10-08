# zjutmc-website

浙江工业大学 ZJUTMC（多媒体 / 媒体工作室）官方网站 —— 基于 [Hugo](https://gohugo.io/) + [Blowfish](https://blowfish.page/) 主题构建的静态站点。

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

**站点还处于初始骨架阶段**：`baseURL` 尚未设置（`hugo.toml` 里仍是注释），`content/` 为空，因此现在构建出来只有主题的框架页。上线前至少要补齐：

1. `config/_default/hugo.toml` → 打开 `baseURL`，改成正式域名（末尾要带 `/`）。
2. `config/_default/languages.en.toml` → `title` 目前还是主题默认值 `Blowfish`，换成站点名称；补上 `[params.author]` 的名称、头像、简介和社交链接。
3. `config/_default/menus.en.toml` → 调整导航菜单。
4. `content/` → 放入首页与文章内容。

### 关于语言（`defaultContentLanguage`）

当前是单语言英文：

```toml
# config/_default/hugo.toml
defaultContentLanguage = "en"
```

- 该值是**顶层字符串**，必须与某个语言 key 对应 —— 在拆分配置模式下即 `config/_default/languages.<key>.toml` 的 `<key>`（符合 RFC 5646，如 `en`、`zh-cn`、`zh-tw`）。
- 改成中文为默认语言时，**两处必须同时改**：`defaultContentLanguage = "zh-cn"`，并新建 `config/_default/languages.zh-cn.toml`。只改前者会触发 `language "zh-cn" not defined in config`，站点标题、作者卡片、菜单会静默掉回默认值。
- 中英双语时，主题自带的就绪模板可直接对照：`themes/blowfish/exampleSite/config/_default/languages.zh-cn.toml` 与 `menus.zh-cn.toml`；内容按语言分目录（`content/zh-cn/`、`content/en/`）。
- 中文站点建议在 `hugo.toml` 里加上 `hasCJKLanguage = true`，否则字数统计与阅读时间会严重失真。

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
