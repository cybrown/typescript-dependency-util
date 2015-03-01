function pushIfNotContained(arr, obj) {
    if (arr.indexOf(obj) === -1) {
        arr.push(obj);
    }
}
var DependencyManager = (function () {
    function DependencyManager() {
    }
    DependencyManager.prototype.createDepdencyTree = function (bySymbolExportReport, usageReport) {
        var _this = this;
        var tree = {};
        Object.keys(usageReport).forEach(function (fileName) {
            usageReport[fileName].forEach(function (symbol) {
                if (bySymbolExportReport.hasOwnProperty(symbol)) {
                    _this.addDependentFilesToFiles(tree, fileName, bySymbolExportReport[symbol]);
                }
            });
        });
        return tree;
    };
    DependencyManager.prototype.sortFromDepdencyTree = function (tree) {
        var _this = this;
        var sortedFiles = [];
        Object.keys(tree).forEach(function (fileWithDepdendencies) {
            _this.getDependenciesOf(tree, fileWithDepdendencies).forEach(function (r) {
                pushIfNotContained(sortedFiles, r);
            });
            pushIfNotContained(sortedFiles, fileWithDepdendencies);
        });
        return sortedFiles;
    };
    DependencyManager.prototype.getDependenciesOf = function (tree, file) {
        var _this = this;
        var result = [];
        tree[file].forEach(function (dependency) {
            _this.getDependenciesOf(tree, dependency).forEach(function (res) {
                pushIfNotContained(result, res);
            });
            result.push(dependency);
        });
        return result;
    };
    DependencyManager.prototype.addDependentFilesToFiles = function (tree, fileName, files) {
        if (!tree.hasOwnProperty(fileName)) {
            tree[fileName] = [];
        }
        files.forEach(function (file) {
            if (file !== fileName && !tree[fileName].hasOwnProperty(file)) {
                pushIfNotContained(tree[fileName], file);
            }
        });
    };
    return DependencyManager;
})();
module.exports = DependencyManager;
