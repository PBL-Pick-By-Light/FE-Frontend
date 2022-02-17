# Documentation
<a id="top"></a>
This documentation is for the frontend of the [Pick-by-Light](https://github.com/PBL-Pick-By-Light) project. The system was developed during the module "Softwaretechnik-Projekt" at the [THM Gießen](https://www.thm.de).
## Index
- [Frontend](#frontend)
  - [Install-guide](#install)
  - [Config](#config)
  - [Parts](#parts)
    - [Views](#views)
    - [Components](#components)
    - [Services](#services)
    - [Others](#others)

## Frontend
<a id="frontend"></a>
The graphical user interface allows the user to interact with the system. A login system ensures that only authorized users can use the system. The desired parts are selected via a search mask and displayed via the further connection. Extended setting options are available to the administrator. Parts and shelfs can be created and managed.

From a technical point of view, the frontend is realized with [vue](https://vuejs.org) and [vuetify](https://vuetifyjs.com/en) and is running in a [nginx](https://hub.docker.com/_/nginx/) docker container. The different components are presented on individual pages. 

## Install-guide
<a id="install"></a>
The frontend can be started via [docker](https://docs.docker.com/get-started/).

The docker commands must be used in the location of the "Dockerfile" file.

Before the build, the ip to the backend can be adjusted in the `config/config.json`.
Further adjustments for the nginx server can be configured in the `config/nginx.conf`, but are usually not necessary.
#### Build Docker-Image
```
docker build . -t frontend
```

#### First time build and run container
The port used by the webserver can be specified within the command. Default is `8080`.<br>(`80` is the port of the nginx server running in the container and defined in the `config/nginx.conf`)
```
docker run --name frontend -d -p 8080:80 frontend
```

#### Start or stop container after first run
```
docker start frontend
docker stop frontend
```
#### Development
```
npm install
npm run serve
```

[_back to index_](#top)
## Config
<a id="config"></a>
Basic settings for the frontend can be made in the `config/config.json` file.
- The basic colors of the project
- The IP + port for the backend
- The title of the web interface
- Authentication on/off

[_back to index_](#top)
## Parts
<a id="parts"></a>
[Vue](https://vuejs.org) realizes a website application with views and components. The views and components used in this project, will be explained here:
### Views
<a id="views"></a>
- AddItem - Wrapper for the [AddItem](./components/AddItem.md) component
- [App](./views/App.md)
- [Home](./views/Home.md)
- Login - Wrapper for the [Login](./components/Login.md) component
- [Search](./views/Search.md)
- Settings - Wrapper for the [Settings](./components/Settings.md) component

[_back to index_](#top)
### Components
<a id="components"></a>
- [AboutUs](./components/AboutUs.md)
- [AddItem](./components/AddItem.md)
- [CreateLabel](./components/CreateLabel.md)
- [Footer](./components/Footer.md)
- [Grid](./components/Grid.md)
- [ItemMenu](./components/ItemMenu.md)
- [ItemToShelf](./components/ItemToShelf.md)
- [Login](./components/Login.md)
- [MAC-Address](./components/MacAddress.md)
- [NavigationBar](./components/NavigationBar.md)
- [NavigationBarLogo](./components/NavigationBarLogo.md)
- [Register](./components/Register.md)
- [Room](./components/Room.md)
- [SearchBar](./components/SearchBar.md)
- [Settings](./components/Settings.md)
- [Shelf](./components/Shelf.md)

[_back to index_](#top)
### Services
<a id="services"></a>
Services are used to implement communication with the backend and embedded systems. Here, http requests & responds are used with the help of Axios. Also, some enable live transmission of information between different components in the frontend.
- __authDataService__<br>Allows registering of new users, logs existing users in and makes the corresponding data available for the frontend components
- __http-common__<br>Imports Axios and sets the url to the backend systems
- __http-embedded__<br>Imports Axios and sets the url to the embedded systems
- __itemDataService__<br>Realizes the connection to the items-data-base and the needed routes
- __labelDataService__<br>Handles the different operations with labels and the related database
- __languageDataService__<br>Is used to manage the different languages supported by the project
- __lightDataService__<br>Organizes the connection to the different lights in the embedded system
- __RoomsDataService__<br>Connection to manage rooms
- __settingsService__<br>Communicates with the backend database to store and update different settings
- __shelfDirectDataService__<br>Allows the assignment of mac addresses and management of shelves directly on the embedded systems
- __shelvesDataService__<br>Shelf related communication with the backend

[_back to index_](#top)
### Others
<a id="others"></a>
- __plugins/vuetify.ts__<br>Connects with the color service and assigns the chosen colors to the vuetify theme
- __i18n__<br>Is used to realize the different languages support
- __router__<br>Routes and defines the different links to the single views
- __main.ts__<br>Initiates the app
- __types/index.ts__<br>Used to define the types used in the application
  - Item
  - Items
  - User
  - Label
- __store/index.ts__<br>Enables the vue vuex store. Can be used to store data temporarily in the frontend.
  - Chosen item
  - Searched items
  - Current selected Labels

[_back to index_](#top)
