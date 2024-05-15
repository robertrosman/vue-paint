import { type Freehand } from '@/composables/tools/useFreehand'
import { type Line } from '@/composables/tools/useLine'
import { type Arrow } from '@/composables/tools/useArrow'
import { type Rectangle } from '@/composables/tools/useRectangle'
import { type Crop } from '@/composables/tools/useCrop'
import type { Background } from './composables/tools/useBackground'

export interface Settings {
    tool: Tool
    thickness: number
    color: string
    width: number
    height: number
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

export interface ToolComposable<T> {
    type: string
    icon?: string
    initialize?: (args: InitializeOptions) => Promise<T | T[] | void>
    onDrawStart?: (args: DrawEvent) => T | void | undefined
    onDraw?: (args: DrawEvent) => T | void | undefined
    onDrawEnd?: (args: DrawEvent) => T | void | undefined
    shapeSvg?: {
        props: unknown,
        setup: (props: ShapeSvgProps) => () => unknown
    }
    svgStyle?: string
    toolSvg?: {
        props: unknown,
        setup: (props: ToolSvgProps) => () => unknown,
        layer?: number
    }
    beforeExport?: (args: ExportParameters) => void
}

export interface DrawEvent {
    settings: Settings
    tools: ToolComposable<Shape>[]
    activeShape: Ref<Shape | undefined>
    x: Ref<number>,
    y: Ref<number>,
    posStart: Position
    posEnd: Position
    isDrawing: Ref<boolean>
    left: Ref<number>
    right: Ref<number>
    top: Ref<number>
    bottom: Ref<number>
    width: Ref<number>
    height: Ref<number>
    minX: Ref<number>
    maxX: Ref<number>
    minY: Ref<number>
    maxY: Ref<number>
}

export interface InitializeOptions {
    tools: ToolComposable<Shape>[]
}

export type Shape = Freehand | Crop | Rectangle | Line | Arrow | Background

export type Tool = Shape["type"]

export interface SaveParameters {
    svg: SVGElement
    tools: ToolComposable<Shape>[]
    history: Shape[]
}

export interface ExportParameters extends SaveParameters { }