<!--View for the login component-->
<template>
  <div>
    <Login />
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Login from '../components/Login.vue'
export default Vue.extend({
  name: 'Home',

  components: {
    Login
  }
})
</script>
