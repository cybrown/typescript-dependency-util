import ts = require("typescript");

type ExportedReport = {
	[index: string]: string[]
};

type ComplexDeclaration = ts.ModuleDeclaration
		                | ts.ClassDeclaration
		                | ts.InterfaceDeclaration;

type Declaration = ComplexDeclaration | ts.VariableDeclaration;

type ExportedReportBySymbolName = {
	[index: string]: string[]
}

class ExportExtractor {
	private result: ExportedReport = {};
	private options: ts.CompilerOptions = {
		noLib: true
	};
	private host = ts.createCompilerHost(this.options);
	private program: ts.Program = null;
	private moduleStack: ts.ModuleDeclaration[] = [];
	private currentFile: ts.SourceFile = null;
	private skipInternal = false;

	getReport(sourceFiles: string[]) : ExportedReport {
		this.host = ts.createCompilerHost(this.options)
		this.program = ts.createProgram(sourceFiles, this.options, this.host)
		this.program.getSourceFiles().forEach(file => this.processFile(file));
		return this.result;
	}

	convertReport(report: ExportedReport): ExportedReportBySymbolName {
		var result: ExportedReportBySymbolName = {};
		Object.keys(report).forEach(fileName => {
			report[fileName].forEach(symbol => {
				if (!result.hasOwnProperty(symbol)) {
					result[symbol] = [];
				}
				if (result[symbol].indexOf(fileName) === -1) {
					result[symbol].push(fileName);
				}
			});
		});
		return result;
	}

    private addToReport(report: ExportedReport, fileName: string, obj: any) {
		if (!report.hasOwnProperty(fileName)) {
			report[fileName] = [];
		}
		if (report[fileName].indexOf(obj) === -1) {
			report[fileName].push(obj);
		}
	}

    private isExported(node: ComplexDeclaration): boolean {
		if (!node.modifiers) {
			return false;
		}
		return node.modifiers.some(node => node.kind ===
			ts.SyntaxKind.ExportKeyword);
	}

    private isVarExported(node: ts.VariableDeclaration): boolean {
		return (node.flags & ts.NodeFlags.Export) !== 0;
	}

    private processFile (file: ts.SourceFile) {
		this.currentFile = file;
		this.processNode(file);
	}

    private getCurrentModuleFullName(): string {
		if (this.moduleStack.length) {
			return this.moduleStack.map(moduleDeclaration =>
				moduleDeclaration.name.text).join('.');
		} else {
			return '';
		}
	}

    private getDeclarationFullName(declaration: Declaration): string {
		if (this.moduleStack.length) {
			return this.getCurrentModuleFullName() + '.' +
				declaration.name.text;
		} else {
			return declaration.name.text;
		}
	}

    private exportNeeded() {
		return this.moduleStack.length > 0;
	}

    private processComplexDeclaration(node: ComplexDeclaration) {
		var complexDeclaration = <ts.ModuleDeclaration>node;
		if (!this.exportNeeded() || this.isExported(complexDeclaration)) {
			this.addToReport(this.result, this.currentFile.filename,
				this.getDeclarationFullName(complexDeclaration));
		} else {
			this.skipInternal = true;
		}
	}

    private processVarDeclaration(node: ts.VariableDeclaration) {
		var variableDeclaration = <ts.VariableDeclaration>node;
		if (!this.exportNeeded() || this.isVarExported(variableDeclaration)) {
			this.addToReport(this.result, this.currentFile.filename,
				this.getDeclarationFullName(variableDeclaration));
		} else {
			this.skipInternal = true;
		}
	}

	private processNode (node: ts.Node) {
		switch (node.kind) {
			case ts.SyntaxKind.ModuleDeclaration:
				this.processComplexDeclaration(<ComplexDeclaration>node);
				this.moduleStack.push(<ts.ModuleDeclaration>node);
				break;
			case ts.SyntaxKind.ClassDeclaration:
				this.processComplexDeclaration(<ComplexDeclaration>node);
				break;
			case ts.SyntaxKind.InterfaceDeclaration:
				this.processComplexDeclaration(<ComplexDeclaration>node);
				break;
			case ts.SyntaxKind.EnumDeclaration:
				this.processComplexDeclaration(<ComplexDeclaration>node);
				break;
			case ts.SyntaxKind.VariableDeclaration:
				this.processVarDeclaration(<ts.VariableDeclaration>node);
				break;
		}

		if (!this.skipInternal) {
			ts.forEachChild(node, node => this.processNode(node));
		}

		switch (node.kind) {
			case ts.SyntaxKind.ModuleDeclaration:
				this.moduleStack.pop();
				break;
		}
		this.skipInternal = false;
	}
}

export = ExportExtractor;
