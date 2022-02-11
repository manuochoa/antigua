export function getScrollbarWidth() {
    return window.innerWidth - document.body.clientWidth;
}

export function checkForScrollbar(element) {
    console.log(element, element.scrollHeight, element.clientHeight);
    return element.scrollHeight > element.clientHeight;
}
