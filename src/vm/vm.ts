import { AsmValue, EAsmValueType, EOpCode, Instr, Program } from "../common/asm";
import { Stack } from "./stack";

export class VM {
    private _stack: Stack<AsmValue>
    private _program: Program
    private _currentInstrIdx: number

    constructor(program: Program) {
        this._stack = new Stack<AsmValue>();
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
            default:
                // If all cases are handled above, TypeScript will give `instr` the type `never`, because
                // this branch will never run. But I still want to keep this here so that I don't have to
                // add this again when I add more opcodes to the enum.
                // @ts-ignore
                throw Error(`[vm] Unsupported instruction: ${instr.opcode.toString()}`)
        }
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

