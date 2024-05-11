import { type Line } from '@/composables/tools/useLine'
import { type Arrow } from '@/composables/tools/useArrow'
import { type Rectangle } from '@/composables/tools/useRectangle'
import { type Crop } from '@/composables/tools/useCrop'

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
    toShape: (args: ToShapeArguments) => T
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
}

export interface ToShapeArguments {
    settings: Settings
    posStart: Position
    posEnd: Position
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

export type Shape = Crop | Rectangle | Line | Arrow

export type Tool = Shape["type"]

export interface SaveParameters {
    svg: Ref<SVGElement>
    crop: Ref<Crop | undefined>
}

export { Crop }
