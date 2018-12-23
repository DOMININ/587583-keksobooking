'use strict';

(function () {
  var DEFAULT_PHOTO = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var mapFileChooserElement = document.querySelector('.ad-form-header__input');
  var mapPreviewElement = document.querySelector('.ad-form-header__preview img');

  var houseFileChooserElement = document.querySelector('.ad-form__input');
  var housePreviewElement = document.querySelector('.ad-form__photo');
  var houseContainerElement = document.querySelector('.ad-form__photo-container');

  var dropZoneMapElement = document.querySelector('.ad-form-header__drop-zone');
  var dropZoneHouseElement = document.querySelector('.ad-form__drop-zone');

  var onZoneMapHouseDragoverDrop = function (evt) {
    evt.preventDefault();
  };

  var createPreviewDrop = function (callback) {
    return function (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        callback(reader.result);
      };
    };
  };

  var createImageDropHandler = function (previewImage) {
    return function (evt) {
      Array.from(evt.dataTransfer.files).forEach(previewImage);
    };
  };

  var previewMapFileDrop = createPreviewDrop(function (content) {
    mapPreviewElement.src = content;
  });

  var previewHouseFileDrop = createPreviewDrop(function (content) {
    housePreviewElement.remove();
    var blockPhoto = document.createElement('div');
    blockPhoto.style.backgroundImage = 'url(' + content + ')';
    blockPhoto.style.backgroundSize = 'cover';
    houseContainerElement.appendChild(blockPhoto).classList.add('ad-form__photo');
  });

  var onZoneMapDrop = createImageDropHandler(previewMapFileDrop);
  var onZoneHouseDrop = createImageDropHandler(previewHouseFileDrop);

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

  var onPreviewMapFileChange = createPreviewChange(mapFileChooserElement, function (content) {
    mapPreviewElement.src = content;
  });

  var onPreviewHouseFileChange = createPreviewChange(houseFileChooserElement, function (content) {
    housePreviewElement.remove();
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
      housePreviewElement = document.querySelector('.ad-form__photo');

      dropZoneMapElement.addEventListener('drop', onZoneMapHouseDragoverDrop);
      dropZoneHouseElement.addEventListener('drop', onZoneMapHouseDragoverDrop);
      dropZoneMapElement.addEventListener('dragover', onZoneMapHouseDragoverDrop);
      dropZoneHouseElement.addEventListener('dragover', onZoneMapHouseDragoverDrop);

      dropZoneMapElement.addEventListener('drop', onZoneMapDrop);
      dropZoneHouseElement.addEventListener('drop', onZoneHouseDrop);
      mapFileChooserElement.addEventListener('change', onPreviewMapFileChange);
      houseFileChooserElement.addEventListener('change', onPreviewHouseFileChange);
    },
    deactivate: function () {
      mapPreviewElement.src = DEFAULT_PHOTO;
      blocksPhotoRemove();

      dropZoneMapElement.removeEventListener('drop', onZoneMapDrop);
      dropZoneHouseElement.removeEventListener('drop', onZoneHouseDrop);
      mapFileChooserElement.removeEventListener('change', onPreviewMapFileChange);
      houseFileChooserElement.removeEventListener('change', onPreviewHouseFileChange);
    }
  };
})();
