const express = require('express');
const path = require ('path');
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const app = express();
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const homeRoute = require ('./routes/home')
const cardRoute = require('./routes/card')
const addRoute = require ('./routes/add.js')
const ordersRoute = require ('./routes/orders')
const courseRoute = require('./routes/courses')
const authRoute = require('./routes/auth')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')
const url = 'mongodb://agafonov:89027983557Stas89@cluster0-shard-00-00.f2crf.mongodb.net:27017,cluster0-shard-00-01.f2crf.mongodb.net:27017,cluster0-shard-00-02.f2crf.mongodb.net:27017/node?ssl=true&replicaSet=atlas-nye10j-shard-0&authSource=admin&retryWrites=true&w=majority'
const userMiddleware = require('./middleware/user')
const store = new MongoStore({
    collection: 'sessions',
    uri: url
})


app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main', //регистрируем движок в экспресс
    extname: 'hbs'
}));
app.set('view engine', 'hbs') //используем движок
app.set('views', 'views') //место где хранятся все шаблоны html

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(varMiddleware)
app.use(userMiddleware)



app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/',homeRoute) //register router
app.use('/add',addRoute)//register router
app.use('/courses',courseRoute)//register router
app.use('/card',cardRoute)//register router
app.use('/orders',ordersRoute)//register router
app.use('/auth',authRoute)//register router
const PORT = process.env.PORT || 3000;

async function start (){
    try {
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        
        app.listen(PORT, ()=>{
            console.log('Server has been started');
        });
    } catch (e) {
        console.log(e) 
    }
   
}
start()


//mongodb://agafonov:agafonov@cluster0-shard-00-00.f2crf.mongodb.net:27017,cluster0-shard-00-01.f2crf.mongodb.net:27017,cluster0-shard-00-02.f2crf.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-nye10j-shard-0&authSource=admin&retryWrites=true&w=majority
//mongodb+srv://agafonov:agafonov@cluster0.f2crf.mongodb.net/<dbname>?retryWrites=true&w=majority


