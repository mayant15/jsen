// A VM opcode pops n items from the stack, operates on them, then pushes the result onto the stack
export enum EOpCode {
    ADD = 'ADD',  // a = pop(), b = pop(), push(a + b)
    SUB = 'SUB',  // a = pop(), b = pop(), push(a - b)
    MUL = 'MUL',  // a = pop(), b = pop(), push(a * b)
    DIV = 'DIV',  // a = pop(), b = pop(), push(a / b)
    PUSH = 'PUSH', // Pushes an AsmValue to the stack

    // Object manipulation
    CREATE = 'CREATE', // create an object and push the address on the stack
    DESTROY = 'DESTROY', // a = pop(), delete a
    SET_PROP = 'SET_PROP', // c = pop(), b = pop(), a = pop(), a.b = c, push(a)
    GET_PROP = 'GET_PROP', // b = pop(), a = pop(), push(a.b)

    // Symbols
    SET_SYM = 'SET_SYM', // b = pop(), a = pop(), symbols[a] = b -- Set a value 'b' to an identifier 'a' in the runtime symbol table
    GET_SYM = 'GET_SYM' // a = pop(), push(symbols[a]) -- Fetch a symbol from the VM symbol table and push to the stack
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

export const createSubInstr = (): SubInstr => ({
    opcode: EOpCode.SUB,
    argc: 2
})

export type MulInstr = {
    readonly opcode: EOpCode.MUL
    readonly argc: 2
}

export const createMulInstr = (): MulInstr => ({
    opcode: EOpCode.MUL,
    argc: 2
})

export type DivInstr = {
    readonly opcode: EOpCode.DIV
    readonly argc: 2
}

export const createDivInstr = (): DivInstr => ({
    opcode: EOpCode.DIV,
    argc: 2
})

export type PushInstr = {
    readonly opcode: EOpCode.PUSH
    readonly data: AsmValue
    readonly argc: 1
}

export const createPushInstr = (value: AsmValue): PushInstr => ({
    opcode: EOpCode.PUSH,
    data: value,
    argc: 1
})

export type CreateInstr = {
    readonly opcode: EOpCode.CREATE
}

export const createCreateInstr = (): CreateInstr => ({
    opcode: EOpCode.CREATE
})

export type DestroyInstr = {
    readonly opcode: EOpCode.DESTROY
}

export const createDestroyInstr = (): DestroyInstr => ({
    opcode: EOpCode.DESTROY
})

export type GetPropInstr = {
    readonly opcode: EOpCode.GET_PROP
}

export const createGetPropInstr = (): GetPropInstr => ({
    opcode: EOpCode.GET_PROP
})

export type SetPropInstr = {
    readonly opcode: EOpCode.SET_PROP
}

export const createSetPropInstr = (): SetPropInstr => ({
    opcode: EOpCode.SET_PROP
})

export type SetSymInstr = {
    readonly opcode: EOpCode.SET_SYM
}

export const createSetSymInstr = (): SetSymInstr => ({
    opcode: EOpCode.SET_SYM
})

export type GetSymInstr = {
    readonly opcode: EOpCode.GET_SYM
}

export const createGetSymInstr = (): GetSymInstr => ({
    opcode: EOpCode.GET_SYM
})

export type Instr = AddInstr | SubInstr | MulInstr | DivInstr | PushInstr | CreateInstr | DestroyInstr | GetPropInstr | SetPropInstr | SetSymInstr | GetSymInstr

export enum EAsmValueType {
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    OBJECT = 'OBJECT',
}

type StringAsmValue = {
    kind: EAsmValueType.STRING
    data: string
}

type NumberAsmValue = {
    kind: EAsmValueType.NUMBER
    data: number
}

type ObjectAsmValue = {
    kind: EAsmValueType.OBJECT
    /* An object AsmValue is a reference to a location on the heap */
    data: number
}

export type AsmValue = StringAsmValue | NumberAsmValue | ObjectAsmValue

// TODO: Use -1 as undefined for now
export const UndefinedAsmValue: NumberAsmValue = {
    kind: EAsmValueType.NUMBER,
    data: -1
}

export type Program = {
    instrs: Instr[]

    // Mapping from label name to index in instrs
    labels: Record<string, number>
}

