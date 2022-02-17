<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-top justify-center>
          <v-flex xs16 sm12 md8>
            <v-card class="elevation-12" style="border-radius:20px">
              <v-row>
                <v-col class="col-lg-4  col-6">
                  <v-container>
                    <!-- AutoComplete SearchBar with Chips and slotted templates -->
                    <v-autocomplete
                      v-model="selectedRoom"
                      :items="completeRooms"
                      chips
                      :item-text="getCurrentNameString"
                      filled
                      return-object
                      dense
                      :label="$t('room')"
                    >
                      <!-- @template Use this slot for the selected Labels inside V-Autocomplete -->
                      <template v-slot:selection="data">
<!--                        {{ getName(data.item) }}-->
                        <v-chip> {{getName(data.item)}} </v-chip>
                      </template>
                      <!-- @template Use this slot for the expanded List when V-Autocomplete is selected -->
                      <template v-slot:item="{ item, on, attrs }">
                        <v-list-item v-on="on" v-bind="attrs">
                          <!--          Enables CheckBox usage to select multiple labels-->
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-chip> {{ getName(item) }} </v-chip>
<!--                              <v-btn>X</v-btn>-->
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <!-- @template -->
                      <template v-slot:append-item>
                        <v-list-item>
                          <span class="subheading">{{ $t('newroom') }}</span>
                          <v-spacer></v-spacer>
                          <!-- dialog for entering a new roomname-->
                          <v-dialog v-model="dialogRoom" max-width="90%">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="secondary"
                                label
                                small
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon>
                                  mdi-plus
                                </v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <room></room>
                            </v-card>
                          </v-dialog>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-container>
                </v-col>
                <v-col class="col-lg-4 col-6">
                  <v-container>
                    <v-text-field :label="$t('IP')" filled disabled :value="selectedRoom.ipAddress"></v-text-field>
                  </v-container>
                </v-col>
                <v-col class="col-lg-4 col-12">
                  <v-container>
                    <!-- AutoComplete SearchBar with Chips and slotted templates -->
                    <v-autocomplete
                      v-model="selectedMacAdress"
                      :items="this.allMacAdresses"
                      chips
                      filled
                      dense
                      :label="$t('MACaddress')"
                    >
                    </v-autocomplete>
                  </v-container>
                </v-col>
              </v-row>
              <v-row class="ml-5">
                <v-col>
                <v-spacer></v-spacer>
                </v-col>
                <v-col>
                  <!-- input field for the amount of rows of the shelf -->
                  <!-- validates if input is required or include strings -->
                  <v-text-field
                    :label="$t('rows')"
                    clearable
                    v-model="rowcounter"
                    @change="currentRowCounter"
                    :rules="rules">
                  </v-text-field>
                </v-col>
                <v-col>
                <!-- input field for the amount of columns of the shelf -->
                  <!-- validates if input is required or include strings -->
                  <v-text-field
                    :label="$t('columns')"
                    clearable
                    v-model="slider"
                    @input="Shelf.Columns"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-spacer></v-spacer>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <!-- @v-slider for the amounts of columns in the self-->
            <v-slider
              v-model="slider"
              thumb-label="always"
              :label="$t('columns')"
              max="10"
            min="1">
              <!-- @template prepends a slot to the component when clicked on the icon -->
              <template v-slot:prepend>
                <v-icon
                  @click="decrementColumns">
                  mdi-minus
                </v-icon>
              </template>
              <!-- @template appends a slot to the component when clicked on the icon -->
              <template v-slot:append>
                <v-icon
                  @click="incrementColumns">
                  mdi-plus
                </v-icon>
              </template>
            </v-slider>
                </v-col>
              </v-row>
              <v-row v-if="isMobile">
                <v-col>
                <v-slider
                  @mouseup="setSelectedLeds"
                  :label="$t('rows')"
                  thumb-label="always"
                  v-model="rowcounter"
                  max="20"
                  min="1">
                  <!-- @template prepends a slot to the component when clicked on the icon -->
                  <template v-slot:prepend>
                    <v-icon
                      @click="incrementRows">
                      mdi-plus
                    </v-icon>
                  </template>
                  <!-- @template appends a slot to the component when clicked on the icon -->
                  <template v-slot:append>
                    <v-icon
                      @click="decrementRows">
                      mdi-minus
                    </v-icon>
                  </template>
                </v-slider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="11">
                  <!-- v-sheets are created, @slider are the amount of columns, @rowcounter amount of rows-->
              <v-row v-for="x in rowcounter"
              :key="x" class="ml-5 ">
                <v-col
                v-for="n in slider"
                :key="n"
                sm="1"
                style="margin-left: 0px; padding-left: 0px">
              <v-sheet
                color="grey"
                elevation="24"
                height="20"
               :width="sizeOfBox"
                style="padding: 0px"
              ></v-sheet>
              </v-col>
              </v-row>
                </v-col>
                <v-col cols="1" v-if="!isMobile">
                  <!-- @v-slider for the amounts of rows in the self-->
                  <v-slider
                  @mouseup="setSelectedLeds()"
                  :label="$t('rows')"
                  thumb-label="always"
                  v-model="rowcounter"
                  max="20"
                  min="1"
                vertical>
                    <!-- @template prepends a slot to the component when clicked on the icon -->
                  <template v-slot:prepend>
                    <v-icon
                      @click="incrementRows">
                      mdi-plus
                    </v-icon>
                  </template>
                    <!-- @template appends a slot to the component when clicked on the icon -->
                  <template v-slot:append>
                    <v-icon
                      @click="decrementRows">
                      mdi-minus
                    </v-icon>
                  </template>
                </v-slider>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <!-- this button triggers the add Row function -->
                <v-btn :disabled="disableAddRowButton"
                  @click ="addRow"
                elevation="2"
                style="margin-left:35px"
                >{{$t('addrow')}}</v-btn>
                </v-col>
                <v-col>
                  <!-- this button triggers the delete Row function -->
                  <v-btn :disabled="disableDeleteButton" @click ="deleteRow"
                         elevation="2"
                         style="margin-left:35px"
                  >{{ $t('deleterow') }}</v-btn>
                </v-col>
                <v-col>
                  <v-btn @click ="createShelf"
                         elevation="2"
                         style="margin-left:35px"
                  >{{ $t('submit') }}</v-btn>
                </v-col>
              </v-row>
              <v-snackbar
                v-model="snackbar"
                :multi-line="multiLine"
              >
                {{ text }}
                <template v-slot:action="{ attrs }">
                  <v-btn
                    color="green"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                  >
                    {{ $t('close') }}
                  </v-btn>
                </template>
              </v-snackbar>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import RoomsDataService from '../services/roomsDataService'
