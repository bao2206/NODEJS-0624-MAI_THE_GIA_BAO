function initializeCKEditor(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    CKEDITOR.replace(element);
  });
}
