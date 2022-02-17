<!-- Gridsystem shows the result for the Project Pick by light -->

<template>
  <div>
    <!-- @v-data-table Header of the Table which shows 5 Items for each Page -->
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      class="elevation-1"
      :footer-props="footerprops"
    >
      <!-- @template puts the labels of the item with the related color in the v-slot of the grid -->
      <template v-slot:item.labels="{ item }">
        <!-- click on the lables of the item and add it to the lable of the searchbar -->
        <!-- puts the Lablename in a Column of the grid-->
        <v-chip
          :color ="label.colour"
          dark
          v-for="label in item.labels"
          :key="label._id"
          @click="addlabelToSearch(label)"
        >
          {{ getLabelName(label) }}
        </v-chip>
      </template>
      <!-- @template puts the actions of eachitem in the v-slot of the grid -->
      <template v-slot:item.actions="{ item }">
        <!-- @v-icon click on the item to open it -->
        <v-icon
          small
          class="mr-2"
          @click="openItem(item)"
        >
          mdi-magnify-plus
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import matColors from '../assets/materialColors.json'
import config from '../../config/config.json'
// To Use our own predefined Axios Methods
import ItemDataService from '@/services/itemDataService.ts'
import LabelDataService from '@/services/labelDataService.ts'
// Own Types
import { Item, Label } from '@/types/index.ts'
import lightDataService from '@/services/lightDataService'
export default Vue.extend({
  name: 'grid',
  data () {
    return {
      /**
       * Props for Table
       */
      items: [] as Item[],
      itemsall: [] as Item[]
    }
  },
  /**
   * Calls the mounted() function if the Page is called
   */
  mounted () {
    this.getAllItems()
  },
  // emergencytest
  computed: {
    getlabels () { // Automatically gets new Item after pushed in Vuex
      return this.$store.state.currentSelectedLabels
    },
    /**
     * The headers of the Grid
     * @value image, description, quantity, position, available, labels, actions
     */
    headers () { // Used to compute value from i18n into Header
      return [
        { text: this.$t('name'), value: 'name.' + this.$i18n.locale },
        { text: this.$t('description'), value: 'description.' + this.$i18n.locale },
        { text: this.$t('labels'), value: 'labels' },
        { text: this.$t('actions'), value: 'actions' }
      ]
    },
    /**
     * Used to compute value from i18n into Footer
     * * @value showFirstLastPage, firstIcon, lastIcon, prevIcon, nextIcon
     */
    footerprops () {
      return {
        showFirstLastPage: true,
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-minus',
        nextIcon: 'mdi-plus',
        'items-per-page-text': this.$t('productsPerPage')
      }
    }
  },
  watch: {
    /**
     * gets triggered if labels were added/removed in Searchbar
     */
    getlabels: function (labels: Label[]) {
      if (labels.length === 0) {
        /** If no Labels are selected show all Items */
        this.getAllItems()
      } else {
        /** getItems according to selected labels */
        this.items = []
        /** Generate and fill Array of labelIDs for payload */
        const labelIDs = []
        for (let x = 0; x < labels.length; x++) {
          labelIDs.push(labels[x]._id)
        }
        const search = { labelIds: labelIDs }
        ItemDataService.findByLabel(search) // get all Items which have all Labels via Axios
          .then(response => {
            // Iterates through Items and pushes them into an Array out of Items with labels ->
            for (let i = 0; i < response.data.length; i++) {
              const result: Item = {
                countable: response.data[i].countable,
                _id: response.data[i]._id,
                name: response.data[i].name,
                description: response.data[i].description,
                quantity: response.data[i].quantity
              }
              // Because Items are returned without their labels we fetch them here for each Item.
              LabelDataService.findLabelsByItemId(response.data[i]._id)
                // LabelDataService.getAll()
                .then(response2 => {
                  result.labels = response2.data
                  this.items.push(result)
                  this.itemsall.push(result)
                })
                .catch(e => {
                  console.error(e)
                })
            }
          })
          .catch(e => {
            // If Error, print it in console
            console.error(e.data)
            console.error(e.status)
            console.error(e.headers)
          })
      }
    }
  },
  methods: {
    /**
     * returns Name of label according to selected language
     */
    getLabelName (label) {
      return label.name[this.$i18n.locale]
    },
    /**
     * getAllItems via Axios
     */
    getAllItems () {
      ItemDataService.getAll()
        .then(response => {
          // iterates through response and pushs it into new Array
          for (var i = 0; i < response.data.length; i++) {
            const result: Item = response.data[i]

            /**
             * gets all Items according to selected Labels (SearchFunction)
             */
            LabelDataService.findLabelsByItemId(response.data[i]._id)
              .then(response2 => {
                result.labels = response2.data
                this.items.push(result)
                this.itemsall.push(result)
              })
              .catch(e => {
                console.error(e)
              })
          }
        })
        .catch(e => {
          // Falls Error, schreibe ihn in die Konsole
          console.error(e.data)
          console.error(e.status)
          console.error(e.headers)
        })
    },

    /**
     * checks if an item is available
     /**
     */
    isAvailable (verfuegbar: string) {
      if (verfuegbar === 'Ja') return 'mdi-check-bold'
      else if (verfuegbar === 'Nein') return 'mdi-cancel'
    },
    /**
     * checks the value of the color
     */
    whichColor (verfuegbar: string) {
      if (verfuegbar === 'Ja') return 'green'
      else if (verfuegbar === 'Nein') return 'red'
    },
    /**
     * label gets added into current labelsearch Array in VUEX
     */
    addlabelToSearch (label: Label) {
      /**
       * Checks if Label is already in selectedLabels -> if yes do nothing
       */
      const index = this.$store.state.currentSelectedLabels.findIndex(key => key._id === label._id)
      if (index === -1) this.$store.state.currentSelectedLabels.push(label)
    },
    /**
     * Item gets added into VUEX State and triggers ItemMenu
     */
    openItem (item: Item) {
      this.$store.state.selectedItem = null
      this.$store.state.selectedItem = item
      const randomColor = matColors.colors[Math.floor(Math.random() * matColors.colors.length)]
      const LightObject = {
        itemId: item._id,
        color: randomColor,
        duration: config.searchDuration
      }
      lightDataService.turnOnObject(LightObject).then(() => {
        this.$store.state.itemAvailable = true
      }).catch(err => {
        this.$store.state.itemAvailable = false
        console.error(err)
      })
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "en": {
    "lightsActivated": "Lights activated!!",
    "finished": "FINISHED",
    "count": "Count:",
    "name": "Name",
    "description": "Description",
    "position": "Position",
    "available": "Available",
    "labels": "Labels",
    "actions": "Actions",
    "productsPerPage": "Products per page"
  },
  "de": {
    "lightsActivated": "Lichter aktiviert! ",
    "finished": "Fertig",
    "count": "Anzahl",
    "name": "Name",
    "description": "Beschreibung",
    "position": "Position",
    "available": "Verfügbar",
    "labels": "Labels",
    "actions": "Aktionen",
    "productsPerPage": "Produkte pro Seite"
  }
}
</i18n>
<style>
/*Used to stripe the Grid*/
.theme--light.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, .03);
}
.theme--dark.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, .5);
}
</style>
