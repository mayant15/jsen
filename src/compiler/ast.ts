import { ParseResult } from "@babel/parser";
import type { BinaryExpression, ExpressionStatement, File, Program, Statement } from "@babel/types"

export namespace Ast {
    export type MainNode = Program
    export type StatementNode = Statement
    export type ExpressionNode = ExpressionStatement
    export type BinaryExpressionNode = BinaryExpression
}

export const toAst = (parsed: ParseResult<File>): Ast.MainNode => {
    return parsed.program
}

