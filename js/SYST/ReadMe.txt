SYST JS MVC Framework ( define jQuery|Zepto & artTemplate|Underscor )


===++++++====\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|||||||||||||||||||||||||//////////////////////////

更新日志：

    2014-03-09: 11:57
        --| 修复View中events对象侦听时，采用的jQuery中on的绑定为delegate，以改变事件函数中this作用域；
        --| 修复View中$el的自定义
        --| 修复Model中set方法，可以直接以对象的方式存储数据，如：this.set({ name: 'Rodey', age: 25, isBoss: false })
