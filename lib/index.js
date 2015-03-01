exports.ExportExtractor = require('./ExportExtractor');
exports.UsageExtractor = require('./UsageExtractor');
exports.DependencyManager = require('./DependencyManager');
function createSortedFileList(sourceFiles) {
    var usageExtractor = new exports.UsageExtractor();
    var exportExtractor = new exports.ExportExtractor();
    var dependencyManager = new exports.DependencyManager();
    var usageReport = usageExtractor.findUsages(sourceFiles);
    var exportReportByFile = exportExtractor.getReport(sourceFiles);
    var exportReportBySymbol = exportExtractor.convertReport(exportReportByFile);
    var dependencyTree = dependencyManager.createDepdencyTree(exportReportBySymbol, usageReport);
    var sortedSourceFileList = dependencyManager.sortFromDepdencyTree(dependencyTree);
    return sortedSourceFileList;
}
exports.createSortedFileList = createSortedFileList;
