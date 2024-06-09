import { describe } from 'vitest'
import { testHandle } from './testUtils'
import { rectangleHandles } from './rectangleHandles'


describe('rectangleHandles', () => {
    testHandle({
        handles: rectangleHandles,
        name: 'base',
        shape: {x: 100, y: 150, width: 100, height: 200},
        handlePosition: {x: 150, y: 250},
        move: {x: 10, y: 20},
        result: {x: 110, y: 170, width: 100, height: 200}
    })

    testHandle({
        handles: rectangleHandles,
        name: 'top',
        shape: {x: 100, y: 150, width: 200, height: 250},
        handlePosition: {x: 200, y: 150},
        move: {x: 10, y: 20},
        result: {x: 100, y: 170, width: 200, height: 230}
    })

    testHandle({
        handles: rectangleHandles,
        name: 'top-right',
        shape: {x: 100, y: 150, width: 200, height: 250},
        handlePosition: {x: 300, y: 150},
        move: {x: 10, y: 20},
        result: {x: 100, y: 170, width: 210, height: 230}
    })

    testHandle({
        handles: rectangleHandles,
        name: 'right',
        shape: {x: 100, y: 150, width: 200, height: 250},
        handlePosition: {x: 300, y: 275},
        move: {x: 10, y: 20},
        result: {x: 100, y: 150, width: 210, height: 250}
    })

    testHandle({
        handles: rectangleHandles,
        name: 'bottom-right',
        shape: {x: 100, y: 150, width: 200, height: 250},
        handlePosition: {x: 300, y: 400},
        move: {x: 10, y: 20},
        result: {x: 100, y: 150, width: 210, height: 270}
    })

    testHandle({
        handles: rectangleHandles,
        name: 'bottom',
        shape: {x: 100, y: 150, width: 200, height: 250},
        handlePosition: {x: 200, y: 400},
        move: {x: 10, y: 20},
        result: {x: 100, y: 150, width: 200, height: 270}
    })

    testHandle({
        handles: rectangleHandles,
        name: 'bottom-left',
        shape: {x: 100, y: 150, width: 200, height: 250},
        handlePosition: {x: 100, y: 400},
        move: {x: 10, y: 20},
        result: {x: 110, y: 150, width: 190, height: 270}
    })

    testHandle({
        handles: rectangleHandles,
        name: 'left',
        shape: {x: 100, y: 150, width: 200, height: 250},
        handlePosition: {x: 100, y: 275},
        move: {x: 10, y: 20},
        result: {x: 110, y: 150, width: 190, height: 250}
    })

    testHandle({
        handles: rectangleHandles,
        name: 'top-left',
        shape: {x: 100, y: 150, width: 200, height: 250},
        handlePosition: {x: 100, y: 150},
        move: {x: 10, y: 20},
        result: {x: 110, y: 170, width: 190, height: 230}
    })

})
