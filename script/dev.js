const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { distDir, docsDistDir, copyDistToDocs } = require('./utils');

console.log('启动开发模式...');

// 启动本地服务器
const server = spawn('npx', ['serve', 'docs', '-l', '5000', '--no-port-switching'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

console.log('本地服务器已启动: http://localhost:5000');

// 启动 tsup watch 进程
const tsup = spawn('npx', ['tsup', 'src/index.ts', '--dts', '--watch', '--format', 'esm,cjs'], {
  cwd: path.join(__dirname, '..'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

console.log('tsup watch 进程已启动');

let startTime = Date.now();
let firstBuildDetected = false;

// 监听 tsup 的 stdout 来检测首次构建完成
if (tsup.stdout) {
  const firstBuildHandler = (data) => {
    const output = data.toString();
    // 检查是否是构建成功的消息
    if (!firstBuildDetected && (output.includes('Build success') || output.includes('⚡️'))) {
      firstBuildDetected = true;
      console.log(`${new Date().toLocaleTimeString()} 检测到 tsup 首次构建成功`);
      copyDistToDocs('[首次构建] ');

      // 移除首次构建监听器，之后使用常规监听器
      tsup.stdout.removeListener('data', firstBuildHandler);

      // 添加常规监听器
      tsup.stdout.on('data', (data) => {
        const output = data.toString();
        // 检查是否是构建成功的消息
        if ((output.includes('Build success') || output.includes('⚡️')) &&
            Date.now() - startTime > 5000) {
          console.log(`${new Date().toLocaleTimeString()} 检测到 tsup 构建成功`);
          copyDistToDocs('[构建更新] ');
          startTime = Date.now(); // 重置时间以避免重复触发
        }
      });
    }
  };

  tsup.stdout.on('data', firstBuildHandler);
}

// 使用 fs.watch 监听 dist 目录变化（但不在首次构建时触发）
let watchInitialized = false;
try {
  const watcher = fs.watch(distDir, { recursive: true }, (eventType, filename) => {
    // 忽略第一次触发的初始化事件
    if (!watchInitialized) {
      watchInitialized = true;
      return;
    }

    // 确保首次构建已完成才处理文件变化
    if (firstBuildDetected) {
      console.log(`${new Date().toLocaleTimeString()} 检测到 dist 目录变化: ${eventType} ${filename}`);
      copyDistToDocs('[文件监听] ');
    }
  });

  // 监听 watcher 错误
  watcher.on('error', (err) => {
    console.error('监听 dist 目录时出错:', err.message);
  });

  // 添加清理函数
  process.on('exit', () => {
    watcher.close();
  });
} catch (err) {
  console.error('无法监听 dist 目录:', err.message);
}

// 监听 tsup 进程退出
tsup.on('close', (code) => {
  console.log(`tsup 进程退出，退出码 ${code}`);
  server.kill();
  process.exit(code);
});

// 监听服务器进程退出
server.on('close', (code) => {
  console.log(`服务器进程退出，退出码 ${code}`);
});

// 处理中断信号
process.on('SIGINT', () => {
  console.log('收到中断信号，正在退出...');
  tsup.kill();
  server.kill();
  process.exit(0);
});

// 监听进程错误
tsup.on('error', (err) => {
  console.error('启动 tsup 进程时出错:', err);
  server.kill();
  process.exit(1);
});

server.on('error', (err) => {
  console.error('启动服务器进程时出错:', err);
  tsup.kill();
  process.exit(1);
});
