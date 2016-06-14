
var $data = {
    title: 'title',
    users: [
        { name: 'jack', age: 23 }
    ]
};

function render($d){
    //var each = SYST.T.each;
    var _s = "";
    with($d || {}){
        if(true){
            if(users){
                _s += '\r\n<div class="u-list" id="u-list">\r\n    <header><h3>';
                if($d["title"]){
                    _s += (title)
                }else{
                    _s += "";
                }
                _s += '</h3></header>\r\n    <ul>\r\n        ';
                for(var i = 0, len = users.length; i < len; ++i){
                    var user = users[i];
                    _s += '\r\n        <li>name: ';
                    if($d["user.name"]){
                        _s += (user.name)
                    }else{
                        _s += "";
                    }
                    _s += ',  ';
                    if(user.age)_s += 'age: ';
                    if($d["user.age || ''"]){
                        _s += (user.age || '')
                    }else{
                        _s += "";
                    }
                    _s += '</li>\r\n        ';
                }
                _s += '\r\n    </ul>\r\n</div>\r\n\r\n';
            }
        }
    };
    return _s;
}

render($data);

