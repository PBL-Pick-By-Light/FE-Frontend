<template>
    <v-container>
      <v-row justify="center">
        <h1 style="margin-bottom: 10px">{{ $t('headline') }}</h1>
        <v-expansion-panels popout>
          <v-expansion-panel>
<!--            Panel for the search color by a user-->
            <v-expansion-panel-header>{{ $t('color') }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col offset-lg="2" class="col-lg-3">
<!--                  Official v-color-picker, color used with v-model binding-->
                  <v-color-picker
                    elevation="9"
                    dot-size="8"
                    hide-mode-switch
                    v-model="color"
                    mode="hex"
                    show-swatches
                    swatches-max-height="250"
                  ></v-color-picker>
                </v-col>
                <v-col class="col-lg-3">
                  <v-container>
<!--                    Button to save color, changes color dynamically with v-model picker variable-->
                    <v-btn class="mt-5" :color=color block elevation="9">{{ $t('searchcolor') }}</v-btn>
<!--                    Button to restore default search color-->
                    <v-btn class="mt-5" block elevation="9">{{ $t('standard') }}</v-btn>
                  </v-container>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $t('language') }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
<!--                Radio buttons to select standard language and a button to save this configuration-->
                <v-col offset-lg="2" class="col-lg-3">
                  <v-radio-group v-model="selectedLanguage" id="radios">
                    <v-radio v-for="(lang,index) in this.allLanguages" :key="index" :label="lang.lang"></v-radio>
                  </v-radio-group>
                  <v-btn elevation="9" style="margin-top: 20px" >{{ $t('save') }}</v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!--          Admin Panels disabled for basic users-->
        </v-expansion-panels>
      </v-row>
      <v-row class="mt-5" v-if="true" justify="center">
          <h1 style="margin-bottom: 10px">{{ $t('adminHeadline') }}</h1>
          <v-expansion-panels  popout>
            <v-expansion-panel>
              <v-expansion-panel-header>{{ $t('globalLanguage') }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <!--                Radio buttons to select standard language and a button to save this configuration-->
                  <v-col offset-lg="2" class="col-lg-3">
                    <v-radio-group v-model="selectedGlobalLanguage" id="radios">
                      <v-radio v-for="(lang,index) in this.allLanguages" :key="index" :label="lang.lang"></v-radio>
                    </v-radio-group>
                    <v-btn elevation="9" style="margin-top: 20px" @click="saveSettings">{{ $t('save') }}</v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Theme {{ $t('themecolor') }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col offset-lg="2" class="col-lg-3">
                    <!--                  Official v-color-picker, color used with v-model binding-->
                    <v-color-picker
                      id="adminColorPicker"
                      elevation="9"
                      dot-size="8"
                      hide-mode-switch
                      mode="rgba"
                      v-model="color"
                      show-swatches
                      swatches-max-height="250"
                    ></v-color-picker>
                  </v-col>
                  <v-col class="col-lg-3">
                    <v-container>
                      <!--                    Different buttons to save the picked color to a specific setting-->
                      <v-btn class="mt-5" color ="primary" @click="set_primary_color" block elevation="9">{{ $t('primary') }}</v-btn>
                      <v-btn class="mt-5" color ="secondary" @click="set_secondary_color" block elevation="9">{{ $t('secondary') }}</v-btn>
                      <v-btn class="mt-5" color ="accent" @click="set_accent_color" block elevation="9">{{ $t('accent') }}</v-btn>
                      <v-btn class="mt-5" color ="error" @click="set_error_color" block elevation="9">{{ $t('error') }}</v-btn>
                      <v-btn class="mt-5" @click="set_default_color" block elevation="9">{{ $t('standard') }}</v-btn>
                      <v-btn class="mt-5" @click="set_manufacturer_color" block elevation="9">{{ $t('manufacturer') }}</v-btn>
                    </v-container>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Logo</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col offset-lg="2" class="col-lg-3">
                    <h3> Needs to be implemented in Backend</h3>
                    <v-container>
                      <!--                Image Uploader-->
                      <v-file-input
                        :label="$t('imageUpload')"
                        accept="image/*"
                      ></v-file-input>
                      <!--                Upload Button-->
                      <v-btn color="primary">Upload</v-btn>
                    </v-container>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
      </v-row>
<!--      Temporary Admin-mode toggle Button for presentation-->
    </v-container>
</template>

<script lang="ts">
import languageDataService from '@/services/languageDataService'
import SettingsService from '@/services/settingsService'
import Vue from 'vue'
export default Vue.extend({
  name: 'UserSettings',
  data () {
    return {
      // Smart variable for the standard locale definition
      selectedLanguage: 0,
      // Starting colors for the color picker
      color: '#FF00FFFF',
      selectedGlobalLanguage: 0,
      colorSearchModel: '#FF00FFFF',
      id: '',
      primColor: '',
      secColor: '',
      accColor: '',
      errColor: '',
      defPrimColor: '',
      defSecColor: '',
      defAccColor: '',
      defErrColor: '',
      allLanguages: [],
      currentSettings: null
    }
  },
  computed: {
    // Checks if the logged-in user has administrator rights
    isAdmin () {
      if (this.$store.state.auth.role === 'admin') return true
      else return false
    }
  },
  watch: {
    color (value) {
      // temporary fix while there is no way to disable the alpha channel in the colorpicker component: https://github.com/vuetifyjs/vuetify/issues/9590
      // Alpha Channel is generated by component, but can't be used by Theme
      if (value.toString().match(/#[a-zA-Z0-9]{8}/)) {
        this.color = value.substr(0, 7)
      }
    }
  },
  methods: {
    // Gets the settings and languages via the related services
    fetchInfos () {
      SettingsService.getSettings().then((result) => {
        this.currentSettings = result
      }).then(() => {
        languageDataService.getAll()
          .then((result) => {
            this.allLanguages = result.data
            // Checks if standard-language exists.
            const index = this.allLanguages.findIndex(key => key._id === this.currentSettings.lanugage)
            // If not Found select first
            if (index === -1) this.selectedLanguage = 0
          }).catch(err => {
            console.error(err)
            throw err
          })
      }).catch(err => {
        console.error(err)
        throw err
      })
    },
    /**
     * Saves Settings in Database
     */
    saveSettings () {
      const Settings = {
        language: this.allLanguages[this.selectedGlobalLanguage]._id,
        colors: [
          this.$vuetify.theme.themes.light.primary,
          this.$vuetify.theme.themes.light.secondary,
          this.$vuetify.theme.themes.light.accent,
          this.$vuetify.theme.themes.light.error
        ]
      }
      SettingsService.setSettings(Settings)
    },
    // Color setters for vuex store and page variables
    set_primary_color: function () {
      this.saveSettings()
      this.$vuetify.theme.themes.light.primary = this.color
      this.primColor = this.color
    },
    set_secondary_color: function () {
      this.saveSettings()
      this.$vuetify.theme.themes.light.secondary = this.color
      this.secColor = this.color
    },
    set_accent_color: function () {
      this.saveSettings()
      this.$vuetify.theme.themes.light.accent = this.color
      this.accColor = this.color
    },
    set_error_color: function () {
      this.saveSettings()
      this.$vuetify.theme.themes.light.error = this.color
      this.errColor = this.color
    },
    // Sets all colors in vuex store and on page, back to the colors at sideload
    set_default_color: function () {
      this.$vuetify.theme.themes.light.primary = this.primColor = this.defPrimColor
      this.$vuetify.theme.themes.light.secondary = this.secColor = this.defSecColor
      this.$vuetify.theme.themes.light.accent = this.accColor = this.defAccColor
      this.$vuetify.theme.themes.light.error = this.errColor = this.defErrColor
      this.saveSettings()
    },
    // Sets the color scheme back to THM color scheme Change this for Customization.
    set_manufacturer_color: function () {
      this.$vuetify.theme.themes.light.primary = '#80ba24'
      this.$vuetify.theme.themes.light.secondary = '#4a5c66'
      this.$vuetify.theme.themes.light.accent = '#8c9eff'
      this.$vuetify.theme.themes.light.error = '#b71c1c'
      this.saveSettings()
    }
  },
  // On settings-page load, page variables are set to the vuex theme colors
  mounted () {
    this.primColor = this.defPrimColor = this.$vuetify.theme.themes.light.primary
    this.secColor = this.defSecColor = this.$vuetify.theme.themes.light.secondary
    this.accColor = this.defAccColor = this.$vuetify.theme.themes.light.accent
    this.errColor = this.defErrColor = this.$vuetify.theme.themes.light.error
    this.fetchInfos()
    this.saveSettings()
  }
})
</script>

<style scoped>

</style>
<i18n>
{
  "en": {
    "globalLanguage": "Globale Standard Language",
    "headline": "Settings",
    "adminHeadline": "Admin-Settings",
    "color": "Search Color",
    "language": "Select Standard Language",
    "themecolor": "Color",
    "radio1": "English",
    "radio2": "German",
    "save": "Save",
    "standard": "Restore Default",
    "primary": "Save as primary color",
    "secondary": "Save as secondary color",
    "accent": "Save as accent color",
    "error": "Save as error color",
    "searchcolor": "Save new Searchcolor",
    "imageUpload": "Select new Image...",
    "manufacturer": "Manufacturer Colors"
  },
  "de": {
    "globalLanguage": "Globale Standard-Sprache",
    "adminHeadline": "Admin-Einstellungen",
    "headline": "Einstellungen",
    "color": "Suchfarbe",
    "language": "Standard Sprachauswahl",
    "themecolor": "Farbe",
    "radio1": "Englisch",
    "radio2": "Deutsch",
    "save": "Sichern",
    "standard": "Standard Wiederherstellen",
    "primary": "Als Primärfarbe speichern",
    "secondary": "Als Sekundärfarbe speichern",
    "accent": "Als Akzentfarbe speichern",
    "error": "Als Fehlerfarbe speichern",
    "searchcolor": "Neue Suchfarbe speichern",
    "imageUpload": "Neues Logo auswählen...",
    "manufacturer": "Werksfarben"
  }
}
</i18n>
