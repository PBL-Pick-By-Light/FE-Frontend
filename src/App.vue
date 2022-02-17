<!--Vue entrypoint page-->
<template>
  <v-app>
    <NavigationBar  :key="$route.fullPath"/>
    <v-main>
      <router-view/>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import NavigationBar from './components/NavigationBar.vue'
import Footer from '@/components/Footer.vue'
import settingsService from '@/services/settingsService'
import * as data from '../config/config.json'
export default Vue.extend({
  name: 'App',
  components: {
    Footer,
    NavigationBar
  },
  data: () => ({
    //
  }),
  created () {
    /** Custom theme gets updated after vue is Created (Vuetify initiated) before mounted to ensure minimal TimeDelay */
    this.setTheme()
    document.title = data.title
  },
  methods: {
    setTheme () {
      /** SetsTheme According to Color from DB via settingsService  */
      /** Use Colors from config.json if no colors come from the DB */
      settingsService.getSettings().then(value => {
        if (value.data.colors[0] === null) {
          value.data.colors[0] = data.colors.primary
        }
        this.$vuetify.theme.themes.light.primary = value.data.colors[0]
        if (value.data.colors[1] === null) {
          value.data.colors[1] = data.colors.secondary
        }
        this.$vuetify.theme.themes.light.secondary = value.data.colors[1]
        if (value.data.colors[2] === null) {
          value.data.colors[2] = data.colors.accent
        }
        this.$vuetify.theme.themes.light.accent = value.data.colors[2]
        if (value.data.colors[3] === null) {
          value.data.colors[3] = data.colors.error
        }
        this.$vuetify.theme.themes.light.error = value.data.colors[3]
      })
    }
  }
})
</script>
