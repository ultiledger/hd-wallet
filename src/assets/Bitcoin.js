const bitcoin = require('bitcoinjs-lib');
const request = require('request');
const wif = require('wif');
const coinSelect = require('coinselect');


class BitcoinWallet{
    constructor(option) {
        this.option = option;
        if (option.network === 'testnet') {
            this.network = bitcoin.networks.testnet;
        }else {
            this.network = bitcoin.networks.bitcoin;
        }
    }

    getAccount(seed,path) {
        const root = bitcoin.bip32.fromSeed(Buffer.from(seed, 'hex'),this.network);
        const child = root.derivePath(path);
        let keyPair = bitcoin.ECPair.fromWIF(child.toWIF(),this.network);
        return this._getAccountFromECPair(keyPair);
    }
    getAccountFromSecret(secret) {
        const keyPair = this._getECPairFromSecret(secret);
        return this._getAccountFromECPair(keyPair);
    }
    _getAccountFromECPair(keyPair){
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
                if (error) {
                    return error;
                }
                let amount = options.amount || 0;
                let feeRate = options.feeRate || 45;
                let targets = [
                    {
                        address: toAddress,
                        value: amount
                    }
                ];
                let bodyObj = JSON.parse(body);
                if (!bodyObj) return new Error('no utxos back or error');
                let utxos = bodyObj.unspent_outputs;
                if (utxos.length <= 0) {
                    console.error('no utxo');
                    return new Error('no utxo');
                }
                let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);
                console.log('inputs',inputs);
                console.log('fee',fee);
                console.log('outputs',outputs);
                // .inputs and .outputs will be undefined if no solution was found
                if (!inputs || !outputs) {
                    console.error('.inputs and .outputs are undefined because no solution was found');
                    return new Error('.inputs and .outputs are undefined because no solution was found');
                }

                console.log('step3-> transaction:');
                const txb = new bitcoin.TransactionBuilder(NETWORK);
                inputs.forEach(input => txb.addInput(input.tx_hash_big_endian, input.tx_output_n));
                outputs.forEach(output => {
                    // watch out, outputs may have been added that you need to provide
                    // an output address/script for
                    if (!output.address) {
                        output.address = address
                    }
                    txb.addOutput(output.address, output.value)
                });
                for (let index in inputs) {
                    txb.sign(parseInt(index), fromPair);
                }
                console.log('txb.build().toHex()', txb.build().toHex());
                pushtx.pushtx(txb.build().toHex());

            });
    }

    getTxsByAddress(address,callback){
       return request('https://testnet.blockchain.info/address/'+address+'J?format=json&offset=0',callback);
    }

    validateAddress (address) {
        try {
            bitcoin.address.toOutputScript(address,this.network);
            return true
        } catch (e) {
            return false
        }
    }
}
module.exports = BitcoinWallet;
