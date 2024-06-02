import { it, describe, assertType } from 'vitest'
import { type Arrow, useArrow } from '../src/composables/tools/useArrow/useArrow'
import { type Crop, useCrop } from '../src/composables/tools/useCrop/useCrop'
import { type ImageHistory } from '../src/types'

describe('tool types', () => {
    it('should return shape from generic argument', () => {
        const tools = [useArrow(), useCrop()]
        const shapes: ImageHistory<typeof tools> = [{ type: 'arrow', id: 'test', x1: 0, x2: 0, y1: 0, y2: 0, thickness: 2, color: "red" }] 
        const firstArrow = shapes[0]

        assertType<Arrow | Crop>(firstArrow)
    })
})