const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    fileContent: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('file', fileSchema)