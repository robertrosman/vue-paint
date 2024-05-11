import { type Line } from '@/composables/tools/useLine'
import { type Arrow } from '@/composables/tools/useArrow'
import { type Rectangle } from '@/composables/tools/useRectangle'
import { type Crop } from '@/composables/tools/useCrop'

export interface Settings {
    tool: Tool
    thickness: number
    color: string
}

export interface ToolComposable<T> {
    type: string
    toShape: (args: ToShapeArguments) => T
    svgShape?: {
        props: { shape: Object },
        setup: (props: { shape: T }) => () => unknown
    }
    svgStyle?: string
    svgDefs?: {
        props: { history: Array, activeShape: Object },
        setup: (props: { history: Shape[], activeShape?: Shape }) => () => unknown
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
