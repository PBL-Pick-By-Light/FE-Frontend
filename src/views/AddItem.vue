<!--Wrapper for the AddItem-Component-->
<template>
  <div>
    <AddItem></AddItem>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import AddItem from '../components/AddItem.vue'
export default Vue.extend({
  name: 'Home',

  components: {
    AddItem
  }
})
</script>
