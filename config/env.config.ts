import * as dotenv from 'dotenv';
import path from 'path';

const env = process.env.TEST_ENV || 'qa'; // dev | qa | prod
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });
export const config = {
baseUrl: process.env.BASE_URL!,
apiUrl: process.env.API_URL!,
testUser: {
email: process.env.TEST_USER_EMAIL!,
password: process.env.TEST_USER_PASSWORD!,
},
};