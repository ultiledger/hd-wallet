const keypairs = require('ripple-keypairs');

class RippleWallet{
    constructor(option) {
        this.option = option
    }

    getAccount(key) {
        let options = {'entropy':key};
        const secret = keypairs.generateSeed(options);
        const keypair = keypairs.deriveKeypair(secret);
        const address = keypairs.deriveAddress(keypair.publicKey);
        return { secret, address };
    }

    getAccountFromSecret(secret) {
        const keypair = keypairs.deriveKeypair(secret);
        const address = keypairs.deriveAddress(keypair.publicKey);
        return { secret, address };
    }
}
module.exports = RippleWallet