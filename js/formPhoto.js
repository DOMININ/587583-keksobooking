'use strict';

(function () {
  var DEFAULT_PHOTO = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooserMapElement = document.querySelector('.ad-form-header__input');
  var previewMapElement = document.querySelector('.ad-form-header__preview img');

  var fileChooserHouseElement = document.querySelector('.ad-form__input');
  var previewHouseElement = document.querySelector('.ad-form__photo');
  var houseContainerElement = document.querySelector('.ad-form__photo-container');

  var dropZoneMapElement = document.querySelector('.ad-form-header__drop-zone');
  var dropZoneHouseElement = document.querySelector('.ad-form__drop-zone');

  var preventDefaults = function (evt) {
    evt.preventDefault();
  };

  ['dragover', 'drop'].forEach(function (eventName) {
    dropZoneMapElement.addEventListener(eventName, preventDefaults);
    dropZoneHouseElement.addEventListener(eventName, preventDefaults);
  });

  var createPreviewDrop = function (callback) {
    return function (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        callback(reader.result);
      };
    };
  };

  var createImageDropHandler = function (previewFile) {
    return function (evt) {
      Array.from(evt.dataTransfer.files).forEach(previewFile);
    };
  };

  var previewMapFileDrop = createPreviewDrop(function (content) {
    previewMapElement.src = content;
  });

  var previewHouseFileDrop = createPreviewDrop(function (content) {
    previewHouseElement.remove();
    var blockPhoto = document.createElement('div');
    blockPhoto.style.backgroundImage = 'url(' + content + ')';
    blockPhoto.style.backgroundSize = 'cover';
    houseContainerElement.appendChild(blockPhoto).classList.add('ad-form__photo');
  });

  var onMapZoneDrop = createImageDropHandler(previewMapFileDrop);
  var onHouseZoneDrop = createImageDropHandler(previewHouseFileDrop);

  var createPreviewChange = function (fileChooser, callback) {
    return function () {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          callback(reader.result);
        });

        reader.readAsDataURL(file);
      }
    };
  };

  var onPreviewMapFileChange = createPreviewChange(fileChooserMapElement, function (content) {
    previewMapElement.src = content;
  });

  var onPreviewHouseFileChange = createPreviewChange(fileChooserHouseElement, function (content) {
    previewHouseElement.remove();
    var blockPhoto = document.createElement('div');
    blockPhoto.style.backgroundImage = 'url(' + content + ')';
    blockPhoto.style.backgroundSize = 'cover';
    houseContainerElement.appendChild(blockPhoto).classList.add('ad-form__photo');
  });

  var blocksPhotoRemove = function () {
    var previewHouseElements = document.querySelectorAll('.ad-form__photo');
    var blockPhotoDefault = document.createElement('div');

    previewHouseElements.forEach(function (element) {
      element.remove();
    });

    houseContainerElement.appendChild(blockPhotoDefault).classList.add('ad-form__photo');
  };

  window.formPhoto = {
    activate: function () {
      previewHouseElement = document.querySelector('.ad-form__photo');

      dropZoneMapElement.addEventListener('drop', onMapZoneDrop);
      dropZoneHouseElement.addEventListener('drop', onHouseZoneDrop);
      fileChooserMapElement.addEventListener('change', onPreviewMapFileChange);
      fileChooserHouseElement.addEventListener('change', onPreviewHouseFileChange);
    },
    deactivate: function () {
      previewMapElement.src = DEFAULT_PHOTO;
      blocksPhotoRemove();

      dropZoneMapElement.removeEventListener('drop', onMapZoneDrop);
      dropZoneHouseElement.removeEventListener('drop', onHouseZoneDrop);
      fileChooserMapElement.removeEventListener('change', onPreviewMapFileChange);
      fileChooserHouseElement.removeEventListener('change', onPreviewHouseFileChange);
    }
  };
})();
