/**
 * Created by Rodey on 2016/10/24.
 * Dom action
 */

;(function(SYST){

    var fragmentRE = /^\s*<(\w+|!)([^>]*)>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        attrReg = /^\[([^=]+?)(?:=[^\]])*?\]$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        },
        defDisplayCache = {},
        evtsels = ['focus', 'blur'],
        evtforms = ['submit', 'reset'],
        evts = ['click', 'input', 'dblclick', 'mouseover', 'mouseout', 'keydown', 'keyup', 'change'].concat(evtsels, evtforms),
        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
        eventMethods = {
            preventDefault: function(){ window.event && (window.event.returnValue = false); },
            stopImmediatePropagation: function(){ this.stopImmediatePropagation && this.stopImmediatePropagation(); },
            stopPropagation: function(){ window.event && (window.event.cancelBubble = true); }
        };

    function Dom(context, selector){
        this.context = this.target = context;
        this.selector = selector;
        this._init();
    }

    Dom.prototype = {
        //-----public------
        clone: function(){
            return new Dom(this.context.cloneNode.apply(this.context, arguments));
        },
        append: function(content){
            if(!content)    return this;
            if(content && content._dom_){
                SYST.T.each(content, function(n){
                    this.append(n);
                }, this);
            }else{
                this.context.appendChild(this._toNode(content));
            }
            return this;
        },
        appendTo: function(to){
            to && to.appendChild(this.context);
            return this;
        },
        prepend: function(content){
            var firstChild = this.context.firstChild;
            this.context.insertBefore(this._toNode(content), firstChild);
            return this;
        },
        prependTo: function(to){
            var firstChild = to.firstChild || to.childNodes[0];
            firstChild && to.insertBefore(this.context, firstChild);
            return this;
        },
        after: function(content){
            if(!this._parent())   return this;
            var nextNode = this.context.nextElementSibling || this.context.nextSibling;
            this._parent().insertBefore(this._toNode(content), nextNode);
            return this;
        },
        before: function(content){
            if(!this._parent())   return this;
            this._parent().insertBefore(this._toNode(content), this.context);
            return this;
        },
        replace: function(content){
            if(!this._parent())   return this;
            this._parent().replaceChild(this._toNode(content), this.context);
            return this;
        },
        remove: function(){
            if(!this._parent())   return this;
            this._parent().removeChild(this.context);
            return this;
        },
        swap: function(content){
            var node;
            if(SYST.V.isString(content) && SYST.T.trim(content)[0] === '#'){
                node = new Dom(content, content);
            }
            if(content instanceof Dom){
                node = content;
            }
            var cloneNode = node.clone(true);
            var cloneThis = this.clone(true);
            this.replace(cloneNode);
            node.replace(cloneThis);
        },
        attr: function(name, value){
            if(value == undefined)  return this.context.getAttribute(name);
            if(SYST.V.isObject(name)){
                SYST.T.each(Object.keys(name), function(key, i){
                    this.attr(key, name[key]);
                }, this);
            }else{
                this.context.setAttribute(name, value);
            }
            return this;
        },
        removeAttr: function(name){
            this.context.removeAttribute(name);
            return this;
        },
        prop: function(name, value){
            if(value == undefined)  return this.context[name];
            if(SYST.V.isObject(name)){
                SYST.T.each(Object.keys(name), function(key, i){
                    this.prop(key, name[key]);
                }, this);
            }else{
                this.context[name] = value;
            }
            return this;
        },
        removeProp: function(name){
            this.context[name] = undefined;
            delete this.context[name];
        },
        children: function(selector){
            var rs = [];
            Dom._inJectMethods(rs);
            selector = SYST.T.trim(selector || '');
            var children = this.context.children ?
            slice.call(this.context.children) :
            slice.call(this.context.childNodes).filter(function(node){
                return node.nodeType !== 3;
            });
            children.length > 0 && SYST.T.each(children, function(child){
                var mID = selector[0] === '#',
                    mClass = !mID && selector[0] === '.',
                    mAttr = attrReg.test(selector),
                    nameOnly = mID || mClass ? selector.slice(1) : selector;

                if( !selector
                    || (mID && child.id === nameOnly)
                    || (mClass && slice.call(child.classList).indexOf(nameOnly) !== -1)
                ){
                    _newDom(child, selector);
                }
                else if(mAttr){
                    var attr = selector.match(attrReg)[1];
                    if(attr && child.getAttribute(attr)){
                        _newDom(child, selector);
                    }
                }
                else if(!mID && !mClass){
                    if(child.tagName == selector.toUpperCase()){
                        _newDom(child, selector);
                    }
                }
            }, this);

            function _newDom(n, s){
                rs.push(new Dom(n, s));
            }

            return rs;
        },
        childrenAll: function(selector){
            var rs = [];
            Dom._inJectMethods(rs);

            _getChild(this);
            function _getChild(node){
                var childs = node.children(selector);
                childs && childs.length > 0 && SYST.T.each(childs, function(child){
                    rs.push(child);
                    childs = child.children(selector);
                    childs && _getChild(child);
                });
            }
            return rs;

        },
        parent: function(){
            return this._parent() && new Dom(this._parent());
        },
        parents: function(selector){
            var nodes = [],
                node = this.context.parentNode;
            Dom._inJectMethods(nodes);
            while(node){
                if(!SYST.V.isDocument(node) && nodes.indexOf(node) < 0){
                    node.parentNode && nodes.push(node);
                    node = node.parentNode;
                }else{
                    node = null;
                }
            }
            nodes = nodes.filter(function(node){
                var mID = selector.replace(/^#/, ''),
                    mClass = selector.replace(/^./, ''),
                    mAttr = attrReg.test(selector),
                    classMap = slice.call(node.classList) || [],
                    attrMap = node.getAttribute(mAttr),
                    hasAttr = (function(){
                        if(!mAttr)  return false;
                        var attr = selector.match(attrReg)[1];
                        if(attr && node.getAttribute(attr)) return true;
                    })();
                return selector == node.nodeName || mID == node.id || classMap.indexOf(mClass) > -1 || attrMap || hasAttr;
            });
            nodes = nodes.map(function(context){ return new Dom(context, selector) });
            return nodes;

        },
        next: function(selector){
            var next = [];
            if(!selector){
                if(this.context.nextElementSibling){
                    return new Dom(this.context.nextElementSibling);
                }
            }else{
                next = this._all('nextAll');
            }
            return next;
        },
        nextAll: function(){
            return this._all('nextAll');
        },
        prev: function(selector){
            var prev = [];
            if(!selector){
                if(this.context.previousElementSibling){
                    return new Dom(this.context.previousElementSibling);
                }
            }else{
                prev = this._all('prevAll');
            }
            return prev;
        },
        prevAll: function(){
            return this._all('prevAll');
        },
        siblings: function(){
            var siblings = this.parent().children();
            var index = SYST.T.indexOf(siblings.map(function(node){ return node.context; }), this.context);
            if(index > -1)  siblings.splice(index, 1);
            return siblings;
        },
        find: function(selector){
            var rs = [], result = Dom._qsa(this.context, selector);
            if(SYST.V.isArray(result) || result.length > 0){
                SYST.T.each(slice.call(result), function(context){
                    rs.push(new Dom(context, selector));
                });
            }else{
                result && SYST.V.isElement(result) && rs.push(new Dom(result, selector));
            }
            Dom._inJectMethods(rs);
            return rs;
        },
        show: function(val){
            if(val) {
                this.css('display', val);
            }else{
                this.css('display') == 'none' && this.css('display', '');
                var cssObject = getComputedStyle(this.context),
                    defaultStyle = cssObject.getPropertyValue('display');
                if('none' == defaultStyle){
                    this.css('display', this._getDefaultDisplay(this.context.nodeName));
                }
            }
            return this;
        },
        hide: function(){
            this.css('display', 'none');
            return this;
        },
        toggle: function(){
            return this.context.css('display') == 'none' ? this.show() : this.hide();
        },
        css: function(name, value){
            if(SYST.V.isObject(name)){
                SYST.T.each(name, function(styleVal, i, styleKey){
                    _sty.call(this, _fm(styleKey), styleVal);
                }, this);
            }
            else if(value == null) return this.context.style[name];
            else{
                _sty.call(this, _fm(name), value);
            }
            function _fm(name){
                return name = name.replace(/-([a-z]{1})/gi, function(m, $1){
                    return ($1 || '').toUpperCase();
                });
            }
            function _sty(name, val){
                this.context.style[name] = val;
            }
            return this;
        },
        /**
         * 判断class是否存在
         * @param name
         * @returns {boolean}
         * use:
         *      exp: <p class="tips success"></p>
         *      node.hasClass('tips')           => true
         *      node.hasClass('tips|success')   => true
         *      node.hasClass('tips success')   => true
         *      node.hasClass('tips error')     => false
         *      node.hasClass('tips|error')     => true
         */
        hasClass: function(name){
            var classList = this.context.classList ? slice.call(this.context.classList) : this.context.className.split(/\s+/g),
                isOr = SYST.V.isString(name) ? /\|/.test(name) : false,
                cls = SYST.V.isArray(name) && name || SYST.T.trim(name || '').split(/\s+|\|+|\++/),
                flag = false;

            for(var i = 0; i < cls.length; ++i){
                var index = classList.indexOf('' + cls[i]);
                if(index > -1){
                    if(isOr)    return true;
                    flag = true;
                }else{
                    flag = false;
                }
            }
            return flag;
        },
        addClass: function(name){
            var classList = this.context.classList,
                cls = SYST.V.isArray(name) && name || SYST.T.trim(name || '').split(/\s+/);
            SYST.T.each(cls, function(cn){
                SYST.T.indexOf(classList, cn) < 0 && classList.add(cn);
            }, this);
            return this;
        },
        removeClass: function(name){
            var classList = this.context.classList,
                cls = SYST.V.isArray(name) && name || SYST.T.trim(name || '').split(/\s+/);
            SYST.T.each(cls, function(cn){
                SYST.T.indexOf(classList, cn) > -1 && classList.remove(cn);
            }, this);
            if(classList.length === 0) this.removeAttr('class');
            return this;
        },
        toggleClass: function(name){
            return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
        },
        html: function(html){
            if(html == null) return this.context.innerHTML;
            if(this.context.nodeType === 3) this.text(html);
            if(SYST.V.isElement(html))  html = html.outerHTML;
            if(Dom._isDom(html))  html = html.context.outerHTML;
            this.context.innerHTML = html;
            return this;
        },
        text: function(text){
            if(!SYST.V.isString(text))
                return this.context.textContent;
            this.context.textContent = text;
            return this;
        },
        val: function(val){
            if(/INPUT|TEXTAREA|SELECT/i.test(this.context.nodeName)){
                if(val == null)    return this.context.value || '';
                else this.context.value = val;
            }
            return this;
        },
        load: function(url, cb){
            SYST.Ajax.load(this.selector, url, cb);
        },
        /**
         * 向上查找元素（事件委托）
         * @param selector  需要侦听事件的元素选择器
         * @param context   当前触发事件的对象（event.target）
         * @returns {Array}
         */
        closet: function(selector, context){
            var nodes = [],
                collection = slice.call(this.find(selector)).map(function(node){ return node.context; }),
                node = context.parentNode;

            // #id
            if(collection.length === 1 && collection[0] === context){
                return collection;
            }

            SYST.T.each(collection, function(node){
                if(node === context){
                    nodes.push(node);
                }
            });
            if(nodes.length > 0)    return nodes;

            while(node && SYST.T.indexOf(collection, node) === -1){
                node = node !== context && !SYST.V.isDocument(node) && node.parentNode;
            }
            if(node && SYST.T.indexOf(nodes, node) < 0){
                nodes.push(node);
            }

            return nodes;
        },

        once: function(event, fn, data, target, selector){
            this.on(event, fn, data, target, selector, true);
        },
        on: function(event, fn, data, target, selector, one, noCache){
            var delegator, handler = {}, autoRemove = fn;
            if(one) {
                autoRemove = function(evt){
                    this._inJectTarget(evt, evt.currentTarget);
                    this._removeEvent([handler], event, fn);
                    return fn.apply(target || this, arguments);
                }.bind(this);
            }
            if(selector){
                delegator = function(evt){
                    var matcher = this.closet(selector, evt.target)[0];
                    this._inJectTarget(evt, matcher || evt.target);
                    return matcher && (autoRemove || fn).apply(target || matcher, [evt, data]);
                }.bind(this);
            }

            var cb = delegator || autoRemove;
            handler.proxy = function(evt){
                evt = this._recombineEvent(evt);
                this._inJectTarget(evt, evt.currentTarget);
                this._inJectProps(evt, { '$data': data });
                var result = cb.apply(target || this, [evt].concat(slice.call(arguments, 1)));
                if(result === false){
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.stopImmediatePropagation();
                }
                return result;
            }.bind(this);
            handler.delegator = delegator;
            handler.selector = selector;
            handler.container = this.selector;
            handler.fn = fn;
            handler.type = event;

            if(!SYST.Events._cache[event])    SYST.Events._cache[event] = [];
            !noCache && SYST.Events._cache[event].push(handler);
            if('addEventListener' in this.context){
                this.context.addEventListener(event, handler.proxy, false);
            }
            return this;
        },
        off: function(event, selector, fn){
            event = SYST.T.trim(event || '');

            if(!event){
                SYST.T.each(SYST.Events._cache, function(events){
                    this._removeEvent(events, selector);
                }, this);
                SYST.Events._cache = {};
            }else{
                var events = this._getCacheEvent(event, selector, fn);
                this._removeEvent(events, selector);
            }
            return this;
        },
        delegate: function(selector, event, fn, data, target){
            return this.on(event, fn, data, target, selector);
        },
        undelegate: function(selector, event, fn){
            return this.off(event, selector, fn);
        },

        toString: function(){
            return this.context;
        },

        //-----private------
        _init: function(){
            this._mixinEvents();
        },
        _mixinEvents: function(){
            var self = this;
            SYST.T.each(evts, function(event){
                Dom.prototype[event] = function(){
                    var cb = slice.call(arguments)[0];
                    if(evtsels.indexOf(event) > -1 && !cb){
                        self.context[event]();
                    }
                    else if(evtforms.indexOf(event) > -1 && !cb){
                        self._isForm() && self.context[event]();
                    }
                    else{
                        self.on(event, function(e){
                            cb.apply(self, arguments);
                        });
                    }
                    return self;
                };
            });
        },
        _toNode: function(content){
            var frame = document.createDocumentFragment(),
                dom;

            if(SYST.V.isString(content)){
                content = SYST.T.trim(content);
                if(content[0] == '<' && fragmentRE.test(content)){
                    dom = Dom._fragment(content);
                }else{
                    dom = document.createTextNode(content);
                }
            }
            if(content instanceof Dom){
                dom = content.context;
            }
            if(SYST.V.isElement(content)){
                dom = content;
            }

            if(SYST.V.isArray(dom) && dom.length > 0 && dom[0].nodeType){
                SYST.T.each(dom, function(node){
                    node && frame.appendChild(node);
                });
            }else{
                frame.appendChild(dom);
            }
            return frame;
        },
        _removeEvent: function(events, selector){
            events && events.length > 0 && SYST.T.each(events, function(cb){
                if('removeEventListener' in this.context){
                    this.context.removeEventListener(cb.type, cb.proxy, false);
                }
                if(SYST.Events._cache[cb.type]){
                    var index = SYST.Events._cache[cb.type].indexOf(cb);
                    if(index > -1){
                        SYST.Events._cache[cb.type].splice(index, 1);
                    }
                }
            }, this);
        },
        _getCacheEvent: function(event, selector, fn){
            var events = event.split(/\s+/),
                cache = [];
            SYST.T.each(events, function(type){
                var es = SYST.Events._cache[type];
                es && SYST.T.each(es, function(event){
                    var mabeId = /^#/.test(selector);
                    if(event.selector == selector
                        && event.type == type
                        && (mabeId || event.container == this.selector)){
                        cache.push(event);
                    }
                }, this);
            }, this);
            return cache;
        },
        _recombineEvent: function(evt, source){
            if (source || !evt.isDefaultPrevented){
                source || (source = evt);

                SYST.T.each(eventMethods, function(func, i, method){
                    var sourceMethod = evt[method];
                    if(!SYST.V.isFunction(sourceMethod)){
                        sourceMethod = func.bind(this);
                    }
                }, this);
            }
            return evt;
        },
        _all: function(type){
            var ns = [], i,
                cs = slice.call(this.parent().children()),
                nextContexts = cs.map(function(dom){ return dom.context; }),
                index = nextContexts.indexOf(this.context);
            if('nextAll' === type){
                for(i = index + 1; i < ns.length; ++i){
                    ns.push(cs[i]);
                }
            }
            else if('prevAll' === type){
                for(i = index - 1; i >= 0; --i){
                    ns.push(cs[i]);
                }
            }
            Dom._inJectMethods(ns);
            return ns;
        },
        _isForm: function(){
            return 'FORM' === this.context.nodeType && this.context.action;
        },
        _parent: function(){
            return this.context.parentNode;
        },
        _getDefaultDisplay: function(tagName){
            if(defDisplayCache[tagName])    return defDisplayCache[tagName];
            var tempEl = document.createElement(tagName);
            document.body.appendChild(tempEl);
            var display = getComputedStyle(tempEl).getPropertyValue('display');
            defDisplayCache[tagName] = display;
            tempEl.parentNode.removeChild(tempEl);
            return display;
        },
        _inJectProps: function(object, props){
            if(SYST.V.isObject(props)){
                SYST.T.each(props, function(pv, i, pn){
                    object[pn] = pv;
                });
            }
        },
        _inJectTarget: function(object, value){
            this._inJectProps(object, { '$target': new Dom(value) });
        }
    };

    //Query Selecter All
    Dom._qsa = function(element, selector){
        var mID = selector[0] === '#',
            mClass = !mID && selector[0] === '.',
            nameOnly = mID || mClass ? selector.slice(1) : selector,
            isSimple = /^[\w-]*$/.test(nameOnly),
            elements;

        if(isSimple && mID){
            elements = element.querySelector(selector);
        }
        else if(element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11){
            elements = null;
        }
        else{
            if(isSimple && !mID && SYST.V.isElement(element)){
                if(mClass){
                    elements = element.getElementsByClassName(nameOnly);
                }else{
                    elements = element.getElementsByTagName(nameOnly);
                }
            }else{
                elements = element.querySelectorAll(selector);
            }
        }
        return elements;
    };
    Dom._fragment = function(html, name){
        var doms, container;
        if(singleTagRE.test(html))  doms = document.createElement(RegExp.$1);

        if(!doms){
            if(html.replace)            html = html.replace(tagExpanderRE, "<$1></$2>");
            if(name === undefined)      name = fragmentRE.test(html) && RegExp.$1;
            if(!(name in containers))   name = '*';

            container = containers[name];
            container.innerHTML = '' + html;
            doms = slice.call(container.childNodes);
            return !doms[1] ? doms[0] : doms;
        }
        return doms;
    };
    Dom._inJectMethods = function(list){
        var prototypes = Dom.prototype, ms = ['_init', '_mixinEvents'];
        if(!SYST.V.isArray(list))   return;
        SYST.T.each(prototypes, function(method, i, name){
            if(ms.indexOf(name) === -1){
                def(list, name, function(){
                    var args = slice.call(arguments), rs = [], result;
                    SYST.T.each(list, function(node){
                        if(evts.indexOf(name) !== -1){
                            node.on.apply(node, args);
                        }else{
                            result = method.apply(node, args);
                            if(SYST.V.isArray(result)){
                                rs = rs.concat(result);
                            }
                            if(!result._dom_){
                                return result;
                            }
                        }
                    });
                    if(evts.indexOf(name) !== -1){
                        return list;
                    }
                    if(rs && rs.length > 0){
                        Dom._inJectMethods(rs);
                        return rs;
                    }
                    return list;
                });
            }
        });
        def(list, 'get', function(index){
            var node = this[index];
            return node && node.context;
        });
        def(list, 'eq', function(index){
            return this[index];
        });
        def(list, '_dom_', function(){ return true; });
    };
    Dom._isDom = function(dom){
        return dom instanceof Dom || dom._dom_;
    };

    SYST.Dom = SYST.$ = function(selector){
        if(!selector)   return null;
        var element;
        if(SYST.V.isFunction(selector)){
            return SYST.ready(selector);
        }
        if(!SYST.V.isString(selector)){
            if(SYST.V.isWindow(selector)){
                element = document;
            }
            else if(SYST.V.isElement(selector)){
                element = selector;
            }else{
                return null;
            }
            return new Dom(element, selector);
        }

        selector = SYST.T.trim(selector);

        if('body' == selector){
            element = document.body;
        }
        else if('document' == selector){
            element = document;
        }
        else if('html' == selector){
            element = document.querySelector('html');
        }
        else if(selector[0] == '<' && fragmentRE.test(selector)){
            element = Dom._fragment(selector);
        }
        else{
            element = Dom._qsa(document, selector);
            if(element && element.length && !SYST.V.isElement(element))
                element = slice.call(element);
            if(!element || element.length === 0)    return null;
        }

        if(SYST.V.isArray(element) && element.length > 0){
            var rs = [];
            SYST.T.each(element, function(node){
                rs.push(new Dom(node, selector));
            });
            Dom._inJectMethods(rs);
            return rs;
        }else{
            return element ? new Dom(element, selector) : null;
        }
    };

})(SYST);
