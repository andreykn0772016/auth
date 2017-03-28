var express         = require("express"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    User            = require("./models/user"),
    bodyParser      = require("body-parser"),
    localStrategy   = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");



mongoose.connect("mongodb://localhost/auth__base");

var app = express();
app.use(require("express-session")({
    secret:"My site is the best site of the world",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended:true}));

app.use(passport.session());
passport.use( new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================
//ROUTES
//==================



app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isloggedIn, function(req, res){
    res.render("secret");
});
//Auth rout

//show sign form

app.get("/register", function(req, res){
        res.render("register");
});

//user signup

app.post("/register", function(req, res) {
    req.body.username
    req.body.password

    User.register(new User({username: req.body.username}),
        req.body.password, function(err, user){
            if(err){
                console.log(err);
                return res.render("register");
            }else {
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/secret");
                });
            }
        });
});
//LOGIN
//render login form
app.get("/login", function(req, res){
    res.render("login");
});
//login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){

});
//logout
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

function isloggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();

    }else {
        res.redirect("/login");
    }
}

app.listen(7300, function(){
    console.log("server run")
});







