# 每周总结可以写在这里

# 语言通识

* 非形式语言
  * 中文，英文
* 形式语言（乔姆斯基谱系）
  * 0型 无限制文法
  * 1型 上下文相关文法 
  * 2型 上下文无关文法
  * 3型 正则文法
* 产生式 BNF
  * 0 - `?::=?`
  * 1 - `?<A>?::=?<B>?`
  * 2 - `<A>::?`
  * 3 - `<A>::=<A>?`
* 类型系统
  * 动态类型系统 vs 静态类型系统
  * 强类型 vs 弱类型
    * 有隐式转换的都是弱类型
  * 复合类型
    * 结构体
    * 函数签名
  * 子类型
    * 逆变/协变
* 一般命令式编程语言
  * Program: Module, Package, Library
  * Structure: Function, Class, Process, Namespace
  * Statement: Expression, Keyword, Punctuator,
  * Expression: Atom, Operator, Punctuator
  * Atom: Identifier, Literal
  
# JavaScript

获取Unicode形式表达：
```javascript
String.codePointAt(0).toString(16);
```

* Number
  * DecimalLiteral
    * 0
    * 0.
    * .2
    * 1e3
  * BinaryIntegerLiteral
    * 0b111
  * OctalIntegerLiteral
    * 0o10
  * HexIntegerLiteral
    * 0xFF

不是十进制！
```javascript
parseInt();
```
