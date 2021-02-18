# Pokemon's description service
Service provides information about Pokemons. 


## Requirements
* Node.js 12+

## Install requirements

* Install node and npm (https://nodejs.org/it/)
* Check in your console
    * `node --version`
    * `npm --version`
* (Optional) Install docker [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/) 

## Run service

Use following commands in project root:

* Create `.env` file from `.env_dist` template. (see Env Variables chapter)
* Install dependencies with `npm i` command
* Use `npm start` to start project

Use `npm start:production` to use production mode.

## Tests

Use following commands in project root:

* Create `.env.test` file from `.env_dist` template. (see Env Variables chapter)
* Install dependencies with `npm i` command
* Run suite with `npm run test`

**Important:** to avoid messages in test output use `-1` value in LOG_LEVEL environment variable  

## Use Docker

For create and use Docker Image

* Create `.env.docker` file from `.env_dist` template. (see Env Variables chapter)
* Build image with command `npm run build:docker`. The command create an image tagged as 'pokemon_descriptions_service'
* Run docker with follow command:
  `docker run  -p PORT:PORT pokemon_descriptions_service`
  change PORT with port number used in env file
* You can access to server using browser or Rest Client (see Api Documentation)

## Env Variables

Descriptions of variables in `.env` files. See `.env_dist` as example.

* **PORT:** port of http server
* **LOG_LEVEL:** (debug|info|warning|error) level of logs. Use `-1`to avoid messages.
* **FUN_TRANSLATION_KEY:** key for translation service. If empty, the api will be called with rate limit. [(see documentation)](https://funtranslations.com/api/shakespeare)
* **LOG_IN_FILE:** (true|false) if true, logs must be stored in log folder
* **EXTERNAL_API_TIMEOUT:** (millisecs) if 0 external apis haven't timeout
* **POKEMON_GAME_VERSION:** (name of version) pokemon game's version used to retrieve pokemon. Different versions haven't same pokemons. See pokemon game's version on `https://pokeapi.co/api/v2/version/`


## Api documentation

Use PORT number in url domain to access to apis.

#### Pokemon description
Provide a description of Pokemons in Shakespearean style.

**Url:** /pokemon/:name

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


### Improvements

Here is a series of possible improvements:

* The apis behind the end-points have a rate limit (Translation) or a request to limit calls (Pokemon). An important improvement is to create a cache layer. We could use a system such as Redis for caching or third part external service as CloudFront or similar.
* Insert a reverse proxy in front of the system with a load balancer to allow to create multi-instance of services (in scaling case).
* The test suite is limited to unit test and acceptance test about API. Those tests don't call directly underlying APIs. A series of end to end test could be necessary to improve the testing check directly the calls.
* Insert an external and centralized system monitor to check the health and errors, alert of service instead of use the simple logging system

