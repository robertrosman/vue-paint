/** 
 * Simple function to generate a random id. It is "unique" in the sense "the chance for collision is small enough", but not universally unique.
 * The generated id will start with a letter in order to be a valid css selector.
 */
export function randomId() {
    return [26, 36, 36, 36, 36, 36, 36].map(x => 
        Math.floor(Math.random() * x + (36 - x))
        .toString(36)
    )
    .join('')
}