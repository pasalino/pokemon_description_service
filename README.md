# Pokemon's description service
Service provide information about Pokemons. 

## Api documentation

#### Pokemon description
Provide a description of Pokemons in Shakespearean style.

**Url:** pokemon/:name

**Url Params:** 
* name: (mandatory) is a name of Pokemon

**Success Response:**

Return the name of the Pokemon and its description

**Response examples:**

```json
{
  "name": "ditto",
  "description": "Ditto was incredible"
}
```

## Development

### Requirements
* Node.js 12+

### Install requirements

* Install node and npm (https://nodejs.org/it/)
* Check in your console
    * `node --version`
    * `npm --version`

### Run service

Use those commands in project root:

* (Only once): Install dependencies with `npm i` command
* Use `npm start` to start project 

## Tests

Use those commands in project root:

* (Only once): Install dependencies with `npm i` command
* Run suite with `npm run test`

### Involved technologies

* Node.js
* Typescript 


