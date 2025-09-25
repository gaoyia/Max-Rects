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

### 单页装箱

```typescript
import { MaxRectsPacker } from 'max-rects'
const gap = 0; // 间距
const packer = new MaxRectsPacker(100, 50, gap); // 小容器
packer.add(30, 60); // 需要旋转才能放入容器
const result = packer.pack();

// result 
{
    "packed": [
        { "x": 0, "y": 0, "w": 60, "h": 30, "rot": true }
    ],
    "unpacked": []
}
// packer
{
    "queue": [],
    "bins": [
        { "x": 0, "y": 0, "w": 60, "h": 30, "rot": true }
    ],
    "free": [{ "x": 0, "y": 30, "w": 100, "h": 20 }, { "x": 60, "y": 0, "w": 40, "h": 30 }],
    "pageW": 100,
    "pageH": 50,
    "gap": 0
}
```

### 多页装箱

```typescript
import { MaxRectsPackerMultiPage } from 'max-rects'

const multiPacker = new MaxRectsPackerMultiPage(100, 100)
for (let i = 0; i < 10; i++) {
    multiPacker.add(30, 30, i);
}
const { pages, unpacked } = multiPacker.pack()

// 这里的pages 返回的是this.bins的数组

// 第一页9个, 第二页1个
{
  "queue": [],
  "pages": [
    {
      "queue": [],
      "bins": [
        { "x": 0, "y": 0, "w": 30, "h": 30, "rot": false, "data": 0 },
        { "x": 30, "y": 0, "w": 30, "h": 30, "rot": false, "data": 1 },
        { "x": 60, "y": 0, "w": 30, "h": 30, "rot": false, "data": 2 },
        { "x": 0, "y": 30, "w": 30, "h": 30, "rot": false, "data": 3 },
        { "x": 30, "y": 30, "w": 30, "h": 30, "rot": false, "data": 4 },
        { "x": 60, "y": 30, "w": 30, "h": 30, "rot": false, "data": 5 },
        { "x": 0, "y": 60, "w": 30, "h": 30, "rot": false, "data": 6 },
        { "x": 30, "y": 60, "w": 30, "h": 30, "rot": false, "data": 7 },
        { "x": 60, "y": 60, "w": 30, "h": 30, "rot": false, "data": 8 }
      ],
      "free": [
        { "x": 0, "y": 90, "w": 100, "h": 10 },
        { "x": 90, "y": 60, "w": 10, "h": 30 }
      ],
      "pageW": 100,
      "pageH": 100,
      "gap": 0
    },
    {
      "queue": [],
      "bins": [
        { "x": 0, "y": 0, "w": 30, "h": 30, "rot": false, "data": 9 }
      ],
      "free": [
        { "x": 0, "y": 30, "w": 100, "h": 70 },
        { "x": 30, "y": 0, "w": 70, "h": 30 }
      ],
      "pageW": 100,
      "pageH": 100,
      "gap": 0
    }
  ],
  "pageW": 100,
  "pageH": 100,
  "gap": 0
}

```

## 在线演示

您可以访问我们的[在线演示页面](https://gaoyia.github.io/max-rects/)查看和测试算法效果。

## API文档

### MaxRectsPacker

```typescript
class MaxRectsPacker {
  /**
   * @param pageW 页面宽度
   * @param pageH 页面高度 
   * @param gap 矩形间距(默认0)
   */
  constructor(pageW: number, pageH: number, gap = 0)

  /**
   * 添加矩形
   * @param w 宽度
   * @param h 高度
   * @param data 关联数据(可选)
   */
  add(w: number, h: number, data?: any): void

  /**
   * 执行装箱
   * @param BSSF 是否使用最佳短边优先策略(默认true)
   * @returns { packed: Rect[], unpacked: Job[] } 装箱结果
   */
  pack(BSSF = true): { packed: Rect[], unpacked: Job[] }

  /** 重置装箱器状态 */
  reset(): void
}
```

### MaxRectsPackerMultiPage

```typescript
class MaxRectsPackerMultiPage {
  /**
   * @param pageW 页面宽度
   * @param pageH 页面高度 
   * @param gap 矩形间距(默认0)
   */
  constructor(pageW: number, pageH: number, gap = 0)

  /**
   * 添加矩形
   * @param w 宽度
   * @param h 高度
   * @param data 关联数据(可选)
   */
  add(w: number, h: number, data?: any): void

  /**
   * 执行多页装箱
   * @returns { pages: MaxRectsPacker[], unpacked: Job[] } 装箱结果
   */
  pack(): { pages: MaxRectsPacker[], unpacked: Job[] }
}
```

## 开发

```bash
pnpm dev        # 开发模式，监听源文件变化并重新构建
pnpm build:docs # 构建项目并将产物复制到 docs 目录
pnpm build      # 生产构建
pnpm test       # 运行测试
pnpm test:watch # 监听模式运行测试
pnpm test:coverage # 生成测试覆盖率报告
```

使用 `pnpm dev` 启动开发模式后，可以通过访问 http://localhost:5000 查看演示页面。

## 支持项目

如果您觉得这个项目对您有帮助，欢迎通过以下方式支持我们：

![捐赠二维码](docs/donate.jpg)

您的支持是我们持续改进和维护项目的动力！

## 许可证

MIT