import { defineStore } from 'pinia';

export const useApiStore = defineStore({
  id: 'apiData',

  state: (): any => ({}),

  getters: {
    getData: (state) => state.data,
  },

  actions: {
    load(data: any) {
      this.data = data;
    },
  }
})