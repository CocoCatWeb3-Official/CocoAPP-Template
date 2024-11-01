import axios from "axios";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
});

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    if (response.config.baseURL != process.env.VUE_APP_BASE_API) {
      return response.data;
    } else {
      const res = response.data;

      // if the custom code is not 20000, it is judged as an error.
      if (res.code !== 200) {
        console.log(res.message || "Error");

        return Promise.reject(new Error(res.message || "Error"));
      } else {
        return res;
      }
    }
  },
  (error) => {
    return Promise.reject("err" + error); // for debug
  }
);

export default service;
