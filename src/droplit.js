(function() {
  'use strict';
  var __slice, Droplit, extend, hideElement, addClass, removeClass;

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

  hideElement = function(element) {
    element.style.display = 'none';
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
    dropareaText: "Drop files here",
    buttonText: "Select Files",
    acceptedTypes: [
      'image/png',
      'image/jpeg',
      'image/gif'
    ]
  };

  Droplit.prototype.initialize = function() {
    this.convertAcceptedTypes();
    new Droplit.Droparea(this.element, this.options);
  };

  Droplit.prototype.convertAcceptedTypes = function() {
    var types = {};

    for (var i = this.options.acceptedTypes.length - 1; i >= 0; i--) {
      types[this.options.acceptedTypes[i]] = true;
    }
    
    this.options.acceptedTypes = types;
  };

  Droplit.Droparea = function(element, options) {
    this.options = options;
    this.element = element.nodeName !== "DIV" ? document.createElement('div') : element;
    this.element.className = options.divClassName;
    if (element.nodeName !== "DIV") element.parentNode.insertBefore(this.element, element);
    if (element.nodeName === "INPUT") {
      this.inputElement = element;
    }
    else {
      this.inputElement = document.createElement('input');
      element.appendChild(this.inputElement);
    }
    hideElement(this.inputElement);
    this.element.innerText = this.options.dropareaText;
    new Droplit.Button(this.element, this.options, this);
    this.bindUIActions();
  };

  Droplit.Droparea.prototype.bindUIActions = function() {
    var self = this;
    this.element.ondragover = function() {
      addClass(self.element, self.options.hoverClassName);
      if (self.options.onDropAreaDragOver) self.options.onDropAreaDragOver();
      return false;
    };
    this.element.ondragleave = function() {
      removeClass(self.element, self.options.hoverClassName);
      if (self.options.onDropAreaDragLeave) self.options.onDropAreaDragLeave();
      return false;
    };
    this.element.ondrop = function(e) {
      e.preventDefault();
      addClass(self.element, self.options.dropClassName);
      removeClass(self.element, self.options.hoverClassName);
      if (self.options.onDropAreaDrop) self.options.onDropAreaDrop();
      if (e.dataTransfer) self.readFiles(e.dataTransfer.files);
      return false;
    };
  };

  Droplit.Droparea.prototype.readFiles = function(files) {
    var self = this,
        formData = window.FormData ? new FormData() : null;

    for (var i = files.length - 1; i >= 0; i--) {
      if (window.FormData) formData.append('file', files.item(i));
      new Droplit.File(files.item(i), this.options, this.element);
    }
  };

  Droplit.Button = function(element, options, droparea) {
    this.droparea = droparea;
    this.element = document.createElement('button');
    this.options = options;
    this.element.innerText = this.options.buttonText;

    element.appendChild(this.element);

    this.bindUIActions();
  };

  Droplit.Button.prototype.bindUIActions = function() {
    var self = this;
    this.element.onclick = function(e) {
      e.preventDefault();
      self.droparea.inputElement.click();
    };
  };

  Droplit.File = function(file, options, droparea) {
    var self = this;
    this.file = file;
    this.options = options;
    this.droparea = droparea;
    this.formData = window.FormData ? new FormData() : null;
    this.progressElement = document.createElement('progress');
    this.progressElement.min = 0;
    this.progressElement.max = 100;
    this.progressElement.value = 0;
    droparea.appendChild(this.progressElement);

    this.renderPreview();
    this.submitData();
  };

  Droplit.File.prototype.renderPreview = function() {
    var self = this;

    if (typeof FileReader !== 'undefined' && self.options.acceptedTypes[self.file.type]) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var image = new Image();
        image.src = event.target.result;
        image.width = 250; // a fake resize
        self.droparea.appendChild(image);
      };
      reader.readAsDataURL(self.file);
    }  else {
      self.droparea.innerHTML += '<p>Uploaded ' + self.file.name + ' ' + (self.file.size ? (self.file.size/1024|0) + 'K' : '');
    }
    self.droparea.removeChild(self.progressElement);
  };

  Droplit.File.prototype.submitData = function() {
    var self = this;

    if (window.FormData) {
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

      xhr.send(self.formData);
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