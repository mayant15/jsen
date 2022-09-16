import { describe, it, expect } from '@jest/globals'
import { EAsmValueType } from '../common/asm'
import { compileAndExecute } from '../wrapper'

describe('variables', () => {
    describe('const', () => {
        it('should work in add expressions', () => {
            const { kind, data } = compileAndExecute(`const x = 2; x + 1`)
            expect(kind).toBe(EAsmValueType.NUMBER)
            expect(data).toBe(3)
        })
    })
})

