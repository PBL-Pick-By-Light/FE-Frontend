<template>
  <div>
    <v-app id="item-menu">
      <v-row justify="center">
        <!--      Used to blur the Background and open a new "Modal"-->
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <!-- Used as wrapper -->
          <v-card>
            <v-card-title :style="combinedColor" class="text-h5 lighten-2" v-if="isAvailable">
                {{ $t('lightsActivated') }} <v-icon color="primary">mdi-lightbulb</v-icon>
            </v-card-title>
            <v-card-title :class="color" class="text-h5 red lighten-2" v-if="!isAvailable">
                {{ $t('notFound') }} <v-icon color="primary">mdi-lightbulb</v-icon>
            </v-card-title>
            <!-- displays description, quantity and name of the item -->
            <v-card-text>
              <v-row class="mt-3">
                <!-- Currently just a dummy picture, later from web/none/self taken -->
                <v-img
                  :src="require('@/assets/dummyPics/m5.jpg')"
                  class="my-3"
                  contain
                  height="200"
                />
                <h2>
                  {{getItem.name[getLang]}}
                </h2>
              </v-row>
              <v-row>
                <h3>
                  {{getItem.description[getLang]}}
                </h3>
              </v-row>
              <div class="mt-5" v-if="getItem.countable">
                <v-row>
                  <h3> {{ $t('count') }}: {{newQuantity}}</h3>
                </v-row>
                <v-row class="mt-5">
                  <!--  v-slider to change quantity of item  -->
                  <v-slider
                    v-model="numberValue"
                    track-color="grey"
                    always-dirty
                    min="0"
                    max="100"
                  >
                    <!-- Decrease count -->
                    <template v-slot:prepend>
                      <v-icon
                        @click="decrement"
                      >
                        mdi-minus
                      </v-icon>
                    </template>
                    <!--Increase count -->
                    <template v-slot:append>
                      <v-icon
                        @click="increment"
                      >
                        mdi-plus
                      </v-icon>
                    </template>
                  </v-slider>
                </v-row>
                <v-row justify="end">
                  <v-col
                    cols="2"
                    offset-md="0"
                    class="justify-end"
                  >
                    <!--  updates the item and puts it in DB    -->
                    <v-btn fab
                           @click="updateItem(false)">
                      <v-icon>mdi-arrow-up-bold</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="4"
                  >
                    <!-- v-text-field Input of the quantity of the selected item -->
                    <v-text-field
                      :label=" $t('count')"
                      outlined
                      v-model="numberValue"
                      type="number"
                      placeholder="1"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="4"
                  >
                    <!-- v-btn updates the selected Item with its properties -->
                    <v-btn
                      fab
                      @click="updateItem(true)">
                      <v-icon>mdi-arrow-down-bold</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn color="red" @click="deleteItem">{{ $t('delete') }}</v-btn>
              <v-spacer></v-spacer>
              <!--            close Dialog and end search-->
              <v-btn
                color="primary"
                text
                @click="dialog = false"
              >
                {{ $t('finished') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-app>
  </div>
</template>

<script lang="ts">

import { Item } from '@/types/index.ts'
import itemDataService from '@/services/itemDataService.ts'
import Vue from 'vue'
import lightDataService from '@/services/lightDataService'
import PositionDataService from '@/services/positionDataService'
export default Vue.extend({
  name: 'ItemMenu',
  data: () => ({
    numberValue: 1,
    overlay: false,
    zIndex: 0,
    dialog: false,
    isAvailable: false,
    newQuantity: 0,
    color: '#80ba24',
    backendPosition: null
  }),
  methods: {
    // Checks if User is Admin
    isAdmin () {
      if (localStorage.getItem('user') === null) return false
      return JSON.parse(localStorage.getItem('user')).role === 'admin'
    },
    // Deletes Item
    deleteItem () {
      itemDataService.delete(this.getItem._id)
    },
    // Increments the basket-Count of an item
    increment () {
      this.numberValue = this.numberValue + 1
    },
    // decrements the basket-Count of an item
    decrement () {
      this.numberValue = this.numberValue - 1
    },
    /*
    updates the quantity of an Item if the item has been taken out
    the item is updated by finding its ID
    the selected
     */
    updateItem (take:boolean) {
      if (take) {
        const newCount = this.newQuantity - this.numberValue
        if (newCount < 0) {
          console.error('Not enough Items!')
        }
        this.newQuantity = newCount
      } else {
        this.newQuantity = this.newQuantity + this.numberValue
      }
      this.backendPosition.quantity = this.newQuantity
      const testPosition = {
        itemId: this.backendPosition.itemId,
        quantity: 5
      }
      PositionDataService.updatePosition(this.backendPosition, this.backendPosition._id)
    }
  },
  computed: {
    combinedColor () {
      return 'background: ' + this.color
    },
    /**
     * gets the selected Language with its i18n tags
     **/
    getLang () {
      return this.$i18n.locale
    },
    /**
     * gets the selected item, stored in vuex store
     */
    getItem () : Item {
      return this.$store.state.selectedItem
    },
    getAvailable (): boolean {
      return this.$store.state.itemAvailable
    },
    searchColor (): string {
      return this.$store.state.itemSearchColor
    }
  },
  watch: {
    // Checks if Availability changes (from Grid)
    getAvailable (available: boolean) {
      this.isAvailable = available
    },
    // Checks if Color changes (from Grid)
    searchColor (newColor: string) {
      this.color = newColor
    },
    /**
     * turns the corresponding LEDs off, when the `v-dialog` window has been closed
     */
    dialog () {
      if (this.dialog === false) {
        lightDataService.turnOff(this.getItem.id).catch(err => {
          console.error(err)
        })
      }
    },
    // Checks if getItem was triggered (Select Option was triggered in Grid)
    getItem (newItem: Item) {
      // Opens Overlay
      this.dialog = true
      PositionDataService.findByItemId(newItem._id).then((result) => {
        this.newQuantity = result.data[0].quantity
        this.backendPosition = result.data[0]
      })
    }
  },
  /**
   * turns off LED, by getting Id from item after leaving Page
   */
  destroyed () {
    lightDataService.turnOff(this.getItem._id)
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "en": {
    "count": "Item Count",
    "notFound": "The Item wasn't found",
    "lightsActivated": "Lights activated!!",
    "finished": "FINISHED",
    "count": "Count:",
    "delete": "Delete Item:"
  },
  "de": {
    "count": "Anzahl",
    "notFound": "Das Item konnte nicht gefunden werden",
    "lightsActivated": "Lichter aktiviert! ",
    "finished": "Fertig",
    "count": "Anzahl:",
    "delete": "Löschen"
  }
}
</i18n>
