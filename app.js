import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoutes.js';
import pokemonRoute from './routes/pokemonRoute.js';
import authRoute from './routes/authRoute.js';
import config from 'config';
import dotenv from 'dotenv';
const app =  express();

dotenv.config();

app.use(express.json());

app.use('/api/users',userRoute);
app.use('/api/pokemons',pokemonRoute);
app.use('/api/auth',authRoute);

if (!config.get('jwtprivatekey')){
    console.log('FATAL ERROR: jwtprivatekey is not defined');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log (`Connected to mongodb....`))
.catch( err => console.log('An error occurred could not connect to mongod',err));


const port = process.env.PORT || 5000;
app.listen(port,() => console.log(`App started and running on port http://127.0.0.1:${port}`));