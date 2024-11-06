import { beforeEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { useTextarea } from './useTextarea'
import type { DrawEvent, Settings } from '@/types'

let settings: Settings

describe('useTextarea', () => {
  beforeEach(() => {
    settings = {
      tool: 'line',
      color: 'red',
      angleSnap: false,
      thickness: 3
    }
  })
  test('should export type "textarea"', () => {
    const { type } = useTextarea()
    expect(type).toBe('textarea')
  })

  test('should return an icon', () => {
    const { icon } = useTextarea()
    expect(icon?.length).toBeGreaterThan(0)
  })

  test('onDraw should return a textarea shape', () => {
    const { onDraw } = useTextarea()
    const line = onDraw?.({
      settings,
      id: 'test-id',
      minX: 10,
      minY: 10,
      maxX: 30,
      maxY: 30
    } as DrawEvent)

    expect(line).toMatchObject({
      type: 'textarea',
      id: 'test-id',
      x: 10,
      y: 10,
      width: 20,
      height: 20,
      fontSize: 3,
      color: 'red'
    })
  })

  test('should return a ShapeSvgComponent', () => {
    const { ShapeSvgComponent } = useTextarea()

    const wrapper = mount(ShapeSvgComponent, {
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

    expect(wrapper.element.tagName).toBe('FOREIGNOBJECT')
    expect(wrapper.attributes('x')).toBe('10')
    expect(wrapper.attributes('y')).toBe('10')
    expect(wrapper.attributes('width')).toBe('20')
    expect(wrapper.attributes('height')).toBe('20')
  })
})
