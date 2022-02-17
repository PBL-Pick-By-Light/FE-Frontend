<template>
    <v-card>
      <v-card-title class="justify-center">
        {{$t('new')}} {{$t('room')}}
      </v-card-title>
      <v-row><v-col>
        <v-spacer></v-spacer>
      </v-col>
        <v-col>
          <!-- the input value is the name of the room-->
          <v-text-field style="margin-right: 12px;margin-left:
          12px;align-self: center" v-model="roomName"
                        :label="$t('enter')">
          </v-text-field>
        </v-col>
        <v-col>
          <!-- the input value is the IP-Address of the room-->
          <v-text-field style="margin-right: 12px;margin-left:
          12px;align-self: center" v-model="ipAddress"
                        :label="$t('enter1')">
          </v-text-field>
        </v-col>
        <v-col>
          <v-spacer></v-spacer>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col>
          <v-spacer>
          </v-spacer>
        </v-col>
        <v-col>
      <v-card-actions>
        <!-- triggers the function create Room and passes the input value to DataService -->
        <v-btn
          color="primary"
          text
          @click="createRoom"
        >
          {{ $t('add new') }}
        </v-btn>
      </v-card-actions>
        </v-col>
        <v-col><v-spacer></v-spacer></v-col>
      </v-row>
    </v-card>
</template>

<script lang="ts">
import RoomsDataService from '../services/roomsDataService'
import { Room } from '@/types'
import Vue from 'vue'
export default Vue.extend({
  name: 'Room',
  data () {
    return {
      roomName: '',
      ipAddress: '192.168.0.1'
    }
  },
  methods: {
    /**
     * creates a Room and passes the response to DataService
     */
    createRoom () {
      if (this.validateIPAddress()) {
        const newRoom: Room = {
          name: { de: this.roomName, en: this.roomName },
          ipAddress: this.ipAddress
        }

        RoomsDataService.create(newRoom)
          .catch(e => {
            console.error(e)
          })
        this.roomName = ''
        this.ipAddress = ''
      }
    },
    validateIPAddress () {
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.ipAddress)) {
        return true
      }
      alert('You have entered an invalid IP address!')
      return false
    }
  }
})
</script>
<i18n>
{
  "en": {
    "room": "Room",
    "add": "add",
    "new": "new",
    "add new": "add new Room",
    "enter": "Enter Room Name",
    "enter1": "Enter IP-Address"
  },
  "de": {
    "room": "Raum",
    "add": "hinzufügen",
    "new": "Neuer",
    "add new": "neuen Raum hinzufügen",
    "enter": "Raumname",
    "enter1": "IP-Adresse eingeben"
  }
}
</i18n>

<style scoped>

</style>
