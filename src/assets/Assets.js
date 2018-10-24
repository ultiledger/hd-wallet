const Ethereum = require('./Ethereum')
const Stellar = require('./Stellar')
const Ripple = require('./Ripple')

let assets = {
    "XLM" : {
        "name": "stellar",
        "displayName": "Stellar",
        "symbol": "XLM",
        "derive_path":"m/44'/148'/index'",
        "wallet" : new Stellar({server: "http://120.78.184.87:8000", passphrase: "Integration Test Network ; zulucrypto"}),
        //"server" : "http://120.78.184.87:8000",
        //"passphrase" : "Integration Test Network ; zulucrypto"
    },
    "ETH" : {
        "name": "ethereum",
        "displayName": "Ethereum",
        "symbol": "ETH",
        "derive_path": "m/44'/60'/0'/index'",
        "wallet" : new Ethereum({server: "https://ropsten.infura.io/721cc855e4584c45b76c6466aeecf547721cc855e4584c45b76c6466aeecf547"}),
        //"server": "https://ropsten.infura.io/721cc855e4584c45b76c6466aeecf547721cc855e4584c45b76c6466aeecf547"
    },
    "XRP" : {
        "name": "ripple",
        "displayName": "Ripple",
        "symbol": "XRP",
        "derive_path": "m/44'/144'/index'",
        "wallet" : new Ripple({}),
    }
}

module.exports  = assets;