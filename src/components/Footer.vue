<template>
  <!-- @footer displays general Information about the Page -->
  <v-footer
    color="secondary"
    dark
    style="margin: 0; padding: 0"
  >
    <v-container fluid >
      <v-card color="secondary" class="white--text text-center"  style="margin: 0; padding: 0" outlined>
      <v-row style="margin: 0; padding: 0">
        <v-col style="margin: 0; padding: 0">
          <!-- @v-tooltip generates Information when hovering-->
          <v-tooltip v-for="title in 2"
                     :key="title" top>
            <!-- @template provides scoped objects from v-tooltip and activates event  -->
            <template v-slot:activator="{ on, attrs }">
        <v-card-text   v-bind="attrs"
                       v-on="on">
          <!-- @a displays the hrefs from data  -->
          <a class="white--text text-center" style="text-decoration-line: none" v-bind:href="Footertitles.Href[title]">{{$t(Footertitles.Name[title])}}</a>
        </v-card-text >
              <!-- @template provides scoped objects from v-tooltip and activates event  -->
            </template>
            <!-- @span displays the tooltip from data  -->
            <span>{{$t(Footertitles.Tooltip[title])}}</span>
          </v-tooltip>
      </v-col>
        <v-col style="margin: 0; padding: 0" >
          <!-- @v-tooltip generates Information when hovering-->
          <v-row>
          <v-tooltip v-for="title1 in 2"
                     :key="title1" top>
            <!-- @template provides scoped objects from v-tooltip and activates event  -->
            <template v-slot:activator="{ on, attrs }">
          <v-card-text
            v-bind="attrs"
            v-on="on">
            <!-- @a displays the hrefs from data  -->
          <a class="white--text text-center" style="text-decoration-line: none" v-bind:href="Footertitles1.Href[title1]" target="_blank">{{$t(Footertitles1.Name[title1])}}</a>
        </v-card-text>
            </template>
            <!-- @span displays the tooltip from data  -->
            <span>{{$t(Footertitles1.Tooltip[title1])}}</span>
          </v-tooltip>
          </v-row>

        <v-row style="margin: 0; padding: 0">
          <v-col style="margin: 0; padding: 0">
            <v-card style="margin: 0; padding: 0" color="secondary"
                    class="white--text text-center" outlined
            >
              <!-- sets the current Year -->
              <v-card-text style="margin: 0; padding: 0" class="white--text">
                {{ new Date().getFullYear() }}
                <v-icon small>
                  mdi-copyright
                </v-icon><strong>THM</strong>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        </v-col>
      <v-col>
      <v-card-text>
        <v-tooltip v-for="x in 3"  :key="x" bottom>
          <!-- @template provides scoped objects from v-tooltip and activates event  -->
          <template v-slot:activator="{ on, attrs }">
            <!-- @v-btn displays the hrefs of the icons from data  -->
        <v-btn
          class="mx-4 white--text"
          icon
          v-bind:href="icons.Href[x]"
          target="_blank"
          v-bind="attrs"
          v-on="on"
        >
          <!-- @v-icon displays the names of the icons from data  -->
          <v-icon size="24px" color="white">
            {{$t(icons.Name[x])}}
          </v-icon>
        </v-btn>
          </template>
          <!-- @span displays the tooltip from data  -->
          <span>{{$t(icons.Tooltip[x])}}</span>
        </v-tooltip>
      </v-card-text>
      </v-col>
      </v-row>
      </v-card>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  data: () => ({
    // the icons array include the Name, Href and Hover-text of the icons
    icons: {
      Name: ['', 'mdi-linkedin', 'mdi-instagram', 'mdi-gitlab'],
      Href: ['', 'https://de.linkedin.com/school/technische-hochschule-mittelhessen/', 'https://www.instagram.com/thmittelhessen/?hl=en', 'https://git.thm.de/softwaretechnik-projekt-pick-by-light-system-wise21_22'],
      Tooltip: ['', 'Linkedin', 'Instagram', 'Gitlab']
    },
    // the Footer-titles array include the Name, Href and Hover-text of the v-card-text
    Footertitles: {
      Name: ['', 'About us', 'Privacy'],
      Href: ['', '/about', 'https://www.thm.de/site/datenschutz.html'],
      Tooltip: ['', 'About us', 'Privacy']
    },
    // the Footer-titles array include the Name, Href and Hover-text of the v-card-text
    Footertitles1: {
      Name: ['', 'THMWebsite'],
      Href: ['', 'https://www.thm.de/site/'],
      Tooltip: ['', 'THMWebsite']
    }
  })
}
</script>
<i18n>
{
  "en": {
    "About us": "About us",
    "Privacy": "Privacy Policy",
    "Linkedin": "Technische Hochschule Mittelhessen at Linkedin",
    "Instagram": "Technische Hochschule Mittelhessen at Instagram",
    "Gitlab": "Technische Hochschule Mittelhessen at Gitlab",
    "THMWebsite": "THM-Website"
  },
  "de": {
    "About us": "Impressum",
    "Privacy": "Datenschutz",
    "Linkedin": "Technische Hochschule Mittelhessen bei Linkedin",
    "Instagram": "Technische Hochschule Mittelhessen bei Instagram",
    "Gitlab": "Technische Hochschule Mittelhessen bei Gitlab",
    "THMWebsite": "THM-Website"
  }
}
</i18n>

<style scoped>
</style>
