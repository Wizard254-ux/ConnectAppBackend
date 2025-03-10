const { express } = require("../server");
const router=express.Router()
router.use(express.json())

const {loginUser,createUser,refreshToken}=require('../Controllers/Auth')

router.use('/login',loginUser)
router.use('/create',createUser)
router.use('/refreshToken',refreshToken)

module.exports=router