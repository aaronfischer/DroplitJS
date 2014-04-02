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