# 每周总结可以写在这里

倒序排序
```html
<div id="a">
    <span>1</span>
    <p>2</p>
    <a>3</a>
    <div>4</div>
</div>
<script>
let element = document.getElementById("a");
function reverseChildren1(element) {
    let children = Array.prototype.slice.call(element.childNodes);
    for(let child of children) {
        element.removeChild(child);
    }
    children.reverse();
    for(let child of children) {
        element.appendChild(child);
    }
}    

function reverseChildren2(element) {
    let l = element.childNodes.length;
    while(l-- > 0) {
        element.appendChild(element.childNodes[l]);
    }
}

function reverseChildren3(element) {
    let range = new Range();
    range.selectNodeContents(element);
    let fragment = range.extractContents();
    let l = fragment.childNodes.length;
    while(l-- > 0) {
        fragment.appendChild(fragment.childNodes[l]);
    }
    element.appendChild(fragment);
}


</script>
```

## Range API

```javascript
var range = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);
var range = document.getSelection().getRangeAt(0);
```

* range甚至可以操作文字
* range可以用来操作巨大的列表和数据