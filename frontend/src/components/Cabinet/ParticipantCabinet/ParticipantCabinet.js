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
				this.token_balance = parseInt(result || 0);
				this.token_balance_loaded = true;

				if(this.token_balance)
					this.getPaymentsInfo(eth_address);
				else
					this.getConfirmationsInfo(eth_address);
			});
		},

		getPayment(){
			this.$root.contract.sendMethod(this.eth_address, 'getPayment').then((result) => {
				this.$notify({
					type: 'success',
					title: "Transaction success",
					text: "Transaction hash: " + result
				})
			});
		},

		requestParticipation(){
			this.$root.contract.sendMethod(this.eth_address, 'requestParticipation').then((result) => {
				this.$notify({
					type: 'success',
					title: "Participation request sent, please wait for confirm",
					text: "Transaction hash: " + result
				});

				setTimeout(() => {
					this.getTokenBalance(this.eth_address);
				}, 5000);
			});
		},

		getPaymentsInfo(eth_address){
			this.$root.contract.callMethod('payments', eth_address).then((accountPayments) => {
				this.$root.contract.getProperty('paymentPeriod').then((paymentPeriod) => {
					this.payment_received = this.$root.web3.utils.fromWei(accountPayments.total_amount);

					let timestamp = parseInt(accountPayments.last_timestamp) + parseInt(paymentPeriod);
					this.next_payment_on = new Date(timestamp * 1000);
				});
			});
		},

		getConfirmationsInfo(eth_address){
			this.$root.contract.callMethod('participationRequests', eth_address).then((accountParticipationRequests) => {
				this.$root.contract.getProperty('confirmsToParticipation').then((confirmsToParticipation) => {
					this.participation_request_sent = accountParticipationRequests.sent;
					this.confirmations_count = accountParticipationRequests.confirmations_count;
					this.confirms_to_participation = confirmsToParticipation;

					if(accountParticipationRequests.confirmed)
						this.getTokenBalance(eth_address);
				});
			});
		}
	},
	data: function () {
		return {
			token_balance_loaded: false,
			token_balance: null,
			payment_received: null,
			next_payment_on: null,
			participation_request_sent: null,
			confirmations_count: null,
			confirms_to_participation: null
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
