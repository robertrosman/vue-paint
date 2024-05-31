
export function downloadFile(uri: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}