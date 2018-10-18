var has = require('lodash/has')
var bip39 = require('bip39')
var derivePath = require('ed25519-hd-key').derivePath;
var getMasterKeyFromSeed = require('ed25519-hd-key').getMasterKeyFromSeed;
var getPublicKey = require('ed25519-hd-key').getPublicKey;

const ENTROPY_BITS = 256 // = 24 word mnemonic

const INVALID_SEED = 'Invalid seed (must be a Buffer or hex string)'
const INVALID_MNEMONIC = 'Invalid mnemonic (see bip39)'

/**
 * Class for SEP-0005 key derivation.
 * @see {@link https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md|SEP-0005}
 */
class HDWallet {
  /**
   * Instance from a BIP39 mnemonic string.
   * @param {string} mnemonic A BIP39 mnemonic
   * @param {string} [password] Optional mnemonic password
   * @param {string} [language='english'] Optional language of mnemonic
   * @throws {Error} Invalid Mnemonic
   */
  static fromMnemonic(mnemonic, password = undefined, language = 'english') {
    if (!HDWallet.validateMnemonic(mnemonic, language)) {
      throw new Error(INVALID_MNEMONIC)
    }
    return new HDWallet(bip39.mnemonicToSeedHex(mnemonic, password))
  }

  /**
   * Instance from a seed
   * @param {(string|Buffer)} binary seed
   * @throws {TypeError} Invalid seed
   */
  static fromSeed(seed) {
    let seedHex

    if (Buffer.isBuffer(seed)) seedHex = seed.toString('hex')
    else if (typeof seed === 'string') seedHex = seed
    else throw new TypeError(INVALID_SEED)

    return new HDWallet(seedHex)
  }

  /**
   * Generate a mnemonic using BIP39
   * @param {Object} props Properties defining how to generate the mnemonic
   * @param {Number} [props.entropyBits=256] Entropy bits
   * @param {string} [props.language='english'] name of a language wordlist as
   *          defined in the 'bip39' npm module. See module.exports.wordlists:
   *          here https://github.com/bitcoinjs/bip39/blob/master/index.js
   * @param {function} [props.rng] RNG function (default is crypto.randomBytes)
   * @throws {TypeError} Langauge not supported by bip39 module
   * @throws {TypeError} Invalid entropy
   */
  static generateMnemonic({
    entropyBits = ENTROPY_BITS,
    language = 'english',
    rngFn = undefined,
  } = {}) {
    if (language && !has(bip39.wordlists, language))
      throw new TypeError(
        `Language ${language} does not have a wordlist in the bip39 module`
      )
    const wordlist = bip39.wordlists[language]
    return bip39.generateMnemonic(entropyBits, rngFn, wordlist)
  }

  /**
   * Validate a mnemonic using BIP39
   * @param {string} mnemonic A BIP39 mnemonic
   * @param {string} [language='english'] name of a language wordlist as
   *          defined in the 'bip39' npm module. See module.exports.wordlists:
   *          here https://github.com/bitcoinjs/bip39/blob/master/index.js
   * @throws {TypeError} Langauge not supported by bip39 module
   */
  static validateMnemonic(mnemonic, language = 'english') {
    if (language && !has(bip39.wordlists, language))
      throw new TypeError(
        `Language ${language} does not have a wordlist in the bip39 module`
      )
    const wordlist = bip39.wordlists[language]
    return bip39.validateMnemonic(mnemonic, wordlist)
  }

  /**
   * New instance from seed hex string
   * @param {string} seedHex Hex string
   */
  constructor(seedHex) {
    this.seedHex = seedHex
  }

  /**
   * Get  account keypair of coin for child key at given index
   * @param {Coin} coins.XRP coin object
   * @param {Number} index Account index into path m/44'/148'/{index}
   * @return {address:xxx,secret:xxx} Keypair instance for the account
   */
  getAccount(coin,index) {
    let path = coin.derive_path.replace('index',index);
    const data = derivePath(path, this.seedHex);
    return coin.getKeypair(data.key);
  }

  static getAccountFromSecret(coin, secret) {
    return coin.getKeypairFromSecret(secret);
  }

}

module.exports = HDWallet;