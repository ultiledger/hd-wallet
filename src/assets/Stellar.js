const StellarSdk = require('stellar-sdk');

class StellarWallet {
    constructor(option) {
        this.option = option
    }

    getAccount(key) {
        const keypair =  StellarSdk.Keypair.fromRawEd25519Seed(key);
        const address = keypair.publicKey();
        const secret = keypair.secret();
        return { secret, address };
    }

    getAccountFromSecret(secret) {
        const keypair = StellarSdk.Keypair.fromSecret(secret);
        const address = keypair.publicKey();
        return { secret, address };
    }
    
    /**
     * 
     * @param {*} fromSecret secret of sender
     * @param {*} to 
     * @param {*} option json object which contains: amount, asset(default xlm), memo
     */
    sendTransaction(fromSecret, to, option={}){
        if(!option.asset){
            option.asset = StellarSdk.Asset.native();
        }
        if(!option.amount){
            // TODO, validate 
        }

        StellarSdk.Network.use(new StellarSdk.Network(this.option.passphrase));
        const server = new StellarSdk.Server(this.option.server, {allowHttp: true});
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
}

module.exports = StellarWallet