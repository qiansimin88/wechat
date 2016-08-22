var gen = function *(n) {
    for (var i = 0; i < 3; i++) {
        n++
        //yield关键字 代表暂停函数执行并且返回当前的值
        yield n     
    }
}

//genObj并不会导致函数gen执行 仅仅得到的是一个Generator对象
var genObj = gen(2)

//通过关键字next来一步一步的执行yield
console.log(genObj.next())    //{value: 3, done: false}
console.log(genObj.next())   //{value: 4, done: false}
console.log(genObj.next())   //{value: 5, done: false}
console.log(genObj.next())   //{value: undefined, done: true}

//done意味着生成器函数是否全部执行完

// {value: 3, done: false}
// {value: 4, done: false}
// {value: 5, done: false}
// {value: undefined, done: true}
