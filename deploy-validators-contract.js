const account = require('./account');
const deployContract = require('./deploy-contract');

let compiledContract = deployContract.compile({
	'ValidatorsList.sol': 'contracts/ValidatorsList.sol'
});

deployContract.deploy(compiledContract.contracts['ValidatorsList.sol:ValidatorsList'], account, []);
