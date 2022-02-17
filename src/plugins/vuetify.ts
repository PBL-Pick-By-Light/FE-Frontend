import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

// Configuring custom colors for own theme
export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: '',
        secondary: '',
        accent: '',
        error: ''
      }
    }
  }
})
