# 每周总结可以写在这里

# CSS

## 选择器语法

* \*
* div svg|a
* .cls
* \#id
* \[attr\=value\]
* :hover
* ::before

* 复合选择器
    * <简单选择器><简单选择器><简单选择器>
    * \* 或者 div 写在最前面
    
* 下列选择器的优先级：
    * div#a.b .c\[id\=x\] 0 1 3 1
    * \#a\:not\(\#b\) 0 2 0 0
    * \*\.a 0 0 1 0
    * div.a 0 0 1 1
    
## 伪类

一开始设计出来都是为了超链接：

* :any-link
* :link :visited
* :hover
* :active
* :focus
* :target

树结构：

* :empty
* :nth-child()
* :nth-last-child()
* :first-child :last-child :only-child

逻辑型：

* :not伪类
* :where :has

伪元素：

* :before
* :after
* :first-line
* :first-letter
* first-line和first-letter可用属性是不同的！
* first-letter为什么可以设置float？first-line改变之后内容会变。那为什么first-line可以设置字体之类呢？因为这些属性都是作用于字的，而first-line会在一个一个渲染之后才决定。

* 源代码 - 标签，语义 - 元素，表现 - 盒

## 盒

* CSS选择器选中的元素，排版时可能会产生多个盒
* 排版和渲染的基本单位是盒 
    
## 正常流排版

* 收集盒进行
* 计算盒在行中的排布
* 计算行的排布

## Flex

* 收集盒进行
* 计算盒在主轴方向排布
* 计算盒在交叉轴方向排布
