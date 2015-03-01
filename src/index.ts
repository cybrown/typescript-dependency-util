import ts = require("typescript");
export import ExportExtractor = require('./ExportExtractor');
export import UsageExtractor = require('./UsageExtractor');
export import DependencyManager = require('./DependencyManager');

export function createSortedFileList(sourceFiles: string[]): string[] {
    var usageExtractor = new UsageExtractor();
    var exportExtractor = new ExportExtractor();
    var dependencyManager = new DependencyManager();

    var usageReport = usageExtractor.findUsages(sourceFiles);
    var exportReportByFile = exportExtractor.getReport(sourceFiles);
    var exportReportBySymbol = exportExtractor.convertReport(exportReportByFile);
    var dependencyTree = dependencyManager.createDepdencyTree(exportReportBySymbol, usageReport);
    var sortedSourceFileList = dependencyManager.sortFromDepdencyTree(dependencyTree);

    return sortedSourceFileList;
}
