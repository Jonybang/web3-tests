import * as _ from 'lodash';

export class EthContract {

	constructor(web3, json_abi, address) {
		let abi_object = typeof json_abi === 'object' ? json_abi : JSON.parse(json_abi);
		this.contractInstance = new web3.eth.Contract(abi_object, address);
		this.web3 = web3;
	}

	getProperty(property_name, convert = null){
		return this.callMethod(property_name).then((result) => {
			if(!convert)
				return result;

			switch (convert){
				case 'wei_to_eth':
					return this.web3.utils.fromWei(result);
				case 'timestamp_to_hours':
					return result / (60 * 60);
			}
		})
	}

	callMethod(method_name){
		let method_args = _.map(arguments, (arg) => arg).slice(1);

		return new Promise((resolve, reject) => {
			this.contractInstance.methods[method_name].apply(this, method_args).call((err, result) => {
				return err ? reject(err) : resolve(result);
			})
		})
	}

	sendMethod(method_name, from_address){
		let method_args = _.map(arguments, (arg) => arg).slice(2);

		return new Promise((resolve, reject) => {
			this.getGasPrice().then((gasPrice) => {
				let method = this.contractInstance.methods[method_name].apply(this, method_args);

				method.estimateGas({ from: from_address }).then((gasAmount) => {
					if(this.$notify){
						this.$notify({
							type: 'info',
							title: "Open Metamask",
							text: "Please open Metamask to submit transaction"
						})
					}
					method.send({
						from: from_address,
						gasPrice: gasPrice,
						gas: gasAmount
					},(err, result) => {
						return err ? reject(err) : resolve(result);
					})
				})
			});
		})
	}

	getGasPrice(){
		return this.web3.eth.getGasPrice().then(function(gasPrice){
			gasPrice = parseInt(gasPrice);

			if(gasPrice < 1000000000)
				gasPrice = 1000000000;

			return gasPrice.toString();
		});
	}
}