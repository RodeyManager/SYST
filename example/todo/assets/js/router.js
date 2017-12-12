/**
 * Created by r9luox on 2016/11/11.
 */

SYST.ready(function(){

    TodoApp.router = SYST.Router({
        routes: {
            'todo/': 'allAction',
            'todo/active': 'activeAction',
            'todo/completed': 'completeAction'
        },
        redirectTo: 'todo/',
        allAction: function(){
            TodoApp.todoModel.props.active = 'all';
            TodoApp.todoModel.props.todoList = TodoApp.todoController.searchTodoList();
        },
        activeAction: function(){
            TodoApp.todoModel.props.active = 'active';
            TodoApp.todoModel.props.todoList = TodoApp.todoController.filter(false);
        },
        completeAction: function(){
            TodoApp.todoModel.props.active = 'completed';
            TodoApp.todoModel.props.todoList = TodoApp.todoController.filter(true);
        }

    });

});
