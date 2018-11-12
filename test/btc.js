const bip39 = require('bip39');
const bip32 = require('bip32');
const request = require('request');
const bitcoin = require('bitcoinjs-lib');
const INSIGHT_API_URL='http://localhost:3001/insight-api/';
const NETWORK = bitcoin.networks.testnet;
const bs58 = require('bs58');
const assert = require('assert');
const pushtx = require('blockchain.info/pushtx').usingNetwork(3);
const wif = require('wif');

console.log('step1-> generate address:');
const mnemonic = 'phone payment tomorrow arrange enable same harsh bacon end initial innocent wet category sea focus brother opinion fever thing rocket venture shy vivid month';
const seed = bip39.mnemonicToSeed(mnemonic);
const path = "m/44'/0'/0'/0";
const root = bitcoin.bip32.fromSeed(seed,NETWORK);
const child = root.derivePath(path);
let alice = importFromWIF(child.toWIF());
console.log('alice-address:',getAddress(alice));

const seed2 = bip39.mnemonicToSeed(mnemonic);
const path2 = "m/44'/0'/0'/1";
const root2 = bip32.fromSeed(seed2,NETWORK);
const child2 = root2.derivePath(path2);
let bob = importFromWIF(child2.toWIF());
console.log('bob-address:',getAddress(bob));

console.log('========================');
console.log('step2-> get utxos:');
request('https://testnet.blockchain.info/unspent?active='+getAddress(alice),
    function (error, response, body) {
        let bodyObj = JSON.parse(body);
        if (!bodyObj) return new Error('no utxos back or error');
        let utxos = bodyObj.unspent_outputs;
        console.log('utxos',utxos);

        console.log('step3-> transaction:');
        const txb = new bitcoin.TransactionBuilder(NETWORK);
        console.log('utxo',utxos[0]);
        txb.addInput(utxos[0].tx_hash_big_endian, utxos[0].tx_output_n);
        txb.addOutput(getAddress(bob),55000000);
        txb.sign(0,alice);
        console.log('txb.build().toHex()',txb.build().toHex());
        verifyTransaction(txb.build().toHex(),alice);
        pushtx.pushtx(txb.build().toHex());

    });



function importFromWIF(wifstring) {
    const keyPair = bitcoin.ECPair.fromWIF(wifstring,NETWORK);
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    console.log('wif-address',address);
    console.log('keyPair.d',keyPair.__d.toString('hex'));
    console.log('wif-publicKey',keyPair.publicKey.toString('hex'),bs58.encode(keyPair.publicKey));
    console.log('wif-privateKey',keyPair.privateKey.toString('hex'),bs58.encode(keyPair.privateKey));
    let encoded = wif.encode(
        0x80,
        Buffer.from(keyPair.privateKey, 'hex'),
        true
    );
    console.log('encoded',encoded);
    return keyPair;
}
function getAddress(ecpair) {
    const { address } = bitcoin.payments.p2pkh({ pubkey: ecpair.publicKey,network:NETWORK});
    return address
}

function verifyTransaction(txHex,keyPair) {
    const tx = bitcoin.Transaction.fromHex(txHex);
    tx.ins.forEach(function (input, i) {
        const p2pkh = bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            input: input.script
        });
        const ss = bitcoin.script.signature.decode(p2pkh.signature);
        const hash = tx.hashForSignature(i, p2pkh.output, ss.hashType);
        console.log('verifyTransaction-hash',hash.toString('hex'));
        console.log('verifyTransaction-ss',ss.signature.toString('hex'));
        console.log(keyPair.verify(hash, ss.signature));
        assert.strictEqual(keyPair.verify(hash, ss.signature), true)

    });




}