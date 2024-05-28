import { describe } from 'vitest'
import { lineHandles } from './lineHandles'
import { testHandle } from './testUtils'


describe('lineHandles', () => {
    testHandle({
        handles: lineHandles,
        name: 'start',
        shape: {x1: 100, y1: 150, x2: 200, y2: 250},
        handlePosition: {x: 100, y: 150},
        move: {x: 10, y: 20},
        result: {x1: 110, y1: 170}
    })

    testHandle({
        handles: lineHandles,
        name: 'base',
        shape: {x1: 100, y1: 150, x2: 200, y2: 250},
        handlePosition: {x: 150, y: 200},
        move: {x: 10, y: 20},
        result: {x1: 110, y1: 170, x2: 210, y2: 270}
    })

    testHandle({
        handles: lineHandles,
        name: 'end',
        shape: {x1: 100, y1: 150, x2: 200, y2: 250},
        handlePosition: {x: 200, y: 250},
        move: {x: 10, y: 20},
        result: {x2: 210, y2: 270}
    })
})
