import type { ExportParameters } from '@/types'
import { exportRasterImage } from './exportRasterImage'

/** Exports your image to a jpg data url. If you want to show it in your browser, exportToSvg provides much better quality and performance. */
export async function exportJpg({ svg, tools, history }: ExportParameters) {
  return exportRasterImage({ svg, tools, history, imageType: 'jpg' })
}
