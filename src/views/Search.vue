<!--View for the search site-->
<template>
  <div>
    <SearchBar />
    <Grid />
    <ItemMenu />
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Grid from '../components/Grid.vue'
import ItemMenu from '../components/ItemMenu.vue'
import SearchBar from '../components/SearchBar.vue'
export default Vue.extend({
  name: 'Search',

  components: {
    Grid,
    SearchBar,
    ItemMenu
  }
})
</script>
