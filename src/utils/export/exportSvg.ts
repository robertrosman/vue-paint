import type { ExportParameters } from '@/types'
import { unref } from 'vue'

// Inspired by https://jsfiddle.net/Wijmo5/h2L3gw88/
export function exportSvg({ svg, history, tools }: ExportParameters) {
  // get svg data
  const clone = unref(svg).cloneNode(true) as SVGElement
  tools.forEach((tool) => tool.beforeExport?.({ svg: clone, history, tools }))
  if ((!clone.hasAttribute('width') || !clone.hasAttribute('height')) && clone.hasAttribute('viewBox')) {
    const viewBox = clone.getAttribute('viewBox')!.split(' ')
    clone.setAttribute('width', viewBox[2])
    clone.setAttribute('height', viewBox[3])
  }
  const xml = new XMLSerializer().serializeToString(clone)

  // make it base64
  const svg64 = btoa(xml)

  // prepend a "header"
  return `data:image/svg+xml;base64,${svg64}`
}
