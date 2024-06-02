import type { ExportParameters } from '@/types'
import { downloadFile } from '../downloadFile'
import { exportPng } from './exportPng'

interface DownloadPngOptions extends ExportParameters {
  filename?: string
}

/** Export and download file as a png image. If you want a custom filename you can pass it as an option. */
export async function downloadPng({ svg, history, tools, filename = 'image.png' }: DownloadPngOptions) {
  const uri = await exportPng({ svg, history, tools })
  downloadFile(uri, filename)
}
