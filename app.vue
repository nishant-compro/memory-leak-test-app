<template>
  <div>
    <h1>Memory leak test app</h1>
    <p>Open the console to see the data fetched from the API</p>
    


    <h2>Lorem ipsum</h2>
    <p v-for="data of apiStore.data">
      {{ data }}
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      
      
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      
      
      
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
      Nullam nec fermentum nunc. Nullam nec fermentum nunc. Nullam nec
      fermentum nunc. Nullam nec fermentum nunc. Nullam nec fermentum nunc.
    </p>
  </div>
</template>

<script setup>
const apiData = await useFetch('/api/test-api');
console.log(apiData);

const apiStore = useApiStore();
apiStore.load(apiData.data.value);
</script>
