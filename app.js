const {server,app,express,io}=require('./server')
const path=require('path')
const cors=require('cors')
const mongoose=require('mongoose')
const userAuthenticate=require('./Routes/Auth')
const userProfile=require('./Routes/userProfile')
const pespalHandlers=require('./Routes/PesaPal')
const General=require('./Routes/General')
const Messages=require('./Routes/Messages')
app.use(express.json())
require('dotenv').config()

app.use(cors({origin:['*']}))

app.use('/api/user/auth',userAuthenticate)
app.use('/api/user/profile',userProfile)
app.use('/api/userProfile',express.static(path.join(__dirname,'Middleware','UserImages')))
app.use('/api/pesapal',pespalHandlers)
app.use('/api',General)
app.use('/api/chat',Messages)



server.listen(5000,'0.0.0.0',()=>{
    console.log('server running on port 5000')

})
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));
