import DataUriParser from 'datauri/parser.js'

import path from 'path';
const getDataUri = (file)=>{
    const parser = new DataUriParser();
    const extreme = path.extname(file.originalname).toString();
    return parser.format(extreme,file.buffer)
}
export default getDataUri;