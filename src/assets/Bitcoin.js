class BitcoinWallet {
    constructor(option) {
        this.option = option
    }

    getAccount(key) {
        
    }

    getAccountFromSecret(secret) {
    }
    
    /**
     * 
     * @param {*} fromSecret secret of sender
     * @param {*} to 
     * @param {*} option json object which contains: amount, asset(default xlm), memo
     */
    sendTransaction(fromSecret, to, option={}){
    }
}

module.exports = BitcoinWallet