// // import { boot } from 'quasar/wrappers';
// // import axios from 'axios';

// // const api = axios.create({
// //   baseURL: process.env.VUE_APP_API_URL,
// //   optionSuccessStatus: 200,
// //   headers:{
// //     Accept:'application/json',
// //   'Content-Type': 'application/json',
// //   'X-Requested-With': 'XMLHttpRequest',
// //   //  'Accepted':'multipart/form-data'
// //   },
// //     withCredentials: true,
// // });

// // // Add a request interceptor to include the token in the Authorization header
// // api.interceptors.request.use((config) => {
// //   const token = document.cookie
// //     .split('; ')
// //     .find((row) => row.startsWith('auth_token='))
// //     ?.split('=')[1];

// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`; // Include the token in the Authorization header
// //   }

// //   return config;
// // });


// // export default boot(({ app }) => {
// //   app.config.globalProperties.$axios = axios;
// //   app.config.globalProperties.$api = api;
// // });

// // export { api };
// import { boot } from 'quasar/wrappers';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.VUE_APP_API_URL,
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest',
//   },
//   withCredentials: true,
// });

// // Single interceptor to handle all tokens
// api.interceptors.request.use((config) => {
//   // Check for auth_token first
//   let token = document.cookie
//     .split('; ')
//     .find((row) => row.startsWith('auth_token='))
//     ?.split('=')[1];

//   // If not found, check admin_token
//   if (!token) {
//     token = document.cookie
//       .split('; ')
//       .find((row) => row.startsWith('admin_token='))
//       ?.split('=')[1];
//   }

//   // If still not found, check rater_token
//   if (!token) {
//     token = document.cookie
//       .split('; ')
//       .find((row) => row.startsWith('rater_token='))
//       ?.split('=')[1];
//   }

//   // If a token is found, set the Authorization header
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default boot(({ app }) => {
//   app.config.globalProperties.$axios = axios;
//   app.config.globalProperties.$api = api;
// });

// export { api };
