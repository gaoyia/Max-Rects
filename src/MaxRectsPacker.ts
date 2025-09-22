import { FreeRect, Job, Rect } from ".";

export class MaxRectsPacker {
  pageW: number;
  pageH: number;
  gap: number;
  queue: Job[] = [];
  bins: Rect[] = [];
  free: FreeRect[] = [];

  constructor(pageW: number, pageH: number, gap = 0) {
    this.pageW = pageW;
    this.pageH = pageH;
    this.gap = gap;
    this.reset();
  }

   reset(): void {
    this.queue = [];
    this.bins = [];
    this.free = [{ x: 0, y: 0, w: this.pageW, h: this.pageH }];
  }

  public add(w: number, h: number, data?: any): void {
    if (w <= 0 || h <= 0) throw new Error('Invalid rectangle size');
    this.queue.push({ w, h, data });
  }

  public pack(BSSF = true): { packed: Rect[], unpacked: Job[] } {
    this.queue.sort((a, b) => b.w * b.h - a.w * a.h);
    const unpacked: Job[] = [];  // 用于保存未放置的矩形项

    for (const item of this.queue) {
      let best: Rect | null = null;
      let bestScore = BSSF ? Infinity : -1;
      let bestIndex = -1;

      // 查找最佳合适位置
      this.free.forEach((r, i) => {
        // 不旋转
        if (r.w >= item.w && r.h >= item.h) {
          const score = BSSF
            ? Math.min(r.w - item.w, r.h - item.h)
            : (r.w - item.w) * (r.h - item.h);
          if (BSSF ? score < bestScore : score > bestScore) {
            bestScore = score;
            best = { x: r.x, y: r.y, w: item.w, h: item.h, rot: false, data: item.data };
            bestIndex = i;
          }
        }
        // 旋转
        if (r.w >= item.h && r.h >= item.w) {
          const score = BSSF
            ? Math.min(r.w - item.h, r.h - item.w)
            : (r.w - item.h) * (r.h - item.w);
          if (BSSF ? score < bestScore : score > bestScore) {
            bestScore = score;
            best = { x: r.x, y: r.y, w: item.h, h: item.w, rot: true, data: item.data };
            bestIndex = i;
          }
        }
      });

      if (!best || bestIndex === -1) {
        unpacked.push(item);  // 保存未能放置的矩形项
        continue;  // 跳过当前矩形项
      }

      this.bins.push(best);
      this.splitAndMerge(bestIndex, best);
    }
    // 清空队列
    this.queue.length = 0;
    return { packed: this.bins, unpacked: unpacked};  // 返回打包后的矩形和未放置的矩形
  }

/* 1. 先删后拆：保证被占用的那块不再留在 free 里 */
splitAndMerge(freeIndex: number, used: Rect): void {
  const edges: FreeRect[] = [];
  this.free.forEach((r, i) => {
    if (i === freeIndex) {
      // 被占矩形直接丢弃，只把剩余空区加回来
      edges.push(...this.splitRect(r, used));
      return;
    }
    if (this.intersect(r, used)) {
      edges.push(...this.splitRect(r, used));
    } else {
      edges.push(r);
    }
  });
  this.free = this.merge(edges);
}

  intersect(a: FreeRect, b: Rect): boolean {
    return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
  }

  splitRect(r: FreeRect, used: Rect): FreeRect[] {
    const res: FreeRect[] = [];
    const g = this.gap;
    const ux = used.x - g;
    const uy = used.y - g;
    const uw = used.w + 2 * g;
    const uh = used.h + 2 * g;

    const top    = { x: r.x,                y: r.y,                 w: r.w, h: uy - r.y };
    const bottom = { x: r.x,                y: uy + uh,             w: r.w, h: r.y + r.h - (uy + uh) };
    const left   = { x: r.x,                y: Math.max(uy, r.y),   w: ux - r.x, h: Math.min(uh, r.y + r.h - uy) };
    const right  = { x: ux + uw,            y: Math.max(uy, r.y),   w: r.x + r.w - (ux + uw), h: Math.min(uh, r.y + r.h - uy) };

    [top, bottom, left, right].forEach(rect => {
      if (rect.w > 0 && rect.h > 0) res.push(rect);
    });
    return res;
  }

  merge(list: FreeRect[]): FreeRect[] {
    const cleaned: FreeRect[] = [];
    list.forEach(a => {
      // 使用包含的矩形来去除重复
      if (!cleaned.some(b => this.contains(b, a))) cleaned.push(a);
    });

    // 合并相邻的矩形
    const merged: FreeRect[] = [];
    cleaned.forEach((r, i) => {
      const mergedRect = merged.find(m => this.canMerge(m, r));
      if (mergedRect) {
        mergedRect.w = Math.max(mergedRect.x + mergedRect.w, r.x + r.w) - mergedRect.x;
        mergedRect.h = Math.max(mergedRect.y + mergedRect.h, r.y + r.h) - mergedRect.y;
      } else {
        merged.push({ ...r });
      }
    });

    return merged;
  }

  contains(a: FreeRect, b: FreeRect): boolean {
    return a.x <= b.x && a.y <= b.y && a.x + a.w >= b.x + b.w && a.y + a.h >= b.y + b.h;
  }

  canMerge(a: FreeRect, b: FreeRect): boolean {
    return (
      (a.x === b.x && a.y + a.h + this.gap >= b.y && a.w === b.w) ||
      (a.y === b.y && a.x + a.w + this.gap >= b.x && a.h === b.h)
    );
  }
}
