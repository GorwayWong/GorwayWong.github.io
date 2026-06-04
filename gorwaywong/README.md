# GorwayWong Blog Frontend

Vue 3 + Vite 静态博客前端。文章内容来自仓库根目录 `posts/*.md`，通过 Vite `import.meta.glob` 在构建期生成文章索引。

## Project setup

```sh
npm install
```

## Development

```sh
npm run dev
```

PowerShell 执行策略如果阻止 `npm.ps1`，使用：

```sh
npm.cmd run dev
```

## Build

```sh
npm.cmd run build
```

生产构建会输出到 `dist/`，再由仓库工作流复制到 `gh-pages` 分支。
