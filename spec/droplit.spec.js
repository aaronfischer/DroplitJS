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
    expect(function() { new Droplit() }).toThrow(new Error("Invalid droplit element."));
  });

  it("should be able to take a string", function() {
    var droplit = new Droplit('input');
    expect(droplit.element.nodeName).toBe('INPUT');
  });

});