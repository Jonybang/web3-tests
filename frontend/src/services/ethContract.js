export class EthContract {

	constructor(web3, json_abi, address) {
		let abi_object = typeof json_abi === 'object' ? json_abi : JSON.parse(json_abi);
		this.contractInstance = new web3.eth.Contract(abi_object, address);
		this.web3 = web3;
	}

	getProperty(property_name, convert = null){
		return new Promise((resolve, reject) => {
			this.contractInstance.methods[property_name]().call((err, result) => {
				return err ? reject(err) : resolve(result);
			})
		}).then((result) => {
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

	callMethod(method_name, arg1, arg2, arg3){
		return new Promise((resolve, reject) => {
			this.contractInstance.methods[method_name](arg1).call((err, result) => {
				return err ? reject(err) : resolve(result);
			})
		})
	}
}