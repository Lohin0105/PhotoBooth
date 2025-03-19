// Element references
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const uploadBtn = document.getElementById('uploadBtn');
const retakeBtn = document.getElementById('retakeBtn');
const doneBtn = document.getElementById('doneBtn');
const thumbnailsContainer = document.getElementById('thumbnails');
const dropZone = document.getElementById('dropZone');

let uploadedImages = [];

// Function to handle files from input or drop
function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    if (uploadedImages.length >= 3) break; // Limit to 3 images total
    const file = files[i];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(event) {
        // Add image data URL to the array
        uploadedImages.push(event.target.result);
        // Add thumbnail preview
        addThumbnail(event.target.result);
        // Update the main preview image (shows the last one loaded)
        previewImage.src = event.target.result;
        previewImage.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }
  // If 3 images are reached, update UI controls
  if (uploadedImages.length >= 3) {
    uploadBtn.style.display = 'none';
    retakeBtn.style.display = 'inline-block';
    doneBtn.style.display = 'inline-block';
  }
}

// File input change event for multiple files
fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
});

// Drag and drop events on the drop zone
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#00cc00'; // Highlight on dragover
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#ff4d4d'; // Revert border color
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#ff4d4d'; // Revert border color
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
});

// Upload button click (for additional manual file selection)
uploadBtn.addEventListener('click', () => {
  // In case a preview image is present and not already added
  if (previewImage.src && !uploadedImages.includes(previewImage.src)) {
    uploadedImages.push(previewImage.src);
    addThumbnail(previewImage.src);
    previewImage.src = '';
    previewImage.style.display = 'none';
    fileInput.value = '';
  }
  // Update UI if three images are uploaded
  if (uploadedImages.length >= 3) {
    uploadBtn.style.display = 'none';
    retakeBtn.style.display = 'inline-block';
    doneBtn.style.display = 'inline-block';
  }
});

// Helper function to add a thumbnail image to the container
function addThumbnail(imageData) {
  const img = document.createElement('img');
  img.src = imageData;
  thumbnailsContainer.appendChild(img);
}

// Retake button: resets all uploaded images and UI
retakeBtn.addEventListener('click', () => {
  uploadedImages = [];
  thumbnailsContainer.innerHTML = '';
  uploadBtn.style.display = 'inline-block';
  retakeBtn.style.display = 'none';
  doneBtn.style.display = 'none';
  previewImage.src = '';
  previewImage.style.display = 'none';
  fileInput.value = '';
});

// Done button: Save images to localStorage and redirect to the editing page
doneBtn.addEventListener('click', () => {
  localStorage.setItem('editedImages', JSON.stringify(uploadedImages));
  window.location.href = 'edit.html';
});
