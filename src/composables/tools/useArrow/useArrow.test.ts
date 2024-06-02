import { beforeEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { useArrow, type Arrow } from './useArrow'
import type { DrawEvent, Settings } from '@/types'

let settings: Settings

describe('useArrow', () => {
  beforeEach(() => {
    settings = {
      tool: 'line',
      color: 'red',
      thickness: 3
    }
  })

  test('should export type "arrow"', () => {
    const { type } = useArrow()
    expect(type).toBe('arrow')
  })

  test('should return an icon', () => {
    const { icon } = useArrow()
    expect(icon?.length).toBeGreaterThan(0)
  })

  test('onDraw should return an arrow shape', () => {
    const { onDraw } = useArrow()
    const line = onDraw?.({
      settings,
      id: 'test-id',
      posStart: { x: 10, y: 10 },
      x: 20,
      y: 20
    } as DrawEvent)

    expect(line).toMatchObject({
      type: 'arrow',
      id: 'test-id',
      x1: 10,
      y1: 10,
      x2: 20,
      y2: 20,
      thickness: 3,
      color: 'red'
    })
  })

  test('should return a ShapeSvgComponent', () => {
    const { ShapeSvgComponent } = useArrow()

    const wrapper = mount(ShapeSvgComponent, {
      props: {
        shape: {
          type: 'arrow',
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
    expect(wrapper.attributes('marker-end')).toBe('url(#arrow-red)')
  })

  test('ToolSvgComponent should render unique markers for every color', () => {
    const { ToolSvgComponent } = useArrow()

    const arrow: Arrow = {
      type: 'arrow',
      id: 'test',
      x1: 10,
      y1: 10,
      x2: 20,
      y2: 20,
      thickness: 3,
      color: 'red'
    }

    const wrapper = mount(ToolSvgComponent, {
      props: {
        history: [
          arrow,
          arrow,
          {
            ...arrow,
            color: 'black'
          },
        ]
      }
    })

    expect(wrapper.findAll('defs').length).toBe(1)
    expect(wrapper.findAll('marker').length).toBe(2)
    expect(wrapper.find('marker#arrow-red').exists()).toBe(true)
    expect(wrapper.find('marker#arrow-black').exists()).toBe(true)
  })
})
