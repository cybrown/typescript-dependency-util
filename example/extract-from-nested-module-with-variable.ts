module BarModule4 {


    export module NestedFooModule {
        class NotExported {

        }

        export interface ExportedInterface {

        }

        export var exportedNestedVariable;
    }

    module NotExportedNestedModule {
        export class ShouldNotBeInReport {

        }

        export var notExportedNestedVariable;
    }

    export class FooExported {

    }

    export var exportedVariable;

    var notExportedVariable;

    class NotExported {

    }
}
