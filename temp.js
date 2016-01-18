function displace(str){
    if(!str) return;
    var index = 0, args = [],
        regx = /\%[s|d|f]?/gi;
    for(var i = 1, len = arguments.length; i < len; ++i)
        args.push(arguments[i]);
    var string = str.replace(regx, function(match){
        return args[index++];
    });
    return string;
}

console.log(displace('my name is %s, age is %d', 'rodey', 26));