import { useDraw } from '@/composables/useDraw'
import { randomId } from '@/utils/randomId'
import type { DrawEvent, ImageHistory, Settings, Shape, Tool, ToolType } from '../types'
import { computed, ref, type ComponentPublicInstance, type Ref } from 'vue'
import { useActiveEditor } from './useActiveEditor'

export interface UseEditorOptions {
  vpImage: Ref<ComponentPublicInstance>
  tools: Tool<any>[]
  history: Ref<ImageHistory<Tool<any>[]>>
  settings: Ref<Settings>
  width: Ref<number>
  height: Ref<number>
  emit?: Function
}

export function useEditor({ vpImage, tools, history, settings, width, height, emit }: UseEditorOptions) {
  
  const redoHistory = ref<Shape[]>([])
  const activeShape = ref<Shape | undefined>()
  const temporaryTool = ref<string>()
  
  function getActiveTool() {
    return tools?.find((tool) => tool.type === (temporaryTool.value ?? settings.value.tool))
  }

  const snapAngles = computed(() => settings.value.angleSnap ? getActiveTool()?.snapAngles : undefined)
  
  const drawEvent = computed<DrawEvent>(() => ({
    settings: settings.value,
    activeShape: activeShape.value,
    id: activeShape.value?.id ?? randomId(),
    isDrawing: isDrawing.value,
    tools,
    posStart,
    posEnd,
    left: left.value,
    right: right.value,
    top: top.value,
    bottom: bottom.value,
    width,
    height,
    x: x.value,
    y: y.value,
    minX: minX.value,
    maxX: maxX.value,
    minY: minY.value,
    maxY: maxY.value,
    absoluteX: absoluteX.value,
    absoluteY: absoluteY.value
  }))

  const {
    x,
    y,
    minX,
    minY,
    maxX,
    maxY,
    top,
    left,
    bottom,
    right,
    posStart,
    posEnd,
    isDrawing,
    absoluteX,
    absoluteY
  } = useDraw({
    target: vpImage,
    width,
    height,
    snapAngles,
    onDrawStart() {
      temporaryTool.value = document.elementsFromPoint(absoluteX.value, absoluteY.value)?.[0]
      ?.getAttribute('class')?.split(' ')
      .find(c => c.startsWith('use-tool-'))
      ?.substring(9)
      activeShape.value = getActiveTool()?.onDrawStart?.(drawEvent.value) ?? activeShape.value
      emit?.('drawStart', drawEvent.value)
      setActiveEditor(editor)
    },
    onDraw() {
      activeShape.value = getActiveTool()?.onDraw?.(drawEvent.value) ?? activeShape.value
      emit?.('draw', drawEvent.value)
      setActiveEditor(editor)
    },
    async onDrawEnd() {
      activeShape.value = getActiveTool()?.onDrawEnd
      ? await getActiveTool()?.onDrawEnd?.(drawEvent.value)
      : activeShape.value
      temporaryTool.value = undefined
      emit?.('drawEnd', drawEvent.value)
      setActiveEditor(editor)
      if (activeShape.value) {
        history.value.push(activeShape.value)
        redoHistory.value = []
        activeShape.value = undefined
      }
    }
  })

  function setTool(tool: ToolType) {
    settings.value.tool = tool
    setActiveEditor(editor)
  }

  function undo() {
    if (history.value.length) {
      redoHistory.value.push(...history.value.slice(-1))
      history.value = history.value.slice(0, -1)
    }
    setActiveEditor(editor)
  }
  
  function redo() {
    if (redoHistory.value.length) {
      history.value.push(...redoHistory.value.slice(-1))
      redoHistory.value = redoHistory.value.slice(0, -1)
    }
    setActiveEditor(editor)
  }
  
  function save() {
    const svg = vpImage.value.$refs.svg
    if (!svg) {
      throw new Error("Couldn't find the svg")
    }
    emit?.('save', { svg, tools, history: history.value })
    setActiveEditor(editor)
  }
  
  async function reset() {
    redoHistory.value = history.value.reverse()
    history.value = []
    const shapes = await Promise.all(
      tools
      .filter((tool) => 'onInitialize' in tool)
      .flatMap(async (tool) => await tool.onInitialize?.({ tools, settings, history }))
    )
    history.value = [...shapes.filter(Boolean), ...history.value]
    emit?.('reset')
    setActiveEditor(editor)
  }

  const editor = {
    settings,
    activeShape,
    setTool,
    undo,
    redo,
    save,
    reset,
    x,
    y,
    minX,
    minY,
    maxX,
    maxY,
    top,
    left,
    bottom,
    right,
    posStart,
    posEnd,
    isDrawing,
    absoluteX,
    absoluteY
  }

  const { setActiveEditor } = useActiveEditor()
  setActiveEditor(editor)

  return editor
}