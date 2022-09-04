import { AsmValue, EAsmValueType, EOpCode, Instr, Program } from "../common/asm";
import { Stack } from "./stack";

export class VM {
    private _stack: Stack<AsmValue>
    private _program: Program

    constructor(program: Program) {
        this._stack = new Stack<AsmValue>();
        this._program = program;
    }

    run(): AsmValue {
        for (const instr of this._program.instrs) {
            this._interpret(instr)
        }
        return this._stack.pop()
    }

    private _interpret(instr: Instr) {
        switch (instr.opcode) {
            case EOpCode.ADD:
                return this._interpretAdd()
            case EOpCode.SUB:
                return this._interpretSub()
            case EOpCode.PUSH:
                return this._interpretPush(instr.data)
            default:
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

    private _interpretPush(value: AsmValue) {
        this._stack.push(value)
    }
}

