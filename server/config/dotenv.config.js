import dotenv from 'dotenv';

const loadEnvConfigOfMongodb = () => {
    const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
    dotenv.config({ path: envFile });

    if(!process.env.MONGO_URI){
        console.error(`[Dotenv] MongoDB URI is missing in ${envFile}`);
        // process.exit(1);
    }
}

export default loadEnvConfigOfMongodb;