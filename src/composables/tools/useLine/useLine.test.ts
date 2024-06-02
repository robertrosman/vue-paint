import { beforeEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { useLine } from './useLine'
import type { DrawEvent, Settings } from '@/types'

let settings: Settings

describe('useLine', () => {
  beforeEach(() => {
    settings = {
      tool: 'line',
      color: 'red',
      thickness: 3
    }
  })
  test('should export type "line"', () => {
    const { type } = useLine()
    expect(type).toBe('line')
  })

  test('should return an icon', () => {
    const { icon } = useLine()
    expect(icon?.length).toBeGreaterThan(0)
  })

  test('onDraw should return a line shape', () => {
    const { onDraw } = useLine()
    const line = onDraw?.({
      settings,
      id: 'test-id',
      posStart: { x: 10, y: 10 },
      x: 20,
      y: 20
    } as DrawEvent)

    expect(line).toMatchObject({
      type: 'line',
      id: 'test-id',
      x1: 10,
      y1: 10,
      x2: 20,
      y2: 20,
      thickness: 3,
      color: 'red'
    })
  })

  test('should return style for line elements', () => {
    const { svgStyle } = useLine()

    expect(svgStyle).toMatch('line {')
    expect(svgStyle).toMatch('stroke-linecap: round')
    expect(svgStyle).toMatch('stroke-linejoin: round')
    expect(svgStyle).toMatch('fill-opacity: 0')
  })

  test('should return a ShapeSvgComponent', () => {
    const { ShapeSvgComponent } = useLine()

    const wrapper = mount(ShapeSvgComponent, {
      props: {
        shape: {
          type: 'line',
          x1: 10,
          y1: 10,
          x2: 20,
          y2: 20,
          thickness: 3,
          color: 'red'
        }
      }
    })

    expect(wrapper.element.tagName).toBe('LINE')
    expect(wrapper.attributes('x1')).toBe('10')
    expect(wrapper.attributes('y1')).toBe('10')
    expect(wrapper.attributes('x2')).toBe('20')
    expect(wrapper.attributes('y2')).toBe('20')
    expect(wrapper.attributes('stroke')).toBe('red')
    expect(wrapper.attributes('stroke-width')).toBe('3')
  })
})
