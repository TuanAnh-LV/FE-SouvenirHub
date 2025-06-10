export const tinymceConfig = {
  selector: '#tinymce', // Replace with your selector
  plugins: 'link image code',
  toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | link image | code',
  menubar: false,
  height: 300,
  images_upload_url: '/api/upload', // Adjust the URL for your image upload endpoint
  automatic_uploads: true,
  file_picker_types: 'image',
  file_picker_callback: (callback, value, meta) => {
    if (meta.filetype === 'image') {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.onchange = () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          callback(reader.result, { alt: file.name });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  },
};