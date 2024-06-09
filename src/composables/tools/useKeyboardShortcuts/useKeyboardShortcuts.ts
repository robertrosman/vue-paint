import type { Tool, BaseShape } from '@/types'
import { computed, watch } from 'vue'
import { useActiveElement, useMagicKeys, whenever } from '@vueuse/core'
import { logicAnd } from '@vueuse/math'
import type { useEditor } from '@/composables/useEditor'
import { useActiveEditor } from '@/composables/useActiveEditor'

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

  /** Do you want to turn angleSnap on temporarily with shift key? Defaults to true. */
  angleSnapOnShift?: boolean
}

type Shortcuts = Record<string, (args: ReturnType<typeof useEditor>) => void>

export const defaultShortcuts: Shortcuts = {
  'f': ({settings}) => settings.value.tool = 'freehand',
  'l': ({settings}) => settings.value.tool = 'line',
  'a': ({settings}) => settings.value.tool = 'arrow',
  'e': ({settings}) => settings.value.tool = 'ellipse',
  'r': ({settings}) => settings.value.tool = 'rectangle',
  't': ({settings}) => settings.value.tool = 'textarea',
  'c': ({settings}) => settings.value.tool = 'crop',
  'd': ({settings}) => settings.value.tool = 'eraser',
  'm': ({settings}) => settings.value.tool = 'move',
  'ctrl_z': ({undo}) => undo(),
  'cmd_z': ({undo}) => undo(),
  'ctrl_y': ({redo}) => redo(),
  'cmd_y': ({redo}) => redo(),
  'ctrl_s': ({save}) => save(),
  'cmd_s': ({save}) => save(),
}

const registeredKeyCodes: string[] = []

export function useKeyboardShortcuts({ shortcuts = defaultShortcuts, angleSnapOnShift = true }: UseKeyboardShortcutsOptions = {}): Tool<KeyboardShortcuts> {
  const type = 'keyboard-shortcuts'

  const activeElement = useActiveElement()
  const notUsingInput = computed(() =>
    activeElement.value?.tagName !== 'INPUT' &&
    activeElement.value?.tagName !== 'TEXTAREA'
  )

  const keys = useMagicKeys({ 
    passive: false,
    onEventFired(e) {
      if ((e.ctrlKey || e.metaKey) && (['s', 'z', 'y'].includes(e.key)) && e.type === 'keydown')
        e.preventDefault()
    },
  })
  const { getActiveEditor } = useActiveEditor()

  async function onInitialize() {
    Object.entries(shortcuts).forEach(([keycode, callback]) => {
      if (registeredKeyCodes.includes(keycode)) {
        return
      }
      whenever(logicAnd(keys[keycode], notUsingInput), () => {
        callback(getActiveEditor())
      })
      registeredKeyCodes.push(keycode)
    })

    if (angleSnapOnShift) {
      watch(keys.shift, () => {
        getActiveEditor().settings.value.angleSnap = keys.shift.value
      })
    }
  }

  return { type, onInitialize }
}
