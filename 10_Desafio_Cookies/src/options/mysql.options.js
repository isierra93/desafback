
import * as dotenv from 'dotenv'
dotenv.config()

export const options = {
    client: 'mysql',
    connection: {
        host: process.env.IP,
        user: process.env.USER,
        password: '',
        database: process.env.DATABASE
    }
}