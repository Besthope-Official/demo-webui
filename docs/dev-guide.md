# Developer setup

本文档面向团队中使用 JavaScript 的开发者，描述如何在本项目（基于 Vue CLI 创建）上快速搭建本地开发环境、统一代码规范、运行测试和提交代码。

## 目标

- 在本地能一键安装开发依赖并运行项目。
- 在 commit 阶段执行 lint/format，保证提交质量。
- 提供统一的 scripts、工具配置与常见问题解决办法。

## 必装工具

- Node.js（建议 LTS，>=14）；使用 nvm 管理版本。
- yarn
- 推荐编辑器：VS Code

## 代码规范与工具清单

- ESLint
- Prettier（格式化）
- Husky（git hooks） + lint-staged（针对变更文件运行 lint/format）
- axios（统一 HTTP 客户端）
- Vuex（保持现有项目约定）
- 不考虑 unit tests

## 快速开始

1. 克隆仓库并进入项目目录
2. 安装依赖：
```bash
yarn install
```

3. 初始化 husky（第一次或 CI 环境）
```bash
yarn prepare
```

4. 本地运行开发服务：
```bash
yarn serve
```

5. 本地运行 lint：
```bash
yarn lint
```

## 开发工作流

docs/dev 下对页面开发需要的内容进行了拆解.

- **组件化拆分**: 仔细审视原型，识别出可以重复使用的UI元素，比如按钮、输入框、导航栏、卡片等。将它们设计成独立的Vue组件，这能极大地提高代码的复用性和可维护性。
- **页面与路由规划**: 根据原型，确定项目需要哪些页面（例如，主页、详情页、用户中心等），并规划好相应的路由结构。
- **状态管理**

我们鼓励你进行 AI 编程，但请确保每一次提交都经过人为的审阅与测试；我们推荐一个 trick：在你进行最小补丁改动后，ask Copilot 是否存在困惑的代码片段，结合 AI 的 Code Review 再进行修改。

## 常见问题（FAQ）

- Q: 我在 commit 时被阻止提交，报 lint 错误怎么办？
  - A: 在 commit 前运行 npm run lint 修复或手动修复错误后再 commit；若是格式化问题也可以运行 npm run format。
- Q: 我想跳过某次 commit 的 pre-commit 钩子，如何做？
  - A: 使用 git commit --no-verify（仅在非常确定时使用）。
- Q: 团队中有成员使用不同的 Node 版本，如何统一？
  - A: 在仓库根添加 .nvmrc 指定 Node 版本，团队成员使用 nvm 切换。
