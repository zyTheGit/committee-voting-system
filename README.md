# 通用投票系统

这是一个支持小区业委会成员或志愿者等的通用投票系统，支持B端和C端操作。

## 功能特点

- B端管理系统：支持登录、角色权限菜单控制、投票活动管理等
- C端用户系统：支持身份证验证、参与投票等
- 灵活的投票规则配置
- 完善的数据统计分析

## 技术栈

- 前端：Vue3 + Vite + Pinia + Vue Router
- B端UI：Naive UI
- C端UI：Vant
- 后端：NestJS
- 数据库：PostgreSQL
- 部署：Docker Compose

## 开发环境搭建

### 前提条件

- Node.js 16+
- pnpm
- Docker & Docker Compose

### 安装依赖

```bash
# 安装项目依赖
pnpm install

# 安装前端依赖
cd frontend/admin
pnpm install
cd ../client
pnpm install

# 安装后端依赖
cd ../../backend
pnpm install