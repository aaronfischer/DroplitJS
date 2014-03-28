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
    element.className = element.className.replace(re, ' ');
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
    dropClassName: "dropped",
    showProgress: true,
    acceptedTypes: [
      'image/png',
      'image/jpeg',
      'image/gif'
    ]
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

  Droplit.prototype.createProgressElement = function() {
    this.progressElement = document.createElement('progress');
    this.progressElement.min = 0;
    this.progressElement.max = 100;
    this.progressElement.value = 0;
    this.droparea.appendChild(this.progressElement);
  };

  Droplit.prototype.setUpEventListeners = function() {
    var self = this;
    this.droparea.ondragover = function() {
      addClass(self.droparea, self.options.hoverClassName);
      return false;
    };
    this.droparea.ondragleave = function() {
      removeClass(self.droparea, self.options.hoverClassName);
      return false;
    };
    this.droparea.ondrop = function(e) {
      e.preventDefault();
      if (self.options.showProgress) self.createProgressElement();
      addClass(self.droparea, self.options.dropClassName);
      removeClass(self.droparea, self.options.hoverClassName);
      if (e.dataTransfer) {
        self.readFiles(e.dataTransfer.files);
      }
    };
  };

  Droplit.prototype.readFiles = function(files) {
    var self = this,
        formData = !!window.FormData ? new FormData() : null;

    for (var i = files.length - 1; i > 0; i--) {
      if (!!window.FormData) formData.append('file', files.item(i));
      self.previewfile(files.item(i));
    }

    if (!!window.FormData) {
      var xhr = new XMLHttpRequest();
      xhr.open(self.options.method, self.options.url);
      xhr.onload = function() {
        self.progressElement.value = self.progressElement.innerHTML = 100;
      };

      if ("upload" in new XMLHttpRequest()) {
        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) {
            var complete = (e.loaded / e.total * 100 | 0);
            self.progressElement.value = self.progressElement.innerHTML = complete;
          }
        };
      }

      xhr.send(formData);
    }
  };

  Droplit.prototype.previewfile = function(file) {
    var self = this;

    console.log(file);
    if ((typeof FileReader !== 'undefined') === true && self.options.acceptedTypes[file.type] === true) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var image = new Image();
        image.src = event.target.result;
        image.width = 250; // a fake resize
        holder.appendChild(image);
      };

      reader.readAsDataURL(file);
    }  else {
      holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
      console.log(file);
    }
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