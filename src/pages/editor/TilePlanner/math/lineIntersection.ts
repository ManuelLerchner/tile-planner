import { Vector } from "p5";

function cross2d(a: Vector, b: Vector) {
  return a.x * b.y - a.y * b.x;
}

export function rayIntersectsLine(
  rOrigin: Vector,
  rDir: Vector,
  s2: Vector,
  e2: Vector
) {
  const v1 = rOrigin.copy().sub(s2);
  const v2 = e2.copy().sub(s2);
  const v3 = new Vector(-rDir.y, rDir.x);

  const t1 = cross2d(v2, v1) / v2.dot(v3);
  const t2 = v1.dot(v3) / v2.dot(v3);
  if (t1 >= 0.0 && t2 >= 0.0 && t2 <= 1.0) {
    return rOrigin.copy().add(rDir.copy().mult(t1));
  }
  return undefined;
}
