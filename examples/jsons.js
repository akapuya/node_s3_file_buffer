const uuid = require('uuid');
let id = 0;
exports.getRandJson = function () {
    let j =
        {
            "id": id++,
            "index": 0,
            "guid": uuid.v1(),
            "isActive": false,
            "balance": "$" + Math.round(Math.random()*10000),
            "picture": "http://placehold.it/32x32",
            "age": Math.round(Math.random()*100),
            "eyeColor": "brown",
            "name": "Victoria Wilkins",
            "gender": "female",
            "company": "ISOTRONIC",
            "email": "victoriawilkins@isotronic.com",
            "phone": "+1 (806) 516-3010",
            "address": "10923 Pineapple Street, Jacksonburg, Tennessee, 2086",
            "about": "Minim exercitation sint anim Lorem magna cupidatat duis labore aliqua officia. Eu enim adipisicing irure ipsum deserunt id tempor exercitation id. Dolore aute amet anim enim incididunt aliqua do ullamco.\r\n",
            "registered": "2019-01-01T08:28:56 +08:00",
            "latitude": 23.364905,
            "longitude": -171.694877,
            "tags": [
                "et",
                "dolor",
                "quis",
                "pariatur",
                "laborum",
                "qui",
                "amet"
            ],
            "friends": [
                {
                    "id": 0,
                    "name": "Lana Jimenez"
                },
                {
                    "id": 1,
                    "name": "Wall Sparks"
                },
                {
                    "id": 2,
                    "name": "Araceli Morin"
                }
            ],
            "greeting": "Hello, Victoria Wilkins! You have 3 unread messages.",
            "favoriteFruit": "strawberry"
        };
    return j;
}

