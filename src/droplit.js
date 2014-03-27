(function() {
  'use strict';
  var __slice, Droplit, extend, addClass, removeClass;

  __slice = [].slice;

  extend = function() {
    var key, object, objects, target, val, _i, _len;
    target = arguments[0];
    objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      object = objects[_i];
      for (key in object) {
        val = object[key];
        target[key] = val;
      }
    }
    return target;
  };

  addClass = function(element, className) {
    var re = new RegExp(className, 'g');
    if (!element.className.match(re)) {
      element.className += ' ' + className;
    }
    return element;
  };

  removeClass = function(element, className) {
    var re = new RegExp(className, "g");
    element.className.replace(re, '');
  };

  // new Droplit('.file', {...});
  Droplit = function(element, options) {
    if (typeof element === "string") {
      this.element = document.querySelector(element);
    }
    else if (typeof element === "object") {
      this.element = element;
    }
    if (!(this.element && (this.element.nodeType !== null))) {
      throw new Error("Invalid droplit element.");
    }
    if (this.element.droplit) {
      throw new Error("Droplit already attached.");
    }
    this.element.droplit = this;
    this.options = extend({}, this.defaultOptions, options !== null ? options : {});

    this.initialize();
  };

  Droplit.prototype.defaultOptions = {
    url: null,
    method: "post",
    divClassName: "droplit",
    hoverClassName: "hover",
    showProgress: true
  };

  Droplit.prototype.initialize = function() {
    this.hideInputElement();
    this.createDroplitDiv();
    this.setUpEventListeners();
  };

  Droplit.prototype.hideInputElement = function() {
    this.element.style.display = 'none';
  };

  Droplit.prototype.createDroplitDiv = function() {
    this.droparea = document.createElement('div');
    this.droparea.className = this.options.divClassName;
    this.element.parentNode.insertBefore(this.droparea, this.element);
  };

  Droplit.prototype.setUpEventListeners = function() {
    var self = this;
    this.droparea.ondragover = function() {
      addClass(self.droparea, self.options.hoverClassName);
    };
    this.droparea.ondragoverend = function() {
      removeClass(self.droparea, self.options.hoverClassName);
    };
    this.droparea.ondrop = function(e) {
      e.preventDefault();
      removeClass(self.droparea, self.options.hoverClassName);
      self.readFiles(e.dataTransfer.files);
    };
  };

  Droplit.prototype.readFiles = function(files) {

  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.droplit = function(options) {
      return this.each(function() {
        return new Droplit(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Droplit;
  } else {
    window.Droplit = Droplit;
  }

})();