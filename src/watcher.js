/**
 * Created by r9luox on 2016/4/28.
 * Model props watcher
 * 数据绑定 监听对象
 * 监听数据变化，实时更新UI
 */

;!(function(SYST){

    var _$ = SYST.$ || $,
        reg = /\{\{\s*([^\{]*?)\s*\}\}/gi,
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
        st_filter = 'st-filter',
        bindStPropName = 'bindStPropName',
        rawHtml = 'rawHtml',
        innerHTML = 'innerHTML';

    //st-repeat regs
    var startRS = '\\{\\{\\s*',
        endRS = '\\s*\\}\\}',
        mRS = 'gi',
        repeatReg = new RegExp(startRS + '(\\$value)?' + endRS, mRS),
        indexReg = new RegExp(startRS + '(\\$index)?' + endRS, mRS),
        firstReg = new RegExp(startRS + '(\\$first)?' + endRS, mRS),
        lastReg = new RegExp(startRS + '(\\$last)?' + endRS, mRS),
        objKeyReg = new RegExp(startRS + '(\\$key[^\\}]*?)?' + endRS, mRS),
        objValReg = new RegExp(startRS + '(\\$valu?e?[^\\}]*?)?' + endRS, mRS);

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

        /**
         * 更新数据被绑定的UI
         * @param propName: 属性名
         * @param propValue: 属性值
         * @param model: 当前绑定的model
         */
        update: function(propName, propValue){
            if(!SYST.V.isEmpty(propName) && SYST.V.isString(propName)){
                if(propValue){
                    this.model.props[propName] = propValue;
                }
                //同步更新绑定样式
                this.bindElements[propName] && this.updateBindProps(propName);
                this.bindStyles[propName] && this.updateBindStyles(propName);
                this.bindRepeats[propName] && this.updateBindRepeats(propName);
            }
        },
        //重新获取监听属性tag
        reset: function(model){
            this._reset(model);
            //如果 props key 存在
            //只更新 props对应的key
            this._getBindModelTags();

        },

        updateBindProps: function(propName){
            this._makeProps(propName);
        },

        /**
         * 重新渲染
         * @param templateId
         * @param data
         */
        updateRenderTemplate: function(templateId, data){
            var self = this, containers,
                bindTemplates = this.bindTemplates;
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
                SYST.V.isArray(cons) && SYST.T.each(cons, function(container){
                    //解析模板并填充
                    self._renderTemplate(tid, container, data);
                });
            }
        },

        /**
         * 更新绑定的样式
         * @param propName 绑定的属性名
         * @param elements
         */
        updateBindStyles: function(propName){
            this._makeStyles(propName);
        },

        /**
         * 循环输出绑定
         * @param propName
         * @param elements
         */
        updateBindRepeats: function(propName){
            this._makeRepeats(propName);
        },

        //------------------------Private----------------------
        _init: function(){
            if(!this.model.props)
                return this;
            //IF Objext.observe exist
            //if(isObserve){
            //    //this._initObserve();
            //}

            this._getBindModelTags();

        },

        /**
         * IF Object observe exits
         * change model props
         */
        //_initObserve: function(){
        //    if(!isObserve)  return;
        //
        //    var self = this, type, name;
        //    Object.observe(this.model.props, function(changes){
        //        changes.forEach(function(changeProp){
        //            //console.log(changeProp);
        //            //update | add | delete
        //            watchProp(changeProp);
        //        });
        //    });
        //
        //    function watchProp(changeProp){
        //        type = changeProp.type;
        //        name = changeProp.name;
        //        switch (type){
        //            case 'add':
        //                //对于新增加的prop，需要重新watch
        //                self.addListener(name);
        //                break;
        //            case 'update':
        //                self.update(name);
        //                break;
        //            case 'delete':
        //                //对于删除的prop，需要移除watch
        //                self.removeListener(name);
        //                break;
        //        }
        //        //更新监听 st-template
        //        self.updateRenderTemplate();
        //    }
        //
        //},
        _reset: function(model){
            this.model = model || this.model;
            this.bindModelTags = [];
            //prop is key, elements is value
            this.bindElements = {};
            //bind templates as tag id
            this.bindTemplates = {};
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
        //======================== st-model =======================================
        _getModelTags: function(propName){
            var self = this, model, $bindTag;
            self.bindModelTags = slice.call(_$('['+ st_model +'='+ this.model.$mid +']'));

            SYST.T.each(self.bindModelTags, function(tag){
                model = tag.getAttribute(st_model);
                $bindTag = _$(tag);
                self._getBindElements($bindTag, propName);
                //获取绑定的模板 【 st-template 】
                self._getBindTemplates($bindTag, propName);
                //获取绑定的样式 【st-style】
                self._getBindStyles($bindTag, propName);
                //获取绑定样式 【st-repeat】
                self._getBindRepeats($bindTag, propName);
            });
        },
        /**
         * 获取数据被绑定的UI as st-model
         * @param propName: 新增加的属性
         */
        _getBindModelTags: function(){
            this._getModelTags();
        },
        //======================== st-prop ========================================
        /**
         * 获取数据被绑定的UI as st-prop
         * @param bindTag 具有st-model属性的单个标签元素
         * @private
         */
        _getBindElements: function(bindTag, propName){
            //根据标签属性名来查找 绑定元素
            this._getBindElementForAttriburte(bindTag, propName);
            //根据标签元素中内容查找 绑定元素
            this._getBindElementForContent(bindTag, propName);
            //开始填充数据
            this._makeProps();

        },
        /**
         * 根据标签属性上带有 st-prop
         * @param bindTag
         * @private
         */
        _getBindElementForAttriburte: function(bindTag, propName){
            var self = this, elements, $bindTag, name;
            $bindTag = bindTag;
            if(propName){
                elements = slice.call($bindTag.find('['+ st_prop +'='+ propName +']'));
            }else{
                elements = slice.call($bindTag.find('['+ st_prop +']'));
            }
            if(elements.length === 0)   return;

            SYST.T.each(elements, function(element){
                name = self._getRootPropName(element.getAttribute(st_prop));
                self._toBindElements(name, element);
            });
        },
        /**
         * 根据标签内容中含有被绑定属性，并以模板形式呈现的，如：{{ prop }}
         * @param bindTag
         * @private
         */
        _getBindElementForContent: function(bindTag, propName){
            var self = this, temp, elements, name,
            $bindTag = bindTag;
            //获取绑定的元素集合
            while((temp = reg.exec($bindTag.html())) != null){

                elements = slice.call($bindTag.find(':contains('+ temp[0] +')')).reverse();
                //console.log(temp[0]);
                if(!elements || elements.length === 0)  continue;
                name = self._getRootPropName(temp[0]);
                if(propName && name !== propName)   break;
                SYST.T.each(elements, function(element){
                    //保存元素原内容,便于以后置换绑定数据使用
                    element[rawHtml] = element[innerHTML];
                    self._toBindElements(name, element);
                });
            }
        },

        /**
         *  将属性名于之对应的绑定元素组合，属性名为key，值为元素数组
         *  方便在单独改变prop是只更新与之对应的元素
         * @param name: 属性名
         * @param element: 属性值
         */
        _toBindElements: function(name, element){
            //元素对象添加绑定数据名称
            element[bindStPropName] = name;
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
        _makeProps: function(propName){
            var self = this,
                _elements = this.bindElements;
            if(propName && !_elements[propName]) return;
            SYST.T.each(_elements, function(elements, index, prop){
                var els = elements || self.bindElements[prop];
                if(els && els.length !== 0){
                    SYST.T.each(els, function(element){
                        self._makeProp(prop, element);
                    });
                }
            });

        },
        //监听 props属性变化
        _makeProp: function(propName, element){
            if(this.model.props[propName] == null) return;
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
                         self.model.set(attr, this.value);
                         //self.model.props[attr] = this.value;
                         element.value = self._getProp(element);
                     };
                 }

             }
             else if(/SELECT/.test(element.nodeName)){
                 element.value = self._getProp(element);
                 element['onchange'] = function(evt){
                     //self.model.props[attr] = this.value;
                     var value = this.value,
                         filters = element.getAttribute(st_filter);
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
                propName, filters;
            if(!attr) return '';
            // exp: <span st-prop="user.name | trim | addFirstName"></span>
            filters = this._getFilters(attr);
            attr = this._getPropName(attr);

            // exp: user.name.first
            if(/\./gi.test(attr)){
                propName = this._getFinalPropValue(attr);
            }else{
                propName = this.model.props[attr];
            }

            if(propName == null) return '';
            //如果绑定的属性时一个function，则获取执行结果
            if(SYST.V.isFunction(propName)){
                propName = propName.apply(this.model);
            }

            //each methods
            propName = this._makeFilters(propName, filters);
            return propName;

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
            var self = this, prop = arg, method;
            SYST.T.each(filters, function(filter){
                method = self.model[SYST.T.trim(filter)];
                if(SYST.V.isFunction(method)){
                    prop = method.apply(self.model, [prop]);
                }else{
                    method = strProp[filter] || SYST.T[filter];
                    if(SYST.V.isFunction(method)){
                        prop = method(prop);
                    }
                }
            });
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
        _getBindTemplates: function(bindTag, propName){
            //if(this.model.props && Object.keys(this.model.props).length === 0)  return;
            var self = this,
                templates,
                templateId;
            templates = this._getElements(propName, bindTag, st_template);
            if(templates.length === 0) return;

            SYST.T.each(templates, function(container){
                templateId = '#' + container.getAttribute(st_template);
                //添加到缓存
                self._toBindTemplates(templateId, container);
                //解析模板并填充
                self._renderTemplate(templateId, container);
            });
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
            container = _$(container);
            data = SYST.V.isObject(data) ? SYST.extend(this.model.props, data) : this.model.props;
            var html = '';
            if(SYST.V.isObject(data)){
                html = SYST.T.render(templateId, data, null, {open: '{{', close: '}}'});
            }
            container.html(html);
        },

        //========================= st-style ===========================================
        _getBindStyles: function(bindTag, propName){
            //if(this.model.props && Object.keys(this.model.props).length === 0)  return;
            var self = this, styleString, temp, styles;
            styles = this._getElements(propName, bindTag, st_style);
            if(styles.length === 0) return;

            SYST.T.each(styles, function(element){
                styleString = element.getAttribute(st_style);
                //获取绑定的元素集合
                while((temp = reg.exec(styleString)) != null){
                    element[st_style] = styleString;
                    element.removeAttribute(st_style);
                    var propName = self._getPropName(temp[1]);
                    self._toBindStyles(propName, element);
                    //self._toBindElements(propName, element);
                }
            });

            //开始解析 st-style
            this._makeStyles(propName);
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
        _makeStyles: function(propName){
            var self = this, bindStyleElements = {};
            if(propName){
                bindStyleElements[propName] = this.bindStyles[propName];
            }else{
                bindStyleElements = this.bindStyles;
            }
            SYST.T.each(bindStyleElements, function(styles, index, propName){
                self._makeStyle(propName, styles);
            });
        },
        _makeStyle: function(propName, elements){
            if(!(propName in this.model.props)) return;
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
                        return self._makeFilters(prop, self._getFilters($1));
                    }
                    return self.model.props[$1];
                });
                //console.log(styleString);
                var style = element.style.cssText;
                style = style.length === 0 ? '' : style.replace(/;$/i, '') + ';';
                element.style.cssText = style + styleString;
            });

        },
        //========================= st-repeat ==========================================
        _getBindRepeats: function(bindTag, propName){
            //if(/*isObserve && */this.model.props && Object.keys(this.model.props).length === 0)  return;
            var self = this, prop, outerHTML, repeats;
            repeats = this._getElements(propName, bindTag, st_repeat);
            if(repeats.length === 0) return;

            SYST.T.each(repeats, function(element){
                prop = element.getAttribute(st_repeat);
                //获取绑定的元素集合
                outerHTML = element.outerHTML;
                element['rawOuterHTML'] = outerHTML;
                element['parent'] = element.parentNode;
                self._toBindRepeats(prop, element);
            });

            //解析
            this._makeRepeats();


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
                self._makeRepeat(prop, elements);
            });
        },
        _makeRepeat: function(propName, elements){
            if(!(propName in this.model.props)) return;
            if(!elements || elements.length === 0)  return;
            var self = this, i = 0, len = elements.length;
            var outerHTML, element, temp = '', item;
            var prop = self.model.get(propName);

            SYST.T.each(elements, function(element){
                outerHTML = self._removeBindAttr(element);
                item = element.getAttribute(st_item);
                if(!SYST.V.isEmpty(item)){
                    repeatReg = new RegExp(startRS + '(\\$?'+ item +'[^\\{]*?)' + endRS, mRS);
                }
                if(SYST.V.isArray(prop)){
                    for(var j = 0, l = prop.length; j < l; ++j){
                        //替换其他属性，如 索引
                        temp += self._replaceBindsArray(outerHTML, prop[j], j, l - 1, item);
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
            });

        },
        _removeBindAttr: function(element){
            var outerHTML = $(element['rawOuterHTML']);
            outerHTML.removeAttr(st_repeat).removeAttr(st_item).attr(st_vid, Date.now());
            outerHTML = outerHTML[0].outerHTML;
            return outerHTML;
        },

        /**
         * 处理数组的情况
         * @param str       源字符串
         * @param value     元素值
         * @param index     索引
         * @param len       长度
         * @param itemName  st-item的值
         * @returns {*}
         * @private
         */
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
                }).replace(reg, function(match, $1){
                    if(self.model.has($1)){
                        return self.model.get($1);
                    }else{
                        return match;
                    }
                });
            }
            return str;

        },

        /**
         * 处理Object对象的情况
         * @param str       源字符串
         * @param key       键名
         * @param value     值
         * @param index     索引
         * @returns {string}
         * @private
         */
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
        },


        //========================= common method =======================================
        _getElements: function(propName, $bindTag, stString){
            var elements;
            if(propName){
                elements     = slice.call($bindTag.find('['+ stString +'='+ propName +']'));
            }else{
                elements     = slice.call($bindTag.find('['+ stString +']'));
            }
            return elements;
        }

    };

    SYST.Watcher = Watcher;

})(SYST);
