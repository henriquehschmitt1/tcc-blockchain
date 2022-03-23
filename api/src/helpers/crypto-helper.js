const Crypto = require('crypto')

class Digest {
    static getCryptoParams() {
        const key = Crypto.createHash('sha512')
            .update(process.env.SECRET_KEY, 'utf-8')
            .digest('hex')
            .substr(0, 32)
        const iv = Crypto.createHash('sha512')
            .update(process.env.SECRET_IV, 'utf-8')
            .digest('hex')
            .substr(0, 16)

        return { iv, key }
    }

    static encrypt(plain_text, encryptionMethod, secret, iv) {
        var encryptor = Crypto.createCipheriv(encryptionMethod, secret, iv)
        var aes_encrypted =
            encryptor.update(plain_text, 'utf8', 'base64') +
            encryptor.final('base64')
        return Buffer.from(aes_encrypted).toString('base64')
    }

    static decrypt(encryptedMessage, encryptionMethod, secret, iv) {
        const buff = Buffer.from(encryptedMessage, 'base64')
        encryptedMessage = buff.toString('utf-8')
        var decryptor = Crypto.createDecipheriv(encryptionMethod, secret, iv)
        return (
            decryptor.update(encryptedMessage, 'base64', 'utf8') +
            decryptor.final('utf8')
        )
    }
}

module.exports = Digest