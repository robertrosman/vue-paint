import type { Position } from "@vueuse/core";
import type { Ref } from "vue";

interface SnapToAngleOptions {
    snapAngles?: Ref<number[] | undefined>
    posStart: Position
    x: number
    y: number
}

// Inspired by https://stackoverflow.com/a/42510911/829505
export function snapToAngle({ snapAngles, posStart, x, y }: SnapToAngleOptions) {
    // If no snapAngles are inserted, just return the actual position
    if (!snapAngles?.value) {
        return { x, y }
    }

    // Calculate the distance from start position to end
    const deltaX = x - posStart.x
    const deltaY = y - posStart.y
    const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))

    // Calculate the angle in radians
    const angle = Math.atan2(deltaY, deltaX);

    // Find the closest snapAngle by:
    const closestSnapAngle = snapAngles.value

        // 1. converting degrees to radians
        .map(snapAngle => (180 - snapAngle) * Math.PI / 180)

        // 2. calculating the diff from the actual angle to each snapAngle
        .map(snapAngle => ({ angle: snapAngle, diff: angleDiff(angle, snapAngle)}))

        // 3. sort from closest to farthest and pick the first
        .sort((a, b) => a.diff - b.diff)[0].angle

    // Return the position based on the closest snapAngle
    return {
        x: posStart.x + distance * Math.cos(closestSnapAngle),
        y: posStart.y + distance * Math.sin(closestSnapAngle)
    }
}

/**
 * Calculate difference in radians between angles. Returns a number between 0-PI.
 * https://gamedev.stackexchange.com/a/4472
 */
export function angleDiff(a: number, b: number) {
    return Math.PI - Math.abs(Math.abs(a - b) - Math.PI)
}