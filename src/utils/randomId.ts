/** Simple function to generate a random id. It is "unique" in the sense "the chance for collision is small enough", but not universally unique. */
export function randomId(seed: number = Math.random() * 36 * 36 * 36 * 36 * 36 * 36 * 36) {
    return Math.round(seed).toString(36).padStart(7, '0')
}