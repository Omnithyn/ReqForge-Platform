#!/usr/bin/env bash
# sync-upstream.sh — ReqForge-Platform 上游同步脚本
# 策略: main 追踪 upstream，feat/reqforge-platform rebase main

set -euo pipefail

PUSH=false
if [[ "${1:-}" == "--push" ]]; then PUSH=true; fi

echo "=== ReqForge-Platform 上游同步 ==="

CURRENT=$(git branch --show-current)
if [[ "$CURRENT" != "main" ]] && [[ "$CURRENT" != "feat/reqforge-platform" ]]; then
    echo "⚠️  当前分支: $CURRENT，建议切到 main 或 feat/reqforge-platform"
    exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "❌ 有未提交改动，请先 commit 或 stash"
    exit 1
fi

git fetch upstream main
UPSTREAM=$(git rev-parse upstream/main)
LOCAL=$(git rev-parse main)

if [[ "$UPSTREAM" != "$LOCAL" ]]; then
    echo "🔄 合并上游..."
    git checkout main
    git merge upstream/main -m "chore: sync upstream $(git rev-parse --short upstream/main)"
    if $PUSH; then git push origin main; fi
else
    echo "✅ main 已是最新"
fi

git checkout feat/reqforge-platform
MERGE_BASE=$(git merge-base main feat/reqforge-platform)
if [[ "$MERGE_BASE" != "$(git rev-parse main)" ]]; then
    echo "🔧 rebase..."
    if git rebase main; then
        if $PUSH; then git push --force-with-lease origin feat/reqforge-platform; fi
    else
        echo "❌ rebase 冲突！git rebase --abort 或手动解决"
        exit 1
    fi
else
    echo "✅ feat/reqforge-platform 已基于最新 main"
fi

echo "=== 同步完成 ==="
git log --oneline --graph --all -6
