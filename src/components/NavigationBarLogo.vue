<template>
  <div class="d-flex align-center">
<!--    Link to the mainpage-->
    <router-link to="/">
<!--      The image and automatic sizing-->
      <v-img
          src="../assets/THM_Logo.png"
          class="my-3"
          contain
          height="200"
      />
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'NavigationBarLogo'
}
</script>
