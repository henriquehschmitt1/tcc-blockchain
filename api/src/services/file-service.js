const FileDB = require('../model/file')
const Crypto = require('../helpers/crypto-helper')
const { randomUUID } = require('crypto')

const LedgerAction = require('../../../ledger/ledgerActions')

const path = require('path')
const fs = require('fs')
const encryptionMethod = 'AES-256-CBC'

class File {
    static async registerFile(req, res) {
        const { fileName, owner } = req.body

        const { key, iv } = Crypto.getCryptoParams()

        const fileBuffer = fs.readFileSync(path.join(__dirname, fileName))

        const encryptedFile = Crypto.encrypt(
            fileBuffer,
            encryptionMethod,
            key,
            iv
        )

        const file = await FileDB.create({
            fileName,
            fileContent: encryptedFile,
            owner
        })

        const result = await LedgerAction.exec('CreateAsset', { id: randomUUID(), fileContent: encryptedFile, fileName, owner, timestamp: Date.now() })

        res.status(200).send({ result, file })
    }

    static async updateFile(req, res) {
        const { id } = req.params
        const { fileName } = req.body

        const { key, iv } = Crypto.getCryptoParams()

        const fileBuffer = fs.readFileSync(path.join(__dirname, fileName))

        const encryptedFile = Crypto.encrypt(
            fileBuffer,
            encryptionMethod,
            key,
            iv
        )

        const file = await FileDB.findOneAndUpdate(
            {
                id
            },
            {
                fileContent: encryptedFile,
            }, { new: true })

        const result = await LedgerAction.exec('CreateAsset', { id: randomUUID(), fileContent: encryptedFile, fileName: file.fileName, owner: file.owner, timestamp: Date.now() })

        res.status(200).send({ result, file })
    }

    static async getFileContent(req, res) {
        try {
            const { fileName } = req.params

            const file = await FileDB.findOne({
                fileName,
            })

            const { fileContent } = file
            const { key, iv } = Crypto.getCryptoParams()

            const decryptedFile = Crypto.decrypt(
                fileContent,
                encryptionMethod,
                key,
                iv
            )

            res.status(200).send(decryptedFile)
        } catch (error) {
            res.status(error.statusCode).send(error.message)
        }
    }

    static async getAll(req, res) {
        const result = await LedgerAction.exec('GetAllAssets')

        res.status(200).send(result)
    }

    static async getAllFiltered(req, res) {
        const { fileName } = req.params

        const result = await LedgerAction.exec('GetAllAssets')

        const filteredResults = result.filter(obj => {
            return obj.Record.Filename === fileName
        })

        res.status(200).send(filteredResults)
    }
}

module.exports = File