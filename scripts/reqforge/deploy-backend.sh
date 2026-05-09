#!/usr/bin/env bash
# deploy-backend.sh — ReqForge 后端安全部署
# 解决 docker cp 热补丁无检查的问题
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CONTAINER="reqforge-platform-backend-1"

echo "=== 1. 语法检查 ==="
cd "$PROJECT_DIR"
FAILED=0
for f in $(find backend/app/api/reqforge -name "*.py" -not -path "*/reqforge/reqforge/*"); do
    if ! python3 -c "import ast; ast.parse(open('$f').read())" 2>/dev/null; then
        echo "  ❌ $f 语法错误"
        FAILED=1
    fi
done
if [ $FAILED -ne 0 ]; then
    echo "部署中止：语法错误"
    exit 1
fi
echo "  ✅ 全部通过"

echo "=== 2. 部署到容器 ==="
docker cp "$PROJECT_DIR/backend/app/api/reqforge" "$CONTAINER:/app/app/api/reqforge"
echo "  ✅ 已复制"

echo "=== 3. 重启后端 ==="
docker restart "$CONTAINER" > /dev/null
echo "  等待启动..."

echo "=== 4. 健康检查 ==="
for i in $(seq 1 15); do
    if curl -sf http://localhost:3008/api/health > /dev/null 2>&1; then
        echo "  ✅ 后端健康"
        break
    fi
    sleep 2
done

echo "=== 5. API 验证 ==="
if curl -sf http://localhost:3008/api/v1/reqforge/status > /dev/null 2>&1; then
    echo "  ✅ ReqForge API 正常"
else
    echo "  ❌ ReqForge API 异常 — 检查容器日志: docker logs $CONTAINER | tail -20"
    exit 1
fi

echo ""
echo "✅ 部署完成"
