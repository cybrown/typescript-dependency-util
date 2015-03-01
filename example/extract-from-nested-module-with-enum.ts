module BarModule5 {


    export module NestedFooModule {
        class NotExported {

        }

        export interface ExportedInterface {

        }
    }

    module NotExportedNestedModule {
        export class ShouldNotBeInReport {

        }

        export enum NotExportedNestedEnum {
            One, Two, Three
        }
    }

    export class FooExported {

    }

    export enum ExportedEnum {
        One, Two, Three
    }

    enum NotExportedEnum {
        One, Two, Three
    }

    class NotExported {

    }

    export module NestedModuleWithEnums {
        export enum ExportedNestedEnum {
            One, Two, Three
        }

        enum NotExportedNestedEnum {
            One, Two, Three
        }
    }
}

class ExportedRootClass2 {

}
