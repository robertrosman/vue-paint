import { describe, expect, test } from 'vitest'
import { useEraser } from './useEraser'
import type { Shape } from '@/types'

describe('useEraser', () => {
  test('should export type "eraser"', () => {
    const { type } = useEraser()
    expect(type).toBe('eraser')
  })

  test('should return an icon', () => {
    const { icon } = useEraser()
    expect(icon?.length).toBeGreaterThan(0)
  })

  describe('simplifyHistory', () => {
    test('should remove erased shapes from history', () => {
      const { simplifyHistory } = useEraser()
      const history: Shape[] = [
        { type: 'textarea', id: 'first-textarea', x: 40, y: 450, width: 580, height: 70, fontSize: 6, color: '#ffffff', content: 'Use the tools, Luke!' },
        { type: 'line', id: 'first-line', x1: 240, y1: 525, x2: 240, y2: 525, thickness: 6, color: '#c82d2d' },
        { type: 'textarea', id: 'second-textarea', x: 900, y: 450, width: 600, height: 100, fontSize: 6, color: '#ffffff', content: 'Try some settings' },
        { type: 'line', id: 'second-line', x1: 1140, y1: 525, x2: 1140, y2: 525, thickness: 6, color: '#c82d2d' },
        { type: 'eraser', id: 'first-erase', targets: ['first-textarea'] },
        { type: 'eraser', id: 'second-erase', targets: ['second-line', 'first-textarea'] }
      ]
      const simplified = simplifyHistory!(history, [useEraser()])

      expect(simplified.find(s => s.id === 'first-textarea')).toBeUndefined()
      expect(simplified.find(s => s.id === 'second-line')).toBeUndefined()
    })

    test('should remove eraser shapes from history', () => {
      const { simplifyHistory } = useEraser()
      const history: Shape[] = [
        { type: 'textarea', id: 'first-textarea', x: 40, y: 450, width: 580, height: 70, fontSize: 6, color: '#ffffff', content: 'Use the tools, Luke!' },
        { type: 'line', id: 'first-line', x1: 1140, y1: 525, x2: 1140, y2: 525, thickness: 6, color: '#c82d2d' },
        { type: 'eraser', id: 'first-erase', targets: ['first-textarea'] },
      ]
      const simplified = simplifyHistory!(history, [useEraser()])

      expect(simplified.length).toBe(1)
      expect(simplified.find(s => s.type === 'eraser')).toBeUndefined()
    })
  })
})
