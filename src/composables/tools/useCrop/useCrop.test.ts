import { describe, expect, test } from 'vitest'
import { useCrop } from './useCrop'
import type { Shape } from '@/types'

describe('useCrop', () => {
  test('should export type "crop"', () => {
    const { type } = useCrop()
    expect(type).toBe('crop')
  })

  test('should return an icon', () => {
    const { icon } = useCrop()
    expect(icon?.length).toBeGreaterThan(0)
  })

  describe('simplifyHistory', () => {
    test('should return all history if no crops are found', () => {
      const { simplifyHistory } = useCrop()
      const history: Shape[] = [
        { type: 'textarea', id: 'textarea', x: 40, y: 450, width: 580, height: 70, fontSize: 6, color: '#ffffff', content: 'Use the tools, Luke!' },
        { type: 'move', id: 'first-move', targets: ['textarea-top-left'], x: 110, y: -110 },
        { type: 'move', id: 'second-move', targets: ['textarea-top-left'], x: -10, y: 10 },
      ]
      const simplified = simplifyHistory!(history, [useCrop()])

      expect(simplified.length).toBe(3)
    })

    test('should only keep last crop', () => {
      const { simplifyHistory } = useCrop()
      const history: Shape[] = [
        { type: 'crop', id: 'crop1', x: 40, y: 450, width: 580, height: 70},
        { type: 'crop', id: 'crop2', x: 41, y: 451, width: 580, height: 70},
        { type: 'crop', id: 'crop3', x: 42, y: 452, width: 580, height: 70},
        { type: 'crop', id: 'crop4', x: 43, y: 453, width: 580, height: 70},
      ]
      const simplified = simplifyHistory!(history, [useCrop()])

      expect(simplified.length).toBe(1)
      expect(simplified[0].id).toBe('crop4')
    })
  })
})
