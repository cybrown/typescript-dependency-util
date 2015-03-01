var assert = require('assert');
var tdu = require('../index');

function assertContains(arr, obj) {
    assert(arr.indexOf(obj) !== -1);
}

function assertNotContains(arr, obj) {
    assert(arr.indexOf(obj) === -1);
}

describe('Extract used foreign references', function () {

    var extractor;

    beforeEach(function () {
        extractor = new tdu.UsageExtractor();
    });

    it ('should extract identifier usage', function () {
        var usageFiles = ['example/usage-class-in-file.ts'];
        var usage = extractor.findUsages(usageFiles);
        assertContains(usage[usageFiles[0]], 'a');
        assertContains(usage[usageFiles[0]], 'BarModule');
        assertContains(usage[usageFiles[0]], 'BarModule.NestedModule');
        assertContains(usage[usageFiles[0]], 'BarModule.NestedModule.FooExported');
        assertNotContains(usage[usageFiles[0]], 'b');
    });
});
