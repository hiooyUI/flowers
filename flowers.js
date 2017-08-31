// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}());

// 点击召唤喜鹊
function loveBridge(step, callback, endCallback) {
    var $man = $('#man'),
        $woman = $('#woman');
    this.isDone = false;
    this.isEnd = false;
    var startMTranslatedX = parseInt($man.css('webkitTransform').split(',')[4].replace(' ', '')),
        startWTranslatedX = parseInt($woman.css('webkitTransform').split(',')[4].replace(' ', '')),
        currentMTranslatedX = startMTranslatedX,
        currentWTranslatedX = startWTranslatedX;
    var stepM = startMTranslatedX / step,
        stepW = startWTranslatedX / step;
    var _this = this;
    $('#operation_btn').click(function () {
        if (_this.isEnd) {
            endCallback && endCallback();
            return;
        }
        startMTranslatedX = parseInt($man.css('webkitTransform').split(',')[4].replace(' ', '')),
        startWTranslatedX = parseInt($woman.css('webkitTransform').split(',')[4].replace(' ', ''));
        currentMTranslatedX = startMTranslatedX - stepM;
        currentWTranslatedX = startWTranslatedX - stepW;
        if (currentMTranslatedX >= 0) {
            if (!_this.isDone) {
                $man.css('webkitTransform', 'translate3d(0, 0, 0)');
                $woman.css('webkitTransform', 'translate3d(0, 0, 0)');
                setTimeout(function () {
                    $('#heart').addClass('moved');
                    if (typeof callback === 'function') {
                        setTimeout(function () {
                            callback();
                        },1200)
                    }
                }, 200);
                _this.isDone = true;
            }
        } else {
            $man.css('webkitTransform', 'translate3d(' + currentMTranslatedX + 'px, 0, 0)');
            $woman.css('webkitTransform', 'translate3d(' + currentWTranslatedX + 'px, 0, 0)');
        }
    });
}
/*
飘花散落
(c) 2016-2017 Nelson Kuang
*/
(function (root, $) {
    var piece = function (options) {
        var defaults = {
            pid: 'pid_' + (new Date()).getTime().toString().substr(6), // element,  default value is 'pid_ + time'.
            type: 'type_' + (Math.floor(7 * Math.random()) + 1),
            track: 'track_' + (Math.floor(7 * Math.random()) + 1)
        };
        options = $.extend({}, defaults, options);
        var tpl = '<div class="piece ' + options.type + ' ' + options.track + '" id="' + options.pid + '"></div>';
        return {
            pid: options.pid,
            type: options.type,
            track: options.track,
            html: tpl
        };
    }
    var flowers = function (options) {
        var defaults = {
            container: '#flowers', // element,  default value is '#flowers'.
            genSpeed: 500,
            speedY: 0.5, // by px
            speedR: 0.6 // by deg
        };
        options = $.extend({}, defaults, options);

        this.$container = $(options.container);
        this.version = '1.0.1';
        this.author = 'Nelson Kuang';
        this.created = '2017/08/21';
        this.genTimer = null;
        this.genSpeed = options.genSpeed;
        this.speedY = options.speedY;
        this.speedR = options.speedR;
        this.init();
    }
    flowers.prototype = {
        init: function (){
            this.$container.html('');
            if (this.genTimer) {
                clearInterval(this.genTimer);
            }
        },
        stop: function () {
            if (this.genTimer) {
                clearInterval(this.genTimer);
                this.$container.html('');
            }
        },
        start: function () {
            var _this = this;
            _this.addPiece();
            this.genTimer = setInterval(function () {
                _this.addPiece();
            }, _this.genSpeed);
        },
        addPiece: function () {
            var _this = this,
                _piece = new piece();
            _this.$container.append(_piece.html);
            var This = $('#' + _piece.pid),
                currentTranslatedY = 0,
                currentRotates = 0,
                animationID = 0,
                speedR = _this.speedR * Math.random();
            function move() {
                currentTranslatedY += _this.speedY;
                currentRotates += speedR;
                This.css('-webkit-transform', 'translate3d(0, ' + currentTranslatedY + 'px, 0) rotate3d(1,1,1,' + currentRotates + 'deg)');
                animationID = requestAnimationFrame(move);
                if (currentTranslatedY > 1200) {
                    if (animationID != 0) {
                        cancelAnimationFrame(animationID);
                    }
                    This.remove();
                }
            }
            move();
        }
    }

    root.flowers = flowers;
})(this, jQuery);
