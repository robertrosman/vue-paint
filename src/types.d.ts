import { type Line } from '@/composables/tools/useLine'
import { type Arrow } from '@/composables/tools/useArrow'
import { type Rectangle } from '@/composables/tools/useRectangle'
import { type Crop } from '@/composables/tools/useCrop'
import type { Background } from './composables/tools/useBackground'

export interface Settings {
    tool: Tool
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

export interface ToolComposable<T> {
    type: string
    initialize?: (args: InitializeOptions) => Promise<T | T[] | void>
    onDrawStart?: (args: DrawEvent) => T | undefined
    onDraw?: (args: DrawEvent) => T | undefined
    onDrawEnd?: (args: DrawEvent) => T | undefined
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
    tools: ToolComposable<unknown>[]
    activeShape: Ref<Shape | undefined>
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
    tools: ToolComposable<unknown>[]
}

export type Shape = Crop | Rectangle | Line | Arrow | Background

export type Tool = Shape["type"]

export interface SaveParameters {
    svg: SVGElement
    tools: ToolComposable<unknown>[]
    history: Shape[]
}

export interface ExportParameters extends SaveParameters { }