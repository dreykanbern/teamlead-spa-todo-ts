import { defineStore } from 'pinia'

interface State {
    count: number
}

export const useStore = defineStore('main', {
    state: (): State => ({
    count: 0
}),
    getters: {
    doubleCount: (state) => state.count * 2,
        tripleCount: (state) => state.count * 3
},
actions: {
    increment() {
        this.count++
    },
    reset() {
        this.count = 0
    }
}
})