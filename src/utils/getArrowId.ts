import type { Shape } from "@/types";

export function getArrowId(shape: Shape) {
    return `arrow-${shape.color.replace(/[^a-z0-9]/gi, '')}`
}