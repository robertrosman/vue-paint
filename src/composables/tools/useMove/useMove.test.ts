import { describe, expect, test } from 'vitest'
import { useMove } from './useMove'
import type { Shape } from '@/types'
import { useTextarea, type Textarea } from '../useTextarea/useTextarea'
import { useLine, type Line } from '../useLine/useLine'

describe('useMove', () => {
  test('should export type "move"', () => {
    const { type } = useMove()
    expect(type).toBe('move')
  })

  test('should return an icon', () => {
    const { icon } = useMove()
    expect(icon?.length).toBeGreaterThan(0)
  })

  describe('simplifyHistory', () => {
    test('should move textareas in history', () => {
      const { simplifyHistory } = useMove()
      const history: Shape[] = [
        { type: 'textarea', id: 'textarea', x: 40, y: 450, width: 580, height: 70, fontSize: 6, color: '#ffffff', content: 'Use the tools, Luke!' },
        { type: 'move', id: 'first-move', targets: ['top-left-handle-textarea'], x: 110, y: -110, angleSnap: false },
        { type: 'move', id: 'second-move', targets: ['top-left-handle-textarea'], x: -10, y: 10, angleSnap: false },
      ]
      const simplified = simplifyHistory!(history, [useTextarea(), useMove()])
      const movedTextarea = simplified[0] as Textarea

      expect(movedTextarea.x).toBe(140)
      expect(movedTextarea.y).toBe(350)
    })

    test('should move lines in history', () => {
      const { simplifyHistory } = useMove()
      const history: Shape[] = [
        { type: 'line', id: 'first-line', x1: 200, y1: 200, x2: 300, y2: 300, thickness: 6, color: '#c82d2d' },
        { type: 'move', id: 'first-move', targets: ['first-line'], x: 110, y: -110, angleSnap: false },
        { type: 'move', id: 'second-move', targets: ['first-line'], x: -10, y: 10, angleSnap: false },
      ]
      const simplified = simplifyHistory!(history, [useLine()])
      const movedLine = simplified[0] as Line

      expect(movedLine).toMatchObject({x1: 300, y1: 100, x2: 400, y2: 200})
    })

    test('should remove move shapes from history', () => {
      const { simplifyHistory } = useMove()
      const history: Shape[] = [
        { type: 'textarea', id: 'first-textarea', x: 40, y: 450, width: 580, height: 70, fontSize: 6, color: '#ffffff', content: 'Use the tools, Luke!' },
        { type: 'move', id: 'first-move', targets: ['first-textarea'], x: 100, y: -100, angleSnap: false },
      ]
      const simplified = simplifyHistory!(history, [useTextarea()])

      expect(simplified.length).toBe(1)
      expect(simplified.find(s => s.type === 'move')).toBeUndefined()
    })

    test('should work with diff handles and callback handles', () => {
      const { simplifyHistory } = useMove()
      const history: Shape[] = [
        { type: 'line', id: 'strange-line', x1: 200, y1: 200, x2: 300, y2: 300, children: ['first', 'second'], thickness: 6, color: '#c82d2d' },
        { type: 'move', id: 'diff-move', targets: ['diff-handle-strange-line'], x: 110, y: -110, angleSnap: false },
        { type: 'move', id: 'callback-move', targets: ['callback-handle-strange-line'], x: -10, y: 10, angleSnap: false },
      ]
      const simplified = simplifyHistory!(history, [{
        // Just using line as type for simplicity
        type: 'line',
        handles: [
          {
              name: 'diff',
              position: ({x1, y1}) => ({x: x1, y: y1}),
              onMove: ({x, y}) => ({x1: x, y1: y})
          },
          {
              name: 'callback',
              position: ({x1, y1}) => ({x: x1, y: y1}),
              onMove: ({x, y}) => (line) => ({children: [...line.children, `${x}x${y}`]})
          },
        ]
      }])
      const movedLine = simplified[0] as Line

      expect(movedLine).toMatchObject({x1: 310, y1: 90, x2: 300, y2: 300, children: ['first', 'second', '-10x10']})
    })
  })
})
