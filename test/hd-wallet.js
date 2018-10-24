const HDWallet = require('../src/hd-wallet');
const coins = require('../src/assets/Assets');
const assert = require('assert');


//生成助记词 生成master钱包
let nm = HDWallet.generateMnemonic();
console.log(nm);
let nm2 = 'phone payment tomorrow arrange enable same harsh bacon end initial innocent wet category sea focus brother opinion fever thing rocket venture shy vivid month';
let wallet = HDWallet.fromMnemonic(nm2);

//生成瑞波账户
let xrpkeypair = {
    address:'rJCnMKwAQVfsHGRVQf9LowNJUMNWxftM8K',
    secret:'shR2Co9jt1Ym3kcZeqWQXRfA6aChA'}

let xrpAccount0 = wallet.getAccount(coins.XRP, 0);
assert.deepEqual(xrpAccount0, xrpkeypair);
assert.deepEqual(xrpAccount0, HDWallet.getAccountFromSecret(coins.XRP, xrpkeypair.secret));

//生成恒星账户
let xlmkeypair = { secret: 'SDJPWWZXVRYD5S3AEXMXKCWZFOIGDZQTFHNI4OWGCQ3RFHACXDDALOJ4',
address: 'GDRRJII7IAG6GFZ7YBV3HRT7UDM7W6JWHEAXQNDMGLG6II37FAYVUWUG' }

let xlmAccount0 = wallet.getAccount(coins.XLM, 0);
assert.deepEqual(xlmAccount0.secret, xlmkeypair.secret);
assert.deepEqual(xlmAccount0.address, HDWallet.getAccountFromSecret(coins.XLM, xlmkeypair.secret).address);
let xlmAccount1 = wallet.getAccount(coins.XLM, 1); // GBD6DSKTZ6WB5YVC2OX2TC2FWPEOYGSQDZTQSHVHOVPN76KEAT5LJJLL

HDWallet.sendTransaction(coins.XLM, xlmAccount0.secret, xlmAccount1.address, {amount: "1"})
//http://120.78.184.87:7020/account/GBD6DSKTZ6WB5YVC2OX2TC2FWPEOYGSQDZTQSHVHOVPN76KEAT5LJJLL

//生成以太坊账户
let ethkeypair = { secret: 'cbd9e3a4dc0cce391d7c07c208e2158ba17cfb2704f2c0e0f028de1683de93ee' ,
                   address: '0x0390d57e2a7192e788360388a7e80f9814c26d59'}

let ethAccount0 = wallet.getAccount(coins.ETH, 0);
assert.deepEqual(ethAccount0.secret.toLowerCase(), ethkeypair.secret);
assert.deepEqual(ethkeypair.address, HDWallet.getAccountFromSecret(coins.ETH, ethkeypair.secret).address.toLowerCase());
let ethAccount1 = wallet.getAccount(coins.ETH, 1);
HDWallet.sendTransaction(coins.ETH, ethAccount0.secret, ethAccount1.address, {amount: "0.1"})
//https://ropsten.etherscan.io/tx/0x0ea4079f8eeb314a854bb30715677e9db3608e4402813ad7bb8766928e397f37

console.log('done')