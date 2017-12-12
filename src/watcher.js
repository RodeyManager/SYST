/**
 * Created by r9luox on 2016/4/28.
 * Model props watcher
 * 数据绑定 监听对象
 * 监听数据变化，实时更新UI
 */

;!(function(SYST){

    var _$ = SYST.$,
        _each = SYST.T.each,
        reg = /\{\{\s*=*?\s*([^\{]*?)\s*\}\}/gi,
        getReg = function(mode){ return new RegExp(reg.source, mode || 'gi');  },
        isIE9 = SYST.N.UA.indexOf('msie 9.0') > 0,
        notValReg = /^[^\w]*/gi,
        toArrReg = /\s*[,\|\/\\-_]\s*/gi,
        filterReg = /\s*\|\s*/gi,
        fnParamsReg = /\s*(\(([^\)]*?)\))\s*/,
        builtReg = function(){ return /\$(value|item|key|first|last|index)/gi; },
        tplConfig = { open: '{{', close: '}}' },
        wait = 50,
        keyMaps = { enter: 13, shift: 16, tab: 9, esc: 27, up: 38, down: 40, left: 37, right: 39, blackSpace: 32, capsLook: 20},
        filterTure = function(f){ return f && '' != f; },
        trimAttrValue = function(str){
            return SYST.T.rtrim((str || '').replace(/[\s\{\}]*/gi, ''), '|');
        },
        isTemplate = function(el){
            return (/TEMPLATE|SCRIPT|STYLE/i.test(el.tagName)) ? true : false;
        };

    var st_model = 'st-model',
        st_prop = 'st-prop',
        st_template = 'st-template',
        st_style = 'st-style',
        st_for = 'st-for',
        st_option = 'st-option',
        st_if = 'st-if',
        st_else = 'st-else',
        st_show = 'st-show',
        st_hide = 'st-hide',
        st_on = 'st-on',
        st_index = 'st-index';

    function stName(name, isAttr){
        var sts = 'st-' + name;
        return isAttr ? '[' + sts + ']' : sts;
    }

    var Watcher = function(model){
        if(!model)
            throw new ReferenceError('args 1 can ben SYST.Model');
        this._reset(model);
    };

    Watcher.prototype = {
        //初始化 开始监听
        init: function(){
            this._init();
        },
        /**
         * 当新增属性（数据）时，将添加对应的watch
         * @param propName      属性名
         * @param propValue     属性值
         */
        addListener: function(propName, propValue){
            this._getModelTags(propName);
            if(propValue){
                this.model.set(propName, propValue);
            }
        },
        /**
         * 当某个属性被移除时，将对应的wath也移除掉
         * @param propName
         */
        removeListener: function(propName){
            if(!propName){
                return this.removeListenerAll();
            }
            //删除指定的属性绑定的数据
            this._deleteBinds(propName);
            return this;
        },
        removeListenerAll: function(){
            this._reset();
            return this;
        },

        add: function(propName, value){
            _each(this.bindModelTags, function(tag){
                if(!isTemplate(tag)){
                    tag.removeAttribute(st_model);
                    this._getBindNodes(tag, propName);
                }
            }, this);
            this.update(propName, value);
        },

        /**
         * 更新数据被绑定的UI
         * @param propName: 属性名
         * @param propValue: 属性值
         * @param model: 当前绑定的model
         */
        update: function(propName, propValue){
            if(!SYST.V.isEmpty(propName) && SYST.V.isString(propName)){
                if(propValue){
                    this.model._props[propName] = propValue;
                }
                this._createVM();
                //同步更新绑定样式
                this.updateBindTextAndAttrNodes(propName);
                this.updaateBindDisplay(propName);
                this.updateBindProps(propName);
                this.updateBindStyles(propName);
                this.updateBindRepeats(propName);
                this.updateRenderTemplate();
            }

            this._removeStLockNodes();
        },
        //重新获取监听属性tag
        reset: function(model){
            this._reset(model);
            //如果 props key 存在
            //只更新 props对应的key
            this._getModelTags();

        },
        updateBindTextAndAttrNodes: function(propName){
            //同步更新文本节点
            this._makeBindTextNodes(propName);
            //同步更新属性节点
            this._makeBindAttrNodes(propName);
        },
        updateBindProps: function(propName){
            if(propName && !this.bindElements[propName])    return;
            this._makeProps(propName);
        },
        updateRenderTemplate: function(propName, data){
            this._makeBindTemplates(propName, data);
        },
        updateBindStyles: function(propName){
            if(propName && !this.bindStyles[propName])    return;
            this._makeStyles(propName);
        },
        updateBindRepeats: function(propName){
            if(propName && !this.bindRepeats[propName])    return;
            this._makeRepeats(propName);
        },
        updaateBindDisplay: function(propName){
            this._makeDisplays(propName);
        },
        updateBindEvents: function(){
            this._makeBindEvents();
        },

        //------------------------Private----------------------
        _init: function(){
            if(!this.model._props)
                return this;
            this._getModelTags();

        },
        _reset: function(model){
            this.model = model || this.model;
            this._createVM();
            //st-model in element attribute
            this.bindModelTags = [];
            //prop expression text node
            this.bindTextNodes = [];
            //prop in element attribute
            this.bindAttrNodes = [];
            //prop is key, elements is value
            this.bindElements = {};
            //bind templates as tag id
            this.bindTemplates = {};
            //bind styles as st-style tag
            this.bindStyles = {};
            //bind repeat data as st-repeat tag
            this.bindRepeats = {};
            //bind st-if st-else st-show st-hide
            this.bindDisplayNodes = { 'st-if': {}, 'st-else': {}, 'st-show': {}, 'st-hide': {}};
        },
        _createVM: function(){
            this.vm = Object.create(this.model);
        },
        _deleteBinds: function(propName){
            var binds = [this.bindElements, this.bindTemplates, this.bindRepeats, this.bindStyles];
            (function _delete(binds){
                _each(binds, function(bind){
                    bind[propName] = null;
                    delete bind[propName];
                });
            })(binds);
        },
        //======================== st-model =======================================
        _getModelTags: function(propName){
            var tags = this.vm.tags, $mid = this.vm.$mid, mId = $mid[0] === '#', mClass = $mid[0] === '.';
            this.bindModelTags = tags.length > 0
                ? tags
                : (function(){
                    if(mId || mClass){
                        return document.querySelectorAll($mid);
                    }else{
                        return document.querySelectorAll('['+ st_model +'='+ $mid +']');
                    }
                })();

            _each(this.bindModelTags, function(tag){
                if(!isTemplate(tag)){
                    tag.removeAttribute(st_model);
                    this._getBindAction(tag);
                    this._getBindNodes(tag, propName);
                }
            }, this);

            this._makeBindTextNodes(propName);
            this._makeBindAttrNodes(propName);
            this._makeDisplays(propName);

            //st-lock
            this._removeStLockNodes();
        },
        _getBindNodes: function(node, propName){
            if(node.nodeType === 3 && SYST.T.trim(node.textContent) === '') return;
            var children = node.childNodes;
            if(this._getAttr(node, st_for)){
                this._getBindRepeats(node, propName);
                this._isSelectTag(node) && this._getAttr(node, st_prop) && this._getBindElements(node);
                this._getBindAction(node);
                return this;
            }
            if(this._getAttr(node, st_option)){
                this._getBindAction(node);
                return this;
            }
            if(children.length > 0){
                for(var i = 0; i < children.length; ++i){
                    if(this._getAttr(node, st_model) || children[i].nodeType === 8)   continue;
                    if(this._getAttr(node, st_template) || isTemplate(node))   break;
                    if(this._getAttr(node, st_for))   break;
                    this._getBindAction(node);
                    this._getBindElements(node);
                    //递归查找
                    this._getBindNodes(children[i]);
                }
            }else{
                this._getBindAction(node);
                //textNode nodeType = 3
                this._getBindTextNodes(node);
                //element node st-prop
                this._getBindElements(node);
                //element node st-template
                this._getBindTemplates(node);
            }
        },
        _getBindAction: function(node){
            //element attribute node
            this._getBindAttrNodes(node);
            //element node st-style
            this._getBindStyles(node);
            //element node st-show st-hide st-if st-else
            this._getBindDisplays(node);
            //element node st-on event
            this._getBindEvents(node);
        },
        _removeStLockNodes: function(){
            //显示
            var stLockNodes = _$('[st-lock]');
            stLockNodes && stLockNodes.length > 0 && _each(stLockNodes, function(node){
                node.removeAttr('st-lock');
                node.show();
            });
        },

        //======================== text node ======================================
        _getBindTextNodes: function(node){
            var nodeType = node.nodeType,
                parentNode = node.parentNode,
                textContent = SYST.T.trim(node.textContent);
            if(nodeType !== 3)  return;
            //根据标签元素中内容查找 绑定元素
            if(parentNode && (parentNode.getAttribute(st_for) ||
                (parentNode.ve && parentNode.ve.getAttribute(st_for)))) return;
            if(nodeType === 3 && textContent && getReg().test(textContent) && !(builtReg().test(textContent))){

                this._cloneVeNode(node);
                node.ve.raw = textContent.substr(0);
                this._toBindTextNodes(node);
            }
        },
        _toBindTextNodes: function(node){
            if(SYST.T.indexOf(this.bindTextNodes, node) === -1){
                this.bindTextNodes.push(node);
            }
        },
        _makeBindTextNodes: function(propName, nodes){
            var _nodes = nodes || this.bindTextNodes;
            if(propName && (!_nodes || !_nodes.length === 0)) return;

            _each(_nodes, function(textNode){
                this._renderBindText(propName, textNode);
            }, this);
        },
        _renderBindText: function(propName, node){
            var ve = node.ve,
                raw = ve.raw,
                templateStr, renderTEXT, hs;

            var renderTemplate = this._getRenderTemplate(raw);
            templateStr = renderTemplate.template;
            hs = this._mergeHelpers(renderTemplate.helpers);

            renderTEXT = SYST.T.render(templateStr, this.vm.props, hs, tplConfig, this.vm);
            node.textContent = renderTEXT;
        },

        //======================== element attributes =============================
        /**
         * 根据标签属性中含有被绑定属性，并以模板形式呈现的，如：<div data-name={{ prop }} ></div>
         * @param bindTag
         * @private
         */
        _getBindAttrNodes: function(node){
            if(node.nodeType !== 1)   return;

            var attributes = node.attributes;
            if(attributes.length > 0){
                _each(attributes, function(nd){
                    var textContent = nd.textContent;
                    if(getReg().test(textContent) && !(builtReg().test(textContent)) && nd.nodeName !== st_style){
                        if(!node['ve']){
                            nd['ve'] = nd.cloneNode();
                            //保存元素原内容,便于以后置换绑定数据使用
                            nd['ve']['raw'] = textContent.substr(0);
                        }
                        this._toBindAttrNode(nd);
                    }
                }, this);
            }
        },
        _toBindAttrNode: function(node){
            if(SYST.T.indexOf(this.bindAttrNodes, node) === -1){
                this.bindAttrNodes.push(node);
            }
        },
        _makeBindAttrNodes: function(propName, nodes){
            var _nodes = nodes || this.bindAttrNodes;
            if(propName && (!_nodes || !_nodes.length === 0)) return;

            _each(_nodes, function(attrNode){
                this._renderBindText(propName, attrNode);
            }, this);
        },

        //======================== st-prop ========================================
        /**
         * 获取数据被绑定的UI as st-prop
         * @param bindTag 具有st-model属性的单个标签元素
         * @private
         */
        _getBindElements: function(node){
            //根据标签属性名来查找 绑定元素
            if( node.nodeType !== 1 ||
                !this._getAttr(node, st_prop) ||
                isTemplate(node) ||
                this._getAttr(node,st_template) ||
                (this._getAttr(node,st_for) && !this._isSelectTag(node))){
                return;
            }
            var name = this._getRootPropName(node.getAttribute(st_prop));
            //作为当前元素的虚拟元素
            //当前元素将移除所有指令，而指令保存到虚拟元素中
            //元素将于model prop绑定，后期更新将只通知对应的元素并从虚拟元素中提取指令
            this._cloneVeNode(node);
            this._toBindElements(name, node);
            this._makeProps(name);
        },
        /**
         *  将属性名于之对应的绑定元素组合，属性名为key，值为元素数组
         *  方便在单独改变prop是只更新与之对应的元素
         * @param name: 属性名
         * @param element: 属性值
         */
        _toBindElements: function(name, node){
            node.removeAttribute(st_prop);
            if(!SYST.V.isArray(this.bindElements[name])){
                this.bindElements[name] = [];
                this.bindElements[name].push(node);
            }else{
                if(SYST.T.indexOf(this.bindElements[name], node) === -1){
                    this.bindElements[name].push(node);
                }
            }
        },
        /**
         * 更新UI
         * @param propName  绑定的属性名
         * @param elements  属性名对应的绑定元素
         * @private
         */
        _makeProps: function(propName){
            var _elements = this._getBinds(propName, this.bindElements);
            if(propName && !_elements[propName]) return;
            _each(_elements, function(elements, index, prop){
                var els = elements || this.bindElements[prop];
                if(SYST.V.isArray(els) && els.length !== 0){
                    _each(els, function(element){
                        this._makeProp(prop, element);
                    }, this);
                }
            }, this);
        },
        //监听 props属性变化
        _makeProp: function(propName, node){
            if(!(propName in this.vm._props))   return;
            var self = this,
                ve = node.ve,
                $node = _$(node),
                stProp = ve.getAttribute(st_prop),
                attr = this._getPropName(stProp),
                putPattern = false,
                value, debounce, helpers;
            helpers = this._getHelperAsString(stProp);
            value = this._getProp(ve);

            //根据元素类型进行数据更新
            if(/TEXTAREA|INPUT|SELECT/.test(node.tagName)){

                //on change event
                $node.on('change', function(){
                    _listener(node, attr, helpers);
                });

                //input type radio
                if(/RADIO/i.test(node.type)){
                    node.value == value && (node.checked = true);
                    return false;
                }
                //input type checkbox
                else if(/CHECKBOX/i.test(node.type)){
                    _checkeboxValue(node, value);
                    return false;
                }

                node.value = value;
                //设置虚拟element属性value，以得保存
                ve.setAttribute('value', value);

                if(/TEXTAREA|INPUT/.test(node.tagName)){
                    //textarea、input
                    //解决中文输入问题
                    $node.on('compositionstart', function(){
                        putPattern = true;
                    }).on('compositionend', function(){
                        putPattern = false;
                    }).on('input', function(){
                        if(putPattern)  return;
                        _listener(node, attr, helpers);
                    });

                    isIE9 && $node.on('cut', function(){
                        _listener(node, attr, helpers);
                    });

                }
            }
            else{
                if($node.attr(st_for)) return;
                stProp = ve.getAttribute(st_prop);
                if(stProp || !ve['raw']){
                    //node.innerHTML = self._getProp(ve);
                    $node.html(self._getProp(ve));
                }else{
                    //获取此 element
                    node.outerHTML = ve['raw'].replace(reg, function(match, $1){
                        return self._getProp(ve, $1);
                    });
                }
            }

            function _listener(context, attr, helpers){
                //console.log(context.checked);
                !debounce && (debounce = setTimeout(function(){
                    var value = self._makeHelpers(context.value, helpers);
                    if(context.type == 'checkbox'){
                        _updateCheckboxValue(attr, value, context.checked);
                    }else{
                        self.model.set(attr, value);
                        context.value = self._getProp(ve);
                    }
                    //同步更新文本节点 和 属性节点
                    self.updateBindTextAndAttrNodes(propName);
                }, wait));
            }
            function _checkeboxValue(context, val){
                if(!value){
                    context.checked = false;
                }
                else if(SYST.V.isArray(val)){
                    context.checked = val.indexOf(context.value) !== -1 ? true : false;
                }else{
                    val = val.split(toArrReg);
                    _checkeboxValue(context, val);
                }
            }
            function _updateCheckboxValue(propName, val, checked){
                var prop = self.vm.get(propName);
                if(SYST.V.isString(prop)){
                    prop = prop.split(toArrReg).filter(function(p){
                        return p && SYST.T.trim(p) !== '';
                    });
                }else if(!SYST.V.isArray(prop)){
                    prop = [];
                }
                if(checked){
                    prop.indexOf(val) === -1 && val.length > 0 && prop.push(val);
                }else{
                    prop = SYST.T.arrRemove(prop, val);
                }
                self.model.set(propName, prop);
            }

        },
        //获取 当前属性的最新值
        _getProp: function(node, prop){
            var stProp = prop || (node.getAttribute(st_prop) || '').replace(notValReg, ''),
                propName, filters, propValue;
            if(!stProp) return '';
            // exp: <span st-prop="user.name | trim | addFirstName"></span>
            filters = this._getHelperAsString(stProp);
            propName = this._getPropName(stProp);

            // exp: user.name.first
            if(/\./gi.test(propName)){
                propValue = this._getFinalPropValue(propName);
            }else{
                propValue = this.vm.get(propName);
            }

            if(propValue == null) return '';
            //如果绑定的属性是一个function，则获取执行结果
            if(SYST.V.isFunction(propValue)){
                propValue = propValue.apply(this.vm);
            }

            //each methods
            propValue = this._makeHelpers(propValue, filters);
            return propValue;

        },
        //获取跟属性名 ex：user.name.first => user
        _getRootPropName: function(attrStr){
            return trimAttrValue(attrStr).split(/\.|\|/gi)[0];
        },
        //获取跟属性名 ex：{{ user.name.first | trim | addLastName }} => user.name.first
        _getPropName: function(express){
            return trimAttrValue(express).split('|')[0];
        },

        //======================== st-template ========================================
        _getBindTemplates: function(node){
            if(node.nodeType !== 1 || !this._getAttr(node, st_template)) return;
            var templateId,
                bindProp;

            this._cloneVeNode(node);
            templateId = '#' + node.getAttribute(st_template);
            bindProp = node.getAttribute(st_prop);
            node.ve['_bindProp'] = bindProp;
            node.ve['_bindTemplateId'] = templateId;
            //添加到缓存
            this._toBindTemplates(templateId, node);
            this._makeBindTemplates(templateId);
        },
        _toBindTemplates: function(templateId, node){
            node.removeAttribute(st_prop);
            node.removeAttribute(st_template);
            if(!this.bindTemplates[templateId]){
                this.bindTemplates[templateId] = [];
            }
            if(SYST.T.indexOf(this.bindTemplates[templateId], node) === -1){
                this.bindTemplates[templateId].push(node);
            }
        },
        _makeBindTemplates: function(templateId, data){
            var nodes = this._getBinds(templateId, this.bindTemplates);
            Object.keys(nodes).length > 0 && _each(nodes, function(ts, index, templateId){
                (ts && ts.length > 0 )&& _each(ts, function(node){
                    this._renderTemplate(templateId, node, data);
                }, this);
            }, this);
        },
        _renderTemplate: function(templateId, node, data){
            if(!node)   return;
            var propName = node['ve']['_bindProp'];
            if(this.vm._props && Object.keys(this.vm._props).length === 0)  return;
            var datas;
            //如果没有绑定st-prop 则数据为当前Model的props属性对象
            if(!propName){
                datas = this.vm._props;
            }else{
                datas = this.vm.get(propName) || {};
                if(SYST.V.isObject(datas) && SYST.V.isObject(data)){
                    datas = SYST.extend(datas, data);
                }
                var object = {};
                object[propName] = datas;
                datas = object;
            }
            node.innerHTML = SYST.T.render(templateId, datas, null, tplConfig, this.vm);
        },

        //========================= st-style ===========================================
        _getBindStyles: function(node){
            var styleString, temp, reg = getReg();
            if(node.nodeType !== 1 || !this._getAttr(node, st_style)) return;

            styleString = node.getAttribute(st_style);
            //获取绑定的元素集合
            while((temp = reg.exec(styleString)) != null){
                this._cloneVeNode(node);
                node.ve[st_style] = styleString;
                var propName = this._getPropName(temp[1]);

                if(!this.vm.hasProp(propName)){
                    this.model.add(propName, null, true);
                }
                this._toBindStyles(propName, node);
                this._makeStyles(propName);
            }
        },
        _toBindStyles: function(propName, node){
            node.removeAttribute(st_style);
            var bindNodes = this.bindStyles[propName];
            if(!bindNodes){
                bindNodes = this.bindStyles[propName] = [];
            }
            if(SYST.T.indexOf(bindNodes, node) === -1){
                bindNodes.push(node);
            }
        },
        _makeStyles: function(propName){
            var bindNodes = this._getBinds(propName, this.bindStyles);
            _each(bindNodes, function(styles, index, propName){
                this._makeStyle(propName, styles);
            }, this);
        },
        _makeStyle: function(propName, nodes){
            if(!(propName in this.vm._props)) return;
            var stStyles, hs, renderTemplate;
            nodes = nodes || this.bindStyles[propName];
            SYST.V.isArray(nodes)
            &&
            _each(nodes, function(node){
                renderTemplate = this._getRenderTemplate(node.ve[st_style]);
                stStyles = renderTemplate.template;
                hs = this._mergeHelpers(renderTemplate.helpers);
                stStyles = SYST.T.render(stStyles, this.vm._props, hs, tplConfig, this.vm);
                this._setStyles(node, stStyles);

            }, this);

        },
        _setStyles: function(node, styles){
            if(!styles) return;
            styles = styles.replace(/\s*(\:|;)\s*/gi, '$1').split(';');
            styles && SYST.V.isArray(styles) && _each(styles, function(s){
                var sy = SYST.T.trim(s).split(':');
                sy && (node.style[sy[0]] = sy[1]);
            });
        },

        //========================= st-for st-repeat ====================================
        _getBindRepeats: function(node){
            if(node.nodeType !== 1 || !this._getAttr(node, st_for))  return;
            //获取绑定的元素集合
            if(!node.ve)    node.ve = node.cloneNode(true);
            var stFor = node.getAttribute(st_for),
                // _forString = this._getPropName(stFor),
                _forString = SYST.T.trim(stFor),
                prop, hs;
            var fis = _forString.split(/\s+(in|as|of)\s+/gi).map(function(fit){ return fit.trim(); });
            if(fis.length > 1){
                prop = this._getRootPropName(fis[2]);
            }else{
                prop = this._getRootPropName(fis[0]);
            }
            hs = this._getHelperAsString(stFor);
            node.ve['helpers'] = hs;
            node.ve['_parent_'] = node.parentNode;
            //st-for model prop filters
            if(hs && hs.length > 0){
                this.vm._props[prop] = this._makeHelpers(this.vm.get(prop), hs);
            }

            this._toBindRepeats(prop, node);
            this._makeRepeats(prop);
            this._getBindNodes(node, prop);
        },
        _toBindRepeats: function(propName, node){
            node.removeAttribute(st_for);
            node.removeAttribute(st_index);
            var bindRepeatElements = this.bindRepeats[propName];
            if(!bindRepeatElements){
                this.bindRepeats[propName] = [];
                bindRepeatElements = this.bindRepeats[propName];
            }
            if(SYST.T.indexOf(bindRepeatElements, node) === -1){
                bindRepeatElements.push(node);
            }
        },
        _makeRepeats: function(propName){
            var bindRepeatElements = this._getBinds(propName, this.bindRepeats);
            _each(bindRepeatElements, function(nodes, index, prop){
                nodes && this._makeRepeat(prop, nodes);
            }, this);
        },
        _makeRepeat: function(propName, nodes){
            if(!this.vm.hasProp(propName) || !nodes || nodes.length === 0) return;
            var $node;
            _each(nodes, function(node){
                //var startTime = Date.now();
                $node = _$(node);
                $node.html(this._renderBindRepeats(node, propName));
                //console.log(propName, (Date.now() - startTime) / 1000);

                //get st-style bind attribute
                var stStyleNodes = $node.find('[st-style]');
                stStyleNodes.length > 0 && _each(stStyleNodes, function(el){
                    var stStyles = el.attr(st_style);
                    el.removeAttr(st_style);
                    stStyles && this._setStyles(el.context, stStyles);
                }, this);

                //not bind events ---最好的做法是代理到element上
                var stonNodes = $node.find('[st-on]');
                stonNodes.length > 0 && _each(stonNodes, function(el){
                    this._getBindEvents(el.context);
                }, this);
            }, this);

        },
        /**
         * 处理数组的情况
         * @param element       被绑定的元素
         * @param propName      绑定的属性名
         * @returns { element }
         * @private
         */
        _renderBindRepeats: function(node){
            var templateStr, hs;
            var templateObject = this._getBindRepeatsRenderTpl(node);
            templateStr = templateObject.template || '';
            hs = this._mergeHelpers(templateObject.helpers);
            templateStr = this._formatOn(templateStr, true);
            return SYST.T.render(templateStr, this.vm._props, hs, tplConfig, this.vm);
        },
        _getBindRepeatsRenderTpl: function(node){
            var ve = _$(node.ve),
                html,
                helpers = {};

            //create temp node
            var $tempNode = ve.clone(true);
            $tempNode.context.ve = ve;
            html = $tempNode.context.outerHTML;

            var renderTemplate = this._getRenderTemplate(html);
            var div = SYST.$(renderTemplate.template);
            helpers = renderTemplate.helpers;
            var $frame = SYST.$(document.createDocumentFragment());
            $frame.append(div);

            var childNodes = $frame.find('[st-for]');

            _each(childNodes, function(node){
                _createBeforeEachTpl.call(this, node);
                _createAfterEachTpl.call(this, node);
            }, this);


            //create each expression text
            function _createBeforeEachTpl(node){
                var ve = _$(node.context.ve || node.context),
                    stFor = ve.attr(st_for),
                    stIndex = ve.attr(st_index),
                    // _forString = this._getPropName(stFor),
                    _forString = SYST.T.trim(stFor),
                    templateStr,
                    propName, itemName;

                var fis = _forString.split(/\s+(in|of|as)\s+/gi).map(SYST.T.trim);
                if(fis.length > 1){
                    itemName = fis[0];
                    propName = fis[2];
                }else{
                    propName = fis[0];
                }
                var hs = ve.helpers || this._getHelperAsString(stFor);

                if(hs && hs.length > 0){
                    helpers = SYST.extend(helpers, this._getHelperToRender(hs));
                }

                templateStr = '{{ each(' + propName + ' || [], function(_item_, i, key){ var ';
                templateStr += (itemName ? itemName + '=' : '') + '_item_, ';
                templateStr += (stIndex ? stIndex : '$index') + '=' + 'i, ';
                templateStr += '$item=_item_, $value=_item_, $key=key, ';
                templateStr += '$length = '+ propName + '.length, $first = (i == 0 ? true : false), $last = (i == $length - 1 ? true : false); }}';

                var beforeTextNode = document.createTextNode(templateStr);
                node.prepend(beforeTextNode);

            }

            function _createAfterEachTpl(node){
                var afterTextNode = document.createTextNode('{{ }, this); }}');
                node.append(afterTextNode);
            }

            return { template: $frame.children().eq(0).html(), helpers: helpers };

        },

        //========================= st-if st-else st-show st-hide =======================
        _getBindDisplays: function(node){
            var self = this;
            function _eachDisplays(st_attr){
                if(node.nodeType === 3 || !self._getAttr(node, st_attr))  return false;
                var stAttr = node.getAttribute(st_attr),
                    propName = self._getPropName(stAttr);
                //获取绑定的元素集合
                self._cloneVeNode(node);
                self._toBindDisplays(st_attr, propName, node);
            }

            _eachDisplays(st_show);
            _eachDisplays(st_hide);
            _eachDisplays(st_if);
            _eachDisplays(st_else);

        },
        _toBindDisplays: function(attr, propName, node){
            node.removeAttribute(attr);
            var bindDisplays = this.bindDisplayNodes[attr][propName];
            if(!bindDisplays){
                this.bindDisplayNodes[attr][propName] = [];
                bindDisplays = this.bindDisplayNodes[attr][propName];
            }
            if(SYST.T.indexOf(bindDisplays, node) === -1){
                bindDisplays.push(node);
            }
        },
        _makeDisplays: function(propName){
            var bindElements;
            bindElements = this._getBinds(propName, this.bindDisplayNodes[st_show]);
            bindElements && _each(bindElements, function(nodes, index, prop){
                this._makeDisplay(prop, nodes, st_show);
            }, this);

            bindElements = this._getBinds(propName, this.bindDisplayNodes[st_if]);
            bindElements && _each(bindElements, function(nodes, index, prop){
                this._makeDisplay(prop, nodes, st_if);
            }, this);

        },
        _makeDisplay: function(propName, nodes, attrName){
            attrName = attrName || st_show;
            if(!nodes || nodes.length === 0)  return;
            var propValue = this.vm.get(propName);
            _each(nodes, function(node){
                var ve = node.ve,
                    stAttr = this._getAttr(ve, attrName),
                    stHides = _getNodes.call(this, st_hide),
                    stElses = _getNodes.call(this, st_else),
                    helpers,
                    $node = _$(node);
                //如果存在 filter
                if(/^[^\|]+?\|/.test(stAttr)){
                    helpers = this._getHelperAsString(stAttr);
                    propValue = this._makeHelpers(propValue, helpers);
                }

                if(!propValue){
                    if(attrName === st_show){
                        $node.hide();
                        stHides && _each(stHides, function(el){
                            _$(el).show();
                        }, this);
                    }else{
                        $node.remove();
                    }
                }else{
                    if(attrName === st_show){
                        $node.show();
                        stHides && _each(stHides, function(el){
                            _$(el).hide();
                        }, this);
                    }else{
                        stElses && _each(stElses, function(el){
                            _$(el).remove();
                        }, this);
                    }
                }
            }, this);

            function _getNodes(attr){
                var nodes = this.bindDisplayNodes[attr][propName];
                return nodes && SYST.V.isArray(nodes) && nodes.length > 0 ? nodes : null;
            }
        },

        //========================= st-on =======================
        _getBindEvents: function(node){
            if(node.nodeType !== 1) return;
            if(node.ve && node.ve.getAttribute(st_for)) return;
            var stEvent = this._getAttr(node, st_on);
            if(!stEvent) return;
            stEvent = this._formatOn(stEvent);
            node._stOn = this._getFormatEvents(node, stEvent);
            node.removeAttribute(st_on);
            this._makeBindEvents(node);
        },
        _makeBindEvents: function(node){

            var events = node._stOn, $node = _$(node);
            (events.length > 0)
            && _each(events, function(event){
                var cb = this.vm[event.callback], handler,
                    type = event.type, index = event.args[0];
                //event.args.splice(0, 1);
                if(SYST.V.isFunction(cb)){
                    handler = SYST.T.proxy(this.vm, cb);
                    $node.off(type, handler).on(type, function(evt){
                        evt.$data = event.args;
                        //evt.$index = index;
                        this._isHit(evt, event, handler);
                    }.bind(this), event.args, node, null, null, true);
                }else{
                    throw new ReferenceError('this model has not event: ' + event.callback);
                }
            }, this);
        },

        //========================= common method =======================================
        //create virtaul node
        _cloneVeNode: function(node){
            !node.ve && (node.ve = node.cloneNode(true));
            !node.ve.raw && (node.ve.raw = node.outerHTML);
        },
        _getBinds: function(propName, binds){
            var bindElements = {};
            if(propName){
                bindElements[propName] = binds[propName];
            }else{
                bindElements = binds;
            }
            //array => object
            if(SYST.V.isArray(bindElements)){
                bindElements = SYST.T.arr2object(bindElements, propName);
            }
            return bindElements;
        },
        //get first prop for exp: user.name.first to get 'user'
        //获取嵌套绑定属性的值
        _getFinalPropValue: function(attrStr){
            var attr = attrStr.split('.');
            //console.log(attr);
            var index = 0, temp, tts = this.vm._props[attr[0].replace(notValReg, '')] || ''; //
            while(SYST.V.isObject(tts) && (temp = tts[attr[++index]]) != null){
                tts = tts[attr[index]];
            }
            return tts;
        },
        _getAttr: function(node, attr){
            return node.attributes && node.hasAttribute(attr) ? node.getAttribute(attr) : null;
        },
        //获取所有过滤器 ex: {{ name | trim | addLastName }}
        _getHelperAsString: function(str, prop){
            if(!str || str.length === 0)  return;
            var ms = str.split(filterReg), hs = [];
            if(!ms || !ms.length === 0) return;
            if(!prop){
                prop = ms[0];
                ms.shift();
            }
            if(ms.length === 0) return hs;
            var _reg = /\(\s*([^\)]*?)\s*\)/i;

            _each(ms, function(m){
                if(_reg.test(m)){
                    // {{ width | getWitdh('px') | formatWidth }}
                    if(/\./g.test(m))  return m;
                    var pms = [];
                    m = m.replace(_reg, function(mct, $1){
                        $1 = SYST.T.trim($1);
                        ($1 !== undefined || $1.length !== 0) && pms.push($1.replace(/"'/gi, ''));
                        return '';
                    });
                    hs.push({
                        fnName: m,
                        fnParams: pms
                    });
                }else{
                    // {{ width | formatWidth }}
                    hs.push({
                        fnName: m,
                        fnParams: null
                    });
                }
            });
            return hs;
        },
        _getHelperToRender: function(helpers){
            if(!SYST.V.isArray(helpers) || Object.keys(helpers).length === 0) return false;
            var hs = {}, name;
            _each(helpers, function(help){
                name = help.fnName;
                //去除helper中包含 . 的
                if(!/\./.test(name)){
                    hs[name] = this.vm.helpers[name] || this.vm[name] || null
                }
            }, this);
            return hs;
        },
        _makeHelperToExpress: function(helpers, prop){
            var mline = '';
            _each(helpers, function(fnObject, index){
                var name = fnObject.fnName,
                    params = fnObject.fnParams;
                var msc = params ? ', ' : '';
                if(index === 0){
                    if(params){
                        params.unshift(prop);
                        msc = '';
                    }else{
                        msc = prop;
                    }
                }
                if(/\./.test(name)){
                    mline = name + '(' + mline + msc + (params ? params.join(', ') : '') + ')';
                }else{
                    mline = name + '.call(this,' + mline + msc + (params ? params.join(', ') : '') + ')';
                }
            });
            return mline;
        },
        _makeHelpers: function(arg, helpers){
            if(!SYST.V.isArray(helpers) || 0 === helpers.length) return arg;
            var prop = arg, method;
            _each(helpers, function(helper){
                var fnName = SYST.T.trim(helper.fnName),
                    params = helper.fnParams;
                method = this.vm.helpers[fnName] || this.vm[fnName];
                if(params){
                    params.unshift(prop);
                }else{
                    params = [prop];
                }
                if(SYST.V.isFunction(method)){
                    prop = method.apply(this.vm, params);
                }else{
                    method = SYST.T[fnName.replace(/\s*SYST\.T\.\s*/gi, '')];
                    if(SYST.V.isFunction(method)){
                        prop = method(params);
                    }
                }
            }, this);
            return prop;
        },
        _makeRender: function(tpl, data, hs){
            return SYST.T.render(tpl, data || this.vm._props, hs || this.vm.helpers, tplConfig) || '';
        },
        //转换字符串为渲染模板
        _getRenderTemplate: function(str){
            var tplStr = str || '',
                hs,
                helpers = {};
            tplStr = tplStr.replace(reg, function(match, $1){
                //如果存在 filter
                if(/^[^\|]+?\|/.test($1)){
                    var prop = this._getPropName($1);
                    hs = this._getHelperAsString($1);
                    helpers = SYST.extend(helpers, this._getHelperToRender(hs));
                    $1 = this._makeHelperToExpress(hs, prop);
                }
                var cdf = '{{= ' + $1 + ' }}';
                //转义输出
                if(/^\{\{\s*=+/i.test(match)){
                    cdf = '{{== ' + $1 + ' }}';
                }
                return cdf;
            }.bind(this));

            return { template: tplStr, helpers: helpers };
        },
        //格式化事件绑定
        _formatOn: function(str, flag){
            if(!str) return '';
            var reg = flag ? /st-on="([^\"]+?)"/g : /"([^\"]+?)"/g;
            str = str.replace(reg, function(m, ston){
                ston = ston.replace(/\(([^\)]+?)\)/g, function(mc, ps){
                    var _ps = ps.split(/\s*,\s*/g).filter(filterTure);
                    _ps = _ps.map(function(p){
                        return '{{= SYST.T.json.stringify('+ p +') }}';
                    }).join(' ,&, ');
                    return '(' + _ps + ')';
                });
                return 'st-on="' + ston + '"';
            });
            return str;
        },
        _getFormatEvents: function(node, evtStr){
            if(!evtStr) return;

            var events = {}, rs = [];
            var _es = evtStr.replace(/^[\{\s]*|[\s\}]*$/g, '').split(/\s*;\s*/g).filter(filterTure);
            _es && _each(_es, function(es){
                es = es.split(/\s*:\s+/);
                es && es.length === 2 && (events[es[0]] = es[1]);
            });

            function _getFnParams(str){
                var sp = ' ,&, ';
                return (str.indexOf(sp) > 0) ? (str.split(sp).map(SYST.T.json.parse)) : [SYST.T.json.parse(str)];
            }

            // { keydown@enter@tab: onKeydown('dd') } => { type: 'keydown', keymap: ['enter','tab'], callback: 'onKeydown', args: ['dd'] }
            var argReg = /^[^\(]*?\(|\)$/g;
            _each(events, function (mn, i, en) {
                en = en.split('|').filter(filterTure);
                _each(en, function(type){
                    var event = {};
                    rs.push(event);
                    type = type.split('@');
                    type &&　(type = type.filter(filterTure).map(SYST.T.trim));
                    event.type = type.splice(0, 1)[0];
                    event.keymap = type;
                    var _tp = mn.split(/\(/g);
                    event.callback = _tp[0];
                    event.args = argReg.test(mn) ? _getFnParams(mn.replace(/^[^\(]*?\(|\)$/g, '')) : [];
                });
            });
            return rs;
        },
        _createFrame: function(node){
            var frame = document.createDocumentFragment();
            SYST.V.isElement(node) && frame.appendChild(node);
            return _$(frame);
        },
        _mergeHelpers: function(hs){
            return SYST.extend(this.vm.helpers || {}, hs);
        },
        _isSelectTag: function(node){
            return /^SELECT$/i.test(node.tagName);
        },
        _isHit: function (evt, event, cb) {
            var key, args = [], keys = Object.keys(keyMaps);
            event.args.forEach(function(arg){ args.push(arg); });
            args.unshift(evt);
            for(var i = 0, len = keys.length; i < len; ++i){
                key = keys[i];
                if(/^key/i.test(evt.type) && event.keymap.length > 0){
                    if(event.keymap.indexOf(key) > -1 && evt.keyCode === keyMaps[key]){
                        cb.apply(this, args);
                        return true;
                    }
                }else{
                    cb.apply(this, args);
                    return true;
                }
            }
            return false;
        }

    };

    SYST.Watcher = Watcher;

})(SYST);
