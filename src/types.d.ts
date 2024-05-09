
export interface State {
    crop?: Crop
    history: Shape[]
    settings: Settings
}

export interface Settings {
    tool: Tool
    thickness: number
    color: string
}

export interface Crop {
    x: number
    y: number
    height: number
    width: number
}

export type Shape = Rectangle | Line | Arrow

export interface Rectangle {
    type: "rectangle"
    x: number
    y: number
    height: number
    width: number
    thickness: number
    color: string
}

export interface Line {
    type: "line"
    x1: number
    y1: number
    x2: number
    y2: number
    thickness: number
    color: string
}

export interface Arrow extends Line {
    type: "arrow"
}

export type Tool = "crop" | "line" | "rectangle" | "arrow"

export interface SaveParameters {
    svg: Ref<SVGElement>
    crop: Ref<Crop | undefined>
}