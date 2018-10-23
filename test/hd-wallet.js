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

// let xlmAccount0 = wallet.getAccount(coins.XLM,0);
// assert.deepEqual(xlmAccount0, xlmkeypair);
// assert.deepEqual(xlmAccount0,HDWallet.getAccountFromSecret(coins.XLM, xlmkeypair.secret));

//生成以太坊账户 TODO
let ethkeypair = { secret: 'cbd9e3a4dc0cce391d7c07c208e2158ba17cfb2704f2c0e0f028de1683de93ee' ,
                   address: '0x0390D57E2a7192e788360388A7E80f9814c26D59'}

let ethAccount0 = wallet.getAccount(coins.ETH,0);
assert.deepEqual(ethAccount0, ethkeypair);
//assert.deepEqual(ethkeypair, HDWallet.getAccountFromSecret(coins.ETH, ethkeypair.secret));
