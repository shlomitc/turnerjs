define.experiment.animation('FlyIn.AnimationNewBehaviors', function() {
    return {
        init: function(animations) {
            this._animations = animations;
        },
        /**
         * FlyIn animation object
         * @param {HTMLElement} element DOM element to animate
         * @param {Number} [duration]
         * @param {Number} [delay]
         * @param {Object} [params]
         * @param {String} [params.direction=right] 'top' or 'bottom' and/or 'left' or 'right'
         * @returns {Tween}
         */
        animate: function(element, duration, delay, params) {
            var transformY, transformX, elementViewPortDim, browserViewPortDim, fromParams, direction;
            params = params ? _.cloneDeep(params) : {};

            params.data = params.data || {};
            params.data.elementClearParams = {
                elements: element,
                types: [this._animations.ClearTypes.CSS_STYLE]
            };

            // parse params
            direction = (params.direction || this._defaults.direction).trim();
            fromParams = this._parseParams(direction.split(' '));

            // calc element from transform in respect to browser's view-port
            // browser's view-port width/height is the actual width/height excluding scrollBars
            browserViewPortDim = {width: window.getSize().x, height: window.getSize().y};
            elementViewPortDim = element.getBoundingClientRect();

            transformX = (fromParams.dx > 0) ? (browserViewPortDim.width - elementViewPortDim.right) : fromParams.dx * (elementViewPortDim.left);
            transformY = (fromParams.dy > 0) ? (browserViewPortDim.height - elementViewPortDim.top) : fromParams.dy * (elementViewPortDim.bottom);

            // delete handled params (don't pass on)
            delete params.direction;

            // the tween
            return this._animations.sequence([
                this._animations.applyTween('BaseFade', element, duration, delay, {from: {opacity: 0}, ease: 'Linear.easeIn'}),
                this._animations.applyTween('BasePosition', element, duration, delay, {from: {x: transformX, y: transformY}, ease: 'Sine.easeOut'})
            ], params);
        },

        group: ['entrance'],

        options: {
            hideOnStart: true,
            screenInThreshold: '15%',
            waitForPageTransition: true
        },

        _defaults: {
            direction: 'right'
        },

        _paramsMap: {
            top: {dy: '-1'},
            right: {dx: '1'},
            bottom: {dy: '1'},
            left: {dx: '-1'}
        },

        _parseParams: function(direction) {
            var fromParams = {dx: 0, dy: 0};
            _.forEach(direction, function(value) {
                if (this._paramsMap[value]) {
                    _.assign(fromParams, this._paramsMap[value]);
                }
            }, this);

            return fromParams;
        }
    };
});

