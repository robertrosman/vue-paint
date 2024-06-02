import type { ExportParameters } from '@/types'
import { exportSvg } from './exportSvg'
import { downloadFile } from '../downloadFile'

interface DownloadSvgOptions extends ExportParameters {
  filename?: string
}

// Inspired from https://stackoverflow.com/a/15832662/829505
/** Export and download file as an svg image. This is probably the preferred format in most cases since it
 * is the smallest and most performant option, while keeping the highest quality.
 * If you want a custom filename you can pass it as an option. */
export function downloadSvg({ svg, history, tools, filename = 'image.svg' }: DownloadSvgOptions) {
  const uri = exportSvg({ svg, history, tools })
  downloadFile(uri, filename)
}
