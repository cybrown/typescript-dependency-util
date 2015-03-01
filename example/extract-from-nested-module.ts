module BarModule3 {


    export module NestedFooModule {
        class NotExported {

        }

        export interface ExportedInterface {

        }
    }

    module NotExportedNestedModule {
        export class ShouldNotBeInReport {

        }
    }

    export class FooExported {

    }

    class NotExported {

    }
}

class ExportedRootClass {

}
