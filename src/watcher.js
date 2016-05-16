/**
 * Created by r9luox on 2016/4/28.
 * Model props watcher
 * 数据绑定 监听对象
 * 监听数据变化，实时更新UI
 */

;!(function(SYST){

    var reg = /\{\{\s*([^\{]*?)\s*\}\}/gi,
        regState = /\s+[\w\d_-]+=\"[\s\S]*?\{\{\s*={1,2}\s*([^\{]*?)\s*\}\}[\s\S]*?\"/gi,
        slice = Array.prototype.slice,
        isObserve = 'observe' in Object,
        notValReg = /^[^\w]*/gi,
        strProp = {
            toUpperCase: function(str){ return str.toUpperCase(); },
            toLowerCase: function(str){ return str.toLowerCase(); }
        };
        trimAttrValue = function(str){
            return SYST.T.rtrim(str.replace(/[\s\{\}]*/gi, ''), '|');
        };

    var st_model = 'st-model',
        st_prop = 'st-prop',
        st_template = 'st-template',
        st_style = 'st-style',
        st_repeat = 'st-repeat',
        st_item = 'st-item',
        st_vid = 'st-vid',
        bindStPropName = 'bindStPropName',
        rawHtml = 'rawHtml',
        innerHTML = 'innerHTML';

    //st-repeat regs
    var startRS = '\\{\\{\\s*',
        endRS = '\\s*\\}\\}',
        mRS = 'gi',
        repeatReg = new RegExp(startRS + '($value)' + endRS, mRS),
        indexReg = new RegExp(startRS + '(\\$index)?' + endRS, mRS),
        firstReg = new RegExp(startRS + '(\\$first)?' + endRS, mRS),
        lastReg = new RegExp(startRS + '(\\$last)?' + endRS, mRS),
        objKeyReg = new RegExp(startRS + '(\\$key[^\\}]*?)?' + endRS, mRS),
        objValReg = new RegExp(startRS + '(\\$valu?e?[^\\}]*?)?' + endRS, mRS);

    var Watcher = function(model){

        if(!model)
            throw new ReferenceError('args 1 can ben SYST.Model');
        this.model = model;
        this._reset(model);

    };

    Watcher.prototype = {
        //初始化 开始监听
        init: function(){
            this._init();
        },

        /**
         * 当新增属性（数据）时，将添加对应的watch
         * @param propName
         */
        addListener: function(propName){
            var bindModelTags = SYST.$('['+ st_model +']'),
                model, $bindTag;
            for(var i = 0, len = bindModelTags.length; i < len; ++i){

                model = bindModelTags[i].getAttribute(st_model);
                if(model === this.model.$mid){
                    $bindTag = SYST.$(bindModelTags[i]);
                    if(SYST.T.indexOf(this.bindTags, $bindTag) === -1){
                        this.bindTags.push($bindTag);
                    }
                    this._getBindElements($bindTag, propName);
                    //获取绑定的模板 【 st-template 】
                    this._getBindTemplates($bindTag, propName);
                    //获取绑定的样式 【st-style】
                    this._getBindStyles($bindTag);
                    //获取绑定样式 【st-repeat】
                    this._getBindRepeats($bindTag);
                }
            }
            this._setProps(this.bindElements[propName]);
        },

        /**
         * 当某个属性被移除时，将对应的wath也移除掉
         * @param propName
         */
        removeListener: function(propName){
            if(!propName){
                this._reset();
                return this;
            }
            //删除指定的属性绑定的数据
            this._deleteBinds(propName);

            var element;
            for(var i = 0, len = this.elements.length; i < len; ++i){
                element = this.elements[i];
                if(element[bindStPropName] === propName){
                    SYST.T.arrRemove(this.elements, element);
                    return this;
                }
            }

            return this;
        },
        removeListenerAll: function(){
            return this.removeListener();
        },

        /**
         * 更新数据被绑定的UI
         * @param propName: 属性名
         * @param propValue: 属性值
         * @param model: 当前绑定的model
         */
        update: function(propName, propValue){
            var elements = this.elements;
            if(!SYST.V.isEmpty(propName) && SYST.V.isString(propName)){
                if(propValue){
                    this.model.props[propName] = propValue;
                }
                elements = this.bindElements[propName] || elements;
                //同步更新绑定样式
                this.updateBindStyles(propName);
                this.updateBindRepeats(propName);
            }
            this._setProps(elements);
            //更新样式

        },
        //重新获取监听属性tag
        reset: function(model){
            this._reset(model);
            //如果 props key 存在
            //只更新 props对应的key
            this._getBindModelTags();
            this._setProps(this.elements);

        },

        /**
         * 重新渲染
         * @param templateId
         * @param data
         */
        updateRenderTemplate: function(templateId, data){
            var self = this,
                bindTemplates = this.bindTemplates,
                containers;
            if(templateId){
                containers = bindTemplates[templateId];
                _renderAction(templateId, containers);
            }else{
                //tid ==> templateId
                for(var tid in bindTemplates){
                    containers = bindTemplates[tid];
                    _renderAction(tid, containers);
                }
            }

            function _renderAction(tid, cons){
                if(SYST.V.isArray(cons)){
                    SYST.T.each(cons, function(container){
                        //解析模板并填充
                        self._renderTemplate(tid, container, data);
                    });
                }
            }
        },

        /**
         * 更新绑定的样式
         * @param propName 绑定的属性名
         * @param elements
         */
        updateBindStyles: function(propName, elements){
            this._makeStyle(propName, elements);
        },

        /**
         * 循环输出绑定
         * @param propName
         * @param elements
         */
        updateBindRepeats: function(propName, elements){
            this._makeRepeats(propName, elements);
        },

        //------------------------Private----------------------
        _init: function(){
            if(!this.model.props || {} == this.model.props)
                return this;
            if(isObserve){
                //IF Objext.observe exist
                this._initObserve();
            }

            this._getBindModelTags();
            this._setProps(this.elements);

        },

        /**
         * IF Object observe exits
         * change model props
         */
        _initObserve: function(){
            if(!isObserve)  return;

            var self = this, type, name;
            Object.observe(this.model.props, function(changes){
                changes.forEach(function(changeProp){
                    //console.log(changeProp);
                    //update | add | delete
                    watchProp(changeProp);
                });
            });

            function watchProp(changeProp){
                type = changeProp.type;
                name = changeProp.name;
                switch (type){
                    case 'add':
                        //对于新增加的prop，需要重新watch
                        self.addListener(name);
                        break;
                    case 'update':
                        self.update(name);
                        break;
                    case 'delete':
                        //对于删除的prop，需要移除watch
                        self.removeListener(name);
                        break;
                }
                //更新监听 st-template
                self.updateRenderTemplate();
            }

        },
        _reset: function(model){
            this.model = model || this.model;
            this.elements = [];
            this.bindTags = [];
            //prop is key, elements is value
            this.bindElements = {};
            //bind templates as tag id
            this.bindTemplates = {};
            //bind states as st-model tag content
            this.bindStates = [];
            //bind styles as st-style tag
            this.bindStyles = {};
            //bind repeat data as st-repeat tag
            this.bindRepeats = {};
        },
        _deleteBinds: function(propName){
            var binds = [this.bindElements, this.bindTemplates, this.bindRepeats, this.bindStyles];
            (function _delete(binds){
                SYST.T.each(binds, function(bind){
                    bind[propName] = null;
                    delete bind[propName];
                });
            })(binds);
        },
        /**
         * 获取数据被绑定的UI as st-model
         * @param propName: 新增加的属性
         */
        _getBindModelTags: function(propName){
            var bindModelTags = SYST.$('['+ st_model +']'),
                model, $bindTag;
            for(var i = 0, len = bindModelTags.length; i < len; ++i){

                model = bindModelTags[i].getAttribute(st_model);
                if(model === this.model.$mid){
                    $bindTag = SYST.$(bindModelTags[i]);
                    if(SYST.T.indexOf(this.bindTags, $bindTag) === -1){
                        this.bindTags.push($bindTag);
                    }
                    //获取绑定的 prop 【 st-prop 】
                    this._getBindElements($bindTag, propName);
                    //获取绑定的模板 【 st-template 】
                    this._getBindTemplates($bindTag, propName);
                    //获取绑定的样式 【st-style】
                    this._getBindStyles($bindTag);
                    //获取绑定列表 【st-repeat】
                    this._getBindRepeats($bindTag);
                }
            }

            //console.log(this.elements);

        },
        /**
         * 获取数据被绑定的UI as st-prop
         * @param bindTag 具有st-model属性的单个标签元素
         * @private
         */
        _getBindElements: function(bindTag){

            //根据标签属性名来查找 绑定元素
            this._getBindElementForAttriburte(bindTag);
            //根据标签元素中内容查找 绑定元素
            this._getBindElementForContent(bindTag);

        },
        /**
         * 根据标签属性上带有 st-prop
         * @param bindTag
         * @private
         */
        _getBindElementForAttriburte: function(bindTag){
            var self = this, stProps, $bindTag, name;
            $bindTag = bindTag;

            stProps = slice.call($bindTag.find('['+ st_prop +']'));
            stProps.map(function(stProp){

                //console.log(stProp.getAttribute('st-prop'));
                name = self._getRootPropName(stProp.getAttribute(st_prop));
                stProp[bindStPropName] = name;
                self._toBindElements(name, stProp);
                return stProp;

            });

            //this.elements 一般只有首次绑定数据赋值才能用上
            //除非你手动强制更新
            //之后的数据变化将采用 this.bindElements[propName]取值后进行遍历
            this.elements = this.elements.concat(stProps);
        },
        /**
         * 根据标签内容中含有被绑定属性，并以模板形式呈现的，如：{{ prop }}
         * @param bindTag
         * @private
         */
        _getBindElementForContent: function(bindTag){
            var self = this, $bindTag, temp, el, name;
            $bindTag = bindTag, elements = [];
            //获取绑定的元素集合
            while((temp = reg.exec($bindTag.html())) != null){

                el = slice.call($bindTag.find(':contains('+ temp[0] +')')).reverse();
                //console.log(temp[0]);
                name = self._getRootPropName(temp[0]);
                if(!el || el.length === 0) continue;

                SYST.T.each(el, function(element){
                    self._isInBindElements(element, name);
                });
            }

        },
        _isInBindElements: function(element, propName){
            element[rawHtml] = element[innerHTML];
            element[bindStPropName] = propName;
            if(SYST.T.indexOf(this.elements, element) === -1){
                this.elements.push(element);
            }
            this._toBindElements(propName, element);
        },

        /**
         *  将属性名于之对应的绑定元素组合，属性名为key，值为元素数组
         *  方便在单独改变prop是只更新与之对应的元素
         * @param name: 属性名
         * @param element: 属性值
         */
        _toBindElements: function(name, element){

            if(!SYST.V.isArray(this.bindElements[name])){
                this.bindElements[name] = [];
                this.bindElements[name].push(element);
            }else{
                if(SYST.T.indexOf(this.bindElements[name], element) === -1){
                    this.bindElements[name].push(element);
                }
            }

        },
        //更新UI
        _setProps: function(elements){
            var self = this,
                elements = elements || this.bindElements,
                i = 0, len = elements.length;
            if(elements && elements.length !== 0){
                for(; i < len; ++i){
                    //console.log(elements[i]);
                    self._setProp(elements[i]);
                }
            }

        },
        //监听 props属性变化
        _setProp: function(element){
            var self = this, attr;
            attr = element.getAttribute(st_prop);
            //------------------------
             //valueType = /TEXTAREA|INPUT|SELECT/.test(elm.nodeName) ? 'value' : 'innerHTML';
             if(/TEXTAREA|INPUT/.test(element.nodeName)){
                 element.value = self._getProp(element);
                 //textarea、input
                 if(/radio|checkbox/.test(element.type)){
                     element['onclick'] = function(evt){
                         self.model.set(attr, this.checked);
                         //self.model.props[attr] = this.checked;
                     };
                 }else{
                     element['onkeyup'] = function(evt){
                         self.model.props[attr] = this.value;
                         element.value = self._getProp(element);
                     };
                 }

             }
             else if(/SELECT/.test(element.nodeName)){
                 element.value = self._getProp(element);
                 element['onchange'] = function(evt){
                     //self.model.props[attr] = this.value;
                     var value = this.value,
                         filters = element.getAttribute('st-filter');
                     if(filters){
                         filters = filters.split('|');
                     }
                     if(filters && filters.length !== 0){
                         value = self._makeFilters(value, filters);
                         //console.log(value);
                     }
                     self.model.set(attr, value);
                     element.value = self._getProp(element);
                 };
             }
             else{
                 if(element.getAttribute(st_repeat)) return;
                 attr = element.getAttribute(st_prop);
                 if(attr || !element[rawHtml]){
                     element[innerHTML] = self._getProp(element);
                 }else{
                     //获取此 element
                     element[innerHTML] = element[rawHtml].replace(reg, function(match, $1){
                         //console.log(match, props[$1]);
                         return self._getProp(element, $1);
                     });
                 }
             }

        },
        //获取 当前属性的最新值
        _getProp: function(element, prop){
            var attr = prop || (function(){
                        var stProp = element.getAttribute(st_prop);
                    if(stProp){
                        return stProp.replace(notValReg, '')
                    }else{
                        return null;
                    }
                })(),
                prop, filters;
            if(!attr) return '';
            // exp: <span st-prop="user.name | trim | addFirstName"></span>
            filters = this._getFilters(attr);
            attr = this._getPropName(attr);

            // exp: user.name.first
            if(/\./gi.test(attr)){
                prop = this._getFinalPropValue(attr);
            }else{
                prop = this.model.props[attr];
            }

            if(prop == null) return '';
            if(SYST.V.isFunction(prop)){
                prop = prop.apply(this);
            }

            //each methods
            prop = this._makeFilters(prop, filters);
            return prop;

        },
        //get first prop for exp: user.name.first to get 'user'
        //获取嵌套绑定属性的值
        _getFinalPropValue: function(attrStr){
            var attr = attrStr.split('.');
            //console.log(attr);
            var index = 0, temp, tts = this.model.props[attr[0].replace(notValReg, '')] || ''; //
            while(SYST.V.isObject(tts) && (temp = tts[attr[++index]]) != null){
                tts = tts[attr[index]];
            }
            return tts;
        },
        //获取所有过滤器 ex: {{ name | trim | addLastName }}
        _getFilters: function(attrStr){
            var filters = trimAttrValue(attrStr).split('|');
            filters.shift();
            return filters;
        },
        _makeFilters: function(arg, filters){
            var prop = arg,
                method;
            for(var i = 0, len = filters.length; i < len; ++i){
                method = this.model[SYST.T.trim(filters[i])];
                if(SYST.V.isFunction(method)){
                    prop = method.apply(this.model, [prop]);
                }else{
                    method = strProp[filters[i]] || SYST.T[filters[i]];
                    if(SYST.V.isFunction(method)){
                        prop = method(prop);
                    }
                }
            }
            return prop;
        },
        //获取跟属性名 ex：user.name.first => user
        _getRootPropName: function(attrStr){
            return trimAttrValue(attrStr).split(/\.|\|/gi)[0];
        },
        //获取跟属性名 ex：{{ user.name.first | trim | addLastName }} => user.name.first
        _getPropName: function(attrStr){
            return trimAttrValue(attrStr).split('|')[0];
        },

        //======================== st-template ========================================
        _getBindTemplates: function(bindTag){
            var $bindTag = bindTag,
                templates = $bindTag.find('['+ st_template +']'),
                i = 0, len = templates.length,
                templateId, container;
            if(templates.length > 0){
                for(; i < len; ++i){
                    container = templates[i];
                    templateId = '#' + container.getAttribute(st_template);
                    //console.log(templateId);
                    //添加到缓存
                    this._toBindTemplates(templateId, container);
                    //解析模板并填充
                    this._renderTemplate(templateId, container);
                }
            }

        },
        _toBindTemplates: function(templateId, container){
            if(!this.bindTemplates[templateId]){
                this.bindTemplates[templateId] = [];
            }
            if(SYST.T.indexOf(this.bindTemplates[templateId], container) === -1){
                this.bindTemplates[templateId].push(container);
            }
        },
        _renderTemplate: function(templateId, container, data){
            var container = SYST.$(container),
                data = SYST.V.isObject(data) ? SYST.extend(this.model.props, data) : this.model.props;
            var html = '';
            if(Object.keys(data).length !== 0){
                html = SYST.T.render(templateId, data, null, {open: '{{', close: '}}'});
            }

            //console.log(html);
            container.html(html);
        },

        //========================= st-style ===========================================
        _getBindStyles: function(bindTag){
            var self        = this, element, styleString, temp,
                $bindTag    = bindTag,
                styles      = $bindTag.find('['+ st_style +']'),
                i           = 0,
                len         = styles.length;
            if(styles.length > 0){
                for(; i < len; ++i){
                    element     = styles[i];
                    styleString = element.getAttribute(st_style);
                    //获取绑定的元素集合
                    while((temp = reg.exec(styleString)) != null){
                        element[st_style] = styleString;
                        element.removeAttribute(st_style);
                        var propName = self._getPropName(temp[1]);
                        self._toBindStyles(propName, element);
                        //self._toBindElements(propName, element);
                    }
                }
                //开始解析 st-style
                this._makeStyles();
            }
        },
        _toBindStyles: function(propName, element){
            var bindStyleElements = this.bindStyles[propName];
            if(!bindStyleElements){
                bindStyleElements = this.bindStyles[propName] = [];
            }
            if(SYST.T.indexOf(bindStyleElements, element) === -1){
                bindStyleElements.push(element);
            }
        },
        _makeStyles: function(){
            var self = this;
            SYST.T.each(this.bindStyles, function(styles, index, propName){
                self._makeStyle(propName, styles);
            });
        },
        _makeStyle: function(propName, elements){
            var self = this, styleString,
                elements = elements || this.bindStyles[propName];
            SYST.V.isArray(elements)
            &&
            SYST.T.each(elements, function(element){
                styleString = element[st_style];
                styleString = styleString.replace(reg, function(match, $1){
                    //console.log(match, $1);
                    if(/\|/gi.test($1)){
                        var propName = self._getPropName($1),
                            prop = self.model.props[propName];
                        //self.model.props[propName] = self._makeFilters(prop, self._getFilters($1));
                        return self._makeFilters(prop, self._getFilters($1));
                    }
                    return self.model.props[$1];
                });
                //console.log(styleString);
                styleString = styleString.split(';');
                styleString.forEach(function(style){
                    style = style.split(':');
                    if(style[1] != null){
                        element.style[style[0]] = style[1];
                    }
                });
            });

        },
        //========================= st-repeat ==========================================
        _getBindRepeats: function(bindTag){
            var self        = this, element, propName, outerHTML,
                $bindTag    = bindTag,
                repeats     = slice.call($bindTag.find('['+ st_repeat +']')),
                i           = 0,
                len         = repeats.length;
            if(repeats.length > 0){
                for(; i < len; ++i){
                    element     = repeats[i];
                    propName = element.getAttribute(st_repeat);
                    //获取绑定的元素集合
                    outerHTML = element.outerHTML;
                    element['rawOuterHTML'] = outerHTML;
                    element['parent'] = element.parentNode;
                    this._toBindRepeats(propName, element);
                }
                //解析
                this._makeRepeats();
            }
        },
        _toBindRepeats: function(propName, element){
            var bindRepeatElements = this.bindRepeats[propName];
            if(!bindRepeatElements){
                this.bindRepeats[propName] = [];
                bindRepeatElements = this.bindRepeats[propName];
            }
            if(SYST.T.indexOf(bindRepeatElements, element) === -1){
                bindRepeatElements.push(element);
            }
        },
        _makeRepeats: function(propName){
            var self = this, bindRepeatElements = {};
            if(propName){
                bindRepeatElements[propName] = this.bindRepeats[propName];
            }else{
                bindRepeatElements = this.bindRepeats;
            }
            SYST.T.each(bindRepeatElements, function(elements, index, prop){
                self._makeRepeat(elements, prop);
            });
        },
        _makeRepeat: function(elements, propName){
            if(!elements || elements.length === 0)  return;
            var self = this, i = 0, len = elements.length;
            var outerHTML, element, temp = '', item;
            //if(!self.model.has(propName)) return;
            var prop = self.model.get(propName);

            for(; i < len; ++i){
                element = elements[i];
                if(!element)    continue;
                outerHTML = this._removeBindAttr(element);
                item = element.getAttribute(st_item);
                if(!SYST.V.isEmpty(item)){
                    repeatReg = new RegExp(startRS + '(\\$?'+ item +'[^\\{]*?)' + endRS, mRS);
                }
                if(SYST.V.isArray(prop)){
                    for(var j = 0, l = prop.length; j < l; ++j){
                        //替换其他属性，如 索引
                        temp += this._replaceBindsArray(outerHTML, prop[j], j, l - 1, item);
                    }
                }
                else if(SYST.V.isObject(prop)){
                    SYST.T.each(prop, function(val, index, key){
                        //替换其他属性，如 索引
                        temp += self._replaceBindObject(outerHTML, key, val, index);
                    });
                }

                //element.parent.innerHTML = temp;
                var newChilds = slice.call($(element.parent).find('['+ st_vid +']'));
                if(newChilds[0]){
                    element['newFirstChild'] = newChilds[0];
                    newChilds.shift();
                    SYST.T.each(newChilds, function(child){
                        $(child).remove();
                    });
                    $(element['newFirstChild']).replaceWith(temp);
                }else{
                    $(element).replaceWith(temp);
                }
                //console.log(temp);
            }

        },
        _removeBindAttr: function(element){
            var outerHTML = $(element['rawOuterHTML']);
            outerHTML.removeAttr(st_repeat).removeAttr(st_item).attr(st_vid, Date.now());
            outerHTML = outerHTML[0].outerHTML;
            return outerHTML;
        },
        _replaceBindsArray: function(str, value, index, len, itemName){
            var self = this,
                vmodel = {},
                rp = { open: '{{', close: '}}' },
                filters, val;
            str.replace(repeatReg, function(match, $1){
                filters = self._getFilters($1);
                val = self._makeFilters(value, filters);
            });

            if(SYST.V.isObject(val)){
                str = str.replace(/\{\{/gi, '{{=');
                vmodel = {
                    '$index': '' + index,
                    '$first': index === 0 ? 'true' : 'false',
                    '$last': index === len ? 'true' : 'false'
                };
                vmodel[itemName] = value;
                str = SYST.T.render(str, vmodel, null, rp);
            }else{
                str = str.replace(repeatReg, function(){
                    //显示当前值
                    return val;
                }).replace(indexReg, function(){
                    //显示索引
                    return index;
                }).replace(firstReg, function(){
                    //是否为开头
                    return index === 0 ? true : false;
                }).replace(lastReg, function(){
                    //是否是末尾
                    return index === len ? true : false;
                });
            }
            return str;

        },
        _replaceBindObject: function(str, key, value, index){
            var self = this;
            str = str.replace(objKeyReg, function(match, $1){
                return _filter(key, $1);
            }).replace(objValReg, function(match, $1){
                return _filter(value, $1);
            }).replace(indexReg, function(){
                return '' + index;
            });
            function _filter(v, $str){
                var filters = self._getFilters($str);
                return self._makeFilters(v, filters);
            }
            return str;
        }

    };

    SYST.Watcher = Watcher;

})(SYST);
