'use strict';

(function () {
  var DEFAULT_PHOTO = 'img/muffin-grey.svg';
  var FILE_EXTENSIONS = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarFileElement = document.querySelector('.ad-form-header__input');
  var avatarPreviewElement = document.querySelector('.ad-form-header__preview img');
  var avatarDropZoneElement = document.querySelector('.ad-form-header__drop-zone');

  var photoFileElement = document.querySelector('.ad-form__input');
  var photoContainerElement = document.querySelector('.ad-form__photo-container');
  var photoDropZoneElement = document.querySelector('.ad-form__drop-zone');
  var photoPlaceholderElement = document.querySelector('.ad-form__photo');

  var createDropFileReader = function (onLoad) {
    return function (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        onLoad(reader.result);
      };
    };
  };

  var createImageDropHandler = function (previewImage) {
    return function (evt) {
      Array.from(evt.dataTransfer.files).forEach(previewImage);
    };
  };

  var createPhotoElement = function (content) {
    var element = document.createElement('div');

    element.style.backgroundImage = 'url(' + content + ')';
    element.style.backgroundSize = 'cover';
    element.classList.add('ad-form__photo');

    return element;
  };

  var previewAvatarFileDrop = createDropFileReader(function (content) {
    avatarPreviewElement.src = content;
  });

  var previewPhotoFileDrop = createDropFileReader(function (content) {
    photoPlaceholderElement.remove();
    photoContainerElement.appendChild(
        createPhotoElement(content)
    );
  });

  var createPreviewChangeHandler = function (fileElement, onLoad) {
    return function () {
      var file = fileElement.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_EXTENSIONS.some(function (extension) {
        return fileName.endsWith(extension);
      });

      if (matches) {
        var reader = new FileReader();
        reader.onloadend = function () {
          onLoad(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  var removePhotos = function () {
    var elements = document.querySelectorAll('.ad-form__photo');

    Array.prototype.forEach.call(elements, function (element) {
      element.remove();
    });
  };

  var onAvatarFileChange = createPreviewChangeHandler(avatarFileElement, function (content) {
    avatarPreviewElement.src = content;
  });

  var onPhotoFileChange = createPreviewChangeHandler(photoFileElement, function (content) {
    var photoElement = document.createElement('div');

    photoElement.style.backgroundImage = 'url(' + content + ')';
    photoElement.style.backgroundSize = 'cover';
    photoElement.classList.add('ad-form__photo');

    photoPlaceholderElement.remove();
    photoContainerElement.appendChild(photoElement);
  });

  var preventEventHandler = function (evt) {
    evt.preventDefault();
  };

  var onAvatarZoneDrop = createImageDropHandler(previewAvatarFileDrop);
  var onAvatarZoneDragover = preventEventHandler;
  var onPhotoZoneDrop = createImageDropHandler(previewPhotoFileDrop);
  var onPhotoZoneDragover = preventEventHandler;
  var onWindowDragover = preventEventHandler;
  var onWindowDrop = preventEventHandler;

  window.formPhoto = {
    activate: function () {
      avatarDropZoneElement.addEventListener('drop', onAvatarZoneDrop);
      photoDropZoneElement.addEventListener('drop', onPhotoZoneDrop);
      avatarDropZoneElement.addEventListener('dragover', onAvatarZoneDragover);
      photoDropZoneElement.addEventListener('dragover', onPhotoZoneDragover);

      avatarFileElement.addEventListener('change', onAvatarFileChange);
      photoFileElement.addEventListener('change', onPhotoFileChange);

      window.addEventListener('dragover', onWindowDragover);
      window.addEventListener('drop', onWindowDrop);
    },
    deactivate: function () {
      avatarPreviewElement.src = DEFAULT_PHOTO;

      removePhotos();

      photoContainerElement.appendChild(photoPlaceholderElement);

      avatarDropZoneElement.removeEventListener('drop', onAvatarZoneDrop);
      photoDropZoneElement.removeEventListener('drop', onPhotoZoneDrop);
      avatarDropZoneElement.removeEventListener('dragover', onAvatarZoneDragover);
      photoDropZoneElement.removeEventListener('dragover', onPhotoZoneDragover);

      avatarFileElement.removeEventListener('change', onAvatarFileChange);
      photoFileElement.removeEventListener('change', onPhotoFileChange);

      window.removeEventListener('dragover', onWindowDragover);
      window.removeEventListener('drop', onWindowDrop);
    }
  };
})();
