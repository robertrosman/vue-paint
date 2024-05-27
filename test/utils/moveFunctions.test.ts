import { rectangleMove, lineMove } from "@/utils/moveFunctions";
import { describe, expect, it } from "vitest";


describe('moves', () => {
    it('should return a rectangle movement', () => {
        const movement = rectangleMove({x: 10, y: -10})
        expect(movement).toMatchObject({x: 10, y: -10})
    })

    it('should return a line movement', () => {
        const movement = lineMove({x: 10, y: -10})
        expect(movement).toMatchObject({x1: 10, y1: -10, x2: 10, y2: -10})
    })
})