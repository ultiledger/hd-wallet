const bch = require('bitcoincashjs');

class BitcoinCashWallet{
    constructor(option) {
        this.option = option
    }

    getAccount(key) {
        const value = new Buffer(key);
        const hash = bch.crypto.Hash.sha256(value);
        const bn = bch.crypto.BN.fromBuffer(hash);
        const privateKey = new bch.PrivateKey(bn);
        const address = privateKey.toAddress();
        return { privateKey, address };
    }

    getAccountFromSecret(secret) {
        const address = bch.PrivateKey(secret).toAddress();
        return { secret, address };
    }

    async sendTransaction(fromSecret, to, option = {}){
        const privateKey = new bch.PrivateKey(fromSecret);
        const address = privateKey.toAddress();
        const script = bch.Script.buildPublicKeyHashOut(address);


        const utxo = {
            'txId' : '115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986',
            'outputIndex' : 0,
            'address' : address,
            'script' : script,
            'satoshis' : 50000
        };

        let tx = new Tx(rawTransaction);
        tx.sign(privKey);
        let serializedTx = tx.serialize();

        return new Promise((resolve, reject)=>{
            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
                if (!err){
                    resolve(hash);
                    console.info("tx hash:" + hash)
                } else {
                    reject(err);
                    console.error(err);
                }
            });
        });
    }
}
module.exports = BitcoinCashWallet;