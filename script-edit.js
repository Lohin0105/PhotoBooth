document.addEventListener('DOMContentLoaded', () => {
  let images = JSON.parse(localStorage.getItem('editedImages')) || [];
  const imagesInner = document.getElementById('imagesInner');
  const imagesBox = document.getElementById('imagesBox');
  const paddingColorInput = document.getElementById('paddingColor');
  const colorFilterSelect = document.getElementById('colorFilterSelect');
  const rotateSlider = document.getElementById('rotateSlider');
  const flipHorizontalCheckbox = document.getElementById('flipHorizontal');
  const flipVerticalCheckbox = document.getElementById('flipVertical');
  const brightnessSlider = document.getElementById('brightnessSlider');
  const contrastSlider = document.getElementById('contrastSlider');
  const saveBtn = document.getElementById('saveBtn');
  // ===== HAMBURGER MENU TOGGLE =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  // ===== NAVIGATION LINKS =====
  document.getElementById('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'main.html';
  });

  document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
  });
    
  
  // New controls
  const aspectRatioSelect = document.getElementById('aspectRatio');
  const saturationSlider = document.getElementById('saturationSlider');
  const exposureSlider = document.getElementById('exposureSlider');
  const advancedFilters = document.getElementById('advancedFilters');
  const frameSelect = document.getElementById('frameSelect');

  function updateImageStyles() {
      imagesInner.querySelectorAll('img').forEach(img => {
          const filters = [
              colorFilterSelect.value !== 'none' ? colorFilterSelect.value : '',
              `brightness(${brightnessSlider.value}%)`,
              `contrast(${contrastSlider.value}%)`,
              `saturate(${saturationSlider.value}%)`,
              `opacity(${Math.min(exposureSlider.value/100 + 0.5, 1)})`,
              advancedFilters.value !== 'none' ? advancedFilters.value : ''
          ].filter(Boolean).join(' ');

          img.style.filter = filters;
          img.style.transform = `rotate(${rotateSlider.value}deg) scale(${
              flipHorizontalCheckbox.checked ? -1 : 1
          }, ${
              flipVerticalCheckbox.checked ? -1 : 1
          })`;
      });
  }

  aspectRatioSelect.addEventListener('change', () => {
      const ratio = aspectRatioSelect.value;
      imagesInner.querySelectorAll('img').forEach(img => {
          img.dataset.aspect = ratio;
          img.style.objectFit = 'cover';
          const [width, height] = getAspectDimensions(ratio);
          img.style.width = `${width}px`;
          img.style.height = `${height}px`;
      });
  });

  frameSelect.addEventListener('change', () => {
      const frame = frameSelect.value;
      imagesInner.querySelectorAll('img').forEach(img => {
          img.className = '';
          if (frame !== 'none') img.classList.add(`frame-${frame}`);
      });
  });

  saveBtn.addEventListener('click', () => {
      const imgs = imagesInner.querySelectorAll('img');
      if (imgs.length === 0) {
          alert('No images to save.');
          return;
      }

      const padding = 10;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let totalHeight = padding;
      imgs.forEach(img => {
          totalHeight += parseInt(img.style.height || 300) + padding;
      });
      
      canvas.width = 300 + 2 * padding;
      canvas.height = totalHeight;
      ctx.fillStyle = paddingColorInput.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let y = padding;
      imgs.forEach((img) => {
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          const aspect = img.dataset.aspect || '1:1';
          const [width, height] = getAspectDimensions(aspect);
          
          tempCanvas.width = width;
          tempCanvas.height = height;
          
          tempCtx.save();
          tempCtx.filter = window.getComputedStyle(img).filter;
          tempCtx.translate(width/2, height/2);
          tempCtx.rotate((Math.PI / 180) * rotateSlider.value);
          tempCtx.scale(
              flipHorizontalCheckbox.checked ? -1 : 1,
              flipVerticalCheckbox.checked ? -1 : 1
          );
          tempCtx.translate(-width/2, -height/2);
          tempCtx.drawImage(img, 0, 0, width, height);
          tempCtx.restore();

          ctx.drawImage(tempCanvas, padding, y, width, height);
          y += height + padding;
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'photo-booth-collage.png';
      link.click();
  });

  function getAspectDimensions(aspect) {
      switch(aspect) {
          case '1:1': return [300, 300];
          case '4:3': return [300, 225];
          case '16:9': return [300, 169];
          default: return [300, 300];
      }
  }

  if (images.length === 0) {
      imagesInner.innerHTML = '<p>No images available for editing.</p>';
  } else {
      images.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.style.width = '300px';
          img.style.height = '300px';
          imagesInner.appendChild(img);
      });
      updateImageStyles();
  }

  paddingColorInput.addEventListener('input', (e) => {
      imagesBox.style.backgroundColor = e.target.value;
  });

  [colorFilterSelect, rotateSlider, flipHorizontalCheckbox, flipVerticalCheckbox,
   brightnessSlider, contrastSlider, saturationSlider, exposureSlider, advancedFilters]
      .forEach(control => control.addEventListener('input', updateImageStyles));
});
