/*! ResponsiveSlides.js v1.55
 * http://responsiveslides.com
 * http://viljamis.com
 *
 * Copyright (c) 2011-2012 @viljamis
 * Available under the MIT license
 */

/*jslint browser: true, sloppy: true, vars: true, plusplus: true, indent: 2 */

(function ($, window, i) {
    $.fn.responsiveSlides = function (options) {
  
      // Default settings
      var settings = $.extend({
        "auto": true,             // Boolean: Animate automatically, true or false
        "speed": 500,             // Integer: Speed of the transition, in milliseconds
        "timeout": 4000,          // Integer: Time between slide transitions, in milliseconds
        "pager": false,           // Boolean: Show pager, true or false
        "nav": false,             // Boolean: Show navigation, true or false
        "random": false,          // Boolean: Randomize the order of the slides, true or false
        "pause": false,           // Boolean: Pause on hover, true or false
        "pauseControls": true,    // Boolean: Pause when hovering controls, true or false
        "prevText": "Previous",   // String: Text for the "previous" button
        "nextText": "Next",       // String: Text for the "next" button
        "maxwidth": "",           // Integer: Max-width of the slideshow, in pixels
        "navContainer": "",       // Selector: Where auto generated controls should be appended to, default is after the <ul>
        "manualControls": "",     // Selector: Declare custom pager navigation
        "namespace": "rslides",   // String: change the default namespace used
        "before": $.noop,         // Function: Before callback
        "after": $.noop           // Function: After callback
      }, options);
  
      return this.each(function () {
  
        // Index for namespacing
        i++;
  
        var $this = $(this),
  
          // Local variables
          vendor,
          selectTab,
          startCycle,
          restartCycle,
          rotate,
          $tabs,
  
          // Helpers
          index = 0,
          $slide = $this.children(),
          length = $slide.length,
          fadeTime = parseFloat(settings.speed),
          waitTime = parseFloat(settings.timeout),
          maxw = parseFloat(settings.maxwidth),
  
          // Namespacing
          namespace = settings.namespace,
          namespaceIdx = namespace + i,
  
          // Classes
          navClass = namespace + "_nav " + namespaceIdx + "_nav",
          activeClass = namespace + "_here",
          visibleClass = namespaceIdx + "_on",
          slideClassPrefix = namespaceIdx + "_s",
  
          // Pager
          $pager = $("<ul class='" + namespace + "_tabs " + namespaceIdx + "_tabs' />"),
  
          // Styles for visible and hidden slides
          visible = {"float": "left", "position": "relative", "opacity": 1, "zIndex": 2},
          hidden = {"float": "none", "position": "absolute", "opacity": 0, "zIndex": 1},
  
          // Detect transition support
          supportsTransitions = (function () {
            var docBody = document.body || document.documentElement;
            var styles = docBody.style;
            var prop = "transition";
            if (typeof styles[prop] === "string") {
              return true;
            }
            // Tests for vendor specific prop
            vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
            prop = prop.charAt(0).toUpperCase() + prop.substr(1);
            var i;
            for (i = 0; i < vendor.length; i++) {
              if (typeof styles[vendor[i] + prop] === "string") {
                return true;
              }
            }
            return false;
          })(),
  
          // Fading animation
          slideTo = function (idx) {
            settings.before(idx);
            // If CSS3 transitions are supported
            if (supportsTransitions) {
              $slide
                .removeClass(visibleClass)
                .css(hidden)
                .eq(idx)
                .addClass(visibleClass)
                .css(visible);
              index = idx;
              setTimeout(function () {
                settings.after(idx);
              }, fadeTime);
            // If not, use jQuery fallback
            } else {
              $slide
                .stop()
                .fadeOut(fadeTime, function () {
                  $(this)
                    .removeClass(visibleClass)
                    .css(hidden)
                    .css("opacity", 1);
                })
                .eq(idx)
                .fadeIn(fadeTime, function () {
                  $(this)
                    .addClass(visibleClass)
                    .css(visible);
                  settings.after(idx);
                  index = idx;
                });
            }
          };
  
        // Random order
        if (settings.random) {
          $slide.sort(function () {
            return (Math.round(Math.random()) - 0.5);
          });
          $this
            .empty()
            .append($slide);
        }
  
        // Add ID's to each slide
        $slide.each(function (i) {
          this.id = slideClassPrefix + i;
        });
  
        // Add max-width and classes
        $this.addClass(namespace + " " + namespaceIdx);
        if (options && options.maxwidth) {
          $this.css("max-width", maxw);
        }
  
        // Hide all slides, then show first one
        $slide
          .hide()
          .css(hidden)
          .eq(0)
          .addClass(visibleClass)
          .css(visible)
          .show();
  
        // CSS transitions
        if (supportsTransitions) {
          $slide
            .show()
            .css({
              // -ms prefix isn't needed as IE10 uses prefix free version
              "-webkit-transition": "opacity " + fadeTime + "ms ease-in-out",
              "-moz-transition": "opacity " + fadeTime + "ms ease-in-out",
              "-o-transition": "opacity " + fadeTime + "ms ease-in-out",
              "transition": "opacity " + fadeTime + "ms ease-in-out"
            });
        }
  
        // Only run if there's more than one slide
        if ($slide.length > 1) {
  
          // Make sure the timeout is at least 100ms longer than the fade
          if (waitTime < fadeTime + 100) {
            return;
          }
  
          // Pager
          if (settings.pager && !settings.manualControls) {
            var tabMarkup = [];
            $slide.each(function (i) {
              var n = i + 1;
              tabMarkup +=
                "<li>" +
                "<a href='#' class='" + slideClassPrefix + n + "'>" + n + "</a>" +
                "</li>";
            });
            $pager.append(tabMarkup);
  
            // Inject pager
            if (options.navContainer) {
              $(settings.navContainer).append($pager);
            } else {
              $this.after($pager);
            }
          }
  
          // Manual pager controls
          if (settings.manualControls) {
            $pager = $(settings.manualControls);
            $pager.addClass(namespace + "_tabs " + namespaceIdx + "_tabs");
          }
  
          // Add pager slide class prefixes
          if (settings.pager || settings.manualControls) {
            $pager.find('li').each(function (i) {
              $(this).addClass(slideClassPrefix + (i + 1));
            });
          }
  
          // If we have a pager, we need to set up the selectTab function
          if (settings.pager || settings.manualControls) {
            $tabs = $pager.find('a');
  
            // Select pager item
            selectTab = function (idx) {
              $tabs
                .closest("li")
                .removeClass(activeClass)
                .eq(idx)
                .addClass(activeClass);
            };
          }
  
          // Auto cycle
          if (settings.auto) {
  
            startCycle = function () {
              rotate = setInterval(function () {
  
                // Clear the event queue
                $slide.stop(true, true);
  
                var idx = index + 1 < length ? index + 1 : 0;
  
                // Remove active state and set new if pager is set
                if (settings.pager || settings.manualControls) {
                  selectTab(idx);
                }
  
                slideTo(idx);
              }, waitTime);
            };
  
            // Init cycle
            startCycle();
          }
  
          // Restarting cycle
          restartCycle = function () {
            if (settings.auto) {
              // Stop
              clearInterval(rotate);
              // Restart
              startCycle();
            }
          };
  
          // Pause on hover
          if (settings.pause) {
            $this.hover(function () {
              clearInterval(rotate);
            }, function () {
              restartCycle();
            });
          }
  
          // Pager click event handler
          if (settings.pager || settings.manualControls) {
            $tabs.bind("click", function (e) {
              e.preventDefault();
  
              if (!settings.pauseControls) {
                restartCycle();
              }
  
              // Get index of clicked tab
              var idx = $tabs.index(this);
  
              // Break if element is already active or currently animated
              if (index === idx || $("." + visibleClass).queue('fx').length) {
                return;
              }
  
              // Remove active state from old tab and set new one
              selectTab(idx);
  
              // Do the animation
              slideTo(idx);
            })
              .eq(0)
              .closest("li")
              .addClass(activeClass);
  
            // Pause when hovering pager
            if (settings.pauseControls) {
              $tabs.hover(function () {
                clearInterval(rotate);
              }, function () {
                restartCycle();
              });
            }
          }
  
          // Navigation
          if (settings.nav) {
            var navMarkup =
              "<a href='#' class='" + navClass + " prev'>" + settings.prevText + "</a>" +
              "<a href='#' class='" + navClass + " next'>" + settings.nextText + "</a>";
  
            // Inject navigation
            if (options.navContainer) {
              $(settings.navContainer).append(navMarkup);
            } else {
              $this.after(navMarkup);
            }
  
            var $trigger = $("." + namespaceIdx + "_nav"),
              $prev = $trigger.filter(".prev");
  
            // Click event handler
            $trigger.bind("click", function (e) {
              e.preventDefault();
  
              var $visibleClass = $("." + visibleClass);
  
              // Prevent clicking if currently animated
              if ($visibleClass.queue('fx').length) {
                return;
              }
  
              //  Adds active class during slide animation
              //  $(this)
              //    .addClass(namespace + "_active")
              //    .delay(fadeTime)
              //    .queue(function (next) {
              //      $(this).removeClass(namespace + "_active");
              //      next();
              //  });
  
              // Determine where to slide
              var idx = $slide.index($visibleClass),
                prevIdx = idx - 1,
                nextIdx = idx + 1 < length ? index + 1 : 0;
  
              // Go to slide
              slideTo($(this)[0] === $prev[0] ? prevIdx : nextIdx);
              if (settings.pager || settings.manualControls) {
                selectTab($(this)[0] === $prev[0] ? prevIdx : nextIdx);
              }
  
              if (!settings.pauseControls) {
                restartCycle();
              }
            });
  
            // Pause when hovering navigation
            if (settings.pauseControls) {
              $trigger.hover(function () {
                clearInterval(rotate);
              }, function () {
                restartCycle();
              });
            }
          }
  
        }
  
        // Max-width fallback
        if (typeof document.body.style.maxWidth === "undefined" && options.maxwidth) {
          var widthSupport = function () {
            $this.css("width", "100%");
            if ($this.width() > maxw) {
              $this.css("width", maxw);
            }
          };
  
          // Init fallback
          widthSupport();
          $(window).bind("resize", function () {
            widthSupport();
          });
        }
  
      });
  
    };
  })(jQuery, this, 0);

  /* Visibilidade */

  ;(function (global) {
    var lastId = -1;

    // Visibility.js allow you to know, that your web page is in the background
    // tab and thus not visible to the user. This library is wrap under
    // Page Visibility API. It fix problems with different vendor prefixes and
    // add high-level useful functions.
    var self = {

        // Call callback only when page become to visible for user or
        // call it now if page is visible now or Page Visibility API
        // doesn’t supported.
        //
        // Return false if API isn’t supported, true if page is already visible
        // or listener ID (you can use it in `unbind` method) if page isn’t
        // visible now.
        //
        //   Visibility.onVisible(function () {
        //       startIntroAnimation();
        //   });
        onVisible: function (callback) {
            var support = self.isSupported();
            if ( !support || !self.hidden() ) {
                callback();
                return support;
            }

            var listener = self.change(function (e, state) {
                if ( !self.hidden() ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Call callback when visibility will be changed. First argument for
        // callback will be original event object, second will be visibility
        // state name.
        //
        // Return listener ID to unbind listener by `unbind` method.
        //
        // If Page Visibility API doesn’t supported method will be return false
        // and callback never will be called.
        //
        //   Visibility.change(function(e, state) {
        //       Statistics.visibilityChange(state);
        //   });
        //
        // It is just proxy to `visibilitychange` event, but use vendor prefix.
        change: function (callback) {
            if ( !self.isSupported() ) {
                return false;
            }
            lastId += 1;
            var number = lastId;
            self._callbacks[number] = callback;
            self._listen();
            return number;
        },

        // Remove `change` listener by it ID.
        //
        //   var id = Visibility.change(function(e, state) {
        //       firstChangeCallback();
        //       Visibility.unbind(id);
        //   });
        unbind: function (id) {
            delete self._callbacks[id];
        },

        // Call `callback` in any state, expect “prerender”. If current state
        // is “prerender” it will wait until state will be changed.
        // If Page Visibility API doesn’t supported, it will call `callback`
        // immediately.
        //
        // Return false if API isn’t supported, true if page is already after
        // prerendering or listener ID (you can use it in `unbind` method)
        // if page is prerended now.
        //
        //   Visibility.afterPrerendering(function () {
        //       Statistics.countVisitor();
        //   });
        afterPrerendering: function (callback) {
            var support   = self.isSupported();
            var prerender = 'prerender';

            if ( !support || prerender != self.state() ) {
                callback();
                return support;
            }

            var listener = self.change(function (e, state) {
                if ( prerender != state ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Return true if page now isn’t visible to user.
        //
        //   if ( !Visibility.hidden() ) {
        //       VideoPlayer.play();
        //   }
        //
        // It is just proxy to `document.hidden`, but use vendor prefix.
        hidden: function () {
            return !!(self._doc.hidden || self._doc.webkitHidden);
        },

        // Return visibility state: 'visible', 'hidden' or 'prerender'.
        //
        //   if ( 'prerender' == Visibility.state() ) {
        //       Statistics.pageIsPrerendering();
        //   }
        //
        // Don’t use `Visibility.state()` to detect, is page visible, because
        // visibility states can extend in next API versions.
        // Use more simpler and general `Visibility.hidden()` for this cases.
        //
        // It is just proxy to `document.visibilityState`, but use
        // vendor prefix.
        state: function () {
            return self._doc.visibilityState       ||
                   self._doc.webkitVisibilityState ||
                   'visible';
        },

        // Return true if browser support Page Visibility API.
        // refs: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
        //
        //   if ( Visibility.isSupported() ) {
        //       Statistics.startTrackingVisibility();
        //       Visibility.change(function(e, state)) {
        //           Statistics.trackVisibility(state);
        //       });
        //   }
        isSupported: function () {
            return self._doc.hidden !== undefined || self._doc.webkitHidden !== undefined;
        },

        // Link to document object to change it in tests.
        _doc: document || {},

        // Callbacks from `change` method, that wait visibility changes.
        _callbacks: { },

        // Listener for `visibilitychange` event.
        _change: function(event) {
            var state = self.state();

            for ( var i in self._callbacks ) {
                self._callbacks[i].call(self._doc, event, state);
            }
        },

        // Set listener for `visibilitychange` event.
        _listen: function () {
            if ( self._init ) {
                return;
            }

            var event = 'visibilitychange';
            if ( self._doc.webkitVisibilityState ) {
                event = 'webkit' + event;
            }

            var listener = function () {
                self._change.apply(self, arguments);
            };
            if ( self._doc.addEventListener ) {
                self._doc.addEventListener(event, listener);
            } else {
                self._doc.attachEvent(event, listener);
            }
            self._init = true;
        }

    };

    if ( typeof(module) != 'undefined' && module.exports ) {
        module.exports = self;
    } else {
        global.Visibility = self;
    }

})(this);

;(function (window) {
    var lastTimer = -1;

    var install = function (Visibility) {

        // Run callback every `interval` milliseconds if page is visible and
        // every `hiddenInterval` milliseconds if page is hidden.
        //
        //   Visibility.every(60 * 1000, 5 * 60 * 1000, function () {
        //       checkNewMails();
        //   });
        //
        // You can skip `hiddenInterval` and callback will be called only if
        // page is visible.
        //
        //   Visibility.every(1000, function () {
        //       updateCountdown();
        //   });
        //
        // It is analog of `setInterval(callback, interval)` but use visibility
        // state.
        //
        // It return timer ID, that you can use in `Visibility.stop(id)` to stop
        // timer (`clearInterval` analog).
        // Warning: timer ID is different from interval ID from `setInterval`,
        // so don’t use it in `clearInterval`.
        //
        // On change state from hidden to visible timers will be execute.
        Visibility.every = function (interval, hiddenInterval, callback) {
            Visibility._time();

            if ( !callback ) {
                callback = hiddenInterval;
                hiddenInterval = null;
            }

            lastTimer += 1;
            var number = lastTimer;

            Visibility._timers[number] = {
                visible:  interval,
                hidden:   hiddenInterval,
                callback: callback
            };
            Visibility._run(number, false);

            if ( Visibility.isSupported() ) {
                Visibility._listen();
            }
            return number;
        };

        // Stop timer from `every` method by it ID (`every` method return it).
        //
        //   slideshow = Visibility.every(5 * 1000, function () {
        //       changeSlide();
        //   });
        //   $('.stopSlideshow').click(function () {
        //       Visibility.stop(slideshow);
        //   });
        Visibility.stop = function(id) {
            if ( !Visibility._timers[id] ) {
                return false;
            }
            Visibility._stop(id);
            delete Visibility._timers[id];
            return true;
        };

        // Callbacks and intervals added by `every` method.
        Visibility._timers = { };

        // Initialize variables on page loading.
        Visibility._time = function () {
            if ( Visibility._timed ) {
                return;
            }
            Visibility._timed     = true;
            Visibility._wasHidden = Visibility.hidden();

            Visibility.change(function () {
                Visibility._stopRun();
                Visibility._wasHidden = Visibility.hidden();
            });
        };

        // Try to run timer from every method by it’s ID. It will be use
        // `interval` or `hiddenInterval` depending on visibility state.
        // If page is hidden and `hiddenInterval` is null,
        // it will not run timer.
        //
        // Argument `runNow` say, that timers must be execute now too.
        Visibility._run = function (id, runNow) {
            var interval,
                timer = Visibility._timers[id];

            if ( Visibility.hidden() ) {
                if ( null === timer.hidden ) {
                    return;
                }
                interval = timer.hidden;
            } else {
                interval = timer.visible;
            }

            var runner = function () {
                timer.last = new Date();
                timer.callback.call(window);
            }

            if ( runNow ) {
                var now  = new Date();
                var last = now - timer.last ;

                if ( interval > last ) {
                    timer.delay = setTimeout(function () {
                        timer.id = setInterval(runner, interval);
                        runner();
                    }, interval - last);
                } else {
                    timer.id = setInterval(runner, interval);
                    runner();
                }

            } else {
              timer.id = setInterval(runner, interval);
            }
        };

        // Stop timer from `every` method by it’s ID.
        Visibility._stop = function (id) {
            var timer = Visibility._timers[id];
            clearInterval(timer.id);
            clearTimeout(timer.delay);
            delete timer.id;
            delete timer.delay;
        };

        // Listener for `visibilitychange` event.
        Visibility._stopRun = function (event) {
            var isHidden  = Visibility.hidden(),
                wasHidden = Visibility._wasHidden;

            if ( (isHidden && !wasHidden) || (!isHidden && wasHidden) ) {
                for ( var i in Visibility._timers ) {
                    Visibility._stop(i);
                    Visibility._run(i, !isHidden);
                }
            }
        };

        return Visibility;
    }

    if ( typeof(module) != 'undefined' && module.exports ) {
        module.exports = install(require('./visibility.core'));
    } else {
        install(window.Visibility || require('./visibility.core'))
    }

})(window);
