const fs = require("fs");
const solc = require('solc');
const _ = require('lodash');

var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

module.exports = {
	compile: function(sources){
		console.log('compile');
		var convertedSources = {};
		_.forEach(sources, function(path, name){
			convertedSources[name] = fs.readFileSync(path, 'utf8').toString();
		});
		return solc.compile({ sources: convertedSources }, 1, findImports);
	},
	deploy: function(compiledContract, accountAddress, args){
		console.log('deploy');
		let abi = compiledContract.interface;
		let bytecode = '0x' + compiledContract.bytecode;

		web3.eth.getGasPrice().then(function(gasPrice){
		web3.eth.estimateGas({data: bytecode}).then(function(gasEstimate){

		//console.log(JSON.parse(abi));
		//console.log(args);
		let MyContract = new web3.eth.Contract(JSON.parse(abi));
		MyContract
        		.deploy({
                		data: bytecode,
                		arguments: args
        		})
        		.send({
                		from: accountAddress,
                		//gas: gasEstimate,
                		gasPrice: "1000000000", //gasPrice + ""
				gas: 1942286
  				//gasPrice: '1000000000',
        		}, function(err, txHash){if(err)console.log(err); console.log('transactionHash', txHash);})

			.on('transactionHash', function(transactionHash){ console.log('transactionHash', transactionHash); })
        		.on('receipt', function(receipt){
                		console.log('receipt', receipt.contractAddress) // contains the new contract address
        		})
       			.on('confirmation', function(confirmationNumber, receipt){
                		console.log('confirmation', confirmationNumber, receipt.contractAddress)
        		})
        		.on('error', function(error){
               			console.log('error', error);
        		})
        		.then(function(newContractInstance){
        	        	console.log('address', newContractInstance.options.address);
	        	});

			console.log('sended');
			});
			});
	}
}

function findImports(importPath, sourcePath) {
  try {
    var filePath = path.resolve(sourcePath, importPath)
    return { contents: fs.readFileSync(filePath).toString() }
  } catch (e) {
    return { error: e.message }
  }
}

// Deploy contract syncronous: The address will be added as soon as the contract is mined.
// Additionally you can watch the transaction by using the "transactionHash" property
//var myContractInstance = MyContract.new(param1, param2, {data: myContractCode, gas: 300000, from: mySenderAddress});
//myContractInstance.transactionHash // The hash of the transaction, which created the contract
//myContractInstance.address // undefined at start, but will be auto-filled later
