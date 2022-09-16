import { describe, it, expect } from '@jest/globals'
import { EAsmValueType } from '../common/asm'
import { compileAndExecute } from '../wrapper'

describe('variables', () => {
    describe('const', () => {
        it('should work in numeric add expressions with literals', () => {
            const { kind, data } = compileAndExecute(`const x = 2; x + 1`)
            expect(kind).toBe(EAsmValueType.NUMBER)
            expect(data).toBe(3)
        })

        it('should work in numeric add expressions with other variables', () => {
            const { kind, data } = compileAndExecute(`const x = 2; const y = 4; x + y`)
            expect(kind).toBe(EAsmValueType.NUMBER)
            expect(data).toBe(6)
        })

        it('should work in string add expressions with literals', () => {
            const { kind, data } = compileAndExecute(`const x = 'ab'; x + 'cd'`)
            expect(kind).toBe(EAsmValueType.STRING)
            expect(data).toBe('abcd')
        })

        it('should work in string add expressions with other variables', () => {
            const { kind, data } = compileAndExecute(`const x = 'ab'; const y = 'cd'; x + y`)
            expect(kind).toBe(EAsmValueType.STRING)
            expect(data).toBe('abcd')
        })
    })
})

