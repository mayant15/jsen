import { AsmValue, createAddInstr, createDivInstr, createMulInstr, createPushInstr, createSubInstr, EAsmValueType, Program } from "../common/asm"
import { Ast } from "./ast"

type Identifier = string

enum ESymbolKind {
    LITERAL,
    ALIAS,
}

type LiteralSymbolInfo = {
    kind: ESymbolKind.LITERAL
    isConstant: boolean
    isLiteral: true
    value: AsmValue
}

type AliasSymbolInfo = {
    kind: ESymbolKind.ALIAS
    isConstant: boolean
    isLiteral: false
    value: Identifier
}

type SymbolInfo = AliasSymbolInfo | LiteralSymbolInfo

type SymbolTable = Record<Identifier, SymbolInfo>

type Context = Program

class AsmGenVisitor {
    private _symbolTable: SymbolTable

    constructor() {
        this._symbolTable = {}
    }

    visitMain(node: Ast.MainNode, context: Context = {
        instrs: [],
        labels: {}
    }): Program {
        for (const statement of node.body) {
            // TODO: Don't mutate context (?)
            this._visitStatement(statement, context)
        }

        return context
    }

    private _visitStatement(node: Ast.StatementNode, context: Context) {
        switch (node.type) {
            case "ExpressionStatement":
                this._visitExpressionStatement(node, context)
                break
            default:
                throw Error(`[compiler] unsupported statement type ${node.type}`)
        }
    }

    private _visitExpressionStatement({ expression }: Ast.ExpressionNode, context: Context) {
        switch (expression.type) {
            case "BinaryExpression":
                this._visitBinaryExpression(expression, context)
                break
            default:
                throw Error(`[compiler] unsupported expression type ${expression.type}`)
        }
    }

    private _visitBinaryExpression(expr: Ast.BinaryExpression, context: Context) {
        // Emit right instruction first for SUB and DIV
        switch (expr.right.type) {
            case 'NumericLiteral':
                context.instrs.push(createPushInstr({
                    kind: EAsmValueType.NUMBER,
                    data: expr.right.value
                }))
                break;
            case 'StringLiteral':
                context.instrs.push(createPushInstr({
                    kind: EAsmValueType.STRING,
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
            case 'StringLiteral':
                context.instrs.push(createPushInstr({
                    kind: EAsmValueType.STRING,
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
    const generator = new AsmGenVisitor()
    return generator.visitMain(ast)
}

