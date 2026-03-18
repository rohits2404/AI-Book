import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from 'cloudinary'

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

console.log('Cloudinary configured with:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    has_api_key: !!process.env.CLOUDINARY_API_KEY,
    has_api_secret: !!process.env.CLOUDINARY_API_SECRET
})

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: async (req, file) => {
        console.log('CloudinaryStorage Params Called With File:', file?.originalname)
        return {
            folder: 'ai-ebook-creator/book-covers',
            resource_type: 'auto',
            allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
            public_id: `cover-${Date.now()}-${Math.round(Math.random() * 1E9)}`
        }
    }
})

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(file.mimetype)

    if (extname) {
        return cb(null, true)
    } else {
        cb("Error: Images Only!")
    }
}

// Initialize upload with Cloudinary
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        console.log('File Filter Called For:', file.originalname)
        checkFileType(file, cb)
    }
}).single('coverImage')

// Error handling wrapper
export const uploadWrapper = (req, res, next) => {
    console.log('Upload Middleware Called')
    upload(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err)
            return res.status(400).json({ message: err.message || 'Upload Failed' })
        }
        console.log('File Received:', req.file ? 'Yes' : 'No')
        next()
    })
}
