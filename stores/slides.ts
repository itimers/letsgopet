import { defineStore } from 'pinia';
interface Slide {
    id: number;
    position: number;
    title: string;
    subtitle: string;
    description: string;
    active: boolean;
    duration: number;
    visibility: boolean;
}
interface Card {
    id: number;
    position: number;
    title: string;
    subtitle: string;
    description: string;
    active: boolean;
    duration: number;
    visibility: boolean;
}

export const useSlidesStore = defineStore('slides', {
    state: () => ({
        currentSlide: 1,
        currentCard: 1,
        currentDot: 0,

        activeSlideOn: 7,
        activeCardOn: 7,
        activeDotOn: 3,


        widthOfCardWrapper: 0,
        widthOfSlideWrapper: 0,
        cardWidths: [] as number[],


        maxCards: 6,
        minCards: 1,
        maxSlides: 2,
        minSlides: 2,

        closedSlider: true,
        closedCards: true,

        direction: "next",

        isSynced: true,
        isMobile: false,

        isPaused: false,
        isAnimating: false,
        slideDelay: 300 as number,
        remainingTime: 0,
        slideInterval: undefined as number | undefined,
        countdownTimer: undefined as number | undefined,
        isProgressBarUsing: false,
        progressBar: null as HTMLElement | null,
        progressBarWidth: "0%",
        progressBarTime: "0",

        isProgrammaticControl: false,

        touchStartX: null as number | null,
        touchEndX: null as number | null,
        touchStop: false,
        isManuallyPaused: false,

        longPressTimeout: null as number | null,
        isLongPress: false,
        longPressDuration: 500,
        clickTimeout: null as number | null,
        isDragging: false,
        clickDuration: 90,
        dragThreshold: 50,
        wasPausedByDrag: false,
        dragOffset: 0,
        dragOffsetSlides: 0, // For tracking the current drag offset for slides
        dragOffsetCards: 0,
        isDraggingCards: false,

        dots: [
            {
                id: "slide-1",
            },
            {
                id: "slide-2",
            },
            {
                id: "slide-3",
            },
            {
                id: "slide-4",
            },
            {
                id: "slide-5",
            },
            {
                id: "slide-6",
            },
            {
                id: "slide-7",
            },
            {
                id: "slide-8",
            },
            {
                id: "slide-9",
            },
            {
                id: "slide-10",
            },
            {
                id: "slide-11",
            },
            {
                id: "slide-12",
            },
            {
                id: "slide-13",
            },
            {
                id: "slide-14",
            },
            {
                id: "slide-15",
            },
        ] as Array<{ id: string; }>,
        mdots: [
            { id: 1, position: 0, active: false, duration: 2000, visibility: true },
            { id: 2, position: 1, active: true, duration: 2000, visibility: true },
            { id: 3, position: 2, active: false, duration: 2000, visibility: true },
            { id: 4, position: 3, active: false, duration: 2000, visibility: true },
            { id: 5, position: 4, active: false, duration: 2000, visibility: false },
            { id: 6, position: 5, active: false, duration: 2000, visibility: false },
            { id: 7, position: 6, active: false, duration: 2000, visibility: false },
            { id: 8, position: 7, active: false, duration: 2000, visibility: false },
            { id: 9, position: 8, active: false, duration: 2000, visibility: false },
            { id: 10, position: 9, active: false, duration: 2000, visibility: true },
            { id: 11, position: 10, active: false, duration: 2000, visibility: true },
            { id: 12, position: 11, active: false, duration: 2000, visibility: true },
            { id: 13, position: 12, active: false, duration: 2000, visibility: true },
            { id: 14, position: 13, active: false, duration: 2000, visibility: true },
            { id: 15, position: 14, active: false, duration: 2000, visibility: true },
        ],
        slidesOriginal: [] as Slide[],
        slides: [] as Slide[],
        cardsOriginal: [] as Card[],
        cards: [] as Card[],
    }),
    getters: {
        visibleSlides: (state) => state.slides.filter(slide => slide.visibility),
        visibleCards: (state) => state.cards.filter(card => card.visibility),
        visibleDots: (state) => state.mdots.filter(dot => dot.visibility),
        currentSlideTime: (state) => {
            return state.slides[state.activeSlideOn]?.duration ?? 5000;
        },
        currentActiveSlide: (state) => {
            const activeSlide = state.slides.find(slide => slide.active);
            return activeSlide ? `slide-${activeSlide.id}` : "";
        },
        currentActiveCard: (state) => {
            const activeCard = state.cards.find(card => card.active);
            return activeCard ? `card-${activeCard.id}` : "";
        },
        currentSlideIndex: (state) => {
            const currSlide = state.slides.find(slide => slide.active);
            return currSlide ? currSlide.id : 0;
        },
        currentCardIndex: (state) => {
            const currCard = state.cards.find(card => card.active);
            return currCard ? currCard.id : 0;
        },
        currentDots: (state) => {
            return state.slides.map(slide => ({
                id: `slide-${slide.id}`
            }));
        },
    },
    actions: {

        initializeSlides() {
            const $i18n = useNuxtApp().$i18n;
            this.slides = [
                { id: 1, position: 0, title: $i18n.t("slide1-h"), subtitle: $i18n.t("slide1-sh"), description: $i18n.t("slide1-des"), active: false, duration: 2000, visibility: false },
                { id: 2, position: 1, title: $i18n.t("slide2-h"), subtitle: $i18n.t("slide2-sh"), description: $i18n.t("slide2-des"), active: false, duration: 2000, visibility: false },
                { id: 3, position: 2, title: $i18n.t("slide3-h"), subtitle: $i18n.t("slide3-sh"), description: $i18n.t("slide3-des"), active: false, duration: 2000, visibility: false },
                { id: 4, position: 3, title: $i18n.t("slide4-h"), subtitle: $i18n.t("slide4-sh"), description: $i18n.t("slide4-des"), active: false, duration: 2000, visibility: false },
                { id: 5, position: 4, title: $i18n.t("slide5-h"), subtitle: $i18n.t("slide5-sh"), description: $i18n.t("slide5-des"), active: false, duration: 2000, visibility: false },
                { id: 6, position: 5, title: $i18n.t("slide6-h"), subtitle: $i18n.t("slide6-sh"), description: $i18n.t("slide6-des"), active: false, duration: 2000, visibility: false },
                { id: 7, position: 6, title: $i18n.t("slide7-h"), subtitle: $i18n.t("slide7-sh"), description: $i18n.t("slide7-des"), active: false, duration: 2000, visibility: false },
                { id: 8, position: 7, title: $i18n.t("slide8-h"), subtitle: $i18n.t("slide8-sh"), description: $i18n.t("slide8-des"), active: true, duration: 2000, visibility: true },
                { id: 9, position: 8, title: $i18n.t("slide9-h"), subtitle: $i18n.t("slide9-sh"), description: $i18n.t("slide9-des"), active: false, duration: 2000, visibility: false },
                { id: 10, position: 9, title: $i18n.t("slide10-h"), subtitle: $i18n.t("slide10-sh"), description: $i18n.t("slide10-des"), active: false, duration: 2000, visibility: false },
                { id: 11, position: 10, title: $i18n.t("slide10-h"), subtitle: $i18n.t("slide10-sh"), description: $i18n.t("slide10-des"), active: false, duration: 2000, visibility: false },
                { id: 12, position: 11, title: $i18n.t("slide10-h"), subtitle: $i18n.t("slide10-sh"), description: $i18n.t("slide10-des"), active: false, duration: 2000, visibility: false },
                { id: 13, position: 12, title: $i18n.t("slide10-h"), subtitle: $i18n.t("slide10-sh"), description: $i18n.t("slide10-des"), active: false, duration: 2000, visibility: false },
                { id: 14, position: 13, title: $i18n.t("slide10-h"), subtitle: $i18n.t("slide10-sh"), description: $i18n.t("slide10-des"), active: false, duration: 2000, visibility: false },
                { id: 15, position: 14, title: $i18n.t("slide10-h"), subtitle: $i18n.t("slide10-sh"), description: $i18n.t("slide10-des"), active: false, duration: 2000, visibility: false },
            ];
            this.slidesOriginal = [...this.slides];
        },
        initializeCards() {
            const $i18n = useNuxtApp().$i18n;
            this.cards = [
                { id: 1, position: 0, title: $i18n.t("card1-h"), subtitle: $i18n.t("card1-sh"), description: $i18n.t("card1-des"), active: false, duration: 2000, visibility: false },
                { id: 2, position: 1, title: $i18n.t("card2-h"), subtitle: $i18n.t("card2-sh"), description: $i18n.t("card2-des"), active: false, duration: 2000, visibility: false },
                { id: 3, position: 2, title: $i18n.t("card3-h"), subtitle: $i18n.t("card3-sh"), description: $i18n.t("card3-des"), active: false, duration: 2000, visibility: false },
                { id: 4, position: 3, title: $i18n.t("card4-h"), subtitle: $i18n.t("card4-sh"), description: $i18n.t("card4-des"), active: false, duration: 2000, visibility: false },
                { id: 5, position: 4, title: $i18n.t("card5-h"), subtitle: $i18n.t("card5-sh"), description: $i18n.t("card5-des"), active: false, duration: 2000, visibility: false },
                { id: 6, position: 5, title: $i18n.t("card6-h"), subtitle: $i18n.t("card6-sh"), description: $i18n.t("card6-des"), active: false, duration: 2000, visibility: false },
                { id: 7, position: 6, title: $i18n.t("card7-h"), subtitle: $i18n.t("card7-sh"), description: $i18n.t("card7-des"), active: false, duration: 2000, visibility: false },
                { id: 8, position: 7, title: $i18n.t("card8-h"), subtitle: $i18n.t("card8-sh"), description: $i18n.t("card8-des"), active: true, duration: 2000, visibility: true },
                { id: 9, position: 8, title: $i18n.t("card9-h"), subtitle: $i18n.t("card9-sh"), description: $i18n.t("card9-des"), active: false, duration: 2000, visibility: false },
                { id: 10, position: 9, title: $i18n.t("card10-h"), subtitle: $i18n.t("card10-sh"), description: $i18n.t("card10-des"), active: false, duration: 2000, visibility: false },
                { id: 11, position: 10, title: $i18n.t("card10-h"), subtitle: $i18n.t("card10-sh"), description: $i18n.t("card10-des"), active: false, duration: 2000, visibility: false },
                { id: 12, position: 11, title: $i18n.t("card10-h"), subtitle: $i18n.t("card10-sh"), description: $i18n.t("card10-des"), active: false, duration: 2000, visibility: false },
                { id: 13, position: 12, title: $i18n.t("card10-h"), subtitle: $i18n.t("card10-sh"), description: $i18n.t("card10-des"), active: false, duration: 2000, visibility: false },
                { id: 14, position: 13, title: $i18n.t("card10-h"), subtitle: $i18n.t("card10-sh"), description: $i18n.t("card10-des"), active: false, duration: 2000, visibility: false },
                { id: 15, position: 14, title: $i18n.t("card10-h"), subtitle: $i18n.t("card10-sh"), description: $i18n.t("card10-des"), active: false, duration: 2000, visibility: false },
            ];
            this.cardsOriginal = [...this.cards];
        },

        setWidthCardWrapper(width: number) {
            this.widthOfCardWrapper = width
        },
        setWidthSliderWrapper(width: number) {
            this.widthOfSlideWrapper = width
        },
        setWidthOfCards(width: number[]) {
            this.cardWidths = width
        },
        calculateWidthsCards() {
            const cardElements = document.querySelectorAll('.card');
            if (cardElements.length > 0) {
                const widths: number[] = [];
                cardElements.forEach((card: Element) => {
                    widths.push((card as HTMLElement).offsetWidth);
                });
                this.setWidthOfCards(widths);
            }
        },
        /*updateCurrentSlide() {
            /~ const currSlide = this.slides.find(slide => slide.active);
            this.currentSlide = currSlide ? currSlide.id : 0; ~/
            const activeSlideId = this.currentSlideIndex;
            this.currentSlide = activeSlideId;
        },
        updateCurrentCard() {
            /~ const currSlide = this.slides.find(slide => slide.active);
            this.currentSlide = currSlide ? currSlide.id : 0; ~/
            const activeCardId = this.currentCardIndex;
            this.currentCard = activeCardId;
        },*/
        updateCurrentSlide() {
            const activeSlide = this.slides.find(slide => slide.active);
            this.currentSlide = activeSlide ? activeSlide.id : 0;
        },

        updateCurrentCard() {
            const activeCard = this.cards.find(card => card.active);
            this.currentCard = activeCard ? activeCard.id : 0;
        },
        syncSlidesCards() {
            this.isSynced = !this.isSynced; // Toggle sync state

            if (this.isSynced) {
                // Reset slides and cards to their initial order
                this.slides = [...this.slidesOriginal];
                this.cards = [...this.cardsOriginal];

                // Get the current active slide ID
                const activeSlideId = this.currentSlideIndex; // Active slide ID from getter

                if (activeSlideId) {
                    // Find the index of the slide with the active ID
                    const slideIndex = this.slides.findIndex(slide => slide.id === activeSlideId);
                    const cardIndex = this.cards.findIndex(card => card.id === activeSlideId);

                    if (slideIndex !== -1 && cardIndex !== -1) {
                        // Ensure both slides and cards have the same active ID
                        this.goToSlide(slideIndex);
                        this.goToCard(cardIndex);

                        // Update the states
                        this.updateCards();
                        this.updateSlides();
                        this.updateCurrentCard();
                        this.updateCurrentSlide();
                    }
                }
            }
        },
        executeWithDelay(this: any, action: () => void, delay: number = this.slideDelay) {
            if (!this.isAnimating) {
                this.isAnimating = true;

                action();

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        this.isAnimating = false;
                    }, delay);
                });
            }
        },

        goToCards(index: number) {
            this.executeWithDelay(() => {
                if (index === this.activeCardOn) return;

                if (this.isProgressBarUsing) this.resetProgress();
                clearInterval(this.slideInterval);

                const direction = index < this.activeCardOn ? -1 : 1;
                const numSlides = Math.abs(this.activeCardOn - index);

                for (let i = 0; i < numSlides; i++) {
                    if (direction === 1) {
                        const firstCard = this.cards.shift();
                        if (firstCard) this.cards.push(firstCard);
                    } else {
                        const lastCard = this.cards.pop();
                        if (lastCard) this.cards.unshift(lastCard);
                    }
                }

                this.updateCurrentCard();
                this.updateCards();
            });
        },

        goToCard(index: number) {
            this.executeWithDelay(() => {
                const card = this.cards[index];
                if (card) {
                    this.cards.forEach((card, i) => {
                        card.active = i === index;
                        card.visibility = i >= this.minCards && i <= this.maxCards;
                    });
                    this.updateCurrentCard();
                    this.updateCards();
                }
            });
        },

        goToSlide(index: number) {
            this.executeWithDelay(() => {
                if (index === this.activeSlideOn) return;

                if (this.isProgressBarUsing) this.resetProgress();
                clearInterval(this.slideInterval);

                const direction = index < this.activeSlideOn ? -1 : 1;
                const numSlides = Math.abs(this.activeSlideOn - index);

                for (let i = 0; i < numSlides; i++) {
                    if (direction === 1) {
                        const firstSlide = this.slides.shift();
                        if (firstSlide) this.slides.push(firstSlide);
                        const firstCard = this.cards.shift();
                        if (firstCard) this.cards.push(firstCard);
                        const firstDot = this.mdots.shift();
                        if (firstDot) this.mdots.push(firstDot);
                    } else {
                        const lastSlide = this.slides.pop();
                        if (lastSlide) this.slides.unshift(lastSlide);
                        const lastCard = this.cards.pop();
                        if (lastCard) this.cards.unshift(lastCard);
                        const lastDots = this.mdots.pop();
                        if (lastDots) this.mdots.unshift(lastDots);
                    }
                }

                this.updateCards();
                if (this.isMobile) this.updateDots();
                this.updateSlides();
                if (!this.isProgressBarUsing) this.resetCountdown();
                this.updateDarkClass();
            });
        },

        goToSlideDots(index: number) {
            this.executeWithDelay(() => {
                if (index === this.activeDotOn) return;

                if (this.isProgressBarUsing) this.resetProgress();
                clearInterval(this.slideInterval);

                const direction = index < this.activeDotOn ? -1 : 1;
                const numSlides = Math.abs(this.activeDotOn - index);

                for (let i = 0; i < numSlides; i++) {
                    if (direction === 1) {
                        const firstSlide = this.slides.shift();
                        if (firstSlide) this.slides.push(firstSlide);
                        const firstCard = this.cards.shift();
                        if (firstCard) this.cards.push(firstCard);
                        if (this.isMobile) {
                            const firstDots = this.mdots.shift();
                            if (firstDots) this.mdots.push(firstDots);
                        }
                        this.updateDots();
                    } else {
                        const lastSlide = this.slides.pop();
                        if (lastSlide) this.slides.unshift(lastSlide);
                        const lastCard = this.cards.pop();
                        if (lastCard) this.cards.unshift(lastCard);
                        const lastDots = this.mdots.pop();
                        if (lastDots) this.mdots.unshift(lastDots);
                        this.updateDots(true);
                    }
                }

                this.updateCards();
                this.updateSlides();
                if (!this.isProgressBarUsing) this.resetCountdown();
                this.updateDarkClass();
            });
        },

        handleDotClick(dotId: string) {
            if (!this.isAnimating) {
                const dot = this.dots.find((dot: { id: string }) => dot.id === dotId);
                if (dot) {
                    const slideIndex = this.slides.findIndex(
                        (slide: { id: { toString: () => string } }) =>
                            slide.id.toString() === dotId.replace("slide-", "")
                    );

                    if (slideIndex !== -1) this.goToSlide(slideIndex);
                }
            }
        },


        nextSlide() {
            this.executeWithDelay(() => {
                clearInterval(this.slideInterval);

                // Pomeri slides
                const firstSlide = this.slides.shift();
                if (firstSlide) this.slides.push(firstSlide);
                this.updateSlides();

                // Pomeri cards
                if (this.isSynced) {
                    const firstCard = this.cards.shift();
                    if (firstCard) this.cards.push(firstCard);
                    this.updateCards(true);
                }

                // Pomeri dots
                if (this.isMobile) {
                    const firstDot = this.mdots.shift();
                    if (firstDot) this.mdots.push(firstDot);
                    this.updateDots();
                }

                this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                if (!this.isPaused) this.startSlide();
            });
        },

        prevSlide() {
            this.executeWithDelay(() => {
                clearInterval(this.slideInterval);

                // Pomeri slides
                const lastSlide = this.slides.pop();
                if (lastSlide) this.slides.unshift(lastSlide);
                this.updateSlides();

                // Pomeri cards
                if (this.isSynced) {
                    const lastCard = this.cards.pop();
                    if (lastCard) this.cards.unshift(lastCard);
                    this.updateCards(true);
                }

                // Pomeri dots
                if (this.isMobile) {
                    const lastDot = this.mdots.pop();
                    if (lastDot) this.mdots.unshift(lastDot);
                    this.updateDots(true);
                }

                this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                if (!this.isPaused) this.startSlide();
            });
        },

        nextCard() {
            this.executeWithDelay(() => {
                // Pomeri cards
                const firstCard = this.cards.shift();
                if (firstCard) this.cards.push(firstCard);
                this.updateCards(true);
                if (!this.isSynced) this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                if (!this.isPaused) this.startSlide();
            });
        },

        prevCard() {
            this.executeWithDelay(() => {
                // Pomeri cards
                const lastCard = this.cards.pop();
                if (lastCard) this.cards.unshift(lastCard);
                this.updateCards(true);
                if (!this.isSynced) this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                if (!this.isPaused) this.startSlide();
            });
        },

        nextDot() {
            this.executeWithDelay(() => {
                // Pomeri dots
                const firstDot = this.mdots.shift();
                if (firstDot) this.mdots.push(firstDot);
                this.updateDots();

                // Pomeri slides
                const firstSlide = this.slides.shift();
                if (firstSlide) this.slides.push(firstSlide);
                this.updateSlides();

                // Pomeri cards
                if (this.isSynced) {
                    const firstCard = this.cards.shift();
                    if (firstCard) this.cards.push(firstCard);
                    this.updateCards(true);
                }

                if (!this.isSynced) this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                if (!this.isPaused) this.startSlide();
            });
        },

        prevDot() {
            this.executeWithDelay(() => {
                // Pomeri dots
                const lastDot = this.mdots.pop();
                if (lastDot) this.mdots.unshift(lastDot);
                this.updateDots(true);

                // Pomeri slides
                const lastSlide = this.slides.pop();
                if (lastSlide) this.slides.unshift(lastSlide);
                this.updateSlides();

                // Pomeri cards
                if (this.isSynced) {
                    const lastCard = this.cards.pop();
                    if (lastCard) this.cards.unshift(lastCard);
                    this.updateCards(true);
                }

                if (!this.isSynced) this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                if (!this.isPaused) this.startSlide();
            });
        },

        /*nextSlide() {
            if (!this.isAnimating) {
                this.isAnimating = true;
                clearInterval(this.slideInterval);
                const firstSlide = this.slides.shift();
                if (firstSlide) this.slides.push(firstSlide);
                this.updateSlides();
                requestAnimationFrame(() => {
                    this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                    if (!this.isPaused) this.startSlide();
                    if (this.isSynced) this.nextCard();
                    if (this.isMobile) this.nextDot();
                    setTimeout(() => {
                        this.isAnimating = false;
                    }, this.slideDelay);
                });
            }
        },
        prevSlide() {
            if (!this.isAnimating) {
                this.isAnimating = true;
                clearInterval(this.slideInterval as unknown as number);
                const lastSlide = this.slides.pop();
                if (lastSlide) this.slides.unshift(lastSlide);
                this.updateSlides();
                requestAnimationFrame(() => {
                    this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                    if (!this.isPaused) this.startSlide();
                    if (this.isSynced) this.prevCard();
                    if (this.isMobile) this.prevDot();
                    setTimeout(() => {
                        this.isAnimating = false;
                    }, this.slideDelay)
                });
            }
        },

        nextCard() {
            if (!this.isAnimating) {
                this.isAnimating = true;
                const firstCard = this.cards.shift();
                if (firstCard) this.cards.push(firstCard);
                this.updateCards(true);
                if (this.isMobile) this.updateDots();
                requestAnimationFrame(() => {
                    if(!this.isSynced) this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                    if (!this.isPaused) this.startSlide();
                    setTimeout(() => {
                        /~ this.nextSlide(); ~/
                        this.isAnimating = false;
                    }, this.slideDelay)
                });
            }

        },
        prevCard() {
            if (!this.isAnimating) {
                this.isAnimating = true;
                const lastCard = this.cards.pop();
                if (lastCard) this.cards.unshift(lastCard);
                this.updateCards(true);
                if (this.isMobile) this.updateDots(true);
                requestAnimationFrame(() => {
                    if(!this.isSynced) this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                    this.startSlide();
                    setTimeout(() => {
                        /~ this.prevSlide(); ~/
                        this.isAnimating = false;
                    }, this.slideDelay)
                });
            }
        },

        nextDot() {
            if (!this.isAnimating) {
                this.isAnimating = true;
                const firstDot = this.mdots.shift();
                if (firstDot) this.mdots.push(firstDot);
                this.updateDots();

                requestAnimationFrame(() => {
                    if(!this.isSynced) this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                    this.startSlide();
                    setTimeout(() => {
                        /~ this.prevSlide(); ~/
                        this.isAnimating = false;
                    }, this.slideDelay)
                });
            }
        },
        prevDot() {
            if (!this.isAnimating) {
                this.isAnimating = true;
                const lastDot = this.mdots.pop();
                if (lastDot) this.mdots.unshift(lastDot);
                this.updateDots(true);


                requestAnimationFrame(() => {
                    if(!this.isSynced) this.isProgressBarUsing ? this.startProgress() : this.resetCountdown();
                    this.startSlide();
                    setTimeout(() => {
                        /~ this.prevSlide(); ~/
                        this.isAnimating = false;
                    }, this.slideDelay)
                });
            }
        },*/
        updateSlides() {
            this.updateInterval();
            this.slides.forEach((slide, index) => {
                slide.position = index;
                slide.active = (index === this.activeSlideOn);
                slide.visibility = (index >= this.minSlides && index <= this.maxSlides);
            });
            this.updateCurrentSlide();
            this.updateCurrentCard();
        },
        updateCards(reverse = false) {
            this.updateInterval();
            this.cards.forEach((card, index) => {
                card.position = index;
                card.active = (index === this.activeCardOn);
                card.visibility = (index >= this.minCards && index <= this.maxCards);
            });
            this.updateCurrentSlide();
            this.updateCurrentCard();
        },
        updateMinSlides(slides: number) {
            this.minSlides = slides
        },
        updateMaxSlides(slides: number) {
            this.maxSlides = slides
        },
        updateMinCards(cards: number) {
            this.minCards = cards
        },
        updateMaxCards(cards: number) {
            this.maxCards = cards
        },
        updateActiveCardOn(card: number) {
            this.activeCardOn = card
        },
        updateActiveSlideOn(slide: number) {
            this.activeSlideOn = slide
        },

        updateDots(reverse = false) {
            this.updateInterval();
            if (this.closedCards) {
                this.mdots.forEach((dot, index) => {
                    dot.position = index;
                    dot.active = (index === this.activeDotOn);
                    dot.visibility = (index >= 1 && index <= 5);
                });
            } else {
                this.mdots.forEach((dot, index) => {
                    dot.position = index;
                    dot.active = (index === this.activeDotOn);
                    dot.visibility = (index >= 1 && index <= 5);
                });
            }
            this.updateCurrentSlide();
            this.updateCurrentCard();

        },
        closeSlides() {
            this.closedSlider = !this.closedSlider
            this.updateSlides();
            this.updateCurrentSlide();
            this.updateMaxCardsSlides();
        },
        closeCards() {
            this.closedCards = !this.closedCards
            this.updateCards();
            this.updateCurrentCard();
            this.updateMaxCardsSlides();
        },
        updateMaxCardsSlides() {
            const page = usePagesStore();
            const width = page.widthofHtml;
            /* if (width > 1366 && this.closedCards && this.closedSlider) {
                this.closedCards = false;
                this.closedSlider = false;
                this.updateCards();
                this.updateSlides();
            } else if (width < 1366 && !this.closedCards && !this.closedSlider) {
                this.closedCards = true;
                this.closedSlider = true;
                this.updateCards();
                this.updateSlides();
            } */

            /* if(width < 600) {
                this.closedCards = false;
                this.updateCards();
            } else {
                this.closedCards = true;
                this.updateCards();
            } */


            if (this.closedCards && this.closedSlider) {
                //* Ako su oba closed
                this.updateActiveCardOn(5);
                this.updateActiveSlideOn(5);


            } else if (!this.closedCards && !this.closedSlider) {
                //* Ako su oba closed
                //! RADI
                this.updateActiveCardOn(5);
                this.updateActiveSlideOn(5);


            } else if (this.closedCards && !this.closedSlider) {
                //* Ako je closed samo cards
                this.updateActiveCardOn(5);
                this.updateActiveSlideOn(5);


            } else if (!this.closedCards && this.closedSlider) {
                //* Ako je closed samo cards
                this.updateActiveCardOn(5);
                this.updateActiveSlideOn(5);
            }


            if (this.closedCards) {
                if (width > 1666) {
                    this.updateMinCards(4);
                    this.updateMaxCards(9);
                } else if (width <= 1666 && width > 1366) {
                    this.updateMinCards(4);
                    this.updateMaxCards(8);
                } else if (width <= 1366 && width > 1024) {
                    this.updateMinCards(4);
                    this.updateMaxCards(7);

                } else if (width <= 1024 && width > 840) {
                    this.updateMinCards(4);
                    this.updateMaxCards(7);
                } else if (width <= 840 && width > 720) {
                    this.updateMinCards(4);
                    this.updateMaxCards(6);
                } else if (width <= 720 && width > 600) {
                    this.updateMinCards(5);
                    this.updateMaxCards(6);
                } else if (width <= 600 && width > 200) {
                    this.updateMinCards(5);
                    this.updateMaxCards(5);
                }
            } else {
                if (width > 1666) {
                    this.updateMinCards(4);
                    this.updateMaxCards(10);
                } else if (width <= 1666 && width > 1366) {
                    this.updateMinCards(4);
                    this.updateMaxCards(9);
                } else if (width <= 1366 && width > 1024) {
                    this.updateMinCards(4);
                    this.updateMaxCards(8);
                } else if (width <= 1024 && width > 840) {
                    this.updateMinCards(4);
                    this.updateMaxCards(7);
                } else if (width <= 840 && width > 720) {
                    this.updateMinCards(4);
                    this.updateMaxCards(6);
                } else if (width <= 720 && width > 500) {
                    this.updateMinCards(4);
                    this.updateMaxCards(6);
                } else if (width <= 500 && width > 200) {
                    this.updateMinCards(5);
                    this.updateMaxCards(5);
                }

            }

            if (this.closedSlider) {
                this.updateMinSlides(5);
                this.updateMaxSlides(5);
            } else {
                this.updateMinSlides(4);
                this.updateMaxSlides(6);
            }

            if (page.widthofHtml >= 1024) {
                /* this.isMobile = false; */
                /* this.activeDotOn = 3; */
                /* this.updateDots(); */
            } else if (page.widthofHtml < 1024) {
                /* this.isMobile = true; */
                /* this.activeDotOn = 3; */
                /* this.updateDots(); */
            }

            this.updateCards();
            this.updateSlides();

        },
        updateDarkClass() {
            const activeSlideNumber = parseInt(this.currentActiveSlide.replace("slide-", ""), 10);
            const paginationDotsContainer = document.querySelector(".slider-pagination") as HTMLElement | null;
            if (paginationDotsContainer) {
                if (activeSlideNumber === 1 || activeSlideNumber === 2 || activeSlideNumber === 4) {
                    paginationDotsContainer.classList.add("dark");
                } else {
                    paginationDotsContainer.classList.remove("dark");
                }
            }
        },

        startSlide() {
            if (this.slideInterval === undefined && !this.isPaused) {
                this.updateInterval();
                if (!this.isProgressBarUsing) {
                    this.resetCountdown();
                }
            }
        },
        updateInterval() {
            if (!this.isPaused && !this.isAnimating) {
                if (this.slideInterval !== null) {
                    clearInterval(this.slideInterval);
                }
                this.slideInterval = window.setInterval(() => {
                    this.nextSlide();
                    this.nextCard();
                }, this.currentSlideTime) as unknown as number;

            }
        },
        resetCountdown() {
            if (!this.isProgressBarUsing) {
                //console.log("resetCountdown");
                if (!this.isPaused) {
                    if (this.countdownTimer !== null) {
                        clearInterval(this.countdownTimer);
                    }
                    this.remainingTime = this.currentSlideTime;
                    /* slider.remainingTime = currentSlideTime; */
                    this.countdownTimer = setInterval(() => {
                        this.remainingTime -= 10;
                        if (this.remainingTime <= 0) {
                            clearInterval(this.countdownTimer);
                            this.nextSlide();
                        }
                    }, 10) as unknown as number;
                }
            }
        },

        startProgress() {
            if (this.progressBar && this.isProgressBarUsing) {
                const seconds = (this.currentSlideTime / 1000).toFixed(2);
                this.progressBarTime = seconds;
                this.progressBarWidth = "100%";
            }
        },
        resetProgress() {
            if (this.progressBar && this.isProgressBarUsing && !this.isPaused) {
                //console.log("resetProgress");
                this.progressBarTime = "0";
                this.progressBarWidth = "0%";
            }
        },

        firstProgress() {
            if (this.isProgressBarUsing) {
                this.startProgress();
                if (this.isPaused) {
                    setTimeout(() => {
                        this.nextSlide();
                    }, this.currentSlideTime)
                }
            } else {
                this.resetCountdown();
                if (this.isPaused) {
                    setTimeout(() => {
                        this.nextSlide();
                    }, this.currentSlideTime)
                }
            }
        },



        pauseSlide() {
            if (this.countdownTimer !== null) {
                clearInterval(this.countdownTimer);
                this.countdownTimer = undefined;
            }
            this.isDragging = false;
            if (this.slideInterval !== null) {
                clearInterval(this.slideInterval);
                this.slideInterval = undefined;
            }
            this.remainingTime = 0;
            this.isPaused = true;
            if (this.isProgressBarUsing) {
                this.resetProgress();
            }
        },

        unpause() {
            this.isPaused = false;
            this.isManuallyPaused = false; // Reset manual pause state
            this.startProgress();
            this.nextSlide();
        },

        onTouchStart(event: TouchEvent) {
            if (this.isMobile && !this.isAnimating) {
                this.touchStartX = event.touches[0].clientX;
                this.isDragging = true; // Start dragging immediately
        
                if (!this.isPaused && !this.isDragging) {
                    this.pauseSlide(); // Temporarily pause on touch
                    this.wasPausedByDrag = true;
                } else {
                    this.wasPausedByDrag = false;
                }
        
                this.longPressTimeout = window.setTimeout(() => {
                    if (this.isPaused && !this.wasPausedByDrag) { // Resume only if not manually paused
                        this.isPaused = false;
                        this.startSlide();
                    } 
                    this.isDragging = false;
                }, 500);
            }
        },
        
        onTouchMove(event: TouchEvent) {
            if (this.isMobile && this.isDragging && !this.isAnimating) {
                if (this.touchStartX !== null) {
                    this.touchEndX = event.touches[0].clientX;
                    const distance = this.touchEndX - this.touchStartX;
                    this.dragOffset = (distance / window.innerWidth) * 100; // Calculate drag offset in percentage
                }
            }
        },
        
        onTouchEnd() {
            if (this.isMobile && !this.isAnimating) {
                if (this.touchStartX !== null && this.touchEndX !== null && this.isDragging) {
                    const touchDiffX = this.touchStartX - this.touchEndX;
        
                    if (Math.abs(touchDiffX) > this.dragThreshold) {
                        if (touchDiffX > this.dragThreshold) {
                            this.nextSlide();
                        } else if (touchDiffX < -this.dragThreshold) {
                            this.prevSlide();
                        }
                    }
                }
        
                this.isDragging = false;
                this.touchStartX = null;
                this.touchEndX = null;
                this.dragOffset = 0; // Reset drag offset
        
                // Resume slide if it was paused by dragging and was not manually paused
                if (this.wasPausedByDrag && !this.isPaused && !this.isDragging) {
                    this.isPaused = false;
                    this.startSlide();
                    this.wasPausedByDrag = false;
                } 
            }
        },
        



        onTouchStartCard(event: TouchEvent) {
            if (this.isMobile && !this.isAnimating) {
                const page = usePagesStore();

                const is840 = page.widthofHtml > 840
                if (is840) {
                    if (!this.isAnimating) {
                        this.touchStartX = event.touches[0].clientX;
                        this.isDraggingCards = true;
                        this.isAnimating = false;
                        if (!this.isPaused) {
                            this.pauseSlide();
                            this.wasPausedByDrag = true;
                        } else {
                            this.wasPausedByDrag = false;
                        }
                    }
                } else {
                    this.touchStartX = event.touches[0].clientX;
                    this.isDraggingCards = true; // Start dragging immediately
                    this.isAnimating = false;
                    if (!this.isPaused) {
                        this.pauseSlide(); // Pause on touch
                        this.wasPausedByDrag = true;
                    } else {
                        this.wasPausedByDrag = false;
                    }

                    /* this.longPressTimeout = window.setTimeout(() => {
                        if (this.isPaused && !this.wasPausedByDrag) {
                            // Resume if it was paused manually
                            this.isPaused = false;
                            this.startSlide();
                        }
                        this.isDraggingCards = false;
                    }, 500); */
                }
            }
        },
        onTouchMoveCard(event: TouchEvent) {
            if (this.isMobile && !this.isAnimating) {
                const page = usePagesStore();
                const is840 = page.widthofHtml > 840
                if (is840) {
                    if (this.isDraggingCards && this.touchStartX !== null) {
                        this.touchEndX = event.touches[0].clientX;
                        const distance = this.touchEndX - this.touchStartX;
                        this.dragOffsetCards = (distance / this.widthOfCardWrapper) * 100; // Use card wrapper width for percentage

                        // Calculate total width of cards dragged
                        const totalDraggedWidth = Math.abs(distance);

                        // Determine how many cards are dragged based on their widths
                        let draggedCards = 0;
                        let accumulatedWidth = 0;

                        for (const cardWidth of this.cardWidths) {
                            accumulatedWidth += cardWidth;
                            if (accumulatedWidth >= totalDraggedWidth) {
                                break;
                            }
                            draggedCards++;
                        }

                        // Determine the direction of the drag
                        const direction = distance > 0 ? 1 : -1;

                        // Calculate new min and max cards for visibility
                        let newMinCards = this.minCards - draggedCards * direction;
                        let newMaxCards = this.maxCards - draggedCards * direction;

                        // Ensure indices are within bounds
                        if (newMinCards < 0) {
                            newMinCards = 0;
                            newMaxCards = this.maxCards - this.minCards;
                        }
                        if (newMaxCards >= this.cards.length) {
                            newMaxCards = this.cards.length - 1;
                            newMinCards = newMaxCards - (this.maxCards - this.minCards);
                        }
                        this.isAnimating = false;
                        // Update visibility dynamically during drag
                        this.cards.forEach((card, index) => {
                            card.position = index;
                            card.visibility = index >= newMinCards && index <= newMaxCards;
                        });

                        // Set active card based on the direction and visibility change
                        if (newMinCards !== this.minCards || newMaxCards !== this.maxCards) {
                            this.cards.forEach((card, index) => {
                                card.active = index === newMinCards + 1;
                            });
                        }
                    }
                } else {
                    if (this.isMobile && this.isDraggingCards) {
                        if (this.touchStartX !== null) {
                            this.touchEndX = event.touches[0].clientX;
                            const distance = this.touchEndX - this.touchStartX;
                            this.dragOffsetCards = (distance / window.innerWidth) * 100; // Calculate drag offset in percentage
                        }
                    }
                }
            }
        },
        onTouchEndCard() {
            if (this.isMobile && !this.isAnimating) {
                const page = usePagesStore();
                const is840 = page.widthofHtml > 840
                if (is840) {
                    if (this.touchStartX !== null && this.touchEndX !== null && this.isDraggingCards) {
                        const touchDiffX = this.touchStartX - this.touchEndX;

                        // Calculate total width of cards dragged
                        const totalDraggedWidth = Math.abs(touchDiffX);

                        // Determine how many cards are dragged based on their widths
                        let draggedCards = 0;
                        let accumulatedWidth = 0;

                        for (const cardWidth of this.cardWidths) {
                            accumulatedWidth += cardWidth;
                            if (accumulatedWidth >= totalDraggedWidth) {
                                break;
                            }
                            draggedCards++;
                        }

                        // Determine the direction of the drag
                        const direction = touchDiffX > 0 ? 1 : -1;

                        // Calculate the index shift due to drag
                        const shift = Math.floor(draggedCards * direction);

                        // Calculate the new active index based on the shift
                        const originalActiveIndex = this.activeCardOn;
                        let newIndex = (originalActiveIndex + shift + this.cards.length) % this.cards.length;

                        // Ensure the newIndex is within the bounds
                        if (newIndex < 0) {
                            newIndex += this.cards.length;
                        }
                        this.isAnimating = false;
                        // Call goToCard to update card states

                        if (this.isSynced) {
                            this.goToSlide(newIndex);
                        } else {
                            this.goToCards(newIndex);
                        }

                        // Optionally, sync the slide with the new active card
                        /* this.goToSlide(newIndex); */
                    }

                    this.isDraggingCards = false;
                    this.touchStartX = null;
                    this.touchEndX = null;
                    this.dragOffsetCards = 0;

                    if (this.wasPausedByDrag && !this.isPaused) {
                        this.isPaused = false;
                        this.startSlide();
                        this.wasPausedByDrag = false;
                    }
                } else {
                    if (this.isMobile) {
                        if (this.longPressTimeout !== null) {
                            clearTimeout(this.longPressTimeout);
                            this.longPressTimeout = null;
                        }
                        this.isAnimating = false;
                        if (this.touchStartX !== null && this.touchEndX !== null && this.isDraggingCards) {
                            const touchDiffX = this.touchStartX - this.touchEndX;

                            if (Math.abs(touchDiffX) > this.dragThreshold) {
                                if (touchDiffX > this.dragThreshold) {
                                    this.nextCard(); // Move to the next card
                                } else if (touchDiffX < -this.dragThreshold) {
                                    this.prevCard(); // Move to the previous card
                                }
                            }
                        }

                        this.isDraggingCards = false;
                        this.touchStartX = null;
                        this.touchEndX = null;
                        this.dragOffsetCards = 0; // Reset drag offset

                        if (this.wasPausedByDrag && !this.isPaused) {
                            this.isPaused = false;
                            this.startSlide();
                            this.wasPausedByDrag = false;
                        }
                    }
                }
            }
        },



        onMouseDown(event: MouseEvent) {
            if (!this.isAnimating && !this.isMobile) {
                this.touchStartX = event.clientX;
                this.isDragging = true; // Start dragging immediately

                if (!this.isPaused) {
                    this.pauseSlide(); // Pause on drag
                    this.wasPausedByDrag = true;
                } else {
                    this.wasPausedByDrag = false;
                }
            }
        },
        onMouseMove(event: MouseEvent) {
            if (this.isDragging && !this.isMobile) {
                // Ensure touchStartX is not null before calculating distance
                if (this.touchStartX !== null) {
                    this.touchEndX = event.clientX;
                    const distance = this.touchEndX - this.touchStartX;
                    this.dragOffset = (distance / window.innerWidth) * 100; // Calculate drag offset in percentage
                }
            }
        },

        onMouseUp() {
            if (this.touchStartX !== null && this.touchEndX !== null && this.isDragging && !this.isAnimating && !this.isMobile) {
                const touchDiffX = this.touchStartX - this.touchEndX;

                if (Math.abs(touchDiffX) > this.dragThreshold) {
                    if (touchDiffX > this.dragThreshold) {
                        this.nextSlide();
                    } else if (touchDiffX < -this.dragThreshold) {
                        this.prevSlide();
                    }
                }
            }

            // Reset dragging status
            this.isDragging = false;
            this.touchStartX = null;
            this.touchEndX = null;
            this.dragOffset = 0; // Reset drag offset

            // Resume slide if it was paused by dragging
            if (this.wasPausedByDrag) {
                this.isPaused = false;
                this.startSlide();
                this.wasPausedByDrag = false;
            }
        },




        onMouseDownCard(event: MouseEvent) {
            if (!this.isMobile && !this.isAnimating) {
                if (!this.isAnimating) {
                    this.touchStartX = event.clientX;
                    this.isDraggingCards = true;

                    if (!this.isPaused) {
                        this.pauseSlide();
                        this.wasPausedByDrag = true;
                    } else {
                        this.wasPausedByDrag = false;
                    }
                }
            }
        },
        onMouseMoveCard(event: MouseEvent) {
            if (!this.isMobile && !this.isAnimating) {
                const page = usePagesStore();
                const is840 = page.widthofHtml > 840
                if (is840) {
                    if (this.isDraggingCards && this.touchStartX !== null) {
                        this.touchEndX = event.clientX;
                        const distance = this.touchEndX - this.touchStartX;
                        this.dragOffsetCards = (distance / this.widthOfCardWrapper) * 100; // Use card wrapper width for percentage

                        // Calculate total width of cards dragged
                        const totalDraggedWidth = Math.abs(distance);

                        // Determine how many cards are dragged based on their widths
                        let draggedCards = 0;
                        let accumulatedWidth = 0;

                        for (const cardWidth of this.cardWidths) {
                            accumulatedWidth += cardWidth;
                            if (accumulatedWidth >= totalDraggedWidth) {
                                break;
                            }
                            draggedCards++;
                        }

                        // Determine the direction of the drag
                        const direction = distance > 0 ? 1 : -1;

                        // Calculate new min and max cards for visibility
                        let newMinCards = this.minCards - draggedCards * direction;
                        let newMaxCards = this.maxCards - draggedCards * direction;

                        // Ensure indices are within bounds
                        if (newMinCards < 0) {
                            newMinCards = 0;
                            newMaxCards = this.maxCards - this.minCards;
                        }
                        if (newMaxCards >= this.cards.length) {
                            newMaxCards = this.cards.length - 1;
                            newMinCards = newMaxCards - (this.maxCards - this.minCards);
                        }

                        // Update visibility dynamically during drag
                        this.cards.forEach((card, index) => {
                            card.position = index;
                            card.visibility = index >= newMinCards && index <= newMaxCards;
                        });

                        // Set active card only if visibility changes
                        if (newMinCards !== this.minCards || newMaxCards !== this.maxCards) {
                            this.cards.forEach((card, index) => {
                                card.active = index === newMinCards + 1; // This ensures the active card is consistent in both directions
                            });
                        }


                    }


                } else {
                    if (this.isDraggingCards && this.touchStartX !== null) {
                        this.touchEndX = event.clientX;
                        const distance = this.touchEndX - this.touchStartX;
                        this.dragOffsetCards = (distance / window.innerWidth) * 100;
                    }
                }
            }
        },
        onMouseUpCard() {
            if (!this.isMobile && !this.isAnimating) {
                const page = usePagesStore();
                const is840 = page.widthofHtml > 840

                if (is840) {
                    if (this.touchStartX !== null && this.touchEndX !== null && this.isDraggingCards) {
                        const touchDiffX = this.touchStartX - this.touchEndX;

                        // Calculate total width of cards dragged
                        const totalDraggedWidth = Math.abs(touchDiffX);

                        // Determine how many cards are dragged based on their widths
                        let draggedCards = 0;
                        let accumulatedWidth = 0;

                        for (const cardWidth of this.cardWidths) {
                            accumulatedWidth += cardWidth;
                            if (accumulatedWidth >= totalDraggedWidth) {
                                break;
                            }
                            draggedCards++;
                        }

                        // Determine the direction of the drag
                        const direction = touchDiffX > 0 ? 1 : -1;

                        // Calculate the index shift due to drag
                        const shift = Math.floor(draggedCards * direction);

                        // Calculate the new active index based on the shift
                        const originalActiveIndex = this.activeCardOn;
                        let newIndex = (originalActiveIndex + shift + this.cards.length) % this.cards.length;

                        // Ensure the newIndex is within the bounds
                        if (newIndex < 0) {
                            newIndex += this.cards.length;
                        }

                        // Call goToCard to update card states
                        //this.goToCard(newIndex);

                        // Optionally, sync the slide with the new active card
                        this.goToSlide(newIndex);
                    }

                    this.isDraggingCards = false;
                    this.touchStartX = null;
                    this.touchEndX = null;
                    this.dragOffsetCards = 0;

                    if (this.wasPausedByDrag) {
                        this.isPaused = false;
                        this.startSlide();
                        this.wasPausedByDrag = false;
                    }
                } else {
                    if (this.touchStartX !== null && this.touchEndX !== null && this.isDraggingCards) {
                        const touchDiffX = this.touchStartX - this.touchEndX;

                        if (Math.abs(touchDiffX) > this.dragThreshold) {
                            if (touchDiffX > this.dragThreshold) {
                                this.nextSlide();
                            } else if (touchDiffX < -this.dragThreshold) {
                                this.prevSlide();
                            }
                        }
                    }
                    this.isDraggingCards = false;
                    this.touchStartX = null;
                    this.touchEndX = null;
                    this.dragOffsetCards = 0;

                    if (this.wasPausedByDrag) {
                        this.isPaused = false;
                        this.startSlide();
                        this.wasPausedByDrag = false;
                    }

                }
            }


        },


        /* initializeDots() {
            this.dots = this.slides.map((slide, index) => ({
                id: `slide-${slide.id}`,
            }));
        }, */
    },
    /* persist: true, */
});
