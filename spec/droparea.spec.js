describe("Droplit.Droparea", function() {
  var input, div, defaultOptions;

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
  });

  afterEach(function() {
    $('.droplit, progress, input').remove();
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
    var spy = sinon.spy(Droplit, 'Button');
    var droparea = new Droplit.Droparea(div, defaultOptions);
    var test = spy.calledWithNew();
    expect(test).toBe(true);
  });

  it('should call bindUIActions', function() {
    var spy = sinon.spy(Droplit.Droparea.prototype, 'bindUIActions');
    var droparea = new Droplit.Droparea(div, defaultOptions);
    expect(spy.called).toBe(true);
  });

  describe("bindUIActions", function() {

  });

  describe("readFiles", function() {
    
  });

});