# Settings
Settings page with different setting options for the different user roles.

__Normal users__<br>
![User Settings](../pictures/SettingsPage/user.png)
- Can save a personal search color preference
- Select the standard language setting used when logged in

__Administrator__<br>
![Administrator Settings](../pictures/SettingsPage/admin.png)
- Can select and define the theme colors of the page
- Can upload a new logo for the [`NavigationBar`](NavigationBar.md) component
- Can set a standard language for the site

## Components
`<v-expansion-panel>` Dropdown selection for the different settings. Admin panels greyed out for normal users.

`<v-color-picker>` Used to select the different colors for the search color or theme colors options.

`<v-radio-group>` Radio buttons to select the preferred language
## Scripts
- __computed__:
    - __isAdmin__<br>Checks the role variable in the vuex store and returns true if the user is admin
- __methods__:
    - __fetchInfos__<br>Gets the settings and languages via the related services for further editing
    - __saveSettings__<br>Summarizes chosen settings and sends them via the SettingsService to the database
    - __set\_*\_color__<br>Functions to set and save the different colors
- __mounted__:
    - All color variables are set and synchronized with the database

## Flowchart
Example flow for the set_primary_color function
![settings_flow](../pictures/SettingsPage/settings_flow.png)

[_back to documentation_](../)

