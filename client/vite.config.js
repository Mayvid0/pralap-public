// import { defineConfig } from 'vite';
// import reactRefresh from '@vitejs/plugin-react-refresh';

// export default defineConfig({
//   plugins: [reactRefresh()],
//   base: '/', // Set the base path to the root
//   build: {
//     rollupOptions: {
//       input: { 
//         home: './src/pages/home/home.jsx',
//         explore: './src/pages/explore/explorePage.jsx',
//         create: './src/pages/pralAp/creativePage.jsx',
//         profile: './src/pages/profile/profilePage.jsx',
//         login: './src/pages/login/loginPage.jsx',
//         signup: './src/pages/signup/signupPage.jsx',
//         blogs: './src/pages/Blogs/BlogPost.jsx'
//         // Add more entry points as needed
//       }
//     }
//   }
// });


import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  define: {
    "process.env.IS_PREACT": JSON.stringify("true"),
  },
});