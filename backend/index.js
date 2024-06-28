import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import env from 'dotenv';



const app = express();
const port = 3000;
const prisma = new PrismaClient();
env.config();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());



app.post('/register', async (req, res) => {
    const { uid, email } = req.body;

    try {
        const newUser = await prisma.user.create({
            data: {
                uid,
                email,
            },
        });
        res.status(200).json({ message: 'User data received and saved successfully' });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ error: 'Error saving user data' });
    }
});


app.get('/register', (req, res) => {
    res.status(200).json({ message: 'User data received successfully' });
});

app.get('/user/:uid/', (req, res) => {
    res.send('Hello World!');
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
