var ts = require("typescript");
var ExportExtractor = (function () {
    function ExportExtractor() {
        this.result = {};
        this.options = {
            noLib: true
        };
        this.host = ts.createCompilerHost(this.options);
        this.program = null;
        this.moduleStack = [];
        this.currentFile = null;
        this.skipInternal = false;
    }
    ExportExtractor.prototype.getReport = function (sourceFiles) {
        var _this = this;
        this.host = ts.createCompilerHost(this.options);
        this.program = ts.createProgram(sourceFiles, this.options, this.host);
        this.program.getSourceFiles().forEach(function (file) { return _this.processFile(file); });
        return this.result;
    };
    ExportExtractor.prototype.convertReport = function (report) {
        var result = {};
        Object.keys(report).forEach(function (fileName) {
            report[fileName].forEach(function (symbol) {
                if (!result.hasOwnProperty(symbol)) {
                    result[symbol] = [];
                }
                if (result[symbol].indexOf(fileName) === -1) {
                    result[symbol].push(fileName);
                }
            });
        });
        return result;
    };
    ExportExtractor.prototype.addToReport = function (report, fileName, obj) {
        if (!report.hasOwnProperty(fileName)) {
            report[fileName] = [];
        }
        if (report[fileName].indexOf(obj) === -1) {
            report[fileName].push(obj);
        }
    };
    ExportExtractor.prototype.isExported = function (node) {
        if (!node.modifiers) {
            return false;
        }
        return node.modifiers.some(function (node) { return node.kind === 76 /* ExportKeyword */; });
    };
    ExportExtractor.prototype.isVarExported = function (node) {
        return (node.flags & 1 /* Export */) !== 0;
    };
    ExportExtractor.prototype.processFile = function (file) {
        this.currentFile = file;
        this.processNode(file);
    };
    ExportExtractor.prototype.getCurrentModuleFullName = function () {
        if (this.moduleStack.length) {
            return this.moduleStack.map(function (moduleDeclaration) { return moduleDeclaration.name.text; }).join('.');
        }
        else {
            return '';
        }
    };
    ExportExtractor.prototype.getDeclarationFullName = function (declaration) {
        if (this.moduleStack.length) {
            return this.getCurrentModuleFullName() + '.' + declaration.name.text;
        }
        else {
            return declaration.name.text;
        }
    };
    ExportExtractor.prototype.exportNeeded = function () {
        return this.moduleStack.length > 0;
    };
    ExportExtractor.prototype.processComplexDeclaration = function (node) {
        var complexDeclaration = node;
        if (!this.exportNeeded() || this.isExported(complexDeclaration)) {
            this.addToReport(this.result, this.currentFile.filename, this.getDeclarationFullName(complexDeclaration));
        }
        else {
            this.skipInternal = true;
        }
    };
    ExportExtractor.prototype.processVarDeclaration = function (node) {
        var variableDeclaration = node;
        if (!this.exportNeeded() || this.isVarExported(variableDeclaration)) {
            this.addToReport(this.result, this.currentFile.filename, this.getDeclarationFullName(variableDeclaration));
        }
        else {
            this.skipInternal = true;
        }
    };
    ExportExtractor.prototype.processNode = function (node) {
        var _this = this;
        switch (node.kind) {
            case 189 /* ModuleDeclaration */:
                this.processComplexDeclaration(node);
                this.moduleStack.push(node);
                break;
            case 185 /* ClassDeclaration */:
                this.processComplexDeclaration(node);
                break;
            case 186 /* InterfaceDeclaration */:
                this.processComplexDeclaration(node);
                break;
            case 188 /* EnumDeclaration */:
                this.processComplexDeclaration(node);
                break;
            case 183 /* VariableDeclaration */:
                this.processVarDeclaration(node);
                break;
        }
        if (!this.skipInternal) {
            ts.forEachChild(node, function (node) { return _this.processNode(node); });
        }
        switch (node.kind) {
            case 189 /* ModuleDeclaration */:
                this.moduleStack.pop();
                break;
        }
        this.skipInternal = false;
    };
    return ExportExtractor;
})();
module.exports = ExportExtractor;
