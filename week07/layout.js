function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    for (let p in element.computedStyle) {
        let value = element.computedStyle.value;
        element.style[p] = element.computedStyle[p].value;
        if (element.style[p].toString().match(/px$/)) {
            element.style[p] = parseInt(element.style[p]);
        }

        if (element.style[p].toString().match(/^[0-9.]+$/)) {
            element.style[p] = parseInt(element.style[p]);
        }
    }

    return element.style;
}

function layout(element) {
    if (!element.computedStyle) {
        return;
    }

    let elementStyle = getStyle(element);
    if (elementStyle.display !== 'flex') {
        return;
    }

    let items = element.children.filter(e => e.type === 'element');
    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
    });
    let style = elementStyle;
    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }

    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }

    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.alignItems = 'flex-start';
    }

    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }

    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd, crossSign, crossBase;
    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = 1;
        mainBase = 0;
        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    } else if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = -1;
        mainBase = style.width;
        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    } else if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = 1;
        mainBase = 0;
        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    } else if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;
        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    } else if (style.flexDirection === 'wrap-reverse') {
        [crossStart, crossEnd] = [crossEnd, crossStart];
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    let isAutoMainSize = false;
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        for (let item of items) {
            let itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== undefined) {
                elementStyle[mainSize] += itemStyle[mainSize];
            }
            isAutoMainSize = true;
        }
    }

    let flexLine = [];
    let flexLines = [flexLine];
    let mainSpace = elementStyle[mainSize];
    let crossSpace = 0;
    for (let item of items) {
        let itemStyle = getStyle(item);
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }
        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (style['flex-wrap'] === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
                crossSpace = Math.max(crossSpace, itemStyle[crosssize]);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }

    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = style[crossSize] !== undefined ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }
            itemStyle[mainSize] = itemStyle[mainSize] * scale;
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSize * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach(function (items) {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);
                if (itemStyle.flex !== null && itemStyle.flex !== undefined) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                let currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSize / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let currentMain, step;
                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                } else if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                } else if (style.justifyContent === 'center') {
                    currentMain = mainSpace * mainSign / 2 + mainBase;
                    step = 0;
                } else if (style.justifyContent === 'space-between') {
                    currentMain = mainBase;
                    step = mainSpace * mainSign / (items.length - 1);
                } else if (style.justifyContent === 'space-around') {
                    step = mainSpace * mainSign / items.length;
                    currentMain = step / 2 + mainBase;
                }
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                }
            }
        });
    }

    crossSpace = 0;
    if (!style[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let line of flexLines) {
            elementStyle[crossSize] = elementStyle[crossSize] + line.crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let line of flexLines) {
            crossSpace -= line.crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;
    let step;
    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    } else if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    } else if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    } else if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    } else if (style.alignContent === 'space-around') {
        step = crossSpace / flexLines.length;
        crossBase += crossSign * step / 2;
    } else if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(function (items) {
        let lineCrossSize = style.alignContent === 'stretch' ? items[crossSpace] + crossSpace / flexLines.length : items[crossSpace];
        for (let item of items) {
            let itemStyle = getStyle(item);
            let align = itemStyle.alignSelf || style.alignItems;
            if (item === null) {
                itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
                if (align === 'flex-start') {
                    itemStyle[crossStart] = crossBase;
                    itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
                } else if (align === 'flex-end') {
                    itemStyle[crossEnd] = crossBase;
                    itemStyle[crossEnd] = itemStyle[crossEnd] + crossSign * itemStyle[crossSize];
                } else if (align === 'center') {
                    itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                    itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
                } else if (align === 'stretch') {
                    itemStyle[crossStart] = crossBase;
                    itemStyle[crossEnd] = crossBase * (itemSTyle[crossEnd] - itemStyle[crossStart]);
                }
            }

        }

        crossBase += crossSign * (lineCrossSize + step);
    });

}

module.exports = layout;