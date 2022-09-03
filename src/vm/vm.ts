import { EIRValueType, EOpCode, Instr, IRValue, Stack } from "../common/ir"

export class VM {
    private _stack: Stack<IRValue>
    private _program: Instr[]

    constructor(program: Instr[]) {
        this._stack = new Stack<IRValue>();
        this._program = program;
    }

    run(): IRValue {
        for (const instr of this._program) {
            this._interpret(instr)
        }
        return this._stack.pop()
    }

    private _interpret(instr: Instr) {
        switch (instr.opcode) {
            case EOpCode.ADD:
                return this._interpretAdd()
            case EOpCode.PUSH:
                return this._interpretPush(instr.data)
            default:
                throw Error(`[vm] Unsupported instruction: ${instr.opcode.toString()}`)
        }
    }

    private _interpretAdd() {
        const a = this._stack.pop();
        const b = this._stack.pop();

        if (a.kind === EIRValueType.NUMBER && b.kind === EIRValueType.NUMBER) {
            this._stack.push({
                kind: EIRValueType.NUMBER,
                data: a.data + b.data
            })
            return
        }

        if (a.kind === EIRValueType.STRING && b.kind === EIRValueType.STRING) {
            this._stack.push({
                kind: EIRValueType.STRING,
                data: a.data + b.data
            })
            return
        }

        if (a.kind !== b.kind) {
            throw Error(`[vm] Add only takes parameters of the same type. Got "${a.kind.toString()}" and "${b.kind.toString()}"`)
        }

        throw Error(`[vm] Add only supports numbers and strings. Got "${a.kind.toString()}"`)
    }

    private _interpretPush(value: IRValue) {
        this._stack.push(value)
    }
}

