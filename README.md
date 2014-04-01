WIP!

# DroplitJS

DroplitJS is a bare bones javascript library that is used to create drag-n-drop file upload modules.

## Is DroplitJS for me?

[Dropzone][1] is a great library for handling drag-n-drop file uploading. But I found it to be heavy handed and tedious in terms of changing its styling. DroplitJS, being bare bones, ships with no default styles at all. I have left the styling up to the developer using it. If you want a plug-n-play library to handle drag-n-drop file uploading, you should just go with [Dropzone][1], but if you are looking for an option that demands you create your own styling of it, this is for you!

## Usage

A DroplitJS droparea can be instantiated like this:

    var droplit = new Droplit("#my-droplit", { /* options */ });

If you are using jQuery you can instantiate it like this:

    $('#my-droplit').droplit({ /* options */ });

## Options

- `url`: (type: `String`, default: `null`) The url to which the upload request will be made.
- `method`: (type: `String`, default: `"post"`) The method to use for the upload request.
- `divClassName`: (type: `String`, default: `"droplit"`) The class name to use for the droparea div.
- `hoverClassName`: (type: `String`, default: `"hover"`) The class name that the droparea gets when the `dragover` event fires.
- `dropClassName`: (type: `String`, default: `"dropped"`) The class name that the droparea gets when the `drop` event fires.
- `showProgress`: (type: `String`, default: `true`) Show a progress bar (where supported).
- `acceptedTypes`: (type: `Array`, default: `[ 'image/png', 'image/jpeg', 'image/gif' ]`) File types that are allowed to be uploaded.
- `onDropAreaDragOver`: (type: `Function`, default: `undefined`) Callback function for `dragover` event.
- `onDropAreaDragLeave`: (type: `Function`, default: `undefined`) Callback function for `dragleave` event.
- `onDropAreaDrop`: (type: `Function`, default: `undefined`) Callback function for `drop` event.

## Caveats

1. I started writing this knowing nearly nothing about how to implement drag-n-drop file uploading. Consequently, there are some sections of code and concepts in here that I straight up stole from [enyo/dropzone](https://github.com/enyo/dropzone) and from [remy/html5demos][2]
2. This is still very much a work in progress. I haven't fully tested it. If something breaks, don't sue me, just open up an issue!

## TODO

- fix send data
- input onchange
- write css styling documentation

[1]: https://github.com/enyo/dropzone
[2]: https://github.com/remy/html5demos