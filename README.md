# GorwayWong Blog

这是一个部署在 GitHub Pages 上的纯静态个人博客。源码在 `new-project` 分支，部署产物在 `gh-pages` 分支。

## 写文章

文章放在仓库根目录的 `posts/` 文件夹中，文件名会作为文章 slug。

```md
---
title: 文章标题
date: 2026-06-04
tags: Vue, Blog
excerpt: 一句话摘要
cover: /covers/demo.jpg
draft: false
---

# 正文标题

正文内容...
```

`draft: true` 的文章不会出现在页面中。新增或修改文章后，需要重新构建并部署。

## 本地开发

```bash
cd gorwaywong
npm install
npm run dev
```

Windows PowerShell 如果拦截 `npm.ps1`，可以使用：

```bash
npm.cmd run dev
```

## 构建

```bash
cd gorwaywong
npm.cmd run build
```

构建产物输出到 `gorwaywong/dist/`，用于同步到 `gh-pages` 分支。
