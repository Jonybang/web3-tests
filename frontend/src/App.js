import Vue from 'vue';
import {Modal} from "./directives/AsyncModal";
import {Tabs, Tab} from "./directives/tabs";
import Vuex from 'vuex';
import Web3 from 'web3';

import moment from 'moment';
import Notifications from 'vue-notification'

import storePlugin from './services/store.plugin.js';
import httpPlugin from './services/http.plugin.js';
import {EthContract} from "./services/ethContract";

Vue.use(Notifications);

Vue.use(httpPlugin);
Vue.use(Vuex);
Vue.use(storePlugin);

Vue.component('tabs', Tabs);
Vue.component('tab', Tab);
Vue.component('modal', Modal);

Vue.filter('beautyDate', function (date) {
  let mDate = moment(date);
  let now = moment();
  return now.diff(mDate, 'hours') >= 24 ? mDate.format("D MMMM YYYY H:mm:ss") : mDate.fromNow();
});

export default {
  name: 'app',
  created() {
	this.$http.initInstance(this);

    window.addEventListener('load', () => {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
			this.$root.web3 = new Web3(web3.currentProvider);
        } else {
            console.log('No web3? You should consider trying MetaMask!');
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
			this.$root.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }

		this.$root.web3.eth.getAccounts((error, accounts) => {
			this.$store.commit('eth_address', accounts[0]);

			this.$root.contract = new EthContract(this.$root.web3, this.eth_contract_abi, this.eth_contract_address);

			this.$store.commit('eth_ready', true);
		});

		let accountInterval = setInterval(() => {
			this.$root.web3.eth.getAccounts((error, accounts) => {
				if (accounts[0] === this.eth_address)
					return;
				this.$store.commit('eth_address', accounts[0]);
			});
		}, 1000);
    });
  },

  methods: {

  },

  mounted() {
    this.$root.$asyncModal = this.$refs.modal;
    this.$root.$asyncSubModal = this.$refs.sub_modal;
  },
  computed: {
	  eth_address () {
		  return this.$store.state.eth_address
	  },
	  eth_contract_address () {
		  return this.$store.state.eth_contract_address
	  },
	  eth_contract_abi () {
		  return this.$store.state.eth_contract_abi
	  },
  },
  data() {
    return {}
  },
}
