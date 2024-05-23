import { type Freehand } from '@/composables/tools/useFreehand'
import { type Line } from '@/composables/tools/useLine'
import { type Arrow } from '@/composables/tools/useArrow'
import { type Rectangle } from '@/composables/tools/useRectangle'
import { type Crop } from '@/composables/tools/useCrop'
import type { Background } from './composables/tools/useBackground'
import type { Ref } from 'vue'
import type { Position } from '@vueuse/core'

/** These settings are editable by the user and will affect what tool to use and style etc. */
export interface Settings {
  /** What tool the user is currently using. */
  tool: ToolType

  /** The thickness of new shapes. */
  thickness: number

  /** The color of new shapes. */
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

/** Every new shape must extend this base class. */
export interface BaseShape {
  /** What type of shape is produced? Must be unique between tools. */
  type: unknown
}

/**
 * To build a new tool, create a composable that extends this interface, and pass the shape it will produce and add to the history.
 * Most of the properties of this interface are optional, since different tools are triggered by different events. The easiest way to
 * start out is probably to copy an existing tool that is similar to the tool you want to create, and read the descriptions of each
 * property respectively.
 */
export interface Tool<T extends BaseShape> {
  /** The type of the tool. Must be the same as the type of the resulting shape. */
  type: T['type']

  /**
   * If you want to add the tool to the toolbar, you must specify an icon, which is just an svg as a string. A good place to look
   * for free icons is https://iconify.design
   */
  icon?: string

  /**
   * If your tool needs to run any startup logic, you put it in this method. It is async by default and you can return one or multiple
   * shapes if you want (it/they will be added to the beginning of the history), but you don't have to return anything.
   */
  initialize?: (args: InitializeOptions) => Promise<T | T[] | void>

  /**
   * This event will be triggered when the user starts to draw with this tool. If you return a shape it will be set as the activeShape
   * and displayed immediately. It is then added to the history onDrawEnd.
   */
  onDrawStart?: (args: DrawEvent) => T | void | undefined

  /**
   * This event is triggered whenever the user moves their cursor while holding it down. If you return a shape it will be set as the activeShape
   * and displayed immediately. It is then added to the history onDrawEnd.
   */
  onDraw?: (args: DrawEvent) => T | void | undefined

  /**
   * This event is triggered when the user has drawn and then releases their pointer. When this event occurs the activeShape is pushed to
   * the history. If you want to manipulate the shape it in any way, you can return the final result from this method.
   */
  onDrawEnd?: (args: DrawEvent) => T | void | undefined

  /**
   * When the image is rendered, every instance of the shape type this tool produces will be rendered as the component you specify here.
   * It should probably be an svg element found in this documentation: https://developer.mozilla.org/en-US/docs/Web/SVG/Element
   * Note that the setup function must return a render function, which might feel a bit unfamiliar at first, but it's actually really
   * simple once you get the hang of it. The Vue documentation does a really good job explaining how they work:
   * https://vuejs.org/guide/extras/render-function. Look at the existing tools to get inspiration. Note that you can use the utility
   * function shapeSvgComponent if you don't need any extra logic to render your component.
   */
  shapeSvg?: {
    props: unknown
    setup: (props: ShapeSvgProps<T>) => () => unknown
  }

  /**
   * Here you can add styling that can apply to your svg element. Please scope it in classes, like `.your-tool { opacity: 0.5 }` so
   * it doesn't affect other elements in the same svg.
   */
  svgStyle?: string

  /**
   * This is pretty much the same concept as shapeSvg, except it is only rendered once per image. For some tools it might be sufficient
   * to render one element per image (like useCrop), and other tools might need to render some helper elements apart from shapeSvg
   * (like useArrow).
   */
  toolSvg?: {
    props: unknown
    setup: (props: ToolSvgProps) => () => unknown
    layer?: number
  }

  /**
   * Here you can modify the svg that will be exported in the resulting file. Feel free to manipulate args.svg as you need.
   */
  beforeExport?: (args: ExportParameters) => void
}

type ExtractGeneric<Type> = Type extends Tool<infer S> ? S : never
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

/**
 * ImageHistory is a list of all actions the user has made to create an image. It's based on the tools you've decided to include, to you
 * need to pass "typeof tools" as generic, like this:
 * @example
 * const tools = [useArrow(), useCrop()]
 * const history: ref<ImageHistory<typeof tools>>([])
 */
export type ImageHistory<Tools extends Array<unknown>> = ExtractGeneric<ArrayElement<Tools>>[]

/**
 * These are the arguments passed to onDrawStart, onDraw and onDrawEnd. Use what you need to create your shape.
 */
export interface DrawEvent {
  /** The user settings like color and thickness. Note that any values you want to use in your shape should be copied over. */
  settings: Settings

  /** The tools the user has access to. That will also define what shapes the history might have. */
  tools: Tool<Shape>[]

  /** The shape that is currently being drawn. */
  activeShape: Shape | undefined

  /** The width of the image in pixels. Note that it might be scaled down by the browser, but this is the base all other values will relate to. */
  width: number

  /** The height of the image in pixels. Note that it might be scaled down by the browser, but this is the base all other values will relate to. */
  height: number

  /** The X position of the pointer/cursor relative to the image left edge. */
  x: number

  /** The Y position of the pointer/cursor relative to the image top edge. */
  y: number

  /** The position {x, y} of where the pointer started to draw. */
  posStart: Position

  /** The position {x, y} of where the pointer ended to draw. This would equal the current position of the pointer in all of the events. */
  posEnd: Position

  /** Is the user currently drawing? */
  isDrawing: boolean

  /** How far from the window's left edge is the image? */
  left: number

  /** How far from the window's right edge is the image? */
  right: number

  /** How far from the window's top edge is the image? */
  top: number

  /** How far from the window's bottom edge is the image? */
  bottom: number

  /** The smaller number of posStart.x and posEnd.x. It will always be within the boundaries of the image. */
  minX: number

  /** The larger number of posStart.x and posEnd.x. It will always be within the boundaries of the image. */
  maxX: number

  /** The smaller number of posStart.y and posEnd.y. It will always be within the boundaries of the image. */
  minY: number

  /** The larger number of posStart.y and posEnd.y. It will always be within the boundaries of the image. */
  maxY: number
}

export interface InitializeOptions {
  tools: Tool<Shape>[]
}

export type Shape = Freehand | Crop | Rectangle | Line | Arrow | Background

export type ToolType = Shape['type']

/** The parameters sent to the save event. */
export interface SaveParameters {
  /** The actual svg element that will be exported (clone of vp-image) */
  svg: SVGElement

  /** The available tools for the user. */
  tools: Tool<Shape>[]

  /** The complete history */
  history: Shape[]
}

/** The parameters that are provided to the beforeExport method. */
export interface ExportParameters extends SaveParameters {}
