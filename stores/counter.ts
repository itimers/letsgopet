import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
    state: () => ({
        counters: [0, 0, 0],
        intervals: [30, 20, 10],
        ease: [150, 50, 200],
        intervalIds: [null, null, null] as (number | null)[],
    }),
    getters: {
        //setMainHeightState: (state) => state.heightofMain,

    },
    actions: {
        startCounting(index: number, maxCount: number) {
            this.stopCounting(index);
            setTimeout(() => {
                if(import.meta.client && typeof window !== 'undefined') {
                    this.intervalIds[index] = setInterval(() => {
                        if (this.counters[index] < maxCount) {
                            this.counters[index]++;
                        }
                    }, this.ease[index]) as unknown as number;
                }
            }, 800)
        },

        stopCounting(index: number) {
            this.counters[index] = 0;
            
            if (this.intervalIds[index] !== null) {
                this.counters = [0, 0, 0];
                clearInterval(this.intervalIds[index] as number);
                this.intervalIds[index] = null;
            }
            
        },
    },
});
