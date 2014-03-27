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

    divs = document.querySelectorAll('.droplit');
    for (var i = divs.length - 1; i >= 0; i--) {
      divs[i].parentNode.removeChild(divs[i]);
    }

    progresses = document.querySelectorAll('progress');
    for (i = progresses.length - 1; i >= 0; i--) {
      progresses[i].parentNode.removeChild(progresses[i]);
    }

    input.parentNode.removeChild(input);
  });

  it("Input should be hidden", function() {
    expect(input.style.display).toBe('none');
  });

  it("Should create a dropzone div", function() {
    var divs = document.querySelectorAll('.droplit');
    expect(divs.length).toBe(1);
  });

  it("Should create a progress element", function() {
    var progress = document.querySelectorAll('progress');
    expect(progress.length).toBe(1);
  });

  it("Should add class on dragover", function() {
    var div = document.querySelector('.droplit');
    div.ondragover();
    expect(div.className).toMatch(/hover/);
  });

  it("Should remove class on dragoverend", function() {
    var div = document.querySelector('.droplit');
    div.ondragoverend();
    expect(div.className).not.toMatch(/hover/);
  });

  it("Should change class names on drop", function() {
    var div = document.querySelector('.droplit'),
        evt = new MouseEvent('drop');
    div.ondrop(evt);
    expect(div.className).not.toMatch(/hover/);
    expect(div.className).toMatch(/dropped/);
  });



});