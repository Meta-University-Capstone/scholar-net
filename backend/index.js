import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import env, { parse } from 'dotenv';



const app = express();
const port = 3000;
const prisma = new PrismaClient();
env.config();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


const checkUserID = (req, res, next) => {
    const { userID } = req.body;
    if (!userID) {
      return res.status(400).json({ error: 'Missing user ID' });
    }
    req.userID = userID;
    next();
};



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
    res.send(`
    <html>Hello World!</html>`);
});

app.get('/profile/:uid', async (req, res) => {
    const userID = req.params.uid;

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
    const { name, bio, role, userID} = req.body;

    try {
        const profile = await prisma.profile.create({
            data: {
                name,
                bio,
                role,
                user: {connect: { uid: userID }},
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

app.put('/profile/:uid/:id', checkUserID, async (req, res) => {
    const { name, bio, role } = req.body;
    const id = req.params.id;

    try {
      const profile = await prisma.profile.update({
        where: { id: Number(id) },
        data: { name, bio, role },
        include: {
          user: true},
      });

      res.status(200).json(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/profile/:uid/:id/posts', checkUserID, async (req, res) => {
    const userID = req.params.uid;
    const profileID = req.params.id;
    const { title, content, location, field_interest } = req.body;
    const postProfile = await prisma.profile.findUnique({
        where: {id : parseInt(profileID)}
      })
    const postUser = await postProfile.name

    try {
      const newPost = await prisma.post.create({
        data: {
          title,
          postUser,
          content,
          location,
          field_interest,
          likeCount: 0,
          created_at: new Date().toISOString(),
          user: {connect: { uid: userID }},
          profile: {connect: { id: parseInt(profileID) }},
        },
        include: {
          user: true,
          profile: true,
        },
      });
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/posts', async (req, res) => {
    try{
      const posts = await prisma.post.findMany();
      res.json(posts);
    }catch(err){
      res.status(500).json({err: 'Internal Server Error'})
    }
  });

  app.put('/posts/:id', async (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content, location, field_interest } = req.body;

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { user: true }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                title,
                content,
                location,
                field_interest,
                updated_at: new Date().toISOString(),
            },
        });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/posts/:id', async (req, res) => {
    const postId = parseInt(req.params.id);

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { user: true }
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await prisma.post.delete({
            where: { id: postId },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/posts/:id/like', async (req, res) => {
    const postId = parseInt(req.params.id);
    const { increment } = req.body;

    try {
        const post = await prisma.post.update({
            where: { id: postId },
            data: {
                likeCount: {
                    increment: increment
                }
            }
        });
        res.json(post);
    } catch (error) {
        console.error('Error updating like count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});








app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
