const account = require('./account');
const deployContract = require('./deploy-contract');

let compiledContract = deployContract.compile({
	'EIP20.sol': 'contracts/EIP20.sol',
	'EIP20Interface.sol': 'contracts/EIP20Interface.sol',
	'EIP20Factory.sol': 'contracts/EIP20Factory.sol'
});

deployContract.deploy(compiledContract.contracts['EIP20.sol:EIP20'], account, [1000, 'Jonybang', 1, 'JBG']);
