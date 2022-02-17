<template>
  <div>
<!--    Dialog for Displaying Assign Dialog-->
    <v-dialog         v-model="dialog"
                      width="600">
      <v-card   width="800">
<!--        Reusing Searchbar Component-->
        <search-bar></search-bar>
<!--        List for Displaying searched Items in Dialog-->
        <v-list
          subheader
          two-line
        >
          <v-subheader inset>Items</v-subheader>

          <v-list-item
            v-for="item in items"
            :key="item.id"
            @click="assignItem(item)"
          >
            <v-list-item-avatar>
              <v-icon
                class="grey lighten-1"
                dark
              >
                mdi-screw-round-top
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.name.de"></v-list-item-title>

              <v-list-item-subtitle v-text="item.description.de"></v-list-item-subtitle>
            </v-list-item-content>
            Assign
            <v-list-item-action class="">
<!--              Button isn't used because whole Item can be Clicked-->
              <v-btn class="" icon>
                <v-icon color="green lighten-1">mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
<!--    Dialog for Displaying Item-Dialog-->
    <v-dialog         v-model="itemDialog"
                      width="600">
      <v-card   width="800" height="300">
        <!--        Reusing Searchbar Component-->
        <!--        List for Displaying searched Items in Dialog-->
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
              Placeholder
            </h2>
          </v-row>
          <v-row>
            <h3>
              Placeholder
            </h3>
          </v-row>

        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container>
<!--    Selecting Shelf Box-->
    <v-card class="mt-4">
    <v-row >
      <v-col cols="8" offset="2">
        <!-- @v-autocomplete to select a shelf from shelves-->
      <v-autocomplete
        chips
        label="Select Shelf"
        placeholder="Select Shelf"
        dense
        return-object
        filled
        v-model="selectedShelf"
        :items="shelves"
        item-text="number"
      >
        <template v-slot:item="{ item, on, attrs }">
          <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
            <!--          Enables CheckBox usage to select multiple labels-->
            <v-list-item-action>
              <v-checkbox :color="item.colour" :input-value="active"> </v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                <v-row>
                  <v-col><v-chip dark> {{ item.number }} </v-chip></v-col>
                  <v-col><v-btn color="red" @click="deleteShelf(item)">Delete</v-btn> </v-col>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-autocomplete>
      </v-col>

    </v-row>
<!--    Grid for displaying loaded Positions -->
    <v-container class="mt-3">
      <v-row class="d-flex  ml-1 align-center justify-center" v-for="y in this.rowCount"
             :key="y">
          <v-col
            v-for="x in rowLength"
            :key="x"
            cols="auto"
            sm="1">

            <v-card :height="sizeOfBox" :width="sizeOfBox" class="d-flex align-center justify-center" @click="setSelectedPosition(x,y)" v-if="!occupied(x,y)">
              <div class="my-2">
                <v-btn
                  color="secondary"
                  fab
                  x-small
                  dark
                >
                  <v-icon>mdi-plus-box</v-icon>
                </v-btn>
              </div>
            </v-card>
            <v-card :height="sizeOfBox" :width="sizeOfBox" class="d-flex align-center justify-center" color="#FF6600" v-if="occupied(x,y)" @click="deleteItemFromPosition(x,y)">
              <div class="my-2">
                <v-btn
                  color="secondary"
                  fab
                  dark
                  x-small
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-col>
      </v-row>
    </v-container>

    </v-card>
    </v-container>

  </div>
