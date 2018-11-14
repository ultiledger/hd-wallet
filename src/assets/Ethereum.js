const Web3 = require('web3');
const EthUtil = require("ethereumjs-util")
const Tx = require('ethereumjs-tx');

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes
  }

class EthereumWallet{
    constructor(option) {
        this.option = option
    }

    getAccount(hdKey) {
        let wallet = hdKey.getWallet()
        let secret = wallet.getPrivateKeyString().substring(2)
        let address = wallet.getChecksumAddressString()
        return { secret, address };
    }

    getAccountFromSecret(secret) {
        const address = `0x${EthUtil.privateToAddress(hexToBytes(secret)).toString('hex')}`;
        return { secret, address};
    }

    async sendTransaction(fromSecret, to, option = {}){
        const web3 = new Web3(new Web3.providers.HttpProvider(this.option.server));
        const from = `0x${EthUtil.privateToAddress(hexToBytes(fromSecret)).toString('hex')}`;

        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 210000; 
        const remoteNonce = await web3.eth.getTransactionCount(from);
        const amountWei = web3.utils.toWei(option.amount, "ether");
        const privKey = Buffer.from(fromSecret, 'hex', {from: from});

        const rawTransaction = {
            "from": from,
            "nonce": web3.utils.toHex(remoteNonce),
            "gasPrice": web3.utils.toHex(gasPrice),
            "gasLimit": web3.utils.toHex(gasLimit),
            "to": to,
            "value": web3.utils.toHex(amountWei)
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


module.exports = EthereumWallet