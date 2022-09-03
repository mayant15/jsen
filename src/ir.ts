export class Stack<T> {
    private _data: T[];

    constructor() {
        this._data = []
    }

    push(x: T) {
        this._data.push(x);
    }

    pop(): T {
        const val = this._data.pop()
        if (val === undefined) {
            throw Error('[vm] attempted to pop an empty stack')
        }
        return val
    }
}

// A VM opcode pops n items from the stack, operates on them, then pushes the result onto the stack
export enum EOpCode {
    ADD = 'ADD',  // a = pop(), b = pop(), push(a + b)
    SUB = 'SUB',  // a = pop(), b = pop(), push(a - b)
    MUL = 'MUL',  // a = pop(), b = pop(), push(a * b)
    DIV = 'DIV',  // a = pop(), b = pop(), push(a / b)
    PUSH = 'PUSH', // Pushes an IRValue to the stack
}

export type AddInstr = {
    readonly opcode: EOpCode.ADD
    readonly argc: 2
}

export const createAddInstr = (): AddInstr => ({
    opcode: EOpCode.ADD,
    argc: 2
})

export type SubInstr = {
    readonly opcode: EOpCode.SUB
    readonly argc: 2
}

export type MulInstr = {
    readonly opcode: EOpCode.MUL
    readonly argc: 2
}

export type DivInstr = {
    readonly opcode: EOpCode.DIV
    readonly argc: 2
}

export type PushInstr = {
    readonly opcode: EOpCode.PUSH
    readonly data: IRValue
    readonly argc: 1
}

export const createPushInstr = (value: IRValue): PushInstr => ({
    opcode: EOpCode.PUSH,
    data: value,
    argc: 1
})

export type Instr = AddInstr | SubInstr | MulInstr | DivInstr | PushInstr

export enum EIRValueType {
    STRING,
    NUMBER,
    OBJECT,
}

type StringIRValue = {
    kind: EIRValueType.STRING
    data: string
}

type NumberIRValue = {
    kind: EIRValueType.NUMBER
    data: number
}

type ObjectIRValue = {
    kind: EIRValueType.OBJECT
    data: Record<string, unknown>
}

export type IRValue = StringIRValue | NumberIRValue | ObjectIRValue

export type Program = Instr[]

