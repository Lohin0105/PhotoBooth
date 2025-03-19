const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');
const retakeBtn = document.getElementById('retakeBtn');
const doneBtn = document.getElementById('doneBtn');
const countdownElem = document.getElementById('countdown');
const thumbnailsContainer = document.getElementById('thumbnails');
const controls = document.querySelector('.controls');

let capturedImages = [];
let stream = null;

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

function captureFrame() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

function addThumbnail(imageData) {
  const img = document.createElement('img');
  img.src = imageData;
  thumbnailsContainer.appendChild(img);
}

captureBtn.addEventListener('click', async () => {
  await runCountdown(3);
  const imageData = captureFrame();
  capturedImages.push(imageData);
  addThumbnail(imageData);

  if (capturedImages.length === 3) {
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'inline-block';
    doneBtn.style.display = 'inline-block';
    setTimeout(() => {
      controls.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 300);
  }
});

retakeBtn.addEventListener('click', () => {
  capturedImages = [];
  thumbnailsContainer.innerHTML = '';
  captureBtn.style.display = 'inline-block';
  retakeBtn.style.display = 'none';
  doneBtn.style.display = 'none';
});

doneBtn.addEventListener('click', () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  localStorage.setItem('editedImages', JSON.stringify(capturedImages));
  window.location.href = 'edit.html';
});

startCamera();
