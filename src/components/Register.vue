<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-top justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" >
              <!-- title of the v-card -->
              <v-card-title class="text-center justify-center">
               {{ $t('Register')}}
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid">
<!--                  <v-text-field-->
<!--                    prepend-icon="mdi-at"-->
<!--                    name="email"-->
<!--                    label="Email"-->
<!--                    type="text"-->
<!--                  ></v-text-field>-->
                  <v-text-field
                    prepend-icon="mdi-account"
                    name="Username"
                    v-model="username"
                    :label="$t('Username')"
                    type="text"
                    :rules="usernameRules"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    name="password1"
                    v-model="password"
                    :label="$t('Password')"
                    type="password"
                    :rules="passwordRules"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    name="password2"
                    :rules="passwordRules"
                    v-model="password2"
                    :label="$t('Passwordagain')"
                    type="password"
                    @keyup.enter="register()"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                </v-form>
                <v-card-actions class="justify-center">
                  <v-btn
                    :disabled="!valid"
                    elevation="12"
                    @keyup.enter="register"
                    @click="register">{{ $t('Register') }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <div>
      <v-snackbar
        v-model="successTrigger"
        color="success"
      >
        {{ text }}
        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="successTrigger = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <v-snackbar
      v-model="errorTrigger"
      color="red"
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="errorTrigger = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { User } from '@/types'
import authDataService from '@/services/authDataService'

export default Vue.extend({
  name: 'Register',
  data: () => ({
    valid: true,
    username: '',
    password: '',
    password2: '',
    text: null as any,
    loginActive: false,
    errorTrigger: false,
    successTrigger: false,
    snackbar: '',
    usernameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 15) || 'Name must be less than 10 characters'
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length > 5) || 'Password must be at least 5 characters'
    ]
  }),
  methods: {
    /**
     * saves the input Data into the interface User and passes into the authDataService
     */
    register () {
      if (this.password === this.password2) {
        const user: User = { username: this.username, password: this.password }
        authDataService.register(user)
          .then((result) => {
            this.text = this.$t('Remember')
            this.successTrigger = true
            this.loginActive = false
            this.$router.push('/login')
          })
          .catch(err => {
            this.loginActive = false
            console.error(err)
            this.text = err
            this.errorTrigger = true
          })
      }
    }
  }
})
</script>

<i18n>
{
  "en": {
    "RegisterSuccess": "Successfully registered!",
    "Passwordagain": "Password",
    "Remember": "Remember me",
    "LastName": "Last name",
    "FirstName": "First name",
    "Username": "Username",
    "Password": "Password",
    "Register": "Register",
    "SurnameIsRequired": "Last name is required",
    "NameIsRequired": "First name  is required",
    "PasswordIsRequired": "Password  is required",
    "UsernameIsRequired": "Username  is required",
    "EmailIsRequired": "Email is required",
    "InvalidPwPattern": "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
    "InvalidMailPattern": "Invalid E-mail",
    "Required": "Required"
  },
  "de": {
    "RegisterSuccess": "Erfolgreich registriert!",
    "Passwordagain": "Passwort bestätigen",
    "Remember": "Eingeloggt bleiben",
    "LastName": "Nachname",
    "FirstName": "Vorname",
    "Username": "Benutzername",
    "Password": "Passwort",
    "Register": "Registrieren",
    "SurnameIsRequired": "Nachname ist erforderlich",
    "NameIsRequired": "Vorname ist erforderlich",
    "PasswordIsRequired": "Passwort ist erforderlich",
    "UsernameIsRequired": "Benutzername ist erforderlich",
    "EmailIsRequired": "Email ist erforderlich",
    "InvalidPwPattern": "Minimum acht Zeichen, mindestens ein Großbuchstabe, ein Kleinbuchstabe, eine Zahl und ein Sonderzeichen ",
    "InvalidMailPattern": "Ungültige E-mail",
    "Required": "Erforderlich"

  }
}
</i18n>
