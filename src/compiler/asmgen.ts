import { exportAllDeclaration } from "@babel/types"
import { AsmValue, createAddInstr, createCreateInstr, createDivInstr, createGetPropInstr, createGetSymInstr, createMulInstr, createPushInstr, createSetPropInstr, createSetSymInstr, createSubInstr, EAsmValueType, Program, UndefinedAsmValue } from "../common/asm"
import { Ast } from "./ast"

class AsmGenVisitor {
    private _context: Program

    constructor() {
        this._context = {
            instrs: [],
            labels: {}
        }
    }

    visitMain(node: Ast.MainNode): Program {
        for (const statement of node.body) {
            // TODO: Don't mutate context (?)
            this._visitStatement(statement)
        }

        return this._context
    }

    private _visitStatement(node: Ast.StatementNode) {
        switch (node.type) {
            case "ExpressionStatement":
                this._visitExpressionStatement(node)
                break
            case 'VariableDeclaration':
                this._visitVariableDeclaration(node)
                break
            default:
                // @ts-ignore
                throw Error(`[compiler] unsupported statement type ${node.type}`)
        }
    }

    private _visitExpressionStatement(node: Ast.ExpressionNode) {
        this._visitExpression(node.expression)
    }

    private _visitExpression(expr: Ast.Expression) {
        switch (expr.type) {
            case "BinaryExpression":
                this._visitBinaryExpression(expr)
                break
            case 'NumericLiteral':
                this._visitNumericLiteralExpression(expr)
                break
            case 'StringLiteral':
                this._visitStringLiteralExpression(expr)
                break
            case 'Identifier':
                this._visitIdentifierExpression(expr)
                break
            case 'ObjectExpression':
                this._visitObjectExpression(expr)
                break
            case 'MemberExpression':
                this._visitMemberExpression(expr)
                break
            default:
                // @ts-ignore
                throw Error(`[compiler] unsupported expression type ${expr.type}`)
        }
    }

    private _visitObjectExpression(expr: Ast.ObjectExpression) {
        // Create a new object
        this._context.instrs.push(createCreateInstr())

        // Add properties to that object
        for (const { id, value } of expr.properties) {
            if (typeof id === 'string') {
                this._context.instrs.push(createPushInstr({
                    kind: EAsmValueType.STRING,
                    data: id
                }))
            } else {
                this._context.instrs.push(createPushInstr({
                    kind: EAsmValueType.NUMBER,
                    data: id
                }))
            }

            this._visitExpression(value)
            this._context.instrs.push(createSetPropInstr())
        }
    }

    private _visitMemberExpression(expr: Ast.MemberExpression) {
        // This should leave an object value on the stack
        this._visitExpression(expr.object)

        // This should leave a key on the stack
        this._visitExpression(expr.property)

        this._context.instrs.push(createGetPropInstr())
    }

    private _visitIdentifierExpression(expr: Ast.IdentifierExpression) {
        this._context.instrs.push(createPushInstr({
            kind: EAsmValueType.STRING,
            data: expr.id
        }))
        this._context.instrs.push(createGetSymInstr())
    }

    private _visitNumericLiteralExpression(expr: Ast.NumericLiteralExpression) {
        this._context.instrs.push(createPushInstr({
            kind: EAsmValueType.NUMBER,
            data: expr.value
        }))
    }

    private _visitStringLiteralExpression(expr: Ast.StringLiteralExpression) {
        this._context.instrs.push(createPushInstr({
            kind: EAsmValueType.STRING,
            data: expr.value
        }))
    }

    private _visitBinaryExpression(expr: Ast.BinaryExpression) {
        // Emit right instruction first for SUB and DIV
        this._visitExpression(expr.right)

        // Emit left instruction next
        this._visitExpression(expr.left)

        // Emit operator
        switch (expr.operator) {
            case "+":
                this._context.instrs.push(createAddInstr())
                break
            case "-":
                this._context.instrs.push(createSubInstr())
                break
            case "*":
                this._context.instrs.push(createMulInstr())
                break
            case "/":
                this._context.instrs.push(createDivInstr())
                break
            default:
                throw Error(`[compiler] unsupported operator ${expr.operator}`)
        }
    }

    private _visitVariableDeclaration(node: Ast.VariableDeclarationNode) {
        if (node.isConst && node.init === null) {
            throw Error(`[compiler] SyntaxError: const variables must be initialized`)
        }

        // Push the identifier name
        this._context.instrs.push(createPushInstr({
            kind: EAsmValueType.STRING,
            data: node.id
        }))

        // Push the value
        if (node.init) {
            this._visitExpression(node.init)
        } else {
            this._context.instrs.push(createPushInstr(UndefinedAsmValue))
        }

        // Set value to name in VM symbol table
        this._context.instrs.push(createSetSymInstr())
    }
}

export const toAsmProgram = (ast: Ast.MainNode): Program => {
    const generator = new AsmGenVisitor()
    return generator.visitMain(ast)
}

