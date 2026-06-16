const images = [
  {
    src:     'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85',
    title:   'Misty Forest Trail',
    category:'nature'
  },
  {
    src:     'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=85',
    title:   'Tokyo at Dusk',
    category:'city'
  },
  {
    src:     'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=85',
    title:   'Turquoise Horizon',
    category:'ocean'
  },
  {
    src:     'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=85',
    title:   'Golden Hour Meadow',
    category:'nature'
  },
  {
    src:     'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85',
    title:   'Rainy Street, Paris',
    category:'city'
  },
  {
    src:     'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=1200&q=85',
    title:   'Storm Surge',
    category:'ocean'
  },
  {
    src:     'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1200&q=85',
    title:   'Snowy Pine Ridge',
    category:'nature'
  },
  {
    src:     'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=1200&q=85',
    title:   'New York Dawn',
    category:'city'
  },
  {
    src:     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',
    title:   'Lone Surfer',
    category:'ocean'
  }
];


const lightbox     = document.getElementById('lightbox');
const lbImage      = document.getElementById('lbImage');
const lbTitle      = document.getElementById('lbTitle');
const lbTag        = document.getElementById('lbTag');
const lbCounter    = document.getElementById('lbCounter');
const lbPrev       = document.getElementById('lbPrev');
const lbNext       = document.getElementById('lbNext');
const lbClose      = document.getElementById('lbClose');
const lbBackdrop   = document.getElementById('lightboxBackdrop');
const noResults    = document.getElementById('noResults');


let currentIndex    = -1;
let visibleIndices  = images.map((_, i) => i); 


function openLightbox(index) {
  currentIndex = index;
  const photo = images[index];

  lbImage.classList.add('loading');

  lbImage.onload = () => lbImage.classList.remove('loading');

  lbImage.src = photo.src;
  lbImage.alt = photo.title;

  lbTitle.textContent = photo.title;
  lbTag.textContent   = photo.category.charAt(0).toUpperCase()
                        + photo.category.slice(1); 
  lbTag.dataset.cat   = photo.category;

  const posInVisible = visibleIndices.indexOf(index);
  lbCounter.textContent =
    `${posInVisible + 1} / ${visibleIndices.length}`;

  lbPrev.disabled = (posInVisible === 0);
  lbNext.disabled = (posInVisible === visibleIndices.length - 1);

  lightbox.classList.add('active');

  lbClose.focus();

  
  document.body.style.overflow = 'hidden';
}


function closeLightbox() {
  lightbox.classList.remove('active');
  currentIndex = -1;
  document.body.style.overflow = '';  
}


function showPrev() {
  const pos = visibleIndices.indexOf(currentIndex);
  if (pos > 0) openLightbox(visibleIndices[pos - 1]);
}

function showNext() {
  const pos = visibleIndices.indexOf(currentIndex);
  if (pos < visibleIndices.length - 1) openLightbox(visibleIndices[pos + 1]);
}


lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  showPrev);
lbNext.addEventListener('click',  showNext);

lbBackdrop.addEventListener('click', closeLightbox);

const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(function(card) {


  card.addEventListener('click', function() {
    const index = parseInt(card.dataset.index, 10);
    openLightbox(index);
  });


  card.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();        
      const index = parseInt(card.dataset.index, 10);
      openLightbox(index);
    }
  });

});


document.addEventListener('keydown', function(event) {

  
  if (!lightbox.classList.contains('active')) return;

  if (event.key === 'Escape')      closeLightbox();
  if (event.key === 'ArrowLeft')   showPrev();
  if (event.key === 'ArrowRight')  showNext();
});


const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(function(btn) {

  btn.addEventListener('click', function() {

    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;  

    visibleIndices = []; 

    galleryItems.forEach(function(card) {
      const cat   = card.dataset.category;   
      const idx   = parseInt(card.dataset.index, 10);
      const match = (filter === 'all' || cat === filter);

      if (match) {
        card.classList.remove('hidden');
        visibleIndices.push(idx);
      } else {
        card.classList.add('hidden');
      }
    });

    if (visibleIndices.length === 0) {
      noResults.classList.add('visible');
    } else {
      noResults.classList.remove('visible');
    }
  });

});


let touchStartX = 0;

lightbox.addEventListener('touchstart', function(e) {
  
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', function(e) {
  const touchEndX = e.changedTouches[0].clientX;
  const delta = touchStartX - touchEndX;  

  if (Math.abs(delta) > 50) {
    if (delta > 0) showNext();  
    else           showPrev();  
  }
}, { passive: true });


