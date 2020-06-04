function match(selector, element) {
    if (!selector || !element) {
        return false;
    }
    let selectors = selector.split(' ');
    let result = false;
    selectors.forEach(s => {
        let type = matchType(s);
        let matched = false;
        switch (type) {
            case 'id':
                matched = false;
                element.id.split(' ').forEach(i => {
                    if(s.includes('#' + i)) {
                        matched = true;
                    }
                });
                result = result && matched;
                break;
            case 'clazz':
                matched = false;
                element.className.split(' ').forEach(i => {
                    if(s.includes('.' + i)) {
                        matched = true;
                    }
                });
                result = result && matched;
                break;
            case 'tag':
                matched = false;
                element.className.split(' ').forEach(i => {
                    if(s.includes(i.toLowerCase())) {
                        matched = true;
                    }
                });
                result = result && matched;
                break;
            default:
                break;
        }
    });
    return result;
}

function matchType(selector) {
    let id = /\#[a-z]+/;
    let clazz = /\.[a-z]+/;
    let tag = /^[a-z]+/;
    if(selector.match(id)) {
        return 'id';
    } else if (selector.match(clazz)) {
        return 'clazz';
    } else if (selector.match(tag)) {
        return 'tag';
    } else {
        return '';
    }
}