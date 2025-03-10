const fs=require('fs')
const path=require('path')
const multer=require('multer')

const uploadDir=path.join(__dirname,'UserImages')

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true})
}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir)
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true)
    }else{
        cb(new Error('Only JPG and PNG images are allowed'),false)
    }
}

const upload=multer({
    storage,
    fileFilter
})

module.exports=upload
