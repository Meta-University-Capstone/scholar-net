import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
const port = 4000;
require('dotenv').config()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
