// Inspired by https://stackoverflow.com/a/58569300/829505
export function createDataUrl(blob: Blob) {
  return new Promise<string>(function (resolve, reject) {
    const reader = new FileReader()

    reader.onloadend = function () {
      resolve(reader.result as string)
    }

    reader.onerror = function () {
      reject()
    }

    reader.readAsDataURL(blob)
  })
}
