import * as _ from 'lodash';

export default {
  name: 'mayor-cabinet',
  created() {
	  this.$root.contract.getProperty('confirmsToParticipation').then((result) => {
		  this.confirms_to_participation = result;
	  });
  },
  mounted() {

  },
  methods: {
	  saveConfirmsToParticipation(){
		  this.$root.contract.sendMethod(this.eth_address, 'configureConfirmsToParticipation', parseInt(this.confirms_to_participation)).then((result) => {
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
		confirms_to_participation: null
    };
  },
  computed: {
	  eth_address () {
		  return this.$store.state.eth_address
	  },
  }
}
