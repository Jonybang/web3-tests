const fs = require("fs");
const solc = require('solc');
const _ = require('lodash');
const config = require('./config');

const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

module.exports = {

	compile: function (sources) {
		console.log('compile');

		const convertedSources = {};
		_.forEach(sources, function (path, name) {
			convertedSources[name] = fs.readFileSync(path, 'utf8').toString();
		});
		let result = solc.compile({sources: convertedSources}, 1, findImports);

		if(result.errors && result.errors.length)
			throw result.errors;

		return result;
	},

	deploy: function (compiledContract, accountAddress, args) {
		console.log('deploy');

		let abi = compiledContract.interface;
		let bytecode = '0x' + compiledContract.bytecode;

		require('./get-gas-price')().then(function (gasPrice) {
			web3.eth.personal.unlockAccount(accountAddress, config.password).then(function (response) {

				web3.eth.estimateGas({data: bytecode}).then(function (gasEstimate) {

					let MyContract = new web3.eth.Contract(JSON.parse(abi));
					MyContract
						.deploy({
							data: bytecode,
							arguments: args
						})
						.send({
							from: accountAddress,
							gas: gasEstimate * 2,
							gasPrice: gasPrice,
							// gas: 1942286
							//gasPrice: '1000000000',
						}, function (err, txHash) {
							if (err)
								console.log('Send contract error', err);
							console.log('transactionHash', txHash);
						})

						.on('receipt', function (receipt) {
							console.log('contract address:', receipt.contractAddress); // contains the new contract address

							saveAbiFile('abi-' + receipt.contractAddress + '.json', abi)
						})
						.on('confirmation', function (confirmationNumber, receipt) {
							console.log('confirmation', confirmationNumber)
						})
						.on('error', function (error) {
							console.log('error', error);
						})
						.then(function (newContractInstance) {
							// console.log('address', newContractInstance.options.address);
						});

					console.log('sended');
				});
			});
		});
	}
};

function saveAbiFile(file_name, content) {
	fs.appendFile(file_name, content, function (err) {
		if (err)
			console.log('Error: abi save incomplete, please save it manually:', content);
		else
			console.log('Abi file saved:', file_name);
	});
}

function findImports(importPath, sourcePath) {
	try {
		const filePath = path.resolve(sourcePath, importPath)
		return {contents: fs.readFileSync(filePath).toString()}
	} catch (e) {
		return {error: e.message}
	}
}

// Deploy contract syncronous: The address will be added as soon as the contract is mined.
// Additionally you can watch the transaction by using the "transactionHash" property
//var myContractInstance = MyContract.new(param1, param2, {data: myContractCode, gas: 300000, from: mySenderAddress});
//myContractInstance.transactionHash // The hash of the transaction, which created the contract
//myContractInstance.address // undefined at start, but will be auto-filled later
