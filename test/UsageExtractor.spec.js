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

    it ('should extract usage in lhs of property', function () {
        var usageFiles = ['example/usage-property.ts'];
        var usage = extractor.findUsages(usageFiles);
        assertContains(usage[usageFiles[0]], 'foo');
        assertContains(usage[usageFiles[0]], 'foo.module');
        assertContains(usage[usageFiles[0]], 'mod');
        assertContains(usage[usageFiles[0]], 'mod.modMod');
        assertContains(usage[usageFiles[0]], 'mod.modMod.name');
        assertContains(usage[usageFiles[0]], 'aze');
        assertNotContains(usage[usageFiles[0]], 'module');
    });
});
