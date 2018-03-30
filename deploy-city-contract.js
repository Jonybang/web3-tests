const account = require('./account');
const deployContract = require('./deploy-contract');

let compiledContract = deployContract.compile({
	'City.sol': 'contracts/City.sol',
	'EIP20Interface.sol': 'contracts/EIP20Interface.sol'
});
deployContract.deploy(compiledContract.contracts['City.sol:City'], account, [60000, 'Kaliningrad', 0, 'KGD']);
