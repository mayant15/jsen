import { VM } from './vm'
import { describe, it, expect } from '@jest/globals'
import { createAddInstr, createCreateInstr, createDivInstr, createMulInstr, createPushInstr, createSubInstr, EAsmValueType } from '../common/asm'

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
            const { kind, data } = vm.run()
            expect(kind).toBe(EAsmValueType.NUMBER)
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
            const { kind, data } = vm.run()
            expect(kind).toBe(EAsmValueType.STRING)
            expect(data).toBe('abcd')
        })
    })

    describe('MUL', () => {
        it('should return 2 * 3 = 6', () => {
            const vm = new VM({
                instrs: [
                    createPushInstr({
                        kind: EAsmValueType.NUMBER,
                        data: 2,
                    }),
                    createPushInstr({
                        kind: EAsmValueType.NUMBER,
                        data: 3,
                    }),
                    createMulInstr(),
                ],
                labels: {}
            })
            const { kind, data } = vm.run()
            expect(kind).toBe(EAsmValueType.NUMBER)
            expect(data).toBe(6)
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
            const { kind, data } = vm.run()
            expect(kind).toBe(EAsmValueType.NUMBER)
            expect(data).toBe(-1)
        })
    })

    describe('DIV', () => {
        it('should return 6 / 3 = 2', () => {
            const vm = new VM({
                instrs: [
                    createPushInstr({
                        kind: EAsmValueType.NUMBER,
                        data: 3,
                    }),
                    createPushInstr({
                        kind: EAsmValueType.NUMBER,
                        data: 6,
                    }),
                    createDivInstr(),
                ],
                labels: {}
            })
            const { kind, data } = vm.run()
            expect(kind).toBe(EAsmValueType.NUMBER)
            expect(data).toBe(2)
        })
    })

    describe('PUSH', () => {
        it('should return last pushed value', () => {
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
                ],
                labels: {}
            })
            const { kind, data } = vm.run()
            expect(kind).toBe(EAsmValueType.NUMBER)
            expect(data).toBe(1)
        })
    })

    describe('CREATE', () => {
        it('should push allocated address to the stack', () => {
            const vm = new VM({
                instrs: [
                    createCreateInstr(),
                ],
                labels: {}
            })
            const { kind, data } = vm.run()

            // Accessing private field _heap
            // @ts-ignore
            const obj = vm._heap.get(data)

            expect(kind).toBe(EAsmValueType.OBJECT)
            expect(obj).not.toBeNull()
        })

        it('should create empty object in heap', () => {
            const vm = new VM({
                instrs: [
                    createCreateInstr(),
                ],
                labels: {}
            })
            const { data } = vm.run()

            // Accessing private field _heap
            // @ts-ignore
            const obj = vm._heap.get(data)

            expect(obj).toEqual({})
        })
    })
})

