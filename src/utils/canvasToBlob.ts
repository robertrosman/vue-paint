/**
 * Use this function to easily convert a canvas into a Blob in an async manner. Useful when you want to set a background image to your editor.
 * @example
 * const blob = await canvasToBlob(canvasElement)
 */
export async function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject("Couldn't create blob")))
  )
}
