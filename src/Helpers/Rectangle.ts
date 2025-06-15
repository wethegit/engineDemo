import { Vec2 } from "wtc-math";

/**
 * Represents a rectangle in 2D space.
 */
export class Rectangle {
  /** The x-coordinate of the rectangle's top-left corner */
  x: number;
  /** The y-coordinate of the rectangle's top-left corner */
  y: number;
  /** The width of the rectangle */
  width: number;
  /** The height of the rectangle */
  height: number;

  /**
   * Creates a new Rectangle instance.
   * @param {number} x - The x-coordinate of the top-left corner
   * @param {number} y - The y-coordinate of the top-left corner
   * @param {number} width - The width of the rectangle
   * @param {number} height - The height of the rectangle
   */
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Creates a rectangle from a position and dimensions.
   * @param {Vec2} position - The position of the top-left corner
   * @param {Vec2} dimensions - The dimensions of the rectangle
   * @returns {Rectangle} A new Rectangle instance
   */
  static fromPositionAndDimensions(
    position: Vec2,
    dimensions: Vec2
  ): Rectangle {
    return new Rectangle(position.x, position.y, dimensions.x, dimensions.y);
  }

  /**
   * Checks if this rectangle intersects with another rectangle.
   * @param {Rectangle} other - The other rectangle to check against
   * @returns {boolean} True if the rectangles intersect, false otherwise
   */
  intersects(other: Rectangle): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  /**
   * Checks if a point is inside this rectangle.
   * @param {Vec2} point - The point to check
   * @returns {boolean} True if the point is inside the rectangle, false otherwise
   */
  containsPoint(point: Vec2): boolean {
    return (
      point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.height
    );
  }
}
