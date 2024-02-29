import{F as S,d,c as p,b as f,e as x,s as g,u as N,r as m,R as t,D as v,N as R,G as D}from"./index-H4Aju8zv.js";const I=async()=>{try{const e=await S(),s=e==null?void 0:e.uid,l=e==null?void 0:e.email,a=f(p(d,"users"),s);(await x(a)).exists()||await g(a,{bio:"",username:e==null?void 0:e.displayName,title:"",userId:s,pfp:e==null?void 0:e.photoURL,backgroundImage:"",email:e==null?void 0:e.email});const c=f(p(d,"user_sec_info"),s);if((await x(c)).exists()||await g(c,{archived:[],public_posts:[],public_post_count:0,private_posts:[],followers:[],following:[]}),s!=null){const i=await(await fetch("https://pralap-f9hz.onrender.com/users/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uid:s,email:l})})).json();console.log("User signed up successfully:",i),i.message==="success"&&(setSubmissionStatus("success"),setRedirect(!0)),i.error==="usernameError"&&setSubmissionStatus("usernameError")}}catch(e){console.error("SignupPage error:",e.message),e.code==="auth/weak-password"?setSubmissionStatus("passwordError"):e.code==="auth/email-already-in-use"?setSubmissionStatus("emailError"):setSubmissionStatus("error")}},P=()=>{const e=N(),[s,l]=m.useState({username:"",email:"",password:""}),[a,n]=m.useState(null),[c,w]=m.useState(!1),u=b=>{const{name:r,value:o}=b.target;l({...s,[r]:o})};m.useEffect(()=>{c===!0&&e("/profile")},[a]);const i=async b=>{b.preventDefault();try{const r=await D(s.username,s.email,s.password),o=r==null?void 0:r.uid,E=f(p(d,"users"),o);await g(E,{bio:"",username:s.username,title:"",userId:o,pfp:"https://images.unsplash.com/photo-1510723185481-c39848b105c0?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",backgroundImage:"",email:s.email});const y=f(p(d,"user_sec_info"),o);if(await g(y,{archived:[],public_posts:[],public_post_count:0,private_posts:[],followers:[],following:[]}),o!=null){const h=await(await fetch("https://pralap-f9hz.onrender.com/users/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uid:o,email:s.email})})).json();console.log("User signed up successfully:",h),h.message==="success"&&(n("success"),w(!0)),h.error==="usernameError"&&n("usernameError")}l({username:"",email:"",password:""})}catch(r){console.error("SignupPage error:",r.message),r.code==="auth/weak-password"?n("passwordError"):r.code==="auth/email-already-in-use"?n("emailError"):n("error")}};return t.createElement(t.Fragment,null,t.createElement("main",{className:"mx-auto flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat",style:{backgroundImage:`url(${v})`}},t.createElement("form",{onSubmit:i,className:"mb-8 flex lg:w-1/3  flex-col lg:space-y-16 space-y-8"},t.createElement("div",{className:"w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-custom-dark"},t.createElement("input",{type:"text",name:"username",placeholder:"Username",className:"w-full p-1 border-none text-custom-darkest-tree bg-transparent outline-none focus:outline-none placeholder:text-custom-darkest-tree  placeholder:font-serif placeholder:italic",value:s.username,onChange:u})),t.createElement("div",{className:"w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-custom-dark"},t.createElement("input",{type:"email",name:"email",placeholder:"Email",className:"w-full p-1 border-none text-custom-darkest-tree bg-transparent outline-none focus:outline-none placeholder:text-custom-darkest-tree  placeholder:font-serif placeholder:italic",value:s.email,onChange:u})),t.createElement("div",{className:"w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-custom-dark"},t.createElement("input",{type:"password",name:"password",placeholder:"Password",className:"w-full p-1 border-none text-custom-darkest-tree bg-transparent outline-none focus:outline-none placeholder:text-custom-darkest-tree  placeholder:font-serif placeholder:italic",value:s.password,onChange:u})),t.createElement("button",{type:"submit",className:"transform  w-full mx-auto bg-custom-beige bg-opacity-80 hover:bg-opacity-100 py-2 rounded-full lg:text-xl text-lg font-bold duration-300 "},"Sign Up"),a==="success"&&t.createElement("p",{className:"text-center text-green-500"},"Registration successful!"),a==="error"&&t.createElement("p",{className:"text-center text-red-500"},"Registration failed. Please try again."),a==="passwordError"&&t.createElement("p",{className:"text-center text-red-500"},"Password should be atleast 6 characters."),a==="emailError"&&t.createElement("p",{className:"text-center text-red-500"},"Email already in use ."),a==="usernameError"&&t.createElement("p",{className:"text-center text-red-500"},"Username already in use ."),t.createElement("p",{className:"text-center  text-lg text-custom-super-light"},"Already have an account?",t.createElement(R,{className:"font-medium text-indigo-500 underline-offset-4 px-2 hover:underline",to:"/login"},"Log In")))))};export{P as default,I as handleUsedGoogle};