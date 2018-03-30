var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var subscription = web3.eth.subscribe('Transfer', {
    address: '0xA28C19f0F5219255cEB861d1473208D6C7e0A85c'
    // topics: ['0x12345...']
}, function(error, result){
    if (error)
		console.log('Transfer error', error);
    else
        console.log('Transfer', result);
});
