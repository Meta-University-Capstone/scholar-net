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

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/profile/:uid', async (req, res) => {
    const userID = req.params.userID;

    try {
      const profiles = await prisma.profile.findMany({
        where: {
          userID,
        },
      });

      res.status(200).json(profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



app.post('/profile', async (req, res) => {
    const { name, bio, role, userID } = req.body;

    try {
        const profile = await prisma.profile.create({
            data: {
                name,
                bio,
                role,
                userID,
            },
            include: {
                user: true
            },
        });

        res.status(201).json(profile);
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
