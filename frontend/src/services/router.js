import Vue from 'vue';
import Router from 'vue-router';
import Cabinet from '../components/Cabinet/Cabinet.vue';
import ParticipantCabinet from '../components/Cabinet/ParticipantCabinet/ParticipantCabinet.vue';
import MayorCabinet from '../components/Cabinet/MayorCabinet/MayorCabinet.vue';

Vue.use(Router);

export default new Router({
  //mode: 'history',
  routes: [
	  {
		  path: '/',
		  name: 'cabinet',
		  component: Cabinet,
		  children: [
			  {
				  path: 'participant',
				  name: 'participant-cabinet',
				  component: ParticipantCabinet,
			  },
			  {
				  path: 'mayor',
				  name: 'mayor-cabinet',
				  component: MayorCabinet,
			  }
		  ]
	  },
      {
        path: '*', redirect: ''
      }
  ]
})
