import axios from 'axios';

export default class Http {
    //static base_url = 'https://api.mchs.hackerman.me/api/v1/';
    static base_url = process.env.NODE_ENV === 'development' ? 'http://localhost:8090/api/v1/' : '/api/v1/';

    static vueInstance;
    static beingAuth;

    static get(uri, params) {
        return Http.request('get', uri, {params: params});
    }
    static post(uri, data) {
        return Http.request('post', uri, data);
    }
    static put(uri, data) {
        return Http.request('put', uri, data);
    }
    static remove(uri) {
        return Http.request('remove', uri);
    }

    static request(method, uri, data){
      return axios[method](Http.base_url + uri, data).then((response) => {
        return response;
      }, function (error) {
        if(!Http.vueInstance)
          return;

        if(!error.response) {
          error.response = {status: 500};
        }
        switch (error.response.status) {
          case 200:
            if(method !== 'post')
              return;

            // Http.vueInstance.$notify({
            //   type: 'success',
            //   title: 'Success!',
            //   text: 'Action success!'
            // });
            break;

          case 400:
            Http.vueInstance.$notify({
              type: 'error',
              title: "invalid_request",
              text: "invalid_request_data"
            });

            break;

          case 401:
            if(uri !== 'current_user' && uri !== 'current_world' && uri !== 'available_action/add_pixel')
              Http.vueInstance.$notify({
                type: 'error',
                title: "need_auth",
                text: "please_sign_in"
              });

            if(Http.beingAuth){
              Http.vueInstance.$router.go({
                path: Http.vueInstance.$router.path,
                query: {
                  t: + new Date()
                }
              });
            }
            break;

          case 403:
            Http.vueInstance.$notify({
              type: 'error',
              title: "not_permitted",
              text: "dont_have_permission"
            });
            break;

          case 423:
            Http.vueInstance.$notify({
              type: 'error',
              title: "locked",
              text: "locked_message"
            });
            break;

          case 500:
            Http.vueInstance.$notify({
              type: 'error',
              title: "oops",
              text: "server_error"
            });
            break;
        }
      });
    }

    static current_user(){
      return Http.get('current_user').then(function (response) {
        if(response.status === 200){
          Http.beingAuth = true;
        }

        return response;
      })
    }

    static initInstance(vue){
      Http.vueInstance = vue;
    }
}
