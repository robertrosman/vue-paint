import { beforeEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { useRectangle } from './useRectangle'
import type { DrawEvent, Settings } from '@/types'

let settings: Settings

describe('useRectangle', () => {
  beforeEach(() => {
    settings = {
      tool: 'line',
      color: 'red',
      thickness: 3
    }
  })
  test('should export type "line"', () => {
    const { type } = useRectangle()
    expect(type).toBe('rectangle')
  })

  test('should return an icon', () => {
    const { icon } = useRectangle()
    expect(icon?.length).toBeGreaterThan(0)
  })

  test('onDraw should return a line shape', () => {
    const { onDraw } = useRectangle()
    const line = onDraw?.({
      settings,
      id: 'test-id',
      minX: 10,
      minY: 10,
      maxX: 30,
      maxY: 30
    } as DrawEvent)

    expect(line).toMatchObject({
      type: 'rectangle',
      id: 'test-id',
      x: 10,
      y: 10,
      width: 20,
      height: 20,
      thickness: 3,
      color: 'red'
    })
  })

  test('should return style for rect elements', () => {
    const { svgStyle } = useRectangle()

    expect(svgStyle).toMatch('rect {')
    expect(svgStyle).toMatch('stroke-linecap: round')
    expect(svgStyle).toMatch('stroke-linejoin: round')
    expect(svgStyle).toMatch('fill-opacity: 0')
  })

  test('should return a shapeSvgComponent', () => {
    const { shapeSvg } = useRectangle()

    const wrapper = mount(shapeSvg, {
      props: {
        shape: {
          type: 'rectangle',
          x: 10,
          y: 10,
          width: 20,
          height: 20,
          thickness: 3,
          color: 'red'
        }
      }
    })

    expect(wrapper.element.tagName).toBe('RECT')
    expect(wrapper.attributes('x')).toBe('10')
    expect(wrapper.attributes('y')).toBe('10')
    expect(wrapper.attributes('width')).toBe('20')
    expect(wrapper.attributes('height')).toBe('20')
    expect(wrapper.attributes('stroke')).toBe('red')
    expect(wrapper.attributes('stroke-width')).toBe('3')
  })
})
