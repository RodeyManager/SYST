/**
 * Created by Rodey on 2015/12/8.
 */

var SYST;
;(function(SYST){

    'use strict';

    var PENDING = 1,
        FULFILLED = 2,
        REJECTED = 3;

    var Promise = SYST.Promise = function(fulfil, reject){
        //保存当前状态----
        //pending: 初始状态, 非 fulfilled 或 rejected.
        //fulfilled: 成功的操作.
        //rejected: 失败的操作.
        this.STATE = PENDING;
        //保存所有fulfil对象
        this._fulfils = [];
        //保存所有rejected对象
        this._rejecteds = [];
        //回调参数集合
        this.args = [];
        this.errs = [];
        //当前数据
        this.data = null;
        //是否串行
        this._bunchFulfil = false;
        this._bunchReject = false;

        //加入到执行队列
        this.then(fulfil, reject);

    };

    SYST.Promise.prototype = {

        /**
         * 加入除pending状态的回调 加入到执行队列中
         * @param fulfil    fulfilled状态的回调函数
         * @param reject    rejected状态的回调函数
         * @returns {SYST.Promise}
         */
        then: function(fulfil, reject){
            //this.STATE = 'pending';
            if(this.STATE === PENDING){
                fulfil && SYST.V.isFunction(fulfil) && this._fulfils.push(fulfil);
                reject && SYST.V.isFunction(reject) && this._rejecteds.push(reject);
            }
            else if(this.STATE === FULFILLED){
                this.resolve();
            }
            else if(this.STATE === REJECTED){
                this.reject();
            }
            return this;
        },

        /**
         * 将 fulfilled状态的回调 加入到执行队列中
         * @param fulfil
         * @returns {*}
         */
        done: function(fulfil){
            return this.then(fulfil);
        },
        success: function(fulfil){
            return this.then(fulfil);
        },

        //将 rejected状态的回调 加入到执行队列中
        catch: function(reject){
            return this.then(null, reject);
        },
        error: function(reject){
            return this.then(null, reject);
        },

        /**
         * 执行当前队列中为 fulfilled状态的回调
         * @param value
         * @param bunch
         */
        resolve: function(value, bunch){
            this.STATE = FULFILLED;
            this.data = value;
            this.args.push(value);
            this._bunchFulfil = bunch !== false ? this._bunchFulfil : bunch;
            //从多列中取出当前为 FULFILLED状态的回调
            var fulfil = this._fulfils.shift();
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

        },

        /**
         * 执行当前队列中的 rejected状态的回调
         * @param err
         * @param bunch
         */
        reject: function(err, bunch){
            this.STATE = REJECTED;
            this.errs.push(err);
            this._bunchReject = bunch !== false ? this._bunchReject : bunch;
            //从多列中取出当前为 REJECTED状态的回调
            var reject = this._rejecteds.shift();
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
        },

        /**
         * 串行，依次执行队列中的函数，用一个统一的回调进行处理
         * 回调中的参数依据队列进行排列
         * 注意：在最后一个调用resolve之前，必须对bunch进行确认 promise.resolve(value, bunch=true)
         * @param iterable 数组  执行队列
         * @returns {SYST.Promise}
         * exp:  promise.all([func1, func2, func3]).done(function(v1, v2, v3){ }).cache(function(e1, e2, e3){ });
         */
        all: function(iterable){
            if(!SYST.V.isArray(iterable)){
                throw new TypeError('args me be a array, queue element is be function');
            }

            this._bunchFulfil = true;
            this._bunchReject = true;
            SYST.T.each(iterable, function(item){
                SYST.V.isFunction(item) && item();
            });

            return this;
        }

    };

    SYST.P = SYST.Promise = Promise;

})(SYST || {});
