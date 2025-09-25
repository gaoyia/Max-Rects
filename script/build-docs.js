const { spawn } = require('child_process');
const path = require('path');
const { copyDistToDocs } = require('./utils');

console.log('开始构建项目并复制到 docs 目录...');

// 启动 tsup 构建进程
const tsup = spawn('npx', ['tsup', 'src/index.ts', '--dts', '--format', 'esm,cjs'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

console.log('tsup 构建进程已启动');

// 监听 tsup 构建完成
tsup.on('close', (code) => {
  if (code === 0) {
    console.log('tsup 构建成功');
    // 构建成功后复制到 docs 目录
    copyDistToDocs('[构建] ')
      .then(() => {
        console.log('文档目录更新完成');
        process.exit(0);
      })
      .catch((err) => {
        console.error('复制到 docs 目录失败:', err);
        process.exit(1);
      });
  } else {
    console.error(`tsup 构建失败，退出码: ${code}`);
    process.exit(code);
  }
});

// 监听 tsup 进程错误
tsup.on('error', (err) => {
  console.error('启动 tsup 进程时出错:', err);
  process.exit(1);
});