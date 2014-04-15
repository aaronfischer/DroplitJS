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
    method: "POST",
    param: 'myFile',
    divClassName: "droplit",
    hoverClassName: "hover",
    dropClassName: "dropped",
    showProgress: true,
    dropareaText: "Drop files here",
    buttonText: "Select Files",
    previewWidth: 100,
    acceptedTypes: [
      'image/png',
      'image/jpeg',
      'image/gif'
    ]
  };

  Droplit.prototype.initialize = function() {
    this.convertAcceptedTypes();
    this.convertURL();
    new Droplit.Droparea(this.element, this.options);
  };

  Droplit.prototype.convertAcceptedTypes = function() {
    var types = {};
    for (var i = this.options.acceptedTypes.length - 1; i >= 0; i--) {
      types[this.options.acceptedTypes[i]] = true;
    }
    this.options.acceptedTypes = types;
  };

  Droplit.prototype.convertURL = function() {
    if (typeof this.options.url === 'function') {
      this.options.url = this.options.url(this);
    }
  };

  Droplit.Droparea = function(element, options) {
    this.options = options;
    this.element = element.nodeName !== "DIV" ? document.createElement('div') : element;
    this.element.className = options.divClassName;
    if (element.nodeName !== "DIV") element.parentNode.insertBefore(this.element, element);
    this.element.innerText = this.options.dropareaText;
    if (element.nodeName === "INPUT") {
      this.inputElement = element;
    }
    else {
      this.inputElement = document.createElement('input');
      this.inputElement.type = 'file';
      this.element.appendChild(this.inputElement);
    }
    hideElement(this.inputElement);
    new Droplit.Button(this);
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
    };
  };

  Droplit.Droparea.prototype.readFiles = function(files) {
    for (var i = files.length - 1; i >= 0; i--) {
      new Droplit.File(files.item(i), this.options, this.element);
    }
  };

  Droplit.Button = function(droparea) {
    this.droparea = droparea;
    this.element = document.createElement('button');
    this.options = droparea.options;
    this.element.innerText = this.options.buttonText;

    this.droparea.element.appendChild(this.element);

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

    if (self.options.acceptedTypes[self.file.type]) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var image = new Image();
        image.src = event.target.result;
        image.width = self.options.previewWidth; // a fake resize
        self.droparea.appendChild(image);
      };
      reader.readAsDataURL(self.file);
    }  else {
      self.droparea.innerHTML += '<p>Uploaded ' + self.file.name + ' ' + (self.file.size ? (self.file.size / 1024 | 0) + 'K' : '');
    }
  };

  Droplit.File.prototype.submitData = function() {
    var self = this,
        formData = new FormData(),
        url;
    formData.append(self.options.param, self.file);

    var xhr = new XMLHttpRequest();
    
    xhr.open(self.options.method, self.options.url);

    for (var header in self.options.headers) {
      if (self.options.headers.hasOwnProperty(header)) {
        xhr.setRequestHeader(header, self.options.headers[header]);
      }
    }

    xhr.onload = function() {
      self.droparea.removeChild(self.progressElement);
      if (typeof self.options.success === 'function') {
        self.options.success(self.file, this.responseText);
      }
    };

    xhr.upload.onprogress = function (e) {
      var complete = (e.loaded / e.total * 100 | 0);
      self.progressElement.value = self.progressElement.innerHTML = complete;
    };

    xhr.send(formData);
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