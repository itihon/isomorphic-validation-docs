"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1225],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>f});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var u=a.createContext({}),p=function(e){var t=a.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},c=function(e){var t=p(e.components);return a.createElement(u.Provider,{value:t},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),l=p(r),m=n,f=l["".concat(u,".").concat(m)]||l[m]||d[m]||o;return r?a.createElement(f,s(s({ref:t},c),{},{components:r})):a.createElement(f,s({ref:t},c))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,s=new Array(o);s[0]=m;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i[l]="string"==typeof e?e:n,s[1]=i;for(var p=2;p<o;p++)s[p]=r[p];return a.createElement.apply(null,s)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8158:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>l,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var a=r(7462),n=(r(7294),r(3905));const o={},s="User Management",i={unversionedId:"features/user-management",id:"features/user-management",title:"User Management",description:"Generally, LiveCodes can be used anonymously without any accounts. This includes creating/saving projects and importing code from GitHub gists or public repos.",source:"@site/docs/features/user-management.md",sourceDirName:"features",slug:"/features/user-management",permalink:"/docs/features/user-management",draft:!1,editUrl:"https://github.com/live-codes/livecodes/tree/develop/docs/docs/features/user-management.md",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Integrations",permalink:"/docs/features/integrations"},next:{title:"Security",permalink:"/docs/features/security"}},u={},p=[{value:"User Data",id:"user-data",level:2},{value:"Login/Logout",id:"loginlogout",level:2}],c={toc:p};function l(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"user-management"},"User Management"),(0,n.kt)("p",null,"Generally, LiveCodes can be used anonymously without any accounts. This includes creating/saving ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/projects"},"projects")," and ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/import"},"importing")," code from GitHub gists or public repos."),(0,n.kt)("p",null,"However, some features do require login with a GitHub account and giving ",(0,n.kt)("a",{parentName:"p",href:"https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes"},"specific permissions")," to make use of GitHub services (e.g. ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/import"},"import")," from private repos, ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/export"},"export")," to gist, ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/deploy"},"deploy"),", ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/assets"},"assets")," and ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/sync"},"sync"),")."),(0,n.kt)("p",null,"Please see the section about ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/github-integration"},"GitHub Integration")," for permissions required and how to change them."),(0,n.kt)("admonition",{title:"cookies",type:"caution"},(0,n.kt)("p",{parentName:"admonition"},"User authentication is handled using ",(0,n.kt)("a",{parentName:"p",href:"https://firebase.google.com/products/auth"},"Firebase Authentication")," which ",(0,n.kt)("strong",{parentName:"p"},"may use cookies"),". By logging in, you agree that cookies may be stored on your device.")),(0,n.kt)("admonition",{title:"note",type:"info"},(0,n.kt)("p",{parentName:"admonition"},"GitHub user permissions for LiveCodes app are set the first time the user logs in. Any subsequent login will use the first permissions, even if they are set differently."),(0,n.kt)("p",{parentName:"admonition"},"Please see the section about ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/github-integration#setting-permissions"},"GitHub Integration")," for how to change/revoke permissions .")),(0,n.kt)("h2",{id:"user-data"},"User Data"),(0,n.kt)("p",null,"User data includes ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/projects"},"saved projects"),", ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/snippets"},"code snippets"),", ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/assets"},"assets")," and ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/user-settings"},"user settings"),". This data is saved in the browser linked to the logged in user account. When a user first logs in, data that was previously saved anonymously is linked to that user account."),(0,n.kt)("p",null,"If the user logs off, the data is cleared from the app, but is kept in the browser storage. This allows another user to use the same device without the data leaking. When the user, logs in again, the previously stored data (under that account) is reloaded to the app."),(0,n.kt)("h2",{id:"loginlogout"},"Login/Logout"),(0,n.kt)("p",null,"Login/Logout links are accessible from the app menu."),(0,n.kt)("admonition",{title:"note",type:"info"},(0,n.kt)("p",{parentName:"admonition"},"All user management features, including ability to login/logout, access to user data, and ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/github-integration"},"GitHub services")," that require account, are not available in ",(0,n.kt)("a",{parentName:"p",href:"/docs/features/embeds"},"embedded playgrounds"),".")))}l.isMDXComponent=!0}}]);