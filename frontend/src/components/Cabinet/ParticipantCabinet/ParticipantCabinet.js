import * as _ from 'lodash';
import moment from 'moment';
import {EthContract} from "../../../services/ethContract";

export default {
	name: 'participant-cabinet',
	created() {
	},
	mounted() {
		if(this.eth_address)
			this.getTokenBalance(this.eth_address);

		this.$store.watch((state) => (state.eth_address), this.getTokenBalance);

		window.setInterval(() => {
			this.now = new Date();
		},1000);
	},
	methods: {
		getTokenBalance(eth_address){
			if(!eth_address)
				return;

			this.$root.contract.callMethod('balanceOf', eth_address).then((result) => {
				this.token_balance = result || 0;
			});

			this.$root.contract.callMethod('payments', eth_address).then((payments_result) => {
				this.$root.contract.getProperty('paymentPeriod').then((period_result) => {
					let timestamp = parseInt(payments_result.last_timestamp) + parseInt(period_result);
					this.next_payment_on = new Date(timestamp * 1000);
				});
			});
		},
		getPayment(){
			this.$root.contract.sendMethod('getPayment', this.eth_address).then((result) => {
				this.$notify({
					type: 'success',
					title: "Transaction success",
					text: "Transaction hash: " + result
				})
			});
		}
	},
	data: function () {
		return {
			token_balance: null,
			next_payment_on: null
		};
	},
	computed: {
		eth_address () {
			return this.$store.state.eth_address
		},
		until_next_payment(){
			this.now;
			let mDate = moment(this.next_payment_on);
			return mDate.fromNow();
		},
		is_next_payment_available(){
			this.now;
			return new Date() >= this.next_payment_on;
		}

	}
}
