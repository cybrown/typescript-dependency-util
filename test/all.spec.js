var assert = require('assert');
var tdu = require('../index');

describe('From files to sorted array', function () {

    var dependencyManager;
    var usageExtractor;
    var exportExtractor;

    beforeEach(function () {
        dependencyManager = new tdu.DependencyManager();
        usageExtractor = new tdu.UsageExtractor();
        exportExtractor = new tdu.ExportExtractor();
    });

    it ('should create the sorted list of files', function () {
        var sourceFiles = [
            'example/class-a.ts',
            'example/class-b.ts',
            'example/class-c.ts'
        ];
        var usageReport = usageExtractor.findUsages(sourceFiles);
        var exportReportByFile = exportExtractor.getReport(sourceFiles);
        var exportReportBySymbol = exportExtractor.convertReport(exportReportByFile);
        var dependencyTree = dependencyManager.createDepdencyTree(exportReportBySymbol, usageReport);
        var sortedSourceFileList = dependencyManager.sortFromDepdencyTree(dependencyTree);
        assert.equal(sortedSourceFileList.length, 3);
        assert.equal(sortedSourceFileList[0], sourceFiles[2]);
        assert.equal(sortedSourceFileList[1], sourceFiles[1]);
    });

    it ('should create the sorted list of files with helper', function () {
        var sourceFiles = [
            'example/class-a.ts',
            'example/class-b.ts',
            'example/class-c.ts'
        ];
        var sortedSourceFileList = tdu.createSortedFileList(sourceFiles);
        assert.equal(sortedSourceFileList.length, 3);
        assert.equal(sortedSourceFileList[0], sourceFiles[2]);
        assert.equal(sortedSourceFileList[1], sourceFiles[1]);
    });
});
