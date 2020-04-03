### Mycelia for Music - The Creative Passport

A new iniative for Mycelia, The Creative Passport is a personalised ID for MUSIC MAKERS, where they can ACCESS, UPDATE AND MANAGE information about themselves and their works, and share it with others. 

This project is a front-end data visualisation of the users registered to The Creative Passport, displayed in a fun interactive way through a three.js globe visualisation. 


## The Tech

* Built using Create React App
* 3D and WebGL created with three.js and react-globe.gl
* Users called from an AWS endpoint via an express server
* Styled using scss with some elements from react-bootstrap

## AWS and the API

To generate the creative passport users and display them on the globe, the AWS endpoint is called when a country is clicked. This will then check the country name based on a map layered underneath then return the relevant data. 

For the search functionality a seperate call is made, this is using the AWS Cloud Search platform endpoint. To access this data on the front end it is necessary to make the fetch request via an express server. This is to resolve any CORS issues. 


## Installing and Running The Creative Passport

To install, follow these steps:

```
yarn install
```

```
yarn start
```

In development/to test locally
* Ensure the URL in Components > Search > index.js is set to (line 17) `http://localhost:3005/search?q=${query}`
* The server.js file at root will point to this, in production this will be hosted externally
* Then in addition to yarn start, in another terminal run

```
yarn server
```

## Contributors

Thanks to the following people who have contributed to this project:

* Laura Annabel Tombs (https://github.com/LauraAnnabel89)
* Clément Chenebault (https://github.com/madclem) 
* Luigi Mannoni (https://github.com/luigimannoni)
