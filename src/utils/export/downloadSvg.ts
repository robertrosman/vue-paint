import type { ExportParameters } from '@/types'
import { exportSvg } from './exportSvg'
import { downloadFile } from '../downloadFile'

// Inspired from https://stackoverflow.com/a/15832662/829505
export function downloadSvg({ svg, history, tools }: ExportParameters) {
  const uri = exportSvg({ svg, history, tools })
  downloadFile(uri, 'image.svg')
}
