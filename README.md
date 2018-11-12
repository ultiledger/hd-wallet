# hd-wallet
## Usage

```js
var HDWallet = require('../src/hd-wallet');
var coins = require('../src/coins');
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

let xrpAccount0 = wallet.getAccount(coins.XRP,0);
assert.deepEqual(xrpAccount0, xrpkeypair);
assert.deepEqual(xrpAccount0,HDWallet.getAccountFromSecret(coins.XRP, xrpkeypair.secret));

//生成恒星账户
let xlmkeypair = { secret: 'SB6BUWP6S5AAAZ4NUFSA463ABXV4GK3UWGNP3JDH757CBGD2KWKM5UM4',
address: 'GBKKQLDNFLCJHW4GM4YN5H6X2LRCEYBFIPRR3M5URCDJEJM5DFWDRZET' }

let xlmAccount0 = wallet.getAccount(coins.XLM,0);
assert.deepEqual(xlmAccount0, xlmkeypair);
assert.deepEqual(xlmAccount0,HDWallet.getAccountFromSecret(coins.XLM, xlmkeypair.secret));

//生成以太坊账户 TODO
let ethkeypair = { secret: 'SB6BUWP6S5AAAZ4NUFSA463ABXV4GK3UWGNP3JDH757CBGD2KWKM5UM4',
address: 'GBKKQLDNFLCJHW4GM4YN5H6X2LRCEYBFIPRR3M5URCDJEJM5DFWDRZET' }

let ethAccount0 = wallet.getAccount(coins.XLM,0);
assert.deepEqual(ethkeypair, xlmkeypair);
assert.deepEqual(ethkeypair,HDWallet.getAccountFromSecret(coins.ETH, ethkeypair.secret));


// 生成bitcoin账户
let btckeypair = {  secret:'L4wZvj8hwwakJ6PTjKaMAngchDr2L6SSUoAaDshJSV4sC3DmFtVX',
                    address:'1M9VaPKbdsk78dqS85wtmoUaNjNY21p5x8'}

let btcAccount0 = wallet.getAccount(coins.BTC,0);
assert.deepEqual(btcAccount0.secret.toLowerCase(), btckeypair.secret.toLowerCase());
assert.deepEqual(btckeypair.address.toLowerCase(), HDWallet.getAccountFromSecret(coins.BTC, btckeypair.secret).address.toLowerCase());
