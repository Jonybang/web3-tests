const account = require('./account');
const deployContract = require('./deploy-contract');

let compiledContract = deployContract.compile({
	'EIP20.sol': 'contracts/EIP20.sol',
	'EIP20Interface.sol': 'contracts/EIP20Interface.sol'
});

deployContract.deploy(compiledContract.contracts['EIP20.sol:EIP20'], account, [1000, 'Jonybang', 1, 'JBG']);
