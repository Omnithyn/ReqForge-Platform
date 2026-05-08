# Docker 构建、测试与更新指南

> 所有操作使用 Docker，不需要本地安装数据库或 Python 环境。

## 一、初始构建

```bash
cd /Users/yaochunyang/tools/AIGC/agent/ReqForge-Platform

# 首次启动 (构建镜像 + 启动所有服务)
docker compose up -d --build

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f backend
```

## 二、日常开发

### 代码变更后重建

```bash
# 只重建 backend (最常用 — MCP/REST API 变更)
docker compose up -d --build backend
docker compose restart backend

# 只重建 frontend (前端变更)
docker compose up -d --build frontend

# 全量重建 (依赖变更)
docker compose up -d --build
```

### 快速热更新 (backend 代码，不改依赖)

```bash
# 复制变更的文件到运行中的容器 + 重启
docker cp backend/app/api/reqforge/__init__.py reqforge-platform-backend-1:/app/app/api/reqforge/__init__.py
docker restart reqforge-platform-backend-1

# 验证
sleep 8 && curl -s http://localhost:3008/api/v1/reqforge/status
```

### 数据库迁移

```bash
# 创建新迁移文件
# 编辑 backend/alembic/versions/xxx.py

# 应用迁移
docker compose restart backend  # Alembic 启动时自动执行 upgrade head

# 手动执行
docker exec reqforge-platform-backend-1 alembic upgrade head

# 回滚
docker exec reqforge-platform-backend-1 alembic downgrade -1
```

### 数据重置

```bash
# 完全重置 (删除所有数据)
docker compose down -v   # 删除 volumes
docker compose up -d      # 重建

# 只重置数据库 (保留容器)
docker compose stop backend postgres
docker volume rm reqforge-platform_pgdata
docker compose up -d postgres backend
```

## 三、测试验证

```bash
# 健康检查
curl -s http://localhost:3008/api/health | python3 -m json.tool

# ReqForge API 状态
curl -s http://localhost:3008/api/v1/reqforge/status | python3 -m json.tool

# 数据库验证
docker exec reqforge-platform-backend-1 alembic current

# MCP Server 文件验证
find mcp-servers/ -name "server.py" -exec echo "  {}" \;

# 查看 API 日志
docker compose logs -f --tail=50 backend
```

## 四、AGE 图数据库（可选）

```bash
# 启动 AGE (在 Clawith 基础上扩展)
docker compose -f docker-compose.yml -f docker-compose.reqforge.yml up -d --build

# 验证 AGE
docker exec reqforge-age psql -U clawith -d reqforge_ontology -c "SELECT * FROM ag_catalog.ag_graph;"
```

## 五、完整重置流程

```bash
# 1. 停止并清理
docker compose down -v

# 2. 确认无残留
docker ps -a | grep reqforge || echo "干净"

# 3. 重建
docker compose up -d --build

# 4. 等待启动
sleep 15

# 5. 验证
curl -s http://localhost:3008/api/health
curl -s http://localhost:3008/api/v1/reqforge/status
```
