<template>
<v-app>
<v-main>
         <v-container fluid fill-height>
            <v-layout align-top justify-center>
               <v-flex xs12 sm8 md4>
<v-card>
  <v-card-title class="justify-center text-center">
    Login
  </v-card-title>
     <v-card-text>
<v-form ref="form" v-model="valid">
  <!-- v-text-field for username input-->
<v-text-field
    prepend-icon="mdi-account"
    name="login"
    v-model="username"
    :label="$t('Username')"
    type="text"
    required
    :rules="usernameRules"
></v-text-field>
  <!-- v-text-field for password input-->
    <v-text-field
    prepend-icon="mdi-lock"
    name="password"
    v-model="password"
    :label="$t('Password')"
    type="password"
    required
    :rules="passwordRules"
    v-on:keyup.enter="login"
    ></v-text-field>
    <v-spacer></v-spacer>
</v-form>
<v-card-actions class="justify-center">
  <v-progress-circular
    v-if="loginActive"
    class="mr-3"
    indeterminate
    color="primary"
  ></v-progress-circular>
    <v-btn          :disabled="loginActive || !valid"
                    @click="login()"
                    @keyup.enter="login()">
      {{ $t('Login') }}
    </v-btn>
  <v-checkbox           :disabled="loginActive"
                        class="ml-5"></v-checkbox> {{ $t('Remember')}}
</v-card-actions>
     </v-card-text>
      </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-main>

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
import authDataService from '@/services/authDataService'
import { User } from '@/types'

export default Vue.extend({
  name: 'login',
  data: () => ({
    valid: true,
    name: 'form',
    username: '',
    text: null as string,
    loginActive: false,
    errorTrigger: false,
    successTrigger: false,
    password: '',
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
    login () {
      this.loginActive = true
      const user: User = { username: this.username, password: this.password }
      authDataService.login(user).then(() => {
        this.text = this.$t('LoginSuccessful')
        this.successTrigger = true
        this.loginActive = false
        this.$router.push('/')
      })
        .catch(err => {
          this.loginActive = false
          console.error(err)
          this.text = err
          this.errorTrigger = true
        })
    }
  }
})
</script>

<i18n>
{
  "en": {
    "LoginSuccessful": "Successfully logged in!",
    "Username": "Username",
    "Password": "Password",
    "Remember": "Remember me",
    "Login": "Login",
    "LDAP" : "Login via LDAP",
    "Register": "Register",
    "PasswordIsRequired": "Password is required",
    "UsernameIsRequired": "Username is required"
  },
  "de": {
    "LoginSuccessful": "Erfolgreich eingeloggt",
    "Remember": "Eingeloggt bleiben",
    "Username": "Benutzername",
    "Password": "Passwort",
    "Login": "Anmelden",
    "LDAP" : "Login über LDAP",
    "Register": "Registrieren",
    "PasswordIsRequired": "Es wird ein Passwort benötigt",
    "UsernameIsRequired": "Es wird ein Benutzername benötigt"

  }
}
</i18n>
