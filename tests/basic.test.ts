import { MaxRectsPacker } from '../src/MaxRectsPacker';
import { MaxRectsPackerMultiPage } from '../src/MaxRectsPackerMultiPage';

describe('MaxRectsPacker', () => {

  // 应该包装矩形
  it('should pack rectangles', () => {
    const packer = new MaxRectsPacker(100, 100);
    packer.add(50, 50);
    packer.add(30, 30);

    const result = packer.pack();

    expect(result.packed.length).toBe(2);
    expect(result.packed[0].x).toBe(0);
    expect(result.packed[0].y).toBe(0);
  });

  // 需要旋转才能放入容器
  it('should handle rotated rectangles', () => {
    const packer = new MaxRectsPacker(100, 50); // 更小的容器
    packer.add(30, 60); // 需要旋转才能放入100x50容器
    const result = packer.pack(true);
    expect(result.packed[0].rot).toBe(true);
  });
});
// 重置打包器状态，清空队列
it('should reset the packer state', () => {
  const packer = new MaxRectsPacker(1024, 1024);
  packer.add(100, 100);
  packer.reset();
  expect(packer.queue.length).toBe(0);  // 应该已经清空
  expect(packer.bins.length).toBe(0);  // 应该已经清空
  expect(packer.free.length).toBe(1);  // 应该已经清空
  expect(packer.free[0].w).toBe(1024);  // 宽度应该为1024
  expect(packer.free[0].h).toBe(1024);  // 高度应该为1024
});
describe('MaxRectsPackerMultiPage', () => {
  // 是否应该在需要时创建多个页面
  it('should create multiple pages when needed', () => {
    const packer = new MaxRectsPackerMultiPage(100, 100);
    for (let i = 0; i < 10; i++) {
      packer.add(30, 30, i);
    }
    packer.add(100, 101, 'invalid');

    console.log(packer.queue);
    console.log(packer.queue.length);

    const result = packer.pack();

    console.log(result.pages[1]);


    expect(result.unpacked.length).toBe(1);
    expect(result.pages.length).toBe(2);
    expect(result.pages[1].bins.length).toBe(1);
  });
});
