/**
 * Use this function to fetch a url and convert in into a Blob. Useful when you want to set a background image to your editor.
 * @example
 * const blob = await urlToBlob(url)
 *
 */
export async function urlToBlob(url: string) {
  return fetch(url).then((res) => res.blob())
}
