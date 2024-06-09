import { describe } from 'vitest'
import { testHandle } from './testUtils'
import { ellipseHandles, type EllipseLike } from './ellipseHandles'

// NOTE: These tests doesn't say much about the expected result, they merely work as regression tests
describe('ellipseHandles', () => {
    describe('edge base', () => {
        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'base',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'edge'},
            handlePosition: {x: 100, y: 150},
            move: {x: 10, y: 20},
            result: {x: 110, y: 170, width: 100, height: 200}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'top',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'edge'},
            handlePosition: {x: 100, y: 50},
            move: {x: 10, y: 20},
            result: {x: 100, y: 160, width: 100, height: 180}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'top-right',
            shape: {x: 100, y: 150, width: 200, height: 250, base: 'edge'},
            handlePosition: {x: 170.71067811865476, y: 61.61165235168157},
            move: {x: 10, y: 20},
            result: {x: 105, y: 160, width: 214.14213562373095, height: 221.7157287525381}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'right',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'edge'},
            handlePosition: {x: 150, y: 150},
            move: {x: 10, y: 20},
            result: {x: 105, y: 150, width: 110, height: 200}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'bottom-right',
            shape: {x: 100, y: 150, width: 200, height: 250, base: 'edge'},
            handlePosition: {x: 170.71067811865476, y: 238.38834764831842},
            move: {x: 10, y: 20},
            result: {x: 105, y: 160, width: 214.14213562373095, height: 278.2842712474619}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'bottom',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'edge'},
            handlePosition: {x: 100, y: 250},
            move: {x: 10, y: 20},
            result: {x: 100, y: 160, width: 100, height: 220}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'bottom-left',
            shape: {x: 100, y: 150, width: 200, height: 250, base: 'edge'},
            handlePosition: {x: 29.28932188134526, y: 238.38834764831842},
            move: {x: 10, y: 20},
            result: {x: 105, y: 160, width: 185.85786437626905, height: 278.2842712474619}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'left',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'edge'},
            handlePosition: {x: 50, y: 150},
            move: {x: 10, y: 20},
            result: {x: 105, y: 150, width: 90, height: 200}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'top-left',
            shape: {x: 100, y: 150, width: 200, height: 250, base: 'edge'},
            handlePosition: {x: 29.28932188134526, y: 61.61165235168157},
            move: {x: 10, y: 20},
            result: {x: 105, y: 160, width: 185.85786437626905, height: 221.7157287525381}
        })

    })

    describe('center base', () => {
        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'base',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'center'},
            handlePosition: {x: 100, y: 150},
            move: {x: 10, y: 20},
            result: {x: 110, y: 170, width: 100, height: 200}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'top',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'center'},
            handlePosition: {x: 100, y: 50},
            move: {x: 10, y: 20},
            result: {x: 100, y: 150, width: 100, height: 160}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'top-right',
            shape: {x: 100, y: 150, width: 200, height: 250, base: 'center'},
            handlePosition: {x: 170.71067811865476, y: 61.61165235168157},
            move: {x: 10, y: 20},
            result: {x: 100, y: 150, width: 228.2842712474619, height: 193.4314575050762}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'right',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'center'},
            handlePosition: {x: 150, y: 150},
            move: {x: 10, y: 20},
            result: {x: 100, y: 150, width: 120, height: 200}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'bottom-right',
            shape: {x: 100, y: 150, width: 200, height: 250, base: 'center'},
            handlePosition: {x: 170.71067811865476, y: 238.38834764831842},
            move: {x: 10, y: 20},
            result: {x: 100, y: 150, width: 228.2842712474619, height: 306.5685424949238}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'bottom',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'center'},
            handlePosition: {x: 100, y: 250},
            move: {x: 10, y: 20},
            result: {x: 100, y: 150, width: 100, height: 240}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'bottom-left',
            shape: {x: 100, y: 150, width: 200, height: 250, base: 'center'},
            handlePosition: {x: 29.28932188134526, y: 238.38834764831842},
            move: {x: 10, y: 20},
            result: {x: 100, y: 150, width: 171.7157287525381, height: 306.5685424949238}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'left',
            shape: {x: 100, y: 150, width: 100, height: 200, base: 'center'},
            handlePosition: {x: 50, y: 150},
            move: {x: 10, y: 20},
            result: {x: 100, y: 150, width: 80, height: 200}
        })

        testHandle<EllipseLike>({
            handles: ellipseHandles,
            name: 'top-left',
            shape: {x: 100, y: 150, width: 200, height: 250, base: 'center'},
            handlePosition: {x: 29.28932188134526, y: 61.61165235168157},
            move: {x: 10, y: 20},
            result: {x: 100, y: 150, width: 171.7157287525381, height: 193.4314575050762}
        })

    })
})
