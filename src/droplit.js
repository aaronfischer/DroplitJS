(function() {
	'use strict';

	// new Droplit('.file', {...});
	var Droplit = function(element, options) {
		if (typeof element === "string") {
      this.element = document.querySelector(element);
    }
    if (!(this.element && (this.element.nodeType != null))) {
      throw new Error("Invalid droplit element.");
    }
    if (this.element.droplit) {
      throw new Error("Droplit already attached.");
    }
    this.element.droplit = this;

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