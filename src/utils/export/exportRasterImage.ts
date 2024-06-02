import type { ExportParameters } from '@/types'
import { unref, type MaybeRef } from 'vue'
import { exportToCanvas } from './exportToCanvas'

interface Options extends ExportParameters {
  imageType: MaybeRef<'png' | 'jpeg' | 'jpg' | 'webp'>
}

/** Export your image to a png, jpeg or webp with this function. there is wrapper functions for each format if your prefer. */
export async function exportRasterImage({ svg, imageType, tools, history }: Options) {
  const canvas = document.createElement('canvas')
  await exportToCanvas({ svg, tools, history, canvas })
  return canvas.toDataURL(`image/${unref(imageType).replace('jpg', 'jpeg')}`)
}
