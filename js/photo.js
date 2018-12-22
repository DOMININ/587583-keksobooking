'use strict';

(function () {
  var DEFAULT_PHOTO = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooserMapElement = document.querySelector('.ad-form-header__input');
  var previewMapElement = document.querySelector('.ad-form-header__preview img');

  // var fileChooserHouse = document.querySelector('.ad-form__input');
  // var previewHouse = document.querySelector('.ad-form__photo');

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

  window.photo = {
    activate: function () {
      fileChooserMapElement.addEventListener('change', onInputMapPhotoChange);
    },
    deactivate: function () {
      previewMapElement.src = DEFAULT_PHOTO;
      fileChooserMapElement.removeEventListener('change', onInputMapPhotoChange);
    }
  };
})();
