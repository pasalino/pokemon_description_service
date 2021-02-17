# Pokemon's description service
Service provide information about Pokemons. 


## Requirements
* Node.js 12+

## Install requirements

* Install node and npm (https://nodejs.org/it/)
* Check in your console
    * `node --version`
    * `npm --version`

## Run service

Use following commands in project root:

* Create `.env` file from `.env_dist` template. (see Env Variables chapter)
* Install dependencies with `npm i` command
* Use `npm start` to start project 

## Tests

Use following commands in project root:

* Create `.env.test` file from `.env_dist` template. (see Env Variables chapter)
* Install dependencies with `npm i` command
* Run suite with `npm run test`

**Important:** to avoid messages in test output use `-1` value in LOG_LEVEL environment variable  

## Env Variables

Descriptions of variables in `.env` files. See `.env_dist` as example.

* **PORT:** port of http server
* **LOG_LEVEL:** (debug|info|warning|error) level of logs. Use `-1`to avoid messages.
* **FUN_TRANSLATION_KEY:** key for translation service. If empty, the api will be called with rate limit. [(see documentation)](https://funtranslations.com/api/shakespeare)
* **LOG_IN_FILE:** (true|false) if true, logs must be stored in log folder
* **EXTERNAL_API_TIMEOUT:** (millisecs) if 0 external apis haven't timeout
* **POKEMON_GAME_VERSION:** (name of version) pokemon game's version used to retrieve pokemon. Different versions haven't same pokemons. See pokemon game's version on `https://pokeapi.co/api/v2/version/`


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
