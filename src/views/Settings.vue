<!--View for the settings page-->
<template>
  <div>
    <Settings></Settings>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Settings from '@/components/Settings.vue'
export default Vue.extend({
  name: 'Home',

  components: {
    Settings
  }
})
</script>
