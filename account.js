const _ = require('lodash');
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const config = require('./config');

if (config.address)
	showBalance(config.address);
else
	web3.eth.personal.newAccount(config.password).then(showBalance);

module.exports = config.address;

//web3.eth.accounts.encrypt(config.privateKey, '111');
//web3.eth.accounts.wallet.add(account);
//web3.eth.accounts.wallet.save("111");
//web3.eth.accounts.wallet.load("111");
function showBalance(address) {
	web3.eth.getBalance(address).then(function (response) {
		console.log('account:', {address: address, balance: response});
	});
}
