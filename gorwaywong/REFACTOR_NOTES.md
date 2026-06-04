# 博客化重构笔记

本文档记录当前静态博客架构，替代旧的简历页重构说明。

## 架构目标

- GitHub Pages 纯静态部署。
- 源码和部署产物继续分支隔离：`new-project` 保存源码，`gh-pages` 保存构建产物。
- 博文统一放在仓库根目录 `posts/`，构建时自动生成文章列表、标签页和归档页。
- 页面风格采用低饱和早期网页复古风，并支持日夜模式和移动端布局。

## 内容流

```text
posts/*.md
  -> Vite import.meta.glob
  -> src/posts.js 解析 frontmatter 和正文
  -> Pinia blogStore
  -> 首页 / 文章页 / 标签页 / 归档页
```

## 博文约定

```md
---
title: 文章标题
date: 2026-06-04
tags: Vue, Blog
excerpt: 一句话摘要
cover: /covers/demo.jpg
draft: false
---
```

- `slug` 由文件名生成。
- `draft: true` 不发布。
- 缺失 `title` 时使用正文第一个 H1 或文件名。
- 缺失 `excerpt` 时从正文提取摘要。

## 主要模块

- `src/posts.js`：读取并解析 Markdown。
- `src/stores/blogStore.js`：提供文章、标签、最新文章和归档数据。
- `src/router/index.js`：使用 Hash 路由适配 GitHub Pages。
- `src/components/blog/`：站点头部、侧栏、文章卡片、空状态等 UI 组件。
- `src/styles/blog.css`：复古窗口风格、主题变量和响应式布局。

## 验证

使用以下命令验证静态构建：

```bash
cd gorwaywong
npm.cmd run build
```
