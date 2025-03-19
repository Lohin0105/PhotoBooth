document.addEventListener('DOMContentLoaded', () => {
    // Retrieve stored images (as an array of data URLs or image URLs)
    let images = JSON.parse(localStorage.getItem('editedImages')) || [];
    
    // Get DOM elements
    const imagesInner = document.getElementById('imagesInner');
    const imagesBox = document.getElementById('imagesBox'); // Added
    const paddingColorInput = document.getElementById('paddingColor');
    const colorFilterSelect = document.getElementById('colorFilterSelect');
    const rotateSlider = document.getElementById('rotateSlider');
    const flipHorizontalCheckbox = document.getElementById('flipHorizontal');
    const flipVerticalCheckbox = document.getElementById('flipVertical');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const contrastSlider = document.getElementById('contrastSlider');
    const saturationSlider = document.getElementById('saturationSlider');
    const exposureSlider = document.getElementById('exposureSlider');
    const advancedFilters = document.getElementById('advancedFilters');
    const aspectRatioSelect = document.getElementById('aspectRatio');
    const frameSelect = document.getElementById('frameSelect');
    const saveBtn = document.getElementById('saveBtn');
    const resolutionSelect = document.getElementById('resolution');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    // Padding Color Handler (Added)
    paddingColorInput.addEventListener('input', (e) => {
      imagesBox.style.setProperty('--padding-color', e.target.value);
      imagesBox.style.backgroundColor = e.target.value;
    });

    // Hamburger menu toggle
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  
    // Navigation handlers
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
  
    // Function to update image styles in the preview
    const updateImageStyles = () => {
      imagesInner.querySelectorAll('img').forEach(img => {
        const filters = [
          colorFilterSelect.value !== 'none' ? colorFilterSelect.value : '',
          `brightness(${brightnessSlider.value}%)`,
          `contrast(${contrastSlider.value}%)`,
          `saturate(${saturationSlider.value}%)`,
          `opacity(${Math.min(exposureSlider.value / 100 + 0.5, 1)})`,
          advancedFilters.value !== 'none' ? advancedFilters.value : ''
        ].filter(Boolean).join(' ');
        img.style.filter = filters;
        img.style.transform = `rotate(${rotateSlider.value}deg) scale(${flipHorizontalCheckbox.checked ? -1 : 1}, ${flipVerticalCheckbox.checked ? -1 : 1})`;
      });
    };
  
    // Handle aspect ratio changes in the preview
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
  
    // Handle frame selection in the preview
    frameSelect.addEventListener('change', () => {
      const frame = frameSelect.value;
      imagesInner.querySelectorAll('img').forEach(img => {
        img.className = '';
        if (frame !== 'none') img.classList.add(`frame-${frame}`);
      });
    });
  
    // Save handler with dynamic padding added for canvas export
    saveBtn.addEventListener('click', () => {
      const imgs = imagesInner.querySelectorAll('img');
      if (imgs.length === 0) {
        alert('No images to save.');
        return;
      }
  
      // Use the resolutionSelect value to determine scaling factor
      const selectedResolution = parseInt(resolutionSelect.value);
      const scaleFactor = selectedResolution / 720; // 720p is our base resolution
      const padding = 10 * scaleFactor; // Dynamic padding based on resolution
  
      // Calculate canvas dimensions
      let totalHeight = padding; // start with top padding
      imgs.forEach(img => {
        const aspect = img.dataset.aspect || '1:1';
        const [_, height] = getAspectDimensions(aspect);
        totalHeight += (height * scaleFactor) + padding; // add image height plus bottom padding for each image
      });
      const [width] = getAspectDimensions(imgs[0].dataset.aspect || '1:1');
      const canvasWidth = (width * scaleFactor) + (2 * padding);
      const canvasHeight = totalHeight;
  
      console.log(`Canvas dimensions: ${canvasWidth}x${canvasHeight}, scaleFactor: ${scaleFactor}, padding: ${padding}`);
  
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
  
      // Fill entire canvas with padding color (Modified)
      ctx.fillStyle = getComputedStyle(imagesBox).backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Draw each image with padding offset
      let y = padding;
      imgs.forEach((img) => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const aspect = img.dataset.aspect || '1:1';
        const [baseWidth, baseHeight] = getAspectDimensions(aspect);
  
        // Set dimensions for the temporary canvas (scaled)
        tempCanvas.width = baseWidth * scaleFactor;
        tempCanvas.height = baseHeight * scaleFactor;
  
        // Apply transformations and draw the image on the temporary canvas
        tempCtx.save();
        tempCtx.filter = window.getComputedStyle(img).filter;
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate((Math.PI / 180) * rotateSlider.value);
        tempCtx.scale(
          flipHorizontalCheckbox.checked ? -1 : 1,
          flipVerticalCheckbox.checked ? -1 : 1
        );
        tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.restore();
  
        // Draw the temporary canvas onto the main canvas with left padding offset
        ctx.drawImage(tempCanvas, padding, y, tempCanvas.width, tempCanvas.height);
        y += tempCanvas.height + padding;
      });
  
      // Create download link for the final image
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.download = `photo-booth-${selectedResolution}p.jpg`;
      link.click();
    });
  
    // Helper function to return dimensions for given aspect ratio
    const getAspectDimensions = (aspect) => {
      switch(aspect) {
        case '1:1': return [300, 300];
        case '4:3': return [300, 225];
        case '16:9': return [300, 169];
        default: return [300, 300];
      }
    };
  
    // Initial image load for preview
    if (images.length === 0) {
      imagesInner.innerHTML = '<p>No images available for editing.</p>';
    } else {
      images.forEach(src => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          // Set preview dimensions (CSS can also add padding if desired)
          img.style.width = '300px';
          img.style.height = '300px';
          img.style.objectFit = 'cover';
          updateImageStyles(); // Apply initial filter styles
        };
        img.onerror = () => {
          console.error('Failed to load image:', src);
        };
        img.src = src;
        imagesInner.appendChild(img);
      });
    }
  
    // Update image styles when controls change
    [
      colorFilterSelect, rotateSlider, flipHorizontalCheckbox,
      flipVerticalCheckbox, brightnessSlider, contrastSlider,
      saturationSlider, exposureSlider, advancedFilters
    ].forEach(control => control.addEventListener('input', updateImageStyles));
  
    // Also update when aspect ratio or frame selection changes
    aspectRatioSelect.addEventListener('change', updateImageStyles);
    frameSelect.addEventListener('change', updateImageStyles);
  });
