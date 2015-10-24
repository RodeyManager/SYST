/**
 * Created by Rodey on 2015/10/21.
 */

module YT {
    export class Controller {

        private model: Model;
        public isInit:boolean = true;

        public constructor(child: any) {
            //super();
            for (var k in child) {
                if (child.hasOwnProperty(k)){
                    //Object.defineProperty(this, k, { value: child[k], writable: false });
                    this[k] = child[k];
                }
            }
            if (true === this.isInit) {
                this.init();
            }
        }

        public init(): void {
            console.log('...Controller init...');
        }

        public getModel(): Model {
            return this.model;
        }

        public setModel(m: Model) {
            this.model = m;
        }


    }
}
