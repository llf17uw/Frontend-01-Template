# 本周学到的知识点总结
## HTML
* ARIA不在标准中，但一般大公司都需要实现。
* `$0`可以被用来选择当前元素。
* `Array.prototype.map.call()`被用来调用`NodeList`的`map`，原因在于`NodeList`不是一个`Array`。参考：https://blog.csdn.net/why_fly/article/details/61915161

## JavaScript
* InputElement
  * WhiteSpace：任何unicode的空格都是可以的。
  * LineTerminator
  * Comment
  * Token 以上三类都不是关键输入
    * Identifier 变量名
    * Keywords (例如`if`)
    * Punctuator (例如`[]`)
    * NumericLiteral
    * StringLiteral
    * RegularExpressionLiteral
    * Template


* 规范中提到的Reference是指什么？

例如：
```javascript
a.b = 3;
```
我们可以`delete a.b`但是不能`delete 3`，`a.b`在JavaScript实现中就是一个Reference对象。

## CSS

* W3C的标准有大致以下几种分级，Working Draft, Proposed Recommendation, Candidate Recommendation, Recommendation。
* CSS 3的标准不易找到完整内容，可以参考CSS 2.1。