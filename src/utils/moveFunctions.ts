import type { Movement } from "@/types";

/** Reusable move callbacks for the most common shape types.  */
export function rectangleMove ({x, y}: Movement) {
    return {x, y}
}

export function lineMove ({x, y}: Movement) {
    return {x1: x, y1: y, x2: x, y2: y}
}