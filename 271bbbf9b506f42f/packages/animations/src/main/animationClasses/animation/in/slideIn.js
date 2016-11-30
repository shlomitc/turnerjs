define(['lodash', 'animations/localTweenEngine/localTweenEngine'], function(_, tweenEngine) {
    'use strict';

    /** core.animations.tweenEngineGreenSock */
    var engine = tweenEngine.engine;
    /** core.animationsFactory */
    var factory = tweenEngine.factory;

    var paramsMap = {
        top: {dx: 0, dy: -1, idx: 0},
        right: {dx: 1, dy: 0, idx: 1},
        bottom: {dx: 0, dy: 1, idx: 2},
        left: {dx: -1, dy: 0, idx: 3}
    };

    function getAdjustedDirection(idx, angle) {
        var direction = ['top', 'right', 'bottom', 'left'];
        var shiftBy = Math.round(angle / 90);

        idx = (idx + (direction.length - 1) * shiftBy) % direction.length;

        return direction[idx];
    }

    function getClipTweenParams(compRect, contentRect, direction) {
        var top = contentRect.top - compRect.top;
        var left = contentRect.left - compRect.left;
        var right = contentRect.width + left;
        var bottom = contentRect.height + top;

        var clipParams = {
            top: [bottom, right, bottom, left],
            right: [top, left, bottom, left],
            bottom: [top, right, top, left],
            left: [top, right, bottom, right]
        };

        return {clip: 'rect(' + clipParams[direction].join('px,') + 'px)'};
    }

    function getTransformTweenParams(contentRect, origin, angleInRad) {
        var width = contentRect.width;
        var height = contentRect.height;

        var x = origin.dy * (height) * Math.sin(-angleInRad) + origin.dx * (width) * Math.cos(angleInRad);
        var y = origin.dy * (height) * Math.cos(-angleInRad) + origin.dx * (width) * Math.sin(angleInRad);

        return {x: x, y: y};
    }

    /**
     * SlideIn (Clip mask) animation object
     * @param {Array<HTMLElement>|HTMLElement} elements DOM element to animate
     * @param {Number} [duration]
     * @param {Number} [delay]
     * @param {Object} [params]
     * @param {String} [params.direction=left] 'top' or 'right' or 'bottom' or 'left'
     * @returns {TimelineMax}
     */
    function slideIn(elements, duration, delay, params) {

        elements = (elements instanceof window.HTMLElement) ? [elements] : elements;

        var direction = params.direction || 'left';
        delete params.direction;

        var sequence = factory.sequence(params);
        sequence.add(factory.animate('BaseFade', elements, duration * 0.25, delay, {from: {opacity: 0}, to: {opacity: 1}, ease: 'Cubic.easeInOut'}));

        _.forEach(elements, function(element) {
            var compRect = engine.getBoundingRect(element);
            var contentRect = engine.getBoundingContentRect(element);

            var elementAngleInDeg = element.getAttribute('data-angle') || 0;
            var elementAngleInRad = elementAngleInDeg * Math.PI / 180;

            var adjDirection = getAdjustedDirection(paramsMap[direction].idx, elementAngleInDeg);

            var fromClipParams = getClipTweenParams(compRect, contentRect, adjDirection);
            var fromXYParams = getTransformTweenParams(contentRect, paramsMap[adjDirection], elementAngleInRad);

            // the tween
            sequence.add([
                factory.animate('BaseClip', element, duration, delay, {from: fromClipParams, ease: 'Cubic.easeInOut'}),
                factory.animate('BasePosition', element, duration, delay, {from: fromXYParams, ease: 'Cubic.easeInOut'})
            ], 0);

        });

        return sequence.get();
    }

    slideIn.properties = {
        hideOnStart: true
    };

    factory.registerAnimation('SlideIn', slideIn);
});