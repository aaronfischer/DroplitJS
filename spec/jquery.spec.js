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