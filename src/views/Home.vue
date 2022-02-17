<!--Landing-Page-->
<template>
  <div>
    <SearchBar/>
      <Grid/>
      <ItemMenu/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import Grid from '@/components/Grid.vue'
import ItemMenu from '@/components/ItemMenu.vue'
export default Vue.extend({
  name: 'Home',
  components: {
    ItemMenu,
    Grid,
    SearchBar
  }
})
</script>
