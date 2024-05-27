import { randomId } from "@/utils/randomId";
import { describe, expect, it } from "vitest";


describe('randomId', () => {
    it('should return a string', () => {
        const id = randomId()
        expect(typeof id).toBe('string')
    })

    it('should return a 7 letter string padded with zeros', () => {
        const id = randomId(100)
        expect(id).toBe('000002s')
    })
})