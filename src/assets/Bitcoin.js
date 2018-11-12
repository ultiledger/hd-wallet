const bitcoin = require('bitcoinjs-lib');
const request = require('request');
const wif = require('wif');

class BitcoinWallet{
    constructor(option) {
        this.option = option;
        if (option.network === 'testnet') {
            this.network = bitcoin.networks.testnet;
        }else {
            this.network = bitcoin.networks.bitcoin;
        }
    }

    getAccount(bip32) {
        let keyPair = bitcoin.ECPair.fromWIF(bip32.toWIF(),this.network);
        return this._getAccountFromECPair(keyPair);
    }
    getAccountFromSecret(secret) {
        const keyPair = this._getECPairFromSecret(secret);
        return this._getAccountFromECPair(keyPair);
    }
    _getAccountFromECPair(keyPair,network){
        let { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey,network:this.network });
        let secret = wif.encode(0x80,Buffer.from(keyPair.privateKey, 'hex'),true);
        return {secret,address}
    }
    _getECPairFromSecret(secret){
        const w = wif.decode(secret.toString());
        const keyPair = bitcoin.ECPair.fromPrivateKey(w.privateKey);
        return keyPair;
    }

    async sendTransaction(fromSecret, toAddress, options = {}){
        let NETWORK = this.network;
        const w = wif.decode(fromSecret.toString());
        const fromPair = bitcoin.ECPair.fromPrivateKey(w.privateKey);
        let { address } = bitcoin.payments.p2pkh({ pubkey: fromPair.publicKey,network:NETWORK});
        request('https://testnet.blockchain.info/unspent?active='+address,
            function (error, response, body) {
                if (response.statusCode !== 200) {
                    console.error(body);
                    return new Error(body)
                }
                let bodyObj = JSON.parse(body);
                if (!bodyObj) return new Error('no utxos back or error');

                let utxos = bodyObj.unspent_outputs;
                const txb = new bitcoin.TransactionBuilder(NETWORK);
                txb.addInput(utxos[0].tx_hash_big_endian, utxos[0].tx_output_n);
                txb.addOutput(toAddress,parseInt(options.amount));
                txb.sign(0,fromPair);

                pushtx.pushtx(txb.build().toHex());

            });
    }
}
module.exports = BitcoinWallet;
