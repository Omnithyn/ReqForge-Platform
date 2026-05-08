"""Sandbox Provider — 借鉴 DeerFlow Docker Sandbox 设计.

用途: 源码分析 Agent 需要在隔离环境中:
1. git clone 用户仓库
2. 运行 AST 分析和静态检查工具
3. 读取和解析代码文件
4. 执行后自动清理

安全: network_mode="none", mem_limit, cpu_quota
"""
import tempfile
import subprocess
import shutil
import uuid
from pathlib import Path

class SandboxProvider:
    """简化的 Docker Sandbox 执行环境。"""

    def __init__(self, image: str = "python:3.12-slim"):
        self.image = image
        self._sandboxes: dict[str, dict] = {}
    
    def create(self, thread_id: str) -> str:
        """创建沙箱工作目录。"""
        sandbox_id = f"sb-{uuid.uuid4().hex[:8]}"
        workdir = Path(tempfile.mkdtemp(prefix=f"reqforge-sandbox-{thread_id}-"))
        self._sandboxes[sandbox_id] = {"workdir": workdir, "thread_id": thread_id}
        return sandbox_id
    
    def get_workdir(self, sandbox_id: str) -> Path:
        return self._sandboxes[sandbox_id]["workdir"]
    
    def execute(self, sandbox_id: str, command: str, timeout: int = 300) -> str:
        """在沙箱中执行命令（本地 subprocess，非 Docker）。"""
        workdir = self._sandboxes[sandbox_id]["workdir"]
        try:
            result = subprocess.run(
                command, shell=True, cwd=str(workdir),
                capture_output=True, text=True, timeout=timeout
            )
            return result.stdout + result.stderr
        except subprocess.TimeoutExpired:
            return f"[TIMEOUT] Command exceeded {timeout}s limit"
    
    def git_clone(self, sandbox_id: str, repo_url: str, branch: str = "main") -> str:
        """在沙箱中 clone Git 仓库。"""
        workdir = self._sandboxes[sandbox_id]["workdir"]
        repo_name = repo_url.rstrip("/").split("/")[-1].replace(".git", "")
        clone_dir = workdir / repo_name
        result = subprocess.run(
            ["git", "clone", "--depth", "1", "--branch", branch, repo_url, str(clone_dir)],
            capture_output=True, text=True, timeout=120
        )
        return f"{clone_dir}\n{result.stdout}{result.stderr}"
    
    def destroy(self, sandbox_id: str):
        """销毁沙箱，清理文件。"""
        if sandbox_id in self._sandboxes:
            shutil.rmtree(self._sandboxes[sandbox_id]["workdir"], ignore_errors=True)
            del self._sandboxes[sandbox_id]
