import { beforeEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { useEllipse } from './useEllipse'
import type { DrawEvent, Settings } from '@/types'

let settings: Settings

describe('useEllipse', () => {
  beforeEach(() => {
    settings = {
      tool: 'line',
      color: 'red',
      thickness: 3
    }
  })
  test('should export type "ellipse"', () => {
    const { type } = useEllipse()
    expect(type).toBe('ellipse')
  })

  test('should return an icon', () => {
    const { icon } = useEllipse()
    expect(icon?.length).toBeGreaterThan(0)
  })

  test('should return style for rect elements', () => {
    const { svgStyle } = useEllipse({ base: 'edge'})

    expect(svgStyle).toMatch('ellipse {')
    expect(svgStyle).toMatch('stroke-linecap: round')
    expect(svgStyle).toMatch('stroke-linejoin: round')
    expect(svgStyle).toMatch('fill-opacity: 0')
  })

  describe('edge base', () => {
    test('onDraw should return an ellipse shape', () => {
      const { onDraw } = useEllipse({ base: 'edge'})
      const line = onDraw?.({
        settings,
        id: 'test-id',
        minX: 10,
        minY: 10,
        maxX: 30,
        maxY: 30
      } as DrawEvent)

      expect(line).toMatchObject({
        type: 'ellipse',
        id: 'test-id',
        base: 'edge',
        x: 20,
        y: 20,
        width: 28.284271247461902,
        height: 28.284271247461902,
        thickness: 3,
        color: 'red'
      })
    })

    test('should return a ShapeSvgComponent', () => {
      const { ShapeSvgComponent } = useEllipse({ base: 'edge'})

      const wrapper = mount(ShapeSvgComponent, {
        props: {
          shape: {
            type: 'ellipse',
            base: 'edge',
            x: 10,
            y: 20,
            width: 30,
            height: 40,
            thickness: 3,
            color: 'red'
          }
        }
      })

      expect(wrapper.element.tagName).toBe('ELLIPSE')
      expect(wrapper.attributes('cx')).toBe('10')
      expect(wrapper.attributes('cy')).toBe('20')
      expect(wrapper.attributes('rx')).toBe('15')
      expect(wrapper.attributes('ry')).toBe('20')
      expect(wrapper.attributes('stroke')).toBe('red')
      expect(wrapper.attributes('stroke-width')).toBe('3')
    })
  })

  describe('center base', () => {
    test('onDraw should return an ellipse shape', () => {
      const { onDraw } = useEllipse({ base: 'center'})
      const line = onDraw?.({
        settings,
        id: 'test-id',
        posStart: { x: 30, y: 30 },
        minX: 10,
        minY: 10,
        maxX: 30,
        maxY: 30
      } as DrawEvent)

      expect(line).toMatchObject({
        type: 'ellipse',
        id: 'test-id',
        base: 'center',
        x: 30,
        y: 30,
        width: 56.568542494923804,
        height: 56.568542494923804,
        thickness: 3,
        color: 'red'
      })
    })

    test('should return a ShapeSvgComponent', () => {
      const { ShapeSvgComponent } = useEllipse({ base: 'center'})

      const wrapper = mount(ShapeSvgComponent, {
        props: {
          shape: {
            type: 'ellipse',
            base: 'center',
            x: 10,
            y: 20,
            width: 30,
            height: 40,
            thickness: 3,
            color: 'red'
          }
        }
      })

      expect(wrapper.element.tagName).toBe('ELLIPSE')
      expect(wrapper.attributes('cx')).toBe('10')
      expect(wrapper.attributes('cy')).toBe('20')
      expect(wrapper.attributes('rx')).toBe('15')
      expect(wrapper.attributes('ry')).toBe('20')
      expect(wrapper.attributes('stroke')).toBe('red')
      expect(wrapper.attributes('stroke-width')).toBe('3')
    })
  })
})
