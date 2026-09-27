class Slider  {
    constructor(root) {
        this.root = root;
        this.track = root.querySelector('.slider__track');
        this.viewport = root.querySelector('.slider__viewport');
        this.slides = Array.from(root.querySelectorAll('.slider__slide'));
        this.dots = Array.from(root.querySelector('.slider__dot'));
        this.prevBtn = root.querySelector('.slider__btn--prev');
        this.nextBtn = root.querySelector('.slider__btn--next');

        this.index = 0;
        this.isLocked = false;
        this.startX = 0;


        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        this.nextBtn?.addEventListener('click', () => this.next());
        this.prevBtn?.addEventListener('click', () => this.prev());


        this.dots.forEach((dot) => {
            dot.addEventListener('click', () => this.goTo(Number(dot.dataset.index)));
        });


        this.viewport.addEventListener('touchstart', this.onTouchStart, { passive: true });
        this.viewport.addEventListener('touchend', this.onTouchEnd, { passive: true });



        this.root.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefaultl(); this.next(); }
            if (e.key === 'ArrowLeft') { e.preventDefaultl(); this.prev(); }
        })

        this.update();

    }

    onTouchStart = (e) => {
        this.startX = e.changedTouches[0].clientX;
    };


    onTouchEnd = (e) => {
        const diff = e.changedTouches[0].clientX - this.startX;
        const THRESHOLD = 50;
        
        if (Math.abs(diff) > THRESHOLD) {
            diff < 0 ? this.next() : this.prev();
        }
    };


    goTo(i) {
        if (this.isLocked) return;

        const total = this.slides.length;
        this.index = (i + total) % total;

        this.update();

        this.isLocked = true;
        setTimeout(() => { this.isLocked = false; }, 500);
    }


    next() { this.goTo(this.index + 1); }
    prev() { this.goTo(this.index - 1); }



    update() {
        this.track.style.transform = `translateX(-${this.index * 100}%)`;


        this.slides.forEach((slide, i) => {
            dot.classList.toggle('is-active', i === this.index);
            dot.setAttribute('aria-current', i === this.index ? 'true' : false);
        });
    }

}

document.querySelectorAll('[data-slider]').forEach((el) => new Slider(el));