import {
  EventBus
} from '../../services/events';
import {EthContract} from "../../services/ethContract";

export default {
    name: 'cabinet',
    components: {

    },
    created() {

    },
    mounted() {

    },
    methods: {
        onEthReady(){
			this.$root.contract.getProperty('name').then((result) => {
				this.contract_name = result;
			});
			this.$root.contract.getProperty('symbol').then((result) => {
				this.contract_symbol = result;
			});
			this.$root.contract.getProperty('totalSupply').then((result) => {
				this.contract_total_supply = result;
			});
			this.$root.contract.getProperty('currentSupply').then((result) => {
				this.contract_current_supply = result;
			});
			this.$root.contract.getProperty('payment', 'wei_to_eth').then((result) => {
				this.payment_amount = result;
			});
			this.$root.contract.getProperty('paymentPeriod', 'timestamp_to_hours').then((result) => {
				this.payment_period = result;
			});
        }
    },
    data() {
        return {
			contract_name: null,
			contract_symbol: null,
			contract_total_supply: null,
			contract_current_supply: null,
            payment_amount: null,
            payment_period: null
        }
    },
    computed: {
		eth_contract_address () {
			return this.$store.state.eth_contract_address
		},
		eth_contract_abi () {
			return this.$store.state.eth_contract_abi
		},
		eth_address () {
			return this.$store.state.eth_address
		},
		eth_ready () {
		    let eth_ready = this.$store.state.eth_ready;
		    if(eth_ready)
		        this.onEthReady();
			return eth_ready;
		},
    },
}
