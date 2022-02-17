<template>
  <v-row justify="center">
    <!--This dialog window will be opened for creating new Label-->
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <!--This button is paced on addItem page -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="green"
          dark
          block
          v-bind="attrs"
          v-on="on"
        >
          {{$t('Titel')}}<v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card >
        <v-card-title>
          <span class="text-h5">{{$t('Titel')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- There are text fields for input new labels -->
            <v-row v-for="(chosen,index) in languages" :key="index">
              <v-col cols="12" md="6">
                <v-text-field
                label="Language"
                outlined
                disabled
                :value="chosen.lang"
              ></v-text-field></v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  refs="form"
                  v-model="labelList[index]"
                  label="Label"
                  :rules="[labelList[index]!== '' || 'Required']"
                ></v-text-field>
                </v-col>
            </v-row>
            <!--There is color Picker vor choosing color for chips(labels)-->
            <v-row>
              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="pickedColor"
                  dot-size="25"
                  mode="hexa"
                  show-swatches
                  swatches-max-height="100">
                </v-color-picker>
              </v-col >
              <!--There is example of chips -->
              <v-col cols="12" md="6">
                <p>Color:</p>
                <p>{{pickedColor}}</p>
                <p>Example:</p>
                <v-chip
                  v-for="chip in chipItem" :key="chip"
                  v-model="chips"
                  text-color="white"
                  close
                  :color=pickedColor
                >{{chip}} </v-chip>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <!--There is the buttons for saving new labels and closing the dialog window-->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="gray"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="green"
            text
            @click="sendLabel"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
      <!--There are snackbar messages for success and error events -->
      <div>
        <v-snackbar
          v-model="success"
          color="green"
        >
          {{ $t('SuccessText') }}
          <template v-slot:action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="success = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
      <div>
        <v-snackbar
          color="red"
          v-model="error"
        >
          {{ $t('ErrorText') }}
          <template v-slot:action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="error = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-dialog>
  </v-row>

</template>

<script lang="ts">

import LabelDataService from '@/services/labelDataService'
import languageDataService from '@/services/languageDataService'
import { Language } from '@/types'
import Vue from 'vue'
export default Vue.extend({
  name: 'createLabel',
  data () {
    return {
      dialog: false,
      pickedColor: '#FF00FF',
      value: '',
      chips: '',
      success: false,
      error: false,
      text: '',
      langInput: [],
      labelList: [],
      languages: [] as Language[],
      testLang: [
        {
          lang: 'de',
          id: '1525211cas'
        },
        {
          lang: 'en',
          id: '15252fas11cas'
        }
      ],
      list: [] as any
    }
  },
  watch: {
    pickedColor (value) {
      // temporary fix while there is no way to disable the alpha channel in the colorpicker component: https://github.com/vuetifyjs/vuetify/issues/9590
      if (value.toString().match(/#[a-zA-Z0-9]{8}/)) {
        this.pickedColor = value.substr(0, 7)
      }
    }
  },
  computed: {
    chipItem: {
      get () {
        return this.labelList
      }
    }
  },
  mounted () {
    /**
    * Get list of all languages
    */
    languageDataService.getAll()
      .then((result) => {
        this.languages = result.data
      })
    /* //if server is off
    this.testLang.forEach(value => {
      this.list.push(value.lang)
    })
      }) */
  },
  methods: {
    sendLabel () {
      var commonKeys : string [] = []
      this.languages.forEach((value) => {
        commonKeys.push(value.lang)
      })
      /**
       * Converts All Names to a Map with Format of "name: {lang: nameInLang}"
       */
      const zipArrays = (keysArray: any, valuesArray: any) => Object.fromEntries(keysArray.map((value, index) => [value, valuesArray[index]]))

      const name = zipArrays(commonKeys, this.labelList)
      /**
       * Converts All Descriptions to a Map with description: {lang: descriptionInLang}
       */
      /**
       * Convert Labels to Ids
       */

      const label: any = {
        name,
        colour: this.pickedColor
      }

      LabelDataService.create(label).then(() => {
        this.success = true
        this.$emit('exit', true)
      }).catch(e => {
        this.error = true
        console.error(e)
      })
      this.labelList = []
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "en": {
    "Titel": "Create New Label",
    "SuccessText": "Success! New Label created",
    "ErrorText": "Error! Something goes wrong. Try again"
  },
  "de": {
    "Titel": " Neues Label erstellen",
    "SuccessText": "Erfolg! Neues Label wurde erstellt",
    "ErrorText": "Fehler! Etwas ist fehlgeschlagen. Probieren Sie das noch Mal"
  }
}
</i18n>