import ShelfDirectDataService from '../services/shelfDirectDataService'
import ShelfDataService from '../services/shelvesDataService'
import Vue from 'vue'
import Room from '../components/Room.vue'
import i18n from '@/i18n'

export default Vue.extend({
  components: { Room },
  data: () => ({
    selectedMacAdress: '',
    selectedIP: '',
    dialogRoom: false,
    dialogMAC: false,
    dialogIP: false,
    selectedRoom: '',
    rooms: {
      namede: [String],
      nameen: [String]
    },
    rules: [v => !!v || 'This field is required',
      v => /^\d{1,2}$/.test(v) || 'This field only accept numbers'],
    roomsize: Number,
    macsize: Number,
    MACS: [],
    IPS: [],
    windowSize: {
      x: 0,
      y: 0
    },
    ipAddress: String,
    slider: 1,
    rowcounter: 1,
    allMacAdresses: [],
    completeRooms: [],
    allIPAdresses: [],
    macaddress: '',
    addRowButton: true,
    submitButton: true,
    deleteButton: true,
    multiline: true,
    snackbar: false,
    text: 'Shelf has been created',
    Shelf: {
      Rows: '',
      Columns: Number,
      Shelfname: '',
      Roomname: ''
    }
  }),
  watch: {
    /**
     * gets the current selected Room
     * @param newRoom is the new slected room
     */
    selectedRoom (newRoom: any) {
      this.getMacAdresses(newRoom)
    },
    /**
     * gets MAC Adress for this Room
     */
    selectedMacAdress () {
      const allLeds = Array.from(Array(100).keys())
      const payload = {
        Mac_Address: '3C:71:BF:AA:AC:08',
        LEDs: allLeds,
        Color: '#FF00FF'
      }
      ShelfDirectDataService.setLEDsWObject(payload, this.selectedRoom.ipAddress)
    },
    /**
     * If slider has changed Light Up Shelf on selected Positions
     */
    slider () {
      this.resetShelfLeds().then((result :any) => {
        const allLeds = Array.from(Array(this.slider * this.rowcounter).keys())
        const payload = {
          Mac_Address: '3C:71:BF:AA:AC:08',
          LEDs: allLeds,
          Color: '#FF00FF'
        }
        ShelfDirectDataService.setLEDsWObject(payload, this.selectedRoom.ipAddress)
      })
    },
    /**
     * If row has changed reset Light -> Light Up Shelf on selected Positions
     */
    rowcounter () {
      this.resetShelfLeds().then(result => {
        const allLeds = Array.from(Array(this.slider * this.rowcounter).keys())
        const payload = {
          Mac_Address: '3C:71:BF:AA:AC:08',
          LEDs: allLeds,
          Color: '#FF00FF'
        }
        ShelfDirectDataService.setLEDsWObject(payload, this.selectedRoom.ipAddress)
      })
    }
  },
  methods: {
    getName (item: any) {
      return item.name[i18n.locale]
    },
    /**
     * Sets selected LEDs (shown as Grid) in Color
     */
    setSelectedLeds () {
      this.resetShelfLeds().then((result :any) => {
        const allLeds = Array.from(Array(this.slider * this.rowcounter).keys())
        const payload = {
          Mac_Address: '3C:71:BF:AA:AC:08',
          LEDs: allLeds,
          Color: '#FF00FF'
        }
        ShelfDirectDataService.setLEDsWObject(payload, this.selectedRoom.ipAddress)
      })
    },
    /**
     * Turns Off all Leds
     */
    async resetShelfLeds  () {
      const allLeds = Array.from(Array(80).keys())
      const payload = {
        Mac_Address: '3C:71:BF:AA:AC:08',
        LEDs: allLeds
      }
      return ShelfDirectDataService.unsetLEDsWObject(payload, this.selectedRoom.ipAddress)
    },
    getMacAdresses (room) {
      /**
       * getMacAdresses needs to connect to IP from room.ipAddress
       *
      */
      ShelfDirectDataService.getMacAddresses(this.selectedRoom.ipAddress) // getAllRooms via Embedded
        .then(response => {
          this.allMacAdresses = response.data
        })
        .catch(e => {
          // If Exception, write it on Console
          console.error(e)
        })
    },
    /** Creates Shelf */
    createShelf () {
      var highestNum = 0
      /**
       * Gets highest Number for new unique Number should be replaced with Counter in Backend
       */
      ShelfDataService.getAll().then(response => {
        response.data.forEach(value => {
          if (value.number > highestNum) {
            highestNum = value.number + 1
          }
        })
        const newShelf = {
          ShelfNumber: highestNum,
          Mac_Address: this.selectedMacAdress,
          Positions: []
        }
        ShelfDirectDataService.createShelf(newShelf, this.selectedRoom.ipAddress).then(response => {
          /**
             * Create Shelf in Backend
             */
          const shelf = {
            number: highestNum,
            roomId: this.selectedRoom._id
          }
          ShelfDataService.create(shelf)

          /**
           * Create first Position with Row-Length in LEDs   Used for displaying Exact Grid later on in Assign_items.
           * High-Led Number used because LED cannot be "used" twice
           * BestPractice: Save Number in Backend, not implemented yet.
           */
          const shelfPosition = {
            ShelfNumber: highestNum,
            PositionId: 0,
            LEDs: [255 - this.slider]
          }
          ShelfDirectDataService.createPosition(shelfPosition, this.selectedRoom.ipAddress)
        }).then(response => {
          /**
           * Create each Position in Embedded
           * */
          const totalPositions = this.slider * this.rowcounter
          for (let i = 0; i < totalPositions; i++) {
            const shelfPosition = {
              ShelfNumber: highestNum,
              PositionId: i + 1,
              LEDs: [i]
            }
            ShelfDirectDataService.createPosition(shelfPosition, this.selectedRoom.ipAddress).catch(err => {
              console.error(err)
            })
          }
        }).then(response => {
          this.submit()
        })
          .catch(err => {
            console.error(err)
          })
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
     * decreases the size of the columns of the shelf
     * is used in the horizontal Column Slider
     */
    decrementColumns () {
      this.slider--
    },
    /**
     * increases the size of the columns of the shelf
     * is used in the horizontal Column Slider
     */
    incrementColumns () {
      this.slider++
    },
    /**
     * decreases the size of the rows of the shelf
     * is used in the vertical Row Slider
     */
    decrementRows () {
      this.rowcounter--
    },
    /**
     * increases the size of the columns of the shelf
     * is used in the vertical Row Slider
     */
    incrementRows () {
      this.rowcounter++
    },
    /**
     * increases the size of the row
     * this function is executed with the 'add row button'
     */
    addRow () {
      this.rowcounter++
    },
    /**
     * decreases the size of the row
     * this function is executed with the 'delete row button'
     */
    deleteRow () {
      this.rowcounter--
    },
    /**
     * currentRowCounter ()     */
    currentRowCounter () {
      return this.rowcounter
    },
    /**
     * resets the form to default
     */
    submit () {
      this.resetSilder()
      this.resetRowcounter()
      this.Shelf.Shelfname = ''
      this.selectedRoom = ''
      this.selectedIP = ''
      this.selectedMacAdress = '3C:71:BF:AA:73:F0'
      this.openSnackbar()
    },
    /**
     * opens a popup for shelf created
     */
    openSnackbar () {
      this.snackbar = true
    },
    /**
     * resets the amount of columns
     */
    resetSilder () {
      this.slider = 1
    },
    /**
     * resets the amount of rows
     */
    resetRowcounter () {
      this.rowcounter = 1
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
  mounted () {
    /**
     * connects with the RoomsDataService and returns all Rooms
     */
    RoomsDataService.getAll().then(response => {
      this.completeRooms = response.data
    })
    this.onResize()
  },
  /**
   * gets the current name as string connected with i18n tag
   */
  computed: {
    /**
     * Checks if Screensize is mobile
     */
    isMobile () {
      if (window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },
    getCurrentNameString () {
      return 'name.' + this.$i18n.locale
    },
    /**
     * gets the size of the box of the shelf depending of the windowsize
     */
    sizeOfBox () {
      const ausgangswert = 50
      return (ausgangswert / 1920) * this.windowSize.x // <!--  width = Ursprungsgröße (50) / 1920 (Standardgröße) -->
    },
    /**
     * disables add Row Button when the amount of rows is higher then 9
     */
    disableAddRowButton () {
      if (this.rowcounter > 9) {
        return (this as any).addRowButton
      }
      return !this.addRowButton
    },
    /**
     * disables delete Button when the amount of rows is 1
     */
    disableDeleteButton () {
      if (this.rowcounter < 2) {
        return this.deleteButton
      }
      return !this.deleteButton
    }
  }
})
</script>
<i18n>
{
  "en": {
    "room": "Room",
    "IP": "IP-Address",
    "MACaddress": "MAC-Address",
    "Shelfname": "Shelfname",
    "rows": "Rows",
    "columns": "Columns",
    "addrow": "add Row",
    "deleterow": "delete Row",
    "createShelf": "create Shelf",
    "newroom": "new Room",
    "newip": "new IP-Address",
    "enterroomname": "Enter Roomname",
    "createroom": "create Room",
    "enterip": "enter IP-Address",
    "createip": "create IP-Address",
    "submit": "submit",
    "close": "close"
  },
  "de": {
    "room": "Raum",
    "IP": "IP-Addresse",
    "MACaddress": "MAC-Adresse",
    "Shelfname": "Schrankname",
    "rows": "Reihen",
    "columns": "Spalten",
    "addrow": "Reihe hinzufügen",
    "deleterow": "Reihe löschen",
    "createshelf": "Schrank erstellen",
    "newroom": "Neuer Raum",
    "newip": "Neue IP-Adresse",
    "enterroomname": "Eingabe Raumname",
    "createroom": "Raum hinzufügen",
    "enterip": "IP-Adress eingeben",
    "createip": "IP-Adresse hinzufügen",
    "submit": "hinzufügen",
    "close": "schließen"
  }
}
</i18n>

<style scoped>

</style>
