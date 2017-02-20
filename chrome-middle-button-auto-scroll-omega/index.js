/**
 * Scroller.js
 *
 * Example usage:
 * var scroller = new Scroller(window.document, window.setInterval, window.clearInterval, 40, 0.02, 1.4);
 * window.addEventListener('mouseup', scroller.handleMouseUp, true);
 * window.addEventListener('mousemove', scroller.handleMouseMove, true);
 *
 * @param {Object} document pass window.document here
 * @param {Function} setInterval pass window.setInterval here
 * @param {Function} clearInterval pass window.clearInterval here
 * @param {Number} tickInterval 40 is a good number here for approximately 24fps
 * @param {Number} speedFactor 0.02 is a good number here
 * @param {Number} accelerationFactor 1.4 is a good number here
 * @constructor
 */
function Scroller(document, setInterval, clearInterval, tickInterval, speedFactor, accelerationFactor) {
    var isScrolling = false;
    var startPosition = null;

    var vector = {x: 0, y: 0};

    var scrollDiv = document.createElement('div');
    var alreadySetScrollDivStyle = false;
    var scrollElement = null;

    var scrollInterval = null;

    function tick() {
        if (isScrolling) {
            var left = scrollElement.scrollLeft;
            var top = scrollElement.scrollTop;
            scrollElement.scrollLeft += vector.x;
            scrollElement.scrollTop += vector.y;
            if (scrollElement == document.body) {
                if (left != scrollElement.scrollLeft)
                    scrollDiv.style.left = (scrollDiv.offsetLeft + (scrollElement.scrollLeft - left)) + 'px';
                if (top != scrollElement.scrollTop)
                    scrollDiv.style.top = (scrollDiv.offsetTop + (scrollElement.scrollTop - top)) + 'px';
            }
        }
    }

    function shouldStart(event) {
        var shouldScroll = false;
        var src = event.srcElement;
        while (src) {
            if (src.tagName == "A" && src.href) return;
            src = src.parentNode;
        }

        src = event.srcElement;
        while (src) {
            if (src == document) src = document.body;
            var overflow = window.getComputedStyle(src, '').getPropertyValue('overflow');
            if (src == document.body || src == document.getElementsByTagName('html')[0]) {
                src = document.body;
                if (src.scrollWidth > window.innerWidth || src.scrollHeight > window.innerHeight) {
                    shouldScroll = true;
                }
            } else if (overflow == "scroll" || overflow == "auto") {
                if (src.scrollWidth > src.offsetWidth || src.scrollHeight > src.offsetHeight) {
                    shouldScroll = true;
                }
            }
            if (shouldScroll) break;
            if (src == document.body) break;
            src = src.offsetParent;
        }
        if (!src) return;
        scrollElement = src;

        return shouldScroll;
    }

    function start(event) {
        isScrolling = true;
        startPosition = {x: event.clientX, y: event.clientY};
        vector = {x: 0, y: 0};
        document.body.appendChild(scrollDiv);
        if (!alreadySetScrollDivStyle) {
            //Be lazy about this to prevent polluting the network view every time we scroll
            scrollDiv.setAttribute('style', "position: absolute; width: 28px; height: 28px; z-index: 999999; background: url('data:image/png;base64,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')");
            alreadySetScrollDivStyle = true;
        }
        var mousePos = {x: event.pageX, y: event.pageY};
        if (scrollElement == document.body) {
            var compStyle = window.getComputedStyle(document.body, '');
            if (compStyle.getPropertyValue('position') == 'relative') {
                mousePos.x -= parseInt(compStyle.getPropertyValue('margin-left'));
                mousePos.y -= parseInt(compStyle.getPropertyValue('margin-top'));
            }
        }
        scrollDiv.style.left = (mousePos.x - (scrollDiv.offsetWidth / 2.0)) + 'px';
        scrollDiv.style.top = (mousePos.y - (scrollDiv.offsetHeight / 2.0)) + 'px';
        scrollInterval = setInterval(tick, tickInterval);
    }

    function end() {
        isScrolling = false;
        clearInterval(scrollInterval);
        document.body.removeChild(scrollDiv);
    }

    this.handleMouseUp = function (event) {
        if (isScrolling) {
            end(event);
            event.preventDefault();
        } else if (event.button == 1 && shouldStart(event)) {
            start(event);
            event.preventDefault();
        }
    };

    function getScrollDelta(currentValue, startingValue) {
        var delta = Math.round(Math.pow(Math.abs(currentValue - startingValue), accelerationFactor) * speedFactor);
        if (currentValue < startingValue) {
            delta = delta * -1;
        }
        return delta;
    }

    this.handleMouseMove = function (event) {
        if (isScrolling) {
            vector = {
                x: getScrollDelta(event.clientX, startPosition.x, scrollDiv.offsetWidth),
                y: getScrollDelta(event.clientY, startPosition.y, scrollDiv.offsetHeight)
            };
            event.preventDefault();
        }
    }
}

var scroller = new Scroller(window.document, window.setInterval, window.clearInterval, 40, 0.02, 1.4);
window.addEventListener('mouseup', scroller.handleMouseUp, true);
window.addEventListener('mousemove', scroller.handleMouseMove, true);
