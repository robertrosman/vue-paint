import type { ExportParameters } from '@/types'
import { downloadFile } from '../downloadFile'
import { exportJpg } from './exportJpg'

interface DownloadJpgOptions extends ExportParameters {
  filename?: string
}

/** Export and download file as a jpg image. If you want a custom filename you can pass it as an option. */
export async function downloadJpg({ svg, history, tools, filename = 'image.jpg' }: DownloadJpgOptions) {
  const uri = await exportJpg({ svg, history, tools })
  downloadFile(uri, filename)
}
