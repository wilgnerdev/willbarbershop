const appUrl = 'https://sites.appbarber.com.br/willbarbershop';

document.querySelectorAll('.whatsapp-link').forEach((link) => {
  link.href = appUrl;
  link.target = '_blank';
  link.rel = 'noopener';
});

const testimonialData = [
  {
    quote: 'Melhor barbearia que já fui. O Will entende de corte como ninguém, sai de lá parecendo outra pessoa.',
    author: 'Lucas Pereira',
  },
  {
    quote: 'Atendimento impecável e o degradê ficou perfeito. Virei cliente fiel da Will Barber Shop.',
    author: 'Bruno Almeida',
  },
  {
    quote: 'Ambiente diferenciado, barbeiros que sabem o que fazem. Recomendo de olhos fechados.',
    author: 'Thiago Souza',
  },
];

const testimonialQuote = document.querySelector('.testimonial-copy blockquote');
const testimonialAuthor = document.querySelector('.testimonial-copy p');
const testimonialCopy = document.querySelector('.testimonial-copy');
const testimonialScore = document.querySelector('.score');
const prevTestimonialButton = document.querySelector('.testimonial-controls .circle-button[aria-label="Avaliação anterior"]');
const nextTestimonialButton = document.querySelector('.testimonial-controls .circle-button[aria-label="Próxima avaliação"]');
const progressItems = document.querySelectorAll('.progress-item');
let testimonialIndex = 0;

function renderTestimonial() {
  const current = testimonialData[testimonialIndex];

  testimonialCopy.classList.add('is-changing');
  testimonialScore.classList.add('is-changing');

  window.setTimeout(() => {
    testimonialQuote.textContent = current.quote;
    testimonialAuthor.textContent = `— ${current.author}`;
    testimonialScore.textContent = '5.0';
    progressItems.forEach((item, index) => item.classList.toggle('active', index === testimonialIndex));
    testimonialCopy.classList.remove('is-changing');
    testimonialScore.classList.remove('is-changing');
  }, 170);
}

function changeTestimonial(direction) {
  testimonialIndex = (testimonialIndex + direction + testimonialData.length) % testimonialData.length;
  renderTestimonial();
}

prevTestimonialButton?.addEventListener('click', () => changeTestimonial(-1));
nextTestimonialButton?.addEventListener('click', () => changeTestimonial(1));

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');
menuToggle?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  siteHeader?.classList.toggle('is-hidden', false);
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

let lastScrollY = window.scrollY;
let scrollTicking = false;

function updateHeaderVisibility() {
  const currentScrollY = window.scrollY;
  const menuIsOpen = navigation?.classList.contains('is-open');

  if (currentScrollY <= 8 || currentScrollY < lastScrollY || menuIsOpen) {
    siteHeader?.classList.remove('is-hidden');
  } else if (currentScrollY > lastScrollY) {
    siteHeader?.classList.add('is-hidden');
  }

  lastScrollY = currentScrollY;
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateHeaderVisibility);
    scrollTicking = true;
  }
}, { passive: true });

const galleryTrack = document.querySelector('.gallery-track');
const galleryCounter = document.querySelector('.counter b');
const galleryPrevious = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');
const galleryImages = Array.from({ length: 12 }, (_, index) => ({
  src: `assets/images/card-${index + 1}.avif`,
  alt: `Corte masculino da galeria ${index + 1}`,
  title: ['Degradê navalhado', 'Corte clássico na tesoura', 'Barba desenhada', 'Fade texturizado', 'Acabamento preciso', 'Corte social', 'Barba alinhada', 'Corte moderno', 'Degradê baixo', 'Navalha e estilo', 'Corte com volume', 'Visual completo'][index],
}));
let galleryIndex = 0;
let touchStartX = 0;
let galleryAnimation;

function getVisibleItems() {
  if (window.innerWidth <= 560) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function renderGallery() {
  galleryTrack.innerHTML = galleryImages.map((image, index) => `
    <figure class="gallery-item">
      <img src="${image.src}" alt="${image.alt}" loading="${index < 3 ? 'eager' : 'lazy'}">
      <figcaption>${image.title}</figcaption>
    </figure>
  `).join('');
}

function getGalleryOffset(index) {
  const galleryItems = [...galleryTrack.children];
  const visibleItems = getVisibleItems();
  const maxOffsetIndex = Math.max(0, galleryImages.length - visibleItems);
  const itemWidth = galleryItems[0]?.getBoundingClientRect().width || 0;
  const gap = parseFloat(getComputedStyle(galleryTrack).gap) || 0;
  return Math.min(index, maxOffsetIndex) * (itemWidth + gap);
}

function updateGallery(animate = true, fromIndex = galleryIndex) {
  const maxIndex = galleryImages.length - 1;
  const targetOffset = getGalleryOffset(galleryIndex);

  galleryAnimation?.cancel();
  galleryTrack.style.transition = 'none';
  galleryTrack.style.transform = `translateX(-${getGalleryOffset(fromIndex)}px)`;
  galleryCounter.textContent = String(galleryIndex + 1).padStart(2, '0');
  galleryPrevious.disabled = galleryIndex === 0;
  galleryNext.disabled = galleryIndex === maxIndex;
  galleryPrevious.setAttribute('aria-disabled', String(galleryPrevious.disabled));
  galleryNext.setAttribute('aria-disabled', String(galleryNext.disabled));

  if (animate && fromIndex !== galleryIndex) {
    galleryTrack.offsetWidth;
    galleryAnimation = galleryTrack.animate([
      { transform: `translateX(-${getGalleryOffset(fromIndex)}px)` },
      { transform: `translateX(-${targetOffset}px)` },
    ], { duration: 550, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
    galleryAnimation.onfinish = () => {
      galleryTrack.style.transform = `translateX(-${targetOffset}px)`;
      galleryAnimation = null;
    };
  }
}

function moveGallery(direction) {
  const previousIndex = galleryIndex;
  galleryIndex = Math.max(0, Math.min(galleryImages.length - 1, galleryIndex + direction));
  updateGallery(true, previousIndex);
}

galleryPrevious?.addEventListener('click', () => moveGallery(-1));
galleryNext?.addEventListener('click', () => moveGallery(1));
galleryTrack?.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
galleryTrack?.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 45) moveGallery(distance < 0 ? 1 : -1);
}, { passive: true });
window.addEventListener('resize', () => updateGallery(false));
renderGallery();
updateGallery(false);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
  revealObserver.observe(element);
});
