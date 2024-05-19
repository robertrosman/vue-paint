import { type Freehand } from '@/composables/tools/useFreehand'
import { type Line } from '@/composables/tools/useLine'
import { type Arrow } from '@/composables/tools/useArrow'
import { type Rectangle } from '@/composables/tools/useRectangle'
import { type Crop } from '@/composables/tools/useCrop'
import type { Background } from './composables/tools/useBackground'
import type { Ref } from 'vue'
import type { Position } from '@vueuse/core'

export interface Settings {
  tool: ToolType
  thickness: number
  color: string
}

export interface SvgComponentProps {
  history: Shape[]
  width: number
  height: number
}

export interface ShapeSvgProps<T> extends SvgComponentProps {
  shape: T
}
export interface ToolSvgProps extends SvgComponentProps {
  activeShape?: Shape
}

export interface BaseShape {
  type: unknown
}

export interface Tool<T extends BaseShape> {
  type: T['type']
  icon?: string
  initialize?: (args: InitializeOptions) => Promise<T | T[] | void>
  onDrawStart?: (args: DrawEvent) => T | void | undefined
  onDraw?: (args: DrawEvent) => T | void | undefined
  onDrawEnd?: (args: DrawEvent) => T | void | undefined
  shapeSvg?: {
    props: unknown
    setup: (props: ShapeSvgProps<T>) => () => unknown
  }
  svgStyle?: string
  toolSvg?: {
    props: unknown
    setup: (props: ToolSvgProps) => () => unknown
    layer?: number
  }
  beforeExport?: (args: ExportParameters) => void
}

type ExtractGeneric<Type> = Type extends Tool<infer S> ? S : never
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

/**
 * ImageHistory is a list of all actions the user has made to create an image. It's based on the tools you've decided to include, to you need to pass "typeof tools" as generic, like this:
 * @example
 * const tools = [useArrow(), useCrop()]
 * const history: ref<ImageHistory<typeof tools>>([])
 */
export type ImageHistory<Tools extends Array<unknown>> = ExtractGeneric<ArrayElement<Tools>>[]

export interface DrawEvent {
  settings: Settings
  tools: Tool<Shape>[]
  activeShape: Ref<Shape | undefined>
  width: number
  height: number
  x: Ref<number>
  y: Ref<number>
  posStart: Position
  posEnd: Position
  isDrawing: Ref<boolean>
  left: Ref<number>
  right: Ref<number>
  top: Ref<number>
  bottom: Ref<number>
  minX: Ref<number>
  maxX: Ref<number>
  minY: Ref<number>
  maxY: Ref<number>
}

export interface InitializeOptions {
  tools: Tool<Shape>[]
}

export type Shape = Freehand | Crop | Rectangle | Line | Arrow | Background

export type ToolType = Shape['type']

export interface SaveParameters {
  svg: SVGElement
  tools: Tool<Shape>[]
  history: Shape[]
}

export interface ExportParameters extends SaveParameters {}
