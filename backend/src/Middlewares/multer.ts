import multer from "multer";
import { v4 as uuid } from "uuid";
const storage= multer.diskStorage({
    destination(req, file, callback) {
        callback(null,"uploads");
    },
    filename(req, file, callback) {
        const id=uuid();
        const ext= file.originalname.split(".").pop();
        const fname=`${id}.${ext}`;
        callback(null,fname);
    },
    
})
export const upload=multer({storage}).single("photo")