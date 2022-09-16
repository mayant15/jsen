import { createAddInstr, createDivInstr, createMulInstr, createPushInstr, createSubInstr, EAsmValueType, Program } from "../common/asm"
import { Ast } from "./ast"

namespace AsmGenVisitor {
    export type Context = Program

    export function visitMain(node: Ast.MainNode, context: Context = {
        instrs: [],
        labels: {}
    }): Program {
        for (const statement of node.body) {
            // TODO: Don't mutate context (?)
            _visitStatement(statement, context)
        }

        return context
    }

    function _visitStatement(node: Ast.StatementNode, context: Context) {
        switch (node.type) {
            case "ExpressionStatement":
                _visitExpressionStatement(node, context)
                break
            default:
                throw Error(`[compiler] unsupported statement type ${node.type}`)
        }
    }

    function _visitExpressionStatement({ expression }: Ast.ExpressionNode, context: Context) {
        switch (expression.type) {
            case "BinaryExpression":
                _visitBinaryExpression(expression, context)
                break
            default:
                throw Error(`[compiler] unsupported expression type ${expression.type}`)
        }
    }

    function _visitBinaryExpression(expr: Ast.BinaryExpressionNode, context: Context) {
        // Emit right instruction first for SUB and DIV
        switch (expr.right.type) {
            case 'NumericLiteral':
                context.instrs.push(createPushInstr({
                    kind: EAsmValueType.NUMBER,
                    data: expr.right.value
                }))
                break;
            default:
                throw Error(`[compiler] unsupported binary expression RHS type ${expr.right.type}`)
        }

        // Emit left instruction next
        switch (expr.left.type) {
            case 'NumericLiteral':
                context.instrs.push(createPushInstr({
                    kind: EAsmValueType.NUMBER,
                    data: expr.left.value
                }))
                break;
            default:
                throw Error(`[compiler] unsupported binary expression LHS type ${expr.left.type}`)
        }

        // Emit operator
        switch (expr.operator) {
            case "+":
                context.instrs.push(createAddInstr())
                break
            case "-":
                context.instrs.push(createSubInstr())
                break
            case "*":
                context.instrs.push(createMulInstr())
                break
            case "/":
                context.instrs.push(createDivInstr())
                break
            default:
                throw Error(`[compiler] unsupported operator ${expr.operator}`)
        }
    }

}

export const toAsmProgram = (ast: Ast.MainNode): Program => {
    return AsmGenVisitor.visitMain(ast)
}

