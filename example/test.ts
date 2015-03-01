import ts = require("typescript");

var tsAlias = <any>ts;

function kindToString(kind: number): string {
    return tsAlias.SyntaxKind[kind];
}

class UsageExtractor {

    private options: ts.CompilerOptions = {
		noLib: true
	};
	private host = ts.createCompilerHost(this.options);
	private program: ts.Program = null;

    findUsages (sourceFiles: string[]) {
        this.host = ts.createCompilerHost(this.options)
        this.program = ts.createProgram(sourceFiles, this.options, this.host)
        this.program.getSourceFiles().forEach(file => this.processFile(file));
    }

    private processFile(file: ts.SourceFile) {
        this.processNode(file);
    }

    private visitChildren = true;

    private processNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.Identifier) {
            var identifier = <ts.Identifier>node;
            console.log(`Identifier: ${identifier.text} <= ${kindToString(identifier.parent.kind)}`);
            this.processIdentifier(identifier);
        } else if (node.kind === ts.SyntaxKind.PropertyAccessExpression) {
            this.processPropertyAccessExpression(<ts.PropertyAccessExpression>node);
            this.visitChildren = false;
        }

        if (this.visitChildren) {
            ts.forEachChild(node, node => this.processNode(node));
        }
        this.visitChildren = true;
    }

    private processIdentifier(id: ts.Identifier) {
        console.log(id.text);
    }

    private processPropertyAccessExpression(expr: ts.PropertyAccessExpression) {
        console.log(this.getFullNameFromPropertyAccessExpression(expr));
    }

    private getFullNameFromPropertyAccessExpression(expr: ts.PropertyAccessExpression): string {
        if (expr.expression.kind === ts.SyntaxKind.Identifier) {
            return (<ts.Identifier>expr.expression).text + '.' + expr.name.text;
        } else if (expr.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            var prop = <ts.PropertyAccessExpression>expr.expression;
            return this.getFullNameFromPropertyAccessExpression(prop) + '.' + prop.name.text;
        }
    }
}

export = UsageExtractor;
