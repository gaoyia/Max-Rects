const fs = require('fs').promises;
const path = require('path');

// 定义路径常量
const distDir = path.join(__dirname, '..', 'dist');
const docsDistDir = path.join(__dirname, '..', 'docs', 'dist');

let isCopying = false;
let copyPending = false;
let lastCopyTime = 0;

/**
 * 复制 dist 目录到 docs 目录
 * @param {string} reason - 复制原因（用于日志）
 */
async function copyDistToDocs(reason = '') {
  // 限制复制频率，避免在短时间内重复复制
  const now = Date.now();
  if (now - lastCopyTime < 1000) {
    // 如果距离上次复制不到1秒，标记有挂起的复制操作
    copyPending = true;
    return;
  }

  // 如果正在复制，则标记有挂起的复制操作
  if (isCopying) {
    copyPending = true;
    return;
  }

  isCopying = true;
  lastCopyTime = now;

  try {
    // 确保 dist 目录存在
    await fs.access(distDir);

    // 删除旧的 docs/dist 目录
    try {
      await fs.rm(docsDistDir, { recursive: true });
    } catch (err) {
      // 忽略删除错误
    }

    // 复制新的 dist 目录到 docs
    await fs.cp(distDir, docsDistDir, { recursive: true });
    console.log(`${new Date().toLocaleTimeString()} ${reason}成功复制 dist 到 docs`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`${new Date().toLocaleTimeString()} ${reason}复制 dist 到 docs 失败:`, err.message);
    }
  } finally {
    isCopying = false;

    // 如果有挂起的复制操作，执行它
    if (copyPending) {
      copyPending = false;
      // 延迟一小段时间再执行，避免过于频繁
      setTimeout(() => {
        copyDistToDocs(reason);
      }, 100);
    }
  }
}

module.exports = {
  distDir,
  docsDistDir,
  copyDistToDocs
};