</template>
<script lang="ts">
/* eslint-disable brace-style */
import shelvesDataService from '@/services/shelvesDataService'
import Vue from 'vue'
import { Item, Position, BackendPosition, Label } from '@/types'
import SearchBar from '@/components/SearchBar.vue'
import ItemDataService from '@/services/itemDataService'
import LabelDataService from '@/services/labelDataService'
import PositionDataService from '@/services/positionDataService'
import ShelfDirectDataService from '@/services/shelfDirectDataService'
import RoomsDataService from '@/services/roomsDataService'
export default Vue.extend({
  name: 'ItemToShelf',
  components: {
    SearchBar
  },
  data () {
    return {
      rowLength: 0,
      occupiedPositions: null,
      rowCount: 0,
      itemDialog: false,
      selectedShelf: null,
      shelves: [],
      items: [],
      windowSize: {
        x: 0,
        y: 0
      },
      allPositionsFromShelf: [],
      selectedRoomFromShelfIP: '',
      quantity: 0,
      itemsall: [],
      selectedPosition: { x: 0, y: 0 },
      shelfPositions: [] as Position[],
      NameOfPosition: '',
      dialog: false
    }
  },
  watch: {
    dialog () {
      this.updateShelf()
    },
    /**
     * Checks if SelectedLabels are changed
     */
    '$store.state.currentSelectedLabels' () {
      this.fetchItemsFromLabels(this.$store.state.currentSelectedLabels)
    },
    /**
     * If Shelf selected fetch all Positions
     * First fetch all Rooms to get IP-Address for PI from
     */
    selectedShelf () {
      this.updateShelf()
    }
  },
  /**
   * creates an Event Listener to handle windowsize(resize)
   */
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  /**
   * destroys an Event Listener to handle windowsize(resize)
   */
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  computed: {
    /**
     * gets the size of the box of the shelf depending of the windowsize
     */
    sizeOfBox () {
      const ausgangswert = 80
      if (this.windowSize.x < 500) return 60
      return (ausgangswert / 1920) * (this.windowSize.x) // <!--  width = Ursprungsgröße (50) / 1920 (Standardgröße) -->
    },
    /**
     * Settings for the draggable Objects
     */
    dragOptionsChips () {
      return {
        animation: 200,
        group: 'group',
        disabled: false,
        ghostClass: 'ghost',
        sort: true
      }
    }
  },
  mounted () {
    /**
     * Gets all Shelves as Array via shelvesDataService
     */
    shelvesDataService.getAll().then(response => {
      this.shelves = response.data
    })
    /**
     * Gets current Screen-Size
     */
    this.onResize()
  },
  methods: {
    /**
     * @param Shelf which should be deleted from Embedded AND Backend
     * */
    deleteShelf (shelf: any) {
      RoomsDataService.getAll().then(rooms => {
        const roomFromShelf = rooms.data.find(o => o._id === shelf.roomId)
        const payload: any = { ShelfNumber: shelf.number }
        ShelfDirectDataService.deleteShelf(payload, roomFromShelf.ipAddress).then(() => {
          shelvesDataService.delete(shelf._id)
        }).catch(err => {
          console.error(err)
        })
      }).catch(err => {
        console.error(err)
      })
    },
    myEventHandler (e) {
      this.onResize()
    },
    /**
     * sets the windowsize depending the innerhight/width
     */
    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },

    /**
     * deletes Item with Coordinate x,y from Position
     * @param x Coordinate of Item
     * @param y Coordinate of Item
     */

    deleteItemFromPosition (x, y) {
      const positionNumber = (y * this.rowLength) + x - this.rowLength
      const numberArray = [positionNumber]
      var filteredArray = this.occupiedPositions.filter(function (position) {
        return numberArray.indexOf(position.number) > -1
      })
      PositionDataService.delete(filteredArray[0]._id).then(this.updateShelf).catch(err => {
        console.error(err)
      })
    },
    /**
     * updates the Shelf after Position is filled with Item
     */
    updateShelf () {
      RoomsDataService.getAll().then(rooms => {
        const roomFromShelf = rooms.data.find(o => o._id === this.selectedShelf.roomId)
        this.selectedRoomFromShelfIP = roomFromShelf.ipAddress
        ShelfDirectDataService.getPositions(this.selectedShelf.number, roomFromShelf.ipAddress).then((result) => {
          this.allPositionsFromShelf = JSON.parse(result.data).Positions
          this.checkOccupiedPositions()
          /**
           * Get rowLength from PositionId 0
           */
          const pos0Value = this.allPositionsFromShelf.filter(value => {
            return value.PositionId === 0
          })
          // Calculate RowLength based on 255 - LED should be saved in Backend in the Future
          this.rowLength = 255 - pos0Value[0].LEDs[0]
          // Calculate rowCount based on rowLength + PositionCount
          this.rowCount = (this.allPositionsFromShelf.length - 1) / this.rowLength
        })
      })
    },
    /**
     *  Returns true if the filtered Array filed
     * @param x The Screen x Coordinate of the ShelfPosition
     * @param y The Screen y Coordinate of the ShelfPosition
     */
    occupied (x, y) {
      const positionNumber = (y * this.rowLength) + x - this.rowLength
      const numberArray = [positionNumber]
      var filteredArray = this.occupiedPositions.filter(function (position) {
        return numberArray.indexOf(position.number) > -1
      })
      if (filteredArray.length > 0) return true
      return false
    },
    /**
     * checks the occupied Position in the selected Shelf
     */
    checkOccupiedPositions () {
      PositionDataService.getAll().then(result => {
        const shelfArray = [this.selectedShelf._id]
        var filteredArray = result.data.filter(function (position) {
          return shelfArray.indexOf(position.shelfId) > -1
        })
        this.occupiedPositions = filteredArray
      })
    },
    /**
     * Returns PositionNumber according to Selected Position
     */
    embeddedPositionNumber () {
      return (this.selectedPosition.y * this.rowLength) + this.selectedPosition.x - this.rowLength
    },
    /**
     * fills this.items with items which have all selected labels as Attributes
     * @param labels
     */
    fetchItemsFromLabels (labels : Label[]) {
      if (labels.length === 0) {
        /** If no Labels are selected show all Items */
        this.getAllItems()
      } else {
        this.items = []
        const labelIDs : string[] = []
        labels.forEach((value : Label) => {
          labelIDs.push(value._id)
        })
        const search = { labelIds: labelIDs }
        ItemDataService.findByLabel(search) // get all Items which have all Labels via Axios
          .then(response => {
            this.items = response.data
          })
      }
    },
    /**
     * MAIN FUNCTION
     *  Assigns Item to Position in Backend
     * @param item which should be Assigned to Position
     */
    assignItem (item:Item) {
      /** Number = Position.id from Embedded Position */
      const newPosition:BackendPosition = {
        itemId: item.id,
        number: this.embeddedPositionNumber(),
        quantity: this.quantity + 1,
        shelfId: this.selectedShelf._id
      }
      PositionDataService.create(newPosition).then(response => {
        this.dialog = false
      }).catch(err => {
        console.error(err)
      })
    },
    getAllItems () {
      ItemDataService.getAll()
        .then(response => {
          // iterates through response and pushs it into new Array
          for (var i = 0; i < response.data.length; i++) {
            const result: Item = {
              countable: false,
              id: response.data[i]._id,
              name: response.data[i].name,
              description: response.data[i].description,
              quantity: response.data[i].quantity
            }
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
    /** SelectedPosition gets updated by clicking on a Position on Website */
    setSelectedPosition (x:number, y:number) {
      this.selectedPosition.x = x
      this.selectedPosition.y = y
      this.dialog = true
      this.items = []
      this.getAllItems()
      this.lightUpSelectedPosition()
    },
    /** Trigger Lights */
    lightUpSelectedPosition () {
      this.resetShelfLeds().then((result :any) => {
        const payload = {
          ShelfNumber: this.selectedShelf.number,
          PositionId: this.embeddedPositionNumber(),
          Color: '#FF00FF'
        }
        ShelfDirectDataService.turnOnPosition(payload, this.selectedRoomFromShelfIP)
      })
    },

    /** Resets all Lights via Existing Positions */
    async resetShelfLeds  () {
      return ShelfDirectDataService.turnOffAllPositions(this.selectedShelf.number, this.selectedRoomFromShelfIP)
    }
  }
})
</script>

<style >
</style>
