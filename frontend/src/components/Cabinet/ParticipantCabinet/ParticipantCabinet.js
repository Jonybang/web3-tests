import * as _ from 'lodash';
import {EthContract} from "../../../services/ethContract";

export default {
	name: 'participant-cabinet',
	created() {
	},
	mounted() {
		if(this.eth_address)
			this.getTokenBalance(this.eth_address);

		this.$store.watch((state) => (state.eth_address), this.getTokenBalance);
	},
	methods: {
		getTokenBalance(eth_address){
			if(!eth_address)
				return;

			this.$root.contract.callMethod('balanceOf', eth_address).then((result) => {
				this.token_balance = result || 0;
			});
		}
	},
	data: function () {
		return {
			token_balance: null
		};
	},
	computed: {
		eth_address () {
			return this.$store.state.eth_address
		}
	}
}
