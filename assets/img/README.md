# 社团网站图片分类与素材来源

图片均取自用户授权的本地社团素材库，经缩小和 WebP 压缩用于网站。原文件未修改。

素材根目录：`E:\Digital Media Technology\ZJUTMC\社团工作202609\2025社团历史文件`。

| 网站文件 | 素材库中的原文件（相对上述根目录） | 用途 |
| --- | --- | --- |
| `site/logo.png` | `社团文件/社团LOGO/ZJUT_MC_LOGO_小图标 .png` | 导航社团标志 |
| `site/icon.png` | `社团文件/社团LOGO/ZJUT_MC_LOGO_小图标 .png` | 浏览器 favicon 和手机图标的 512px 透明底原图 |
| `site/icon-touch.png` | 同上 | Apple 主屏幕图标的白底版本 |
| `home/title.webp` | `社团文件/社团LOGO/浙江工业大学MC方块社title.png` | 首页社团 Title；裁去透明留白并缩小，保留原字样和透明背景 |
| `activities/campus/cover.webp` | `MC图片/2025-10-16_15.59.49.png` | 主页板球馆头图、活动卡片、校园复刻活动 |
| `about/together.webp` | `MC图片/935014f427d721b5de698020616d2dca.png` | 社团介绍页玩家合影 |
| `activities/block-race/cover.webp` | `社团广告/方块竞速小游戏比赛/方块竞速无字预览图.png` | 方块竞速活动 |
| `activities/linux-workshop/cover.webp` | `社团文件/精品立项文件/Linux上的MC服务器精品课程/2026年5月-精品课程1/第一课图3.jpg` | 技术交流活动现场 |
| `activities/campus/poster.webp` | `社团广告/方块工大校园还原项目/方块工大朝晖线下勘测海报.png` | 校园复刻活动存档 |
| `activities/linux-workshop/poster.webp` | `社团广告/linux上的MC服务器精品课程/[sk改]宣传海报.png` | 课程宣传存档 |

表中网站文件路径相对于 `assets/img/`。公共背景为 `site/background.svg`；文章图片按 `activities/<文章名>/` 分类，首页与文章共用同一张板球馆截图。

网站图标通过 `layouts/partials/favicons.html` 自动生成 16px、32px、180px、192px 和 512px 版本，使用内容指纹 URL。`static/favicon.ico` 同步提供 16px、32px 和 48px 的传统图标格式。

活动海报属于历史素材，不代表当前报名通知。活动文案仅介绍素材可确认的主题，未添加未经核实的时间、人数或报名信息。
