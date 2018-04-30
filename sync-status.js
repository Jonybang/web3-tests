var _ = require('lodash');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var lastCurrentBlock = null,
    diffHistory = [],
    period = 60;

printStatus();

setInterval(printStatus, 1000 * period);

function printStatus(){
        if(typeof web3.eth.syncing == 'object'){
                var diff = web3.eth.syncing.currentBlock - lastCurrentBlock;
                console.log(web3.eth.syncing.currentBlock + '/' + web3.eth.sync$
                if(lastCurrentBlock){
                        diffHistory.push(diff);
                        var avgDiff = Math.round(_.mean(diffHistory));
                        console.log('avg: ' + avgDiff + ' blocks per ' + period$
                        console.log('to end: ' + Math.round((web3.eth.syncing.h$
                }
                lastCurrentBlock = web3.eth.syncing.currentBlock;
        } else {
                console.log(web3.eth.syncing, new Date());
        }
}
