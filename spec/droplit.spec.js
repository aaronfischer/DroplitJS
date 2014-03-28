describe("DroplitJS", function() {
  var input,
      droplit;

  beforeEach(function() {
    input = document.createElement('input');
    document.querySelector('body').appendChild(input);
    droplit = new Droplit(input);
  });

  afterEach(function() {
    var divs, progresses;

    $('.droplit, progress, input').remove();
  });

  it("Input should be hidden", function() {
    expect(input.style.display).toBe('none');
  });

  it("Should create a dropzone div", function() {
    var divs = document.querySelectorAll('.droplit');
    expect(divs.length).toBe(1);
  });

  it("Should add class on dragover", function() {
    var div = document.querySelector('.droplit');
    div.ondragover();
    expect(div.className).toMatch(/hover/);
  });

  it("Should remove class on dragoverend", function() {
    var div = document.querySelector('.droplit');
    div.ondragover();
    div.ondragleave();
    expect(div.className).not.toMatch(/hover/);
  });

  it("Should change class names on drop", function() {
    var div = document.querySelector('.droplit'),
        progress;

    $(div).trigger('drop');

    progress = document.querySelectorAll('progress');

    expect(div.className).not.toMatch(/hover/);
    expect(div.className).toMatch(/dropped/);
    expect(progress.length).toBe(1);
  });



});