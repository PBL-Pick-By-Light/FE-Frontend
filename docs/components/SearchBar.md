# SearchBar
The item search bar with autocomplete feature and pill-boxing for the different labels.

![picture of searchbar](../pictures/SearchBar/searchBar.png)

## Components
`<v-autocomplete>` Tries to autocomplete the actual search string

`<v-slot> + <v-chip>` Slot for the selected Labels inside v-autocomplete

`<v-slot> + <v-list>` Expandable list for v-autocomplete

`<v-checkbox>` Used to select multiple labels
## Scripts
- __computed__:
    - __getCurrentNameString__<br>Computes the String concatenated with the current locale to get the according name from labels
    - __selectedLabels__<br>Computes the selectedLabels and pushs + gets them into the Vuex-Store for Usage in Grid-Component
- __methods__:
    - __getName(item)__<br>Returns the name Property of the current Item depending on selected Language in i18n
    - __remove(item)__<br>Removes the item from selectedLabels via the "x" Button on Chip in V-AutoComplete
- __mounted__:
    - Via the LabelDataService the labels for the v-autocomplete are prepared

[_back to documentation_](../)

