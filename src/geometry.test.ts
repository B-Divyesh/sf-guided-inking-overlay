import { describe, expect, it } from 'vitest';
import { fanSegments, lineThroughRect, offsetPolyline, pointsToSvgPath, railOffsets, simplifyPoints } from './geometry';

describe('guide geometry', () => {
  it('clips guide lines to the artboard', () => {
    expect(lineThroughRect({ x: 600, y: 400 }, 0)).toEqual({ a: { x: 0, y: 400 }, b: { x: 1200, y: 400 } });
    const vertical = lineThroughRect({ x: 600, y: 400 }, 90);
    expect(vertical.a.x).toBeCloseTo(600);
    expect(vertical.a.y).toBe(0);
    expect(vertical.b.y).toBe(800);
  });

  it('creates the requested fan density', () => {
    expect(fanSegments({ x: 500, y: 300 }, 11, 20)).toHaveLength(11);
  });

  it('creates evenly centered rail offsets', () => {
    expect(railOffsets(5, 20)).toEqual([-40, -20, 0, 20, 40]);
    expect(railOffsets(4, 10)).toEqual([-15, -5, 5, 15]);
  });

  it('offsets a horizontal spline along its normal', () => {
    expect(offsetPolyline([{ x: 0, y: 4 }, { x: 10, y: 4 }], 6)).toEqual([{ x: 0, y: 10 }, { x: 10, y: 10 }]);
  });

  it('simplifies dense pointer input but keeps the last point', () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }];
    expect(simplifyPoints(points, 5)).toEqual([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }]);
  });

  it('serializes a smooth path without invalid values', () => {
    expect(pointsToSvgPath([{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 20, y: 0 }])).toBe('M 0.0 0.0 Q 10.0 10.0 15.0 5.0 T 20.0 0.0');
  });
});
