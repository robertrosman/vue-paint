import type { Handle, Movement } from "@/types"
import type { Position } from "@vueuse/core"
import { describe, expect, test } from "vitest"

export interface TestHandleOptions<ShapeLike> {
    /** The handles to test */
    handles: Handle<ShapeLike>[]

    /** The name of the handle to test */
    name: string

    /** The shape to test the handle on */
    shape: ShapeLike

    /** The position {x, y} of the handle */
    handlePosition: Position

    /** Test to move this distance {x, y} */
    move: Movement

    /** How should the shape look after the move? */
    result: Partial<ShapeLike>
}

export function testHandle<T>({ handles, name, shape, handlePosition, move, result }: TestHandleOptions<T>) {
    describe(`${name} handle`, () => {
        test(`should return ${name} position`, () => {
            const startHandle = handles.find(h => h.name === name)!
            const position = startHandle.position(shape)
            expect(position).toMatchObject(handlePosition)
        })

        test(`should move shape when ${name} handle moves`, () => {
            const startHandle = handles.find(h => h.name === name)!
            const afterMove = startHandle.onMove(move, shape)
            const clonedShape = structuredClone(shape)
            Object.entries(afterMove ?? {}).forEach(([key, value]) => {
                (clonedShape[key as keyof typeof clonedShape] as any) += value
            })
            expect(clonedShape).toMatchObject(result)
        })
    })

}