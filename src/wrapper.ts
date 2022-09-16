import { AsmValue } from "./common/asm"
import { compile } from "./compiler/compiler"
import { VM } from "./vm/vm"

export function compileAndExecute(code: string): AsmValue {
    const program = compile(code)
    const context = new VM(program)
    const result = context.run()
    return result
}

