describe("Droplit", function() {

  describe("Droplit constructor", function() {
    var input;

    beforeEach(function() {
      input = document.createElement('input');
      document.querySelector('body').appendChild(input);
    });

    afterEach(function() {
      $('.droplit, progress, input').remove();
    });

    it("should throw error for no arguments", function() {
      expect(function() { new Droplit(); }).toThrow(new Error("Invalid droplit element."));
    });

    it("should be able to take a string", function() {
      var droplit = new Droplit('input');
      expect(droplit.element.nodeName).toBe('INPUT');
    });

    it("should be able to take an element object", function() {
      var droplit = new Droplit(input);
      expect(droplit.element.nodeName).toBe('INPUT');
    });

    it("shouldn't be able to be called twice on one element", function() {
      var droplit = new Droplit(input);
      expect(function() { new Droplit(input); }).toThrow(new Error("Droplit already attached."));
    });

    it("should call initialize", function() {
      var mock = sinon.mock(Droplit.prototype);
      mock.expects('initialize').once();
      var droplit = new Droplit(input);
      mock.verify();
    });

    describe("initialize", function() {

      it("should call convertAcceptedTypes", function() {
        var mock = sinon.mock(Droplit.prototype);
        mock.expects('convertAcceptedTypes').once();
        var droplit = new Droplit(input);
        mock.verify();
      });

      it('should create new instance of Droplit.Droparea', function() {
        var spy = sinon.spy(Droplit, 'Droparea');
        var droplit = new Droplit(input);
        var test = spy.calledWithNew();
        expect(test).toBe(true);
      });

    });

    describe("convertAcceptedTypes", function() {

      it("should convert the acceptedTypes to an object", function() {
        var droplit = new Droplit(input, { acceptedTypes: ['test'] });
        expect(droplit.options.acceptedTypes).toEqual({ 'test': true });
      });
      
    });

  });

  describe("Droplit.Droparea", function() {
    var input, div, defaultOptions, buttonSpy, bindSpy;

    beforeEach(function() {
      defaultOptions = {
        url: '/',
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
      input = document.createElement('input');
      document.querySelector('body').appendChild(input);

      div = document.createElement('div');
      document.querySelector('body').appendChild(div);

      buttonSpy = sinon.spy(Droplit, 'Button');
      bindSpy = sinon.spy(Droplit.Droparea.prototype, 'bindUIActions');
    });

    afterEach(function() {
      div.parentNode.removeChild(div);
      input.parentNode.removeChild(input);
      Droplit.Button.restore();
      Droplit.Droparea.prototype.bindUIActions.restore();
    });

    it('should expect an element and options', function() {
      expect(function() { Droplit.Droparea(); }).toThrow();
    });

    it('should take input object', function() {
      var droparea = new Droplit.Droparea(input, defaultOptions);
      expect(droparea.element.nodeName).toBe('DIV');
    });

    it('should take div object', function() {
      var droparea = new Droplit.Droparea(div, defaultOptions);
      expect(droparea.element.nodeName).toBe('DIV');
    });

    it('should take div object', function() {
      var droparea = new Droplit.Droparea(div, defaultOptions);
      expect(droparea.element.nodeName).toBe('DIV');
    });

    it('should set the class name', function() {
      var droparea = new Droplit.Droparea(div, defaultOptions);
      expect(droparea.element.className).toBe(defaultOptions.divClassName);
    });

    it('should use input if it exists', function() {
      var droparea = new Droplit.Droparea(input, defaultOptions);
      expect(droparea.inputElement).toBe(input);
    });

    it('should create input if doesnt exist', function() {
      var droparea = new Droplit.Droparea(div, defaultOptions);
      expect(droparea.inputElement.nodeName).toBe('INPUT');
    });

    it('should hide input', function() {
      var droparea = new Droplit.Droparea(div, defaultOptions);
      expect(droparea.inputElement.style.display).toBe('none');
    });

    it('should set text from options', function() {
      var droparea = new Droplit.Droparea(div, defaultOptions);
      expect(droparea.element.innerText).toBe(defaultOptions.dropareaText + defaultOptions.buttonText);
    });

    it('should create new instance of Droplit.Button', function() {
      var droparea = new Droplit.Droparea(div, defaultOptions);
      var test = buttonSpy.calledWithNew();
      expect(test).toBe(true);
    });

    it('should call bindUIActions', function() {
      var droparea = new Droplit.Droparea(div, defaultOptions);
      expect(bindSpy.called).toBe(true);
    });

    describe("bindUIActions", function() {
      var droparea, readFilesSpy, doCallbackSpy, options, dlCallbackSpy, dropCallbackspy;

      beforeEach( function() {
        droparea = new Droplit.Droparea(div, defaultOptions);
        options = defaultOptions;
        options.onDropAreaDragOver = function() { return true; };
        options.onDropAreaDragLeave = function() { return true; };
        options.onDropAreaDrop = function() { return true; };
        readFilesSpy = sinon.spy(Droplit.Droparea.prototype, 'readFiles');
        doCallbackSpy = sinon.spy(options, 'onDropAreaDragOver');
        dlCallbackSpy = sinon.spy(options, 'onDropAreaDragLeave');
        dropCallbackspy = sinon.spy(options, 'onDropAreaDrop');
      });

      afterEach( function() {
        Droplit.Droparea.prototype.readFiles.restore();
        options.onDropAreaDragOver.restore();
        options.onDropAreaDragLeave.restore();
        options.onDropAreaDrop.restore();
      });

      it('should set dragover event listener', function() {
        expect(droparea.element.ondragover).not.toBe(null);
      });

      it('dragover should run callback function', function() {
        var droparea = new Droplit.Droparea(div, options);
        droparea.element.ondragover();
        expect(doCallbackSpy.called).toBe(true);
      });

      it('dragover should add class', function() {
        droparea.element.ondragover();
        expect(droparea.element.className).toContain(defaultOptions.hoverClassName);
      });

      it('should set dragleave event listener', function() {
        droparea.element.ondragleave();
        expect(droparea.element.ondragleave).not.toBe(null);
      });

      it('dragleave should remove class', function() {
        droparea.element.ondragleave();
        expect(droparea.element.className).not.toContain(defaultOptions.hoverClassName);
      });

      it('dragleave should run callback function', function() {
        var droparea = new Droplit.Droparea(div, options);
        droparea.element.ondragleave();
        expect(dlCallbackSpy.called).toBe(true);
      });

      it('should set drop event listener', function() {
        expect(droparea.element.ondrop).not.toBe(null);
      });

      it('drop should remove drag class', function() {
        droparea.element.ondrop($.Event('drop', { dataTransfer: { files: [] } }));
        expect(droparea.element.className).not.toContain(defaultOptions.hoverClassName);
      });

      it('drop should add drop class', function() {
        droparea.element.ondrop($.Event('drop', { dataTransfer: { files: [] } }));
        expect(droparea.element.className).toContain(defaultOptions.dropClassName);
      });

      it('drop should call readfiles if dataTransfer exists', function() {
        droparea.element.ondrop($.Event('drop', { dataTransfer: { files: [] } }));
        expect(readFilesSpy.called).toBe(true);
      });

      it('drop should not call readFiles if dataTransfer does not exists', function() {
        droparea.element.ondrop($.Event('drop'));
        expect(readFilesSpy.called).not.toBe(true);
      });

      it('drop should run callback function', function() {
        var droparea = new Droplit.Droparea(div, options);
        droparea.element.ondrop($.Event('drop', { dataTransfer: { files: [] } }));
        expect(dropCallbackspy.called).toBe(true);
      });
    });

    describe("readFiles", function() {
      var FakeFileList = function(files) {
        this.length = files.length;
        for (var i = files.length - 1; i >= 0; i--) {
          this[i] = files[i];
        }
      };
      FakeFileList.prototype.item = function(i) {
        return this[i];
      };

      var stub;

      beforeEach( function() {
        stub = sinon.stub(Droplit, 'File');
      });

      afterEach( function() {
        Droplit.File.restore();
      });

      it('should create a new instance of Droplit.File for one file', function() {
        var fl = new FakeFileList([{
          name: "test.jpeg",
          size: 12345,
          type: "image/jpeg"
        }]);
        Droplit.Droparea.prototype.readFiles(fl, defaultOptions, stub);
        var test = stub.calledWithNew();
        expect(test).toBe(true);
      });

      it('should create a new instance of Droplit.File for each of multiple files', function() {
        var fl = new FakeFileList([{
          name: "test.jpeg",
          size: 12345,
          type: "image/jpeg"
        },
        {
          name: "test2.jpeg",
          size: 12345,
          type: "image/jpeg"
        }]);
        Droplit.Droparea.prototype.readFiles(fl, defaultOptions, stub);
        expect(stub.calledTwice).toBe(true);
      });
    });

  });

  describe("Droplit.Button", function() {
    var div, defaultOptions, stub, droparea;

    beforeEach(function() {
      defaultOptions = {
        url: '/',
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

      div = document.createElement('div');
      document.querySelector('body').appendChild(div);

      // stub is to prevent Button from being run twice
      stub = sinon.stub(Droplit, 'Button');
      droparea = new Droplit.Droparea(div, defaultOptions);
      Droplit.Button.restore();
    });

    afterEach( function() {
      div.parentNode.removeChild(div);
    });

    it('should set its droparea', function() {
      var button = new Droplit.Button(droparea);
      expect(button.droparea).toBe(droparea);
    });

    it('should create a button', function() {
      var button = new Droplit.Button(droparea);
      expect(button.element.nodeName).toBe('BUTTON');
    });

    it('should set its options', function() {
      var button = new Droplit.Button(droparea);
      expect(button.options).toBe(droparea.options);
    });

    it('should set its text', function() {
      var button = new Droplit.Button(droparea);
      expect(button.element.innerText).toBe(defaultOptions.buttonText);
    });

    it('should append button to droparea', function() {
      var button = new Droplit.Button(droparea);
      var buttons = $(droparea.element).find('button');
      expect(buttons.length).toBe(1);
    });

    it('should call bindUIActions', function() {
      var bindSpy = sinon.spy(Droplit.Button.prototype, 'bindUIActions');
      var button = new Droplit.Button(droparea);
      Droplit.Button.prototype.bindUIActions.restore();
      expect(bindSpy.called).toBe(true);
    });

    describe("bindUIActions", function() {
      it('should trigger click on droparea input on click', function() {
        var button = new Droplit.Button(droparea);
        var spy = sinon.spy(button.droparea.inputElement, 'click');
        button.element.click($.Event('click'));
        button.droparea.inputElement.click.restore();
        expect(spy.called).toBe(true);
      });
    });

  });

  describe("Droplit.File", function() {

  });

});

describe("jQuery Plugin", function() {
  var $myDrop = $('<div id="my-drop">');

  beforeEach(function() {
    $('body').append($myDrop);
  });

  afterEach(function() {
    $('.droplit').remove();
  });

  it("should work as a jQuery plugin on a div", function() {
    $myDrop.droplit({
      url: '/',
    });

    expect($myDrop.hasClass('droplit')).toBe(true);
  });

});