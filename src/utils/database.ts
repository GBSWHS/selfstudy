import knex from 'knex'

const db = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'selfstudy',
    password: 'selfstudy1234!',
    database: 'selfstudy'
  }
})

export default db
