import{a as ae,u as re,h as se,r as i,U as ne,b as u,y as _,H as w,R as e,I as E,D as ce,d as p,s as g,f as z,i as P,C as O,J as T,K as le}from"./index-H4Aju8zv.js";import{F as v,b as ie,e as de,g as me,h as ue}from"./index-PwullOj6.js";import{M as pe,r as he,q as fe,t as ge}from"./editpost-XdFo_JIO.js";/*! clipboard-copy. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */var be=we;function R(){return new DOMException("The request is not allowed","NotAllowedError")}async function xe(r){if(!navigator.clipboard)throw R();return navigator.clipboard.writeText(r)}async function ve(r){const o=document.createElement("span");o.textContent=r,o.style.whiteSpace="pre",o.style.webkitUserSelect="auto",o.style.userSelect="all",document.body.appendChild(o);const a=window.getSelection(),h=window.document.createRange();a.removeAllRanges(),h.selectNode(o),a.addRange(h);let f=!1;try{f=window.document.execCommand("copy")}finally{a.removeAllRanges(),window.document.body.removeChild(o)}if(!f)throw R()}async function we(r){try{await xe(r)}catch(o){try{await ve(r)}catch(a){throw a||o||R()}}}const Ee=ae(be),ye=async r=>await fetch(`https://pralap-f9hz.onrender.com/blogs/blog/${r}`,{method:"DELETE",headers:{"Content-Type":"application/json"}}),Se=()=>{const r=re(),{postId:o}=se(),[a,h]=i.useState(null),[f,y]=i.useState(null),s=i.useContext(ne),t=s==null?void 0:s.uid,[U,k]=i.useState(!1),[B,A]=i.useState(!1),[N,$]=i.useState(!1),q=()=>{k(!U)},H=async()=>{await J(),k(!1)},J=async()=>{try{const n=u(p,"post",o),c=!a.public;await g(n,{public:c},{merge:!0});const l=u(p,"user_sec_info",t);(c?0:1)==1?(await g(l,{private_posts:z(o),public_post_count:P(-1)},{merge:!0}),await g(l,{public_posts:O(o)},{merge:!0})):(await g(l,{private_posts:O(o),public_post_count:P(1)},{merge:!0}),await g(l,{public_posts:z(o)},{merge:!0})),console.log("Blog updated in Firestore successfully!")}catch(n){console.error("Error updating blog in Firestore:",n)}},V=()=>{r(`/create/${o}`)},G=()=>{A(!0),k(!1)},K=async()=>{$(!0);const n=await ye(o);try{const c=await n.json();if(n.status===200)if(c.success){const l=u(p,"post",o);await T(l);const d=u(p,"post_sec_info",o);await T(d);const C=u(p,"user_sec_info",t);await g(C,{public_post_count:P(-1)},{merge:!0}),r("/explore")}else console.error("Deletion failed. Server message:",c.message);else console.error("Unexpected response status:",n.status)}catch(c){console.error("Error parsing JSON response:",c)}},L=()=>{A(!1)};i.useEffect(()=>{const n=u(p,"post",o),c=u(p,"post_sec_info",o),l=_(n,m=>{if(m.exists()){const D=m.data();h(D)}}),d=_(c,m=>{if(m.exists()){const S=m.data().users_who_liked.includes(t);j(S)}}),C=_(c,m=>{if(m.exists()){const S=m.data().users_who_archived.includes(t);I(S)}});return()=>{l(),d(),C()}},[o,t]),i.useEffect(()=>{(async()=>{const c=encodeURIComponent(o);try{const l=await fetch(`https://pralap-f9hz.onrender.com/blogs/blog/${c}`),d=await l.json();l.ok?y(d==null?void 0:d.content):console.error("Error fetching data from server:",d.error)}catch(l){console.error("Error fetching data from server:",l)}})()},[o]);const[F,Y]=i.useState(!1),M=()=>{Y(window.scrollY>0)};i.useEffect(()=>(window.addEventListener("scroll",M),()=>window.removeEventListener("scroll",M)),[]);const Q=w({height:F?"0vh":"100vh",config:{tension:90,friction:12}}),[b,j]=i.useState(!1),[x,I]=i.useState(!1),W=w({transform:b?"scale(1.5)":"scale(1)",color:b?"red":"#A7A7A7",borderColor:b?"white":"black"}),X=w({transform:x?"scale(1.5)":"scale(1)",color:x?"white":"grey",borderColor:x?"white":"black"}),Z=()=>{console.log("Like button clicked"),fe(o,t,b?0:1),j(!b)},ee=()=>{console.log("Archive button clicked"),ge(o,t,x?0:1),I(!x)},te=()=>{r(`/profile/${a.createdBy}`)},oe=()=>{const n=window.location.href;Ee(n).then(()=>{window.alert("URL copied to clipboard!")}).catch(c=>{console.error("Failed to copy URL to clipboard:",c),window.alert("Failed to copy URL to clipboard.")})};return e.createElement(e.Fragment,null,a&&e.createElement("div",{className:" overflow-hidden min-h-screen"},e.createElement(E.div,{className:"absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center",style:{...Q,backgroundImage:`url(${ce})`,backgroundPosition:"center",backgroundSize:"cover",backgroundRepeat:"no-repeat"}},e.createElement("div",{className:"relative z-10 text-center flex-col items-end justify-evenly max-w-[60%]"},e.createElement("h1",{className:"md:text-5xl text-xl font-extrabold text-custom-white text-center "},a==null?void 0:a.title),e.createElement("div",{className:"mt-20 text-custom-white flex items-center justify-center space-x-5 text-center font-thin"},e.createElement("p",null," by "),e.createElement("p",{onClick:te,className:"text-custom-white font-light cursor-pointer transform transition-transform hover:scale-110"},a==null?void 0:a.username)),e.createElement("div",{className:"flex items-center space-x-10 md:space-x-20 justify-center text-center font-thin mt-16 md:mt-28"},e.createElement(E.div,{style:{...W},onClick:Z,className:"like-button "},e.createElement(v,{className:" hover:scale-110",icon:ie})),e.createElement(E.div,{style:{...X},onClick:ee,className:"like-button"},e.createElement(v,{className:" hover:scale-110",icon:de})),e.createElement("div",{onClick:oe},e.createElement(v,{className:" text-gray-400 hover:scale-125",icon:me})))),e.createElement("div",null,t==(a==null?void 0:a.createdBy)&&e.createElement("div",{className:"absolute md:top-24 md:mr-8 top-20 z-40 right-0 m-4"},e.createElement(v,{icon:ue,className:"text-custom-white",onClick:()=>{q(),L()}})),U&&e.createElement("div",{className:" scale-50 md:scale-100 absolute md:top-36 md:mr-8 top-24 z-40 right-0  bg-transparent bg-opacity-5 border border-gray-200 p-2 rounded-3xl shadow backdrop:blur-2xl"},e.createElement("div",{onClick:H,className:"cursor-pointer hover:bg-custom-gray-ligh rounded-3xl p-2"},a.public?"Make Private":"Make Public"),e.createElement("div",{onClick:V,className:"cursor-pointer  hover:bg-custom-gray-ligh rounded-3xl p-2"},"Edit"),e.createElement("div",{onClick:G,className:"cursor-pointer  hover:bg-custom-gray-ligh rounded-3xl p-2 text-red-500"},"Delete")),B&&e.createElement("div",{className:" scale-50 md:scale-100 absolute md:top-36 md:mr-8 top-24 z-40 right-0  bg-transparent bg-opacity-5 border border-gray-200 p-2 rounded-3xl shadow backdrop:blur-2xl"},e.createElement("div",{onClick:K,className:"cursor-pointer hover:bg-custom-gray-ligh text-red-500 rounded-3xl p-2"},N&&e.createElement("p",null,"Deleting..."),!N&&e.createElement("p",null,"Confirm")),e.createElement("div",{onClick:L,className:"cursor-pointer  hover:bg-custom-gray-ligh rounded-3xl p-2"},!N&&e.createElement("p",null,"Cancel"))))),e.createElement(ke,{content:f,description:a==null?void 0:a.description,isScrolled:F,post:a})),!a&&e.createElement("div",{className:" text-4xl text-custom-black-dark font-bold flex items-center justify-center"},"Loading..."))},ke=({post:r,content:o,description:a,isScrolled:h})=>{const f=w({opacity:h?1:0,config:le.gentle}),y={h1:({node:s,...t})=>e.createElement("h1",{className:"font-extrabold text-3xl text-custom-black-dark text-center",...t},t.children),h2:({node:s,...t})=>e.createElement("h2",{className:"font-semibold text-2xl",...t},t.children),h3:({node:s,...t})=>e.createElement("h3",{className:"font-medium text-xl",...t},t.children),h4:({node:s,...t})=>e.createElement("h4",{className:"font-normal text-lg",...t},t.children),h5:({node:s,...t})=>e.createElement("h5",{className:"font-light text-base",...t},t.children),h6:({node:s,...t})=>e.createElement("h6",{className:"font-thin text-sm",...t},t.children),p:({node:s,...t})=>e.createElement("p",{className:"text-custom-gray-darkest",...t},t.children),pre:({node:s,...t})=>e.createElement("pre",{className:"bg-gray-200 font-thin text-base text-custom-black-dark p-4 rounded-md"},t.children),ol:({node:s,...t})=>e.createElement("ol",{className:"list-decimal pl-4"},t.children),ul:({node:s,...t})=>e.createElement("ul",{className:"list-disc pl-4"},t.children),li:({node:s,...t})=>e.createElement("li",{className:"mb-2"},t.children)};return e.createElement(E.div,{className:" mt-32 md:mt-48 mx-auto inset-0 h-full w-full flex-col md:space-y-20 space-y-10  items-center justify-center",style:{...f}},e.createElement("blockquote",{className:"max-w-[70%] md:max-w-[60%] ml-5 md:ml-40 italic text-sm md:text-xl font-thin text-gray-500 border-l-2 pl-4 py-2 mb-4"},e.createElement("p",null,a),e.createElement("footer",null,"— ",r==null?void 0:r.username)),e.createElement("div",{className:" text-sm md:text-lg font-extralight md:font-light  max-w-[80%] md:max-w-[70%] ml-10 md:ml-60"},e.createElement(pe,{remarkPlugins:[he],className:"foo",components:y},o)))};export{Se as default};