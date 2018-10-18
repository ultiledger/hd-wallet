var stellar_Keypair = require('stellar-base').Keypair;
var ripple_keypairs = require('ripple-keypairs');
var EthUtil = require("ethereumjs-util")

 function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes
  }

let coins = {
    'XRP': {
        name: 'ripple',
        displayName:'Ripple',
        ticker:'XRP',
        derive_path:"m/44'/144'/index'",
        getKeypair: function(key) {
            let options = {'entropy':key};
            const secret = ripple_keypairs.generateSeed(options);
            const keypair = ripple_keypairs.deriveKeypair(secret);
            const address = ripple_keypairs.deriveAddress(keypair.publicKey);
            return { secret, address };
          },
        getKeypairFromSecret:function(secret) {
            const keypair = ripple_keypairs.deriveKeypair(secret);
            const address = ripple_keypairs.deriveAddress(keypair.publicKey);
            return { secret, address };
        }
     },
     'XLM': {
        name: 'stellar',
        displayName:'Stellar',
        ticker:'XLM',
        derive_path:"m/44'/148'/index'",
        getKeypair: function(key) {
            const keypair =  stellar_Keypair.fromRawEd25519Seed(key);
            const address = keypair.publicKey();
            const secret = keypair.secret();
            return { secret, address };
          },
        getKeypairFromSecret:function(secret) {
            const keypair = stellar_Keypair.fromSecret(secret);
            const address = keypair.publicKey();
            return { secret, address };
        }
     },
     'ETH': {
        name: 'ethereum',
        displayName:'Ethereum',
        ticker:'ETH',
        derive_path:"m/44'/60'/0'/index'",
        getKeypair: function(hdKey) {
            let wallet = hdKey.getWallet()
            let secret = wallet.getPrivateKeyString() //TODO: validate
            let address = wallet.getChecksumAddressString()
            return { secret, address };
          },
        getKeypairBySecret:function(secret) {
            const address = `0x${EthUtil.privateToAddress(hexToBytes(privateKey)).toString('hex')}`;
            return { secret, address };
        }
     },
}

module.exports = coins;