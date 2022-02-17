<template>
  <v-container>
    <div class="item_form">
      <v-form>
        <div>
          <v-row  justify="center" v-for="(chosen,index) in languagesNew" :key="index" >
            <v-col md="8" cols="12">
              <v-card min-width="100%">
                <v-row class="mt-1" align="center" justify="center">
                  <v-col cols="3" md="2">    <v-text-field
                    label="Language"
                    outlined
                    disabled
                    :value="chosen.lang"
                  ></v-text-field></v-col>
                </v-row>
                <v-col cols="12" md="12" >
                  <v-text-field
                    v-model="itemNames[index]"
                    :label="$t('Name')"
                    filled
                    dense
                    :rules= "[itemNames[index] !== '' || 'Keine leere Zeile' ] "
                  >
                  </v-text-field>

                </v-col>

                <v-col cols="12" md="12" >
                  <v-text-field
                    filled
                    dense
                    v-model="aboutItem[index]"
                    :label="$t('Description')"
                    :rules= "[aboutItem[index] !== '' || 'Keine leere Zeile' ] "
                  >
                  </v-text-field>
                </v-col>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div>
          <v-row class="col-12 col-lg-8 offset-lg-2">

            <v-row align="center">
              <v-col class="col-sm-8 col-md-2">
                <v-checkbox
                  v-model="countable"
                  :label="$t('Countable')">
                </v-checkbox>
              </v-col>

              <v-col class="mt-5 col-sm-10 col-md-6">
                <v-autocomplete
                  v-model="labels"
                  :items="labelsList"
                  chips
                  :item-text="getCurrentNameString"
                  prepend-icon="mdi-database-search"
                  deletable-chips
                  multiple
                  filled
                  return-object
                  dense
                  :label="$t('search')"
                >
                  <!-- @template Use this slot for the selected Labels inside V-Autocomplete -->
                  <template v-slot:selection="data">
                    <v-chip close @click:close="remove(data.item)" dark :color="data.item.colour"> {{ getName(data.item) }} </v-chip>
                  </template>
                  <!-- @template Use this slot for the expanded List when V-Autocomplete is selected -->
                  <template v-slot:item="{ item, on, attrs }">
                    <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                      <!--          Enables CheckBox usage to select multiple labels-->
                      <v-list-item-action>
                        <v-checkbox :color="item.colour" :input-value="active"> </v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-row>
                            <v-col><v-chip dark :color="item.colour"> {{ getName(item) }} </v-chip></v-col>
                            <v-col>                           <v-btn color="red" @click="deleteLabel(item)">Delete</v-btn> </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>

              </v-col>
              <v-col class=" col-sm-8 offset-sm-2 col-md-2 offset-md-1">
                <create-label class="plus" v-on:exit="getAllLabels()">
                </create-label>
              </v-col>
            </v-row>
          </v-row>
          <v-row class="col-8 offset-2">
            <v-btn block
                   @click="sendItem"
            >
              {{$t('Save')}}
            </v-btn>
          </v-row>
          <v-row>
          </v-row>
        </div>
        <div>
          <v-snackbar
            color="green"
            v-model="success"
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
      </v-form>
    </div>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable */
import createLabel from '@/components/createLabel.vue'
import ItemDataService from '@/services/itemDataService'
import { Item, Label, Language } from '@/types'
import labelDataService from '@/services/labelDataService'
import languageDataService from '@/services/languageDataService'
import Vue from 'vue'
import roomsDataService from '@/services/roomsDataService'
export default Vue.extend({
  name: 'Add Item',
  components: { createLabel },
  data () {
    return {
      min: 0,
      max: 500,
      labelsList: [] as Label [],
      shelvesList: [],
      itemNames: [],
      labels: [],
      aboutItem: [],
      success: false,
      error: false,
      snackbar:'',
      countable: false,
      languagesNew: [] as Language[],
    }
  },
  mounted () {
    /**
     * Get All Languages of which each gets listed on the Page
     */
    languageDataService.getAll()
      .then((result :any) => {
        this.languagesNew = result.data
      })
    this.getAllLabels()
  },
  methods: {
    /**
     * Deletes Label from DB
     * @param label  label which should be deleted from Backend
     * */
    deleteLabel(label: Label) {
      labelDataService.deleteLabelByLabelId(label._id).then(() => {
        this.success = true
        this.getAllLabels()
      }).catch(err => {
        console.error(err)
        this.error = true
      })
    },
    getAllLabels() {
      labelDataService.getAll().then((response) => {
        this.labelsList = response.data
      })
    },
    /**
     * Used to remove Item from selected Labels
     * @param item label which should be removed
     */
    remove (item :Label) {
      const index = this.labels.findIndex((key:Label) => key._id === item._id);
      this.labels.splice(index,1);
    },
    /**
     * Used to get Name based on current language
     * @param item item which has property name
     */
    getName (item: any) {
      return item.name[this.$i18n.locale]
    },


    /**
     * Creates the Item based on Inputs + existing Languages
     */
    sendItem: function () {
      var languageKeys: string[] = []
      this.languagesNew.forEach((value) => {
        languageKeys.push(value.lang)
      })
      /**
       * Converts All Names to a Map with Format of { name: [{lang: nameInLang},] }
       * Needed for variable-Multi-Lang-Support
       */
      const createLangMap = (keysArray: any, valuesArray: any) => Object.fromEntries(keysArray.map((value: string, index: number) => [value, valuesArray[index]]))

      const name = createLangMap(languageKeys, this.itemNames)
      /**
       * Converts All Descriptions to a Map with description: {lang: descriptionInLang}
       */
      const description = createLangMap(languageKeys, this.aboutItem)
      /**
       * Convert Labels to Ids
       */
      const selectedLabelIds: string[] = []
      this.labels.forEach((value: Label) => {
        if (value._id != null) {
          selectedLabelIds.push(value._id)
        }
      })
      const item: Item = {
        name,
        description,
        countable: this.countable,
        labelIds: selectedLabelIds
      }
      ItemDataService.create(item)
        .then(response => {
          this.success = true
          console.log(response)
        })
        .catch(e => {
          console.error(e)
          this.error = true
        })

    }

  },
  computed: {
    getCurrentNameString () {
      return 'name.' + this.$i18n.locale
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "en": {
    "delete": "Delete",
    "Name": "Name",
    "Description": "Description",
    "Countable": "Countable",
    "Labels": "Labels",
    "Save": "Save",
    "SuccessText": "Success! Operation Successfull",
    "ErrorText": "Error! Something goes wrong. Try again"
  },
  "de": {
    "delete": "Löschen",
    "Name": "Name",
    "Description": "Beschreibung",
    "Countable": "Countable",
    "Labels": "Labels",
    "Save": "Speichern",
    "SuccessText": "Erfolg!",
    "ErrorText": "Fehler! Etwas ist fehlgeschlagen. Probieren Sie das noch Mal"
  }
}
</i18n>
