<!-- LOGO -->
<h1>
<p align="center">
  <img src="/public/icon.webp" alt="Logo" width="128">
  <br> Echolet Music
</h1>
  <p align="center">
    <strong>第三方网易云音乐客户端</strong>
    <br />
    ·
    <a href="https://music.tsukiyo.cn">访问demo</a>
    ·
  </p>
    <img src="/public/docs/img.png" alt="Screenshot">
    <img src="/public/docs/img_1.png" alt="Screenshot">
</p>

## 部署

这里介绍示例网站的部署方法。

### api部署

使用NeteaseCloudApi

由于目前NeteaseCloudApi已停止维护，无法获取源代码，这里采用docker仍然存在的镜像进行部署。

1、拉取镜像

``` bash
docker pull binaryify/netease_cloud_music_api
```

2、启动容器

``` bash
docker run -d -p your_port:3000 binaryify/netease_cloud_music_api
```

### 使用UnblockNeteaseMusic

UnblockNeteaseMusic是一款基于Chromium内核的网易云音乐解锁客户端，可绕过网易云音乐的防盗链限制。

使用方法：

1、下载并安装[UnblockNeteaseMusic](https://github.com/nondanee/UnblockNeteaseMusic/releases)

2、启动UnblockNeteaseMusic,保存代理地址

### 本体部署

使用vercel

1、fork本项目，通过vercel导入进行部署。

2、在vercel项目设置中，添加环境变量，分别为：

- VITE_API_URL：NeteaseCloudApi的url
- VITE_API_PROXY: UnblockNeteaseMusic的url,可选，若不设置则不使用UnblockNeteaseMusic

[![Powered by Vercel](https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg)](https://vercel.com/?utm_source=ohmusic&utm_campaign=oss)

## 本地运行

``` bash

# 克隆项目
git clone https://github.com/tsukiyo/echolet-music.git

# 安装依赖
cd echolet-music
pnpm install

# 配置环境变量，编辑.env.development文件 修改运行的api地址对应api服务对应的地址

# 启动NeteaseCloudApi
pnpm run netease_api:run

# 启动项目
pnpm run dev

# UnblockNeteaseMusic同上
```

## TODO

## 创意来源

- [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
- [Spotify](https://www.spotify.com)
- [YesPlayMusic](https://github.com/qier222/YesPlayMusic)
- [SoundCloud](https://soundcloud.com)


