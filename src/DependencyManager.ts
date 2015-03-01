import ts = require('typescript');

type DependencyTree = {
    [index: string]: string[];
}

type ExportedReportBySymbolName = {
	[index: string]: string[]
}

type UsageReport = {
    [fileName: string]: string[];
}

function pushIfNotContained(arr: any[], obj: any) {
    if (arr.indexOf(obj) === -1) {
        arr.push(obj);
    }
}

class DependencyManager {

    createDepdencyTree(bySymbolExportReport: ExportedReportBySymbolName, usageReport: UsageReport): DependencyTree {
        var tree: DependencyTree = {};
        Object.keys(usageReport).forEach(fileName => {
            usageReport[fileName].forEach(symbol => {
                if (bySymbolExportReport.hasOwnProperty(symbol)) {
                    this.addDependentFilesToFiles(tree, fileName, bySymbolExportReport[symbol]);
                }
            })
        });
        return tree;
    }

    sortFromDepdencyTree(tree: DependencyTree): string[] {
        var sortedFiles = [];
        Object.keys(tree).forEach(fileWithDepdendencies => {
            this.getDependenciesOf(tree, fileWithDepdendencies).forEach(r => {
                pushIfNotContained(sortedFiles, r);
            });
            pushIfNotContained(sortedFiles, fileWithDepdendencies);
        });
        return sortedFiles;
    }

    private getDependenciesOf(tree: DependencyTree, file: string): string[] {
        var result = [];
        tree[file].forEach(dependency => {
            this.getDependenciesOf(tree, dependency).forEach(res => {
                pushIfNotContained(result, res);
            });
            result.push(dependency);
        });
        return result;
    }

    private addDependentFilesToFiles(tree: DependencyTree, fileName: string, files: string[]) {
        if (!tree.hasOwnProperty(fileName)) {
            tree[fileName] = [];
        }
        files.forEach(file => {
            if (file !== fileName && !tree[fileName].hasOwnProperty(file)) {
                pushIfNotContained(tree[fileName], file);
            }
        });
    }
}

export = DependencyManager;
