<template>
  <v-container>
    <v-app-bar
      app
      color="secondary"
      dark
    >
      <!--Adding a logo-->
      <NavigationBarLogo/>
      <!--Spacer separates left and right side-->
      <v-spacer></v-spacer>
      <v-img :src="imageSrc" @click="changeLocale" alt="change" max-width="25px"></v-img>
      <!-- change Locale button on big screen -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="hidden-sm-and-down" icon @click="changeLocale" v-bind="attrs" v-on="on">
            <v-icon>mdi-web</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('locale') }}</span>
      </v-tooltip>
      <!-- dark mode button on big screen -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="hidden-sm-and-down" icon @click="toggle_dark_mode" v-bind="attrs" v-on="on">
            <v-icon>mdi-theme-light-dark</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('darkmode') }}</span>
      </v-tooltip>
      <!-- settings button on big screen -->
      <v-tooltip bottom v-if="checkLoggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon class="hidden-sm-and-down" to="Settings" v-bind="attrs" v-on="on">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('settings') }}</span>
      </v-tooltip>
      <!-- button for admin activities  -->
      <v-tooltip bottom v-if="isAdmin">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon class="hidden-sm-and-down" @click="drawer = true" v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('admin') }}</span>
      </v-tooltip>
      <!-- button for logout  -->
      <v-tooltip bottom v-if="checkLoggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon class="hidden-sm-and-down" @click="logout()" v-bind="attrs" v-on="on">
            <v-icon>mdi-logout-variant</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('logout') }}</span>
      </v-tooltip>

      <v-btn v-if="!checkLoggedIn" @click="logout()">
        Register
      </v-btn>

      <!-- dropdown hamburger on small screen -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon class="hidden-md-and-up" v-bind="attrs" v-on="on"></v-app-bar-nav-icon>
        </template>
        <v-list>
          <v-list-item>
            <!-- change Locale button on small screen -->
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="changeLocale" v-bind="attrs" v-on="on">
                  <v-icon>mdi-web</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('locale') }}</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item>
            <!-- dark mode button on small screen -->
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="toggle_dark_mode" v-bind="attrs" v-on="on">
                  <v-icon>mdi-theme-light-dark</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('darkmode') }}</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item v-if="checkLoggedIn">
            <!-- settings button on small screen -->
            <v-tooltip  left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon to="Settings" v-bind="attrs" v-on="on">
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('settings') }}</span>
            </v-tooltip>
          </v-list-item>
          <!-- button for admin activities on small screen  -->
          <v-list-item v-if="checkLoggedIn && isAdmin">
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="launchAdminSettings" v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('admin') }}</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item v-if="checkLoggedIn">
            <!-- logout button on smallscreen -->
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="logout()" v-bind="attrs" v-on="on">
                  <v-icon>mdi-logout-variant</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('logout') }}</span>
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list-item>
        <v-list-item-avatar color="green">
          <span>{{getFirstLetter}}</span>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{getUser.username}} | {{getUser.role}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list
        nav
        class="mt-5"
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="gray"
        >
          <v-list-item
            v-for="item in items"
            :key="item.title"
            dense
            router :to="item.route"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script lang ="ts">

import NavigationBarLogo from '@/components/NavigationBarLogo.vue'
import authDataService from '@/services/authDataService'
import Vue from 'vue'

export default Vue.extend({
  name: 'NavigationBar',
  components: { NavigationBarLogo },
  data () {
    return {
      drawer: false,
      group: null,
      user: '',
      items: [
        { title: 'Create new Item', route: '/addItem', icon: 'mdi-nut' },
        { title: 'Create new Shelf', route: '/shelf', icon: 'mdi-view-module' },
        { title: 'Add Item to Shelf', route: '/itemToShelf', icon: 'mdi-expand-all' }
      ]
    }
  },
  computed: {
    // Returns the path to the actual language flag
    imageSrc () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      //  -> Bug of Vue2.x in Combination with TS
      return require('../assets/' + this.$root.$i18n.locale + '.png')
    },
    // Checks if User is Admin
    isAdmin () {
      if (localStorage.getItem('user') === null) return false
      return JSON.parse(localStorage.getItem('user')).role === 'admin'
    },
    // Checks if User is Loggedin
    checkLoggedIn () {
      return localStorage.getItem('user') !== null
    },
    // Gets first Letter, for Errorhandling in Function
    getFirstLetter () {
      return this.getUser.username[0].toUpperCase()
    },
    // Gets User if LoggedIn
    getUser () {
      const altUser = { username: 'NotLoggedIn', role: 'NotLoggedIn' }
      if (localStorage.getItem('user') === null) return altUser
      return JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
    /** Because of a Bug with the Drawer Component in Combination with the Datatable on Dashboard the screen needs
     *     to be scrolled down to see the Navigation-Drawer IF there are Items.
     */
    launchAdminSettings () {
      window.scroll(0, 500)
      this.drawer = true
    },
    // Logs the user from the system out, related variables are deleted
    logout () {
      authDataService.logout().then(() => {
        localStorage.removeItem('user')
        this.$router.push('/login')
      }).catch(result => {
        console.error(result)
        this.$router.push('/login')
        localStorage.removeItem('user')
      })
    },
    CheckLogin () {
      if (this.$route.matched.some(({ name }) => name === '/login')) {
        return false
      } else {
        return true
      }
    },
    // Toggles the vuetify dark_mode Variable to the opposite and stores the value in a local storage
    toggle_dark_mode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('dark_theme',
        this.$vuetify.theme.dark.toString())
    },
    // Reads the global locale setting and switches it to another option
    changeLocale () {
      if (this.$root.$i18n.locale === 'en') {
        this.$root.$i18n.locale = 'de'
      } else {
        this.$root.$i18n.locale = 'en'
      }
    }
  },
  mounted () {
    if (this.$store.state.drawerOpened) this.drawer = true
    // Checks if there is a dark mode preference in browser or system
    const theme = localStorage.getItem('dark_theme')
    if (theme) {
      // if there is a theme variable in the local storage, change the
      if (theme === 'true') {
        this.$vuetify.theme.dark = true
      } else {
        this.$vuetify.theme.dark = false
      }
    } else if (
      // check if user has a system preference and use it
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this.$vuetify.theme.dark = true
      localStorage.setItem(
        'dark_theme',
        this.$vuetify.theme.dark.toString()
      )
    }
  }
})
</script>

<i18n>
{
  "en": {
    "Create new Item": "Create new Item",
    "Create new Shelf": "Create new Shelf",
    "Add Item to Shelf": "Add Item to Shelf",
    "locale": "Change locale",
    "darkmode": "Dark-mode on/off",
    "settings": "Settings-page",
    "admin": "Admin-tools",
    "logout": "Logout"
  },
  "de": {
    "Create new Item": "Neues Item erstellen",
    "Create new Shelf": "Neuen Schrank erstellen",
    "Add Item to Shelf": "Item zum Schrank hinzufügen",
    "locale": "Sprache ändern",
    "darkmode": "Dunkelmodus an/aus",
    "settings": "Einstellungen",
    "admin": "Administrator Werkzeuge",
    "logout": "Ausloggen"
  }
}
</i18n>
