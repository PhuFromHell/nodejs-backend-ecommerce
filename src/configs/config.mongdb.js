'use strict';

const app = require("../app");

// level 0
// const config = {
//     app: {
//         port: process.env.PORT || 3000,
//     },
//     db: {
//         mongodb: {
//             host: 'localhost',
//             port: 27017,
//             databaseName: 'shop_DEV',
//             user: '',
//         }
//     }
// }

// level 0
// const dev = {
//     app: {
//         port: process.env.PORT || 3000,
//     },
//     db: {
//         host: 'localhost',
//         port: 27017,
//         databaseName: 'shop_DEV',
//         user: ''
//     }
// }

// const prd = {
//     app: {
//         port: process.env.PORT || 3000,
//     },
//     db: {
//         host: 'localhost',
//         port: 27017,
//         databaseName: 'shop_PRD',
//         user: ''
//     }
// }


// level 1
// dev environment and
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000,
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT  || 27017,
        name: process.env.DEV_DB_NAME  || 'shop_DEV',
        user: ''
    }
}
// production environment
const prd = {
    app: {
        port: process.env.PRD_APP_PORT || 3000,
    },
    db: {
        host: process.env.PRD_DB_HOST || 'localhost',
        port: process.env.PRD_DB_PORT || 27017,
        name: process.env.PRD_DB_NAME || 'shop_PRD',
        user: ''
    }
}

const config = {dev, prd}
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];