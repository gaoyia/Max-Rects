# max-rects

基于MaxRects算法的矩形装箱库，支持多页布局和旋转矩形。

## 功能特性

- 📦 高效的矩形装箱算法实现
- 🔄 支持矩形旋转优化
- 📑 多页布局支持
- 🏷️ 支持自定义数据绑定
- 📐 可配置间距和边界

## 安装

```bash
pnpm add max-rects
# 或
npm install max-rects
# 或
yarn add max-rects
```

## 使用示例

```typescript
import { MaxRectsPacker } from 'max-rects';

const packer = new MaxRectsPacker(1024, 1024, 2);

// 添加矩形
packer.add(100, 50, { id: 1 });
packer.add(200, 150, { id: 2 });

// 执行打包
const result = packer.pack();
console.log(result);
```

## API文档

### MaxRectsPacker
- `constructor(width: number, height: number, gap = 0)`
- `add(width: number, height: number, data?: any): void`
- `pack(allowRotate = false): Rect[]`

### MaxRectsPackerMultiPage
- `constructor(pageWidth: number, pageHeight: number, gap = 0)`
- `add(width: number, height: number, data?: any): void`
- `pack(): Rect[][]`

## 开发

```bash
pnpm dev  # 开发模式
pnpm build  # 生产构建
pnpm test  # 运行测试
pnpm test:watch  # 监听模式运行测试
pnpm test:coverage  # 生成测试覆盖率报告
```

## 许可证

MIT