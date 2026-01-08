# Git 工作流指南

## 分支说明

| 分支 | 用途 |
|------|------|
| `main` | 源代码主分支，保存稳定版本 |
| `gh-pages` | 部署分支，存放构建后的静态文件 |
| `new-project` | 开发分支，用于新功能开发 |

## 避免冲突的核心原则

1. **开发前必须 pull** - 每次开始工作前，先拉取远程最新代码
2. **频繁提交** - 小步提交，避免大量改动堆积
3. **合并前先 pull** - 合并分支前，确保两个分支都是最新的
4. **不要在多个地方同时修改同一分支** - 如果在多台电脑工作，切换前务必 push

---

## 工作流程

### 1. 开始新功能开发

```bash
# 切换到 main 分支
git checkout main

# 拉取远程最新代码（重要！）
git pull origin main

# 创建并切换到新的开发分支
git checkout -b new-project

# 推送新分支到远程（建立追踪关系）
git push -u origin new-project
```

### 2. 日常开发流程

```bash
# 每次开始工作前，先拉取最新代码
git pull origin new-project

# 进入项目目录
cd gorwaywong/

# 安装依赖（首次或依赖变更时）
npm install

# 启动开发服务器
npm run dev

# ... 进行开发 ...

# 开发完成后，提交代码
git add .
git commit -m "描述你的改动"

# 推送到远程
git push origin new-project
```

### 3. 功能完成后：合并到 main 分支

```bash
# 确保 new-project 分支的改动已提交并推送
git add .
git commit -m "完成xxx功能"
git push origin new-project

# 切换到 main 分支
git checkout main

# 拉取 main 分支最新代码（重要！）
git pull origin main

# 合并开发分支
git merge new-project

# 如果有冲突：
# 1. 手动解决冲突文件
# 2. git add .
# 3. git commit -m "Merge new-project into main"

# 推送到远程
git push origin main
```

### 4. 部署到 gh-pages 分支

在 Git Bash 中执行：

```bash
# 确保在 new-project 或 main 分支
git checkout new-project  # 或 main

# 进入项目目录并构建
cd gorwaywong/
npm install
npm run build

# 切换到 gh-pages 分支
git checkout gh-pages

# 拉取远程最新代码（重要！）
git pull origin gh-pages

# 回到仓库根目录
cd ../

# 清除 git 跟踪的文件
git rm -rf .

# 复制构建产物到根目录
cp -r ./gorwaywong/dist/* .

# 添加 .nojekyll 文件（禁用 Jekyll）
touch .nojekyll

# 添加文件到 git
git add assets/ favicon.ico index.html .nojekyll

# 提交
git commit -m "Deploy $(date +'%Y-%m-%d')"

# 推送到远程
git push origin gh-pages

# 切换回开发分支
git checkout new-project
```

---

## 常见问题处理

### 忘记 pull 导致冲突

```bash
# 如果 push 被拒绝，先 pull
git pull origin <分支名>

# 解决冲突后
git add .
git commit -m "解决冲突"
git push origin <分支名>
```

### 查看当前状态

```bash
# 查看当前分支和状态
git status

# 查看所有分支
git branch -a

# 查看提交历史
git log --oneline -10
```

### 暂存当前改动（切换分支前）

```bash
# 暂存改动
git stash

# 切换分支做其他事情
git checkout other-branch

# 切换回来后恢复改动
git checkout original-branch
git stash pop
```

### 撤销未提交的改动

```bash
# 撤销单个文件的改动
git checkout -- <文件名>

# 撤销所有改动
git checkout -- .
```

---

## 完整工作流检查清单

- [ ] 开始工作前：`git pull origin <当前分支>`
- [ ] 提交前：`git status` 检查改动
- [ ] 合并前：两个分支都 `git pull` 最新代码
- [ ] 部署前：确保代码已合并到目标分支
- [ ] 推送后：检查远程仓库是否更新成功
