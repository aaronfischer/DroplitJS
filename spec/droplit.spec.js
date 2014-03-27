describe("DroplitJS", function() {
	var input,
			droplit;

	beforeEach(function() {
    input = document.createElement('input');
    document.querySelector('body').appendChild(input);
    droplit = new Droplit(input);
  });

  afterEach(function() {
  	var divs = document.querySelectorAll('.droplit');
  	for (var i = divs.length - 1; i >= 0; i--) {
  		divs[i].parentNode.removeChild(divs[i]);
  	};
  	input.parentNode.removeChild(input);
  });

  it("Input should be hidden", function() {
    expect(input.style.display).toBe('none');
  });

  it("Should create a dropzone div", function() {
  	var divs = document.querySelectorAll('.droplit');
    expect(divs.length).toBe(1);
  });

  it("Should add class on hover", function() {
  	var div = document.querySelector('.droplit');
  	div.ondragover();
    expect(div.className).toMatch(/hover/);
  });

  it("Should remove class on mouseout", function() {
  	var div = document.querySelector('.droplit');
  	div.ondragoverend();
    expect(div.className).not.toMatch(/hover/);
  });



});