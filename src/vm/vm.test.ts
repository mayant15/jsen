import { VM } from './vm'
import { describe, it, expect } from '@jest/globals'
import { createAddInstr, createPushInstr, createSubInstr, EAsmValueType } from '../common/asm'

describe('vm', () => {
    describe('ADD', () => {
        it('should return 1 + 2 = 3', () => {
            const vm = new VM({
                instrs: [
                    createPushInstr({
                        kind: EAsmValueType.NUMBER,
                        data: 2,
                    }),
                    createPushInstr({
                        kind: EAsmValueType.NUMBER,
                        data: 1,
                    }),
                    createAddInstr(),
                ],
                labels: {}
            })
            const { data } = vm.run()
            expect(data).toBe(3)
        })

        it("should return 'ab' + 'cd' = 'abcd'", () => {
            const vm = new VM({
                instrs: [
                    createPushInstr({
                        kind: EAsmValueType.STRING,
                        data: 'cd',
                    }),
                    createPushInstr({
                        kind: EAsmValueType.STRING,
                        data: 'ab',
                    }),
                    createAddInstr(),
                ],
                labels: {}
            })
            const { data } = vm.run()
            expect(data).toBe('abcd')
        })
    })

    describe('SUB', () => {
        it('should return 1 - 2 = -1', () => {
            const vm = new VM({
                instrs: [
                    createPushInstr({
                        kind: EAsmValueType.NUMBER,
                        data: 2,
                    }),
                    createPushInstr({
                        kind: EAsmValueType.NUMBER,
                        data: 1,
                    }),
                    createSubInstr(),
                ],
                labels: {}
            })
            const { data } = vm.run()
            expect(data).toBe(-1)
        })
    })
})

