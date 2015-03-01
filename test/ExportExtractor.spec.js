var assert = require('assert');
var tdu = require('../index');

function assertContains(arr, obj) {
    assert(arr.indexOf(obj) !== -1);
}

function assertNotContains(arr, obj) {
    assert(arr.indexOf(obj) === -1);
}

describe('Extract exported elements', function () {

    var extractor;

    beforeEach(function () {
        extractor = new tdu.ExportExtractor();
    });

    it ('Extract a single class in the root of a source file', function () {
        var sourceFiles = ['example/extract-class.ts'];
        var exported = extractor.getReport(sourceFiles);
        assert(exported);
        assert(exported['example/extract-class.ts']);
        assert.equal(exported['example/extract-class.ts'].length, 1);
        assert.equal(exported['example/extract-class.ts'][0], 'Foo');
    });

    it ('Extract a class in a module', function () {
        var fileName = 'example/extract-class-in-module.ts';
        var sourceFiles = [fileName];
        var exported = extractor.getReport(sourceFiles);
        assert(exported);
        assert(exported[fileName]);
        assert.equal(exported[fileName].length, 2);
        assert.equal(exported[fileName][0], 'BarModule');
        assert.equal(exported[fileName][1], 'BarModule.FooExported');
    });

    it ('Extract interfaces from a module', function () {
        var fileName = 'example/extract-interfaces-in-module.ts';
        var sourceFiles = [fileName];
        var exported = extractor.getReport(sourceFiles);
        assert(exported);
        assert(exported[fileName]);
        assert.equal(exported[fileName].length, 3);
        assert.equal(exported[fileName][0], 'BarModule2');
        assert.equal(exported[fileName][1], 'BarModule2.FooExported1');
        assert.equal(exported[fileName][2], 'BarModule2.FooExported2');
    });

    it ('Extract from nested modules', function () {
        var fileName = 'example/extract-from-nested-module.ts';
        var sourceFiles = [fileName];
        var exported = extractor.getReport(sourceFiles);
        assert(exported);
        assert(exported[fileName]);
        assert.equal(exported[fileName].length, 5);
        assert.equal(exported[fileName][0], 'BarModule3');
        assert.equal(exported[fileName][1], 'BarModule3.NestedFooModule');
        assert.equal(exported[fileName][2], 'BarModule3.NestedFooModule.ExportedInterface');
        assert.equal(exported[fileName][3], 'BarModule3.FooExported');
        assert.equal(exported[fileName][4], 'ExportedRootClass');
    });

    it ('Extract from nested modules with export var', function () {
        var fileName = 'example/extract-from-nested-module-with-variable.ts';
        var sourceFiles = [fileName];
        var exported = extractor.getReport(sourceFiles);
        assert(exported);
        assert(exported[fileName]);
        assert.equal(exported[fileName].length, 6);
        assert.equal(exported[fileName][0], 'BarModule4');
        assert.equal(exported[fileName][1], 'BarModule4.NestedFooModule');
        assert.equal(exported[fileName][2], 'BarModule4.NestedFooModule.ExportedInterface');
        assert.equal(exported[fileName][3], 'BarModule4.NestedFooModule.exportedNestedVariable');
        assert.equal(exported[fileName][4], 'BarModule4.FooExported');
        assert.equal(exported[fileName][5], 'BarModule4.exportedVariable');
    });

    it ('Extract from nested modules with enums', function () {
        var fileName = 'example/extract-from-nested-module-with-enum.ts';
        var sourceFiles = [fileName];
        var exported = extractor.getReport(sourceFiles);
        assert(exported);
        assert(exported[fileName]);
        assert.equal(exported[fileName].length, 8);
        assert.equal(exported[fileName][0], 'BarModule5');
        assert.equal(exported[fileName][1], 'BarModule5.NestedFooModule');
        assert.equal(exported[fileName][2], 'BarModule5.NestedFooModule.ExportedInterface');
        assert.equal(exported[fileName][3], 'BarModule5.FooExported');
        assert.equal(exported[fileName][4], 'BarModule5.ExportedEnum');
        assert.equal(exported[fileName][5], 'BarModule5.NestedModuleWithEnums');
        assert.equal(exported[fileName][6], 'BarModule5.NestedModuleWithEnums.ExportedNestedEnum');
        assert.equal(exported[fileName][7], 'ExportedRootClass2');
    });

    it ('Convert report by file to a report by symbol', function () {
        var report = {
            'file1.ts': ['a', 'b', 'c'],
            'file2.ts': ['c', 'd', 'e']
        };
        var bySymbol = extractor.convertReport(report);
        assert(bySymbol.hasOwnProperty('a'));
        assert(bySymbol.hasOwnProperty('b'));
        assert(bySymbol.hasOwnProperty('c'));
        assert(bySymbol.hasOwnProperty('d'));
        assert(bySymbol.hasOwnProperty('e'));
        assert(bySymbol['a'].length, 1);
        assertContains(bySymbol['a'], 'file1.ts');
        assert(bySymbol['c'].length, 2);
        assertContains(bySymbol['c'], 'file1.ts');
        assertContains(bySymbol['c'], 'file2.ts');
        assert(bySymbol['d'].length, 1);
        assertContains(bySymbol['d'], 'file2.ts');
    });
});
