describe("Event Hooks", function() {
  var input;

  beforeEach(function() {
    input = document.createElement('input');
    document.querySelector('body').appendChild(input);
  });

  afterEach(function() {
    var divs, progresses;

    $('.droplit, progress, input').remove();
  });

  it("onDropAreaDragOver", function() {
    var test = false;
    var droplit = new Droplit(input, {
      url: '/',
      onDropAreaDragOver: function() {
        test = true;
      } 
    });

    var div = document.querySelector('.droplit');
    div.ondragover();

    expect(test).toBe(true);
  });

  it("onDropAreaDragLeave", function() {
    var test = false;
    var droplit = new Droplit(input, {
      url: '/',
      onDropAreaDragLeave: function() {
        test = true;
      }
    });

    var div = document.querySelector('.droplit');
    div.ondragover();
    div.ondragleave();
    
    expect(test).toBe(true);
  });

  it("onDropAreaDragLeave", function() {
    var test = false;
    var droplit = new Droplit(input, {
      url: '/',
      onDropAreaDrop: function() {
        test = true;
      }
    });

    var div = document.querySelector('.droplit');
    
    $(div).trigger('drop');
    
    expect(test).toBe(true);
  });


});