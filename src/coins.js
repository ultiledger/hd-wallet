var stellar_Keypair = require('stellar-base').Keypair;
const StellarSdk = require('stellar-sdk');

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
        server : "http://120.78.184.87:8000",
        passphrase : "Integration Test Network ; zulucrypto",
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
        },
        /**
         * 
         * @param {*} fromSecret secret of sender
         * @param {*} to 
         * @param {*} option json object which contains: amount, asset(default xlm), memo
         */
        sendTransaction: function(fromSecret, to, option = {}){
            if(!option.asset){
                option.asset = StellarSdk.Asset.native();
            }
            if(!option.amount){
                // TODO, validate 
            }

            StellarSdk.Network.use(new StellarSdk.Network(this.passphrase));
            const server = new StellarSdk.Server(this.server, {allowHttp: true});
            const fromPair = StellarSdk.Keypair.fromSecret(fromSecret);

            server.loadAccount(to)
            // If the account is not found, surface a nicer error message for logging.
            .catch(StellarSdk.NotFoundError, function (error) {
              throw new Error(`The destination ${toPair.publicKey()} does not exist!`);
            })
            .then(function() {
              return server.loadAccount(fromPair.publicKey());
            })
            .then(function(fromAccount) {
                let txBuilder = new StellarSdk.TransactionBuilder(fromAccount);
          
                txBuilder.addOperation(StellarSdk.Operation.payment({
                    destination: to,
                    asset: option.asset || StellarSdk.Asset.native(),
                    amount: option.amount ? option.amount + "" : "1"
                }))
    
                if(option.memo){
                    // TODO set memo type in option
                    txBuilder.addMemo(StellarSdk.Memo.hash(option.memo))
                }
                  
                let tx = txBuilder.build()
                tx.sign(fromPair);
                return server.submitTransaction(tx);
              })
              .catch(function(error) {
                console.error('Something went wrong!', error);
              });
        }
     },
     'ETH': {
        name: 'ethereum',
        displayName: 'Ethereum',
        ticker: 'ETH',
        derive_path: "m/44'/60'/0'/index'",
        server: 'https://ropsten.infura.io/721cc855e4584c45b76c6466aeecf547721cc855e4584c45b76c6466aeecf547',
        getKeypair: function(hdKey) {
            let wallet = hdKey.getWallet()
            let secret = wallet.getPrivateKeyString().substring(2)
            let address = wallet.getChecksumAddressString()
            return { secret, address };
          },
        getKeypairFromSecret:function(secret) {
            const address = `0x${EthUtil.privateToAddress(hexToBytes(secret)).toString('hex')}`;
            return { secret, address};
        },
        sendTransaction: function(fromSecret, to, option = {}){

        }
     },
}

module.exports = coins;