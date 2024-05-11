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

export interface SvgShapeProps<T> extends SvgComponentProps {
    shape: T
}
export interface SvgOnceProps extends SvgComponentProps {
    activeShape?: Shape
}

export interface SvgDefsProps extends SvgComponentProps {
    activeShape?: Shape
}

export interface ToolComposable<T> {
    type: string
    toShape: (args: ToShapeArguments) => T
    svgShape?: {
        props: unknown,
        setup: (props: SvgShapeProps) => () => unknown
    }
    svgStyle?: string
    svgDefs?: {
        props: unknown,
        setup: (props: SvaDefsProps) => () => unknown
    }
    svgOnce?: {
        props: unknown,
        setup: (props: SvgOnceProps) => () => unknown,
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
