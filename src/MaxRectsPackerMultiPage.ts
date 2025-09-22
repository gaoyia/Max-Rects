import { Job, Rect } from './index';
import { MaxRectsPacker } from './MaxRectsPacker';

export class MaxRectsPackerMultiPage {
  pageW: number;
  pageH: number;
  queue: Job[] = [];
  gap: number;
  pages: MaxRectsPacker[] = [];  // 存储每个页的打包实例

  constructor(pageW: number, pageH: number, gap = 0) {
    this.pageW = pageW;
    this.pageH = pageH;
    this.gap = gap;
    this.pages.push(new MaxRectsPacker(pageW, pageH, gap));  // 创建第一个页面
  }

  add(w: number, h: number, data?: any): void {
    if (w <= 0 || h <= 0) throw new Error('Invalid rectangle size');
    this.queue.push({ w, h, data });
  }

  pack(): { pages: MaxRectsPacker[], unpacked: Job[] }{
    const unpacked: Job[] = [];  // 用于保存未放置的矩形项
    // 循环队列,直到队列为空
    while (this.queue.length > 0) {
      const item = this.queue.shift() as Job;

      let placed = false;

      // 遍历所有页面
      for (const page of this.pages) {
        page.add(item.w, item.h, item.data);
        const result = page.pack();
        const unpackedItem = result.unpacked.pop();
        if (!unpackedItem) {
          // 找到合适的页面
          placed = true;
          break;
        } else {
          // 未找到合适的页面, 删除unpacked中的项
          result.unpacked.length = 0;
        }
      }

      // 如果没有合适的页面, 创建新的页面
      if (!placed) {
        const page = new MaxRectsPacker(this.pageW, this.pageH, this.gap);
        // 添加当前元素到新页面
        page.add(item.w, item.h, item.data);
        const result = page.pack();
        if (result.unpacked.length > 0) {
          // 如果新页面无法放置当前元素, 则添加到unpacked,无需保存页面继续循环
          unpacked.push(...result.unpacked);
          continue;
        }
        this.pages.push(page);
      }
    }
    return { pages: this.pages, unpacked };
  }
}
