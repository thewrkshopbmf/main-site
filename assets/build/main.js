const gl=()=>{};var vo={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const La=function(n){const t=[];let e=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},_l=function(n){const t=[];let e=0,r=0;for(;e<n.length;){const s=n[e++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[e++];t[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[e++],c=n[e++],l=n[e++],f=((s&7)<<18|(o&63)<<12|(c&63)<<6|l&63)-65536;t[r++]=String.fromCharCode(55296+(f>>10)),t[r++]=String.fromCharCode(56320+(f&1023))}else{const o=n[e++],c=n[e++];t[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|c&63)}}return t.join("")},Fa={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],c=s+1<n.length,l=c?n[s+1]:0,f=s+2<n.length,d=f?n[s+2]:0,v=o>>2,A=(o&3)<<4|l>>4;let b=(l&15)<<2|d>>6,P=d&63;f||(P=64,c||(b=64)),r.push(e[v],e[A],e[b],e[P])}return r.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(La(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):_l(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=e[n.charAt(s++)],l=s<n.length?e[n.charAt(s)]:0;++s;const d=s<n.length?e[n.charAt(s)]:64;++s;const A=s<n.length?e[n.charAt(s)]:64;if(++s,o==null||l==null||d==null||A==null)throw new yl;const b=o<<2|l>>4;if(r.push(b),d!==64){const P=l<<4&240|d>>2;if(r.push(P),A!==64){const V=d<<6&192|A;r.push(V)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class yl extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const El=function(n){const t=La(n);return Fa.encodeByteArray(t,!0)},er=function(n){return El(n).replace(/\./g,"")},Tl=function(n){try{return Fa.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wl(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vl=()=>wl().__FIREBASE_DEFAULTS__,Il=()=>{if(typeof process>"u"||typeof vo>"u")return;const n=vo.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Al=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&Tl(n[1]);return t&&JSON.parse(t)},Ni=()=>{try{return gl()||vl()||Il()||Al()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},bl=n=>Ni()?.emulatorHosts?.[n],Sl=n=>{const t=bl(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),r]:[t.substring(0,e),r]},Ua=()=>Ni()?.config;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rl{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,r)=>{e?this.reject(e):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oi(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Cl(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pl(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},r=t||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const c={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...n};return[er(JSON.stringify(e)),er(JSON.stringify(c)),""].join(".")}const nn={};function Vl(){const n={prod:[],emulator:[]};for(const t of Object.keys(nn))nn[t]?n.emulator.push(t):n.prod.push(t);return n}function Dl(n){let t=document.getElementById(n),e=!1;return t||(t=document.createElement("div"),t.setAttribute("id",n),e=!0),{created:e,element:t}}let Io=!1;function kl(n,t){if(typeof window>"u"||typeof document>"u"||!Oi(window.location.host)||nn[n]===t||nn[n]||Io)return;nn[n]=t;function e(b){return`__firebase__banner__${b}`}const r="__firebase__banner",o=Vl().prod.length>0;function c(){const b=document.getElementById(r);b&&b.remove()}function l(b){b.style.display="flex",b.style.background="#7faaf0",b.style.position="fixed",b.style.bottom="5px",b.style.left="5px",b.style.padding=".5em",b.style.borderRadius="5px",b.style.alignItems="center"}function f(b,P){b.setAttribute("width","24"),b.setAttribute("id",P),b.setAttribute("height","24"),b.setAttribute("viewBox","0 0 24 24"),b.setAttribute("fill","none"),b.style.marginLeft="-6px"}function d(){const b=document.createElement("span");return b.style.cursor="pointer",b.style.marginLeft="16px",b.style.fontSize="24px",b.innerHTML=" &times;",b.onclick=()=>{Io=!0,c()},b}function v(b,P){b.setAttribute("id",P),b.innerText="Learn more",b.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",b.setAttribute("target","__blank"),b.style.paddingLeft="5px",b.style.textDecoration="underline"}function A(){const b=Dl(r),P=e("text"),V=document.getElementById(P)||document.createElement("span"),O=e("learnmore"),N=document.getElementById(O)||document.createElement("a"),H=e("preprendIcon"),j=document.getElementById(H)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(b.created){const $=b.element;l($),v(N,O);const gt=d();f(j,H),$.append(j,V,N,gt),document.body.appendChild($)}o?(V.innerText="Preview backend disconnected.",j.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(j.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,V.innerText="Preview backend running in this workspace."),V.setAttribute("id",P)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",A):A()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nl(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ol(){const n=Ni()?.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Ml(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function xl(){return!Ol()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Mi(){try{return typeof indexedDB=="object"}catch{return!1}}function xi(){return new Promise((n,t)=>{try{let e=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{t(s.error?.message||"")}}catch(e){t(e)}})}function Ba(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ll="FirebaseError";class ne extends Error{constructor(t,e,r){super(e),this.code=t,this.customData=r,this.name=Ll,Object.setPrototypeOf(this,ne.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,yn.prototype.create)}}class yn{constructor(t,e,r){this.service=t,this.serviceName=e,this.errors=r}create(t,...e){const r=e[0]||{},s=`${this.service}/${t}`,o=this.errors[t],c=o?Fl(o,r):"Error",l=`${this.serviceName}: ${c} (${s}).`;return new ne(s,l,r)}}function Fl(n,t){return n.replace(Ul,(e,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const Ul=/\{\$([^}]+)}/g;function ln(n,t){if(n===t)return!0;const e=Object.keys(n),r=Object.keys(t);for(const s of e){if(!r.includes(s))return!1;const o=n[s],c=t[s];if(Ao(o)&&Ao(c)){if(!ln(o,c))return!1}else if(o!==c)return!1}for(const s of r)if(!e.includes(s))return!1;return!0}function Ao(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bl=1e3,jl=2,$l=14400*1e3,ql=.5;function bo(n,t=Bl,e=jl){const r=t*Math.pow(e,n),s=Math.round(ql*r*(Math.random()-.5)*2);return Math.min($l,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zt(n){return n&&n._delegate?n._delegate:n}class Dt{constructor(t,e,r){this.name=t,this.instanceFactory=e,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ae="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zl{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const r=new Rl;if(this.instancesDeferred.set(e,r),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){const e=this.normalizeInstanceIdentifier(t?.identifier),r=t?.optional??!1;if(this.isInitialized(e)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:e})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Kl(t))try{this.getOrInitializeService({instanceIdentifier:ae})}catch{}for(const[e,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(t=ae){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=ae){return this.instances.has(t)}getOptions(t=ae){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:e});for(const[o,c]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(o);r===l&&c.resolve(s)}return s}onInit(t,e){const r=this.normalizeInstanceIdentifier(e),s=this.onInitCallbacks.get(r)??new Set;s.add(t),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&t(o,r),()=>{s.delete(t)}}invokeOnInitCallbacks(t,e){const r=this.onInitCallbacks.get(e);if(r)for(const s of r)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Hl(t),options:e}),this.instances.set(t,r),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=ae){return this.component?this.component.multipleInstances?t:ae:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Hl(n){return n===ae?void 0:n}function Kl(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gl{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new zl(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var F;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(F||(F={}));const Wl={debug:F.DEBUG,verbose:F.VERBOSE,info:F.INFO,warn:F.WARN,error:F.ERROR,silent:F.SILENT},Ql=F.INFO,Xl={[F.DEBUG]:"log",[F.VERBOSE]:"log",[F.INFO]:"info",[F.WARN]:"warn",[F.ERROR]:"error"},Yl=(n,t,...e)=>{if(t<n.logLevel)return;const r=new Date().toISOString(),s=Xl[t];if(s)console[s](`[${r}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Li{constructor(t){this.name=t,this._logLevel=Ql,this._logHandler=Yl,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in F))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Wl[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,F.DEBUG,...t),this._logHandler(this,F.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,F.VERBOSE,...t),this._logHandler(this,F.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,F.INFO,...t),this._logHandler(this,F.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,F.WARN,...t),this._logHandler(this,F.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,F.ERROR,...t),this._logHandler(this,F.ERROR,...t)}}const Jl=(n,t)=>t.some(e=>n instanceof e);let So,Ro;function Zl(){return So||(So=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function th(){return Ro||(Ro=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ja=new WeakMap,di=new WeakMap,$a=new WeakMap,Jr=new WeakMap,Fi=new WeakMap;function eh(n){const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",c)},o=()=>{e(Bt(n.result)),s()},c=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",c)});return t.then(e=>{e instanceof IDBCursor&&ja.set(e,n)}).catch(()=>{}),Fi.set(t,n),t}function nh(n){if(di.has(n))return;const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",c),n.removeEventListener("abort",c)},o=()=>{e(),s()},c=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",c),n.addEventListener("abort",c)});di.set(n,t)}let pi={get(n,t,e){if(n instanceof IDBTransaction){if(t==="done")return di.get(n);if(t==="objectStoreNames")return n.objectStoreNames||$a.get(n);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return Bt(n[t])},set(n,t,e){return n[t]=e,!0},has(n,t){return n instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in n}};function rh(n){pi=n(pi)}function ih(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const r=n.call(Zr(this),t,...e);return $a.set(r,t.sort?t.sort():[t]),Bt(r)}:th().includes(n)?function(...t){return n.apply(Zr(this),t),Bt(ja.get(this))}:function(...t){return Bt(n.apply(Zr(this),t))}}function sh(n){return typeof n=="function"?ih(n):(n instanceof IDBTransaction&&nh(n),Jl(n,Zl())?new Proxy(n,pi):n)}function Bt(n){if(n instanceof IDBRequest)return eh(n);if(Jr.has(n))return Jr.get(n);const t=sh(n);return t!==n&&(Jr.set(n,t),Fi.set(t,n)),t}const Zr=n=>Fi.get(n);function _r(n,t,{blocked:e,upgrade:r,blocking:s,terminated:o}={}){const c=indexedDB.open(n,t),l=Bt(c);return r&&c.addEventListener("upgradeneeded",f=>{r(Bt(c.result),f.oldVersion,f.newVersion,Bt(c.transaction),f)}),e&&c.addEventListener("blocked",f=>e(f.oldVersion,f.newVersion,f)),l.then(f=>{o&&f.addEventListener("close",()=>o()),s&&f.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}function ti(n,{blocked:t}={}){const e=indexedDB.deleteDatabase(n);return t&&e.addEventListener("blocked",r=>t(r.oldVersion,r)),Bt(e).then(()=>{})}const oh=["get","getKey","getAll","getAllKeys","count"],ah=["put","add","delete","clear"],ei=new Map;function Co(n,t){if(!(n instanceof IDBDatabase&&!(t in n)&&typeof t=="string"))return;if(ei.get(t))return ei.get(t);const e=t.replace(/FromIndex$/,""),r=t!==e,s=ah.includes(e);if(!(e in(r?IDBIndex:IDBObjectStore).prototype)||!(s||oh.includes(e)))return;const o=async function(c,...l){const f=this.transaction(c,s?"readwrite":"readonly");let d=f.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[e](...l),s&&f.done]))[0]};return ei.set(t,o),o}rh(n=>({...n,get:(t,e,r)=>Co(t,e)||n.get(t,e,r),has:(t,e)=>!!Co(t,e)||n.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ch{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(uh(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function uh(n){return n.getComponent()?.type==="VERSION"}const mi="@firebase/app",Po="0.14.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ht=new Li("@firebase/app"),lh="@firebase/app-compat",hh="@firebase/analytics-compat",fh="@firebase/analytics",dh="@firebase/app-check-compat",ph="@firebase/app-check",mh="@firebase/auth",gh="@firebase/auth-compat",_h="@firebase/database",yh="@firebase/data-connect",Eh="@firebase/database-compat",Th="@firebase/functions",wh="@firebase/functions-compat",vh="@firebase/installations",Ih="@firebase/installations-compat",Ah="@firebase/messaging",bh="@firebase/messaging-compat",Sh="@firebase/performance",Rh="@firebase/performance-compat",Ch="@firebase/remote-config",Ph="@firebase/remote-config-compat",Vh="@firebase/storage",Dh="@firebase/storage-compat",kh="@firebase/firestore",Nh="@firebase/ai",Oh="@firebase/firestore-compat",Mh="firebase",xh="12.2.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gi="[DEFAULT]",Lh={[mi]:"fire-core",[lh]:"fire-core-compat",[fh]:"fire-analytics",[hh]:"fire-analytics-compat",[ph]:"fire-app-check",[dh]:"fire-app-check-compat",[mh]:"fire-auth",[gh]:"fire-auth-compat",[_h]:"fire-rtdb",[yh]:"fire-data-connect",[Eh]:"fire-rtdb-compat",[Th]:"fire-fn",[wh]:"fire-fn-compat",[vh]:"fire-iid",[Ih]:"fire-iid-compat",[Ah]:"fire-fcm",[bh]:"fire-fcm-compat",[Sh]:"fire-perf",[Rh]:"fire-perf-compat",[Ch]:"fire-rc",[Ph]:"fire-rc-compat",[Vh]:"fire-gcs",[Dh]:"fire-gcs-compat",[kh]:"fire-fst",[Oh]:"fire-fst-compat",[Nh]:"fire-vertex","fire-js":"fire-js",[Mh]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nr=new Map,Fh=new Map,_i=new Map;function Vo(n,t){try{n.container.addComponent(t)}catch(e){Ht.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function Nt(n){const t=n.name;if(_i.has(t))return Ht.debug(`There were multiple attempts to register component ${t}.`),!1;_i.set(t,n);for(const e of nr.values())Vo(e,n);for(const e of Fh.values())Vo(e,n);return!0}function Oe(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function Uh(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bh={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Yt=new yn("app","Firebase",Bh);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jh{constructor(t,e,r){this._isDeleted=!1,this._options={...t},this._config={...e},this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Dt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw Yt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $h=xh;function qa(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const r={name:gi,automaticDataCollectionEnabled:!0,...t},s=r.name;if(typeof s!="string"||!s)throw Yt.create("bad-app-name",{appName:String(s)});if(e||(e=Ua()),!e)throw Yt.create("no-options");const o=nr.get(s);if(o){if(ln(e,o.options)&&ln(r,o.config))return o;throw Yt.create("duplicate-app",{appName:s})}const c=new Gl(s);for(const f of _i.values())c.addComponent(f);const l=new jh(e,r,c);return nr.set(s,l),l}function Ui(n=gi){const t=nr.get(n);if(!t&&n===gi&&Ua())return qa();if(!t)throw Yt.create("no-app",{appName:n});return t}function bt(n,t,e){let r=Lh[n]??n;e&&(r+=`-${e}`);const s=r.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const c=[`Unable to register library "${r}" with version "${t}":`];s&&c.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&c.push("and"),o&&c.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Ht.warn(c.join(" "));return}Nt(new Dt(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qh="firebase-heartbeat-database",zh=1,hn="firebase-heartbeat-store";let ni=null;function za(){return ni||(ni=_r(qh,zh,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(hn)}catch(e){console.warn(e)}}}}).catch(n=>{throw Yt.create("idb-open",{originalErrorMessage:n.message})})),ni}async function Hh(n){try{const e=(await za()).transaction(hn),r=await e.objectStore(hn).get(Ha(n));return await e.done,r}catch(t){if(t instanceof ne)Ht.warn(t.message);else{const e=Yt.create("idb-get",{originalErrorMessage:t?.message});Ht.warn(e.message)}}}async function Do(n,t){try{const r=(await za()).transaction(hn,"readwrite");await r.objectStore(hn).put(t,Ha(n)),await r.done}catch(e){if(e instanceof ne)Ht.warn(e.message);else{const r=Yt.create("idb-set",{originalErrorMessage:e?.message});Ht.warn(r.message)}}}function Ha(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kh=1024,Gh=30;class Wh{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new Xh(e),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{const e=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=ko();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(s=>s.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:e}),this._heartbeatsCache.heartbeats.length>Gh){const s=Yh(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(t){Ht.warn(t)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ko(),{heartbeatsToSend:e,unsentEntries:r}=Qh(this._heartbeatsCache.heartbeats),s=er(JSON.stringify({version:2,heartbeats:e}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return Ht.warn(t),""}}}function ko(){return new Date().toISOString().substring(0,10)}function Qh(n,t=Kh){const e=[];let r=n.slice();for(const s of n){const o=e.find(c=>c.agent===s.agent);if(o){if(o.dates.push(s.date),No(e)>t){o.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),No(e)>t){e.pop();break}r=r.slice(1)}return{heartbeatsToSend:e,unsentEntries:r}}class Xh{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Mi()?xi().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await Hh(this.app);return e?.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return Do(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return Do(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}}function No(n){return er(JSON.stringify({version:2,heartbeats:n})).length}function Yh(n){if(n.length===0)return-1;let t=0,e=n[0].date;for(let r=1;r<n.length;r++)n[r].date<e&&(e=n[r].date,t=r);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jh(n){Nt(new Dt("platform-logger",t=>new ch(t),"PRIVATE")),Nt(new Dt("heartbeat",t=>new Wh(t),"PRIVATE")),bt(mi,Po,n),bt(mi,Po,"esm2020"),bt("fire-js","")}Jh("");var Zh="firebase",tf="12.2.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */bt(Zh,tf,"app");const Ka="@firebase/installations",Bi="0.6.19";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ga=1e4,Wa=`w:${Bi}`,Qa="FIS_v2",ef="https://firebaseinstallations.googleapis.com/v1",nf=3600*1e3,rf="installations",sf="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const of={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},fe=new yn(rf,sf,of);function Xa(n){return n instanceof ne&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ya({projectId:n}){return`${ef}/projects/${n}/installations`}function Ja(n){return{token:n.token,requestStatus:2,expiresIn:cf(n.expiresIn),creationTime:Date.now()}}async function Za(n,t){const r=(await t.json()).error;return fe.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function tc({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function af(n,{refreshToken:t}){const e=tc(n);return e.append("Authorization",uf(t)),e}async function ec(n){const t=await n();return t.status>=500&&t.status<600?n():t}function cf(n){return Number(n.replace("s","000"))}function uf(n){return`${Qa} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lf({appConfig:n,heartbeatServiceProvider:t},{fid:e}){const r=Ya(n),s=tc(n),o=t.getImmediate({optional:!0});if(o){const d=await o.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const c={fid:e,authVersion:Qa,appId:n.appId,sdkVersion:Wa},l={method:"POST",headers:s,body:JSON.stringify(c)},f=await ec(()=>fetch(r,l));if(f.ok){const d=await f.json();return{fid:d.fid||e,registrationStatus:2,refreshToken:d.refreshToken,authToken:Ja(d.authToken)}}else throw await Za("Create Installation",f)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nc(n){return new Promise(t=>{setTimeout(t,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hf(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ff=/^[cdef][\w-]{21}$/,yi="";function df(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const e=pf(n);return ff.test(e)?e:yi}catch{return yi}}function pf(n){return hf(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yr(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rc=new Map;function ic(n,t){const e=yr(n);sc(e,t),mf(e,t)}function sc(n,t){const e=rc.get(n);if(e)for(const r of e)r(t)}function mf(n,t){const e=gf();e&&e.postMessage({key:n,fid:t}),_f()}let ce=null;function gf(){return!ce&&"BroadcastChannel"in self&&(ce=new BroadcastChannel("[Firebase] FID Change"),ce.onmessage=n=>{sc(n.data.key,n.data.fid)}),ce}function _f(){rc.size===0&&ce&&(ce.close(),ce=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yf="firebase-installations-database",Ef=1,de="firebase-installations-store";let ri=null;function ji(){return ri||(ri=_r(yf,Ef,{upgrade:(n,t)=>{switch(t){case 0:n.createObjectStore(de)}}})),ri}async function rr(n,t){const e=yr(n),s=(await ji()).transaction(de,"readwrite"),o=s.objectStore(de),c=await o.get(e);return await o.put(t,e),await s.done,(!c||c.fid!==t.fid)&&ic(n,t.fid),t}async function oc(n){const t=yr(n),r=(await ji()).transaction(de,"readwrite");await r.objectStore(de).delete(t),await r.done}async function Er(n,t){const e=yr(n),s=(await ji()).transaction(de,"readwrite"),o=s.objectStore(de),c=await o.get(e),l=t(c);return l===void 0?await o.delete(e):await o.put(l,e),await s.done,l&&(!c||c.fid!==l.fid)&&ic(n,l.fid),l}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $i(n){let t;const e=await Er(n.appConfig,r=>{const s=Tf(r),o=wf(n,s);return t=o.registrationPromise,o.installationEntry});return e.fid===yi?{installationEntry:await t}:{installationEntry:e,registrationPromise:t}}function Tf(n){const t=n||{fid:df(),registrationStatus:0};return ac(t)}function wf(n,t){if(t.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(fe.create("app-offline"));return{installationEntry:t,registrationPromise:s}}const e={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=vf(n,e);return{installationEntry:e,registrationPromise:r}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:If(n)}:{installationEntry:t}}async function vf(n,t){try{const e=await lf(n,t);return rr(n.appConfig,e)}catch(e){throw Xa(e)&&e.customData.serverCode===409?await oc(n.appConfig):await rr(n.appConfig,{fid:t.fid,registrationStatus:0}),e}}async function If(n){let t=await Oo(n.appConfig);for(;t.registrationStatus===1;)await nc(100),t=await Oo(n.appConfig);if(t.registrationStatus===0){const{installationEntry:e,registrationPromise:r}=await $i(n);return r||e}return t}function Oo(n){return Er(n,t=>{if(!t)throw fe.create("installation-not-found");return ac(t)})}function ac(n){return Af(n)?{fid:n.fid,registrationStatus:0}:n}function Af(n){return n.registrationStatus===1&&n.registrationTime+Ga<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bf({appConfig:n,heartbeatServiceProvider:t},e){const r=Sf(n,e),s=af(n,e),o=t.getImmediate({optional:!0});if(o){const d=await o.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const c={installation:{sdkVersion:Wa,appId:n.appId}},l={method:"POST",headers:s,body:JSON.stringify(c)},f=await ec(()=>fetch(r,l));if(f.ok){const d=await f.json();return Ja(d)}else throw await Za("Generate Auth Token",f)}function Sf(n,{fid:t}){return`${Ya(n)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qi(n,t=!1){let e;const r=await Er(n.appConfig,o=>{if(!cc(o))throw fe.create("not-registered");const c=o.authToken;if(!t&&Pf(c))return o;if(c.requestStatus===1)return e=Rf(n,t),o;{if(!navigator.onLine)throw fe.create("app-offline");const l=Df(o);return e=Cf(n,l),l}});return e?await e:r.authToken}async function Rf(n,t){let e=await Mo(n.appConfig);for(;e.authToken.requestStatus===1;)await nc(100),e=await Mo(n.appConfig);const r=e.authToken;return r.requestStatus===0?qi(n,t):r}function Mo(n){return Er(n,t=>{if(!cc(t))throw fe.create("not-registered");const e=t.authToken;return kf(e)?{...t,authToken:{requestStatus:0}}:t})}async function Cf(n,t){try{const e=await bf(n,t),r={...t,authToken:e};return await rr(n.appConfig,r),e}catch(e){if(Xa(e)&&(e.customData.serverCode===401||e.customData.serverCode===404))await oc(n.appConfig);else{const r={...t,authToken:{requestStatus:0}};await rr(n.appConfig,r)}throw e}}function cc(n){return n!==void 0&&n.registrationStatus===2}function Pf(n){return n.requestStatus===2&&!Vf(n)}function Vf(n){const t=Date.now();return t<n.creationTime||n.creationTime+n.expiresIn<t+nf}function Df(n){const t={requestStatus:1,requestTime:Date.now()};return{...n,authToken:t}}function kf(n){return n.requestStatus===1&&n.requestTime+Ga<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nf(n){const t=n,{installationEntry:e,registrationPromise:r}=await $i(t);return r?r.catch(console.error):qi(t).catch(console.error),e.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Of(n,t=!1){const e=n;return await Mf(e),(await qi(e,t)).token}async function Mf(n){const{registrationPromise:t}=await $i(n);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xf(n){if(!n||!n.options)throw ii("App Configuration");if(!n.name)throw ii("App Name");const t=["projectId","apiKey","appId"];for(const e of t)if(!n.options[e])throw ii(e);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function ii(n){return fe.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uc="installations",Lf="installations-internal",Ff=n=>{const t=n.getProvider("app").getImmediate(),e=xf(t),r=Oe(t,"heartbeat");return{app:t,appConfig:e,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Uf=n=>{const t=n.getProvider("app").getImmediate(),e=Oe(t,uc).getImmediate();return{getId:()=>Nf(e),getToken:s=>Of(e,s)}};function Bf(){Nt(new Dt(uc,Ff,"PUBLIC")),Nt(new Dt(Lf,Uf,"PRIVATE"))}Bf();bt(Ka,Bi);bt(Ka,Bi,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ir="analytics",jf="firebase_id",$f="origin",qf=60*1e3,zf="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",zi="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt=new Li("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hf={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},At=new yn("analytics","Analytics",Hf);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kf(n){if(!n.startsWith(zi)){const t=At.create("invalid-gtag-resource",{gtagURL:n});return Tt.warn(t.message),""}return n}function lc(n){return Promise.all(n.map(t=>t.catch(e=>e)))}function Gf(n,t){let e;return window.trustedTypes&&(e=window.trustedTypes.createPolicy(n,t)),e}function Wf(n,t){const e=Gf("firebase-js-sdk-policy",{createScriptURL:Kf}),r=document.createElement("script"),s=`${zi}?l=${n}&id=${t}`;r.src=e?e?.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function Qf(n){let t=[];return Array.isArray(window[n])?t=window[n]:window[n]=t,t}async function Xf(n,t,e,r,s,o){const c=r[s];try{if(c)await t[c];else{const f=(await lc(e)).find(d=>d.measurementId===s);f&&await t[f.appId]}}catch(l){Tt.error(l)}n("config",s,o)}async function Yf(n,t,e,r,s){try{let o=[];if(s&&s.send_to){let c=s.send_to;Array.isArray(c)||(c=[c]);const l=await lc(e);for(const f of c){const d=l.find(A=>A.measurementId===f),v=d&&t[d.appId];if(v)o.push(v);else{o=[];break}}}o.length===0&&(o=Object.values(t)),await Promise.all(o),n("event",r,s||{})}catch(o){Tt.error(o)}}function Jf(n,t,e,r){async function s(o,...c){try{if(o==="event"){const[l,f]=c;await Yf(n,t,e,l,f)}else if(o==="config"){const[l,f]=c;await Xf(n,t,e,r,l,f)}else if(o==="consent"){const[l,f]=c;n("consent",l,f)}else if(o==="get"){const[l,f,d]=c;n("get",l,f,d)}else if(o==="set"){const[l]=c;n("set",l)}else n(o,...c)}catch(l){Tt.error(l)}}return s}function Zf(n,t,e,r,s){let o=function(...c){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(o=window[s]),window[s]=Jf(o,n,t,e),{gtagCore:o,wrappedGtag:window[s]}}function td(n){const t=window.document.getElementsByTagName("script");for(const e of Object.values(t))if(e.src&&e.src.includes(zi)&&e.src.includes(n))return e;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ed=30,nd=1e3;class rd{constructor(t={},e=nd){this.throttleMetadata=t,this.intervalMillis=e}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,e){this.throttleMetadata[t]=e}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const hc=new rd;function id(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function sd(n){const{appId:t,apiKey:e}=n,r={method:"GET",headers:id(e)},s=zf.replace("{app-id}",t),o=await fetch(s,r);if(o.status!==200&&o.status!==304){let c="";try{const l=await o.json();l.error?.message&&(c=l.error.message)}catch{}throw At.create("config-fetch-failed",{httpStatus:o.status,responseMessage:c})}return o.json()}async function od(n,t=hc,e){const{appId:r,apiKey:s,measurementId:o}=n.options;if(!r)throw At.create("no-app-id");if(!s){if(o)return{measurementId:o,appId:r};throw At.create("no-api-key")}const c=t.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},l=new ud;return setTimeout(async()=>{l.abort()},qf),fc({appId:r,apiKey:s,measurementId:o},c,l,t)}async function fc(n,{throttleEndTimeMillis:t,backoffCount:e},r,s=hc){const{appId:o,measurementId:c}=n;try{await ad(r,t)}catch(l){if(c)return Tt.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${l?.message}]`),{appId:o,measurementId:c};throw l}try{const l=await sd(n);return s.deleteThrottleMetadata(o),l}catch(l){const f=l;if(!cd(f)){if(s.deleteThrottleMetadata(o),c)return Tt.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${f?.message}]`),{appId:o,measurementId:c};throw l}const d=Number(f?.customData?.httpStatus)===503?bo(e,s.intervalMillis,ed):bo(e,s.intervalMillis),v={throttleEndTimeMillis:Date.now()+d,backoffCount:e+1};return s.setThrottleMetadata(o,v),Tt.debug(`Calling attemptFetch again in ${d} millis`),fc(n,v,r,s)}}function ad(n,t){return new Promise((e,r)=>{const s=Math.max(t-Date.now(),0),o=setTimeout(e,s);n.addEventListener(()=>{clearTimeout(o),r(At.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function cd(n){if(!(n instanceof ne)||!n.customData)return!1;const t=Number(n.customData.httpStatus);return t===429||t===500||t===503||t===504}class ud{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function ld(n,t,e,r,s){if(s&&s.global){n("event",e,r);return}else{const o=await t,c={...r,send_to:o};n("event",e,c)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hd(){if(Mi())try{await xi()}catch(n){return Tt.warn(At.create("indexeddb-unavailable",{errorInfo:n?.toString()}).message),!1}else return Tt.warn(At.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function fd(n,t,e,r,s,o,c){const l=od(n);l.then(b=>{e[b.measurementId]=b.appId,n.options.measurementId&&b.measurementId!==n.options.measurementId&&Tt.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${b.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(b=>Tt.error(b)),t.push(l);const f=hd().then(b=>{if(b)return r.getId()}),[d,v]=await Promise.all([l,f]);td(o)||Wf(o,d.measurementId),s("js",new Date);const A=c?.config??{};return A[$f]="firebase",A.update=!0,v!=null&&(A[jf]=v),s("config",d.measurementId,A),d.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dd{constructor(t){this.app=t}_delete(){return delete rn[this.app.options.appId],Promise.resolve()}}let rn={},xo=[];const Lo={};let si="dataLayer",pd="gtag",Fo,dc,Uo=!1;function md(){const n=[];if(Ml()&&n.push("This is a browser extension environment."),Ba()||n.push("Cookies are not available."),n.length>0){const t=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),e=At.create("invalid-analytics-context",{errorInfo:t});Tt.warn(e.message)}}function gd(n,t,e){md();const r=n.options.appId;if(!r)throw At.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Tt.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw At.create("no-api-key");if(rn[r]!=null)throw At.create("already-exists",{id:r});if(!Uo){Qf(si);const{wrappedGtag:o,gtagCore:c}=Zf(rn,xo,Lo,si,pd);dc=o,Fo=c,Uo=!0}return rn[r]=fd(n,xo,Lo,t,Fo,si,e),new dd(n)}function _d(n=Ui()){n=zt(n);const t=Oe(n,ir);return t.isInitialized()?t.getImmediate():yd(n)}function yd(n,t={}){const e=Oe(n,ir);if(e.isInitialized()){const s=e.getImmediate();if(ln(t,e.getOptions()))return s;throw At.create("already-initialized")}return e.initialize({options:t})}function pc(n,t,e,r){n=zt(n),ld(dc,rn[n.app.options.appId],t,e,r).catch(s=>Tt.error(s))}const Bo="@firebase/analytics",jo="0.10.18";function Ed(){Nt(new Dt(ir,(t,{options:e})=>{const r=t.getProvider("app").getImmediate(),s=t.getProvider("installations-internal").getImmediate();return gd(r,s,e)},"PUBLIC")),Nt(new Dt("analytics-internal",n,"PRIVATE")),bt(Bo,jo),bt(Bo,jo,"esm2020");function n(t){try{const e=t.getProvider(ir).getImmediate();return{logEvent:(r,s,o)=>pc(e,r,s,o)}}catch(e){throw At.create("interop-component-reg-failed",{reason:e})}}}Ed();/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Td="/firebase-messaging-sw.js",wd="/firebase-cloud-messaging-push-scope",mc="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",vd="https://fcmregistrations.googleapis.com/v1",gc="google.c.a.c_id",Id="google.c.a.c_l",Ad="google.c.a.ts",bd="google.c.a.e",$o=1e4;var qo;(function(n){n[n.DATA_MESSAGE=1]="DATA_MESSAGE",n[n.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(qo||(qo={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var fn;(function(n){n.PUSH_RECEIVED="push-received",n.NOTIFICATION_CLICKED="notification-clicked"})(fn||(fn={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ut(n){const t=new Uint8Array(n);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function Sd(n){const t="=".repeat((4-n.length%4)%4),e=(n+t).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(e),s=new Uint8Array(r.length);for(let o=0;o<r.length;++o)s[o]=r.charCodeAt(o);return s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oi="fcm_token_details_db",Rd=5,zo="fcm_token_object_Store";async function Cd(n){if("databases"in indexedDB&&!(await indexedDB.databases()).map(o=>o.name).includes(oi))return null;let t=null;return(await _r(oi,Rd,{upgrade:async(r,s,o,c)=>{if(s<2||!r.objectStoreNames.contains(zo))return;const l=c.objectStore(zo),f=await l.index("fcmSenderId").get(n);if(await l.clear(),!!f){if(s===2){const d=f;if(!d.auth||!d.p256dh||!d.endpoint)return;t={token:d.fcmToken,createTime:d.createTime??Date.now(),subscriptionOptions:{auth:d.auth,p256dh:d.p256dh,endpoint:d.endpoint,swScope:d.swScope,vapidKey:typeof d.vapidKey=="string"?d.vapidKey:Ut(d.vapidKey)}}}else if(s===3){const d=f;t={token:d.fcmToken,createTime:d.createTime,subscriptionOptions:{auth:Ut(d.auth),p256dh:Ut(d.p256dh),endpoint:d.endpoint,swScope:d.swScope,vapidKey:Ut(d.vapidKey)}}}else if(s===4){const d=f;t={token:d.fcmToken,createTime:d.createTime,subscriptionOptions:{auth:Ut(d.auth),p256dh:Ut(d.p256dh),endpoint:d.endpoint,swScope:d.swScope,vapidKey:Ut(d.vapidKey)}}}}}})).close(),await ti(oi),await ti("fcm_vapid_details_db"),await ti("undefined"),Pd(t)?t:null}function Pd(n){if(!n||!n.subscriptionOptions)return!1;const{subscriptionOptions:t}=n;return typeof n.createTime=="number"&&n.createTime>0&&typeof n.token=="string"&&n.token.length>0&&typeof t.auth=="string"&&t.auth.length>0&&typeof t.p256dh=="string"&&t.p256dh.length>0&&typeof t.endpoint=="string"&&t.endpoint.length>0&&typeof t.swScope=="string"&&t.swScope.length>0&&typeof t.vapidKey=="string"&&t.vapidKey.length>0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vd="firebase-messaging-database",Dd=1,pe="firebase-messaging-store";let ai=null;function Hi(){return ai||(ai=_r(Vd,Dd,{upgrade:(n,t)=>{switch(t){case 0:n.createObjectStore(pe)}}})),ai}async function _c(n){const t=Gi(n),r=await(await Hi()).transaction(pe).objectStore(pe).get(t);if(r)return r;{const s=await Cd(n.appConfig.senderId);if(s)return await Ki(n,s),s}}async function Ki(n,t){const e=Gi(n),s=(await Hi()).transaction(pe,"readwrite");return await s.objectStore(pe).put(t,e),await s.done,t}async function kd(n){const t=Gi(n),r=(await Hi()).transaction(pe,"readwrite");await r.objectStore(pe).delete(t),await r.done}function Gi({appConfig:n}){return n.appId}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nd={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},mt=new yn("messaging","Messaging",Nd);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Od(n,t){const e=await Qi(n),r=Ec(t),s={method:"POST",headers:e,body:JSON.stringify(r)};let o;try{o=await(await fetch(Wi(n.appConfig),s)).json()}catch(c){throw mt.create("token-subscribe-failed",{errorInfo:c?.toString()})}if(o.error){const c=o.error.message;throw mt.create("token-subscribe-failed",{errorInfo:c})}if(!o.token)throw mt.create("token-subscribe-no-token");return o.token}async function Md(n,t){const e=await Qi(n),r=Ec(t.subscriptionOptions),s={method:"PATCH",headers:e,body:JSON.stringify(r)};let o;try{o=await(await fetch(`${Wi(n.appConfig)}/${t.token}`,s)).json()}catch(c){throw mt.create("token-update-failed",{errorInfo:c?.toString()})}if(o.error){const c=o.error.message;throw mt.create("token-update-failed",{errorInfo:c})}if(!o.token)throw mt.create("token-update-no-token");return o.token}async function yc(n,t){const r={method:"DELETE",headers:await Qi(n)};try{const o=await(await fetch(`${Wi(n.appConfig)}/${t}`,r)).json();if(o.error){const c=o.error.message;throw mt.create("token-unsubscribe-failed",{errorInfo:c})}}catch(s){throw mt.create("token-unsubscribe-failed",{errorInfo:s?.toString()})}}function Wi({projectId:n}){return`${vd}/projects/${n}/registrations`}async function Qi({appConfig:n,installations:t}){const e=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n.apiKey,"x-goog-firebase-installations-auth":`FIS ${e}`})}function Ec({p256dh:n,auth:t,endpoint:e,vapidKey:r}){const s={web:{endpoint:e,auth:t,p256dh:n}};return r!==mc&&(s.web.applicationPubKey=r),s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xd=10080*60*1e3;async function Ld(n){const t=await Bd(n.swRegistration,n.vapidKey),e={vapidKey:n.vapidKey,swScope:n.swRegistration.scope,endpoint:t.endpoint,auth:Ut(t.getKey("auth")),p256dh:Ut(t.getKey("p256dh"))},r=await _c(n.firebaseDependencies);if(r){if(jd(r.subscriptionOptions,e))return Date.now()>=r.createTime+xd?Ud(n,{token:r.token,createTime:Date.now(),subscriptionOptions:e}):r.token;try{await yc(n.firebaseDependencies,r.token)}catch(s){console.warn(s)}return Ho(n.firebaseDependencies,e)}else return Ho(n.firebaseDependencies,e)}async function Fd(n){const t=await _c(n.firebaseDependencies);t&&(await yc(n.firebaseDependencies,t.token),await kd(n.firebaseDependencies));const e=await n.swRegistration.pushManager.getSubscription();return e?e.unsubscribe():!0}async function Ud(n,t){try{const e=await Md(n.firebaseDependencies,t),r={...t,token:e,createTime:Date.now()};return await Ki(n.firebaseDependencies,r),e}catch(e){throw e}}async function Ho(n,t){const r={token:await Od(n,t),createTime:Date.now(),subscriptionOptions:t};return await Ki(n,r),r.token}async function Bd(n,t){const e=await n.pushManager.getSubscription();return e||n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Sd(t)})}function jd(n,t){const e=t.vapidKey===n.vapidKey,r=t.endpoint===n.endpoint,s=t.auth===n.auth,o=t.p256dh===n.p256dh;return e&&r&&s&&o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ko(n){const t={from:n.from,collapseKey:n.collapse_key,messageId:n.fcmMessageId};return $d(t,n),qd(t,n),zd(t,n),t}function $d(n,t){if(!t.notification)return;n.notification={};const e=t.notification.title;e&&(n.notification.title=e);const r=t.notification.body;r&&(n.notification.body=r);const s=t.notification.image;s&&(n.notification.image=s);const o=t.notification.icon;o&&(n.notification.icon=o)}function qd(n,t){t.data&&(n.data=t.data)}function zd(n,t){if(!t.fcmOptions&&!t.notification?.click_action)return;n.fcmOptions={};const e=t.fcmOptions?.link??t.notification?.click_action;e&&(n.fcmOptions.link=e);const r=t.fcmOptions?.analytics_label;r&&(n.fcmOptions.analyticsLabel=r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hd(n){return typeof n=="object"&&!!n&&gc in n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kd(n){if(!n||!n.options)throw ci("App Configuration Object");if(!n.name)throw ci("App Name");const t=["projectId","apiKey","appId","messagingSenderId"],{options:e}=n;for(const r of t)if(!e[r])throw ci(r);return{appName:n.name,projectId:e.projectId,apiKey:e.apiKey,appId:e.appId,senderId:e.messagingSenderId}}function ci(n){return mt.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd{constructor(t,e,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const s=Kd(t);this.firebaseDependencies={app:t,appConfig:s,installations:e,analyticsProvider:r}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tc(n){try{n.swRegistration=await navigator.serviceWorker.register(Td,{scope:wd}),n.swRegistration.update().catch(()=>{}),await Wd(n.swRegistration)}catch(t){throw mt.create("failed-service-worker-registration",{browserErrorMessage:t?.message})}}async function Wd(n){return new Promise((t,e)=>{const r=setTimeout(()=>e(new Error(`Service worker not registered after ${$o} ms`)),$o),s=n.installing||n.waiting;n.active?(clearTimeout(r),t()):s?s.onstatechange=o=>{o.target?.state==="activated"&&(s.onstatechange=null,clearTimeout(r),t())}:(clearTimeout(r),e(new Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qd(n,t){if(!t&&!n.swRegistration&&await Tc(n),!(!t&&n.swRegistration)){if(!(t instanceof ServiceWorkerRegistration))throw mt.create("invalid-sw-registration");n.swRegistration=t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xd(n,t){t?n.vapidKey=t:n.vapidKey||(n.vapidKey=mc)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wc(n,t){if(!navigator)throw mt.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw mt.create("permission-blocked");return await Xd(n,t?.vapidKey),await Qd(n,t?.serviceWorkerRegistration),Ld(n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yd(n,t,e){const r=Jd(t);(await n.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:e[gc],message_name:e[Id],message_time:e[Ad],message_device_time:Math.floor(Date.now()/1e3)})}function Jd(n){switch(n){case fn.NOTIFICATION_CLICKED:return"notification_open";case fn.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zd(n,t){const e=t.data;if(!e.isFirebaseMessaging)return;n.onMessageHandler&&e.messageType===fn.PUSH_RECEIVED&&(typeof n.onMessageHandler=="function"?n.onMessageHandler(Ko(e)):n.onMessageHandler.next(Ko(e)));const r=e.data;Hd(r)&&r[bd]==="1"&&await Yd(n,e.messageType,r)}const Go="@firebase/messaging",Wo="0.12.23";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tp=n=>{const t=new Gd(n.getProvider("app").getImmediate(),n.getProvider("installations-internal").getImmediate(),n.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",e=>Zd(t,e)),t},ep=n=>{const t=n.getProvider("messaging").getImmediate();return{getToken:r=>wc(t,r)}};function np(){Nt(new Dt("messaging",tp,"PUBLIC")),Nt(new Dt("messaging-internal",ep,"PRIVATE")),bt(Go,Wo),bt(Go,Wo,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rp(){try{await xi()}catch{return!1}return typeof window<"u"&&Mi()&&Ba()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ip(n){if(!navigator)throw mt.create("only-available-in-window");return n.swRegistration||await Tc(n),Fd(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sp(n=Ui()){return rp().then(t=>{if(!t)throw mt.create("unsupported-browser")},t=>{throw mt.create("indexed-db-unsupported")}),Oe(zt(n),"messaging").getImmediate()}async function vc(n,t){return n=zt(n),wc(n,t)}function op(n){return n=zt(n),ip(n)}np();var Qo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Xi;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(E,p){function g(){}g.prototype=p.prototype,E.D=p.prototype,E.prototype=new g,E.prototype.constructor=E,E.C=function(_,y,w){for(var m=Array(arguments.length-2),xt=2;xt<arguments.length;xt++)m[xt-2]=arguments[xt];return p.prototype[y].apply(_,m)}}function e(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(r,e),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,p,g){g||(g=0);var _=Array(16);if(typeof p=="string")for(var y=0;16>y;++y)_[y]=p.charCodeAt(g++)|p.charCodeAt(g++)<<8|p.charCodeAt(g++)<<16|p.charCodeAt(g++)<<24;else for(y=0;16>y;++y)_[y]=p[g++]|p[g++]<<8|p[g++]<<16|p[g++]<<24;p=E.g[0],g=E.g[1],y=E.g[2];var w=E.g[3],m=p+(w^g&(y^w))+_[0]+3614090360&4294967295;p=g+(m<<7&4294967295|m>>>25),m=w+(y^p&(g^y))+_[1]+3905402710&4294967295,w=p+(m<<12&4294967295|m>>>20),m=y+(g^w&(p^g))+_[2]+606105819&4294967295,y=w+(m<<17&4294967295|m>>>15),m=g+(p^y&(w^p))+_[3]+3250441966&4294967295,g=y+(m<<22&4294967295|m>>>10),m=p+(w^g&(y^w))+_[4]+4118548399&4294967295,p=g+(m<<7&4294967295|m>>>25),m=w+(y^p&(g^y))+_[5]+1200080426&4294967295,w=p+(m<<12&4294967295|m>>>20),m=y+(g^w&(p^g))+_[6]+2821735955&4294967295,y=w+(m<<17&4294967295|m>>>15),m=g+(p^y&(w^p))+_[7]+4249261313&4294967295,g=y+(m<<22&4294967295|m>>>10),m=p+(w^g&(y^w))+_[8]+1770035416&4294967295,p=g+(m<<7&4294967295|m>>>25),m=w+(y^p&(g^y))+_[9]+2336552879&4294967295,w=p+(m<<12&4294967295|m>>>20),m=y+(g^w&(p^g))+_[10]+4294925233&4294967295,y=w+(m<<17&4294967295|m>>>15),m=g+(p^y&(w^p))+_[11]+2304563134&4294967295,g=y+(m<<22&4294967295|m>>>10),m=p+(w^g&(y^w))+_[12]+1804603682&4294967295,p=g+(m<<7&4294967295|m>>>25),m=w+(y^p&(g^y))+_[13]+4254626195&4294967295,w=p+(m<<12&4294967295|m>>>20),m=y+(g^w&(p^g))+_[14]+2792965006&4294967295,y=w+(m<<17&4294967295|m>>>15),m=g+(p^y&(w^p))+_[15]+1236535329&4294967295,g=y+(m<<22&4294967295|m>>>10),m=p+(y^w&(g^y))+_[1]+4129170786&4294967295,p=g+(m<<5&4294967295|m>>>27),m=w+(g^y&(p^g))+_[6]+3225465664&4294967295,w=p+(m<<9&4294967295|m>>>23),m=y+(p^g&(w^p))+_[11]+643717713&4294967295,y=w+(m<<14&4294967295|m>>>18),m=g+(w^p&(y^w))+_[0]+3921069994&4294967295,g=y+(m<<20&4294967295|m>>>12),m=p+(y^w&(g^y))+_[5]+3593408605&4294967295,p=g+(m<<5&4294967295|m>>>27),m=w+(g^y&(p^g))+_[10]+38016083&4294967295,w=p+(m<<9&4294967295|m>>>23),m=y+(p^g&(w^p))+_[15]+3634488961&4294967295,y=w+(m<<14&4294967295|m>>>18),m=g+(w^p&(y^w))+_[4]+3889429448&4294967295,g=y+(m<<20&4294967295|m>>>12),m=p+(y^w&(g^y))+_[9]+568446438&4294967295,p=g+(m<<5&4294967295|m>>>27),m=w+(g^y&(p^g))+_[14]+3275163606&4294967295,w=p+(m<<9&4294967295|m>>>23),m=y+(p^g&(w^p))+_[3]+4107603335&4294967295,y=w+(m<<14&4294967295|m>>>18),m=g+(w^p&(y^w))+_[8]+1163531501&4294967295,g=y+(m<<20&4294967295|m>>>12),m=p+(y^w&(g^y))+_[13]+2850285829&4294967295,p=g+(m<<5&4294967295|m>>>27),m=w+(g^y&(p^g))+_[2]+4243563512&4294967295,w=p+(m<<9&4294967295|m>>>23),m=y+(p^g&(w^p))+_[7]+1735328473&4294967295,y=w+(m<<14&4294967295|m>>>18),m=g+(w^p&(y^w))+_[12]+2368359562&4294967295,g=y+(m<<20&4294967295|m>>>12),m=p+(g^y^w)+_[5]+4294588738&4294967295,p=g+(m<<4&4294967295|m>>>28),m=w+(p^g^y)+_[8]+2272392833&4294967295,w=p+(m<<11&4294967295|m>>>21),m=y+(w^p^g)+_[11]+1839030562&4294967295,y=w+(m<<16&4294967295|m>>>16),m=g+(y^w^p)+_[14]+4259657740&4294967295,g=y+(m<<23&4294967295|m>>>9),m=p+(g^y^w)+_[1]+2763975236&4294967295,p=g+(m<<4&4294967295|m>>>28),m=w+(p^g^y)+_[4]+1272893353&4294967295,w=p+(m<<11&4294967295|m>>>21),m=y+(w^p^g)+_[7]+4139469664&4294967295,y=w+(m<<16&4294967295|m>>>16),m=g+(y^w^p)+_[10]+3200236656&4294967295,g=y+(m<<23&4294967295|m>>>9),m=p+(g^y^w)+_[13]+681279174&4294967295,p=g+(m<<4&4294967295|m>>>28),m=w+(p^g^y)+_[0]+3936430074&4294967295,w=p+(m<<11&4294967295|m>>>21),m=y+(w^p^g)+_[3]+3572445317&4294967295,y=w+(m<<16&4294967295|m>>>16),m=g+(y^w^p)+_[6]+76029189&4294967295,g=y+(m<<23&4294967295|m>>>9),m=p+(g^y^w)+_[9]+3654602809&4294967295,p=g+(m<<4&4294967295|m>>>28),m=w+(p^g^y)+_[12]+3873151461&4294967295,w=p+(m<<11&4294967295|m>>>21),m=y+(w^p^g)+_[15]+530742520&4294967295,y=w+(m<<16&4294967295|m>>>16),m=g+(y^w^p)+_[2]+3299628645&4294967295,g=y+(m<<23&4294967295|m>>>9),m=p+(y^(g|~w))+_[0]+4096336452&4294967295,p=g+(m<<6&4294967295|m>>>26),m=w+(g^(p|~y))+_[7]+1126891415&4294967295,w=p+(m<<10&4294967295|m>>>22),m=y+(p^(w|~g))+_[14]+2878612391&4294967295,y=w+(m<<15&4294967295|m>>>17),m=g+(w^(y|~p))+_[5]+4237533241&4294967295,g=y+(m<<21&4294967295|m>>>11),m=p+(y^(g|~w))+_[12]+1700485571&4294967295,p=g+(m<<6&4294967295|m>>>26),m=w+(g^(p|~y))+_[3]+2399980690&4294967295,w=p+(m<<10&4294967295|m>>>22),m=y+(p^(w|~g))+_[10]+4293915773&4294967295,y=w+(m<<15&4294967295|m>>>17),m=g+(w^(y|~p))+_[1]+2240044497&4294967295,g=y+(m<<21&4294967295|m>>>11),m=p+(y^(g|~w))+_[8]+1873313359&4294967295,p=g+(m<<6&4294967295|m>>>26),m=w+(g^(p|~y))+_[15]+4264355552&4294967295,w=p+(m<<10&4294967295|m>>>22),m=y+(p^(w|~g))+_[6]+2734768916&4294967295,y=w+(m<<15&4294967295|m>>>17),m=g+(w^(y|~p))+_[13]+1309151649&4294967295,g=y+(m<<21&4294967295|m>>>11),m=p+(y^(g|~w))+_[4]+4149444226&4294967295,p=g+(m<<6&4294967295|m>>>26),m=w+(g^(p|~y))+_[11]+3174756917&4294967295,w=p+(m<<10&4294967295|m>>>22),m=y+(p^(w|~g))+_[2]+718787259&4294967295,y=w+(m<<15&4294967295|m>>>17),m=g+(w^(y|~p))+_[9]+3951481745&4294967295,E.g[0]=E.g[0]+p&4294967295,E.g[1]=E.g[1]+(y+(m<<21&4294967295|m>>>11))&4294967295,E.g[2]=E.g[2]+y&4294967295,E.g[3]=E.g[3]+w&4294967295}r.prototype.u=function(E,p){p===void 0&&(p=E.length);for(var g=p-this.blockSize,_=this.B,y=this.h,w=0;w<p;){if(y==0)for(;w<=g;)s(this,E,w),w+=this.blockSize;if(typeof E=="string"){for(;w<p;)if(_[y++]=E.charCodeAt(w++),y==this.blockSize){s(this,_),y=0;break}}else for(;w<p;)if(_[y++]=E[w++],y==this.blockSize){s(this,_),y=0;break}}this.h=y,this.o+=p},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var p=1;p<E.length-8;++p)E[p]=0;var g=8*this.o;for(p=E.length-8;p<E.length;++p)E[p]=g&255,g/=256;for(this.u(E),E=Array(16),p=g=0;4>p;++p)for(var _=0;32>_;_+=8)E[g++]=this.g[p]>>>_&255;return E};function o(E,p){var g=l;return Object.prototype.hasOwnProperty.call(g,E)?g[E]:g[E]=p(E)}function c(E,p){this.h=p;for(var g=[],_=!0,y=E.length-1;0<=y;y--){var w=E[y]|0;_&&w==p||(g[y]=w,_=!1)}this.g=g}var l={};function f(E){return-128<=E&&128>E?o(E,function(p){return new c([p|0],0>p?-1:0)}):new c([E|0],0>E?-1:0)}function d(E){if(isNaN(E)||!isFinite(E))return A;if(0>E)return N(d(-E));for(var p=[],g=1,_=0;E>=g;_++)p[_]=E/g|0,g*=4294967296;return new c(p,0)}function v(E,p){if(E.length==0)throw Error("number format error: empty string");if(p=p||10,2>p||36<p)throw Error("radix out of range: "+p);if(E.charAt(0)=="-")return N(v(E.substring(1),p));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var g=d(Math.pow(p,8)),_=A,y=0;y<E.length;y+=8){var w=Math.min(8,E.length-y),m=parseInt(E.substring(y,y+w),p);8>w?(w=d(Math.pow(p,w)),_=_.j(w).add(d(m))):(_=_.j(g),_=_.add(d(m)))}return _}var A=f(0),b=f(1),P=f(16777216);n=c.prototype,n.m=function(){if(O(this))return-N(this).m();for(var E=0,p=1,g=0;g<this.g.length;g++){var _=this.i(g);E+=(0<=_?_:4294967296+_)*p,p*=4294967296}return E},n.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(V(this))return"0";if(O(this))return"-"+N(this).toString(E);for(var p=d(Math.pow(E,6)),g=this,_="";;){var y=gt(g,p).g;g=H(g,y.j(p));var w=((0<g.g.length?g.g[0]:g.h)>>>0).toString(E);if(g=y,V(g))return w+_;for(;6>w.length;)w="0"+w;_=w+_}},n.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function V(E){if(E.h!=0)return!1;for(var p=0;p<E.g.length;p++)if(E.g[p]!=0)return!1;return!0}function O(E){return E.h==-1}n.l=function(E){return E=H(this,E),O(E)?-1:V(E)?0:1};function N(E){for(var p=E.g.length,g=[],_=0;_<p;_++)g[_]=~E.g[_];return new c(g,~E.h).add(b)}n.abs=function(){return O(this)?N(this):this},n.add=function(E){for(var p=Math.max(this.g.length,E.g.length),g=[],_=0,y=0;y<=p;y++){var w=_+(this.i(y)&65535)+(E.i(y)&65535),m=(w>>>16)+(this.i(y)>>>16)+(E.i(y)>>>16);_=m>>>16,w&=65535,m&=65535,g[y]=m<<16|w}return new c(g,g[g.length-1]&-2147483648?-1:0)};function H(E,p){return E.add(N(p))}n.j=function(E){if(V(this)||V(E))return A;if(O(this))return O(E)?N(this).j(N(E)):N(N(this).j(E));if(O(E))return N(this.j(N(E)));if(0>this.l(P)&&0>E.l(P))return d(this.m()*E.m());for(var p=this.g.length+E.g.length,g=[],_=0;_<2*p;_++)g[_]=0;for(_=0;_<this.g.length;_++)for(var y=0;y<E.g.length;y++){var w=this.i(_)>>>16,m=this.i(_)&65535,xt=E.i(y)>>>16,Le=E.i(y)&65535;g[2*_+2*y]+=m*Le,j(g,2*_+2*y),g[2*_+2*y+1]+=w*Le,j(g,2*_+2*y+1),g[2*_+2*y+1]+=m*xt,j(g,2*_+2*y+1),g[2*_+2*y+2]+=w*xt,j(g,2*_+2*y+2)}for(_=0;_<p;_++)g[_]=g[2*_+1]<<16|g[2*_];for(_=p;_<2*p;_++)g[_]=0;return new c(g,0)};function j(E,p){for(;(E[p]&65535)!=E[p];)E[p+1]+=E[p]>>>16,E[p]&=65535,p++}function $(E,p){this.g=E,this.h=p}function gt(E,p){if(V(p))throw Error("division by zero");if(V(E))return new $(A,A);if(O(E))return p=gt(N(E),p),new $(N(p.g),N(p.h));if(O(p))return p=gt(E,N(p)),new $(N(p.g),p.h);if(30<E.g.length){if(O(E)||O(p))throw Error("slowDivide_ only works with positive integers.");for(var g=b,_=p;0>=_.l(E);)g=Kt(g),_=Kt(_);var y=vt(g,1),w=vt(_,1);for(_=vt(_,2),g=vt(g,2);!V(_);){var m=w.add(_);0>=m.l(E)&&(y=y.add(g),w=m),_=vt(_,1),g=vt(g,1)}return p=H(E,y.j(p)),new $(y,p)}for(y=A;0<=E.l(p);){for(g=Math.max(1,Math.floor(E.m()/p.m())),_=Math.ceil(Math.log(g)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),w=d(g),m=w.j(p);O(m)||0<m.l(E);)g-=_,w=d(g),m=w.j(p);V(w)&&(w=b),y=y.add(w),E=H(E,m)}return new $(y,E)}n.A=function(E){return gt(this,E).h},n.and=function(E){for(var p=Math.max(this.g.length,E.g.length),g=[],_=0;_<p;_++)g[_]=this.i(_)&E.i(_);return new c(g,this.h&E.h)},n.or=function(E){for(var p=Math.max(this.g.length,E.g.length),g=[],_=0;_<p;_++)g[_]=this.i(_)|E.i(_);return new c(g,this.h|E.h)},n.xor=function(E){for(var p=Math.max(this.g.length,E.g.length),g=[],_=0;_<p;_++)g[_]=this.i(_)^E.i(_);return new c(g,this.h^E.h)};function Kt(E){for(var p=E.g.length+1,g=[],_=0;_<p;_++)g[_]=E.i(_)<<1|E.i(_-1)>>>31;return new c(g,E.h)}function vt(E,p){var g=p>>5;p%=32;for(var _=E.g.length-g,y=[],w=0;w<_;w++)y[w]=0<p?E.i(w+g)>>>p|E.i(w+g+1)<<32-p:E.i(w+g);return new c(y,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,c.prototype.add=c.prototype.add,c.prototype.multiply=c.prototype.j,c.prototype.modulo=c.prototype.A,c.prototype.compare=c.prototype.l,c.prototype.toNumber=c.prototype.m,c.prototype.toString=c.prototype.toString,c.prototype.getBits=c.prototype.i,c.fromNumber=d,c.fromString=v,Xi=c}).apply(typeof Qo<"u"?Qo:typeof self<"u"?self:typeof window<"u"?window:{});var zn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ic,en,Ac,Xn,Ei,bc,Sc,Rc;(function(){var n,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,a,u){return i==Array.prototype||i==Object.prototype||(i[a]=u.value),i};function e(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof zn=="object"&&zn];for(var a=0;a<i.length;++a){var u=i[a];if(u&&u.Math==Math)return u}throw Error("Cannot find global object")}var r=e(this);function s(i,a){if(a)t:{var u=r;i=i.split(".");for(var h=0;h<i.length-1;h++){var T=i[h];if(!(T in u))break t;u=u[T]}i=i[i.length-1],h=u[i],a=a(h),a!=h&&a!=null&&t(u,i,{configurable:!0,writable:!0,value:a})}}function o(i,a){i instanceof String&&(i+="");var u=0,h=!1,T={next:function(){if(!h&&u<i.length){var I=u++;return{value:a(I,i[I]),done:!1}}return h=!0,{done:!0,value:void 0}}};return T[Symbol.iterator]=function(){return T},T}s("Array.prototype.values",function(i){return i||function(){return o(this,function(a,u){return u})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var c=c||{},l=this||self;function f(i){var a=typeof i;return a=a!="object"?a:i?Array.isArray(i)?"array":a:"null",a=="array"||a=="object"&&typeof i.length=="number"}function d(i){var a=typeof i;return a=="object"&&i!=null||a=="function"}function v(i,a,u){return i.call.apply(i.bind,arguments)}function A(i,a,u){if(!i)throw Error();if(2<arguments.length){var h=Array.prototype.slice.call(arguments,2);return function(){var T=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(T,h),i.apply(a,T)}}return function(){return i.apply(a,arguments)}}function b(i,a,u){return b=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?v:A,b.apply(null,arguments)}function P(i,a){var u=Array.prototype.slice.call(arguments,1);return function(){var h=u.slice();return h.push.apply(h,arguments),i.apply(this,h)}}function V(i,a){function u(){}u.prototype=a.prototype,i.aa=a.prototype,i.prototype=new u,i.prototype.constructor=i,i.Qb=function(h,T,I){for(var C=Array(arguments.length-2),q=2;q<arguments.length;q++)C[q-2]=arguments[q];return a.prototype[T].apply(h,C)}}function O(i){const a=i.length;if(0<a){const u=Array(a);for(let h=0;h<a;h++)u[h]=i[h];return u}return[]}function N(i,a){for(let u=1;u<arguments.length;u++){const h=arguments[u];if(f(h)){const T=i.length||0,I=h.length||0;i.length=T+I;for(let C=0;C<I;C++)i[T+C]=h[C]}else i.push(h)}}class H{constructor(a,u){this.i=a,this.j=u,this.h=0,this.g=null}get(){let a;return 0<this.h?(this.h--,a=this.g,this.g=a.next,a.next=null):a=this.i(),a}}function j(i){return/^[\s\xa0]*$/.test(i)}function $(){var i=l.navigator;return i&&(i=i.userAgent)?i:""}function gt(i){return gt[" "](i),i}gt[" "]=function(){};var Kt=$().indexOf("Gecko")!=-1&&!($().toLowerCase().indexOf("webkit")!=-1&&$().indexOf("Edge")==-1)&&!($().indexOf("Trident")!=-1||$().indexOf("MSIE")!=-1)&&$().indexOf("Edge")==-1;function vt(i,a,u){for(const h in i)a.call(u,i[h],h,i)}function E(i,a){for(const u in i)a.call(void 0,i[u],u,i)}function p(i){const a={};for(const u in i)a[u]=i[u];return a}const g="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(i,a){let u,h;for(let T=1;T<arguments.length;T++){h=arguments[T];for(u in h)i[u]=h[u];for(let I=0;I<g.length;I++)u=g[I],Object.prototype.hasOwnProperty.call(h,u)&&(i[u]=h[u])}}function y(i){var a=1;i=i.split(":");const u=[];for(;0<a&&i.length;)u.push(i.shift()),a--;return i.length&&u.push(i.join(":")),u}function w(i){l.setTimeout(()=>{throw i},0)}function m(){var i=Cr;let a=null;return i.g&&(a=i.g,i.g=i.g.next,i.g||(i.h=null),a.next=null),a}class xt{constructor(){this.h=this.g=null}add(a,u){const h=Le.get();h.set(a,u),this.h?this.h.next=h:this.g=h,this.h=h}}var Le=new H(()=>new Mu,i=>i.reset());class Mu{constructor(){this.next=this.g=this.h=null}set(a,u){this.h=a,this.g=u,this.next=null}reset(){this.next=this.g=this.h=null}}let Fe,Ue=!1,Cr=new xt,ws=()=>{const i=l.Promise.resolve(void 0);Fe=()=>{i.then(xu)}};var xu=()=>{for(var i;i=m();){try{i.h.call(i.g)}catch(u){w(u)}var a=Le;a.j(i),100>a.h&&(a.h++,i.next=a.g,a.g=i)}Ue=!1};function Gt(){this.s=this.s,this.C=this.C}Gt.prototype.s=!1,Gt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Gt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function at(i,a){this.type=i,this.g=this.target=a,this.defaultPrevented=!1}at.prototype.h=function(){this.defaultPrevented=!0};var Lu=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var i=!1,a=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const u=()=>{};l.addEventListener("test",u,a),l.removeEventListener("test",u,a)}catch{}return i})();function Be(i,a){if(at.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var u=this.type=i.type,h=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=a,a=i.relatedTarget){if(Kt){t:{try{gt(a.nodeName);var T=!0;break t}catch{}T=!1}T||(a=null)}}else u=="mouseover"?a=i.fromElement:u=="mouseout"&&(a=i.toElement);this.relatedTarget=a,h?(this.clientX=h.clientX!==void 0?h.clientX:h.pageX,this.clientY=h.clientY!==void 0?h.clientY:h.pageY,this.screenX=h.screenX||0,this.screenY=h.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:Fu[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&Be.aa.h.call(this)}}V(Be,at);var Fu={2:"touch",3:"pen",4:"mouse"};Be.prototype.h=function(){Be.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var bn="closure_listenable_"+(1e6*Math.random()|0),Uu=0;function Bu(i,a,u,h,T){this.listener=i,this.proxy=null,this.src=a,this.type=u,this.capture=!!h,this.ha=T,this.key=++Uu,this.da=this.fa=!1}function Sn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Rn(i){this.src=i,this.g={},this.h=0}Rn.prototype.add=function(i,a,u,h,T){var I=i.toString();i=this.g[I],i||(i=this.g[I]=[],this.h++);var C=Vr(i,a,h,T);return-1<C?(a=i[C],u||(a.fa=!1)):(a=new Bu(a,this.src,I,!!h,T),a.fa=u,i.push(a)),a};function Pr(i,a){var u=a.type;if(u in i.g){var h=i.g[u],T=Array.prototype.indexOf.call(h,a,void 0),I;(I=0<=T)&&Array.prototype.splice.call(h,T,1),I&&(Sn(a),i.g[u].length==0&&(delete i.g[u],i.h--))}}function Vr(i,a,u,h){for(var T=0;T<i.length;++T){var I=i[T];if(!I.da&&I.listener==a&&I.capture==!!u&&I.ha==h)return T}return-1}var Dr="closure_lm_"+(1e6*Math.random()|0),kr={};function vs(i,a,u,h,T){if(Array.isArray(a)){for(var I=0;I<a.length;I++)vs(i,a[I],u,h,T);return null}return u=bs(u),i&&i[bn]?i.K(a,u,d(h)?!!h.capture:!1,T):ju(i,a,u,!1,h,T)}function ju(i,a,u,h,T,I){if(!a)throw Error("Invalid event type");var C=d(T)?!!T.capture:!!T,q=Or(i);if(q||(i[Dr]=q=new Rn(i)),u=q.add(a,u,h,C,I),u.proxy)return u;if(h=$u(),u.proxy=h,h.src=i,h.listener=u,i.addEventListener)Lu||(T=C),T===void 0&&(T=!1),i.addEventListener(a.toString(),h,T);else if(i.attachEvent)i.attachEvent(As(a.toString()),h);else if(i.addListener&&i.removeListener)i.addListener(h);else throw Error("addEventListener and attachEvent are unavailable.");return u}function $u(){function i(u){return a.call(i.src,i.listener,u)}const a=qu;return i}function Is(i,a,u,h,T){if(Array.isArray(a))for(var I=0;I<a.length;I++)Is(i,a[I],u,h,T);else h=d(h)?!!h.capture:!!h,u=bs(u),i&&i[bn]?(i=i.i,a=String(a).toString(),a in i.g&&(I=i.g[a],u=Vr(I,u,h,T),-1<u&&(Sn(I[u]),Array.prototype.splice.call(I,u,1),I.length==0&&(delete i.g[a],i.h--)))):i&&(i=Or(i))&&(a=i.g[a.toString()],i=-1,a&&(i=Vr(a,u,h,T)),(u=-1<i?a[i]:null)&&Nr(u))}function Nr(i){if(typeof i!="number"&&i&&!i.da){var a=i.src;if(a&&a[bn])Pr(a.i,i);else{var u=i.type,h=i.proxy;a.removeEventListener?a.removeEventListener(u,h,i.capture):a.detachEvent?a.detachEvent(As(u),h):a.addListener&&a.removeListener&&a.removeListener(h),(u=Or(a))?(Pr(u,i),u.h==0&&(u.src=null,a[Dr]=null)):Sn(i)}}}function As(i){return i in kr?kr[i]:kr[i]="on"+i}function qu(i,a){if(i.da)i=!0;else{a=new Be(a,this);var u=i.listener,h=i.ha||i.src;i.fa&&Nr(i),i=u.call(h,a)}return i}function Or(i){return i=i[Dr],i instanceof Rn?i:null}var Mr="__closure_events_fn_"+(1e9*Math.random()>>>0);function bs(i){return typeof i=="function"?i:(i[Mr]||(i[Mr]=function(a){return i.handleEvent(a)}),i[Mr])}function ct(){Gt.call(this),this.i=new Rn(this),this.M=this,this.F=null}V(ct,Gt),ct.prototype[bn]=!0,ct.prototype.removeEventListener=function(i,a,u,h){Is(this,i,a,u,h)};function _t(i,a){var u,h=i.F;if(h)for(u=[];h;h=h.F)u.push(h);if(i=i.M,h=a.type||a,typeof a=="string")a=new at(a,i);else if(a instanceof at)a.target=a.target||i;else{var T=a;a=new at(h,i),_(a,T)}if(T=!0,u)for(var I=u.length-1;0<=I;I--){var C=a.g=u[I];T=Cn(C,h,!0,a)&&T}if(C=a.g=i,T=Cn(C,h,!0,a)&&T,T=Cn(C,h,!1,a)&&T,u)for(I=0;I<u.length;I++)C=a.g=u[I],T=Cn(C,h,!1,a)&&T}ct.prototype.N=function(){if(ct.aa.N.call(this),this.i){var i=this.i,a;for(a in i.g){for(var u=i.g[a],h=0;h<u.length;h++)Sn(u[h]);delete i.g[a],i.h--}}this.F=null},ct.prototype.K=function(i,a,u,h){return this.i.add(String(i),a,!1,u,h)},ct.prototype.L=function(i,a,u,h){return this.i.add(String(i),a,!0,u,h)};function Cn(i,a,u,h){if(a=i.i.g[String(a)],!a)return!0;a=a.concat();for(var T=!0,I=0;I<a.length;++I){var C=a[I];if(C&&!C.da&&C.capture==u){var q=C.listener,nt=C.ha||C.src;C.fa&&Pr(i.i,C),T=q.call(nt,h)!==!1&&T}}return T&&!h.defaultPrevented}function Ss(i,a,u){if(typeof i=="function")u&&(i=b(i,u));else if(i&&typeof i.handleEvent=="function")i=b(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(a)?-1:l.setTimeout(i,a||0)}function Rs(i){i.g=Ss(()=>{i.g=null,i.i&&(i.i=!1,Rs(i))},i.l);const a=i.h;i.h=null,i.m.apply(null,a)}class zu extends Gt{constructor(a,u){super(),this.m=a,this.l=u,this.h=null,this.i=!1,this.g=null}j(a){this.h=arguments,this.g?this.i=!0:Rs(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function je(i){Gt.call(this),this.h=i,this.g={}}V(je,Gt);var Cs=[];function Ps(i){vt(i.g,function(a,u){this.g.hasOwnProperty(u)&&Nr(a)},i),i.g={}}je.prototype.N=function(){je.aa.N.call(this),Ps(this)},je.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var xr=l.JSON.stringify,Hu=l.JSON.parse,Ku=class{stringify(i){return l.JSON.stringify(i,void 0)}parse(i){return l.JSON.parse(i,void 0)}};function Lr(){}Lr.prototype.h=null;function Vs(i){return i.h||(i.h=i.i())}function Ds(){}var $e={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Fr(){at.call(this,"d")}V(Fr,at);function Ur(){at.call(this,"c")}V(Ur,at);var re={},ks=null;function Pn(){return ks=ks||new ct}re.La="serverreachability";function Ns(i){at.call(this,re.La,i)}V(Ns,at);function qe(i){const a=Pn();_t(a,new Ns(a))}re.STAT_EVENT="statevent";function Os(i,a){at.call(this,re.STAT_EVENT,i),this.stat=a}V(Os,at);function yt(i){const a=Pn();_t(a,new Os(a,i))}re.Ma="timingevent";function Ms(i,a){at.call(this,re.Ma,i),this.size=a}V(Ms,at);function ze(i,a){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){i()},a)}function He(){this.g=!0}He.prototype.xa=function(){this.g=!1};function Gu(i,a,u,h,T,I){i.info(function(){if(i.g)if(I)for(var C="",q=I.split("&"),nt=0;nt<q.length;nt++){var U=q[nt].split("=");if(1<U.length){var ut=U[0];U=U[1];var lt=ut.split("_");C=2<=lt.length&&lt[1]=="type"?C+(ut+"="+U+"&"):C+(ut+"=redacted&")}}else C=null;else C=I;return"XMLHTTP REQ ("+h+") [attempt "+T+"]: "+a+`
`+u+`
`+C})}function Wu(i,a,u,h,T,I,C){i.info(function(){return"XMLHTTP RESP ("+h+") [ attempt "+T+"]: "+a+`
`+u+`
`+I+" "+C})}function we(i,a,u,h){i.info(function(){return"XMLHTTP TEXT ("+a+"): "+Xu(i,u)+(h?" "+h:"")})}function Qu(i,a){i.info(function(){return"TIMEOUT: "+a})}He.prototype.info=function(){};function Xu(i,a){if(!i.g)return a;if(!a)return null;try{var u=JSON.parse(a);if(u){for(i=0;i<u.length;i++)if(Array.isArray(u[i])){var h=u[i];if(!(2>h.length)){var T=h[1];if(Array.isArray(T)&&!(1>T.length)){var I=T[0];if(I!="noop"&&I!="stop"&&I!="close")for(var C=1;C<T.length;C++)T[C]=""}}}}return xr(u)}catch{return a}}var Vn={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},xs={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Br;function Dn(){}V(Dn,Lr),Dn.prototype.g=function(){return new XMLHttpRequest},Dn.prototype.i=function(){return{}},Br=new Dn;function Wt(i,a,u,h){this.j=i,this.i=a,this.l=u,this.R=h||1,this.U=new je(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ls}function Ls(){this.i=null,this.g="",this.h=!1}var Fs={},jr={};function $r(i,a,u){i.L=1,i.v=Mn(Lt(a)),i.m=u,i.P=!0,Us(i,null)}function Us(i,a){i.F=Date.now(),kn(i),i.A=Lt(i.v);var u=i.A,h=i.R;Array.isArray(h)||(h=[String(h)]),Zs(u.i,"t",h),i.C=0,u=i.j.J,i.h=new Ls,i.g=yo(i.j,u?a:null,!i.m),0<i.O&&(i.M=new zu(b(i.Y,i,i.g),i.O)),a=i.U,u=i.g,h=i.ca;var T="readystatechange";Array.isArray(T)||(T&&(Cs[0]=T.toString()),T=Cs);for(var I=0;I<T.length;I++){var C=vs(u,T[I],h||a.handleEvent,!1,a.h||a);if(!C)break;a.g[C.key]=C}a=i.H?p(i.H):{},i.m?(i.u||(i.u="POST"),a["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,a)):(i.u="GET",i.g.ea(i.A,i.u,null,a)),qe(),Gu(i.i,i.u,i.A,i.l,i.R,i.m)}Wt.prototype.ca=function(i){i=i.target;const a=this.M;a&&Ft(i)==3?a.j():this.Y(i)},Wt.prototype.Y=function(i){try{if(i==this.g)t:{const lt=Ft(this.g);var a=this.g.Ba();const Ae=this.g.Z();if(!(3>lt)&&(lt!=3||this.g&&(this.h.h||this.g.oa()||oo(this.g)))){this.J||lt!=4||a==7||(a==8||0>=Ae?qe(3):qe(2)),qr(this);var u=this.g.Z();this.X=u;e:if(Bs(this)){var h=oo(this.g);i="";var T=h.length,I=Ft(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){ie(this),Ke(this);var C="";break e}this.h.i=new l.TextDecoder}for(a=0;a<T;a++)this.h.h=!0,i+=this.h.i.decode(h[a],{stream:!(I&&a==T-1)});h.length=0,this.h.g+=i,this.C=0,C=this.h.g}else C=this.g.oa();if(this.o=u==200,Wu(this.i,this.u,this.A,this.l,this.R,lt,u),this.o){if(this.T&&!this.K){e:{if(this.g){var q,nt=this.g;if((q=nt.g?nt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!j(q)){var U=q;break e}}U=null}if(u=U)we(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,zr(this,u);else{this.o=!1,this.s=3,yt(12),ie(this),Ke(this);break t}}if(this.P){u=!0;let St;for(;!this.J&&this.C<C.length;)if(St=Yu(this,C),St==jr){lt==4&&(this.s=4,yt(14),u=!1),we(this.i,this.l,null,"[Incomplete Response]");break}else if(St==Fs){this.s=4,yt(15),we(this.i,this.l,C,"[Invalid Chunk]"),u=!1;break}else we(this.i,this.l,St,null),zr(this,St);if(Bs(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),lt!=4||C.length!=0||this.h.h||(this.s=1,yt(16),u=!1),this.o=this.o&&u,!u)we(this.i,this.l,C,"[Invalid Chunked Response]"),ie(this),Ke(this);else if(0<C.length&&!this.W){this.W=!0;var ut=this.j;ut.g==this&&ut.ba&&!ut.M&&(ut.j.info("Great, no buffering proxy detected. Bytes received: "+C.length),Xr(ut),ut.M=!0,yt(11))}}else we(this.i,this.l,C,null),zr(this,C);lt==4&&ie(this),this.o&&!this.J&&(lt==4?po(this.j,this):(this.o=!1,kn(this)))}else pl(this.g),u==400&&0<C.indexOf("Unknown SID")?(this.s=3,yt(12)):(this.s=0,yt(13)),ie(this),Ke(this)}}}catch{}finally{}};function Bs(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function Yu(i,a){var u=i.C,h=a.indexOf(`
`,u);return h==-1?jr:(u=Number(a.substring(u,h)),isNaN(u)?Fs:(h+=1,h+u>a.length?jr:(a=a.slice(h,h+u),i.C=h+u,a)))}Wt.prototype.cancel=function(){this.J=!0,ie(this)};function kn(i){i.S=Date.now()+i.I,js(i,i.I)}function js(i,a){if(i.B!=null)throw Error("WatchDog timer not null");i.B=ze(b(i.ba,i),a)}function qr(i){i.B&&(l.clearTimeout(i.B),i.B=null)}Wt.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(Qu(this.i,this.A),this.L!=2&&(qe(),yt(17)),ie(this),this.s=2,Ke(this)):js(this,this.S-i)};function Ke(i){i.j.G==0||i.J||po(i.j,i)}function ie(i){qr(i);var a=i.M;a&&typeof a.ma=="function"&&a.ma(),i.M=null,Ps(i.U),i.g&&(a=i.g,i.g=null,a.abort(),a.ma())}function zr(i,a){try{var u=i.j;if(u.G!=0&&(u.g==i||Hr(u.h,i))){if(!i.K&&Hr(u.h,i)&&u.G==3){try{var h=u.Da.g.parse(a)}catch{h=null}if(Array.isArray(h)&&h.length==3){var T=h;if(T[0]==0){t:if(!u.u){if(u.g)if(u.g.F+3e3<i.F)jn(u),Un(u);else break t;Qr(u),yt(18)}}else u.za=T[1],0<u.za-u.T&&37500>T[2]&&u.F&&u.v==0&&!u.C&&(u.C=ze(b(u.Za,u),6e3));if(1>=zs(u.h)&&u.ca){try{u.ca()}catch{}u.ca=void 0}}else oe(u,11)}else if((i.K||u.g==i)&&jn(u),!j(a))for(T=u.Da.g.parse(a),a=0;a<T.length;a++){let U=T[a];if(u.T=U[0],U=U[1],u.G==2)if(U[0]=="c"){u.K=U[1],u.ia=U[2];const ut=U[3];ut!=null&&(u.la=ut,u.j.info("VER="+u.la));const lt=U[4];lt!=null&&(u.Aa=lt,u.j.info("SVER="+u.Aa));const Ae=U[5];Ae!=null&&typeof Ae=="number"&&0<Ae&&(h=1.5*Ae,u.L=h,u.j.info("backChannelRequestTimeoutMs_="+h)),h=u;const St=i.g;if(St){const qn=St.g?St.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(qn){var I=h.h;I.g||qn.indexOf("spdy")==-1&&qn.indexOf("quic")==-1&&qn.indexOf("h2")==-1||(I.j=I.l,I.g=new Set,I.h&&(Kr(I,I.h),I.h=null))}if(h.D){const Yr=St.g?St.g.getResponseHeader("X-HTTP-Session-Id"):null;Yr&&(h.ya=Yr,K(h.I,h.D,Yr))}}u.G=3,u.l&&u.l.ua(),u.ba&&(u.R=Date.now()-i.F,u.j.info("Handshake RTT: "+u.R+"ms")),h=u;var C=i;if(h.qa=_o(h,h.J?h.ia:null,h.W),C.K){Hs(h.h,C);var q=C,nt=h.L;nt&&(q.I=nt),q.B&&(qr(q),kn(q)),h.g=C}else ho(h);0<u.i.length&&Bn(u)}else U[0]!="stop"&&U[0]!="close"||oe(u,7);else u.G==3&&(U[0]=="stop"||U[0]=="close"?U[0]=="stop"?oe(u,7):Wr(u):U[0]!="noop"&&u.l&&u.l.ta(U),u.v=0)}}qe(4)}catch{}}var Ju=class{constructor(i,a){this.g=i,this.map=a}};function $s(i){this.l=i||10,l.PerformanceNavigationTiming?(i=l.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function qs(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function zs(i){return i.h?1:i.g?i.g.size:0}function Hr(i,a){return i.h?i.h==a:i.g?i.g.has(a):!1}function Kr(i,a){i.g?i.g.add(a):i.h=a}function Hs(i,a){i.h&&i.h==a?i.h=null:i.g&&i.g.has(a)&&i.g.delete(a)}$s.prototype.cancel=function(){if(this.i=Ks(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Ks(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let a=i.i;for(const u of i.g.values())a=a.concat(u.D);return a}return O(i.i)}function Zu(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(f(i)){for(var a=[],u=i.length,h=0;h<u;h++)a.push(i[h]);return a}a=[],u=0;for(h in i)a[u++]=i[h];return a}function tl(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(f(i)||typeof i=="string"){var a=[];i=i.length;for(var u=0;u<i;u++)a.push(u);return a}a=[],u=0;for(const h in i)a[u++]=h;return a}}}function Gs(i,a){if(i.forEach&&typeof i.forEach=="function")i.forEach(a,void 0);else if(f(i)||typeof i=="string")Array.prototype.forEach.call(i,a,void 0);else for(var u=tl(i),h=Zu(i),T=h.length,I=0;I<T;I++)a.call(void 0,h[I],u&&u[I],i)}var Ws=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function el(i,a){if(i){i=i.split("&");for(var u=0;u<i.length;u++){var h=i[u].indexOf("="),T=null;if(0<=h){var I=i[u].substring(0,h);T=i[u].substring(h+1)}else I=i[u];a(I,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function se(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof se){this.h=i.h,Nn(this,i.j),this.o=i.o,this.g=i.g,On(this,i.s),this.l=i.l;var a=i.i,u=new Qe;u.i=a.i,a.g&&(u.g=new Map(a.g),u.h=a.h),Qs(this,u),this.m=i.m}else i&&(a=String(i).match(Ws))?(this.h=!1,Nn(this,a[1]||"",!0),this.o=Ge(a[2]||""),this.g=Ge(a[3]||"",!0),On(this,a[4]),this.l=Ge(a[5]||"",!0),Qs(this,a[6]||"",!0),this.m=Ge(a[7]||"")):(this.h=!1,this.i=new Qe(null,this.h))}se.prototype.toString=function(){var i=[],a=this.j;a&&i.push(We(a,Xs,!0),":");var u=this.g;return(u||a=="file")&&(i.push("//"),(a=this.o)&&i.push(We(a,Xs,!0),"@"),i.push(encodeURIComponent(String(u)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u=this.s,u!=null&&i.push(":",String(u))),(u=this.l)&&(this.g&&u.charAt(0)!="/"&&i.push("/"),i.push(We(u,u.charAt(0)=="/"?il:rl,!0))),(u=this.i.toString())&&i.push("?",u),(u=this.m)&&i.push("#",We(u,ol)),i.join("")};function Lt(i){return new se(i)}function Nn(i,a,u){i.j=u?Ge(a,!0):a,i.j&&(i.j=i.j.replace(/:$/,""))}function On(i,a){if(a){if(a=Number(a),isNaN(a)||0>a)throw Error("Bad port number "+a);i.s=a}else i.s=null}function Qs(i,a,u){a instanceof Qe?(i.i=a,al(i.i,i.h)):(u||(a=We(a,sl)),i.i=new Qe(a,i.h))}function K(i,a,u){i.i.set(a,u)}function Mn(i){return K(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function Ge(i,a){return i?a?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function We(i,a,u){return typeof i=="string"?(i=encodeURI(i).replace(a,nl),u&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function nl(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Xs=/[#\/\?@]/g,rl=/[#\?:]/g,il=/[#\?]/g,sl=/[#\?@]/g,ol=/#/g;function Qe(i,a){this.h=this.g=null,this.i=i||null,this.j=!!a}function Qt(i){i.g||(i.g=new Map,i.h=0,i.i&&el(i.i,function(a,u){i.add(decodeURIComponent(a.replace(/\+/g," ")),u)}))}n=Qe.prototype,n.add=function(i,a){Qt(this),this.i=null,i=ve(this,i);var u=this.g.get(i);return u||this.g.set(i,u=[]),u.push(a),this.h+=1,this};function Ys(i,a){Qt(i),a=ve(i,a),i.g.has(a)&&(i.i=null,i.h-=i.g.get(a).length,i.g.delete(a))}function Js(i,a){return Qt(i),a=ve(i,a),i.g.has(a)}n.forEach=function(i,a){Qt(this),this.g.forEach(function(u,h){u.forEach(function(T){i.call(a,T,h,this)},this)},this)},n.na=function(){Qt(this);const i=Array.from(this.g.values()),a=Array.from(this.g.keys()),u=[];for(let h=0;h<a.length;h++){const T=i[h];for(let I=0;I<T.length;I++)u.push(a[h])}return u},n.V=function(i){Qt(this);let a=[];if(typeof i=="string")Js(this,i)&&(a=a.concat(this.g.get(ve(this,i))));else{i=Array.from(this.g.values());for(let u=0;u<i.length;u++)a=a.concat(i[u])}return a},n.set=function(i,a){return Qt(this),this.i=null,i=ve(this,i),Js(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[a]),this.h+=1,this},n.get=function(i,a){return i?(i=this.V(i),0<i.length?String(i[0]):a):a};function Zs(i,a,u){Ys(i,a),0<u.length&&(i.i=null,i.g.set(ve(i,a),O(u)),i.h+=u.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],a=Array.from(this.g.keys());for(var u=0;u<a.length;u++){var h=a[u];const I=encodeURIComponent(String(h)),C=this.V(h);for(h=0;h<C.length;h++){var T=I;C[h]!==""&&(T+="="+encodeURIComponent(String(C[h]))),i.push(T)}}return this.i=i.join("&")};function ve(i,a){return a=String(a),i.j&&(a=a.toLowerCase()),a}function al(i,a){a&&!i.j&&(Qt(i),i.i=null,i.g.forEach(function(u,h){var T=h.toLowerCase();h!=T&&(Ys(this,h),Zs(this,T,u))},i)),i.j=a}function cl(i,a){const u=new He;if(l.Image){const h=new Image;h.onload=P(Xt,u,"TestLoadImage: loaded",!0,a,h),h.onerror=P(Xt,u,"TestLoadImage: error",!1,a,h),h.onabort=P(Xt,u,"TestLoadImage: abort",!1,a,h),h.ontimeout=P(Xt,u,"TestLoadImage: timeout",!1,a,h),l.setTimeout(function(){h.ontimeout&&h.ontimeout()},1e4),h.src=i}else a(!1)}function ul(i,a){const u=new He,h=new AbortController,T=setTimeout(()=>{h.abort(),Xt(u,"TestPingServer: timeout",!1,a)},1e4);fetch(i,{signal:h.signal}).then(I=>{clearTimeout(T),I.ok?Xt(u,"TestPingServer: ok",!0,a):Xt(u,"TestPingServer: server error",!1,a)}).catch(()=>{clearTimeout(T),Xt(u,"TestPingServer: error",!1,a)})}function Xt(i,a,u,h,T){try{T&&(T.onload=null,T.onerror=null,T.onabort=null,T.ontimeout=null),h(u)}catch{}}function ll(){this.g=new Ku}function hl(i,a,u){const h=u||"";try{Gs(i,function(T,I){let C=T;d(T)&&(C=xr(T)),a.push(h+I+"="+encodeURIComponent(C))})}catch(T){throw a.push(h+"type="+encodeURIComponent("_badmap")),T}}function xn(i){this.l=i.Ub||null,this.j=i.eb||!1}V(xn,Lr),xn.prototype.g=function(){return new Ln(this.l,this.j)},xn.prototype.i=(function(i){return function(){return i}})({});function Ln(i,a){ct.call(this),this.D=i,this.o=a,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}V(Ln,ct),n=Ln.prototype,n.open=function(i,a){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=a,this.readyState=1,Ye(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const a={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(a.body=i),(this.D||l).fetch(new Request(this.A,a)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Xe(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,Ye(this)),this.g&&(this.readyState=3,Ye(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;to(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function to(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var a=i.value?i.value:new Uint8Array(0);(a=this.v.decode(a,{stream:!i.done}))&&(this.response=this.responseText+=a)}i.done?Xe(this):Ye(this),this.readyState==3&&to(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,Xe(this))},n.Qa=function(i){this.g&&(this.response=i,Xe(this))},n.ga=function(){this.g&&Xe(this)};function Xe(i){i.readyState=4,i.l=null,i.j=null,i.v=null,Ye(i)}n.setRequestHeader=function(i,a){this.u.append(i,a)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],a=this.h.entries();for(var u=a.next();!u.done;)u=u.value,i.push(u[0]+": "+u[1]),u=a.next();return i.join(`\r
`)};function Ye(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(Ln.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function eo(i){let a="";return vt(i,function(u,h){a+=h,a+=":",a+=u,a+=`\r
`}),a}function Gr(i,a,u){t:{for(h in u){var h=!1;break t}h=!0}h||(u=eo(u),typeof i=="string"?u!=null&&encodeURIComponent(String(u)):K(i,a,u))}function Q(i){ct.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}V(Q,ct);var fl=/^https?$/i,dl=["POST","PUT"];n=Q.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,a,u,h){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);a=a?a.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Br.g(),this.v=this.o?Vs(this.o):Vs(Br),this.g.onreadystatechange=b(this.Ea,this);try{this.B=!0,this.g.open(a,String(i),!0),this.B=!1}catch(I){no(this,I);return}if(i=u||"",u=new Map(this.headers),h)if(Object.getPrototypeOf(h)===Object.prototype)for(var T in h)u.set(T,h[T]);else if(typeof h.keys=="function"&&typeof h.get=="function")for(const I of h.keys())u.set(I,h.get(I));else throw Error("Unknown input type for opt_headers: "+String(h));h=Array.from(u.keys()).find(I=>I.toLowerCase()=="content-type"),T=l.FormData&&i instanceof l.FormData,!(0<=Array.prototype.indexOf.call(dl,a,void 0))||h||T||u.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[I,C]of u)this.g.setRequestHeader(I,C);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{so(this),this.u=!0,this.g.send(i),this.u=!1}catch(I){no(this,I)}};function no(i,a){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=a,i.m=5,ro(i),Fn(i)}function ro(i){i.A||(i.A=!0,_t(i,"complete"),_t(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,_t(this,"complete"),_t(this,"abort"),Fn(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Fn(this,!0)),Q.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?io(this):this.bb())},n.bb=function(){io(this)};function io(i){if(i.h&&typeof c<"u"&&(!i.v[1]||Ft(i)!=4||i.Z()!=2)){if(i.u&&Ft(i)==4)Ss(i.Ea,0,i);else if(_t(i,"readystatechange"),Ft(i)==4){i.h=!1;try{const C=i.Z();t:switch(C){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var a=!0;break t;default:a=!1}var u;if(!(u=a)){var h;if(h=C===0){var T=String(i.D).match(Ws)[1]||null;!T&&l.self&&l.self.location&&(T=l.self.location.protocol.slice(0,-1)),h=!fl.test(T?T.toLowerCase():"")}u=h}if(u)_t(i,"complete"),_t(i,"success");else{i.m=6;try{var I=2<Ft(i)?i.g.statusText:""}catch{I=""}i.l=I+" ["+i.Z()+"]",ro(i)}}finally{Fn(i)}}}}function Fn(i,a){if(i.g){so(i);const u=i.g,h=i.v[0]?()=>{}:null;i.g=null,i.v=null,a||_t(i,"ready");try{u.onreadystatechange=h}catch{}}}function so(i){i.I&&(l.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function Ft(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<Ft(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var a=this.g.responseText;return i&&a.indexOf(i)==0&&(a=a.substring(i.length)),Hu(a)}};function oo(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function pl(i){const a={};i=(i.g&&2<=Ft(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let h=0;h<i.length;h++){if(j(i[h]))continue;var u=y(i[h]);const T=u[0];if(u=u[1],typeof u!="string")continue;u=u.trim();const I=a[T]||[];a[T]=I,I.push(u)}E(a,function(h){return h.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Je(i,a,u){return u&&u.internalChannelParams&&u.internalChannelParams[i]||a}function ao(i){this.Aa=0,this.i=[],this.j=new He,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Je("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Je("baseRetryDelayMs",5e3,i),this.cb=Je("retryDelaySeedMs",1e4,i),this.Wa=Je("forwardChannelMaxRetries",2,i),this.wa=Je("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new $s(i&&i.concurrentRequestLimit),this.Da=new ll,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=ao.prototype,n.la=8,n.G=1,n.connect=function(i,a,u,h){yt(0),this.W=i,this.H=a||{},u&&h!==void 0&&(this.H.OSID=u,this.H.OAID=h),this.F=this.X,this.I=_o(this,null,this.W),Bn(this)};function Wr(i){if(co(i),i.G==3){var a=i.U++,u=Lt(i.I);if(K(u,"SID",i.K),K(u,"RID",a),K(u,"TYPE","terminate"),Ze(i,u),a=new Wt(i,i.j,a),a.L=2,a.v=Mn(Lt(u)),u=!1,l.navigator&&l.navigator.sendBeacon)try{u=l.navigator.sendBeacon(a.v.toString(),"")}catch{}!u&&l.Image&&(new Image().src=a.v,u=!0),u||(a.g=yo(a.j,null),a.g.ea(a.v)),a.F=Date.now(),kn(a)}go(i)}function Un(i){i.g&&(Xr(i),i.g.cancel(),i.g=null)}function co(i){Un(i),i.u&&(l.clearTimeout(i.u),i.u=null),jn(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&l.clearTimeout(i.s),i.s=null)}function Bn(i){if(!qs(i.h)&&!i.s){i.s=!0;var a=i.Ga;Fe||ws(),Ue||(Fe(),Ue=!0),Cr.add(a,i),i.B=0}}function ml(i,a){return zs(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=a.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=ze(b(i.Ga,i,a),mo(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const T=new Wt(this,this.j,i);let I=this.o;if(this.S&&(I?(I=p(I),_(I,this.S)):I=this.S),this.m!==null||this.O||(T.H=I,I=null),this.P)t:{for(var a=0,u=0;u<this.i.length;u++){e:{var h=this.i[u];if("__data__"in h.map&&(h=h.map.__data__,typeof h=="string")){h=h.length;break e}h=void 0}if(h===void 0)break;if(a+=h,4096<a){a=u;break t}if(a===4096||u===this.i.length-1){a=u+1;break t}}a=1e3}else a=1e3;a=lo(this,T,a),u=Lt(this.I),K(u,"RID",i),K(u,"CVER",22),this.D&&K(u,"X-HTTP-Session-Id",this.D),Ze(this,u),I&&(this.O?a="headers="+encodeURIComponent(String(eo(I)))+"&"+a:this.m&&Gr(u,this.m,I)),Kr(this.h,T),this.Ua&&K(u,"TYPE","init"),this.P?(K(u,"$req",a),K(u,"SID","null"),T.T=!0,$r(T,u,null)):$r(T,u,a),this.G=2}}else this.G==3&&(i?uo(this,i):this.i.length==0||qs(this.h)||uo(this))};function uo(i,a){var u;a?u=a.l:u=i.U++;const h=Lt(i.I);K(h,"SID",i.K),K(h,"RID",u),K(h,"AID",i.T),Ze(i,h),i.m&&i.o&&Gr(h,i.m,i.o),u=new Wt(i,i.j,u,i.B+1),i.m===null&&(u.H=i.o),a&&(i.i=a.D.concat(i.i)),a=lo(i,u,1e3),u.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),Kr(i.h,u),$r(u,h,a)}function Ze(i,a){i.H&&vt(i.H,function(u,h){K(a,h,u)}),i.l&&Gs({},function(u,h){K(a,h,u)})}function lo(i,a,u){u=Math.min(i.i.length,u);var h=i.l?b(i.l.Na,i.l,i):null;t:{var T=i.i;let I=-1;for(;;){const C=["count="+u];I==-1?0<u?(I=T[0].g,C.push("ofs="+I)):I=0:C.push("ofs="+I);let q=!0;for(let nt=0;nt<u;nt++){let U=T[nt].g;const ut=T[nt].map;if(U-=I,0>U)I=Math.max(0,T[nt].g-100),q=!1;else try{hl(ut,C,"req"+U+"_")}catch{h&&h(ut)}}if(q){h=C.join("&");break t}}}return i=i.i.splice(0,u),a.D=i,h}function ho(i){if(!i.g&&!i.u){i.Y=1;var a=i.Fa;Fe||ws(),Ue||(Fe(),Ue=!0),Cr.add(a,i),i.v=0}}function Qr(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=ze(b(i.Fa,i),mo(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,fo(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=ze(b(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,yt(10),Un(this),fo(this))};function Xr(i){i.A!=null&&(l.clearTimeout(i.A),i.A=null)}function fo(i){i.g=new Wt(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var a=Lt(i.qa);K(a,"RID","rpc"),K(a,"SID",i.K),K(a,"AID",i.T),K(a,"CI",i.F?"0":"1"),!i.F&&i.ja&&K(a,"TO",i.ja),K(a,"TYPE","xmlhttp"),Ze(i,a),i.m&&i.o&&Gr(a,i.m,i.o),i.L&&(i.g.I=i.L);var u=i.g;i=i.ia,u.L=1,u.v=Mn(Lt(a)),u.m=null,u.P=!0,Us(u,i)}n.Za=function(){this.C!=null&&(this.C=null,Un(this),Qr(this),yt(19))};function jn(i){i.C!=null&&(l.clearTimeout(i.C),i.C=null)}function po(i,a){var u=null;if(i.g==a){jn(i),Xr(i),i.g=null;var h=2}else if(Hr(i.h,a))u=a.D,Hs(i.h,a),h=1;else return;if(i.G!=0){if(a.o)if(h==1){u=a.m?a.m.length:0,a=Date.now()-a.F;var T=i.B;h=Pn(),_t(h,new Ms(h,u)),Bn(i)}else ho(i);else if(T=a.s,T==3||T==0&&0<a.X||!(h==1&&ml(i,a)||h==2&&Qr(i)))switch(u&&0<u.length&&(a=i.h,a.i=a.i.concat(u)),T){case 1:oe(i,5);break;case 4:oe(i,10);break;case 3:oe(i,6);break;default:oe(i,2)}}}function mo(i,a){let u=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(u*=2),u*a}function oe(i,a){if(i.j.info("Error code "+a),a==2){var u=b(i.fb,i),h=i.Xa;const T=!h;h=new se(h||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Nn(h,"https"),Mn(h),T?cl(h.toString(),u):ul(h.toString(),u)}else yt(2);i.G=0,i.l&&i.l.sa(a),go(i),co(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),yt(2)):(this.j.info("Failed to ping google.com"),yt(1))};function go(i){if(i.G=0,i.ka=[],i.l){const a=Ks(i.h);(a.length!=0||i.i.length!=0)&&(N(i.ka,a),N(i.ka,i.i),i.h.i.length=0,O(i.i),i.i.length=0),i.l.ra()}}function _o(i,a,u){var h=u instanceof se?Lt(u):new se(u);if(h.g!="")a&&(h.g=a+"."+h.g),On(h,h.s);else{var T=l.location;h=T.protocol,a=a?a+"."+T.hostname:T.hostname,T=+T.port;var I=new se(null);h&&Nn(I,h),a&&(I.g=a),T&&On(I,T),u&&(I.l=u),h=I}return u=i.D,a=i.ya,u&&a&&K(h,u,a),K(h,"VER",i.la),Ze(i,h),h}function yo(i,a,u){if(a&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return a=i.Ca&&!i.pa?new Q(new xn({eb:u})):new Q(i.pa),a.Ha(i.J),a}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Eo(){}n=Eo.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function $n(){}$n.prototype.g=function(i,a){return new It(i,a)};function It(i,a){ct.call(this),this.g=new ao(a),this.l=i,this.h=a&&a.messageUrlParams||null,i=a&&a.messageHeaders||null,a&&a.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=a&&a.initMessageHeaders||null,a&&a.messageContentType&&(i?i["X-WebChannel-Content-Type"]=a.messageContentType:i={"X-WebChannel-Content-Type":a.messageContentType}),a&&a.va&&(i?i["X-WebChannel-Client-Profile"]=a.va:i={"X-WebChannel-Client-Profile":a.va}),this.g.S=i,(i=a&&a.Sb)&&!j(i)&&(this.g.m=i),this.v=a&&a.supportsCrossDomainXhr||!1,this.u=a&&a.sendRawJson||!1,(a=a&&a.httpSessionIdParam)&&!j(a)&&(this.g.D=a,i=this.h,i!==null&&a in i&&(i=this.h,a in i&&delete i[a])),this.j=new Ie(this)}V(It,ct),It.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},It.prototype.close=function(){Wr(this.g)},It.prototype.o=function(i){var a=this.g;if(typeof i=="string"){var u={};u.__data__=i,i=u}else this.u&&(u={},u.__data__=xr(i),i=u);a.i.push(new Ju(a.Ya++,i)),a.G==3&&Bn(a)},It.prototype.N=function(){this.g.l=null,delete this.j,Wr(this.g),delete this.g,It.aa.N.call(this)};function To(i){Fr.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var a=i.__sm__;if(a){t:{for(const u in a){i=u;break t}i=void 0}(this.i=i)&&(i=this.i,a=a!==null&&i in a?a[i]:void 0),this.data=a}else this.data=i}V(To,Fr);function wo(){Ur.call(this),this.status=1}V(wo,Ur);function Ie(i){this.g=i}V(Ie,Eo),Ie.prototype.ua=function(){_t(this.g,"a")},Ie.prototype.ta=function(i){_t(this.g,new To(i))},Ie.prototype.sa=function(i){_t(this.g,new wo)},Ie.prototype.ra=function(){_t(this.g,"b")},$n.prototype.createWebChannel=$n.prototype.g,It.prototype.send=It.prototype.o,It.prototype.open=It.prototype.m,It.prototype.close=It.prototype.close,Rc=function(){return new $n},Sc=function(){return Pn()},bc=re,Ei={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Vn.NO_ERROR=0,Vn.TIMEOUT=8,Vn.HTTP_ERROR=6,Xn=Vn,xs.COMPLETE="complete",Ac=xs,Ds.EventType=$e,$e.OPEN="a",$e.CLOSE="b",$e.ERROR="c",$e.MESSAGE="d",ct.prototype.listen=ct.prototype.K,en=Ds,Q.prototype.listenOnce=Q.prototype.L,Q.prototype.getLastError=Q.prototype.Ka,Q.prototype.getLastErrorCode=Q.prototype.Ba,Q.prototype.getStatus=Q.prototype.Z,Q.prototype.getResponseJson=Q.prototype.Oa,Q.prototype.getResponseText=Q.prototype.oa,Q.prototype.send=Q.prototype.ea,Q.prototype.setWithCredentials=Q.prototype.Ha,Ic=Q}).apply(typeof zn<"u"?zn:typeof self<"u"?self:typeof window<"u"?window:{});const Xo="@firebase/firestore",Yo="4.9.1";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}ft.UNAUTHENTICATED=new ft(null),ft.GOOGLE_CREDENTIALS=new ft("google-credentials-uid"),ft.FIRST_PARTY=new ft("first-party-uid"),ft.MOCK_USER=new ft("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Me="12.2.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const me=new Li("@firebase/firestore");function be(){return me.logLevel}function D(n,...t){if(me.logLevel<=F.DEBUG){const e=t.map(Yi);me.debug(`Firestore (${Me}): ${n}`,...e)}}function ge(n,...t){if(me.logLevel<=F.ERROR){const e=t.map(Yi);me.error(`Firestore (${Me}): ${n}`,...e)}}function Tr(n,...t){if(me.logLevel<=F.WARN){const e=t.map(Yi);me.warn(`Firestore (${Me}): ${n}`,...e)}}function Yi(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(e){return JSON.stringify(e)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(n,t,e){let r="Unexpected state";typeof t=="string"?r=t:e=t,Cc(n,r,e)}function Cc(n,t,e){let r=`FIRESTORE (${Me}) INTERNAL ASSERTION FAILED: ${t} (ID: ${n.toString(16)})`;if(e!==void 0)try{r+=" CONTEXT: "+JSON.stringify(e)}catch{r+=" CONTEXT: "+e}throw ge(r),new Error(r)}function X(n,t,e,r){let s="Unexpected state";typeof e=="string"?s=e:r=e,n||Cc(t,s,r)}function z(n,t){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class k extends ne{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pc{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class ap{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable((()=>e(ft.UNAUTHENTICATED)))}shutdown(){}}class cp{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable((()=>e(this.token.user)))}shutdown(){this.changeListener=null}}class up{constructor(t){this.t=t,this.currentUser=ft.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){X(this.o===void 0,42304);let r=this.i;const s=f=>this.i!==r?(r=this.i,e(f)):Promise.resolve();let o=new le;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new le,t.enqueueRetryable((()=>s(this.currentUser)))};const c=()=>{const f=o;t.enqueueRetryable((async()=>{await f.promise,await s(this.currentUser)}))},l=f=>{D("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=f,this.o&&(this.auth.addAuthTokenListener(this.o),c())};this.t.onInit((f=>l(f))),setTimeout((()=>{if(!this.auth){const f=this.t.getImmediate({optional:!0});f?l(f):(D("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new le)}}),0),c()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then((r=>this.i!==t?(D("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(X(typeof r.accessToken=="string",31837,{l:r}),new Pc(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return X(t===null||typeof t=="string",2055,{h:t}),new ft(t)}}class lp{constructor(t,e,r){this.P=t,this.T=e,this.I=r,this.type="FirstParty",this.user=ft.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class hp{constructor(t,e,r){this.P=t,this.T=e,this.I=r}getToken(){return Promise.resolve(new lp(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable((()=>e(ft.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Jo{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class fp{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Uh(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){X(this.o===void 0,3512);const r=o=>{o.error!=null&&D("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const c=o.token!==this.m;return this.m=o.token,D("FirebaseAppCheckTokenProvider",`Received ${c?"new":"existing"} token.`),c?e(o.token):Promise.resolve()};this.o=o=>{t.enqueueRetryable((()=>r(o)))};const s=o=>{D("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((o=>s(o))),setTimeout((()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?s(o):D("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Jo(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then((e=>e?(X(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new Jo(e.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dp(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let r=0;r<n;r++)e[r]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=dp(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<e&&(r+=t.charAt(s[o]%62))}return r}}function B(n,t){return n<t?-1:n>t?1:0}function Ti(n,t){const e=Math.min(n.length,t.length);for(let r=0;r<e;r++){const s=n.charAt(r),o=t.charAt(r);if(s!==o)return ui(s)===ui(o)?B(s,o):ui(s)?1:-1}return B(n.length,t.length)}const pp=55296,mp=57343;function ui(n){const t=n.charCodeAt(0);return t>=pp&&t<=mp}function Pe(n,t,e){return n.length===t.length&&n.every(((r,s)=>e(r,t[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zo="__name__";class kt{constructor(t,e,r){e===void 0?e=0:e>t.length&&x(637,{offset:e,range:t.length}),r===void 0?r=t.length-e:r>t.length-e&&x(1746,{length:r,range:t.length-e}),this.segments=t,this.offset=e,this.len=r}get length(){return this.len}isEqual(t){return kt.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof kt?t.forEach((r=>{e.push(r)})):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,r=this.limit();e<r;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const r=Math.min(t.length,e.length);for(let s=0;s<r;s++){const o=kt.compareSegments(t.get(s),e.get(s));if(o!==0)return o}return B(t.length,e.length)}static compareSegments(t,e){const r=kt.isNumericId(t),s=kt.isNumericId(e);return r&&!s?-1:!r&&s?1:r&&s?kt.extractNumericId(t).compare(kt.extractNumericId(e)):Ti(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return Xi.fromString(t.substring(4,t.length-2))}}class Y extends kt{construct(t,e,r){return new Y(t,e,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const r of t){if(r.indexOf("//")>=0)throw new k(R.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);e.push(...r.split("/").filter((s=>s.length>0)))}return new Y(e)}static emptyPath(){return new Y([])}}const gp=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class st extends kt{construct(t,e,r){return new st(t,e,r)}static isValidIdentifier(t){return gp.test(t)}canonicalString(){return this.toArray().map((t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),st.isValidIdentifier(t)||(t="`"+t+"`"),t))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Zo}static keyField(){return new st([Zo])}static fromServerFormat(t){const e=[];let r="",s=0;const o=()=>{if(r.length===0)throw new k(R.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(r),r=""};let c=!1;for(;s<t.length;){const l=t[s];if(l==="\\"){if(s+1===t.length)throw new k(R.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const f=t[s+1];if(f!=="\\"&&f!=="."&&f!=="`")throw new k(R.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=f,s+=2}else l==="`"?(c=!c,s++):l!=="."||c?(r+=l,s++):(o(),s++)}if(o(),c)throw new k(R.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new st(e)}static emptyPath(){return new st([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(t){this.path=t}static fromPath(t){return new M(Y.fromString(t))}static fromName(t){return new M(Y.fromString(t).popFirst(5))}static empty(){return new M(Y.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&Y.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return Y.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new M(new Y(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _p(n,t,e){if(!e)throw new k(R.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function yp(n,t,e,r){if(t===!0&&r===!0)throw new k(R.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function ta(n){if(!M.isDocumentKey(n))throw new k(R.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Vc(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Zi(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=(function(r){return r.constructor?r.constructor.name:null})(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":x(12329,{type:typeof n})}function wi(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new k(R.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=Zi(n);throw new k(R.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z(n,t){const e={typeString:n};return t&&(e.value=t),e}function En(n,t){if(!Vc(n))throw new k(R.INVALID_ARGUMENT,"JSON must be an object");let e;for(const r in t)if(t[r]){const s=t[r].typeString,o="value"in t[r]?{value:t[r].value}:void 0;if(!(r in n)){e=`JSON missing required field: '${r}'`;break}const c=n[r];if(s&&typeof c!==s){e=`JSON field '${r}' must be a ${s}.`;break}if(o!==void 0&&c!==o.value){e=`Expected '${r}' field to equal '${o.value}'`;break}}if(e)throw new k(R.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ea=-62135596800,na=1e6;class W{static now(){return W.fromMillis(Date.now())}static fromDate(t){return W.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),r=Math.floor((t-1e3*e)*na);return new W(e,r)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new k(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new k(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<ea)throw new k(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new k(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/na}_compareTo(t){return this.seconds===t.seconds?B(this.nanoseconds,t.nanoseconds):B(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:W._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(En(t,W._jsonSchema))return new W(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-ea;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}W._jsonSchemaVersion="firestore/timestamp/1.0",W._jsonSchema={type:Z("string",W._jsonSchemaVersion),seconds:Z("number"),nanoseconds:Z("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{static fromTimestamp(t){return new G(t)}static min(){return new G(new W(0,0))}static max(){return new G(new W(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dn=-1;function Ep(n,t){const e=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=G.fromTimestamp(r===1e9?new W(e+1,0):new W(e,r));return new Jt(s,M.empty(),t)}function Tp(n){return new Jt(n.readTime,n.key,dn)}class Jt{constructor(t,e,r){this.readTime=t,this.documentKey=e,this.largestBatchId=r}static min(){return new Jt(G.min(),M.empty(),dn)}static max(){return new Jt(G.max(),M.empty(),dn)}}function wp(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=M.comparator(n.documentKey,t.documentKey),e!==0?e:B(n.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vp="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Ip{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((t=>t()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ts(n){if(n.code!==R.FAILED_PRECONDITION||n.message!==vp)throw n;D("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t((e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)}),(e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)}))}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&x(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new S(((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(t,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(e,o).next(r,s)}}))}toPromise(){return new Promise(((t,e)=>{this.next(t,e)}))}wrapUserFunction(t){try{const e=t();return e instanceof S?e:S.resolve(e)}catch(e){return S.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction((()=>t(e))):S.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction((()=>t(e))):S.reject(e)}static resolve(t){return new S(((e,r)=>{e(t)}))}static reject(t){return new S(((e,r)=>{r(t)}))}static waitFor(t){return new S(((e,r)=>{let s=0,o=0,c=!1;t.forEach((l=>{++s,l.next((()=>{++o,c&&o===s&&e()}),(f=>r(f)))})),c=!0,o===s&&e()}))}static or(t){let e=S.resolve(!1);for(const r of t)e=e.next((s=>s?S.resolve(s):r()));return e}static forEach(t,e){const r=[];return t.forEach(((s,o)=>{r.push(e.call(this,s,o))})),this.waitFor(r)}static mapArray(t,e){return new S(((r,s)=>{const o=t.length,c=new Array(o);let l=0;for(let f=0;f<o;f++){const d=f;e(t[d]).next((v=>{c[d]=v,++l,l===o&&r(c)}),(v=>s(v)))}}))}static doWhile(t,e){return new S(((r,s)=>{const o=()=>{t()===!0?e().next((()=>{o()}),s):r()};o()}))}}function Ap(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Tn(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>e.writeSequenceNumber(r))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}es.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ns=-1;function rs(n){return n==null}function sr(n){return n===0&&1/n==-1/0}function bp(n){return typeof n=="number"&&Number.isInteger(n)&&!sr(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dc="";function Sp(n){let t="";for(let e=0;e<n.length;e++)t.length>0&&(t=ra(t)),t=Rp(n.get(e),t);return ra(t)}function Rp(n,t){let e=t;const r=n.length;for(let s=0;s<r;s++){const o=n.charAt(s);switch(o){case"\0":e+="";break;case Dc:e+="";break;default:e+=o}}return e}function ra(n){return n+Dc+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ia(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function xe(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function kc(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(t,e){this.comparator=t,this.root=e||rt.EMPTY}insert(t,e){return new wt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,rt.BLACK,null,null))}remove(t){return new wt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,rt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const r=this.comparator(t,e.key);if(r===0)return e.value;r<0?e=e.left:r>0&&(e=e.right)}return null}indexOf(t){let e=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(t,r.key);if(s===0)return e+r.left.size;s<0?r=r.left:(e+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal(((e,r)=>(t(e,r),!1)))}toString(){const t=[];return this.inorderTraversal(((e,r)=>(t.push(`${e}:${r}`),!1))),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Hn(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Hn(this.root,t,this.comparator,!1)}getReverseIterator(){return new Hn(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Hn(this.root,t,this.comparator,!0)}}class Hn{constructor(t,e,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!t.isEmpty();)if(o=e?r(t.key,e):1,e&&s&&(o*=-1),o<0)t=this.isReverse?t.left:t.right;else{if(o===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class rt{constructor(t,e,r,s,o){this.key=t,this.value=e,this.color=r??rt.RED,this.left=s??rt.EMPTY,this.right=o??rt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,r,s,o){return new rt(t??this.key,e??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,r){let s=this;const o=r(t,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(t,e,r),null):o===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return rt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let r,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return rt.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,rt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,rt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw x(43730,{key:this.key,value:this.value});if(this.right.isRed())throw x(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw x(27949);return t+(this.isRed()?0:1)}}rt.EMPTY=null,rt.RED=!0,rt.BLACK=!1;rt.EMPTY=new class{constructor(){this.size=0}get key(){throw x(57766)}get value(){throw x(16141)}get color(){throw x(16727)}get left(){throw x(29726)}get right(){throw x(36894)}copy(t,e,r,s,o){return this}insert(t,e,r){return new rt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(t){this.comparator=t,this.data=new wt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal(((e,r)=>(t(e),!1)))}forEachInRange(t,e){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let r;for(r=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new sa(this.data.getIterator())}getIteratorFrom(t){return new sa(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach((r=>{e=e.add(r)})),e}isEqual(t){if(!(t instanceof ot)||this.size!==t.size)return!1;const e=this.data.getIterator(),r=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const t=[];return this.forEach((e=>{t.push(e)})),t}toString(){const t=[];return this.forEach((e=>t.push(e))),"SortedSet("+t.toString()+")"}copy(t){const e=new ot(this.comparator);return e.data=t,e}}class sa{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(t){this.fields=t,t.sort(st.comparator)}static empty(){return new Vt([])}unionWith(t){let e=new ot(st.comparator);for(const r of this.fields)e=e.add(r);for(const r of t)e=e.add(r);return new Vt(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Pe(this.fields,t.fields,((e,r)=>e.isEqual(r)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cp extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(t){this.binaryString=t}static fromBase64String(t){const e=(function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Cp("Invalid base64 string: "+o):o}})(t);return new Ot(e)}static fromUint8Array(t){const e=(function(s){let o="";for(let c=0;c<s.length;++c)o+=String.fromCharCode(s[c]);return o})(t);return new Ot(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(e){return btoa(e)})(this.binaryString)}toUint8Array(){return(function(e){const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return B(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Ot.EMPTY_BYTE_STRING=new Ot("");const Pp=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function _e(n){if(X(!!n,39018),typeof n=="string"){let t=0;const e=Pp.exec(n);if(X(!!e,46558,{timestamp:n}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:it(n.seconds),nanos:it(n.nanos)}}function it(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Ve(n){return typeof n=="string"?Ot.fromBase64String(n):Ot.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nc="server_timestamp",Oc="__type__",Mc="__previous_value__",xc="__local_write_time__";function is(n){return(n?.mapValue?.fields||{})[Oc]?.stringValue===Nc}function ss(n){const t=n.mapValue.fields[Mc];return is(t)?ss(t):t}function or(n){const t=_e(n.mapValue.fields[xc].timestampValue);return new W(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vp{constructor(t,e,r,s,o,c,l,f,d,v){this.databaseId=t,this.appId=e,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=c,this.autoDetectLongPolling=l,this.longPollingOptions=f,this.useFetchStreams=d,this.isUsingEmulator=v}}const ar="(default)";class cr{constructor(t,e){this.projectId=t,this.database=e||ar}static empty(){return new cr("","")}get isDefaultDatabase(){return this.database===ar}isEqual(t){return t instanceof cr&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lc="__type__",Dp="__max__",Kn={mapValue:{}},Fc="__vector__",vi="value";function ye(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?is(n)?4:Np(n)?9007199254740991:kp(n)?10:11:x(28295,{value:n})}function Mt(n,t){if(n===t)return!0;const e=ye(n);if(e!==ye(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return or(n).isEqual(or(t));case 3:return(function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const c=_e(s.timestampValue),l=_e(o.timestampValue);return c.seconds===l.seconds&&c.nanos===l.nanos})(n,t);case 5:return n.stringValue===t.stringValue;case 6:return(function(s,o){return Ve(s.bytesValue).isEqual(Ve(o.bytesValue))})(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return(function(s,o){return it(s.geoPointValue.latitude)===it(o.geoPointValue.latitude)&&it(s.geoPointValue.longitude)===it(o.geoPointValue.longitude)})(n,t);case 2:return(function(s,o){if("integerValue"in s&&"integerValue"in o)return it(s.integerValue)===it(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const c=it(s.doubleValue),l=it(o.doubleValue);return c===l?sr(c)===sr(l):isNaN(c)&&isNaN(l)}return!1})(n,t);case 9:return Pe(n.arrayValue.values||[],t.arrayValue.values||[],Mt);case 10:case 11:return(function(s,o){const c=s.mapValue.fields||{},l=o.mapValue.fields||{};if(ia(c)!==ia(l))return!1;for(const f in c)if(c.hasOwnProperty(f)&&(l[f]===void 0||!Mt(c[f],l[f])))return!1;return!0})(n,t);default:return x(52216,{left:n})}}function pn(n,t){return(n.values||[]).find((e=>Mt(e,t)))!==void 0}function De(n,t){if(n===t)return 0;const e=ye(n),r=ye(t);if(e!==r)return B(e,r);switch(e){case 0:case 9007199254740991:return 0;case 1:return B(n.booleanValue,t.booleanValue);case 2:return(function(o,c){const l=it(o.integerValue||o.doubleValue),f=it(c.integerValue||c.doubleValue);return l<f?-1:l>f?1:l===f?0:isNaN(l)?isNaN(f)?0:-1:1})(n,t);case 3:return oa(n.timestampValue,t.timestampValue);case 4:return oa(or(n),or(t));case 5:return Ti(n.stringValue,t.stringValue);case 6:return(function(o,c){const l=Ve(o),f=Ve(c);return l.compareTo(f)})(n.bytesValue,t.bytesValue);case 7:return(function(o,c){const l=o.split("/"),f=c.split("/");for(let d=0;d<l.length&&d<f.length;d++){const v=B(l[d],f[d]);if(v!==0)return v}return B(l.length,f.length)})(n.referenceValue,t.referenceValue);case 8:return(function(o,c){const l=B(it(o.latitude),it(c.latitude));return l!==0?l:B(it(o.longitude),it(c.longitude))})(n.geoPointValue,t.geoPointValue);case 9:return aa(n.arrayValue,t.arrayValue);case 10:return(function(o,c){const l=o.fields||{},f=c.fields||{},d=l[vi]?.arrayValue,v=f[vi]?.arrayValue,A=B(d?.values?.length||0,v?.values?.length||0);return A!==0?A:aa(d,v)})(n.mapValue,t.mapValue);case 11:return(function(o,c){if(o===Kn.mapValue&&c===Kn.mapValue)return 0;if(o===Kn.mapValue)return 1;if(c===Kn.mapValue)return-1;const l=o.fields||{},f=Object.keys(l),d=c.fields||{},v=Object.keys(d);f.sort(),v.sort();for(let A=0;A<f.length&&A<v.length;++A){const b=Ti(f[A],v[A]);if(b!==0)return b;const P=De(l[f[A]],d[v[A]]);if(P!==0)return P}return B(f.length,v.length)})(n.mapValue,t.mapValue);default:throw x(23264,{he:e})}}function oa(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return B(n,t);const e=_e(n),r=_e(t),s=B(e.seconds,r.seconds);return s!==0?s:B(e.nanos,r.nanos)}function aa(n,t){const e=n.values||[],r=t.values||[];for(let s=0;s<e.length&&s<r.length;++s){const o=De(e[s],r[s]);if(o)return o}return B(e.length,r.length)}function ke(n){return Ii(n)}function Ii(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(e){const r=_e(e);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(e){return Ve(e).toBase64()})(n.bytesValue):"referenceValue"in n?(function(e){return M.fromName(e).toString()})(n.referenceValue):"geoPointValue"in n?(function(e){return`geo(${e.latitude},${e.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(e){let r="[",s=!0;for(const o of e.values||[])s?s=!1:r+=",",r+=Ii(o);return r+"]"})(n.arrayValue):"mapValue"in n?(function(e){const r=Object.keys(e.fields||{}).sort();let s="{",o=!0;for(const c of r)o?o=!1:s+=",",s+=`${c}:${Ii(e.fields[c])}`;return s+"}"})(n.mapValue):x(61005,{value:n})}function Yn(n){switch(ye(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=ss(n);return t?16+Yn(t):16;case 5:return 2*n.stringValue.length;case 6:return Ve(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,o)=>s+Yn(o)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return xe(r.fields,((o,c)=>{s+=o.length+Yn(c)})),s})(n.mapValue);default:throw x(13486,{value:n})}}function Ai(n){return!!n&&"integerValue"in n}function os(n){return!!n&&"arrayValue"in n}function Jn(n){return!!n&&"mapValue"in n}function kp(n){return(n?.mapValue?.fields||{})[Lc]?.stringValue===Fc}function sn(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const t={mapValue:{fields:{}}};return xe(n.mapValue.fields,((e,r)=>t.mapValue.fields[e]=sn(r))),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=sn(n.arrayValue.values[e]);return t}return{...n}}function Np(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Dp}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(t){this.value=t}static empty(){return new Ct({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let r=0;r<t.length-1;++r)if(e=(e.mapValue.fields||{})[t.get(r)],!Jn(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=sn(e)}setAll(t){let e=st.emptyPath(),r={},s=[];t.forEach(((c,l)=>{if(!e.isImmediateParentOf(l)){const f=this.getFieldsMap(e);this.applyChanges(f,r,s),r={},s=[],e=l.popLast()}c?r[l.lastSegment()]=sn(c):s.push(l.lastSegment())}));const o=this.getFieldsMap(e);this.applyChanges(o,r,s)}delete(t){const e=this.field(t.popLast());Jn(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return Mt(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let r=0;r<t.length;++r){let s=e.mapValue.fields[t.get(r)];Jn(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(r)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,r){xe(e,((s,o)=>t[s]=o));for(const s of r)delete t[s]}clone(){return new Ct(sn(this.value))}}function Uc(n){const t=[];return xe(n.fields,((e,r)=>{const s=new st([e]);if(Jn(r)){const o=Uc(r.mapValue).fields;if(o.length===0)t.push(s);else for(const c of o)t.push(s.child(c))}else t.push(s)})),new Vt(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt{constructor(t,e,r,s,o,c,l){this.key=t,this.documentType=e,this.version=r,this.readTime=s,this.createTime=o,this.data=c,this.documentState=l}static newInvalidDocument(t){return new Rt(t,0,G.min(),G.min(),G.min(),Ct.empty(),0)}static newFoundDocument(t,e,r,s){return new Rt(t,1,e,G.min(),r,s,0)}static newNoDocument(t,e){return new Rt(t,2,e,G.min(),G.min(),Ct.empty(),0)}static newUnknownDocument(t,e){return new Rt(t,3,e,G.min(),G.min(),Ct.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=Ct.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=Ct.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof Rt&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new Rt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur{constructor(t,e){this.position=t,this.inclusive=e}}function ca(n,t,e){let r=0;for(let s=0;s<n.position.length;s++){const o=t[s],c=n.position[s];if(o.field.isKeyField()?r=M.comparator(M.fromName(c.referenceValue),e.key):r=De(c,e.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function ua(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!Mt(n.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(t,e="asc"){this.field=t,this.dir=e}}function Op(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bc{}class et extends Bc{constructor(t,e,r){super(),this.field=t,this.op=e,this.value=r}static create(t,e,r){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,r):new xp(t,e,r):e==="array-contains"?new Up(t,r):e==="in"?new Bp(t,r):e==="not-in"?new jp(t,r):e==="array-contains-any"?new $p(t,r):new et(t,e,r)}static createKeyFieldInFilter(t,e,r){return e==="in"?new Lp(t,r):new Fp(t,r)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(De(e,this.value)):e!==null&&ye(this.value)===ye(e)&&this.matchesComparison(De(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return x(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Zt extends Bc{constructor(t,e){super(),this.filters=t,this.op=e,this.Pe=null}static create(t,e){return new Zt(t,e)}matches(t){return jc(this)?this.filters.find((e=>!e.matches(t)))===void 0:this.filters.find((e=>e.matches(t)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((t,e)=>t.concat(e.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function jc(n){return n.op==="and"}function $c(n){return Mp(n)&&jc(n)}function Mp(n){for(const t of n.filters)if(t instanceof Zt)return!1;return!0}function bi(n){if(n instanceof et)return n.field.canonicalString()+n.op.toString()+ke(n.value);if($c(n))return n.filters.map((t=>bi(t))).join(",");{const t=n.filters.map((e=>bi(e))).join(",");return`${n.op}(${t})`}}function qc(n,t){return n instanceof et?(function(r,s){return s instanceof et&&r.op===s.op&&r.field.isEqual(s.field)&&Mt(r.value,s.value)})(n,t):n instanceof Zt?(function(r,s){return s instanceof Zt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((o,c,l)=>o&&qc(c,s.filters[l])),!0):!1})(n,t):void x(19439)}function zc(n){return n instanceof et?(function(e){return`${e.field.canonicalString()} ${e.op} ${ke(e.value)}`})(n):n instanceof Zt?(function(e){return e.op.toString()+" {"+e.getFilters().map(zc).join(" ,")+"}"})(n):"Filter"}class xp extends et{constructor(t,e,r){super(t,e,r),this.key=M.fromName(r.referenceValue)}matches(t){const e=M.comparator(t.key,this.key);return this.matchesComparison(e)}}class Lp extends et{constructor(t,e){super(t,"in",e),this.keys=Hc("in",e)}matches(t){return this.keys.some((e=>e.isEqual(t.key)))}}class Fp extends et{constructor(t,e){super(t,"not-in",e),this.keys=Hc("not-in",e)}matches(t){return!this.keys.some((e=>e.isEqual(t.key)))}}function Hc(n,t){return(t.arrayValue?.values||[]).map((e=>M.fromName(e.referenceValue)))}class Up extends et{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return os(e)&&pn(e.arrayValue,this.value)}}class Bp extends et{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&pn(this.value.arrayValue,e)}}class jp extends et{constructor(t,e){super(t,"not-in",e)}matches(t){if(pn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!pn(this.value.arrayValue,e)}}class $p extends et{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!os(e)||!e.arrayValue.values)&&e.arrayValue.values.some((r=>pn(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qp{constructor(t,e=null,r=[],s=[],o=null,c=null,l=null){this.path=t,this.collectionGroup=e,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=c,this.endAt=l,this.Te=null}}function la(n,t=null,e=[],r=[],s=null,o=null,c=null){return new qp(n,t,e,r,s,o,c)}function as(n){const t=z(n);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map((r=>bi(r))).join(","),e+="|ob:",e+=t.orderBy.map((r=>(function(o){return o.field.canonicalString()+o.dir})(r))).join(","),rs(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map((r=>ke(r))).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map((r=>ke(r))).join(",")),t.Te=e}return t.Te}function cs(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!Op(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!qc(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!ua(n.startAt,t.startAt)&&ua(n.endAt,t.endAt)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wr{constructor(t,e=null,r=[],s=[],o=null,c="F",l=null,f=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=c,this.startAt=l,this.endAt=f,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function zp(n,t,e,r,s,o,c,l){return new wr(n,t,e,r,s,o,c,l)}function Hp(n){return new wr(n)}function ha(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Kp(n){return n.collectionGroup!==null}function on(n){const t=z(n);if(t.Ie===null){t.Ie=[];const e=new Set;for(const o of t.explicitOrderBy)t.Ie.push(o),e.add(o.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(c){let l=new ot(st.comparator);return c.filters.forEach((f=>{f.getFlattenedFilters().forEach((d=>{d.isInequality()&&(l=l.add(d.field))}))})),l})(t).forEach((o=>{e.has(o.canonicalString())||o.isKeyField()||t.Ie.push(new lr(o,r))})),e.has(st.keyField().canonicalString())||t.Ie.push(new lr(st.keyField(),r))}return t.Ie}function he(n){const t=z(n);return t.Ee||(t.Ee=Gp(t,on(n))),t.Ee}function Gp(n,t){if(n.limitType==="F")return la(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map((s=>{const o=s.dir==="desc"?"asc":"desc";return new lr(s.field,o)}));const e=n.endAt?new ur(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new ur(n.startAt.position,n.startAt.inclusive):null;return la(n.path,n.collectionGroup,t,n.filters,n.limit,e,r)}}function Si(n,t,e){return new wr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function Kc(n,t){return cs(he(n),he(t))&&n.limitType===t.limitType}function Gc(n){return`${as(he(n))}|lt:${n.limitType}`}function tn(n){return`Query(target=${(function(e){let r=e.path.canonicalString();return e.collectionGroup!==null&&(r+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(r+=`, filters: [${e.filters.map((s=>zc(s))).join(", ")}]`),rs(e.limit)||(r+=", limit: "+e.limit),e.orderBy.length>0&&(r+=`, orderBy: [${e.orderBy.map((s=>(function(c){return`${c.field.canonicalString()} (${c.dir})`})(s))).join(", ")}]`),e.startAt&&(r+=", startAt: ",r+=e.startAt.inclusive?"b:":"a:",r+=e.startAt.position.map((s=>ke(s))).join(",")),e.endAt&&(r+=", endAt: ",r+=e.endAt.inclusive?"a:":"b:",r+=e.endAt.position.map((s=>ke(s))).join(",")),`Target(${r})`})(he(n))}; limitType=${n.limitType})`}function us(n,t){return t.isFoundDocument()&&(function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):M.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)})(n,t)&&(function(r,s){for(const o of on(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0})(n,t)&&(function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0})(n,t)&&(function(r,s){return!(r.startAt&&!(function(c,l,f){const d=ca(c,l,f);return c.inclusive?d<=0:d<0})(r.startAt,on(r),s)||r.endAt&&!(function(c,l,f){const d=ca(c,l,f);return c.inclusive?d>=0:d>0})(r.endAt,on(r),s))})(n,t)}function Wp(n){return(t,e)=>{let r=!1;for(const s of on(n)){const o=Qp(s,t,e);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function Qp(n,t,e){const r=n.field.isKeyField()?M.comparator(t.key,e.key):(function(o,c,l){const f=c.data.field(o),d=l.data.field(o);return f!==null&&d!==null?De(f,d):x(42886)})(n.field,t,e);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return x(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,t))return o}}has(t){return this.get(t)!==void 0}set(t,e){const r=this.mapKeyFn(t),s=this.inner[r];if(s===void 0)return this.inner[r]=[[t,e]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],t))return void(s[o]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return r.length===1?delete this.inner[e]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(t){xe(this.inner,((e,r)=>{for(const[s,o]of r)t(s,o)}))}isEmpty(){return kc(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xp=new wt(M.comparator);function hr(){return Xp}const Wc=new wt(M.comparator);function Gn(...n){let t=Wc;for(const e of n)t=t.insert(e.key,e);return t}function Qc(n){let t=Wc;return n.forEach(((e,r)=>t=t.insert(e,r.overlayedDocument))),t}function ue(){return an()}function Xc(){return an()}function an(){return new Ee((n=>n.toString()),((n,t)=>n.isEqual(t)))}const Yp=new wt(M.comparator),Jp=new ot(M.comparator);function dt(...n){let t=Jp;for(const e of n)t=t.add(e);return t}const Zp=new ot(B);function tm(){return Zp}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ls(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:sr(t)?"-0":t}}function Yc(n){return{integerValue:""+n}}function em(n,t){return bp(t)?Yc(t):ls(n,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr{constructor(){this._=void 0}}function nm(n,t,e){return n instanceof fr?(function(s,o){const c={fields:{[Oc]:{stringValue:Nc},[xc]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&is(o)&&(o=ss(o)),o&&(c.fields[Mc]=o),{mapValue:c}})(e,t):n instanceof mn?Zc(n,t):n instanceof gn?tu(n,t):(function(s,o){const c=Jc(s,o),l=fa(c)+fa(s.Ae);return Ai(c)&&Ai(s.Ae)?Yc(l):ls(s.serializer,l)})(n,t)}function rm(n,t,e){return n instanceof mn?Zc(n,t):n instanceof gn?tu(n,t):e}function Jc(n,t){return n instanceof dr?(function(r){return Ai(r)||(function(o){return!!o&&"doubleValue"in o})(r)})(t)?t:{integerValue:0}:null}class fr extends vr{}class mn extends vr{constructor(t){super(),this.elements=t}}function Zc(n,t){const e=eu(t);for(const r of n.elements)e.some((s=>Mt(s,r)))||e.push(r);return{arrayValue:{values:e}}}class gn extends vr{constructor(t){super(),this.elements=t}}function tu(n,t){let e=eu(t);for(const r of n.elements)e=e.filter((s=>!Mt(s,r)));return{arrayValue:{values:e}}}class dr extends vr{constructor(t,e){super(),this.serializer=t,this.Ae=e}}function fa(n){return it(n.integerValue||n.doubleValue)}function eu(n){return os(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function im(n,t){return n.field.isEqual(t.field)&&(function(r,s){return r instanceof mn&&s instanceof mn||r instanceof gn&&s instanceof gn?Pe(r.elements,s.elements,Mt):r instanceof dr&&s instanceof dr?Mt(r.Ae,s.Ae):r instanceof fr&&s instanceof fr})(n.transform,t.transform)}class sm{constructor(t,e){this.version=t,this.transformResults=e}}class jt{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new jt}static exists(t){return new jt(void 0,t)}static updateTime(t){return new jt(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Zn(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class Ir{}function nu(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new iu(n.key,jt.none()):new wn(n.key,n.data,jt.none());{const e=n.data,r=Ct.empty();let s=new ot(st.comparator);for(let o of t.fields)if(!s.has(o)){let c=e.field(o);c===null&&o.length>1&&(o=o.popLast(),c=e.field(o)),c===null?r.delete(o):r.set(o,c),s=s.add(o)}return new Te(n.key,r,new Vt(s.toArray()),jt.none())}}function om(n,t,e){n instanceof wn?(function(s,o,c){const l=s.value.clone(),f=pa(s.fieldTransforms,o,c.transformResults);l.setAll(f),o.convertToFoundDocument(c.version,l).setHasCommittedMutations()})(n,t,e):n instanceof Te?(function(s,o,c){if(!Zn(s.precondition,o))return void o.convertToUnknownDocument(c.version);const l=pa(s.fieldTransforms,o,c.transformResults),f=o.data;f.setAll(ru(s)),f.setAll(l),o.convertToFoundDocument(c.version,f).setHasCommittedMutations()})(n,t,e):(function(s,o,c){o.convertToNoDocument(c.version).setHasCommittedMutations()})(0,t,e)}function cn(n,t,e,r){return n instanceof wn?(function(o,c,l,f){if(!Zn(o.precondition,c))return l;const d=o.value.clone(),v=ma(o.fieldTransforms,f,c);return d.setAll(v),c.convertToFoundDocument(c.version,d).setHasLocalMutations(),null})(n,t,e,r):n instanceof Te?(function(o,c,l,f){if(!Zn(o.precondition,c))return l;const d=ma(o.fieldTransforms,f,c),v=c.data;return v.setAll(ru(o)),v.setAll(d),c.convertToFoundDocument(c.version,v).setHasLocalMutations(),l===null?null:l.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map((A=>A.field)))})(n,t,e,r):(function(o,c,l){return Zn(o.precondition,c)?(c.convertToNoDocument(c.version).setHasLocalMutations(),null):l})(n,t,e)}function am(n,t){let e=null;for(const r of n.fieldTransforms){const s=t.data.field(r.field),o=Jc(r.transform,s||null);o!=null&&(e===null&&(e=Ct.empty()),e.set(r.field,o))}return e||null}function da(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Pe(r,s,((o,c)=>im(o,c)))})(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class wn extends Ir{constructor(t,e,r,s=[]){super(),this.key=t,this.value=e,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Te extends Ir{constructor(t,e,r,s,o=[]){super(),this.key=t,this.data=e,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function ru(n){const t=new Map;return n.fieldMask.fields.forEach((e=>{if(!e.isEmpty()){const r=n.data.field(e);t.set(e,r)}})),t}function pa(n,t,e){const r=new Map;X(n.length===e.length,32656,{Re:e.length,Ve:n.length});for(let s=0;s<e.length;s++){const o=n[s],c=o.transform,l=t.data.field(o.field);r.set(o.field,rm(c,l,e[s]))}return r}function ma(n,t,e){const r=new Map;for(const s of n){const o=s.transform,c=e.data.field(s.field);r.set(s.field,nm(o,c,t))}return r}class iu extends Ir{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class cm extends Ir{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class um{constructor(t,e,r,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(t,e){const r=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(t.key)&&om(o,t,r[s])}}applyToLocalView(t,e){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(e=cn(r,t,e,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(e=cn(r,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const r=Xc();return this.mutations.forEach((s=>{const o=t.get(s.key),c=o.overlayedDocument;let l=this.applyToLocalView(c,o.mutatedFields);l=e.has(s.key)?null:l;const f=nu(c,l);f!==null&&r.set(s.key,f),c.isValidDocument()||c.convertToNoDocument(G.min())})),r}keys(){return this.mutations.reduce(((t,e)=>t.add(e.key)),dt())}isEqual(t){return this.batchId===t.batchId&&Pe(this.mutations,t.mutations,((e,r)=>da(e,r)))&&Pe(this.baseMutations,t.baseMutations,((e,r)=>da(e,r)))}}class hs{constructor(t,e,r,s){this.batch=t,this.commitVersion=e,this.mutationResults=r,this.docVersions=s}static from(t,e,r){X(t.mutations.length===r.length,58842,{me:t.mutations.length,fe:r.length});let s=(function(){return Yp})();const o=t.mutations;for(let c=0;c<o.length;c++)s=s.insert(o[c].key,r[c].version);return new hs(t,e,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lm{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var J,L;function hm(n){switch(n){case R.OK:return x(64938);case R.CANCELLED:case R.UNKNOWN:case R.DEADLINE_EXCEEDED:case R.RESOURCE_EXHAUSTED:case R.INTERNAL:case R.UNAVAILABLE:case R.UNAUTHENTICATED:return!1;case R.INVALID_ARGUMENT:case R.NOT_FOUND:case R.ALREADY_EXISTS:case R.PERMISSION_DENIED:case R.FAILED_PRECONDITION:case R.ABORTED:case R.OUT_OF_RANGE:case R.UNIMPLEMENTED:case R.DATA_LOSS:return!0;default:return x(15467,{code:n})}}function fm(n){if(n===void 0)return ge("GRPC error has no .code"),R.UNKNOWN;switch(n){case J.OK:return R.OK;case J.CANCELLED:return R.CANCELLED;case J.UNKNOWN:return R.UNKNOWN;case J.DEADLINE_EXCEEDED:return R.DEADLINE_EXCEEDED;case J.RESOURCE_EXHAUSTED:return R.RESOURCE_EXHAUSTED;case J.INTERNAL:return R.INTERNAL;case J.UNAVAILABLE:return R.UNAVAILABLE;case J.UNAUTHENTICATED:return R.UNAUTHENTICATED;case J.INVALID_ARGUMENT:return R.INVALID_ARGUMENT;case J.NOT_FOUND:return R.NOT_FOUND;case J.ALREADY_EXISTS:return R.ALREADY_EXISTS;case J.PERMISSION_DENIED:return R.PERMISSION_DENIED;case J.FAILED_PRECONDITION:return R.FAILED_PRECONDITION;case J.ABORTED:return R.ABORTED;case J.OUT_OF_RANGE:return R.OUT_OF_RANGE;case J.UNIMPLEMENTED:return R.UNIMPLEMENTED;case J.DATA_LOSS:return R.DATA_LOSS;default:return x(39323,{code:n})}}(L=J||(J={}))[L.OK=0]="OK",L[L.CANCELLED=1]="CANCELLED",L[L.UNKNOWN=2]="UNKNOWN",L[L.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",L[L.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",L[L.NOT_FOUND=5]="NOT_FOUND",L[L.ALREADY_EXISTS=6]="ALREADY_EXISTS",L[L.PERMISSION_DENIED=7]="PERMISSION_DENIED",L[L.UNAUTHENTICATED=16]="UNAUTHENTICATED",L[L.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",L[L.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",L[L.ABORTED=10]="ABORTED",L[L.OUT_OF_RANGE=11]="OUT_OF_RANGE",L[L.UNIMPLEMENTED=12]="UNIMPLEMENTED",L[L.INTERNAL=13]="INTERNAL",L[L.UNAVAILABLE=14]="UNAVAILABLE",L[L.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Xi([4294967295,4294967295],0);class dm{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Ri(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function pm(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function mm(n,t){return Ri(n,t.toTimestamp())}function Re(n){return X(!!n,49232),G.fromTimestamp((function(e){const r=_e(e);return new W(r.seconds,r.nanos)})(n))}function su(n,t){return Ci(n,t).canonicalString()}function Ci(n,t){const e=(function(s){return new Y(["projects",s.projectId,"databases",s.database])})(n).child("documents");return t===void 0?e:e.child(t)}function gm(n){const t=Y.fromString(n);return X(Am(t),10190,{key:t.toString()}),t}function Pi(n,t){return su(n.databaseId,t.path)}function _m(n){const t=gm(n);return t.length===4?Y.emptyPath():Em(t)}function ym(n){return new Y(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Em(n){return X(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function ga(n,t,e){return{name:Pi(n,t),fields:e.value.mapValue.fields}}function Tm(n,t){let e;if(t instanceof wn)e={update:ga(n,t.key,t.value)};else if(t instanceof iu)e={delete:Pi(n,t.key)};else if(t instanceof Te)e={update:ga(n,t.key,t.data),updateMask:Im(t.fieldMask)};else{if(!(t instanceof cm))return x(16599,{Vt:t.type});e={verify:Pi(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map((r=>(function(o,c){const l=c.transform;if(l instanceof fr)return{fieldPath:c.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof mn)return{fieldPath:c.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof gn)return{fieldPath:c.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof dr)return{fieldPath:c.field.canonicalString(),increment:l.Ae};throw x(20930,{transform:c.transform})})(0,r)))),t.precondition.isNone||(e.currentDocument=(function(s,o){return o.updateTime!==void 0?{updateTime:mm(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:x(27497)})(n,t.precondition)),e}function wm(n,t){return n&&n.length>0?(X(t!==void 0,14353),n.map((e=>(function(s,o){let c=s.updateTime?Re(s.updateTime):Re(o);return c.isEqual(G.min())&&(c=Re(o)),new sm(c,s.transformResults||[])})(e,t)))):[]}function vm(n){let t=_m(n.parent);const e=n.structuredQuery,r=e.from?e.from.length:0;let s=null;if(r>0){X(r===1,65062);const v=e.from[0];v.allDescendants?s=v.collectionId:t=t.child(v.collectionId)}let o=[];e.where&&(o=(function(A){const b=ou(A);return b instanceof Zt&&$c(b)?b.getFilters():[b]})(e.where));let c=[];e.orderBy&&(c=(function(A){return A.map((b=>(function(V){return new lr(Se(V.field),(function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(V.direction))})(b)))})(e.orderBy));let l=null;e.limit&&(l=(function(A){let b;return b=typeof A=="object"?A.value:A,rs(b)?null:b})(e.limit));let f=null;e.startAt&&(f=(function(A){const b=!!A.before,P=A.values||[];return new ur(P,b)})(e.startAt));let d=null;return e.endAt&&(d=(function(A){const b=!A.before,P=A.values||[];return new ur(P,b)})(e.endAt)),zp(t,s,c,o,l,"F",f,d)}function ou(n){return n.unaryFilter!==void 0?(function(e){switch(e.unaryFilter.op){case"IS_NAN":const r=Se(e.unaryFilter.field);return et.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Se(e.unaryFilter.field);return et.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Se(e.unaryFilter.field);return et.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const c=Se(e.unaryFilter.field);return et.create(c,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return x(61313);default:return x(60726)}})(n):n.fieldFilter!==void 0?(function(e){return et.create(Se(e.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return x(58110);default:return x(50506)}})(e.fieldFilter.op),e.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(e){return Zt.create(e.compositeFilter.filters.map((r=>ou(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return x(1026)}})(e.compositeFilter.op))})(n):x(30097,{filter:n})}function Se(n){return st.fromServerFormat(n.fieldPath)}function Im(n){const t=[];return n.fields.forEach((e=>t.push(e.canonicalString()))),{fieldPaths:t}}function Am(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bm{constructor(t){this.yt=t}}function Sm(n){const t=vm({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Si(t,t.limit,"L"):t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rm{constructor(){this.Cn=new Cm}addToCollectionParentIndex(t,e){return this.Cn.add(e),S.resolve()}getCollectionParents(t,e){return S.resolve(this.Cn.getEntries(e))}addFieldIndex(t,e){return S.resolve()}deleteFieldIndex(t,e){return S.resolve()}deleteAllFieldIndexes(t){return S.resolve()}createTargetIndexes(t,e){return S.resolve()}getDocumentsMatchingTarget(t,e){return S.resolve(null)}getIndexType(t,e){return S.resolve(0)}getFieldIndexes(t,e){return S.resolve([])}getNextCollectionGroupToUpdate(t){return S.resolve(null)}getMinOffset(t,e){return S.resolve(Jt.min())}getMinOffsetFromCollectionGroup(t,e){return S.resolve(Jt.min())}updateCollectionGroup(t,e,r){return S.resolve()}updateIndexEntries(t,e){return S.resolve()}}class Cm{constructor(){this.index={}}add(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e]||new ot(Y.comparator),o=!s.has(r);return this.index[e]=s.add(r),o}has(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e];return s&&s.has(r)}getEntries(t){return(this.index[t]||new ot(Y.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _a={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},au=41943040;class Et{static withCacheSize(t){return new Et(t,Et.DEFAULT_COLLECTION_PERCENTILE,Et.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,r){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Et.DEFAULT_COLLECTION_PERCENTILE=10,Et.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Et.DEFAULT=new Et(au,Et.DEFAULT_COLLECTION_PERCENTILE,Et.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Et.DISABLED=new Et(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(t){this.ar=t}next(){return this.ar+=2,this.ar}static ur(){return new Ne(0)}static cr(){return new Ne(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ya="LruGarbageCollector",Pm=1048576;function Ea([n,t],[e,r]){const s=B(n,e);return s===0?B(t,r):s}class Vm{constructor(t){this.Ir=t,this.buffer=new ot(Ea),this.Er=0}dr(){return++this.Er}Ar(t){const e=[t,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(e);else{const r=this.buffer.last();Ea(e,r)<0&&(this.buffer=this.buffer.delete(r).add(e))}}get maxValue(){return this.buffer.last()[0]}}class Dm{constructor(t,e,r){this.garbageCollector=t,this.asyncQueue=e,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(t){D(ya,`Garbage collection scheduled in ${t}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Tn(e)?D(ya,"Ignoring IndexedDB error during garbage collection: ",e):await ts(e)}await this.Vr(3e5)}))}}class km{constructor(t,e){this.mr=t,this.params=e}calculateTargetCount(t,e){return this.mr.gr(t).next((r=>Math.floor(e/100*r)))}nthSequenceNumber(t,e){if(e===0)return S.resolve(es.ce);const r=new Vm(e);return this.mr.forEachTarget(t,(s=>r.Ar(s.sequenceNumber))).next((()=>this.mr.pr(t,(s=>r.Ar(s))))).next((()=>r.maxValue))}removeTargets(t,e,r){return this.mr.removeTargets(t,e,r)}removeOrphanedDocuments(t,e){return this.mr.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(D("LruGarbageCollector","Garbage collection skipped; disabled"),S.resolve(_a)):this.getCacheSize(t).next((r=>r<this.params.cacheSizeCollectionThreshold?(D("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),_a):this.yr(t,e)))}getCacheSize(t){return this.mr.getCacheSize(t)}yr(t,e){let r,s,o,c,l,f,d;const v=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next((A=>(A>this.params.maximumSequenceNumbersToCollect?(D("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${A}`),s=this.params.maximumSequenceNumbersToCollect):s=A,c=Date.now(),this.nthSequenceNumber(t,s)))).next((A=>(r=A,l=Date.now(),this.removeTargets(t,r,e)))).next((A=>(o=A,f=Date.now(),this.removeOrphanedDocuments(t,r)))).next((A=>(d=Date.now(),be()<=F.DEBUG&&D("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${c-v}ms
	Determined least recently used ${s} in `+(l-c)+`ms
	Removed ${o} targets in `+(f-l)+`ms
	Removed ${A} documents in `+(d-f)+`ms
Total Duration: ${d-v}ms`),S.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:A}))))}}function Nm(n,t){return new km(n,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Om{constructor(){this.changes=new Ee((t=>t.toString()),((t,e)=>t.isEqual(e))),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,Rt.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const r=this.changes.get(e);return r!==void 0?S.resolve(r):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mm{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xm{constructor(t,e,r,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=r,this.indexManager=s}getDocument(t,e){let r=null;return this.documentOverlayCache.getOverlay(t,e).next((s=>(r=s,this.remoteDocumentCache.getEntry(t,e)))).next((s=>(r!==null&&cn(r.mutation,s,Vt.empty(),W.now()),s)))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next((r=>this.getLocalViewOfDocuments(t,r,dt()).next((()=>r))))}getLocalViewOfDocuments(t,e,r=dt()){const s=ue();return this.populateOverlays(t,s,e).next((()=>this.computeViews(t,e,s,r).next((o=>{let c=Gn();return o.forEach(((l,f)=>{c=c.insert(l,f.overlayedDocument)})),c}))))}getOverlayedDocuments(t,e){const r=ue();return this.populateOverlays(t,r,e).next((()=>this.computeViews(t,e,r,dt())))}populateOverlays(t,e,r){const s=[];return r.forEach((o=>{e.has(o)||s.push(o)})),this.documentOverlayCache.getOverlays(t,s).next((o=>{o.forEach(((c,l)=>{e.set(c,l)}))}))}computeViews(t,e,r,s){let o=hr();const c=an(),l=(function(){return an()})();return e.forEach(((f,d)=>{const v=r.get(d.key);s.has(d.key)&&(v===void 0||v.mutation instanceof Te)?o=o.insert(d.key,d):v!==void 0?(c.set(d.key,v.mutation.getFieldMask()),cn(v.mutation,d,v.mutation.getFieldMask(),W.now())):c.set(d.key,Vt.empty())})),this.recalculateAndSaveOverlays(t,o).next((f=>(f.forEach(((d,v)=>c.set(d,v))),e.forEach(((d,v)=>l.set(d,new Mm(v,c.get(d)??null)))),l)))}recalculateAndSaveOverlays(t,e){const r=an();let s=new wt(((c,l)=>c-l)),o=dt();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next((c=>{for(const l of c)l.keys().forEach((f=>{const d=e.get(f);if(d===null)return;let v=r.get(f)||Vt.empty();v=l.applyToLocalView(d,v),r.set(f,v);const A=(s.get(l.batchId)||dt()).add(f);s=s.insert(l.batchId,A)}))})).next((()=>{const c=[],l=s.getReverseIterator();for(;l.hasNext();){const f=l.getNext(),d=f.key,v=f.value,A=Xc();v.forEach((b=>{if(!o.has(b)){const P=nu(e.get(b),r.get(b));P!==null&&A.set(b,P),o=o.add(b)}})),c.push(this.documentOverlayCache.saveOverlays(t,d,A))}return S.waitFor(c)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next((r=>this.recalculateAndSaveOverlays(t,r)))}getDocumentsMatchingQuery(t,e,r,s){return(function(c){return M.isDocumentKey(c.path)&&c.collectionGroup===null&&c.filters.length===0})(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):Kp(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,r,s):this.getDocumentsMatchingCollectionQuery(t,e,r,s)}getNextDocuments(t,e,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,r,s).next((o=>{const c=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,r.largestBatchId,s-o.size):S.resolve(ue());let l=dn,f=o;return c.next((d=>S.forEach(d,((v,A)=>(l<A.largestBatchId&&(l=A.largestBatchId),o.get(v)?S.resolve():this.remoteDocumentCache.getEntry(t,v).next((b=>{f=f.insert(v,b)}))))).next((()=>this.populateOverlays(t,d,o))).next((()=>this.computeViews(t,f,d,dt()))).next((v=>({batchId:l,changes:Qc(v)})))))}))}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new M(e)).next((r=>{let s=Gn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(t,e,r,s){const o=e.collectionGroup;let c=Gn();return this.indexManager.getCollectionParents(t,o).next((l=>S.forEach(l,(f=>{const d=(function(A,b){return new wr(b,null,A.explicitOrderBy.slice(),A.filters.slice(),A.limit,A.limitType,A.startAt,A.endAt)})(e,f.child(o));return this.getDocumentsMatchingCollectionQuery(t,d,r,s).next((v=>{v.forEach(((A,b)=>{c=c.insert(A,b)}))}))})).next((()=>c))))}getDocumentsMatchingCollectionQuery(t,e,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,r.largestBatchId).next((c=>(o=c,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,r,o,s)))).next((c=>{o.forEach(((f,d)=>{const v=d.getKey();c.get(v)===null&&(c=c.insert(v,Rt.newInvalidDocument(v)))}));let l=Gn();return c.forEach(((f,d)=>{const v=o.get(f);v!==void 0&&cn(v.mutation,d,Vt.empty(),W.now()),us(e,d)&&(l=l.insert(f,d))})),l}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(t){this.serializer=t,this.Lr=new Map,this.kr=new Map}getBundleMetadata(t,e){return S.resolve(this.Lr.get(e))}saveBundleMetadata(t,e){return this.Lr.set(e.id,(function(s){return{id:s.id,version:s.version,createTime:Re(s.createTime)}})(e)),S.resolve()}getNamedQuery(t,e){return S.resolve(this.kr.get(e))}saveNamedQuery(t,e){return this.kr.set(e.name,(function(s){return{name:s.name,query:Sm(s.bundledQuery),readTime:Re(s.readTime)}})(e)),S.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fm{constructor(){this.overlays=new wt(M.comparator),this.qr=new Map}getOverlay(t,e){return S.resolve(this.overlays.get(e))}getOverlays(t,e){const r=ue();return S.forEach(e,(s=>this.getOverlay(t,s).next((o=>{o!==null&&r.set(s,o)})))).next((()=>r))}saveOverlays(t,e,r){return r.forEach(((s,o)=>{this.St(t,e,o)})),S.resolve()}removeOverlaysForBatchId(t,e,r){const s=this.qr.get(r);return s!==void 0&&(s.forEach((o=>this.overlays=this.overlays.remove(o))),this.qr.delete(r)),S.resolve()}getOverlaysForCollection(t,e,r){const s=ue(),o=e.length+1,c=new M(e.child("")),l=this.overlays.getIteratorFrom(c);for(;l.hasNext();){const f=l.getNext().value,d=f.getKey();if(!e.isPrefixOf(d.path))break;d.path.length===o&&f.largestBatchId>r&&s.set(f.getKey(),f)}return S.resolve(s)}getOverlaysForCollectionGroup(t,e,r,s){let o=new wt(((d,v)=>d-v));const c=this.overlays.getIterator();for(;c.hasNext();){const d=c.getNext().value;if(d.getKey().getCollectionGroup()===e&&d.largestBatchId>r){let v=o.get(d.largestBatchId);v===null&&(v=ue(),o=o.insert(d.largestBatchId,v)),v.set(d.getKey(),d)}}const l=ue(),f=o.getIterator();for(;f.hasNext()&&(f.getNext().value.forEach(((d,v)=>l.set(d,v))),!(l.size()>=s)););return S.resolve(l)}St(t,e,r){const s=this.overlays.get(r.key);if(s!==null){const c=this.qr.get(s.largestBatchId).delete(r.key);this.qr.set(s.largestBatchId,c)}this.overlays=this.overlays.insert(r.key,new lm(e,r));let o=this.qr.get(e);o===void 0&&(o=dt(),this.qr.set(e,o)),this.qr.set(e,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(){this.sessionToken=Ot.EMPTY_BYTE_STRING}getSessionToken(t){return S.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,S.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fs{constructor(){this.Qr=new ot(tt.$r),this.Ur=new ot(tt.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(t,e){const r=new tt(t,e);this.Qr=this.Qr.add(r),this.Ur=this.Ur.add(r)}Wr(t,e){t.forEach((r=>this.addReference(r,e)))}removeReference(t,e){this.Gr(new tt(t,e))}zr(t,e){t.forEach((r=>this.removeReference(r,e)))}jr(t){const e=new M(new Y([])),r=new tt(e,t),s=new tt(e,t+1),o=[];return this.Ur.forEachInRange([r,s],(c=>{this.Gr(c),o.push(c.key)})),o}Jr(){this.Qr.forEach((t=>this.Gr(t)))}Gr(t){this.Qr=this.Qr.delete(t),this.Ur=this.Ur.delete(t)}Hr(t){const e=new M(new Y([])),r=new tt(e,t),s=new tt(e,t+1);let o=dt();return this.Ur.forEachInRange([r,s],(c=>{o=o.add(c.key)})),o}containsKey(t){const e=new tt(t,0),r=this.Qr.firstAfterOrEqual(e);return r!==null&&t.isEqual(r.key)}}class tt{constructor(t,e){this.key=t,this.Yr=e}static $r(t,e){return M.comparator(t.key,e.key)||B(t.Yr,e.Yr)}static Kr(t,e){return B(t.Yr,e.Yr)||M.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.tr=1,this.Zr=new ot(tt.$r)}checkEmpty(t){return S.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,r,s){const o=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const c=new um(o,e,r,s);this.mutationQueue.push(c);for(const l of s)this.Zr=this.Zr.add(new tt(l.key,o)),this.indexManager.addToCollectionParentIndex(t,l.key.path.popLast());return S.resolve(c)}lookupMutationBatch(t,e){return S.resolve(this.Xr(e))}getNextMutationBatchAfterBatchId(t,e){const r=e+1,s=this.ei(r),o=s<0?0:s;return S.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return S.resolve(this.mutationQueue.length===0?ns:this.tr-1)}getAllMutationBatches(t){return S.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const r=new tt(e,0),s=new tt(e,Number.POSITIVE_INFINITY),o=[];return this.Zr.forEachInRange([r,s],(c=>{const l=this.Xr(c.Yr);o.push(l)})),S.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(t,e){let r=new ot(B);return e.forEach((s=>{const o=new tt(s,0),c=new tt(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([o,c],(l=>{r=r.add(l.Yr)}))})),S.resolve(this.ti(r))}getAllMutationBatchesAffectingQuery(t,e){const r=e.path,s=r.length+1;let o=r;M.isDocumentKey(o)||(o=o.child(""));const c=new tt(new M(o),0);let l=new ot(B);return this.Zr.forEachWhile((f=>{const d=f.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(l=l.add(f.Yr)),!0)}),c),S.resolve(this.ti(l))}ti(t){const e=[];return t.forEach((r=>{const s=this.Xr(r);s!==null&&e.push(s)})),e}removeMutationBatch(t,e){X(this.ni(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Zr;return S.forEach(e.mutations,(s=>{const o=new tt(s.key,e.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)})).next((()=>{this.Zr=r}))}ir(t){}containsKey(t,e){const r=new tt(e,0),s=this.Zr.firstAfterOrEqual(r);return S.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,S.resolve()}ni(t,e){return this.ei(t)}ei(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Xr(t){const e=this.ei(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jm{constructor(t){this.ri=t,this.docs=(function(){return new wt(M.comparator)})(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const r=e.key,s=this.docs.get(r),o=s?s.size:0,c=this.ri(e);return this.docs=this.docs.insert(r,{document:e.mutableCopy(),size:c}),this.size+=c-o,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const r=this.docs.get(e);return S.resolve(r?r.document.mutableCopy():Rt.newInvalidDocument(e))}getEntries(t,e){let r=hr();return e.forEach((s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():Rt.newInvalidDocument(s))})),S.resolve(r)}getDocumentsMatchingQuery(t,e,r,s){let o=hr();const c=e.path,l=new M(c.child("__id-9223372036854775808__")),f=this.docs.getIteratorFrom(l);for(;f.hasNext();){const{key:d,value:{document:v}}=f.getNext();if(!c.isPrefixOf(d.path))break;d.path.length>c.length+1||wp(Tp(v),r)<=0||(s.has(v.key)||us(e,v))&&(o=o.insert(v.key,v.mutableCopy()))}return S.resolve(o)}getAllFromCollectionGroup(t,e,r,s){x(9500)}ii(t,e){return S.forEach(this.docs,(r=>e(r)))}newChangeBuffer(t){return new $m(this)}getSize(t){return S.resolve(this.size)}}class $m extends Om{constructor(t){super(),this.Nr=t}applyChanges(t){const e=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?e.push(this.Nr.addEntry(t,s)):this.Nr.removeEntry(r)})),S.waitFor(e)}getFromCache(t,e){return this.Nr.getEntry(t,e)}getAllFromCache(t,e){return this.Nr.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qm{constructor(t){this.persistence=t,this.si=new Ee((e=>as(e)),cs),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.oi=0,this._i=new fs,this.targetCount=0,this.ai=Ne.ur()}forEachTarget(t,e){return this.si.forEach(((r,s)=>e(s))),S.resolve()}getLastRemoteSnapshotVersion(t){return S.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return S.resolve(this.oi)}allocateTargetId(t){return this.highestTargetId=this.ai.next(),S.resolve(this.highestTargetId)}setTargetsMetadata(t,e,r){return r&&(this.lastRemoteSnapshotVersion=r),e>this.oi&&(this.oi=e),S.resolve()}Pr(t){this.si.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.ai=new Ne(e),this.highestTargetId=e),t.sequenceNumber>this.oi&&(this.oi=t.sequenceNumber)}addTargetData(t,e){return this.Pr(e),this.targetCount+=1,S.resolve()}updateTargetData(t,e){return this.Pr(e),S.resolve()}removeTargetData(t,e){return this.si.delete(e.target),this._i.jr(e.targetId),this.targetCount-=1,S.resolve()}removeTargets(t,e,r){let s=0;const o=[];return this.si.forEach(((c,l)=>{l.sequenceNumber<=e&&r.get(l.targetId)===null&&(this.si.delete(c),o.push(this.removeMatchingKeysForTargetId(t,l.targetId)),s++)})),S.waitFor(o).next((()=>s))}getTargetCount(t){return S.resolve(this.targetCount)}getTargetData(t,e){const r=this.si.get(e)||null;return S.resolve(r)}addMatchingKeys(t,e,r){return this._i.Wr(e,r),S.resolve()}removeMatchingKeys(t,e,r){this._i.zr(e,r);const s=this.persistence.referenceDelegate,o=[];return s&&e.forEach((c=>{o.push(s.markPotentiallyOrphaned(t,c))})),S.waitFor(o)}removeMatchingKeysForTargetId(t,e){return this._i.jr(e),S.resolve()}getMatchingKeysForTargetId(t,e){const r=this._i.Hr(e);return S.resolve(r)}containsKey(t,e){return S.resolve(this._i.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cu{constructor(t,e){this.ui={},this.overlays={},this.ci=new es(0),this.li=!1,this.li=!0,this.hi=new Um,this.referenceDelegate=t(this),this.Pi=new qm(this),this.indexManager=new Rm,this.remoteDocumentCache=(function(s){return new jm(s)})((r=>this.referenceDelegate.Ti(r))),this.serializer=new bm(e),this.Ii=new Lm(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Fm,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let r=this.ui[t.toKey()];return r||(r=new Bm(e,this.referenceDelegate),this.ui[t.toKey()]=r),r}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(t,e,r){D("MemoryPersistence","Starting transaction:",t);const s=new zm(this.ci.next());return this.referenceDelegate.Ei(),r(s).next((o=>this.referenceDelegate.di(s).next((()=>o)))).toPromise().then((o=>(s.raiseOnCommittedEvent(),o)))}Ai(t,e){return S.or(Object.values(this.ui).map((r=>()=>r.containsKey(t,e))))}}class zm extends Ip{constructor(t){super(),this.currentSequenceNumber=t}}class ds{constructor(t){this.persistence=t,this.Ri=new fs,this.Vi=null}static mi(t){return new ds(t)}get fi(){if(this.Vi)return this.Vi;throw x(60996)}addReference(t,e,r){return this.Ri.addReference(r,e),this.fi.delete(r.toString()),S.resolve()}removeReference(t,e,r){return this.Ri.removeReference(r,e),this.fi.add(r.toString()),S.resolve()}markPotentiallyOrphaned(t,e){return this.fi.add(e.toString()),S.resolve()}removeTarget(t,e){this.Ri.jr(e.targetId).forEach((s=>this.fi.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,e.targetId).next((s=>{s.forEach((o=>this.fi.add(o.toString())))})).next((()=>r.removeTargetData(t,e)))}Ei(){this.Vi=new Set}di(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return S.forEach(this.fi,(r=>{const s=M.fromPath(r);return this.gi(t,s).next((o=>{o||e.removeEntry(s,G.min())}))})).next((()=>(this.Vi=null,e.apply(t))))}updateLimboDocument(t,e){return this.gi(t,e).next((r=>{r?this.fi.delete(e.toString()):this.fi.add(e.toString())}))}Ti(t){return 0}gi(t,e){return S.or([()=>S.resolve(this.Ri.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ai(t,e)])}}class pr{constructor(t,e){this.persistence=t,this.pi=new Ee((r=>Sp(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=Nm(this,e)}static mi(t,e){return new pr(t,e)}Ei(){}di(t){return S.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}gr(t){const e=this.wr(t);return this.persistence.getTargetCache().getTargetCount(t).next((r=>e.next((s=>r+s))))}wr(t){let e=0;return this.pr(t,(r=>{e++})).next((()=>e))}pr(t,e){return S.forEach(this.pi,((r,s)=>this.br(t,r,s).next((o=>o?S.resolve():e(s)))))}removeTargets(t,e,r){return this.persistence.getTargetCache().removeTargets(t,e,r)}removeOrphanedDocuments(t,e){let r=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.ii(t,(c=>this.br(t,c,e).next((l=>{l||(r++,o.removeEntry(c,G.min()))})))).next((()=>o.apply(t))).next((()=>r))}markPotentiallyOrphaned(t,e){return this.pi.set(e,t.currentSequenceNumber),S.resolve()}removeTarget(t,e){const r=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,r)}addReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),S.resolve()}removeReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),S.resolve()}updateLimboDocument(t,e){return this.pi.set(e,t.currentSequenceNumber),S.resolve()}Ti(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=Yn(t.data.value)),e}br(t,e,r){return S.or([()=>this.persistence.Ai(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.pi.get(e);return S.resolve(s!==void 0&&s>r)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ps{constructor(t,e,r,s){this.targetId=t,this.fromCache=e,this.Es=r,this.ds=s}static As(t,e){let r=dt(),s=dt();for(const o of e.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new ps(t,e.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Km{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=(function(){return xl()?8:Ap(Nl())>0?6:4})()}initialize(t,e){this.ps=t,this.indexManager=e,this.Rs=!0}getDocumentsMatchingQuery(t,e,r,s){const o={result:null};return this.ys(t,e).next((c=>{o.result=c})).next((()=>{if(!o.result)return this.ws(t,e,s,r).next((c=>{o.result=c}))})).next((()=>{if(o.result)return;const c=new Hm;return this.Ss(t,e,c).next((l=>{if(o.result=l,this.Vs)return this.bs(t,e,c,l.size)}))})).next((()=>o.result))}bs(t,e,r,s){return r.documentReadCount<this.fs?(be()<=F.DEBUG&&D("QueryEngine","SDK will not create cache indexes for query:",tn(e),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),S.resolve()):(be()<=F.DEBUG&&D("QueryEngine","Query:",tn(e),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.gs*s?(be()<=F.DEBUG&&D("QueryEngine","The SDK decides to create cache indexes for query:",tn(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,he(e))):S.resolve())}ys(t,e){if(ha(e))return S.resolve(null);let r=he(e);return this.indexManager.getIndexType(t,r).next((s=>s===0?null:(e.limit!==null&&s===1&&(e=Si(e,null,"F"),r=he(e)),this.indexManager.getDocumentsMatchingTarget(t,r).next((o=>{const c=dt(...o);return this.ps.getDocuments(t,c).next((l=>this.indexManager.getMinOffset(t,r).next((f=>{const d=this.Ds(e,l);return this.Cs(e,d,c,f.readTime)?this.ys(t,Si(e,null,"F")):this.vs(t,d,e,f)}))))})))))}ws(t,e,r,s){return ha(e)||s.isEqual(G.min())?S.resolve(null):this.ps.getDocuments(t,r).next((o=>{const c=this.Ds(e,o);return this.Cs(e,c,r,s)?S.resolve(null):(be()<=F.DEBUG&&D("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),tn(e)),this.vs(t,c,e,Ep(s,dn)).next((l=>l)))}))}Ds(t,e){let r=new ot(Wp(t));return e.forEach(((s,o)=>{us(t,o)&&(r=r.add(o))})),r}Cs(t,e,r,s){if(t.limit===null)return!1;if(r.size!==e.size)return!0;const o=t.limitType==="F"?e.last():e.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Ss(t,e,r){return be()<=F.DEBUG&&D("QueryEngine","Using full collection scan to execute query:",tn(e)),this.ps.getDocumentsMatchingQuery(t,e,Jt.min(),r)}vs(t,e,r,s){return this.ps.getDocumentsMatchingQuery(t,r,s).next((o=>(e.forEach((c=>{o=o.insert(c.key,c)})),o)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gm="LocalStore";class Wm{constructor(t,e,r,s){this.persistence=t,this.Fs=e,this.serializer=s,this.Ms=new wt(B),this.xs=new Ee((o=>as(o)),cs),this.Os=new Map,this.Ns=t.getRemoteDocumentCache(),this.Pi=t.getTargetCache(),this.Ii=t.getBundleCache(),this.Bs(r)}Bs(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new xm(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(e=>t.collect(e,this.Ms)))}}function Qm(n,t,e,r){return new Wm(n,t,e,r)}async function uu(n,t){const e=z(n);return await e.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return e.mutationQueue.getAllMutationBatches(r).next((o=>(s=o,e.Bs(t),e.mutationQueue.getAllMutationBatches(r)))).next((o=>{const c=[],l=[];let f=dt();for(const d of s){c.push(d.batchId);for(const v of d.mutations)f=f.add(v.key)}for(const d of o){l.push(d.batchId);for(const v of d.mutations)f=f.add(v.key)}return e.localDocuments.getDocuments(r,f).next((d=>({Ls:d,removedBatchIds:c,addedBatchIds:l})))}))}))}function Xm(n,t){const e=z(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=t.batch.keys(),o=e.Ns.newChangeBuffer({trackRemovals:!0});return(function(l,f,d,v){const A=d.batch,b=A.keys();let P=S.resolve();return b.forEach((V=>{P=P.next((()=>v.getEntry(f,V))).next((O=>{const N=d.docVersions.get(V);X(N!==null,48541),O.version.compareTo(N)<0&&(A.applyToRemoteDocument(O,d),O.isValidDocument()&&(O.setReadTime(d.commitVersion),v.addEntry(O)))}))})),P.next((()=>l.mutationQueue.removeMutationBatch(f,A)))})(e,r,t,o).next((()=>o.apply(r))).next((()=>e.mutationQueue.performConsistencyCheck(r))).next((()=>e.documentOverlayCache.removeOverlaysForBatchId(r,s,t.batch.batchId))).next((()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(l){let f=dt();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(f=f.add(l.batch.mutations[d].key));return f})(t)))).next((()=>e.localDocuments.getDocuments(r,s)))}))}function Ym(n){const t=z(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",(e=>t.Pi.getLastRemoteSnapshotVersion(e)))}function Jm(n,t){const e=z(n);return e.persistence.runTransaction("Get next mutation batch","readonly",(r=>(t===void 0&&(t=ns),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t))))}class Ta{constructor(){this.activeTargetIds=tm()}zs(t){this.activeTargetIds=this.activeTargetIds.add(t)}js(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Gs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class Zm{constructor(){this.Mo=new Ta,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,r){}addLocalQueryTarget(t,e=!0){return e&&this.Mo.zs(t),this.xo[t]||"not-current"}updateQueryState(t,e,r){this.xo[t]=e}removeLocalQueryTarget(t){this.Mo.js(t)}isLocalQueryTarget(t){return this.Mo.activeTargetIds.has(t)}clearQueryState(t){delete this.xo[t]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(t){return this.Mo.activeTargetIds.has(t)}start(){return this.Mo=new Ta,Promise.resolve()}handleUserChange(t,e,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tg{Oo(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wa="ConnectivityMonitor";class va{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(t){this.qo.push(t)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){D(wa,"Network connectivity changed: AVAILABLE");for(const t of this.qo)t(0)}ko(){D(wa,"Network connectivity changed: UNAVAILABLE");for(const t of this.qo)t(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wn=null;function Vi(){return Wn===null?Wn=(function(){return 268435456+Math.round(2147483648*Math.random())})():Wn++,"0x"+Wn.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const li="RestConnection",eg={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class ng{get $o(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=e+"://"+t.host,this.Ko=`projects/${r}/databases/${s}`,this.Wo=this.databaseId.database===ar?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Go(t,e,r,s,o){const c=Vi(),l=this.zo(t,e.toUriEncodedString());D(li,`Sending RPC '${t}' ${c}:`,l,r);const f={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(f,s,o);const{host:d}=new URL(l),v=Oi(d);return this.Jo(t,l,f,r,v).then((A=>(D(li,`Received RPC '${t}' ${c}: `,A),A)),(A=>{throw Tr(li,`RPC '${t}' ${c} failed with error: `,A,"url: ",l,"request:",r),A}))}Ho(t,e,r,s,o,c){return this.Go(t,e,r,s,o)}jo(t,e,r){t["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Me})(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach(((s,o)=>t[o]=s)),r&&r.headers.forEach(((s,o)=>t[o]=s))}zo(t,e){const r=eg[t];return`${this.Uo}/v1/${e}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rg{constructor(t){this.Yo=t.Yo,this.Zo=t.Zo}Xo(t){this.e_=t}t_(t){this.n_=t}r_(t){this.i_=t}onMessage(t){this.s_=t}close(){this.Zo()}send(t){this.Yo(t)}o_(){this.e_()}__(){this.n_()}a_(t){this.i_(t)}u_(t){this.s_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ht="WebChannelConnection";class ig extends ng{constructor(t){super(t),this.c_=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}Jo(t,e,r,s,o){const c=Vi();return new Promise(((l,f)=>{const d=new Ic;d.setWithCredentials(!0),d.listenOnce(Ac.COMPLETE,(()=>{try{switch(d.getLastErrorCode()){case Xn.NO_ERROR:const A=d.getResponseJson();D(ht,`XHR for RPC '${t}' ${c} received:`,JSON.stringify(A)),l(A);break;case Xn.TIMEOUT:D(ht,`RPC '${t}' ${c} timed out`),f(new k(R.DEADLINE_EXCEEDED,"Request time out"));break;case Xn.HTTP_ERROR:const b=d.getStatus();if(D(ht,`RPC '${t}' ${c} failed with status:`,b,"response text:",d.getResponseText()),b>0){let P=d.getResponseJson();Array.isArray(P)&&(P=P[0]);const V=P?.error;if(V&&V.status&&V.message){const O=(function(H){const j=H.toLowerCase().replace(/_/g,"-");return Object.values(R).indexOf(j)>=0?j:R.UNKNOWN})(V.status);f(new k(O,V.message))}else f(new k(R.UNKNOWN,"Server responded with status "+d.getStatus()))}else f(new k(R.UNAVAILABLE,"Connection failed."));break;default:x(9055,{l_:t,streamId:c,h_:d.getLastErrorCode(),P_:d.getLastError()})}}finally{D(ht,`RPC '${t}' ${c} completed.`)}}));const v=JSON.stringify(s);D(ht,`RPC '${t}' ${c} sending request:`,s),d.send(e,"POST",v,r,15)}))}T_(t,e,r){const s=Vi(),o=[this.Uo,"/","google.firestore.v1.Firestore","/",t,"/channel"],c=Rc(),l=Sc(),f={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(f.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(f.useFetchStreams=!0),this.jo(f.initMessageHeaders,e,r),f.encodeInitMessageHeaders=!0;const v=o.join("");D(ht,`Creating RPC '${t}' stream ${s}: ${v}`,f);const A=c.createWebChannel(v,f);this.I_(A);let b=!1,P=!1;const V=new rg({Yo:N=>{P?D(ht,`Not sending because RPC '${t}' stream ${s} is closed:`,N):(b||(D(ht,`Opening RPC '${t}' stream ${s} transport.`),A.open(),b=!0),D(ht,`RPC '${t}' stream ${s} sending:`,N),A.send(N))},Zo:()=>A.close()}),O=(N,H,j)=>{N.listen(H,($=>{try{j($)}catch(gt){setTimeout((()=>{throw gt}),0)}}))};return O(A,en.EventType.OPEN,(()=>{P||(D(ht,`RPC '${t}' stream ${s} transport opened.`),V.o_())})),O(A,en.EventType.CLOSE,(()=>{P||(P=!0,D(ht,`RPC '${t}' stream ${s} transport closed`),V.a_(),this.E_(A))})),O(A,en.EventType.ERROR,(N=>{P||(P=!0,Tr(ht,`RPC '${t}' stream ${s} transport errored. Name:`,N.name,"Message:",N.message),V.a_(new k(R.UNAVAILABLE,"The operation could not be completed")))})),O(A,en.EventType.MESSAGE,(N=>{if(!P){const H=N.data[0];X(!!H,16349);const j=H,$=j?.error||j[0]?.error;if($){D(ht,`RPC '${t}' stream ${s} received error:`,$);const gt=$.status;let Kt=(function(p){const g=J[p];if(g!==void 0)return fm(g)})(gt),vt=$.message;Kt===void 0&&(Kt=R.INTERNAL,vt="Unknown error status: "+gt+" with message "+$.message),P=!0,V.a_(new k(Kt,vt)),A.close()}else D(ht,`RPC '${t}' stream ${s} received:`,H),V.u_(H)}})),O(l,bc.STAT_EVENT,(N=>{N.stat===Ei.PROXY?D(ht,`RPC '${t}' stream ${s} detected buffering proxy`):N.stat===Ei.NOPROXY&&D(ht,`RPC '${t}' stream ${s} detected no buffering proxy`)})),setTimeout((()=>{V.__()}),0),V}terminate(){this.c_.forEach((t=>t.close())),this.c_=[]}I_(t){this.c_.push(t)}E_(t){this.c_=this.c_.filter((e=>e===t))}}function hi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ar(n){return new dm(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu{constructor(t,e,r=1e3,s=1.5,o=6e4){this.Mi=t,this.timerId=e,this.d_=r,this.A_=s,this.R_=o,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(t){this.cancel();const e=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,e-r);s>0&&D("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),t()))),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ia="PersistentStream";class sg{constructor(t,e,r,s,o,c,l,f){this.Mi=t,this.S_=r,this.b_=s,this.connection=o,this.authCredentialsProvider=c,this.appCheckCredentialsProvider=l,this.listener=f,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new lu(t,e)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(t){this.Q_(),this.stream.send(t)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(t,e){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,t!==4?this.M_.reset():e&&e.code===R.RESOURCE_EXHAUSTED?(ge(e.toString()),ge("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):e&&e.code===R.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.r_(e)}K_(){}auth(){this.state=1;const t=this.W_(this.D_),e=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.D_===e&&this.G_(r,s)}),(r=>{t((()=>{const s=new k(R.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(s)}))}))}G_(t,e){const r=this.W_(this.D_);this.stream=this.j_(t,e),this.stream.Xo((()=>{r((()=>this.listener.Xo()))})),this.stream.t_((()=>{r((()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.t_())))})),this.stream.r_((s=>{r((()=>this.z_(s)))})),this.stream.onMessage((s=>{r((()=>++this.F_==1?this.J_(s):this.onNext(s)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(t){return D(Ia,`close with error: ${t}`),this.stream=null,this.close(4,t)}W_(t){return e=>{this.Mi.enqueueAndForget((()=>this.D_===t?e():(D(Ia,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class og extends sg{constructor(t,e,r,s,o,c){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,r,s,c),this.serializer=o}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(t,e){return this.connection.T_("Write",t,e)}J_(t){return X(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,X(!t.writeResults||t.writeResults.length===0,55816),this.listener.ta()}onNext(t){X(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.M_.reset();const e=wm(t.writeResults,t.commitTime),r=Re(t.commitTime);return this.listener.na(r,e)}ra(){const t={};t.database=ym(this.serializer),this.q_(t)}ea(t){const e={streamToken:this.lastStreamToken,writes:t.map((r=>Tm(this.serializer,r)))};this.q_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ag{}class cg extends ag{constructor(t,e,r,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=r,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new k(R.FAILED_PRECONDITION,"The client has already been terminated.")}Go(t,e,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection.Go(t,Ci(e,r),s,o,c))).catch((o=>{throw o.name==="FirebaseError"?(o.code===R.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new k(R.UNKNOWN,o.toString())}))}Ho(t,e,r,s,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([c,l])=>this.connection.Ho(t,Ci(e,r),s,c,l,o))).catch((c=>{throw c.name==="FirebaseError"?(c.code===R.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),c):new k(R.UNKNOWN,c.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}class ug{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(t){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ca("Offline")))}set(t){this.Pa(),this.oa=0,t==="Online"&&(this.aa=!1),this.ca(t)}ca(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}la(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(ge(e),this.aa=!1):D("OnlineStateTracker",e)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vn="RemoteStore";class lg{constructor(t,e,r,s,o){this.localStore=t,this.datastore=e,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=o,this.Aa.Oo((c=>{r.enqueueAndForget((async()=>{An(this)&&(D(vn,"Restarting streams for network reachability change."),await(async function(f){const d=z(f);d.Ea.add(4),await In(d),d.Ra.set("Unknown"),d.Ea.delete(4),await br(d)})(this))}))})),this.Ra=new ug(r,s)}}async function br(n){if(An(n))for(const t of n.da)await t(!0)}async function In(n){for(const t of n.da)await t(!1)}function An(n){return z(n).Ea.size===0}async function hu(n,t,e){if(!Tn(t))throw t;n.Ea.add(1),await In(n),n.Ra.set("Offline"),e||(e=()=>Ym(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{D(vn,"Retrying IndexedDB access"),await e(),n.Ea.delete(1),await br(n)}))}function fu(n,t){return t().catch((e=>hu(n,e,t)))}async function Sr(n){const t=z(n),e=te(t);let r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:ns;for(;hg(t);)try{const s=await Jm(t.localStore,r);if(s===null){t.Ta.length===0&&e.L_();break}r=s.batchId,fg(t,s)}catch(s){await hu(t,s)}du(t)&&pu(t)}function hg(n){return An(n)&&n.Ta.length<10}function fg(n,t){n.Ta.push(t);const e=te(n);e.O_()&&e.X_&&e.ea(t.mutations)}function du(n){return An(n)&&!te(n).x_()&&n.Ta.length>0}function pu(n){te(n).start()}async function dg(n){te(n).ra()}async function pg(n){const t=te(n);for(const e of n.Ta)t.ea(e.mutations)}async function mg(n,t,e){const r=n.Ta.shift(),s=hs.from(r,t,e);await fu(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await Sr(n)}async function gg(n,t){t&&te(n).X_&&await(async function(r,s){if((function(c){return hm(c)&&c!==R.ABORTED})(s.code)){const o=r.Ta.shift();te(r).B_(),await fu(r,(()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s))),await Sr(r)}})(n,t),du(n)&&pu(n)}async function Aa(n,t){const e=z(n);e.asyncQueue.verifyOperationInProgress(),D(vn,"RemoteStore received new credentials");const r=An(e);e.Ea.add(3),await In(e),r&&e.Ra.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Ea.delete(3),await br(e)}async function _g(n,t){const e=z(n);t?(e.Ea.delete(2),await br(e)):t||(e.Ea.add(2),await In(e),e.Ra.set("Unknown"))}function te(n){return n.fa||(n.fa=(function(e,r,s){const o=z(e);return o.sa(),new og(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)})(n.datastore,n.asyncQueue,{Xo:()=>Promise.resolve(),t_:dg.bind(null,n),r_:gg.bind(null,n),ta:pg.bind(null,n),na:mg.bind(null,n)}),n.da.push((async t=>{t?(n.fa.B_(),await Sr(n)):(await n.fa.stop(),n.Ta.length>0&&(D(vn,`Stopping write stream with ${n.Ta.length} pending writes`),n.Ta=[]))}))),n.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ms{constructor(t,e,r,s,o){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new le,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((c=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(t,e,r,s,o){const c=Date.now()+r,l=new ms(t,e,c,s,o);return l.start(r),l}start(t){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new k(R.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((t=>this.deferred.resolve(t)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function mu(n,t){if(ge("AsyncQueue",`${t}: ${n}`),Tn(n))return new k(R.UNAVAILABLE,`${t}: ${n}`);throw n}class yg{constructor(){this.queries=ba(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(e,r){const s=z(e),o=s.queries;s.queries=ba(),o.forEach(((c,l)=>{for(const f of l.Sa)f.onError(r)}))})(this,new k(R.ABORTED,"Firestore shutting down"))}}function ba(){return new Ee((n=>Gc(n)),Kc)}function Eg(n){n.Ca.forEach((t=>{t.next()}))}var Sa,Ra;(Ra=Sa||(Sa={})).Ma="default",Ra.Cache="cache";const Tg="SyncEngine";class wg{constructor(t,e,r,s,o,c){this.localStore=t,this.remoteStore=e,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=c,this.Pu={},this.Tu=new Ee((l=>Gc(l)),Kc),this.Iu=new Map,this.Eu=new Set,this.du=new wt(M.comparator),this.Au=new Map,this.Ru=new fs,this.Vu={},this.mu=new Map,this.fu=Ne.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function vg(n,t,e){const r=Sg(n);try{const s=await(function(c,l){const f=z(c),d=W.now(),v=l.reduce(((P,V)=>P.add(V.key)),dt());let A,b;return f.persistence.runTransaction("Locally write mutations","readwrite",(P=>{let V=hr(),O=dt();return f.Ns.getEntries(P,v).next((N=>{V=N,V.forEach(((H,j)=>{j.isValidDocument()||(O=O.add(H))}))})).next((()=>f.localDocuments.getOverlayedDocuments(P,V))).next((N=>{A=N;const H=[];for(const j of l){const $=am(j,A.get(j.key).overlayedDocument);$!=null&&H.push(new Te(j.key,$,Uc($.value.mapValue),jt.exists(!0)))}return f.mutationQueue.addMutationBatch(P,d,H,l)})).next((N=>{b=N;const H=N.applyToLocalDocumentSet(A,O);return f.documentOverlayCache.saveOverlays(P,N.batchId,H)}))})).then((()=>({batchId:b.batchId,changes:Qc(A)})))})(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),(function(c,l,f){let d=c.Vu[c.currentUser.toKey()];d||(d=new wt(B)),d=d.insert(l,f),c.Vu[c.currentUser.toKey()]=d})(r,s.batchId,e),await Rr(r,s.changes),await Sr(r.remoteStore)}catch(s){const o=mu(s,"Failed to persist write");e.reject(o)}}function Ca(n,t,e){const r=z(n);if(r.isPrimaryClient&&e===0||!r.isPrimaryClient&&e===1){const s=[];r.Tu.forEach(((o,c)=>{const l=c.view.va(t);l.snapshot&&s.push(l.snapshot)})),(function(c,l){const f=z(c);f.onlineState=l;let d=!1;f.queries.forEach(((v,A)=>{for(const b of A.Sa)b.va(l)&&(d=!0)})),d&&Eg(f)})(r.eventManager,t),s.length&&r.Pu.H_(s),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function Ig(n,t){const e=z(n),r=t.batch.batchId;try{const s=await Xm(e.localStore,t);_u(e,r,null),gu(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await Rr(e,s)}catch(s){await ts(s)}}async function Ag(n,t,e){const r=z(n);try{const s=await(function(c,l){const f=z(c);return f.persistence.runTransaction("Reject batch","readwrite-primary",(d=>{let v;return f.mutationQueue.lookupMutationBatch(d,l).next((A=>(X(A!==null,37113),v=A.keys(),f.mutationQueue.removeMutationBatch(d,A)))).next((()=>f.mutationQueue.performConsistencyCheck(d))).next((()=>f.documentOverlayCache.removeOverlaysForBatchId(d,v,l))).next((()=>f.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,v))).next((()=>f.localDocuments.getDocuments(d,v)))}))})(r.localStore,t);_u(r,t,e),gu(r,t),r.sharedClientState.updateMutationState(t,"rejected",e),await Rr(r,s)}catch(s){await ts(s)}}function gu(n,t){(n.mu.get(t)||[]).forEach((e=>{e.resolve()})),n.mu.delete(t)}function _u(n,t,e){const r=z(n);let s=r.Vu[r.currentUser.toKey()];if(s){const o=s.get(t);o&&(e?o.reject(e):o.resolve(),s=s.remove(t)),r.Vu[r.currentUser.toKey()]=s}}async function Rr(n,t,e){const r=z(n),s=[],o=[],c=[];r.Tu.isEmpty()||(r.Tu.forEach(((l,f)=>{c.push(r.pu(f,t,e).then((d=>{if((d||e)&&r.isPrimaryClient){const v=d?!d.fromCache:e?.targetChanges.get(f.targetId)?.current;r.sharedClientState.updateQueryState(f.targetId,v?"current":"not-current")}if(d){s.push(d);const v=ps.As(f.targetId,d);o.push(v)}})))})),await Promise.all(c),r.Pu.H_(s),await(async function(f,d){const v=z(f);try{await v.persistence.runTransaction("notifyLocalViewChanges","readwrite",(A=>S.forEach(d,(b=>S.forEach(b.Es,(P=>v.persistence.referenceDelegate.addReference(A,b.targetId,P))).next((()=>S.forEach(b.ds,(P=>v.persistence.referenceDelegate.removeReference(A,b.targetId,P)))))))))}catch(A){if(!Tn(A))throw A;D(Gm,"Failed to update sequence numbers: "+A)}for(const A of d){const b=A.targetId;if(!A.fromCache){const P=v.Ms.get(b),V=P.snapshotVersion,O=P.withLastLimboFreeSnapshotVersion(V);v.Ms=v.Ms.insert(b,O)}}})(r.localStore,o))}async function bg(n,t){const e=z(n);if(!e.currentUser.isEqual(t)){D(Tg,"User change. New user:",t.toKey());const r=await uu(e.localStore,t);e.currentUser=t,(function(o,c){o.mu.forEach((l=>{l.forEach((f=>{f.reject(new k(R.CANCELLED,c))}))})),o.mu.clear()})(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await Rr(e,r.Ls)}}function Sg(n){const t=z(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Ig.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=Ag.bind(null,t),t}class mr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=Ar(t.databaseInfo.databaseId),this.sharedClientState=this.Du(t),this.persistence=this.Cu(t),await this.persistence.start(),this.localStore=this.vu(t),this.gcScheduler=this.Fu(t,this.localStore),this.indexBackfillerScheduler=this.Mu(t,this.localStore)}Fu(t,e){return null}Mu(t,e){return null}vu(t){return Qm(this.persistence,new Km,t.initialUser,this.serializer)}Cu(t){return new cu(ds.mi,this.serializer)}Du(t){return new Zm}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}mr.provider={build:()=>new mr};class Rg extends mr{constructor(t){super(),this.cacheSizeBytes=t}Fu(t,e){X(this.persistence.referenceDelegate instanceof pr,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new Dm(r,t.asyncQueue,e)}Cu(t){const e=this.cacheSizeBytes!==void 0?Et.withCacheSize(this.cacheSizeBytes):Et.DEFAULT;return new cu((r=>pr.mi(r,e)),this.serializer)}}class Di{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Ca(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=bg.bind(null,this.syncEngine),await _g(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return(function(){return new yg})()}createDatastore(t){const e=Ar(t.databaseInfo.databaseId),r=(function(o){return new ig(o)})(t.databaseInfo);return(function(o,c,l,f){return new cg(o,c,l,f)})(t.authCredentials,t.appCheckCredentials,r,e)}createRemoteStore(t){return(function(r,s,o,c,l){return new lg(r,s,o,c,l)})(this.localStore,this.datastore,t.asyncQueue,(e=>Ca(this.syncEngine,e,0)),(function(){return va.v()?new va:new tg})())}createSyncEngine(t,e){return(function(s,o,c,l,f,d,v){const A=new wg(s,o,c,l,f,d);return v&&(A.gu=!0),A})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){await(async function(e){const r=z(e);D(vn,"RemoteStore shutting down."),r.Ea.add(5),await In(r),r.Aa.shutdown(),r.Ra.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}Di.provider={build:()=>new Di};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ee="FirestoreClient";class Cg{constructor(t,e,r,s,o){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=r,this.databaseInfo=s,this.user=ft.UNAUTHENTICATED,this.clientId=Ji.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,(async c=>{D(ee,"Received user=",c.uid),await this.authCredentialListener(c),this.user=c})),this.appCheckCredentials.start(r,(c=>(D(ee,"Received new app check token=",c),this.appCheckCredentialListener(c,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new le;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const r=mu(e,"Failed to shutdown persistence");t.reject(r)}})),t.promise}}async function fi(n,t){n.asyncQueue.verifyOperationInProgress(),D(ee,"Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let r=e.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await uu(t.localStore,s),r=s)})),t.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=t}async function Pa(n,t){n.asyncQueue.verifyOperationInProgress();const e=await Pg(n);D(ee,"Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener((r=>Aa(t.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Aa(t.remoteStore,s))),n._onlineComponents=t}async function Pg(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){D(ee,"Using user provided OfflineComponentProvider");try{await fi(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!(function(s){return s.name==="FirebaseError"?s.code===R.FAILED_PRECONDITION||s.code===R.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(e))throw e;Tr("Error using user provided cache. Falling back to memory cache: "+e),await fi(n,new mr)}}else D(ee,"Using default OfflineComponentProvider"),await fi(n,new Rg(void 0));return n._offlineComponents}async function Vg(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(D(ee,"Using user provided OnlineComponentProvider"),await Pa(n,n._uninitializedComponentsProvider._online)):(D(ee,"Using default OnlineComponentProvider"),await Pa(n,new Di))),n._onlineComponents}function Dg(n){return Vg(n).then((t=>t.syncEngine))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yu(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Va=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eu="firestore.googleapis.com",Da=!0;class ka{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new k(R.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Eu,this.ssl=Da}else this.host=t.host,this.ssl=t.ssl??Da;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=au;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<Pm)throw new k(R.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}yp("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=yu(t.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new k(R.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new k(R.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new k(R.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class gs{constructor(t,e,r,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ka({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new k(R.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new k(R.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ka(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new ap;switch(r.type){case"firstParty":return new hp(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new k(R.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(e){const r=Va.get(e);r&&(D("ComponentProvider","Removing Datastore"),Va.delete(e),r.terminate())})(this),Promise.resolve()}}function kg(n,t,e,r={}){n=wi(n,gs);const s=Oi(t),o=n._getSettings(),c={...o,emulatorOptions:n._getEmulatorOptions()},l=`${t}:${e}`;s&&(Cl(`https://${l}`),kl("Firestore",!0)),o.host!==Eu&&o.host!==l&&Tr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const f={...o,host:l,ssl:s,emulatorOptions:r};if(!ln(f,c)&&(n._setSettings(f),r.mockUserToken)){let d,v;if(typeof r.mockUserToken=="string")d=r.mockUserToken,v=ft.MOCK_USER;else{d=Pl(r.mockUserToken,n._app?.options.projectId);const A=r.mockUserToken.sub||r.mockUserToken.user_id;if(!A)throw new k(R.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");v=new ft(A)}n._authCredentials=new cp(new Pc(d,v))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(t,e,r){this.converter=e,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new _s(this.firestore,t,this._query)}}class pt{constructor(t,e,r){this.converter=e,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new _n(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new pt(this.firestore,t,this._key)}toJSON(){return{type:pt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,r){if(En(e,pt._jsonSchema))return new pt(t,r||null,new M(Y.fromString(e.referencePath)))}}pt._jsonSchemaVersion="firestore/documentReference/1.0",pt._jsonSchema={type:Z("string",pt._jsonSchemaVersion),referencePath:Z("string")};class _n extends _s{constructor(t,e,r){super(t,e,Hp(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new pt(this.firestore,null,new M(t))}withConverter(t){return new _n(this.firestore,t,this._path)}}function Tu(n,t,...e){if(n=zt(n),arguments.length===1&&(t=Ji.newId()),_p("doc","path",t),n instanceof gs){const r=Y.fromString(t,...e);return ta(r),new pt(n,null,new M(r))}{if(!(n instanceof pt||n instanceof _n))throw new k(R.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Y.fromString(t,...e));return ta(r),new pt(n.firestore,n instanceof _n?n.converter:null,new M(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Na="AsyncQueue";class Oa{constructor(t=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new lu(this,"async_queue_retry"),this._c=()=>{const r=hi();r&&D(Na,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=t;const e=hi();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.uc(),this.cc(t)}enterRestrictedMode(t){if(!this.ec){this.ec=!0,this.sc=t||!1;const e=hi();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this._c)}}enqueue(t){if(this.uc(),this.ec)return new Promise((()=>{}));const e=new le;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise))).then((()=>e.promise))}enqueueRetryable(t){this.enqueueAndForget((()=>(this.Xu.push(t),this.lc())))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(t){if(!Tn(t))throw t;D(Na,"Operation failed with retryable error: "+t)}this.Xu.length>0&&this.M_.p_((()=>this.lc()))}}cc(t){const e=this.ac.then((()=>(this.rc=!0,t().catch((r=>{throw this.nc=r,this.rc=!1,ge("INTERNAL UNHANDLED ERROR: ",Ma(r)),r})).then((r=>(this.rc=!1,r))))));return this.ac=e,e}enqueueAfterDelay(t,e,r){this.uc(),this.oc.indexOf(t)>-1&&(e=0);const s=ms.createAndSchedule(this,t,e,r,(o=>this.hc(o)));return this.tc.push(s),s}uc(){this.nc&&x(47125,{Pc:Ma(this.nc)})}verifyOperationInProgress(){}async Tc(){let t;do t=this.ac,await t;while(t!==this.ac)}Ic(t){for(const e of this.tc)if(e.timerId===t)return!0;return!1}Ec(t){return this.Tc().then((()=>{this.tc.sort(((e,r)=>e.targetTimeMs-r.targetTimeMs));for(const e of this.tc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Tc()}))}dc(t){this.oc.push(t)}hc(t){const e=this.tc.indexOf(t);this.tc.splice(e,1)}}function Ma(n){let t=n.message||"";return n.stack&&(t=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),t}class wu extends gs{constructor(t,e,r,s){super(t,e,r,s),this.type="firestore",this._queue=new Oa,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new Oa(t),this._firestoreClient=void 0,await t}}}function Ng(n,t){const e=typeof n=="object"?n:Ui(),r=typeof n=="string"?n:ar,s=Oe(e,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Sl("firestore");o&&kg(s,...o)}return s}function Og(n){if(n._terminated)throw new k(R.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Mg(n),n._firestoreClient}function Mg(n){const t=n._freezeSettings(),e=(function(s,o,c,l){return new Vp(s,o,c,l.host,l.ssl,l.experimentalForceLongPolling,l.experimentalAutoDetectLongPolling,yu(l.experimentalLongPollingOptions),l.useFetchStreams,l.isUsingEmulator)})(n._databaseId,n._app?.options.appId||"",n._persistenceKey,t);n._componentsProvider||t.localCache?._offlineComponentProvider&&t.localCache?._onlineComponentProvider&&(n._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),n._firestoreClient=new Cg(n._authCredentials,n._appCheckCredentials,n._queue,e,n._componentsProvider&&(function(s){const o=s?._online.build();return{_offline:s?._offline.build(o),_online:o}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Pt(Ot.fromBase64String(t))}catch(e){throw new k(R.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Pt(Ot.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:Pt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(En(t,Pt._jsonSchema))return Pt.fromBase64String(t.bytes)}}Pt._jsonSchemaVersion="firestore/bytes/1.0",Pt._jsonSchema={type:Z("string",Pt._jsonSchemaVersion),bytes:Z("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new k(R.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new st(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vu{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new k(R.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new k(R.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return B(this._lat,t._lat)||B(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:$t._jsonSchemaVersion}}static fromJSON(t){if(En(t,$t._jsonSchema))return new $t(t.latitude,t.longitude)}}$t._jsonSchemaVersion="firestore/geoPoint/1.0",$t._jsonSchema={type:Z("string",$t._jsonSchemaVersion),latitude:Z("number"),longitude:Z("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(t){this._values=(t||[]).map((e=>e))}toArray(){return this._values.map((t=>t))}isEqual(t){return(function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0})(this._values,t._values)}toJSON(){return{type:qt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(En(t,qt._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every((e=>typeof e=="number")))return new qt(t.vectorValues);throw new k(R.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}qt._jsonSchemaVersion="firestore/vectorValue/1.0",qt._jsonSchema={type:Z("string",qt._jsonSchemaVersion),vectorValues:Z("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xg=/^__.*__$/;class Lg{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return this.fieldMask!==null?new Te(t,this.data,this.fieldMask,e,this.fieldTransforms):new wn(t,this.data,e,this.fieldTransforms)}}function Iu(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw x(40011,{Ac:n})}}class Es{constructor(t,e,r,s,o,c){this.settings=t,this.databaseId=e,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.Rc(),this.fieldTransforms=o||[],this.fieldMask=c||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(t){return new Es({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(t){const e=this.path?.child(t),r=this.Vc({path:e,fc:!1});return r.gc(t),r}yc(t){const e=this.path?.child(t),r=this.Vc({path:e,fc:!1});return r.Rc(),r}wc(t){return this.Vc({path:void 0,fc:!0})}Sc(t){return gr(t,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(t){return this.fieldMask.find((e=>t.isPrefixOf(e)))!==void 0||this.fieldTransforms.find((e=>t.isPrefixOf(e.field)))!==void 0}Rc(){if(this.path)for(let t=0;t<this.path.length;t++)this.gc(this.path.get(t))}gc(t){if(t.length===0)throw this.Sc("Document fields must not be empty");if(Iu(this.Ac)&&xg.test(t))throw this.Sc('Document fields cannot begin and end with "__"')}}class Fg{constructor(t,e,r){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=r||Ar(t)}Cc(t,e,r,s=!1){return new Es({Ac:t,methodName:e,Dc:r,path:st.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ug(n){const t=n._freezeSettings(),e=Ar(n._databaseId);return new Fg(n._databaseId,!!t.ignoreUndefinedProperties,e)}function Bg(n,t,e,r,s,o={}){const c=n.Cc(o.merge||o.mergeFields?2:0,t,e,s);Ru("Data must be an object, but it was:",c,r);const l=bu(r,c);let f,d;if(o.merge)f=new Vt(c.fieldMask),d=c.fieldTransforms;else if(o.mergeFields){const v=[];for(const A of o.mergeFields){const b=jg(t,A,e);if(!c.contains(b))throw new k(R.INVALID_ARGUMENT,`Field '${b}' is specified in your field mask but missing from your input data.`);qg(v,b)||v.push(b)}f=new Vt(v),d=c.fieldTransforms.filter((A=>f.covers(A.field)))}else f=null,d=c.fieldTransforms;return new Lg(new Ct(l),f,d)}function Au(n,t){if(Su(n=zt(n)))return Ru("Unsupported field value:",t,n),bu(n,t);if(n instanceof vu)return(function(r,s){if(!Iu(s.Ac))throw s.Sc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)})(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.fc&&t.Ac!==4)throw t.Sc("Nested arrays are not supported");return(function(r,s){const o=[];let c=0;for(const l of r){let f=Au(l,s.wc(c));f==null&&(f={nullValue:"NULL_VALUE"}),o.push(f),c++}return{arrayValue:{values:o}}})(n,t)}return(function(r,s){if((r=zt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return em(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=W.fromDate(r);return{timestampValue:Ri(s.serializer,o)}}if(r instanceof W){const o=new W(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Ri(s.serializer,o)}}if(r instanceof $t)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Pt)return{bytesValue:pm(s.serializer,r._byteString)};if(r instanceof pt){const o=s.databaseId,c=r.firestore._databaseId;if(!c.isEqual(o))throw s.Sc(`Document reference is for database ${c.projectId}/${c.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:su(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof qt)return(function(c,l){return{mapValue:{fields:{[Lc]:{stringValue:Fc},[vi]:{arrayValue:{values:c.toArray().map((d=>{if(typeof d!="number")throw l.Sc("VectorValues must only contain numeric values.");return ls(l.serializer,d)}))}}}}}})(r,s);throw s.Sc(`Unsupported field value: ${Zi(r)}`)})(n,t)}function bu(n,t){const e={};return kc(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):xe(n,((r,s)=>{const o=Au(s,t.mc(r));o!=null&&(e[r]=o)})),{mapValue:{fields:e}}}function Su(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof W||n instanceof $t||n instanceof Pt||n instanceof pt||n instanceof vu||n instanceof qt)}function Ru(n,t,e){if(!Su(e)||!Vc(e)){const r=Zi(e);throw r==="an object"?t.Sc(n+" a custom object"):t.Sc(n+" "+r)}}function jg(n,t,e){if((t=zt(t))instanceof ys)return t._internalPath;if(typeof t=="string")return Cu(n,t);throw gr("Field path arguments must be of type string or ",n,!1,void 0,e)}const $g=new RegExp("[~\\*/\\[\\]]");function Cu(n,t,e){if(t.search($g)>=0)throw gr(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new ys(...t.split("."))._internalPath}catch{throw gr(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function gr(n,t,e,r,s){const o=r&&!r.isEmpty(),c=s!==void 0;let l=`Function ${t}() called with invalid data`;e&&(l+=" (via `toFirestore()`)"),l+=". ";let f="";return(o||c)&&(f+=" (found",o&&(f+=` in field ${r}`),c&&(f+=` in document ${s}`),f+=")"),new k(R.INVALID_ARGUMENT,l+n+f)}function qg(n,t){return n.some((e=>e.isEqual(t)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pu{constructor(t,e,r,s,o){this._firestore=t,this._userDataWriter=e,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new pt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new zg(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(Vu("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class zg extends Pu{data(){return super.data()}}function Vu(n,t){return typeof t=="string"?Cu(n,t):t instanceof ys?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hg(n,t,e){let r;return r=n?e&&(e.merge||e.mergeFields)?n.toFirestore(t,e):n.toFirestore(t):t,r}class Qn{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Ce extends Pu{constructor(t,e,r,s,o,c){super(t,e,r,s,c),this._firestore=t,this._firestoreImpl=t,this.metadata=o}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new tr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const r=this._document.data.field(Vu("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new k(R.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=Ce._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}Ce._jsonSchemaVersion="firestore/documentSnapshot/1.0",Ce._jsonSchema={type:Z("string",Ce._jsonSchemaVersion),bundleSource:Z("string","DocumentSnapshot"),bundleName:Z("string"),bundle:Z("string")};class tr extends Ce{data(t={}){return super.data(t)}}class un{constructor(t,e,r,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new Qn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const t=[];return this.forEach((e=>t.push(e))),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach((r=>{t.call(e,new tr(this._firestore,this._userDataWriter,r.key,r,new Qn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new k(R.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=(function(s,o){if(s._snapshot.oldDocs.isEmpty()){let c=0;return s._snapshot.docChanges.map((l=>{const f=new tr(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Qn(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:f,oldIndex:-1,newIndex:c++}}))}{let c=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((l=>o||l.type!==3)).map((l=>{const f=new tr(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Qn(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,v=-1;return l.type!==0&&(d=c.indexOf(l.doc.key),c=c.delete(l.doc.key)),l.type!==1&&(c=c.add(l.doc),v=c.indexOf(l.doc.key)),{type:Kg(l.type),doc:f,oldIndex:d,newIndex:v}}))}})(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new k(R.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=un._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=Ji.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],r=[],s=[];return this.docs.forEach((o=>{o._document!==null&&(e.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))})),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function Kg(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return x(61501,{type:n})}}un._jsonSchemaVersion="firestore/querySnapshot/1.0",un._jsonSchema={type:Z("string",un._jsonSchemaVersion),bundleSource:Z("string","QuerySnapshot"),bundleName:Z("string"),bundle:Z("string")};function Du(n,t,e){n=wi(n,pt);const r=wi(n.firestore,wu),s=Hg(n.converter,t,e);return Gg(r,[Bg(Ug(r),"setDoc",n._key,s,n.converter!==null,e).toMutation(n._key,jt.none())])}function Gg(n,t){return(function(r,s){const o=new le;return r.asyncQueue.enqueueAndForget((async()=>vg(await Dg(r),s,o))),o.promise})(Og(n),t)}(function(t,e=!0){(function(s){Me=s})($h),Nt(new Dt("firestore",((r,{instanceIdentifier:s,options:o})=>{const c=r.getProvider("app").getImmediate(),l=new wu(new up(r.getProvider("auth-internal")),new fp(c,r.getProvider("app-check-internal")),(function(d,v){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new k(R.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new cr(d.options.projectId,v)})(c,s),c);return o={useFetchStreams:e,...o},l._setSettings(o),l}),"PUBLIC").setMultipleInstances(!0)),bt(Xo,Yo,t),bt(Xo,Yo,"esm2020")})();const Wg={apiKey:"AIzaSyD5XBi3PzVPlZeFy541TVWwwiKqbIjkvpk",authDomain:"thewrkshop-pushnoti.firebaseapp.com",projectId:"thewrkshop-pushnoti",storageBucket:"thewrkshop-pushnoti.firebasestorage.app",messagingSenderId:"540768640641",appId:"1:540768640641:web:fd24a4c026a1ef801c3780",measurementId:"G-N48478JV2Z"},Ts=qa(Wg),Qg=_d(Ts),ki=sp(Ts),ku=Ng(Ts),Nu="PUT_YOUR_VAPID_PUBLIC_KEY_HERE";async function Ou(){if(!("serviceWorker"in navigator))throw new Error("Service workers not supported");return await navigator.serviceWorker.register("/firebase-messaging-sw.js")}async function Xg(){if(await Notification.requestPermission()!=="granted")throw new Error("Notifications blocked by the browser");const t=await Ou(),e=await vc(ki,{vapidKey:Nu,serviceWorkerRegistration:t});if(!e)throw new Error("Failed to get FCM token");const r=Intl.DateTimeFormat().resolvedOptions().timeZone||"America/Chicago";return await Du(Tu(ku,"push_subscribers",e),{enabled:!0,timezone:r,createdAt:new Date().toISOString()},{merge:!0}),e}async function Yg(){const n=await Ou(),t=await vc(ki,{vapidKey:Nu,serviceWorkerRegistration:n});t&&await Du(Tu(ku,"push_subscribers",t),{enabled:!1,disabledAt:new Date().toISOString()},{merge:!0}),await op(ki)}function Jg({subBtnSelector:n="#btn-sub",unsubBtnSelector:t="#btn-unsub",statusSelector:e="#push-status"}={}){const r=document.querySelector(n),s=document.querySelector(t),o=document.querySelector(e);!r||!s||!o||(r.addEventListener("click",async()=>{try{await Xg(),o.textContent="Subscribed! You’ll get the daily devotional.",r.style.display="none",s.style.display="inline-block"}catch(c){console.error(c),o.textContent=c?.message||"Could not subscribe. Check browser settings."}}),s.addEventListener("click",async()=>{try{await Yg(),o.textContent="Unsubscribed. You can re-enable anytime.",r.style.display="inline-block",s.style.display="none"}catch(c){console.error(c),o.textContent="Error while unsubscribing. Try again."}}))}function Zg(){new URLSearchParams(location.search).get("src")==="push"&&pc(Qg,"devotional_push_click",{path:location.pathname})}const xa=document.getElementById("push-controls");if("Notification"in window&&"serviceWorker"in navigator&&xa){Jg(),Zg();const n=navigator.userAgent||"";/iPhone|iPad|iPod/.test(n)||document.querySelector(".ios-hint")?.remove()}else xa?.remove();
