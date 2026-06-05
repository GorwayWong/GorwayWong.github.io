---
title: Blog 重新开张
date: 2026-06-04
tags: Blog, Vue
excerpt: 这个站点已经从个人简历页重构成静态博客，文章来自仓库根目录的 posts 文件夹。
draft: false
---

# Blog 重新开张

这个站点已经从个人简历页重构成一个静态博客。以后新增文章时，只需要把 Markdown 文件放到仓库根目录的 `posts/` 文件夹，然后重新构建和部署。

当前博客的目标很简单：

- 用 GitHub Pages 托管静态页面。
- 用 Vue 和 Vite 保持轻量交互。
- 用 Markdown 保存文章内容。
- 保持源码分支和部署分支分离。

## 写文章的格式

每篇文章建议在文件顶部加入 frontmatter：

```md
---
title: 文章标题
date: 2026-06-04
tags: Blog, Vue
excerpt: 一句话摘要
draft: false
---
```

这样首页、归档、标签和文章页都能稳定展示标题、发布时间、标签和摘要。