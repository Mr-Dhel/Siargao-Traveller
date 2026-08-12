document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
  toggle.addEventListener('click', (event) => {
    event.preventDefault();

    const parent = toggle.closest('.has-dropdown');
    if (!parent) return;

    document.querySelectorAll('.has-dropdown.open').forEach((item) => {
      if (item !== parent) item.classList.remove('open');
    });

    parent.classList.toggle('open');
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown.open').forEach((item) => {
      item.classList.remove('open');
    });
  }
});

const productImages = document.querySelectorAll('.marketplace-page .product-card.small img');

if (productImages.length) {
  let activeGallery = [];
  let activeImageIndex = 0;
  const fallbackGalleryImages = [
    '../assets/images/ai1.png',
    '../assets/images/ai2.png',
    '../assets/images/ai3.png',
  ];
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <button class="image-lightbox-close" type="button" aria-label="Close image preview">&times;</button>
    <button class="image-lightbox-arrow image-lightbox-prev" type="button" aria-label="Previous image">&#8249;</button>
    <div class="image-lightbox-frame">
      <img src="" alt="">
      <p class="image-lightbox-caption"></p>
      <p class="image-lightbox-count"></p>
    </div>
    <button class="image-lightbox-arrow image-lightbox-next" type="button" aria-label="Next image">&#8250;</button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.image-lightbox-caption');
  const lightboxCount = lightbox.querySelector('.image-lightbox-count');
  const closeButton = lightbox.querySelector('.image-lightbox-close');
  const previousButton = lightbox.querySelector('.image-lightbox-prev');
  const nextButton = lightbox.querySelector('.image-lightbox-next');

  const getThreeImageGallery = (image) => {
    const gallery = image.dataset.gallery
      ? image.dataset.gallery.split(',').map((item) => item.trim()).filter(Boolean)
      : [image.getAttribute('src'), ...fallbackGalleryImages];

    return [...new Set(gallery)].slice(0, 3);
  };

  const showGalleryImage = (index) => {
    const totalImages = activeGallery.length;
    if (!totalImages) return;

    activeImageIndex = (index + totalImages) % totalImages;
    lightboxImage.src = activeGallery[activeImageIndex];
    lightboxCount.textContent = `${activeImageIndex + 1} / ${totalImages}`;
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
    lightboxImage.alt = '';
    activeGallery = [];
    activeImageIndex = 0;
  };

  const openLightbox = (image) => {
    const cardTitle = image.closest('.product-card')?.querySelector('h3')?.textContent.trim();

    activeGallery = getThreeImageGallery(image);
    lightboxImage.alt = image.alt || cardTitle || 'Product image';
    lightboxCaption.textContent = cardTitle || image.alt || '';
    showGalleryImage(0);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };

  productImages.forEach((image) => {
    image.classList.add('clickable-product-image');
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Enlarge ${image.alt || 'product image'}`);

    image.addEventListener('click', () => openLightbox(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => showGalleryImage(activeImageIndex - 1));
  nextButton.addEventListener('click', () => showGalleryImage(activeImageIndex + 1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }

    if (event.key === 'ArrowLeft' && lightbox.classList.contains('is-open')) {
      showGalleryImage(activeImageIndex - 1);
    }

    if (event.key === 'ArrowRight' && lightbox.classList.contains('is-open')) {
      showGalleryImage(activeImageIndex + 1);
    }
  });
}
