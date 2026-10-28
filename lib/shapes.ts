// Organic frame outlines for SVG clip paths and masks. Each shape is a polygon with
// generously rounded corners, which reads as soft and hand-cut rather than geometric.

type Pt = [number, number];

/** Polygon with rounded corners as an SVG path ("C" curves, so MorphSVG can tween it). */
export function roundedPath(points: Pt[], radius: number) {
  const n = points.length;
  const seg = (a: Pt, b: Pt, d: number): Pt => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const t = Math.min(d / len, 0.5);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const cur = points[i];
    const next = points[(i + 1) % n];
    const start = seg(cur, prev, radius);
    const end = seg(cur, next, radius);
    d += i === 0 ? `M${start[0].toFixed(1)} ${start[1].toFixed(1)}` : `L${start[0].toFixed(1)} ${start[1].toFixed(1)}`;
    d += `C${cur[0]} ${cur[1]} ${cur[0]} ${cur[1]} ${end[0].toFixed(1)} ${end[1].toFixed(1)}`;
  }
  return d + "Z";
}

// Big portrait frame (viewBox 600 x 800) and its second state.
export const frameA = {
  from: roundedPath([[70, 0], [600, 30], [580, 760], [60, 800], [0, 300]], 70),
  to: roundedPath([[0, 90], [540, 0], [600, 520], [430, 800], [30, 740]], 70),
};

// Smaller landscape frame (viewBox 560 x 560) and its second state.
export const frameB = {
  from: roundedPath([[0, 60], [520, 0], [560, 430], [90, 560], [10, 420]], 60),
  to: roundedPath([[60, 0], [560, 80], [500, 560], [0, 500], [30, 210]], 60),
};
