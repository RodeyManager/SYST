/**
 * Created by Rodey on 2015/10/21.
 */
var YT;
(function (YT) {
    var Controller = (function () {
        function Controller(child) {
            this.isInit = true;
            for (var k in child) {
                if (child.hasOwnProperty(k)) {
                    //Object.defineProperty(this, k, { value: child[k], writable: false });
                    this[k] = child[k];
                }
            }
            if (true === this.isInit) {
                this.init();
            }
        }
        Controller.prototype.init = function () {
            console.log('...Controller init...');
        };
        Controller.prototype.getModel = function () {
            return this.model;
        };
        Controller.prototype.setModel = function (m) {
            this.model = m;
        };
        return Controller;
    })();
    YT.Controller = Controller;
})(YT || (YT = {}));
//# sourceMappingURL=Controller.js.map