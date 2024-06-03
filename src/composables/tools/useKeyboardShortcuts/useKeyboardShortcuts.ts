import type { Tool, BaseShape, InitializeEvent } from '@/types'
import { computed } from 'vue'
import { useActiveElement, useMagicKeys, whenever } from '@vueuse/core'
import { logicAnd } from '@vueuse/math'

// Feels weird to create a Shape that will never be added to the history. Can we support Tool<undefined>?
export interface KeyboardShortcuts extends BaseShape {
  type: 'keyboard-shortcuts'
}

interface UseKeyboardShortcutsOptions {
  /** You can use whatever shortcuts you want. Have a look at defaultShortcuts to see the format. If you only want to 
   * change something small, you might use defaultSettings as a base:
   * 
   * @example
   * const shortcuts = Object.assign({}, defaultShortcuts, {
   *   's': ({settings}) => settings.value.tool = 'rectangle', // 's' as in 'select'
   *   'd': ({settings}) => settings.value.tool = 'eraser', // 'd' as in 'delete'
   * })
   * const tools = [useKeyboardShortcuts({ shortcuts }), useAnotherTool(), useAThirdTool]
   */
  shortcuts?: Shortcuts
}

type Shortcuts = Record<string, (args: InitializeEvent) => void>

export const defaultShortcuts: Shortcuts = {
  'f': ({settings}) => settings.value.tool = 'freehand',
  'l': ({settings}) => settings.value.tool = 'line',
  'a': ({settings}) => settings.value.tool = 'arrow',
  'r': ({settings}) => settings.value.tool = 'rectangle',
  't': ({settings}) => settings.value.tool = 'textarea',
  'c': ({settings}) => settings.value.tool = 'crop',
  'e': ({settings}) => settings.value.tool = 'eraser',
  'm': ({settings}) => settings.value.tool = 'move',
}

export function useKeyboardShortcuts({ shortcuts = defaultShortcuts }: UseKeyboardShortcutsOptions = {}): Tool<KeyboardShortcuts> {
  const type = 'keyboard-shortcuts'

  const activeElement = useActiveElement()
  const notUsingInput = computed(() =>
    activeElement.value?.tagName !== 'INPUT' &&
    activeElement.value?.tagName !== 'TEXTAREA'
  )

  const keys = useMagicKeys()

  async function onInitialize(event: InitializeEvent) {
    Object.entries(shortcuts).forEach(([keycode, callback]) => {
      whenever(logicAnd(keys[keycode], notUsingInput), () => {
        callback(event)
      })
    })
  }

  return { type, onInitialize }
}
