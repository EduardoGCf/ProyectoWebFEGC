const prevBtn = document.querySelector('.anterior__curso');
const nextBtn = document.querySelector('.siguiente__curso');
const carousel = document.querySelector('.Curso__list');

let scrollPosition = 0;

prevBtn.addEventListener('click', () => {
    scrollPosition -= carousel.offsetWidth;
    if (scrollPosition < 0) {
        scrollPosition = carousel.scrollWidth - carousel.offsetWidth;
    }
    carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
});

nextBtn.addEventListener('click', () => {
    scrollPosition += carousel.offsetWidth;
    if (scrollPosition >= carousel.scrollWidth) {
        scrollPosition = 0;
    }
    carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
});