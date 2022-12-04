const e = require("express");
var express =require("express")
var app = express();
const math = require("mathjs");
const port = 3000;

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./service_account_key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.set("view engine", "ejs");
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render("mainPage")
});

app.get('/aboutus', function (req, res) {
    res.render("aboutUs")
});

app.get('/signup', function (req, res){
    res.render("signup")
});

app.get("/signupnav", (req,res) => {
    res.render("signup");
})
app.get("/signupsubmit",(req,res)=>{
    const email = req.query.email;
    const password = req.query.password;
    db.collection("Users").add({
        Email : email,
        Password : password,
    }).then(()=>{
        res.render("login1");
    });
});

app.get('/loginpage', function (req, res){
    res.render("login1")
});

app.get("/loginnav", function(req,res) {
    res.render("login1");
})

app.get("/loginsubmit",function(req,res){
    db.collection("Users").get().then(function(docs){
    const email = req.query.email;
    const password = req.query.password;
    db.collection("Users")
    .where("Email","==",email)
    .where("Password","==",password)
    .get()

    .then((docs) => {
        console.log(email);
        console.log(password);
        if(docs.size > 0){
            res.render("homepage");
        }
        else{
            res.render("signup");
        }  
        });
    })
});

app.get('/homepage', function (req, res) {
    res.render("homepage");
});



app.get('/contactus', function (req, res) {
    res.render("contactUs");
});

app.get("/jutebag",(req,res)=>{
    res.render("jutebag");
});


app.get("/jutebagnav", (req,res) => {
    res.render("jutebag");
})

const a = [];
const number=[];
const cost = [];

var amount = 0;
app.get("/addToCart",(req,res)=>{
    const value = req.query.item;
    const num=req.query.nm;
    var c = req.query.cost;
    cost.push(c);
    number.push(num);
    c = math.evaluate(c.slice(0,c.length-2));
    amount = amount + num *c;
    a.push(value);
});

app.get("/seeds",(req,res)=>{
    res.render("seeds");
});

app.get("/fertilizers",(req,res)=>{
    res.render("fertilizers");
});

app.get("/vermicompost",(req,res)=>{
    res.render("vermicompost");
});

app.get("/org_fertilizers",(req,res)=>{
    res.render("org_fertilizers");
});

app.get("/tools",(req,res)=>{
    res.render("tools");
});



app.get("/cart",(req,res)=>{
    if(typeof(a) != "undefined"){
        db.collection("Cart").add({
            Cart : a,
            Cost : cost,
            Number :number,
            TotalCost : amount,
        }).then(()=>{
            res.render("cart",{productsData : a, amount : amount, cost : cost ,Number  : number});
        });
    }
});
app.get("/cartnav", (req,res) => {
    res.render("cart");
});

app.get("/contactus",(req,res)=>{
    res.render("contactUs");
});

app.get('/details', function (req, res) {
    res.render( "details")
});

app.get("/detailssubmit",function(req,res){
    db.collection("Users").get().then(function(docs){
    const name = req.query.name;
    const phone = req.query.phnno;
    const address = req.query.address;
    db.collection("Users")
    .add({
        Name : name,
        Phone_Number : phone,
        Address: address,
    }).then(()=>{
        res.render("success");
    });
    })
});

app.get('/success', function (req, res) {
    res.render( "success")
});


app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')  
});
