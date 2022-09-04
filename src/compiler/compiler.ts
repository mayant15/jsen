import { parse } from "./parser"
import { toAst } from "./ast"
import { toAsmProgram } from "./asmgen"

export const compile = (code: string) => {
    const parsed = parse(code)
    const ast = toAst(parsed)
    const program = toAsmProgram(ast)
    return program
}

