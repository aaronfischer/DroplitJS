describe("Droplit.Droparea", function() {
  var input, defaultOptions;

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
    var div = document.createElement('div');
    document.querySelector('body').appendChild(div);
    var droparea = new Droplit.Droparea(div, defaultOptions);
    expect(droparea.element.nodeName).toBe('DIV');
  });

});