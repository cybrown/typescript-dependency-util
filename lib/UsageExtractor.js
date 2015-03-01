var ts = require("typescript");
var tsAlias = ts;
function kindToString(kind) {
    return tsAlias.SyntaxKind[kind];
}
var UsageExtractor = (function () {
    function UsageExtractor() {
        this.options = {
            noLib: true
        };
        this.host = ts.createCompilerHost(this.options);
        this.program = null;
        this.report = {};
        this.visitChildren = true;
    }
    UsageExtractor.prototype.findUsages = function (sourceFiles) {
        var _this = this;
        this.host = ts.createCompilerHost(this.options);
        this.program = ts.createProgram(sourceFiles, this.options, this.host);
        this.program.getSourceFiles().forEach(function (file) { return _this.processFile(file); });
        return this.report;
    };
    UsageExtractor.prototype.processFile = function (file) {
        this.currentFile = file;
        this.processNode(file);
    };
    UsageExtractor.prototype.processNode = function (node) {
        var _this = this;
        if (node.kind === 63 /* Identifier */) {
            var identifier = node;
            //console.log(`Identifier: ${identifier.text} <= ${kindToString(identifier.parent.kind)}`);
            this.processIdentifier(identifier);
        }
        else if (node.kind === 143 /* PropertyAccessExpression */) {
            this.processPropertyAccessExpression(node);
            this.visitChildren = false;
        }
        if (this.visitChildren) {
            ts.forEachChild(node, function (node) { return _this.processNode(node); });
        }
        this.visitChildren = true;
    };
    UsageExtractor.prototype.processIdentifier = function (id) {
        this.addUsageToCurrentFile(id.text);
    };
    UsageExtractor.prototype.addUsageToCurrentFile = function (usage) {
        if (!this.report.hasOwnProperty(this.currentFile.filename)) {
            this.report[this.currentFile.filename] = [];
        }
        if (this.report[this.currentFile.filename].indexOf(usage) === -1) {
            this.report[this.currentFile.filename].push(usage);
        }
    };
    UsageExtractor.prototype.processPropertyAccessExpression = function (expr) {
        var fullName = this.getFullNameFromPropertyAccessExpression(expr);
        if (fullName != null) {
            var parts = fullName.split('.');
            for (var max = 1; max < parts.length + 1; max++) {
                this.addUsageToCurrentFile(parts.slice(0, max).join('.'));
            }
        }
    };
    UsageExtractor.prototype.getFullNameFromPropertyAccessExpression = function (expr) {
        if (expr.expression.kind === 63 /* Identifier */) {
            return expr.expression.text + '.' + expr.name.text;
        }
        else if (expr.expression.kind === 143 /* PropertyAccessExpression */) {
            var prop = expr.expression;
            return this.getFullNameFromPropertyAccessExpression(prop) + '.' + expr.name.text;
        }
        else {
            return null;
        }
    };
    return UsageExtractor;
})();
module.exports = UsageExtractor;
