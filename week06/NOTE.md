# 每周总结可以写在这里

# 有限状态机

* 状态机的输入是相同的
* 状态机的每个机器无状态，是纯函数
* 每个机器要知道下一个状态
    * 有确定的下一个状态 Moore
    * 根据输入决定下一个状态 Mealy
* 用有限状态机实现匹配未知Pattern可以等效KMP

# CSS

* 遇到style标签时保存CSS
* 调用CSS parser分析规则
* 创建元素后，立即计算CSS
* 分析元素时，所有规则已经收集完毕
* 遇到写在body里面的style标签需要重新计算CSS
