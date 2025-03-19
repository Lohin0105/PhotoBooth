// Element references
const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');
const retakeBtn = document.getElementById('retakeBtn');
const doneBtn = document.getElementById('doneBtn');
const countdownElem = document.getElementById('countdown');
const thumbnailsContainer = document.getElementById('thumbnails');

let capturedImages = [];
let stream = null;

// Start camera access
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.style.display = 'block';
      video.style.background = 'none';
      video.play();
    };
  } catch (error) {
    alert("Camera access denied or not available.");
    console.error("Error accessing camera:", error);
  }
}

// Countdown function
function runCountdown(seconds) {
  return new Promise((resolve) => {
    let counter = seconds;
    countdownElem.style.opacity = 1;
    countdownElem.innerText = counter;
    const interval = setInterval(() => {
      counter--;
      if (counter > 0) {
        countdownElem.innerText = counter;
      } else {
        clearInterval(interval);
        countdownElem.style.opacity = 0;
        resolve();
      }
    }, 1000);
  });
}

// Capture the current video frame
function captureFrame() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

// Add thumbnail image
function addThumbnail(imageData) {
  const img = document.createElement('img');
  img.src = imageData;
  thumbnailsContainer.appendChild(img);
}

// Capture button event
captureBtn.addEventListener('click', async () => {
  await runCountdown(3);
  const imageData = captureFrame();
  capturedImages.push(imageData);
  addThumbnail(imageData);

  if (capturedImages.length === 3) {
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'inline-block';
    doneBtn.style.display = 'inline-block';
  }
});

// Retake: reset process
retakeBtn.addEventListener('click', () => {
  capturedImages = [];
  thumbnailsContainer.innerHTML = '';
  captureBtn.style.display = 'inline-block';
  retakeBtn.style.display = 'none';
  doneBtn.style.display = 'none';
});

// ✅ Done: Stop camera, save images to localStorage, and redirect to edit page
doneBtn.addEventListener('click', () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  localStorage.setItem('editedImages', JSON.stringify(capturedImages));
  window.location.href = 'edit.html';
});

// Start the camera when the page loads
startCamera();
