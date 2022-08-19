# CeballosPardoSarah-8
NUESTRA PRIMERA BASE DE DATOS

Se cambia el tipo de base de datos

Archivo: /src/options/configDB.js

Bases:
const sqliteOptions = {
    client: 'sqlite3',
    connection: {
        filename: '../database/ecommerce.sqlite',
    },
    useNullAsDefault: true,
}

const mariaDBOptions = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user:'root',
        password: '',
        database: 'mibase'
    }
}

Linea 21: let db = knex(mariaDBOptions);
