'use strict';

(function () {
  var DEFAULT_PHOTO = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooserMapElement = document.querySelector('.ad-form-header__input');
  var previewMapElement = document.querySelector('.ad-form-header__preview img');

  // var fileChooserHouse = document.querySelector('.ad-form__input');
  // var previewHouse = document.querySelector('.ad-form__photo');

  var dropZoneElement = document.querySelector('.ad-form-header__drop-zone');

  var handleDrop = function (evt) {
    var dt = evt.dataTransfer;
    var files = dt.files;
    handleFiles(files);
  };

  var handleFiles = function (files) {
    files = Array.from(files);
    files.forEach(previewFile);
  };

  var previewFile = function (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      previewMapElement.src = reader.result;
    };
  };

  var photoUpload = function (fileChooser, preview) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var onInputMapPhotoChange = function () {
    photoUpload(fileChooserMapElement, previewMapElement);
  };

  window.formPhoto = {
    activate: function () {
      dropZoneElement.addEventListener('drop', handleDrop);
      fileChooserMapElement.addEventListener('change', onInputMapPhotoChange);
    },
    deactivate: function () {
      previewMapElement.src = DEFAULT_PHOTO;
      dropZoneElement.removeEventListener('drop', handleDrop);
      fileChooserMapElement.removeEventListener('change', onInputMapPhotoChange);
    }
  };
})();
