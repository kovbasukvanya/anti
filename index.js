const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

const config = require('./modul/config');
const personalUs = require("./modul/bd");
const app = express();
const check = require('./modul/user');
const sev = require('./modul/sev');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}))
app.use(express.static('pablic'));
app.use(cors());
app.use(bodyParser.json());
app.use(
    session({
        secret: config.secret,
        saveUninitialized: true,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60000,//1800000), 
            expires: 24 * 60 * 60000//1800000) 
        }})
);

const PORT = process.env.PORT || 8080;

app.get('/', (req, res)=>{  
   req.session.user = 1;
   req.session.daniS = 1;
   res.render("index")   
})
app.get('/user/:username', (req, res, )=>{  
    if (req.session.daniS == 1) {res.redirect('/')}
    if (req.session.user) { res.render("user")}
    else {res.render("index")}
 })

app.post('/user', (req, res)=>{
   let Result = [];
   Result =  personalUs.UserIdentification([req.body.username,req.body.userpsw,req.body.ipUser])   
    if ( Result == false ) { 
     return res.json(['/',""]) }
    else 
     { 
        let username =req.body.username ;
        let sess = req.session;
        sess.user = req.body.username;
        sess.daniS = Result;
        return res.json(['/user/' + username,Result])}      
})
app.post('/globalImgDel', (req, res)=>{
    let Dani = req.body.BplaImgDelete;
    let nDani = JSON.parse(fs.readFileSync('./pablic/js/Parametru.anti','utf-8'));
    fs.unlinkSync(__dirname+'/pablic/img/'+nDani[12][Dani], (err) => {   
    });
    if (Dani){
      if (nDani[13].indexOf(nDani[12][Dani]) > -1) {
         nDani[13][nDani[13].indexOf(nDani[12][Dani])]='';
        }
        nDani[12].splice(Dani, 1);
        fs.writeFile('./pablic/js/Parametru.anti', JSON.stringify(nDani),(err, data)=>{ })
      }
     return res.redirect('/check/global') 
   })
app.use('/check',check);

app.listen(PORT, ()=>{
    console.log(`Запущено сервер: http://localhost:${PORT} `)
});

mongoose.connect(config.db);

let db = mongoose.connection;
db.on('connected', ()=>{
    console.log("Підключення до локальної БД успішне!")});
db.on('error', (err)=>{
    console.log("Не вдалося підключитися до БД: "+err)});

//  console.log(sessionStorage.getItem("key"))
//  console.log(sessionStorage.getItem("key1"))
//  console.log(sessionStorage.getItem("key2"))
//  console.log(sessionStorage.getItem("key3"))