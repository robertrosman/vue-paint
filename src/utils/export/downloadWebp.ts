import type { ExportParameters } from '@/types'
import { downloadFile } from '../downloadFile'
import { exportWebp } from './exportWebp'

interface DownloadWebpOptions extends ExportParameters {
  filename?: string
}

/** Export and download file as a webp image. If you want a custom filename you can pass it as an option. */
export async function downloadWebp({ svg, history, tools, filename = 'image.webp' }: DownloadWebpOptions) {
  const uri = await exportWebp({ svg, history, tools })
  downloadFile(uri, filename)
}
