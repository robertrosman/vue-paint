import { beforeEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { useFreehand } from './useFreehand'
import type { DrawEvent, Settings } from '@/types'

let settings: Settings

describe('useFreehand', () => {
  beforeEach(() => {
    settings = {
      tool: 'line',
      color: 'red',
      thickness: 3
    }
  })
  test('should export type "freehand"', () => {
    const { type } = useFreehand()
    expect(type).toBe('freehand')
  })

  test('should return an icon', () => {
    const { icon } = useFreehand()
    expect(icon?.length).toBeGreaterThan(0)
  })

  test('drawing should return a freehand shape', () => {
    const { onDrawStart, onDraw } = useFreehand()
    onDrawStart?.({
      settings,
      id: 'test-id',
      x: 20,
      y: 20
    } as DrawEvent)
    const freehand = onDraw?.({
      settings,
      id: 'test-id',
      x: 30,
      y: 20
    } as DrawEvent)

    expect(freehand).toMatchObject({
      type: 'freehand',
      id: 'test-id',
      x: 20,
      y: 20,
      thickness: 3,
      color: 'red'
    })
    expect(freehand?.path).toBeDefined()
  })

  test('should return style for freehand elements', () => {
    const { svgStyle } = useFreehand()

    expect(svgStyle).toMatch('.freehand {')
    expect(svgStyle).toMatch('stroke-linecap: round')
    expect(svgStyle).toMatch('stroke-linejoin: round')
    expect(svgStyle).toMatch('fill-opacity: 0')
  })

  test('should return a shapeSvgComponent', () => {
    const { ShapeSvgComponent } = useFreehand()

    const wrapper = mount(ShapeSvgComponent, {
      props: {
        shape: {
          type: 'freehand',
          id: 'test-id',
          thickness: 3,
          x: 10,
          y: 10,
          path: 'some-dummy-path',
          color: 'red'
        }
      }
    })

    expect(wrapper.element.tagName).toBe('PATH')
    expect(wrapper.attributes('class')).toBe('freehand')
    expect(wrapper.attributes('d')).toBe('M10,10some-dummy-path')
    expect(wrapper.attributes('stroke')).toBe('red')
    expect(wrapper.attributes('stroke-width')).toBe('3')
  })
})
