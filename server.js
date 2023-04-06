require("dotenv").config()

const express = require("express")

const app = express()

const indexProfile = require('./routes/profile')
const indexReviews = require('./routes/review')
const indexLeads = require('./routes/leads')
const indexBoard = require('./routes/myboard')
const indexAiModel = require('./routes/aimodel')

const crypto = require('crypto')
const mailgunLoader = require('mailgun-js')

const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/myapp');

const db = mongoose.connection
db.on('error', error => console.error(error));
db.once('open', () => console.error('connected to mongoose'))

const bcrypt = require('bcrypt')

var cors = require('cors');
app.use(cors());

const jwt = require("jsonwebtoken");
const { profile } = require("console")

app.use(express.json())


app.use('/profile',indexProfile)
app.use('/aimodel',indexAiModel)

app.use('/review',indexReviews)
app.use('/leads',indexLeads)
app.use('/board',indexBoard)



let mailgun = mailgunLoader({
    apiKey: 'bf4661c6df7aed7858273b7c2c4bc27f-381f2624-78fde5fd',
    domain: 'sandbox1b70dc97e62345b3b68d8f97fa47dd86.mailgun.org'
})

const sendEmail = (to  ,from, subject, content) => {
    let data = {
        to,
        from,
        subject,
        text: content
    };
    return mailgun.messages().send(data);
}

app.post('/forgot-password', async (req,res) => {
    if (req.body.email === ''){
        res.status(400).send('email required');
    }
    console.error(req.body.email)
    const user  = posts.find(user => user.email == req.body.email);
    if(user === undefined) {
        console.error('email not in database');
        res.status(403).send('email not in db')
    }else { 
        const token = generateAccessToken(user.email);
    
    
    const text = `you are recieving this email for reseting your password in techception site. \n\n` 
    + `please click on the link or paste this on a browser to reset \n\n`
    + `http://localhost:3000/reset/${token}\n\n`
    + `have a good day`;

    try{
        await sendEmail(req.body.email,'no-reply@test.com','Password reset email', text);
        res.send('Email sent!')
    } catch(e) {
 
        res.status(500)

    }
}
})

const posts = [{
    name: "asad ali",
    email: "asad123@gmail.com",
    password: "$2b$10$DPBdDR7PWBoVo1igJ/0igukrhy75sWN33lr5yDADASrIUkLjz0s/W"
},
{
    name: 'touseef ahmed',
    email: "Touseef2345@gmail.com",
    password: "$2b$10$xylgA8tb1iEJnbW9dITJ2.MhWH538MppZVPxvJHDSlACligUxHGS2"
}
]


app.post('/reset-password/:id', async (req,res) => {
    const token = req.params.id
    let profile = null;
    jwt.verify(token,process.env.TOKEN_SECRET, (err, user) => 
    {
        if(err) return res.sendStatus(403)
        res.json({email: user.email})
        profile  = posts.findIndex(use => use.email == user.email);
        

    })
    if(profile === null) {
        console.error('email not in database');
        res.status(403).send('id not found')
    }else {
        
        const newpass = await bcrypt.hash(req.body.password, 10);
        posts[profile].password = newpass  
        res.status(200).send()
    }

})





function generateAccessToken(username) {
  return jwt.sign({ email: username }, process.env.TOKEN_SECRET,{expiresIn: '1500s'});
}

let refreshTokens = []

app.delete('/logout', (req,res) => {
    refreshTokens.filter(token => token != req.body.token)
    res.sendStatus(204)
})


app.post('/token',(req,res) => {
    const refresh_token = req.body.token;
    if(refresh_token == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refresh_token)) return res.sendStatus(403);

    jwt.verify(refresh_token, process.env.REFRESH_TOKENS_SECRET, (err,user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken:accessToken})
    })
})

app.get('/posts', authenticateToken, (req,res) => {
    res.json(posts.filter(post => post.email == req.user.email))
})

app.post('/sign-up', async (req,res) => {
 
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, email: req.body.email, password: hashedPassword}
        posts.push(user);
        res.sendStatus(200)
    }  catch{
        res.status(500).send()
    } 
    
    

})


app.post('/users/login', async (req,res) => {
    const user  = posts.find(user => user.email == req.body.email);
    if(user == null) {
        return res.status(400).send('cannot find user')
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            const username = req.body.email;



            const accessToken = generateAccessToken(username);
            const refreshToken = jwt.sign(username, process.env.REFRESH_TOKENS_SECRET)
            refreshTokens.push(refreshToken)
            res.json({accessToken: accessToken, refreshToken: refreshToken});
            
        }else {
            res.send('wrong password')
        }
    }catch{
        res.send(500).send()

    }
})

function authenticateToken(req,res,next) {
    const authheader = req.headers['authorization']
    const token = authheader && authheader.split(' ')[1]

    if (token == null) return res.sendStatus(401); 
    jwt.verify(token,process.env.TOKEN_SECRET, (err, user) => 
    {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


app.listen(4000);




