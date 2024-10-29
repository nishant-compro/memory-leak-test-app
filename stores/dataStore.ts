
import { defineStore } from 'pinia';
import themesJSON from '../assets/themes.json';

export const useDataStore = defineStore({
  id: 'Data',

  // Return the initial state of the store
  state: (): any => ({
    data: themesJSON
  }),

  // Store Getters
  getters: {
    getData: (state) => state.data,
  },
  // Store Actions
  actions: {
    load(data: any) {
      this.data = data;
    },
  }
});
