const S3Uploader = require('../index').S3Uploader;
const JsonBufferStreamer = require('../index').JsonBufferStreamer;

function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

async function test(json) {
        const s3Uploader = new S3Uploader('djvm-test1');
        const buffer = new JsonBufferStreamer(s3Uploader, 'data', (uploadData) => {
                console.log('file uploaded', uploadData);
        });
        let r;
        buffer.open('domain1', 'test_ns', 1000, 5);
        buffer.open('domain2', 'test_ns2', 1000, 10);
        buffer.open('domain2', 'test_ns1', 10000000, 10);
        for (i = 0; i < 10; i++) {
                r = await buffer.append('domain1', 'test_ns',{data: json})
        }
        for (i = 0; i < 50; i++) {
                r = await buffer.append('domain2', 'test_ns2', json)
        }
        await buffer.flush();
        await buffer.close('domain1', 'test_ns');
        for (i = 0; i < 200; i++) {
                r = await buffer.append('domain2', 'test_ns1', json)
        }
        await sleep(10000);
        await buffer.flush();
}

json = [
        {
                "_id": "5ec6e8968c776bc6576aab12",
                "index": 0,
                "guid": "ee3134b3-7eab-4cd3-a992-870b56065680",
                "isActive": false,
                "balance": "$3,581.66",
                "picture": "http://placehold.it/32x32",
                "age": 27,
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
        },
        {
                "_id": "5ec6e8968da7a740952ee66b",
                "index": 1,
                "guid": "20972eca-dd1e-41a9-90be-1a15fd2cfb8d",
                "isActive": false,
                "balance": "$3,418.44",
                "picture": "http://placehold.it/32x32",
                "age": 30,
                "eyeColor": "blue",
                "name": "Bullock Porter",
                "gender": "male",
                "company": "LYRIA",
                "email": "bullockporter@lyria.com",
                "phone": "+1 (877) 538-3079",
                "address": "233 Poly Place, Norris, Pennsylvania, 5095",
                "about": "Qui ea ipsum aute incididunt deserunt cupidatat fugiat qui qui ullamco incididunt dolor. Esse voluptate non ullamco deserunt ea ex sint cillum exercitation velit magna. Do et do enim consectetur occaecat qui magna ad sint in. Eu et ea proident labore sunt minim enim mollit sint qui veniam ipsum et. Do labore tempor est ad esse duis irure officia ex veniam excepteur nulla fugiat. Cupidatat occaecat dolore proident incididunt deserunt laborum quis ad sunt ut tempor aliquip pariatur nisi. Aute ex labore non sit adipisicing incididunt do.\r\n",
                "registered": "2019-05-14T07:46:35 +07:00",
                "latitude": 56.929355,
                "longitude": -158.133903,
                "tags": [
                        "do",
                        "sunt",
                        "do",
                        "velit",
                        "ad",
                        "Lorem",
                        "amet"
                ],
                "friends": [
                        {
                                "id": 0,
                                "name": "Mccarty Reed"
                        },
                        {
                                "id": 1,
                                "name": "Danielle Moreno"
                        },
                        {
                                "id": 2,
                                "name": "Williams Yates"
                        }
                ],
                "greeting": "Hello, Bullock Porter! You have 4 unread messages.",
                "favoriteFruit": "banana"
        },
        {
                "_id": "5ec6e896c1601275471ae1d2",
                "index": 2,
                "guid": "c12f6f79-14bc-418e-aa35-dbb6a585b5b7",
                "isActive": false,
                "balance": "$1,746.49",
                "picture": "http://placehold.it/32x32",
                "age": 33,
                "eyeColor": "blue",
                "name": "Huffman Petersen",
                "gender": "male",
                "company": "GENMY",
                "email": "huffmanpetersen@genmy.com",
                "phone": "+1 (801) 580-2228",
                "address": "276 Herkimer Street, Fresno, Iowa, 719",
                "about": "Ex esse dolore excepteur irure velit veniam ipsum non est minim incididunt deserunt. Nulla qui laboris adipisicing deserunt deserunt commodo pariatur. Lorem magna deserunt cupidatat duis enim sunt in in dolor eiusmod eu elit. Incididunt sit culpa cupidatat nulla. Tempor ad minim quis et magna incididunt. Anim sint culpa dolor excepteur elit quis nulla amet ea.\r\n",
                "registered": "2014-06-13T02:15:12 +07:00",
                "latitude": -65.120249,
                "longitude": 65.113933,
                "tags": [
                        "laborum",
                        "aliquip",
                        "est",
                        "do",
                        "commodo",
                        "elit",
                        "quis"
                ],
                "friends": [
                        {
                                "id": 0,
                                "name": "Maynard Vincent"
                        },
                        {
                                "id": 1,
                                "name": "Hallie Little"
                        },
                        {
                                "id": 2,
                                "name": "Ross Hood"
                        }
                ],
                "greeting": "Hello, Huffman Petersen! You have 6 unread messages.",
                "favoriteFruit": "apple"
        },
        {
                "_id": "5ec6e8960329c31d57f37175",
                "index": 3,
                "guid": "0ffee7d7-e319-4854-a4c5-a081ea281e03",
                "isActive": false,
                "balance": "$3,617.06",
                "picture": "http://placehold.it/32x32",
                "age": 27,
                "eyeColor": "blue",
                "name": "Duncan Livingston",
                "gender": "male",
                "company": "PETIGEMS",
                "email": "duncanlivingston@petigems.com",
                "phone": "+1 (988) 592-3189",
                "address": "849 Duryea Place, Wintersburg, South Carolina, 6960",
                "about": "Cillum laborum proident proident qui Lorem incididunt tempor incididunt. Ex laborum excepteur culpa dolore nostrud sint sunt deserunt esse aliquip quis et aute laborum. Est ex eu reprehenderit magna. Amet deserunt ex eu tempor fugiat aute ad id.\r\n",
                "registered": "2017-07-27T11:54:51 +07:00",
                "latitude": -72.275837,
                "longitude": 116.22957,
                "tags": [
                        "proident",
                        "dolore",
                        "ea",
                        "deserunt",
                        "sunt",
                        "tempor",
                        "amet"
                ],
                "friends": [
                        {
                                "id": 0,
                                "name": "England Moss"
                        },
                        {
                                "id": 1,
                                "name": "Maryellen Frank"
                        },
                        {
                                "id": 2,
                                "name": "Aurora Slater"
                        }
                ],
                "greeting": "Hello, Duncan Livingston! You have 1 unread messages.",
                "favoriteFruit": "banana"
        },
        {
                "_id": "5ec6e896a3ab57ceddddbaaa",
                "index": 4,
                "guid": "b607b8a4-f378-4cff-b2d2-5f47a02e3639",
                "isActive": false,
                "balance": "$1,686.84",
                "picture": "http://placehold.it/32x32",
                "age": 29,
                "eyeColor": "green",
                "name": "Mayer Olsen",
                "gender": "male",
                "company": "INSURESYS",
                "email": "mayerolsen@insuresys.com",
                "phone": "+1 (964) 491-2126",
                "address": "270 Nassau Street, Bentonville, Indiana, 2886",
                "about": "Tempor eiusmod fugiat minim qui. Fugiat nulla ullamco sint irure esse velit esse ipsum fugiat in magna duis sunt. Laboris commodo occaecat mollit fugiat incididunt cillum. Mollit aliquip in aliqua fugiat dolore voluptate Lorem cupidatat qui. Sit eiusmod non aliquip proident adipisicing dolore. Duis non duis dolore culpa nulla irure sit mollit laborum labore nostrud do quis. Aliquip cupidatat non commodo ad pariatur excepteur velit sunt exercitation.\r\n",
                "registered": "2020-05-02T04:18:55 +07:00",
                "latitude": 83.751322,
                "longitude": -84.418462,
                "tags": [
                        "laborum",
                        "ullamco",
                        "cillum",
                        "exercitation",
                        "veniam",
                        "anim",
                        "non"
                ],
                "friends": [
                        {
                                "id": 0,
                                "name": "Cochran Greene"
                        },
                        {
                                "id": 1,
                                "name": "Tamera Morton"
                        },
                        {
                                "id": 2,
                                "name": "Castro Orr"
                        }
                ],
                "greeting": "Hello, Mayer Olsen! You have 4 unread messages.",
                "favoriteFruit": "apple"
        },
        {
                "_id": "5ec6e896661b56fa7c9ee348",
                "index": 5,
                "guid": "29096f29-b259-4929-8b11-7f2e5209d4ae",
                "isActive": false,
                "balance": "$3,891.90",
                "picture": "http://placehold.it/32x32",
                "age": 23,
                "eyeColor": "brown",
                "name": "Puckett Rush",
                "gender": "male",
                "company": "LINGOAGE",
                "email": "puckettrush@lingoage.com",
                "phone": "+1 (976) 523-3071",
                "address": "312 Division Avenue, Marenisco, New Hampshire, 2023",
                "about": "Magna fugiat velit veniam ad anim dolor reprehenderit eiusmod mollit aliquip irure sit laboris elit. Ea incididunt duis excepteur et. Enim enim ut laborum deserunt Lorem ut in veniam consequat. Et tempor mollit laborum ut eiusmod minim ipsum pariatur.\r\n",
                "registered": "2019-01-09T09:01:16 +08:00",
                "latitude": -87.185419,
                "longitude": -151.718195,
                "tags": [
                        "consequat",
                        "pariatur",
                        "consectetur",
                        "commodo",
                        "nulla",
                        "et",
                        "deserunt"
                ],
                "friends": [
                        {
                                "id": 0,
                                "name": "Georgia Pope"
                        },
                        {
                                "id": 1,
                                "name": "Burnett Reilly"
                        },
                        {
                                "id": 2,
                                "name": "Emerson Peters"
                        }
                ],
                "greeting": "Hello, Puckett Rush! You have 10 unread messages.",
                "favoriteFruit": "banana"
        }
];

test(json);