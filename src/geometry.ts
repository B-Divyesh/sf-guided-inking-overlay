export const ARTBOARD = { width: 1200, height: 800 } as const;

export type Point = { x: number; y: number };
export type Segment = { a: Point; b: Point };

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function lineThroughRect(origin: Point, angleDegrees: number, width = ARTBOARD.width, height = ARTBOARD.height): Segment {
  const angle = angleDegrees * Math.PI / 180;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const hits: Array<{ t: number; point: Point }> = [];
  const add = (t: number, x: number, y: number) => {
    if (x >= -0.01 && x <= width + 0.01 && y >= -0.01 && y <= height + 0.01) hits.push({ t, point: { x, y } });
  };
  if (Math.abs(dx) > 1e-8) {
    let t = -origin.x / dx; add(t, 0, origin.y + t * dy);
    t = (width - origin.x) / dx; add(t, width, origin.y + t * dy);
  }
  if (Math.abs(dy) > 1e-8) {
    let t = -origin.y / dy; add(t, origin.x + t * dx, 0);
    t = (height - origin.y) / dy; add(t, origin.x + t * dx, height);
  }
  hits.sort((left, right) => left.t - right.t);
  return { a: hits[0]?.point ?? origin, b: hits.at(-1)?.point ?? origin };
}

export function fanSegments(origin: Point, density: number, rotation: number, spread = 150): Segment[] {
  const count = Math.max(2, Math.round(density));
  return Array.from({ length: count }, (_, index) => {
    const progress = count === 1 ? 0.5 : index / (count - 1);
    return lineThroughRect(origin, rotation - spread / 2 + progress * spread);
  });
}

export function simplifyPoints(points: Point[], minimumDistance = 8): Point[] {
  if (points.length < 3) return [...points];
  const result = [points[0]!];
  for (let index = 1; index < points.length - 1; index += 1) {
    if (distance(result.at(-1)!, points[index]!) >= minimumDistance) result.push(points[index]!);
  }
  const last = points.at(-1)!;
  if (distance(result.at(-1)!, last) > 0) result.push(last);
  return result;
}

export function offsetPolyline(points: Point[], amount: number): Point[] {
  if (points.length < 2) return [...points];
  return points.map((point, index) => {
    const previous = points[Math.max(0, index - 1)]!;
    const next = points[Math.min(points.length - 1, index + 1)]!;
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.hypot(dx, dy) || 1;
    return { x: point.x - dy / length * amount, y: point.y + dx / length * amount };
  });
}

export function railOffsets(count: number, gap: number): number[] {
  const safeCount = Math.max(1, Math.round(count));
  const middle = (safeCount - 1) / 2;
  return Array.from({ length: safeCount }, (_, index) => (index - middle) * gap);
}

export function pointsToSvgPath(points: Point[]): string {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`;
  let path = `M ${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const point = points[index]!;
    const next = points[index + 1]!;
    path += ` Q ${point.x.toFixed(1)} ${point.y.toFixed(1)} ${((point.x + next.x) / 2).toFixed(1)} ${((point.y + next.y) / 2).toFixed(1)}`;
  }
  const last = points.at(-1)!;
  path += ` T ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return path;
}
