
require('dotenv').config({ path: '/usr/local/lib/AREAX_CHAT_APP/src/.env' });

module.exports = {
    APP_SERVER_PORT: process.env.APP_SERVER_PORT,
    APP_CHAT_SERVER_PORT: process.env.APP_CHAT_SERVER_PORT,	
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    ACCESS_TTL: process.env.ACCESS_TTL,
    REFRESH_TTL: process.env.REFRESH_TTL,	
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_PASS: process.env.DATABASE_PASS,
    DATABASE_NAME_TWO: process.env.DATABASE_NAME_TWO,
    DATABASE_USER_TWO: process.env.DATABASE_USER_TWO,
    DATABASE_HOST_TWO: process.env.DATABASE_HOST_TWO,
    DATABASE_PORT_TWO: process.env.DATABASE_PORT_TWO,
    DATABASE_PASS_TWO: process.env.DATABASE_PASS_TWO,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASS: process.env.MONGO_PASS,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
};
