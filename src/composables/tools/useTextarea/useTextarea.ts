import type { DrawEvent, Tool } from '@/types'
import { shapeSvgComponent } from '@/utils/shapeSvgComponent'
import { h, ref } from 'vue'

export interface Textarea {
  type: 'textarea'
  x: number
  y: number
  height: number
  width: number
  fontSize: number
  color: string
  content: string
}

export function useTextarea(): Tool<Textarea> {
  const type = 'textarea'

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m18.5 4l1.16 4.35l-.96.26c-.45-.87-.91-1.74-1.44-2.18C16.73 6 16.11 6 15.5 6H13v10.5c0 .5 0 1 .33 1.25c.34.25 1 .25 1.67.25v1H9v-1c.67 0 1.33 0 1.67-.25c.33-.25.33-.75.33-1.25V6H8.5c-.61 0-1.23 0-1.76.43c-.53.44-.99 1.31-1.44 2.18l-.96-.26L5.5 4z"/></svg>`

  function onDraw({ settings, minX, minY, maxX, maxY }: DrawEvent): Textarea | undefined {
    return {
      type,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      fontSize: settings.thickness * 10,
      color: settings.color,
      content: ""
    }
  }

  function onDrawEnd({ settings, minX, minY, maxX, maxY }: DrawEvent): Promise<Textarea | undefined> {
    const dimensions = Object.freeze({
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    })
    // This is a little trick to delay the push of activeShape to history. Resolve the promise when
    // the user clicks outside of the textarea.
    return new Promise((resolve, reject) => {
      const element = document.querySelector<HTMLTextAreaElement>("svg textarea.is-active")
      if (element === null) {
        reject("Could not find the textarea")
      } else {
        element.focus()
        element.onpointerdown = ev => ev.stopPropagation()
        element.onpointermove = ev => ev.stopPropagation()
        element.onpointerup = ev => ev.stopPropagation()
        element.onblur = () => {
          if (!element.value?.length) {
            resolve(undefined)
          }
          const content = element.value
          element.value = ""
          resolve({
            type,
            ...dimensions,
            fontSize: settings.thickness * 10,
            color: settings.color,
            content
          })
        }
      }
    })
  }

  const shapeSvg = shapeSvgComponent<Textarea>((textarea, { isActive }) =>
    h('foreignObject', {
      x: textarea.x,
      y: textarea.y,
      width: textarea.width,
      height: textarea.height,
    }, h('textarea', {
      class: isActive ? 'is-active textarea' : 'textarea',
      style: `font-size: ${textarea.fontSize}px; color: ${textarea.color}`,
      disabled: !isActive,
      innerHTML: textarea.content
    }))
  )

  const svgStyle = `
    .textarea {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      resize: none;
      touch-action: none;
      user-select: none;
      overflow: hidden;
      font-family: Arial;
      padding: 1px;
      cursor: inherit;
    }

    .textarea.is-active {
      border: 1px dashed #777;
      padding: 0;
      cursor: text;
    }
  `

  return { type, icon, onDraw, onDrawEnd, shapeSvg, svgStyle }
}
