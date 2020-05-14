# 每周总结可以写在这里

# JavaScript
## Realm

Realm是指有所有JS内置对象的环境。

* JS Context
* 宏任务
* 微任务
* 函数调用
* 语句声明
* 表达式
* 直接量/变量/this

## Execution Context Stack

* Code evaluation state 恢复代码执行的位置，主要用于async和generator
* Function 如果执行的是函数，值是这个函数对象
* Script或者Module，是`null`
* Realm
* Lexical Environment
    * this
    * new.target
    * super
    * 变量

## Environment Record

* Declarative Environment Records
    * Function Environment Records
    * Module Environment Records
* Global Envrionment Records
* Object Environment Records
* 闭包的实现原理

## Realm和对象

* 函数表达式和对象直接量都会创建对象。
* 使用`.`做隐式转换也会创建对象
* 这些对象也有`Prototype`，如果没有Realm，就不知道他们的`Prototype`是什么。

# 浏览器原理

## 输入网址敲下回车……

1. URL => HTTP 请求
2. HTML => parse
3. DOM => CSS computing
4. DOM with CSS => layout
5. DOM with position => render
6. Bitmap

## TCP/IP

* 流 VS 包
* 端口 VS IP地址
* require('net') VS libnet/libpcap
