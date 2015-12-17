/**
 * Created by Rodey on 2015/12/8.
 */

module YT{

    var PENDING: number = 1,
        FULFILLED: number = 2,
        REJECTED: number = 3;

    export class Promise{

        public state: number = PENDING;
        private _fulfils: Function[];
        private _rejecteds: Function[];
        //是否串行
        private _bunchFulfil: boolean;
        private _bunchReject: boolean;

        //回调参数集合
        args: any[];
        errs: any[];
        //当前数据
        data: any;

        _v: any = new YT.Validate();
        _t: any = new YT.Tools();

        constructor(fulfil?: any, reject?: any){

            this._fulfils = [];
            this._rejecteds = [];
            this._bunchFulfil = false;
            this._bunchReject = false;
            this.args = [];
            this.errs = [];
            this.data = null;

            this.then(fulfil, reject);

        }

        public then(fulfil: any, reject?: any): Promise{
            //this.STATE = 'pending';
            if(this.state === PENDING){
                fulfil && this._v.isFunction(fulfil) && this._fulfils.push(fulfil);
                reject && this._v.isFunction(reject) && this._rejecteds.push(reject);
            }
            else if(this.state === FULFILLED){
                this.resolve();
            }
            else if(this.state === REJECTED){
                this.reject();
            }
            return this;
        }

        /**
         * 将 fulfilled状态的回调 加入到执行队列中
         * @param fulfil
         * @returns {*}
         */
        public done(fulfil: Function){
            return this.then(fulfil);
        }
        public success(fulfil: Function){
            return this.then(fulfil);
        }

        //将 rejected状态的回调 加入到执行队列中
        public catch(reject: Function){
            return this.then(null, reject);
        }
        public error(reject: Function){
            return this.then(null, reject);
        }

        public resolve(value?: any, bunch?: boolean): void{
            this.state = FULFILLED;
            if(value){
                this.data = value;
                this.args.push(value);
            }
            this._bunchFulfil = bunch !== false ? this._bunchFulfil : bunch;
            //从多列中取出当前为 FULFILLED状态的回调
            var fulfil: any = this._fulfils.shift();
            if(fulfil && typeof fulfil === 'function'){
                //如果是指定为 bunch（串行）,使用all调用的
                if(this._bunchFulfil){
                    this._fulfils.push(fulfil);
                }else{
                    this._bunchFulfil = false;
                    fulfil.apply(this, this.args);
                }
            }else{
                throw new TypeError('no found a function object to [then|all|done|success]');
            }
        }

        public reject(err?: any, bunch?: boolean): void{
            this.state = REJECTED;
            err && this.errs.push(err);
            this._bunchReject = bunch !== false ? this._bunchReject : bunch;
            //从多列中取出当前为 REJECTED状态的回调
            var reject: any = this._rejecteds.shift();
            if(reject && typeof reject === 'function'){
                //如果是指定为 bunch（串行）,使用all调用的
                if(this._bunchReject){
                    this._rejecteds.push(reject);
                }else{
                    this._bunchReject = false;
                    reject.apply(this, this.errs);
                }
            }else{
                throw new TypeError('no found a function object to [then|catch|error]');
            }
        }


        /**
         * 串行，依次执行队列中的函数，用一个统一的回调进行处理
         * 回调中的参数依据队列进行排列
         * 注意：在最后一个调用resolve之前，必须对bunch进行确认 promise.resolve(value, bunch=true)
         * @param iterable 数组  执行队列
         * @returns {SYST.Promise}
         * exp:  promise.all([func1, func2, func3]).done(function(v1, v2, v3){ }).cache(function(e1, e2, e3){ });
         */
        public all(iterable: Function[]){
        if(!this._v.isArray(iterable)){
            throw new TypeError('args me be a array, queue element is be function');
        }

        this._bunchFulfil = true;
        this._bunchReject = true;
        this._t.each(iterable, (item: Function)=>{
            this._t.isFunction(item) && item();
        });

        return this;
    }


    }


}
