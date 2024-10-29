
import themesJSON from '../assets/themes.json';

export default defineNuxtRouteMiddleware(async () => {
  // This middleware will be called for every route change
  console.log('Global middleware called');

  const dataStore = useDataStore();

  if (import.meta.server) {
    const presentData = dataStore.getData;
  
    dataStore.load(themesJSON);

    useHead({
      style: [
        {
          innerHTML: presentData['theme-adult'],
          id: 'theme-variables'
        }
      ]
    });

    await useAsyncData('data', () => Promise.resolve(themesJSON))
  }

  if (import.meta.client) {
    const { data } = useNuxtData('data');
    dataStore.load(data);

    useHead({
      style: [
        {
          innerHTML: data,
          id: 'theme-variables'
        }
      ]
    });
  }

})