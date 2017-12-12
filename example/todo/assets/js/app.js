/**
 * Created by r9luox on 2016/11/11.
 */

var TodoApp = function(){};

SYST.ready(function(){

    var $tips = SYST.$('#tips');
    SYST.$(document).click(function(evt){
        if($tips.hasClass('success|error')){
            $tips.removeClass('success error');
        }
    });

    TodoApp.todoController = SYST.Controller({
        searchTodoList: function(){
            return this.model.getItem('todoList') || [];
        },
        saveTodoList: function(){
            this.model.setItem('todoList', this.model.props.todoList);
        },
        filter: function(completed){
            var todoList = this.searchTodoList();
            if(undefined == completed)  return todoList;
            return todoList.filter(function(todo){
                return todo.isCompleted === completed;
            });
        },
        getUnFinishSize: function(){
            return this.filter(false).length;
        },
        getFinishSize: function(){
            return this.filter(true).length;
        }
    });

    TodoApp.todoModel = SYST.Model({
        $mid: '#todo-model',
        controller: TodoApp.todoController,
        props: {
            todoList: TodoApp.todoController.searchTodoList(),
            unFinishSize: TodoApp.todoController.getUnFinishSize(),
            active: 'all'
        },
        init: function(){
            this.controller.model = this;
            this.colorCache = [];
        },
        onAddTodo: function(evt){
            var value = SYST.T.trim(evt.$target.val());
            if(!value) return;
            var newTodo = this.createTodo(value);
            if(this.props.todoList.query(newTodo.id, 'id')){
                $tips.html('this todo is exist').addClass('error');
            }else{
                $tips.html('Add todo item successfully').removeClass('error').addClass('success');
                this.props.todoList.push(newTodo);
                evt.$target.val('');
                this.startRandomTitleColor();
                this.controller.saveTodoList();
                this.getUnFinishSize();
            }
        },
        onRemoveTodoItem: function(evt, index){
            if(this.props.todoList[index]){
                this.props.todoList.splice(index, 1);
                this.controller.saveTodoList();
                this.getUnFinishSize();
            }
        },
        onComplete: function(evt, index){
            console.log(evt);
            var parent = evt.$target.parent(),
                todo = this.props.todoList[index];
            if(!todo) return;
            todo.isCompleted = !todo.isCompleted;

            parent.toggleClass('complete');
            this.controller.saveTodoList();
            this.getUnFinishSize();

            return false;
        },
        onEditTodo: function(evt, index){
            var parent = evt.$target.parent(),
                type = evt.type,
                input = parent.find('input')[0],
                p = evt.$target.prev(),
                todo = this.props.todoList[index],
                value;
            if(todo.isCompleted) return;
            if('dblclick' == type){
                input.show();
            }else if('blur' == type || 'keydown' == type){
                value = input.val();
                if(!value)  return;
                this.props.todoList[index].text = value;
                p.text(value);
                input.hide();
            }
            this.controller.saveTodoList();
        },
        startRandomTitleColor: function(){
            if(this.props.titleColor){
                this.props.titleColor = this.bgColor;
            }else{
                this.set('titleColor', this.bgColor);
            }
        },
        getColor: function(){
            function _get(){ return parseInt(Math.random() * 70 + 180, 10); }
            this.bgColor = 'rgb(' + [_get(), _get(), _get()] + ')';
            if(this.colorCache.indexOf(this.bgColor) > -1){
                return this.getColor();
            }
            this.colorCache.push(this.bgColor);
            return this.bgColor;
        },
        createTodo: function(value){
            return {
                id: parseInt(Math.random() * 1000000, 10) + Date.now(),
                text: value,
                bgColor: this.getColor(),
                isCompleted: false
            };
        },
        getUnFinishSize: function(){
            this.props.unFinishSize = this.controller.getUnFinishSize();
        }
    });

});