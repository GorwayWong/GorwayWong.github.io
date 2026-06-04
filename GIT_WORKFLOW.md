# Git 工作流指南

## 分支职责

| 分支 | 用途 |
| --- | --- |
| `new-project` | 源码分支，保存 Vue/Vite 源码、文档和 `posts/` Markdown 文章 |
| `gh-pages` | 部署分支，只保存 `dist/` 构建后的静态文件 |
| `main` | 保留为主分支镜像或稳定分支，不直接放部署产物 |

## 日常开发

```bash
git checkout new-project
git pull origin new-project

cd gorwaywong
npm install
npm.cmd run dev
```

新增文章时，把 `.md` 文件放到仓库根目录 `posts/`。文章必须使用 frontmatter：

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

## 构建源码分支

```bash
git checkout new-project
cd gorwaywong
npm.cmd run build
```

构建产物位于 `gorwaywong/dist/`。

## 发布到 gh-pages

建议在 Git Bash 中执行：

```bash
git checkout new-project
cd gorwaywong
npm install
npm run build
cd ..

git checkout gh-pages
git pull origin gh-pages

git rm -rf .
cp -r ./gorwaywong/dist/* .
touch .nojekyll

git add .
git commit -m "Deploy $(date +'%Y-%m-%d')"
git push origin gh-pages

git checkout new-project
```

## 检查清单

- 开发前先 `git pull origin new-project`
- 新文章放在根目录 `posts/`
- 构建前确认 `draft: true` 的文章不会发布
- 源码提交到 `new-project`
- 静态产物提交到 `gh-pages`
