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
    var blockPhotoElement = document.createElement('div');

    blockPhotoElement.style.backgroundImage = 'url(' + content + ')';
    blockPhotoElement.style.backgroundSize = 'cover';
    blockPhotoElement.classList.add('ad-form__photo');

    housePreviewElement.remove();
    houseContainerElement.appendChild(blockPhotoElement);
  });

  var createPreviewChange = function (fileChooser, callback) {
    return function () {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.onloadend = function () {
          callback(reader.result);
        };

        reader.readAsDataURL(file);
      }
    };
  };

  var removePhotos = function () {
    var photoElements = document.querySelectorAll('.ad-form__photo');

    Array.prototype.forEach.call(photoElements, function (element) {
      element.remove();
    });
  };

  var createPhotoPlaceholder = function () {
    var blockPhotoDefaultElement = document.createElement('div');

    blockPhotoDefaultElement.classList.add('ad-form__photo');
    houseContainerElement.appendChild(blockPhotoDefaultElement);
  };

  var preventDefaultHandler = function (evt) {
    evt.preventDefault();
  };

  var onZoneMapDrop = createImageDropHandler(previewMapFileDrop);
  var onZoneHouseDrop = createImageDropHandler(previewHouseFileDrop);
  var onZoneMapDragover = preventDefaultHandler;
  var onZoneHouseDragover = preventDefaultHandler;

  var onWindowDragover = preventDefaultHandler;
  var onWindowDrop = preventDefaultHandler;

  var onPreviewMapFileChange = createPreviewChange(mapFileChooserElement, function (content) {
    mapPreviewElement.src = content;
  });

  var onPreviewHouseFileChange = createPreviewChange(houseFileChooserElement, function (content) {
    var photoElement = document.createElement('div');

    photoElement.style.backgroundImage = 'url(' + content + ')';
    photoElement.style.backgroundSize = 'cover';
    photoElement.classList.add('ad-form__photo');

    housePreviewElement.remove();
    houseContainerElement.appendChild(photoElement);
  });


  window.formPhoto = {
    activate: function () {
      housePreviewElement = document.querySelector('.ad-form__photo');

      dropZoneMapElement.addEventListener('drop', onZoneMapDrop);
      dropZoneHouseElement.addEventListener('drop', onZoneHouseDrop);
      dropZoneMapElement.addEventListener('dragover', onZoneMapDragover);
      dropZoneHouseElement.addEventListener('dragover', onZoneHouseDragover);

      mapFileChooserElement.addEventListener('change', onPreviewMapFileChange);
      houseFileChooserElement.addEventListener('change', onPreviewHouseFileChange);

      window.addEventListener('dragover', onWindowDragover);
      window.addEventListener('drop', onWindowDrop);
    },
    deactivate: function () {
      mapPreviewElement.src = DEFAULT_PHOTO;

      removePhotos();
      createPhotoPlaceholder();

      dropZoneMapElement.removeEventListener('drop', onZoneMapDrop);
      dropZoneHouseElement.removeEventListener('drop', onZoneHouseDrop);
      dropZoneMapElement.addEventListener('dragover', onZoneMapDragover);
      dropZoneHouseElement.addEventListener('dragover', onZoneHouseDragover);

      mapFileChooserElement.removeEventListener('change', onPreviewMapFileChange);
      houseFileChooserElement.removeEventListener('change', onPreviewHouseFileChange);

      window.removeEventListener('dragover', onWindowDragover);
      window.removeEventListener('drop', onWindowDrop);
    }
  };
})();
