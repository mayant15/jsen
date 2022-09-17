import { AsmValue, EAsmValueType, EOpCode, Instr, Program } from "../common/asm";
import { Heap } from "./heap";
import { Stack } from "./stack";

export type HeapObject = {
    [K in string | number]: AsmValue
}

export class VM {
    private _stack: Stack<AsmValue>
    private _heap: Heap<HeapObject>
    private _program: Program
    private _currentInstrIdx: number

    constructor(program: Program) {
        this._stack = new Stack<AsmValue>();
        this._heap = new Heap<HeapObject>();
        this._program = program;
        this._currentInstrIdx = 0;
    }

    run(): AsmValue {
        while (this._currentInstrIdx < this._program.instrs.length) {
            const nextInstrIdx = this._interpret(this._program.instrs[this._currentInstrIdx])
            this._currentInstrIdx = nextInstrIdx ?? this._currentInstrIdx + 1
        }

        // The top value of the stack is the program's result
        return this._stack.pop()
    }

    // _interpret returns the next instruction index to process, used for call or if instructions
    private _interpret(instr: Instr): number | void {
        switch (instr.opcode) {
            case EOpCode.ADD:
                return this._interpretAdd()
            case EOpCode.SUB:
                return this._interpretSub()
            case EOpCode.MUL:
                return this._interpretMul()
            case EOpCode.DIV:
                return this._interpretDiv()
            case EOpCode.PUSH:
                return this._interpretPush(instr.data)
            case EOpCode.CREATE:
                return this._interpretCreate()
            case EOpCode.DESTROY:
                return this._interpretDestroy()
            case EOpCode.GET_PROP:
                return this._interpretGetProp()
            case EOpCode.SET_PROP:
                return this._interpretSetProp()
            default:
                // If all cases are handled above, TypeScript will give `instr` the type `never`, because
                // this branch will never run. But I still want to keep this here so that I don't have to
                // add this again when I add more opcodes to the enum.
                // @ts-ignore
                throw Error(`[vm] Unsupported instruction: ${instr.opcode.toString()}`)
        }
    }

    private _interpretCreate() {
        const address = this._heap.create()
        this._heap.set(address, {})
        this._stack.push({
            kind: EAsmValueType.OBJECT,
            data: address,
        })
    }

    private _interpretDestroy() {
        const obj = this._stack.pop()
        if (obj.kind !== EAsmValueType.OBJECT) {
            throw Error(`[vm] DESTROY called on a non-object value, type ${obj.kind}`)
        }

        this._heap.destroy(obj.data)
    }

    private _interpretGetProp() {
        const obj = this._stack.pop()
        const key = this._stack.pop()

        if (obj.kind !== EAsmValueType.OBJECT) {
            throw Error(`[vm] GET_PROP called on a non-object value, type ${obj.kind}`)
        }

        if (key.kind !== EAsmValueType.NUMBER && key.kind !== EAsmValueType.STRING) {
            throw Error(`[vm] GET_PROP called with key of type ${key.kind}. Only string and number keys are supported`)
        }

        const heapObj = this._heap.get(obj.data)
        this._stack.push(heapObj[key.data])

    }

    private _interpretSetProp() {
        const obj = this._stack.pop()
        const key = this._stack.pop()
        const value = this._stack.pop()

        if (obj.kind !== EAsmValueType.OBJECT) {
            throw Error(`[vm] SET_PROP called on a non-object value, type ${obj.kind}`)
        }

        if (key.kind !== EAsmValueType.NUMBER && key.kind !== EAsmValueType.STRING) {
            throw Error(`[vm] SET_PROP called with key of type ${key.kind}. Only string and number keys are supported`)
        }

        const heapObj = this._heap.get(obj.data)
        heapObj[key.data] = value
    }

    private _interpretAdd() {
        const a = this._stack.pop();
        const b = this._stack.pop();

        if (a.kind === EAsmValueType.NUMBER && b.kind === EAsmValueType.NUMBER) {
            this._stack.push({
                kind: EAsmValueType.NUMBER,
                data: a.data + b.data
            })
            return
        }

        if (a.kind === EAsmValueType.STRING && b.kind === EAsmValueType.STRING) {
            this._stack.push({
                kind: EAsmValueType.STRING,
                data: a.data + b.data
            })
            return
        }

        if (a.kind !== b.kind) {
            throw Error(`[vm] ADD only takes parameters of the same type. Got "${a.kind.toString()}" and "${b.kind.toString()}"`)
        }

        throw Error(`[vm] ADD only supports numbers and strings. Got "${a.kind.toString()}"`)
    }

    private _interpretSub() {
        const a = this._stack.pop();
        const b = this._stack.pop();

        if (a.kind === EAsmValueType.NUMBER && b.kind === EAsmValueType.NUMBER) {
            this._stack.push({
                kind: EAsmValueType.NUMBER,
                data: a.data - b.data
            })
            return
        }

        if (a.kind !== b.kind) {
            throw Error(`[vm] SUB only takes parameters of the same type. Got "${a.kind.toString()}" and "${b.kind.toString()}"`)
        }

        throw Error(`[vm] SUB only supports numbers. Got "${a.kind.toString()}"`)
    }

    private _interpretMul() {
        const a = this._stack.pop()
        const b = this._stack.pop()

        if (a.kind === EAsmValueType.NUMBER && b.kind === EAsmValueType.NUMBER) {
            this._stack.push({
                kind: EAsmValueType.NUMBER,
                data: a.data * b.data
            })
            return
        }

        if (a.kind !== b.kind) {
            throw Error(`[vm] MUL only takes parameters of the same type. Got "${a.kind.toString()}" and "${b.kind.toString()}"`)
        }

        throw Error(`[vm] MUL only supports numbers. Got "${a.kind.toString()}"`)
    }

    private _interpretDiv() {
        const a = this._stack.pop()
        const b = this._stack.pop()

        if (a.kind === EAsmValueType.NUMBER && b.kind === EAsmValueType.NUMBER) {
            this._stack.push({
                kind: EAsmValueType.NUMBER,
                data: a.data / b.data
            })
            return
        }

        if (a.kind !== b.kind) {
            throw Error(`[vm] DIV only takes parameters of the same type. Got "${a.kind.toString()}" and "${b.kind.toString()}"`)
        }

        throw Error(`[vm] DIV only supports numbers. Got "${a.kind.toString()}"`)
    }

    private _interpretPush(value: AsmValue) {
        this._stack.push(value)
    }
}

