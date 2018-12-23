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

  ['dragover', 'dragleave', 'drop'].forEach(function (eventName) {
    document.body.addEventListener(eventName, preventDefaults);
  });

  var onMapZoneDrop = function (evt) {
    var dt = evt.dataTransfer;
    var files = dt.files;
    files = Array.from(files);
    files.forEach(previewMapFile);
  };

  var previewMapFile = function (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      previewMapElement.src = reader.result;
    };
  };

  var onHouseZoneDrop = function (evt) {
    var dt = evt.dataTransfer;
    var files = dt.files;
    files = Array.from(files);
    files.forEach(previewHouseFile);
  };

  var previewHouseFile = function (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      previewHouseElement.remove();
      var blockPhoto = document.createElement('div');
      blockPhoto.style.backgroundImage = 'url(' + reader.result + ')';
      blockPhoto.style.backgroundSize = 'cover';
      houseContainerElement.appendChild(blockPhoto).classList.add('ad-form__photo');
    };
  };

  var photoMapUpload = function (fileChooser, preview) {
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

  var photoHouseUpload = function (fileChooser) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewHouseElement.remove();
        var blockPhoto = document.createElement('div');
        blockPhoto.style.backgroundImage = 'url(' + reader.result + ')';
        blockPhoto.style.backgroundSize = 'cover';
        houseContainerElement.appendChild(blockPhoto).classList.add('ad-form__photo');
      });

      reader.readAsDataURL(file);
    }
  };

  var onInputMapPhotoChange = function () {
    photoMapUpload(fileChooserMapElement, previewMapElement);
  };

  var onInputHousePhotoChange = function () {
    photoHouseUpload(fileChooserHouseElement);
  };

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
      dropZoneMapElement.addEventListener('drop', onMapZoneDrop);
      dropZoneHouseElement.addEventListener('drop', onHouseZoneDrop);
      fileChooserMapElement.addEventListener('change', onInputMapPhotoChange);
      fileChooserHouseElement.addEventListener('change', onInputHousePhotoChange);
    },
    deactivate: function () {
      previewMapElement.src = DEFAULT_PHOTO;
      blocksPhotoRemove();
      dropZoneMapElement.removeEventListener('drop', onMapZoneDrop);
      dropZoneHouseElement.removeEventListener('drop', onHouseZoneDrop);
      fileChooserMapElement.removeEventListener('change', onInputMapPhotoChange);
      fileChooserHouseElement.removeEventListener('change', onInputHousePhotoChange);
    }
  };
})();
