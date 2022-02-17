<template>
  <div>
  <v-row>
    <v-col class="offset-lg-3 col-lg-6">
  <v-container>
    <!-- AutoComplete SearchBar with Chips and slotted templates -->
    <v-autocomplete
      v-model="selectedLabels"
      :items="labels"
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
              <v-chip dark :color="item.colour"> {{ getName(item) }} </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-autocomplete>
  </v-container>
    </v-col>
  </v-row>
  </div>
</template>

<script lang="ts">
import LabelDataService from '@/services/labelDataService'
import { Item, Label } from '@/types/index.ts'
import i18n from '@/i18n'
import Vue from 'vue'

export default Vue.extend({
  name: 'SearchBar',
  data () {
    return {
      /**  stores the labels which are queried via the API-Route */
      labels: [],
      items: []
    }
  },
  computed: {
    /** computes the String concatenated with the current locale to get the according name from labels */
    getCurrentNameString () {
      return 'name.' + i18n.locale
    },
    /** computes the selectedLabels and push's + gets them into the Vuex-Store for Usage in Grid-Component */
    selectedLabels: {
      get () {
        return this.$store.state.currentSelectedLabels
      },
      set (value) {
        this.$store.state.currentSelectedLabels = value
      }
    }
  },
  /** On Mounted, get all Labels for later use in the V-Autocomplete Component */
  mounted () {
    LabelDataService.getAll() // getAllItems
      .then(response => {
        this.labels = response.data
      })
      .catch(e => {
        // Falls Error, schreibe ihn in die Konsole
        console.error(e)
      })
  },
  methods: {
    /**  returns the name Property of the current Item depending on selected Language in i18n
     * @property {item} is the Label-Object which should be parsed. */
    getName (item: Item) {
      return item.name[i18n.locale]
    },
    /** Removes the item from selectedLabels via the "x" Button on Chip in V-AutoComplete
     * @property {item} is the current Label-Object which should be deleted */
    remove (item: Item) {
      const index = this.selectedLabels.findIndex((key :Label) => key._id === item._id)
      if (index >= 0) this.selectedLabels.splice(index, 1)
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "en": {
    "search": "Search with labels"
  },
  "de": {
    "search": "Suche mit Labels"
  }
}
</i18n>
