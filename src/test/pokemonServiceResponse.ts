export const pokemonSuccessResponse = {
    methodResponse: {
        name: "Charizard",
        description: "CHARIZARD flies around the sky in search of powerful opponents. It breathes fire of such great heat that it melts anything. However, it never turns its fiery breath on any opponent weaker than itself.",
        gameVersion: "ruby"
    },
    apiResponse: {
        name: "Charizard",
        flavor_text_entries: [
            {
                "flavor_text": "CHARIZARD flies around the sky in\nsearch of powerful opponents.\nIt breathes fire of such great heat\fthat it melts anything. However, it\nnever turns its fiery breath on any\nopponent weaker than itself.",
                "language": {
                    "name": "en",
                    "url": "https://pokeapi.co/api/v2/language/9/"
                },
                "version": {
                    "name": "ruby",
                    "url": "https://pokeapi.co/api/v2/version/7/"
                }
            },
            {
                "flavor_text": "CHARIZARD flies around the sky in\nsearch of powerful opponents.\nIt breathes fire of such great heat\fthat it melts anything. However, it\nnever turns its fiery breath on any\nopponent weaker than itself.",
                "language": {
                    "name": "en",
                    "url": "https://pokeapi.co/api/v2/language/9/"
                },
                "version": {
                    "name": "sapphire",
                    "url": "https://pokeapi.co/api/v2/version/8/"
                }
            },
        ]
    },
};


export const pokemonWithoutDescriptionResponse = {
    methodResponse: null,
    apiResponse: {
        name: "Absol",
        flavor_text_entries: [
            {
                "flavor_text": "It senses coming disasters and\nappears before people only to\nwarn them of impending danger.",
                "language": {
                    "name": "en",
                    "url": "https://pokeapi.co/api/v2/language/9/"
                },
                "version": {
                    "name": "pearl",
                    "url": "https://pokeapi.co/api/v2/version/13/"
                }
            },
            {
                "flavor_text": "Rumored to sense disasters with its\nhorn, it became a target. It fled\ndeep into the mountains.",
                "language": {
                    "name": "de",
                    "url": "https://pokeapi.co/api/v2/language/9/"
                },
                "version": {
                    "name": "platinum",
                    "url": "https://pokeapi.co/api/v2/version/14/"
                }
            },
        ]
    },
};
