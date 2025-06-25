import { Vec2 } from "wtc-math";

interface RayLineIntersectionResult {
  intersects: boolean;
  point?: Vec2;
  t?: number; // Parameter along the ray where intersection occurs
}

/**
 * Calculates the intersection point between a ray and a line segment
 * @param rayOrigin - The starting point of the ray
 * @param rayDirection - The normalized direction vector of the ray
 * @param lineStart - The starting point of the line segment
 * @param lineEnd - The ending point of the line segment
 * @returns An object containing whether the ray intersects the line and the intersection point if it exists
 */
export function rayLineIntersection(
  rayOrigin: Vec2,
  rayDirection: Vec2,
  lineStart: Vec2,
  lineEnd: Vec2
): RayLineIntersectionResult {
  // Vector from ray origin to line start
  const v1 = new Vec2(rayOrigin.x - lineStart.x, rayOrigin.y - lineStart.y);

  // Vector from line start to line end
  const v2 = new Vec2(lineEnd.x - lineStart.x, lineEnd.y - lineStart.y);

  // Vector perpendicular to ray direction
  const v3 = new Vec2(-rayDirection.y, rayDirection.x);

  // Calculate dot product of v2 and v3
  const dot = v2.x * v3.x + v2.y * v3.y;

  // If dot product is 0, ray and line are parallel
  if (Math.abs(dot) < 0.000001) {
    return { intersects: false };
  }

  // Calculate parameters t1 and t2
  const t1 = (v2.x * v1.y - v2.y * v1.x) / dot;
  const t2 = (v1.x * v3.x + v1.y * v3.y) / dot;

  // Check if intersection is valid
  if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
    return {
      intersects: true,
      point: new Vec2(
        rayOrigin.x + rayDirection.x * t1,
        rayOrigin.y + rayDirection.y * t1
      ),
      t: t1,
    };
  }

  return { intersects: false };
}

/**
 * Type for specifying which type of boundary line we're checking
 */
export type BoundaryType = "vertical" | "horizontal";

/**
 * Calculates the intersection point between a ray and a vertical or horizontal boundary line
 * @param rayOrigin - The starting point of the ray
 * @param rayDirection - The direction vector of the ray (doesn't need to be normalized)
 * @param boundaryValue - The x-coordinate for vertical lines or y-coordinate for horizontal lines
 * @param boundaryType - Whether the boundary is 'vertical' or 'horizontal'
 * @returns An object containing whether the ray intersects the boundary and the intersection point if it exists
 */
export function rayBoundaryIntersection(
  rayOrigin: Vec2,
  rayDirection: Vec2,
  boundaryValue: number,
  boundaryType: BoundaryType
): RayLineIntersectionResult {
  // For vertical lines, we need to check if ray can reach the x-coordinate
  if (boundaryType === "vertical") {
    // If ray is parallel to boundary (moving vertically), no intersection
    if (Math.abs(rayDirection.x) < 0.000001) {
      return { intersects: false };
    }

    // Calculate parameter t where ray reaches the boundary
    const t = (boundaryValue - rayOrigin.x) / rayDirection.x;

    // Only consider intersections in the positive direction of the ray
    if (t >= 0) {
      return {
        intersects: true,
        point: new Vec2(boundaryValue, rayOrigin.y + rayDirection.y * t),
        t,
      };
    }
  }
  // For horizontal lines, we need to check if ray can reach the y-coordinate
  else {
    // If ray is parallel to boundary (moving horizontally), no intersection
    if (Math.abs(rayDirection.y) < 0.000001) {
      return { intersects: false };
    }

    // Calculate parameter t where ray reaches the boundary
    const t = (boundaryValue - rayOrigin.y) / rayDirection.y;

    // Only consider intersections in the positive direction of the ray
    if (t >= 0) {
      return {
        intersects: true,
        point: new Vec2(rayOrigin.x + rayDirection.x * t, boundaryValue),
        t,
      };
    }
  }

  return { intersects: false };
}
