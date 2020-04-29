# 每周总结
## 作业部分
问题：根据课上老师的示范，找出JavaScript标准里所有的对象，分析有哪些对象是我们无法实现出来的，这些对象都有哪些特性？

* Bound Function Exotic Objects
  * 内部属性
    * BoundTargetFunction
    * BoundThis
    * BoundArguments
  * 方法
    * Call
    * Construct
    * BoundFunctionCreate
* Array Exotic Objects
  * 方法
    * DefineOwnProperty
    * ArrayCreate
    * ArraySpeciesCreate
    * ArraySetLength
* String Exotic Objects
  * 方法
    * GetOwnProperty
    * DefineOwnProperty
    * OwnPropertyKeys
    * StringCreate
    * StringGetOwnProperty
* Arguments Exotic Objects
  * 方法
    * GetOwnProperty
    * DefineOwnProperty
    * Get
    * Set
    * Delete
    * CreateUnmappedArgumentsObject
    * CreateMappedArgumentsObject
    * MakeArgGetter
    * MakeArgSetter
* Integer Indexed Exotic Objects
  * 方法
    * GetOwnProperty
    * HasProperty
    * DefineOwnProperty
    * Get
    * Set
    * OwnPropertyKeys
    * IntegerIndexedObjectCreate
    * IntegerIndexedElementGet
    * IntegerIndexedElementSet

* Module Namespace Exotic Objects
  * 属性
    * Module
    * Exports
    * Prototype
  * 方法
    * SetPrototypeOf
    * IsExtensible
    * PreventExtensions
    * GetOwnProperty
    * DefineOwnProperty
    * HasProperty
    * Get
    * Set
    * Delete
    * OwnPropertyKeys
    * ModuleNamespaceCreate
* Immutable Prototype Exotic Objects
  * 方法
    * SetPrototypeOf
    * SetImmutablePrototype

## 笔记部分
### Week 02 补 - 符号位相关
检查符号之前先检查：
```javascript
function check(zero) {
    if(1/zero === Infinity) {
        return 1;
    }
    if(1/zero === -Infinity) {
        return -1;
    } 
}
```
```javascript
check(0)
1
check(-0)
-1
```
然后才能检查：
```javascript
function sign(number) {
    return number / Math.abs(number);
}
```
```javascript
sign(1)
1
sign(100)
```
但这个依然没有检查`Infinity`。

二进制表达第一位是符号位，0是正数，1是负数。

二进制表达小数有精度损失，因为很多时候无法精确表达，例如0.2。（判断方式：一直乘以2，变不成整数的都有精度损失）。

https://jsfiddle.net/pLh8qeor/19
### Week 03

#### 表达式

成员访问

```javascript
a.b
a[b]
foo`string`
super.b
super['b']
new.target
new
```

New 优先级问题

```javascript
function cls1(s) {
    console.log(s);
}
function cls2(s) {
    console.log("2", s);
    return cls1;
}
```
如果执行：
```javascript
new new cls2("good");
```
会打印出：
```
2 good
```
参数被优先传给`cls2`的构造函数。其中执行`new (cls2())`和`new (new cls2)`都会返回一个`cls1`的实例，而`new cls2()`则返回一个`cls1`函数。

Member - New - Call

单步运算符
```javascript
delete
void
typeof
+
-
~
!
await
```
