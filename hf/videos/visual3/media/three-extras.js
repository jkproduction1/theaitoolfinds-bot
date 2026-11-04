/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.6.9
*/
!function(f){typeof module!='undefined'&&typeof exports=='object'?module.exports=f():typeof define!='undefined'&&define.amd?define(['fflate',f]):(typeof self!='undefined'?self:this).fflate=f()}(function(){var _e={};"use strict";var t=(typeof module!='undefined'&&typeof exports=='object'?function(_f){"use strict";var e,t=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{e=require("worker_threads").Worker}catch(e){}exports.default=e?function(r,n,o,a,s){var u=!1,i=new e(r+t,{eval:!0}).on("error",(function(e){return s(e,null)})).on("message",(function(e){return s(null,e)})).on("exit",(function(e){e&&!u&&s(Error("exited with code "+e),null)}));return i.postMessage(o,a),i.terminate=function(){return u=!0,e.prototype.terminate.call(i)},i}:function(e,t,r,n,o){setImmediate((function(){return o(Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)}));var a=function(){};return{terminate:a,postMessage:a}};return _f}:function(_f){"use strict";var e={},r=function(e){return URL.createObjectURL(new Blob([e],{type:"text/javascript"}))},t=function(e){return new Worker(e)};try{URL.revokeObjectURL(r(""))}catch(e){r=function(e){return"data:application/javascript;charset=UTF-8,"+encodeURI(e)},t=function(e){return new Worker(e,{type:"module"})}}_f.default=function(n,o,u,a,c){var i=t(e[o]||(e[o]=r(n)));return i.onerror=function(e){return c(e.error,null)},i.onmessage=function(e){return c(null,e.data)},i.postMessage(u,a),i};return _f})({}),n=Uint8Array,r=Uint16Array,e=Uint32Array,i=new n([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),o=new n([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),a=new n([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),s=function(t,n){for(var i=new r(31),o=0;o<31;++o)i[o]=n+=1<<t[o-1];var a=new e(i[30]);for(o=1;o<30;++o)for(var s=i[o];s<i[o+1];++s)a[s]=s-i[o]<<5|o;return[i,a]},f=s(i,2),u=f[0],h=f[1];u[28]=258,h[258]=28;for(var c=s(o,0),l=c[0],p=c[1],v=new r(32768),d=0;d<32768;++d){var g=(43690&d)>>>1|(21845&d)<<1;v[d]=((65280&(g=(61680&(g=(52428&g)>>>2|(13107&g)<<2))>>>4|(3855&g)<<4))>>>8|(255&g)<<8)>>>1}var w=function(t,n,e){for(var i=t.length,o=0,a=new r(n);o<i;++o)++a[t[o]-1];var s,f=new r(n);for(o=0;o<n;++o)f[o]=f[o-1]+a[o-1]<<1;if(e){s=new r(1<<n);var u=15-n;for(o=0;o<i;++o)if(t[o])for(var h=o<<4|t[o],c=n-t[o],l=f[t[o]-1]++<<c,p=l|(1<<c)-1;l<=p;++l)s[v[l]>>>u]=h}else for(s=new r(i),o=0;o<i;++o)t[o]&&(s[o]=v[f[t[o]-1]++]>>>15-t[o]);return s},y=new n(288);for(d=0;d<144;++d)y[d]=8;for(d=144;d<256;++d)y[d]=9;for(d=256;d<280;++d)y[d]=7;for(d=280;d<288;++d)y[d]=8;var m=new n(32);for(d=0;d<32;++d)m[d]=5;var b=w(y,9,0),x=w(y,9,1),z=w(m,5,0),k=w(m,5,1),M=function(t){for(var n=t[0],r=1;r<t.length;++r)t[r]>n&&(n=t[r]);return n},A=function(t,n,r){var e=n/8|0;return(t[e]|t[e+1]<<8)>>(7&n)&r},S=function(t,n){var r=n/8|0;return(t[r]|t[r+1]<<8|t[r+2]<<16)>>(7&n)},D=function(t){return(t/8|0)+(7&t&&1)},C=function(t,i,o){(null==i||i<0)&&(i=0),(null==o||o>t.length)&&(o=t.length);var a=new(t instanceof r?r:t instanceof e?e:n)(o-i);return a.set(t.subarray(i,o)),a},U=function(t,r,e){var s=t.length;if(!s||e&&!e.l&&s<5)return r||new n(0);var f=!r||e,h=!e||e.i;e||(e={}),r||(r=new n(3*s));var c=function(t){var e=r.length;if(t>e){var i=new n(Math.max(2*e,t));i.set(r),r=i}},p=e.f||0,v=e.p||0,d=e.b||0,g=e.l,y=e.d,m=e.m,b=e.n,z=8*s;do{if(!g){e.f=p=A(t,v,1);var U=A(t,v+1,3);if(v+=3,!U){var O=t[(Y=D(v)+4)-4]|t[Y-3]<<8,T=Y+O;if(T>s){if(h)throw"unexpected EOF";break}f&&c(d+O),r.set(t.subarray(Y,T),d),e.b=d+=O,e.p=v=8*T;continue}if(1==U)g=x,y=k,m=9,b=5;else{if(2!=U)throw"invalid block type";var Z=A(t,v,31)+257,I=A(t,v+10,15)+4,F=Z+A(t,v+5,31)+1;v+=14;for(var E=new n(F),G=new n(19),P=0;P<I;++P)G[a[P]]=A(t,v+3*P,7);v+=3*I;var j=M(G),q=(1<<j)-1,H=w(G,j,1);for(P=0;P<F;){var Y,B=H[A(t,v,q)];if(v+=15&B,(Y=B>>>4)<16)E[P++]=Y;else{var J=0,K=0;for(16==Y?(K=3+A(t,v,3),v+=2,J=E[P-1]):17==Y?(K=3+A(t,v,7),v+=3):18==Y&&(K=11+A(t,v,127),v+=7);K--;)E[P++]=J}}var L=E.subarray(0,Z),N=E.subarray(Z);m=M(L),b=M(N),g=w(L,m,1),y=w(N,b,1)}if(v>z){if(h)throw"unexpected EOF";break}}f&&c(d+131072);for(var Q=(1<<m)-1,R=(1<<b)-1,V=v;;V=v){var W=(J=g[S(t,v)&Q])>>>4;if((v+=15&J)>z){if(h)throw"unexpected EOF";break}if(!J)throw"invalid length/literal";if(W<256)r[d++]=W;else{if(256==W){V=v,g=null;break}var X=W-254;W>264&&(X=A(t,v,(1<<(tt=i[P=W-257]))-1)+u[P],v+=tt);var $=y[S(t,v)&R],_=$>>>4;if(!$)throw"invalid distance";if(v+=15&$,N=l[_],_>3){var tt=o[_];N+=S(t,v)&(1<<tt)-1,v+=tt}if(v>z){if(h)throw"unexpected EOF";break}f&&c(d+131072);for(var nt=d+X;d<nt;d+=4)r[d]=r[d-N],r[d+1]=r[d+1-N],r[d+2]=r[d+2-N],r[d+3]=r[d+3-N];d=nt}}e.l=g,e.p=V,e.b=d,g&&(p=1,e.m=m,e.d=y,e.n=b)}while(!p);return d==r.length?r:C(r,0,d)},O=function(t,n,r){var e=n/8|0;t[e]|=r<<=7&n,t[e+1]|=r>>>8},T=function(t,n,r){var e=n/8|0;t[e]|=r<<=7&n,t[e+1]|=r>>>8,t[e+2]|=r>>>16},Z=function(t,e){for(var i=[],o=0;o<t.length;++o)t[o]&&i.push({s:o,f:t[o]});var a=i.length,s=i.slice();if(!a)return[q,0];if(1==a){var f=new n(i[0].s+1);return f[i[0].s]=1,[f,1]}i.sort((function(t,n){return t.f-n.f})),i.push({s:-1,f:25001});var u=i[0],h=i[1],c=0,l=1,p=2;for(i[0]={s:-1,f:u.f+h.f,l:u,r:h};l!=a-1;)u=i[i[c].f<i[p].f?c++:p++],h=i[c!=l&&i[c].f<i[p].f?c++:p++],i[l++]={s:-1,f:u.f+h.f,l:u,r:h};var v=s[0].s;for(o=1;o<a;++o)s[o].s>v&&(v=s[o].s);var d=new r(v+1),g=I(i[l-1],d,0);if(g>e){o=0;var w=0,y=g-e,m=1<<y;for(s.sort((function(t,n){return d[n.s]-d[t.s]||t.f-n.f}));o<a;++o){var b=s[o].s;if(!(d[b]>e))break;w+=m-(1<<g-d[b]),d[b]=e}for(w>>>=y;w>0;){var x=s[o].s;d[x]<e?w-=1<<e-d[x]++-1:++o}for(;o>=0&&w;--o){var z=s[o].s;d[z]==e&&(--d[z],++w)}g=e}return[new n(d),g]},I=function(t,n,r){return-1==t.s?Math.max(I(t.l,n,r+1),I(t.r,n,r+1)):n[t.s]=r},F=function(t){for(var n=t.length;n&&!t[--n];);for(var e=new r(++n),i=0,o=t[0],a=1,s=function(t){e[i++]=t},f=1;f<=n;++f)if(t[f]==o&&f!=n)++a;else{if(!o&&a>2){for(;a>138;a-=138)s(32754);a>2&&(s(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(s(o),--a;a>6;a-=6)s(8304);a>2&&(s(a-3<<5|8208),a=0)}for(;a--;)s(o);a=1,o=t[f]}return[e.subarray(0,i),n]},E=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},G=function(t,n,r){var e=r.length,i=D(n+2);t[i]=255&e,t[i+1]=e>>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var o=0;o<e;++o)t[i+o+4]=r[o];return 8*(i+4+e)},P=function(t,n,e,s,f,u,h,c,l,p,v){O(n,v++,e),++f[256];for(var d=Z(f,15),g=d[0],x=d[1],k=Z(u,15),M=k[0],A=k[1],S=F(g),D=S[0],C=S[1],U=F(M),I=U[0],P=U[1],j=new r(19),q=0;q<D.length;++q)j[31&D[q]]++;for(q=0;q<I.length;++q)j[31&I[q]]++;for(var H=Z(j,7),Y=H[0],B=H[1],J=19;J>4&&!Y[a[J-1]];--J);var K,L,N,Q,R=p+5<<3,V=E(f,y)+E(u,m)+h,W=E(f,g)+E(u,M)+h+14+3*J+E(j,Y)+(2*j[16]+3*j[17]+7*j[18]);if(R<=V&&R<=W)return G(n,v,t.subarray(l,l+p));if(O(n,v,1+(W<V)),v+=2,W<V){K=w(g,x,0),L=g,N=w(M,A,0),Q=M;var X=w(Y,B,0);for(O(n,v,C-257),O(n,v+5,P-1),O(n,v+10,J-4),v+=14,q=0;q<J;++q)O(n,v+3*q,Y[a[q]]);v+=3*J;for(var $=[D,I],_=0;_<2;++_){var tt=$[_];for(q=0;q<tt.length;++q)O(n,v,X[nt=31&tt[q]]),v+=Y[nt],nt>15&&(O(n,v,tt[q]>>>5&127),v+=tt[q]>>>12)}}else K=b,L=y,N=z,Q=m;for(q=0;q<c;++q)if(s[q]>255){var nt;T(n,v,K[257+(nt=s[q]>>>18&31)]),v+=L[nt+257],nt>7&&(O(n,v,s[q]>>>23&31),v+=i[nt]);var rt=31&s[q];T(n,v,N[rt]),v+=Q[rt],rt>3&&(T(n,v,s[q]>>>5&8191),v+=o[rt])}else T(n,v,K[s[q]]),v+=L[s[q]];return T(n,v,K[256]),v+L[256]},j=new e([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),q=new n(0),H=function(t,a,s,f,u,c){var l=t.length,v=new n(f+l+5*(1+Math.ceil(l/7e3))+u),d=v.subarray(f,v.length-u),g=0;if(!a||l<8)for(var w=0;w<=l;w+=65535){var y=w+65535;y<l?g=G(d,g,t.subarray(w,y)):(d[w]=c,g=G(d,g,t.subarray(w,l)))}else{for(var m=j[a-1],b=m>>>13,x=8191&m,z=(1<<s)-1,k=new r(32768),M=new r(z+1),A=Math.ceil(s/3),S=2*A,U=function(n){return(t[n]^t[n+1]<<A^t[n+2]<<S)&z},O=new e(25e3),T=new r(288),Z=new r(32),I=0,F=0,E=(w=0,0),H=0,Y=0;w<l;++w){var B=U(w),J=32767&w,K=M[B];if(k[J]=K,M[B]=J,H<=w){var L=l-w;if((I>7e3||E>24576)&&L>423){g=P(t,d,0,O,T,Z,F,E,Y,w-Y,g),E=I=F=0,Y=w;for(var N=0;N<286;++N)T[N]=0;for(N=0;N<30;++N)Z[N]=0}var Q=2,R=0,V=x,W=J-K&32767;if(L>2&&B==U(w-W))for(var X=Math.min(b,L)-1,$=Math.min(32767,w),_=Math.min(258,L);W<=$&&--V&&J!=K;){if(t[w+Q]==t[w+Q-W]){for(var tt=0;tt<_&&t[w+tt]==t[w+tt-W];++tt);if(tt>Q){if(Q=tt,R=W,tt>X)break;var nt=Math.min(W,tt-2),rt=0;for(N=0;N<nt;++N){var et=w-W+N+32768&32767,it=et-k[et]+32768&32767;it>rt&&(rt=it,K=et)}}}W+=(J=K)-(K=k[J])+32768&32767}if(R){O[E++]=268435456|h[Q]<<18|p[R];var ot=31&h[Q],at=31&p[R];F+=i[ot]+o[at],++T[257+ot],++Z[at],H=w+Q,++I}else O[E++]=t[w],++T[t[w]]}}g=P(t,d,c,O,T,Z,F,E,Y,w-Y,g),!c&&7&g&&(g=G(d,g+1,q))}return C(v,0,f+D(g)+u)},Y=function(){for(var t=new e(256),n=0;n<256;++n){for(var r=n,i=9;--i;)r=(1&r&&3988292384)^r>>>1;t[n]=r}return t}(),B=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=Y[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}},J=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,o=r.length,a=0;a!=o;){for(var s=Math.min(a+2655,o);a<s;++a)i+=e+=r[a];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|t>>>8<<16|(255&(n%=65521))<<8|n>>>8}}},K=function(t,n,r,e,i){return H(t,null==n.level?6:n.level,null==n.mem?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(t.length)))):12+n.mem,r,e,!i)},L=function(t,n){var r={};for(var e in t)r[e]=t[e];for(var e in n)r[e]=n[e];return r},N=function(t,n,r){for(var e=t(),i=""+t,o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/ /g,"").split(","),a=0;a<e.length;++a){var s=e[a],f=o[a];if("function"==typeof s){n+=";"+f+"=";var u=""+s;if(s.prototype)if(-1!=u.indexOf("[native code]")){var h=u.indexOf(" ",8)+1;n+=u.slice(h,u.indexOf("(",h))}else for(var c in n+=u,s.prototype)n+=";"+f+".prototype."+c+"="+s.prototype[c];else n+=u}else r[f]=s}return[n,r]},Q=[],R=function(t){var i=[];for(var o in t)(t[o]instanceof n||t[o]instanceof r||t[o]instanceof e)&&i.push((t[o]=new t[o].constructor(t[o])).buffer);return i},V=function(n,r,e,i){var o;if(!Q[e]){for(var a="",s={},f=n.length-1,u=0;u<f;++u)a=(o=N(n[u],a,s))[0],s=o[1];Q[e]=N(n[f],a,s)}var h=L({},Q[e][1]);return t.default(Q[e][0]+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+r+"}",e,h,R(h),i)},W=function(){return[n,r,e,i,o,a,u,l,x,k,v,w,M,A,S,D,C,U,At,rt,et]},X=function(){return[n,r,e,i,o,a,h,p,b,y,z,m,v,j,q,w,O,T,Z,I,F,E,G,P,D,C,H,K,xt,rt]},$=function(){return[ct,vt,ht,B,Y]},_=function(){return[lt,pt]},tt=function(){return[dt,ht,J]},nt=function(){return[gt]},rt=function(t){return postMessage(t,[t.buffer])},et=function(t){return t&&t.size&&new n(t.size)},it=function(t,n,r,e,i,o){var a=V(r,e,i,(function(t,n){a.terminate(),o(t,n)}));return a.postMessage([t,n],n.consume?[t.buffer]:[]),function(){a.terminate()}},ot=function(t){return t.ondata=function(t,n){return postMessage([t,n],[t.buffer])},function(n){return t.push(n.data[0],n.data[1])}},at=function(t,n,r,e,i){var o,a=V(t,e,i,(function(t,r){t?(a.terminate(),n.ondata.call(n,t)):(r[1]&&a.terminate(),n.ondata.call(n,t,r[0],r[1]))}));a.postMessage(r),n.push=function(t,r){if(o)throw"stream finished";if(!n.ondata)throw"no stream handler";a.postMessage([t,o=r],[t.buffer])},n.terminate=function(){a.terminate()}},st=function(t,n){return t[n]|t[n+1]<<8},ft=function(t,n){return(t[n]|t[n+1]<<8|t[n+2]<<16|t[n+3]<<24)>>>0},ut=function(t,n){return ft(t,n)+4294967296*ft(t,n+4)},ht=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},ct=function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&ht(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}},lt=function(t){if(31!=t[0]||139!=t[1]||8!=t[2])throw"invalid gzip data";var n=t[3],r=10;4&n&&(r+=t[10]|2+(t[11]<<8));for(var e=(n>>3&1)+(n>>4&1);e>0;e-=!t[r++]);return r+(2&n)},pt=function(t){var n=t.length;return(t[n-4]|t[n-3]<<8|t[n-2]<<16|t[n-1]<<24)>>>0},vt=function(t){return 10+(t.filename&&t.filename.length+1||0)},dt=function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;t[0]=120,t[1]=e<<6|(e?32-2*e:1)},gt=function(t){if(8!=(15&t[0])||t[0]>>>4>7||(t[0]<<8|t[1])%31)throw"invalid zlib data";if(32&t[1])throw"invalid zlib data: preset dictionaries not supported"};function wt(t,n){return n||"function"!=typeof t||(n=t,t={}),this.ondata=n,t}var yt=function(){function t(t,n){n||"function"!=typeof t||(n=t,t={}),this.ondata=n,this.o=t||{}}return t.prototype.p=function(t,n){this.ondata(K(t,this.o,0,0,!n),n)},t.prototype.push=function(t,n){if(this.d)throw"stream finished";if(!this.ondata)throw"no stream handler";this.d=n,this.p(t,n||!1)},t}();_e.Deflate=yt;var mt=function(){return function(t,n){at([X,function(){return[ot,yt]}],this,wt.call(this,t,n),(function(t){var n=new yt(t.data);onmessage=ot(n)}),6)}}();function bt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[X],(function(t){return rt(xt(t.data[0],t.data[1]))}),0,r)}function xt(t,n){return K(t,n||{},0,0)}_e.AsyncDeflate=mt,_e.deflate=bt,_e.deflateSync=xt;var zt=function(){function t(t){this.s={},this.p=new n(0),this.ondata=t}return t.prototype.e=function(t){if(this.d)throw"stream finished";if(!this.ondata)throw"no stream handler";var r=this.p.length,e=new n(r+t.length);e.set(this.p),e.set(t,r),this.p=e},t.prototype.c=function(t){this.d=this.s.i=t||!1;var n=this.s.b,r=U(this.p,this.o,this.s);this.ondata(C(r,n,this.s.b),this.d),this.o=C(r,this.s.b-32768),this.s.b=this.o.length,this.p=C(this.p,this.s.p/8|0),this.s.p&=7},t.prototype.push=function(t,n){this.e(t),this.c(n)},t}();_e.Inflate=zt;var kt=function(){return function(t){this.ondata=t,at([W,function(){return[ot,zt]}],this,0,(function(){var t=new zt;onmessage=ot(t)}),7)}}();function Mt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[W],(function(t){return rt(At(t.data[0],et(t.data[1])))}),1,r)}function At(t,n){return U(t,n)}_e.AsyncInflate=kt,_e.inflate=Mt,_e.inflateSync=At;var St=function(){function t(t,n){this.c=B(),this.l=0,this.v=1,yt.call(this,t,n)}return t.prototype.push=function(t,n){yt.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){this.c.p(t),this.l+=t.length;var r=K(t,this.o,this.v&&vt(this.o),n&&8,!n);this.v&&(ct(r,this.o),this.v=0),n&&(ht(r,r.length-8,this.c.d()),ht(r,r.length-4,this.l)),this.ondata(r,n)},t}();_e.Gzip=St,_e.Compress=St;var Dt=function(){return function(t,n){at([X,$,function(){return[ot,yt,St]}],this,wt.call(this,t,n),(function(t){var n=new St(t.data);onmessage=ot(n)}),8)}}();function Ct(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[X,$,function(){return[Ut]}],(function(t){return rt(Ut(t.data[0],t.data[1]))}),2,r)}function Ut(t,n){n||(n={});var r=B(),e=t.length;r.p(t);var i=K(t,n,vt(n),8),o=i.length;return ct(i,n),ht(i,o-8,r.d()),ht(i,o-4,e),i}_e.AsyncGzip=Dt,_e.AsyncCompress=Dt,_e.gzip=Ct,_e.compress=Ct,_e.gzipSync=Ut,_e.compressSync=Ut;var Ot=function(){function t(t){this.v=1,zt.call(this,t)}return t.prototype.push=function(t,n){if(zt.prototype.e.call(this,t),this.v){var r=this.p.length>3?lt(this.p):4;if(r>=this.p.length&&!n)return;this.p=this.p.subarray(r),this.v=0}if(n){if(this.p.length<8)throw"invalid gzip stream";this.p=this.p.subarray(0,-8)}zt.prototype.c.call(this,n)},t}();_e.Gunzip=Ot;var Tt=function(){return function(t){this.ondata=t,at([W,_,function(){return[ot,zt,Ot]}],this,0,(function(){var t=new Ot;onmessage=ot(t)}),9)}}();function Zt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[W,_,function(){return[It]}],(function(t){return rt(It(t.data[0]))}),3,r)}function It(t,r){return U(t.subarray(lt(t),-8),r||new n(pt(t)))}_e.AsyncGunzip=Tt,_e.gunzip=Zt,_e.gunzipSync=It;var Ft=function(){function t(t,n){this.c=J(),this.v=1,yt.call(this,t,n)}return t.prototype.push=function(t,n){yt.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){this.c.p(t);var r=K(t,this.o,this.v&&2,n&&4,!n);this.v&&(dt(r,this.o),this.v=0),n&&ht(r,r.length-4,this.c.d()),this.ondata(r,n)},t}();_e.Zlib=Ft;var Et=function(){return function(t,n){at([X,tt,function(){return[ot,yt,Ft]}],this,wt.call(this,t,n),(function(t){var n=new Ft(t.data);onmessage=ot(n)}),10)}}();function Gt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[X,tt,function(){return[Pt]}],(function(t){return rt(Pt(t.data[0],t.data[1]))}),4,r)}function Pt(t,n){n||(n={});var r=J();r.p(t);var e=K(t,n,2,4);return dt(e,n),ht(e,e.length-4,r.d()),e}_e.AsyncZlib=Et,_e.zlib=Gt,_e.zlibSync=Pt;var jt=function(){function t(t){this.v=1,zt.call(this,t)}return t.prototype.push=function(t,n){if(zt.prototype.e.call(this,t),this.v){if(this.p.length<2&&!n)return;this.p=this.p.subarray(2),this.v=0}if(n){if(this.p.length<4)throw"invalid zlib stream";this.p=this.p.subarray(0,-4)}zt.prototype.c.call(this,n)},t}();_e.Unzlib=jt;var qt=function(){return function(t){this.ondata=t,at([W,nt,function(){return[ot,zt,jt]}],this,0,(function(){var t=new jt;onmessage=ot(t)}),11)}}();function Ht(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return it(t,n,[W,nt,function(){return[Yt]}],(function(t){return rt(Yt(t.data[0],et(t.data[1])))}),5,r)}function Yt(t,n){return U((gt(t),t.subarray(2,-4)),n)}_e.AsyncUnzlib=qt,_e.unzlib=Ht,_e.unzlibSync=Yt;var Bt=function(){function t(t){this.G=Ot,this.I=zt,this.Z=jt,this.ondata=t}return t.prototype.push=function(t,r){if(!this.ondata)throw"no stream handler";if(this.s)this.s.push(t,r);else{if(this.p&&this.p.length){var e=new n(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length)}else this.p=t;if(this.p.length>2){var i=this,o=function(){i.ondata.apply(i,arguments)};this.s=31==this.p[0]&&139==this.p[1]&&8==this.p[2]?new this.G(o):8!=(15&this.p[0])||this.p[0]>>4>7||(this.p[0]<<8|this.p[1])%31?new this.I(o):new this.Z(o),this.s.push(this.p,r),this.p=null}}},t}();_e.Decompress=Bt;var Jt=function(){function t(t){this.G=Tt,this.I=kt,this.Z=qt,this.ondata=t}return t.prototype.push=function(t,n){Bt.prototype.push.call(this,t,n)},t}();function Kt(t,n,r){if(r||(r=n,n={}),"function"!=typeof r)throw"no callback";return 31==t[0]&&139==t[1]&&8==t[2]?Zt(t,n,r):8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31?Mt(t,n,r):Ht(t,n,r)}function Lt(t,n){return 31==t[0]&&139==t[1]&&8==t[2]?It(t,n):8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31?At(t,n):Yt(t,n)}_e.AsyncDecompress=Jt,_e.decompress=Kt,_e.decompressSync=Lt;var Nt=function(t,r,e,i){for(var o in t){var a=t[o],s=r+o;a instanceof n?e[s]=[a,i]:Array.isArray(a)?e[s]=[a[0],L(i,a[1])]:Nt(a,s+"/",e,i)}},Qt="undefined"!=typeof TextEncoder&&new TextEncoder,Rt="undefined"!=typeof TextDecoder&&new TextDecoder,Vt=0;try{Rt.decode(q,{stream:!0}),Vt=1}catch(t){}var Wt=function(t){for(var n="",r=0;;){var e=t[r++],i=(e>127)+(e>223)+(e>239);if(r+i>t.length)return[n,C(t,r-1)];i?3==i?(e=((15&e)<<18|(63&t[r++])<<12|(63&t[r++])<<6|63&t[r++])-65536,n+=String.fromCharCode(55296|e>>10,56320|1023&e)):n+=String.fromCharCode(1&i?(31&e)<<6|63&t[r++]:(15&e)<<12|(63&t[r++])<<6|63&t[r++]):n+=String.fromCharCode(e)}},Xt=function(){function t(t){this.ondata=t,Vt?this.t=new TextDecoder:this.p=q}return t.prototype.push=function(t,r){if(!this.ondata)throw"no callback";if(r=!!r,this.t){if(this.ondata(this.t.decode(t,{stream:!0}),r),r){if(this.t.decode().length)throw"invalid utf-8 data";this.t=null}}else{if(!this.p)throw"stream finished";var e=new n(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length);var i=Wt(e),o=i[0],a=i[1];if(r){if(a.length)throw"invalid utf-8 data";this.p=null}else this.p=a;this.ondata(o,r)}},t}();_e.DecodeUTF8=Xt;var $t=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){if(!this.ondata)throw"no callback";if(this.d)throw"stream finished";this.ondata(_t(t),this.d=n||!1)},t}();function _t(t,r){if(r){for(var e=new n(t.length),i=0;i<t.length;++i)e[i]=t.charCodeAt(i);return e}if(Qt)return Qt.encode(t);var o=t.length,a=new n(t.length+(t.length>>1)),s=0,f=function(t){a[s++]=t};for(i=0;i<o;++i){if(s+5>a.length){var u=new n(s+8+(o-i<<1));u.set(a),a=u}var h=t.charCodeAt(i);h<128||r?f(h):h<2048?(f(192|h>>6),f(128|63&h)):h>55295&&h<57344?(f(240|(h=65536+(1047552&h)|1023&t.charCodeAt(++i))>>18),f(128|h>>12&63),f(128|h>>6&63),f(128|63&h)):(f(224|h>>12),f(128|h>>6&63),f(128|63&h))}return C(a,0,s)}function tn(t,n){if(n){for(var r="",e=0;e<t.length;e+=16384)r+=String.fromCharCode.apply(null,t.subarray(e,e+16384));return r}if(Rt)return Rt.decode(t);var i=Wt(t);if(i[1].length)throw"invalid utf-8 data";return i[0]}_e.EncodeUTF8=$t,_e.strToU8=_t,_e.strFromU8=tn;var nn=function(t){return 1==t?3:t<6?2:9==t?1:0},rn=function(t,n){return n+30+st(t,n+26)+st(t,n+28)},en=function(t,n,r){var e=st(t,n+28),i=tn(t.subarray(n+46,n+46+e),!(2048&st(t,n+8))),o=n+46+e,a=ft(t,n+20),s=r&&4294967295==a?on(t,o):[a,ft(t,n+24),ft(t,n+42)],f=s[0],u=s[1],h=s[2];return[st(t,n+10),f,u,i,o+st(t,n+30)+st(t,n+32),h]},on=function(t,n){for(;1!=st(t,n);n+=4+st(t,n+2));return[ut(t,n+12),ut(t,n+4),ut(t,n+20)]},an=function(t){var n=0;if(t)for(var r in t){var e=t[r].length;if(e>65535)throw"extra field too long";n+=e+4}return n},sn=function(t,n,r,e,i,o,a,s){var f=e.length,u=r.extra,h=s&&s.length,c=an(u);ht(t,n,null!=a?33639248:67324752),n+=4,null!=a&&(t[n++]=20,t[n++]=r.os),t[n]=20,n+=2,t[n++]=r.flag<<1|(null==o&&8),t[n++]=i&&8,t[n++]=255&r.compression,t[n++]=r.compression>>8;var l=new Date(null==r.mtime?Date.now():r.mtime),p=l.getFullYear()-1980;if(p<0||p>119)throw"date not in range 1980-2099";if(ht(t,n,p<<25|l.getMonth()+1<<21|l.getDate()<<16|l.getHours()<<11|l.getMinutes()<<5|l.getSeconds()>>>1),n+=4,null!=o&&(ht(t,n,r.crc),ht(t,n+4,o),ht(t,n+8,r.size)),ht(t,n+12,f),ht(t,n+14,c),n+=16,null!=a&&(ht(t,n,h),ht(t,n+6,r.attrs),ht(t,n+10,a),n+=14),t.set(e,n),n+=f,c)for(var v in u){var d=u[v],g=d.length;ht(t,n,+v),ht(t,n+2,g),t.set(d,n+4),n+=4+g}return h&&(t.set(s,n),n+=h),n},fn=function(t,n,r,e,i){ht(t,n,101010256),ht(t,n+8,r),ht(t,n+10,r),ht(t,n+12,e),ht(t,n+16,i)},un=function(){function t(t){this.filename=t,this.c=B(),this.size=0,this.compression=0}return t.prototype.process=function(t,n){this.ondata(null,t,n)},t.prototype.push=function(t,n){if(!this.ondata)throw"no callback - add to ZIP archive before pushing";this.c.p(t),this.size+=t.length,n&&(this.crc=this.c.d()),this.process(t,n||!1)},t}();_e.ZipPassThrough=un;var hn=function(){function t(t,n){var r=this;n||(n={}),un.call(this,t),this.d=new yt(n,(function(t,n){r.ondata(null,t,n)})),this.compression=8,this.flag=nn(n.level)}return t.prototype.process=function(t,n){try{this.d.push(t,n)}catch(t){this.ondata(t,null,n)}},t.prototype.push=function(t,n){un.prototype.push.call(this,t,n)},t}();_e.ZipDeflate=hn;var cn=function(){function t(t,n){var r=this;n||(n={}),un.call(this,t),this.d=new mt(n,(function(t,n,e){r.ondata(t,n,e)})),this.compression=8,this.flag=nn(n.level),this.terminate=this.d.terminate}return t.prototype.process=function(t,n){this.d.push(t,n)},t.prototype.push=function(t,n){un.prototype.push.call(this,t,n)},t}();_e.AsyncZipDeflate=cn;var ln=function(){function t(t){this.ondata=t,this.u=[],this.d=1}return t.prototype.add=function(t){var r=this;if(2&this.d)throw"stream finished";var e=_t(t.filename),i=e.length,o=t.comment,a=o&&_t(o),s=i!=t.filename.length||a&&o.length!=a.length,f=i+an(t.extra)+30;if(i>65535)throw"filename too long";var u=new n(f);sn(u,0,t,e,s);var h=[u],c=function(){for(var t=0,n=h;t<n.length;t++)r.ondata(null,n[t],!1);h=[]},l=this.d;this.d=0;var p=this.u.length,v=L(t,{f:e,u:s,o:a,t:function(){t.terminate&&t.terminate()},r:function(){if(c(),l){var t=r.u[p+1];t?t.r():r.d=1}l=1}}),d=0;t.ondata=function(e,i,o){if(e)r.ondata(e,i,o),r.terminate();else if(d+=i.length,h.push(i),o){var a=new n(16);ht(a,0,134695760),ht(a,4,t.crc),ht(a,8,d),ht(a,12,t.size),h.push(a),v.c=d,v.b=f+d+16,v.crc=t.crc,v.size=t.size,l&&v.r(),l=1}else l&&c()},this.u.push(v)},t.prototype.end=function(){var t=this;if(2&this.d){if(1&this.d)throw"stream finishing";throw"stream finished"}this.d?this.e():this.u.push({r:function(){1&t.d&&(t.u.splice(-1,1),t.e())},t:function(){}}),this.d=3},t.prototype.e=function(){for(var t=0,r=0,e=0,i=0,o=this.u;i<o.length;i++)e+=46+(u=o[i]).f.length+an(u.extra)+(u.o?u.o.length:0);for(var a=new n(e+22),s=0,f=this.u;s<f.length;s++){var u;sn(a,t,u=f[s],u.f,u.u,u.c,r,u.o),t+=46+u.f.length+an(u.extra)+(u.o?u.o.length:0),r+=u.b}fn(a,t,this.u.length,e,r),this.ondata(null,a,!0),this.d=2},t.prototype.terminate=function(){for(var t=0,n=this.u;t<n.length;t++)n[t].t();this.d=2},t}();function pn(t,r,e){if(e||(e=r,r={}),"function"!=typeof e)throw"no callback";var i={};Nt(t,"",i,r);var o=Object.keys(i),a=o.length,s=0,f=0,u=a,h=Array(a),c=[],l=function(){for(var t=0;t<c.length;++t)c[t]()},p=function(){var t=new n(f+22),r=s,i=f-s;f=0;for(var o=0;o<u;++o){var a=h[o];try{var c=a.c.length;sn(t,f,a,a.f,a.u,c);var l=30+a.f.length+an(a.extra),p=f+l;t.set(a.c,p),sn(t,s,a,a.f,a.u,c,f,a.m),s+=16+l+(a.m?a.m.length:0),f=p+c}catch(t){return e(t,null)}}fn(t,s,h.length,i,r),e(null,t)};a||p();for(var v=function(t){var n=o[t],r=i[n],u=r[0],v=r[1],d=B(),g=u.length;d.p(u);var w=_t(n),y=w.length,m=v.comment,b=m&&_t(m),x=b&&b.length,z=an(v.extra),k=0==v.level?0:8,M=function(r,i){if(r)l(),e(r,null);else{var o=i.length;h[t]=L(v,{size:g,crc:d.d(),c:i,f:w,m:b,u:y!=n.length||b&&m.length!=x,compression:k}),s+=30+y+z+o,f+=76+2*(y+z)+(x||0)+o,--a||p()}};if(y>65535&&M("filename too long",null),k)if(g<16e4)try{M(null,xt(u,v))}catch(t){M(t,null)}else c.push(bt(u,v,M));else M(null,u)},d=0;d<u;++d)v(d);return l}function vn(t,r){r||(r={});var e={},i=[];Nt(t,"",e,r);var o=0,a=0;for(var s in e){var f=e[s],u=f[0],h=f[1],c=0==h.level?0:8,l=(M=_t(s)).length,p=h.comment,v=p&&_t(p),d=v&&v.length,g=an(h.extra);if(l>65535)throw"filename too long";var w=c?xt(u,h):u,y=w.length,m=B();m.p(u),i.push(L(h,{size:u.length,crc:m.d(),c:w,f:M,m:v,u:l!=s.length||v&&p.length!=d,o:o,compression:c})),o+=30+l+g+y,a+=76+2*(l+g)+(d||0)+y}for(var b=new n(a+22),x=o,z=a-o,k=0;k<i.length;++k){var M;sn(b,(M=i[k]).o,M,M.f,M.u,M.c.length);var A=30+M.f.length+an(M.extra);b.set(M.c,M.o+A),sn(b,o,M,M.f,M.u,M.c.length,M.o,M.m),o+=16+A+(M.m?M.m.length:0)}return fn(b,o,i.length,z,x),b}_e.Zip=ln,_e.zip=pn,_e.zipSync=vn;var dn=function(){function t(){}return t.prototype.push=function(t,n){this.ondata(null,t,n)},t.compression=0,t}();_e.UnzipPassThrough=dn;var gn=function(){function t(){var t=this;this.i=new zt((function(n,r){t.ondata(null,n,r)}))}return t.prototype.push=function(t,n){try{this.i.push(t,n)}catch(r){this.ondata(r,t,n)}},t.compression=8,t}();_e.UnzipInflate=gn;var wn=function(){function t(t,n){var r=this;n<32e4?this.i=new zt((function(t,n){r.ondata(null,t,n)})):(this.i=new kt((function(t,n,e){r.ondata(t,n,e)})),this.terminate=this.i.terminate)}return t.prototype.push=function(t,n){this.i.terminate&&(t=C(t,0)),this.i.push(t,n)},t.compression=8,t}();_e.AsyncUnzipInflate=wn;var yn=function(){function t(t){this.onfile=t,this.k=[],this.o={0:dn},this.p=q}return t.prototype.push=function(t,r){var e=this;if(!this.onfile)throw"no callback";if(!this.p)throw"stream finished";if(this.c>0){var i=Math.min(this.c,t.length),o=t.subarray(0,i);if(this.c-=i,this.d?this.d.push(o,!this.c):this.k[0].push(o),(t=t.subarray(i)).length)return this.push(t,r)}else{var a=0,s=0,f=void 0,u=void 0;this.p.length?t.length?((u=new n(this.p.length+t.length)).set(this.p),u.set(t,this.p.length)):u=this.p:u=t;for(var h=u.length,c=this.c,l=c&&this.d,p=function(){var t,n=ft(u,s);if(67324752==n){a=1,f=s,v.d=null,v.c=0;var r=st(u,s+6),i=st(u,s+8),o=2048&r,l=8&r,p=st(u,s+26),d=st(u,s+28);if(h>s+30+p+d){var g=[];v.k.unshift(g),a=2;var w,y=ft(u,s+18),m=ft(u,s+22),b=tn(u.subarray(s+30,s+=30+p),!o);4294967295==y?(t=l?[-2]:on(u,s),y=t[0],m=t[1]):l&&(y=-1),s+=d,v.c=y;var x={name:b,compression:i,start:function(){if(!x.ondata)throw"no callback";if(y){var t=e.o[i];if(!t)throw"unknown compression type "+i;(w=y<0?new t(b):new t(b,y,m)).ondata=function(t,n,r){x.ondata(t,n,r)};for(var n=0,r=g;n<r.length;n++)w.push(r[n],!1);e.k[0]==g&&e.c?e.d=w:w.push(q,!0)}else x.ondata(null,q,!0)},terminate:function(){w&&w.terminate&&w.terminate()}};y>=0&&(x.size=y,x.originalSize=m),v.onfile(x)}return"break"}if(c){if(134695760==n)return f=s+=12+(-2==c&&8),a=3,v.c=0,"break";if(33639248==n)return f=s-=4,a=3,v.c=0,"break"}},v=this;s<h-4&&"break"!==p();++s);if(this.p=q,c<0){var d=u.subarray(0,a?f-12-(-2==c&&8)-(134695760==ft(u,f-16)&&4):s);l?l.push(d,!!a):this.k[+(2==a)].push(d)}if(2&a)return this.push(u.subarray(s),r);this.p=u.subarray(s)}if(r){if(this.c)throw"invalid zip file";this.p=null}},t.prototype.register=function(t){this.o[t.compression]=t},t}();function mn(t,r){if("function"!=typeof r)throw"no callback";for(var e=[],i=function(){for(var t=0;t<e.length;++t)e[t]()},o={},a=t.length-22;101010256!=ft(t,a);--a)if(!a||t.length-a>65558)return void r("invalid zip file",null);var s=st(t,a+8);s||r(null,{});var f=s,u=ft(t,a+16),h=4294967295==u;if(h){if(a=ft(t,a-12),101075792!=ft(t,a))return void r("invalid zip file",null);f=s=ft(t,a+32),u=ft(t,a+48)}for(var c=function(a){var f=en(t,u,h),c=f[0],l=f[1],p=f[2],v=f[3],d=f[4],g=rn(t,f[5]);u=d;var w=function(t,n){t?(i(),r(t,null)):(o[v]=n,--s||r(null,o))};if(c)if(8==c){var y=t.subarray(g,g+l);if(l<32e4)try{w(null,At(y,new n(p)))}catch(t){w(t,null)}else e.push(Mt(y,{size:p},w))}else w("unknown compression type "+c,null);else w(null,C(t,g,g+l))},l=0;l<f;++l)c();return i}function bn(t){for(var r={},e=t.length-22;101010256!=ft(t,e);--e)if(!e||t.length-e>65558)throw"invalid zip file";var i=st(t,e+8);if(!i)return{};var o=ft(t,e+16),a=4294967295==o;if(a){if(e=ft(t,e-12),101075792!=ft(t,e))throw"invalid zip file";i=ft(t,e+32),o=ft(t,e+48)}for(var s=0;s<i;++s){var f=en(t,o,a),u=f[0],h=f[1],c=f[2],l=f[3],p=f[4],v=rn(t,f[5]);if(o=p,u){if(8!=u)throw"unknown compression type "+u;r[l]=At(t.subarray(v,v+h),new n(c))}else r[l]=C(t,v,v+h)}return r}_e.Unzip=yn,_e.unzip=mn,_e.unzipSync=bn;return _e})

;
( function () {

	/**
 * OpenEXR loader currently supports uncompressed, ZIP(S), RLE, PIZ and DWA/B compression.
 * Supports reading as UnsignedByte, HalfFloat and Float type data texture.
 *
 * Referred to the original Industrial Light & Magic OpenEXR implementation and the TinyEXR / Syoyo Fujita
 * implementation, so I have preserved their copyright notices.
 */

	// /*
	// Copyright (c) 2014 - 2017, Syoyo Fujita
	// All rights reserved.

	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions are met:
	//     * Redistributions of source code must retain the above copyright
	//       notice, this list of conditions and the following disclaimer.
	//     * Redistributions in binary form must reproduce the above copyright
	//       notice, this list of conditions and the following disclaimer in the
	//       documentation and/or other materials provided with the distribution.
	//     * Neither the name of the Syoyo Fujita nor the
	//       names of its contributors may be used to endorse or promote products
	//       derived from this software without specific prior written permission.

	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	// DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	// */

	// // TinyEXR contains some OpenEXR code, which is licensed under ------------

	// ///////////////////////////////////////////////////////////////////////////
	// //
	// // Copyright (c) 2002, Industrial Light & Magic, a division of Lucas
	// // Digital Ltd. LLC
	// //
	// // All rights reserved.
	// //
	// // Redistribution and use in source and binary forms, with or without
	// // modification, are permitted provided that the following conditions are
	// // met:
	// // *       Redistributions of source code must retain the above copyright
	// // notice, this list of conditions and the following disclaimer.
	// // *       Redistributions in binary form must reproduce the above
	// // copyright notice, this list of conditions and the following disclaimer
	// // in the documentation and/or other materials provided with the
	// // distribution.
	// // *       Neither the name of Industrial Light & Magic nor the names of
	// // its contributors may be used to endorse or promote products derived
	// // from this software without specific prior written permission.
	// //
	// // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	// // "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	// // LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	// // A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	// // OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	// // SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	// // LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	// // DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	// // THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	// // (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	// // OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	// //
	// ///////////////////////////////////////////////////////////////////////////

	// // End of OpenEXR license -------------------------------------------------

	class EXRLoader extends THREE.DataTextureLoader {

		constructor( manager ) {

			super( manager );
			this.type = THREE.HalfFloatType;

		}
		parse( buffer ) {

			const USHORT_RANGE = 1 << 16;
			const BITMAP_SIZE = USHORT_RANGE >> 3;
			const HUF_ENCBITS = 16; // literal (value) bit length
			const HUF_DECBITS = 14; // decoding bit size (>= 8)

			const HUF_ENCSIZE = ( 1 << HUF_ENCBITS ) + 1; // encoding table size
			const HUF_DECSIZE = 1 << HUF_DECBITS; // decoding table size
			const HUF_DECMASK = HUF_DECSIZE - 1;
			const NBITS = 16;
			const A_OFFSET = 1 << NBITS - 1;
			const MOD_MASK = ( 1 << NBITS ) - 1;
			const SHORT_ZEROCODE_RUN = 59;
			const LONG_ZEROCODE_RUN = 63;
			const SHORTEST_LONG_RUN = 2 + LONG_ZEROCODE_RUN - SHORT_ZEROCODE_RUN;
			const ULONG_SIZE = 8;
			const FLOAT32_SIZE = 4;
			const INT32_SIZE = 4;
			const INT16_SIZE = 2;
			const INT8_SIZE = 1;
			const STATIC_HUFFMAN = 0;
			const DEFLATE = 1;
			const UNKNOWN = 0;
			const LOSSY_DCT = 1;
			const RLE = 2;
			const logBase = Math.pow( 2.7182818, 2.2 );
			function reverseLutFromBitmap( bitmap, lut ) {

				let k = 0;
				for ( let i = 0; i < USHORT_RANGE; ++ i ) {

					if ( i == 0 || bitmap[ i >> 3 ] & 1 << ( i & 7 ) ) {

						lut[ k ++ ] = i;

					}

				}

				const n = k - 1;
				while ( k < USHORT_RANGE ) lut[ k ++ ] = 0;
				return n;

			}

			function hufClearDecTable( hdec ) {

				for ( let i = 0; i < HUF_DECSIZE; i ++ ) {

					hdec[ i ] = {};
					hdec[ i ].len = 0;
					hdec[ i ].lit = 0;
					hdec[ i ].p = null;

				}

			}

			const getBitsReturn = {
				l: 0,
				c: 0,
				lc: 0
			};
			function getBits( nBits, c, lc, uInt8Array, inOffset ) {

				while ( lc < nBits ) {

					c = c << 8 | parseUint8Array( uInt8Array, inOffset );
					lc += 8;

				}

				lc -= nBits;
				getBitsReturn.l = c >> lc & ( 1 << nBits ) - 1;
				getBitsReturn.c = c;
				getBitsReturn.lc = lc;

			}

			const hufTableBuffer = new Array( 59 );
			function hufCanonicalCodeTable( hcode ) {

				for ( let i = 0; i <= 58; ++ i ) hufTableBuffer[ i ] = 0;
				for ( let i = 0; i < HUF_ENCSIZE; ++ i ) hufTableBuffer[ hcode[ i ] ] += 1;
				let c = 0;
				for ( let i = 58; i > 0; -- i ) {

					const nc = c + hufTableBuffer[ i ] >> 1;
					hufTableBuffer[ i ] = c;
					c = nc;

				}

				for ( let i = 0; i < HUF_ENCSIZE; ++ i ) {

					const l = hcode[ i ];
					if ( l > 0 ) hcode[ i ] = l | hufTableBuffer[ l ] ++ << 6;

				}

			}

			function hufUnpackEncTable( uInt8Array, inOffset, ni, im, iM, hcode ) {

				const p = inOffset;
				let c = 0;
				let lc = 0;
				for ( ; im <= iM; im ++ ) {

					if ( p.value - inOffset.value > ni ) return false;
					getBits( 6, c, lc, uInt8Array, p );
					const l = getBitsReturn.l;
					c = getBitsReturn.c;
					lc = getBitsReturn.lc;
					hcode[ im ] = l;
					if ( l == LONG_ZEROCODE_RUN ) {

						if ( p.value - inOffset.value > ni ) {

							throw new Error( 'Something wrong with hufUnpackEncTable' );

						}

						getBits( 8, c, lc, uInt8Array, p );
						let zerun = getBitsReturn.l + SHORTEST_LONG_RUN;
						c = getBitsReturn.c;
						lc = getBitsReturn.lc;
						if ( im + zerun > iM + 1 ) {

							throw new Error( 'Something wrong with hufUnpackEncTable' );

						}

						while ( zerun -- ) hcode[ im ++ ] = 0;
						im --;

					} else if ( l >= SHORT_ZEROCODE_RUN ) {

						let zerun = l - SHORT_ZEROCODE_RUN + 2;
						if ( im + zerun > iM + 1 ) {

							throw new Error( 'Something wrong with hufUnpackEncTable' );

						}

						while ( zerun -- ) hcode[ im ++ ] = 0;
						im --;

					}

				}

				hufCanonicalCodeTable( hcode );

			}

			function hufLength( code ) {

				return code & 63;

			}

			function hufCode( code ) {

				return code >> 6;

			}

			function hufBuildDecTable( hcode, im, iM, hdecod ) {

				for ( ; im <= iM; im ++ ) {

					const c = hufCode( hcode[ im ] );
					const l = hufLength( hcode[ im ] );
					if ( c >> l ) {

						throw new Error( 'Invalid table entry' );

					}

					if ( l > HUF_DECBITS ) {

						const pl = hdecod[ c >> l - HUF_DECBITS ];
						if ( pl.len ) {

							throw new Error( 'Invalid table entry' );

						}

						pl.lit ++;
						if ( pl.p ) {

							const p = pl.p;
							pl.p = new Array( pl.lit );
							for ( let i = 0; i < pl.lit - 1; ++ i ) {

								pl.p[ i ] = p[ i ];

							}

						} else {

							pl.p = new Array( 1 );

						}

						pl.p[ pl.lit - 1 ] = im;

					} else if ( l ) {

						let plOffset = 0;
						for ( let i = 1 << HUF_DECBITS - l; i > 0; i -- ) {

							const pl = hdecod[ ( c << HUF_DECBITS - l ) + plOffset ];
							if ( pl.len || pl.p ) {

								throw new Error( 'Invalid table entry' );

							}

							pl.len = l;
							pl.lit = im;
							plOffset ++;

						}

					}

				}

				return true;

			}

			const getCharReturn = {
				c: 0,
				lc: 0
			};
			function getChar( c, lc, uInt8Array, inOffset ) {

				c = c << 8 | parseUint8Array( uInt8Array, inOffset );
				lc += 8;
				getCharReturn.c = c;
				getCharReturn.lc = lc;

			}

			const getCodeReturn = {
				c: 0,
				lc: 0
			};
			function getCode( po, rlc, c, lc, uInt8Array, inOffset, outBuffer, outBufferOffset, outBufferEndOffset ) {

				if ( po == rlc ) {

					if ( lc < 8 ) {

						getChar( c, lc, uInt8Array, inOffset );
						c = getCharReturn.c;
						lc = getCharReturn.lc;

					}

					lc -= 8;
					let cs = c >> lc;
					cs = new Uint8Array( [ cs ] )[ 0 ];
					if ( outBufferOffset.value + cs > outBufferEndOffset ) {

						return false;

					}

					const s = outBuffer[ outBufferOffset.value - 1 ];
					while ( cs -- > 0 ) {

						outBuffer[ outBufferOffset.value ++ ] = s;

					}

				} else if ( outBufferOffset.value < outBufferEndOffset ) {

					outBuffer[ outBufferOffset.value ++ ] = po;

				} else {

					return false;

				}

				getCodeReturn.c = c;
				getCodeReturn.lc = lc;

			}

			function UInt16( value ) {

				return value & 0xFFFF;

			}

			function Int16( value ) {

				const ref = UInt16( value );
				return ref > 0x7FFF ? ref - 0x10000 : ref;

			}

			const wdec14Return = {
				a: 0,
				b: 0
			};
			function wdec14( l, h ) {

				const ls = Int16( l );
				const hs = Int16( h );
				const hi = hs;
				const ai = ls + ( hi & 1 ) + ( hi >> 1 );
				const as = ai;
				const bs = ai - hi;
				wdec14Return.a = as;
				wdec14Return.b = bs;

			}

			function wdec16( l, h ) {

				const m = UInt16( l );
				const d = UInt16( h );
				const bb = m - ( d >> 1 ) & MOD_MASK;
				const aa = d + bb - A_OFFSET & MOD_MASK;
				wdec14Return.a = aa;
				wdec14Return.b = bb;

			}

			function wav2Decode( buffer, j, nx, ox, ny, oy, mx ) {

				const w14 = mx < 1 << 14;
				const n = nx > ny ? ny : nx;
				let p = 1;
				let p2;
				let py;
				while ( p <= n ) p <<= 1;
				p >>= 1;
				p2 = p;
				p >>= 1;
				while ( p >= 1 ) {

					py = 0;
					const ey = py + oy * ( ny - p2 );
					const oy1 = oy * p;
					const oy2 = oy * p2;
					const ox1 = ox * p;
					const ox2 = ox * p2;
					let i00, i01, i10, i11;
					for ( ; py <= ey; py += oy2 ) {

						let px = py;
						const ex = py + ox * ( nx - p2 );
						for ( ; px <= ex; px += ox2 ) {

							const p01 = px + ox1;
							const p10 = px + oy1;
							const p11 = p10 + ox1;
							if ( w14 ) {

								wdec14( buffer[ px + j ], buffer[ p10 + j ] );
								i00 = wdec14Return.a;
								i10 = wdec14Return.b;
								wdec14( buffer[ p01 + j ], buffer[ p11 + j ] );
								i01 = wdec14Return.a;
								i11 = wdec14Return.b;
								wdec14( i00, i01 );
								buffer[ px + j ] = wdec14Return.a;
								buffer[ p01 + j ] = wdec14Return.b;
								wdec14( i10, i11 );
								buffer[ p10 + j ] = wdec14Return.a;
								buffer[ p11 + j ] = wdec14Return.b;

							} else {

								wdec16( buffer[ px + j ], buffer[ p10 + j ] );
								i00 = wdec14Return.a;
								i10 = wdec14Return.b;
								wdec16( buffer[ p01 + j ], buffer[ p11 + j ] );
								i01 = wdec14Return.a;
								i11 = wdec14Return.b;
								wdec16( i00, i01 );
								buffer[ px + j ] = wdec14Return.a;
								buffer[ p01 + j ] = wdec14Return.b;
								wdec16( i10, i11 );
								buffer[ p10 + j ] = wdec14Return.a;
								buffer[ p11 + j ] = wdec14Return.b;

							}

						}

						if ( nx & p ) {

							const p10 = px + oy1;
							if ( w14 ) wdec14( buffer[ px + j ], buffer[ p10 + j ] ); else wdec16( buffer[ px + j ], buffer[ p10 + j ] );
							i00 = wdec14Return.a;
							buffer[ p10 + j ] = wdec14Return.b;
							buffer[ px + j ] = i00;

						}

					}

					if ( ny & p ) {

						let px = py;
						const ex = py + ox * ( nx - p2 );
						for ( ; px <= ex; px += ox2 ) {

							const p01 = px + ox1;
							if ( w14 ) wdec14( buffer[ px + j ], buffer[ p01 + j ] ); else wdec16( buffer[ px + j ], buffer[ p01 + j ] );
							i00 = wdec14Return.a;
							buffer[ p01 + j ] = wdec14Return.b;
							buffer[ px + j ] = i00;

						}

					}

					p2 = p;
					p >>= 1;

				}

				return py;

			}

			function hufDecode( encodingTable, decodingTable, uInt8Array, inOffset, ni, rlc, no, outBuffer, outOffset ) {

				let c = 0;
				let lc = 0;
				const outBufferEndOffset = no;
				const inOffsetEnd = Math.trunc( inOffset.value + ( ni + 7 ) / 8 );
				while ( inOffset.value < inOffsetEnd ) {

					getChar( c, lc, uInt8Array, inOffset );
					c = getCharReturn.c;
					lc = getCharReturn.lc;
					while ( lc >= HUF_DECBITS ) {

						const index = c >> lc - HUF_DECBITS & HUF_DECMASK;
						const pl = decodingTable[ index ];
						if ( pl.len ) {

							lc -= pl.len;
							getCode( pl.lit, rlc, c, lc, uInt8Array, inOffset, outBuffer, outOffset, outBufferEndOffset );
							c = getCodeReturn.c;
							lc = getCodeReturn.lc;

						} else {

							if ( ! pl.p ) {

								throw new Error( 'hufDecode issues' );

							}

							let j;
							for ( j = 0; j < pl.lit; j ++ ) {

								const l = hufLength( encodingTable[ pl.p[ j ] ] );
								while ( lc < l && inOffset.value < inOffsetEnd ) {

									getChar( c, lc, uInt8Array, inOffset );
									c = getCharReturn.c;
									lc = getCharReturn.lc;

								}

								if ( lc >= l ) {

									if ( hufCode( encodingTable[ pl.p[ j ] ] ) == ( c >> lc - l & ( 1 << l ) - 1 ) ) {

										lc -= l;
										getCode( pl.p[ j ], rlc, c, lc, uInt8Array, inOffset, outBuffer, outOffset, outBufferEndOffset );
										c = getCodeReturn.c;
										lc = getCodeReturn.lc;
										break;

									}

								}

							}

							if ( j == pl.lit ) {

								throw new Error( 'hufDecode issues' );

							}

						}

					}

				}

				const i = 8 - ni & 7;
				c >>= i;
				lc -= i;
				while ( lc > 0 ) {

					const pl = decodingTable[ c << HUF_DECBITS - lc & HUF_DECMASK ];
					if ( pl.len ) {

						lc -= pl.len;
						getCode( pl.lit, rlc, c, lc, uInt8Array, inOffset, outBuffer, outOffset, outBufferEndOffset );
						c = getCodeReturn.c;
						lc = getCodeReturn.lc;

					} else {

						throw new Error( 'hufDecode issues' );

					}

				}

				return true;

			}

			function hufUncompress( uInt8Array, inDataView, inOffset, nCompressed, outBuffer, nRaw ) {

				const outOffset = {
					value: 0
				};
				const initialInOffset = inOffset.value;
				const im = parseUint32( inDataView, inOffset );
				const iM = parseUint32( inDataView, inOffset );
				inOffset.value += 4;
				const nBits = parseUint32( inDataView, inOffset );
				inOffset.value += 4;
				if ( im < 0 || im >= HUF_ENCSIZE || iM < 0 || iM >= HUF_ENCSIZE ) {

					throw new Error( 'Something wrong with HUF_ENCSIZE' );

				}

				const freq = new Array( HUF_ENCSIZE );
				const hdec = new Array( HUF_DECSIZE );
				hufClearDecTable( hdec );
				const ni = nCompressed - ( inOffset.value - initialInOffset );
				hufUnpackEncTable( uInt8Array, inOffset, ni, im, iM, freq );
				if ( nBits > 8 * ( nCompressed - ( inOffset.value - initialInOffset ) ) ) {

					throw new Error( 'Something wrong with hufUncompress' );

				}

				hufBuildDecTable( freq, im, iM, hdec );
				hufDecode( freq, hdec, uInt8Array, inOffset, nBits, iM, nRaw, outBuffer, outOffset );

			}

			function applyLut( lut, data, nData ) {

				for ( let i = 0; i < nData; ++ i ) {

					data[ i ] = lut[ data[ i ] ];

				}

			}

			function predictor( source ) {

				for ( let t = 1; t < source.length; t ++ ) {

					const d = source[ t - 1 ] + source[ t ] - 128;
					source[ t ] = d;

				}

			}

			function interleaveScalar( source, out ) {

				let t1 = 0;
				let t2 = Math.floor( ( source.length + 1 ) / 2 );
				let s = 0;
				const stop = source.length - 1;
				while ( true ) {

					if ( s > stop ) break;
					out[ s ++ ] = source[ t1 ++ ];
					if ( s > stop ) break;
					out[ s ++ ] = source[ t2 ++ ];

				}

			}

			function decodeRunLength( source ) {

				let size = source.byteLength;
				const out = new Array();
				let p = 0;
				const reader = new DataView( source );
				while ( size > 0 ) {

					const l = reader.getInt8( p ++ );
					if ( l < 0 ) {

						const count = - l;
						size -= count + 1;
						for ( let i = 0; i < count; i ++ ) {

							out.push( reader.getUint8( p ++ ) );

						}

					} else {

						const count = l;
						size -= 2;
						const value = reader.getUint8( p ++ );
						for ( let i = 0; i < count + 1; i ++ ) {

							out.push( value );

						}

					}

				}

				return out;

			}

			function lossyDctDecode( cscSet, rowPtrs, channelData, acBuffer, dcBuffer, outBuffer ) {

				let dataView = new DataView( outBuffer.buffer );
				const width = channelData[ cscSet.idx[ 0 ] ].width;
				const height = channelData[ cscSet.idx[ 0 ] ].height;
				const numComp = 3;
				const numFullBlocksX = Math.floor( width / 8.0 );
				const numBlocksX = Math.ceil( width / 8.0 );
				const numBlocksY = Math.ceil( height / 8.0 );
				const leftoverX = width - ( numBlocksX - 1 ) * 8;
				const leftoverY = height - ( numBlocksY - 1 ) * 8;
				const currAcComp = {
					value: 0
				};
				const currDcComp = new Array( numComp );
				const dctData = new Array( numComp );
				const halfZigBlock = new Array( numComp );
				const rowBlock = new Array( numComp );
				const rowOffsets = new Array( numComp );
				for ( let comp = 0; comp < numComp; ++ comp ) {

					rowOffsets[ comp ] = rowPtrs[ cscSet.idx[ comp ] ];
					currDcComp[ comp ] = comp < 1 ? 0 : currDcComp[ comp - 1 ] + numBlocksX * numBlocksY;
					dctData[ comp ] = new Float32Array( 64 );
					halfZigBlock[ comp ] = new Uint16Array( 64 );
					rowBlock[ comp ] = new Uint16Array( numBlocksX * 64 );

				}

				for ( let blocky = 0; blocky < numBlocksY; ++ blocky ) {

					let maxY = 8;
					if ( blocky == numBlocksY - 1 ) maxY = leftoverY;
					let maxX = 8;
					for ( let blockx = 0; blockx < numBlocksX; ++ blockx ) {

						if ( blockx == numBlocksX - 1 ) maxX = leftoverX;
						for ( let comp = 0; comp < numComp; ++ comp ) {

							halfZigBlock[ comp ].fill( 0 );

							// set block DC component
							halfZigBlock[ comp ][ 0 ] = dcBuffer[ currDcComp[ comp ] ++ ];
							// set block AC components
							unRleAC( currAcComp, acBuffer, halfZigBlock[ comp ] );

							// UnZigZag block to float
							unZigZag( halfZigBlock[ comp ], dctData[ comp ] );
							// decode float dct
							dctInverse( dctData[ comp ] );

						}

						if ( numComp == 3 ) {

							csc709Inverse( dctData );

						}

						for ( let comp = 0; comp < numComp; ++ comp ) {

							convertToHalf( dctData[ comp ], rowBlock[ comp ], blockx * 64 );

						}

					} // blockx

					let offset = 0;
					for ( let comp = 0; comp < numComp; ++ comp ) {

						const type = channelData[ cscSet.idx[ comp ] ].type;
						for ( let y = 8 * blocky; y < 8 * blocky + maxY; ++ y ) {

							offset = rowOffsets[ comp ][ y ];
							for ( let blockx = 0; blockx < numFullBlocksX; ++ blockx ) {

								const src = blockx * 64 + ( y & 0x7 ) * 8;
								dataView.setUint16( offset + 0 * INT16_SIZE * type, rowBlock[ comp ][ src + 0 ], true );
								dataView.setUint16( offset + 1 * INT16_SIZE * type, rowBlock[ comp ][ src + 1 ], true );
								dataView.setUint16( offset + 2 * INT16_SIZE * type, rowBlock[ comp ][ src + 2 ], true );
								dataView.setUint16( offset + 3 * INT16_SIZE * type, rowBlock[ comp ][ src + 3 ], true );
								dataView.setUint16( offset + 4 * INT16_SIZE * type, rowBlock[ comp ][ src + 4 ], true );
								dataView.setUint16( offset + 5 * INT16_SIZE * type, rowBlock[ comp ][ src + 5 ], true );
								dataView.setUint16( offset + 6 * INT16_SIZE * type, rowBlock[ comp ][ src + 6 ], true );
								dataView.setUint16( offset + 7 * INT16_SIZE * type, rowBlock[ comp ][ src + 7 ], true );
								offset += 8 * INT16_SIZE * type;

							}

						}

						// handle partial X blocks
						if ( numFullBlocksX != numBlocksX ) {

							for ( let y = 8 * blocky; y < 8 * blocky + maxY; ++ y ) {

								const offset = rowOffsets[ comp ][ y ] + 8 * numFullBlocksX * INT16_SIZE * type;
								const src = numFullBlocksX * 64 + ( y & 0x7 ) * 8;
								for ( let x = 0; x < maxX; ++ x ) {

									dataView.setUint16( offset + x * INT16_SIZE * type, rowBlock[ comp ][ src + x ], true );

								}

							}

						}

					} // comp

				} // blocky

				const halfRow = new Uint16Array( width );
				dataView = new DataView( outBuffer.buffer );

				// convert channels back to float, if needed
				for ( let comp = 0; comp < numComp; ++ comp ) {

					channelData[ cscSet.idx[ comp ] ].decoded = true;
					const type = channelData[ cscSet.idx[ comp ] ].type;
					if ( channelData[ comp ].type != 2 ) continue;
					for ( let y = 0; y < height; ++ y ) {

						const offset = rowOffsets[ comp ][ y ];
						for ( let x = 0; x < width; ++ x ) {

							halfRow[ x ] = dataView.getUint16( offset + x * INT16_SIZE * type, true );

						}

						for ( let x = 0; x < width; ++ x ) {

							dataView.setFloat32( offset + x * INT16_SIZE * type, decodeFloat16( halfRow[ x ] ), true );

						}

					}

				}

			}

			function unRleAC( currAcComp, acBuffer, halfZigBlock ) {

				let acValue;
				let dctComp = 1;
				while ( dctComp < 64 ) {

					acValue = acBuffer[ currAcComp.value ];
					if ( acValue == 0xff00 ) {

						dctComp = 64;

					} else if ( acValue >> 8 == 0xff ) {

						dctComp += acValue & 0xff;

					} else {

						halfZigBlock[ dctComp ] = acValue;
						dctComp ++;

					}

					currAcComp.value ++;

				}

			}

			function unZigZag( src, dst ) {

				dst[ 0 ] = decodeFloat16( src[ 0 ] );
				dst[ 1 ] = decodeFloat16( src[ 1 ] );
				dst[ 2 ] = decodeFloat16( src[ 5 ] );
				dst[ 3 ] = decodeFloat16( src[ 6 ] );
				dst[ 4 ] = decodeFloat16( src[ 14 ] );
				dst[ 5 ] = decodeFloat16( src[ 15 ] );
				dst[ 6 ] = decodeFloat16( src[ 27 ] );
				dst[ 7 ] = decodeFloat16( src[ 28 ] );
				dst[ 8 ] = decodeFloat16( src[ 2 ] );
				dst[ 9 ] = decodeFloat16( src[ 4 ] );
				dst[ 10 ] = decodeFloat16( src[ 7 ] );
				dst[ 11 ] = decodeFloat16( src[ 13 ] );
				dst[ 12 ] = decodeFloat16( src[ 16 ] );
				dst[ 13 ] = decodeFloat16( src[ 26 ] );
				dst[ 14 ] = decodeFloat16( src[ 29 ] );
				dst[ 15 ] = decodeFloat16( src[ 42 ] );
				dst[ 16 ] = decodeFloat16( src[ 3 ] );
				dst[ 17 ] = decodeFloat16( src[ 8 ] );
				dst[ 18 ] = decodeFloat16( src[ 12 ] );
				dst[ 19 ] = decodeFloat16( src[ 17 ] );
				dst[ 20 ] = decodeFloat16( src[ 25 ] );
				dst[ 21 ] = decodeFloat16( src[ 30 ] );
				dst[ 22 ] = decodeFloat16( src[ 41 ] );
				dst[ 23 ] = decodeFloat16( src[ 43 ] );
				dst[ 24 ] = decodeFloat16( src[ 9 ] );
				dst[ 25 ] = decodeFloat16( src[ 11 ] );
				dst[ 26 ] = decodeFloat16( src[ 18 ] );
				dst[ 27 ] = decodeFloat16( src[ 24 ] );
				dst[ 28 ] = decodeFloat16( src[ 31 ] );
				dst[ 29 ] = decodeFloat16( src[ 40 ] );
				dst[ 30 ] = decodeFloat16( src[ 44 ] );
				dst[ 31 ] = decodeFloat16( src[ 53 ] );
				dst[ 32 ] = decodeFloat16( src[ 10 ] );
				dst[ 33 ] = decodeFloat16( src[ 19 ] );
				dst[ 34 ] = decodeFloat16( src[ 23 ] );
				dst[ 35 ] = decodeFloat16( src[ 32 ] );
				dst[ 36 ] = decodeFloat16( src[ 39 ] );
				dst[ 37 ] = decodeFloat16( src[ 45 ] );
				dst[ 38 ] = decodeFloat16( src[ 52 ] );
				dst[ 39 ] = decodeFloat16( src[ 54 ] );
				dst[ 40 ] = decodeFloat16( src[ 20 ] );
				dst[ 41 ] = decodeFloat16( src[ 22 ] );
				dst[ 42 ] = decodeFloat16( src[ 33 ] );
				dst[ 43 ] = decodeFloat16( src[ 38 ] );
				dst[ 44 ] = decodeFloat16( src[ 46 ] );
				dst[ 45 ] = decodeFloat16( src[ 51 ] );
				dst[ 46 ] = decodeFloat16( src[ 55 ] );
				dst[ 47 ] = decodeFloat16( src[ 60 ] );
				dst[ 48 ] = decodeFloat16( src[ 21 ] );
				dst[ 49 ] = decodeFloat16( src[ 34 ] );
				dst[ 50 ] = decodeFloat16( src[ 37 ] );
				dst[ 51 ] = decodeFloat16( src[ 47 ] );
				dst[ 52 ] = decodeFloat16( src[ 50 ] );
				dst[ 53 ] = decodeFloat16( src[ 56 ] );
				dst[ 54 ] = decodeFloat16( src[ 59 ] );
				dst[ 55 ] = decodeFloat16( src[ 61 ] );
				dst[ 56 ] = decodeFloat16( src[ 35 ] );
				dst[ 57 ] = decodeFloat16( src[ 36 ] );
				dst[ 58 ] = decodeFloat16( src[ 48 ] );
				dst[ 59 ] = decodeFloat16( src[ 49 ] );
				dst[ 60 ] = decodeFloat16( src[ 57 ] );
				dst[ 61 ] = decodeFloat16( src[ 58 ] );
				dst[ 62 ] = decodeFloat16( src[ 62 ] );
				dst[ 63 ] = decodeFloat16( src[ 63 ] );

			}

			function dctInverse( data ) {

				const a = 0.5 * Math.cos( 3.14159 / 4.0 );
				const b = 0.5 * Math.cos( 3.14159 / 16.0 );
				const c = 0.5 * Math.cos( 3.14159 / 8.0 );
				const d = 0.5 * Math.cos( 3.0 * 3.14159 / 16.0 );
				const e = 0.5 * Math.cos( 5.0 * 3.14159 / 16.0 );
				const f = 0.5 * Math.cos( 3.0 * 3.14159 / 8.0 );
				const g = 0.5 * Math.cos( 7.0 * 3.14159 / 16.0 );
				const alpha = new Array( 4 );
				const beta = new Array( 4 );
				const theta = new Array( 4 );
				const gamma = new Array( 4 );
				for ( let row = 0; row < 8; ++ row ) {

					const rowPtr = row * 8;
					alpha[ 0 ] = c * data[ rowPtr + 2 ];
					alpha[ 1 ] = f * data[ rowPtr + 2 ];
					alpha[ 2 ] = c * data[ rowPtr + 6 ];
					alpha[ 3 ] = f * data[ rowPtr + 6 ];
					beta[ 0 ] = b * data[ rowPtr + 1 ] + d * data[ rowPtr + 3 ] + e * data[ rowPtr + 5 ] + g * data[ rowPtr + 7 ];
					beta[ 1 ] = d * data[ rowPtr + 1 ] - g * data[ rowPtr + 3 ] - b * data[ rowPtr + 5 ] - e * data[ rowPtr + 7 ];
					beta[ 2 ] = e * data[ rowPtr + 1 ] - b * data[ rowPtr + 3 ] + g * data[ rowPtr + 5 ] + d * data[ rowPtr + 7 ];
					beta[ 3 ] = g * data[ rowPtr + 1 ] - e * data[ rowPtr + 3 ] + d * data[ rowPtr + 5 ] - b * data[ rowPtr + 7 ];
					theta[ 0 ] = a * ( data[ rowPtr + 0 ] + data[ rowPtr + 4 ] );
					theta[ 3 ] = a * ( data[ rowPtr + 0 ] - data[ rowPtr + 4 ] );
					theta[ 1 ] = alpha[ 0 ] + alpha[ 3 ];
					theta[ 2 ] = alpha[ 1 ] - alpha[ 2 ];
					gamma[ 0 ] = theta[ 0 ] + theta[ 1 ];
					gamma[ 1 ] = theta[ 3 ] + theta[ 2 ];
					gamma[ 2 ] = theta[ 3 ] - theta[ 2 ];
					gamma[ 3 ] = theta[ 0 ] - theta[ 1 ];
					data[ rowPtr + 0 ] = gamma[ 0 ] + beta[ 0 ];
					data[ rowPtr + 1 ] = gamma[ 1 ] + beta[ 1 ];
					data[ rowPtr + 2 ] = gamma[ 2 ] + beta[ 2 ];
					data[ rowPtr + 3 ] = gamma[ 3 ] + beta[ 3 ];
					data[ rowPtr + 4 ] = gamma[ 3 ] - beta[ 3 ];
					data[ rowPtr + 5 ] = gamma[ 2 ] - beta[ 2 ];
					data[ rowPtr + 6 ] = gamma[ 1 ] - beta[ 1 ];
					data[ rowPtr + 7 ] = gamma[ 0 ] - beta[ 0 ];

				}

				for ( let column = 0; column < 8; ++ column ) {

					alpha[ 0 ] = c * data[ 16 + column ];
					alpha[ 1 ] = f * data[ 16 + column ];
					alpha[ 2 ] = c * data[ 48 + column ];
					alpha[ 3 ] = f * data[ 48 + column ];
					beta[ 0 ] = b * data[ 8 + column ] + d * data[ 24 + column ] + e * data[ 40 + column ] + g * data[ 56 + column ];
					beta[ 1 ] = d * data[ 8 + column ] - g * data[ 24 + column ] - b * data[ 40 + column ] - e * data[ 56 + column ];
					beta[ 2 ] = e * data[ 8 + column ] - b * data[ 24 + column ] + g * data[ 40 + column ] + d * data[ 56 + column ];
					beta[ 3 ] = g * data[ 8 + column ] - e * data[ 24 + column ] + d * data[ 40 + column ] - b * data[ 56 + column ];
					theta[ 0 ] = a * ( data[ column ] + data[ 32 + column ] );
					theta[ 3 ] = a * ( data[ column ] - data[ 32 + column ] );
					theta[ 1 ] = alpha[ 0 ] + alpha[ 3 ];
					theta[ 2 ] = alpha[ 1 ] - alpha[ 2 ];
					gamma[ 0 ] = theta[ 0 ] + theta[ 1 ];
					gamma[ 1 ] = theta[ 3 ] + theta[ 2 ];
					gamma[ 2 ] = theta[ 3 ] - theta[ 2 ];
					gamma[ 3 ] = theta[ 0 ] - theta[ 1 ];
					data[ 0 + column ] = gamma[ 0 ] + beta[ 0 ];
					data[ 8 + column ] = gamma[ 1 ] + beta[ 1 ];
					data[ 16 + column ] = gamma[ 2 ] + beta[ 2 ];
					data[ 24 + column ] = gamma[ 3 ] + beta[ 3 ];
					data[ 32 + column ] = gamma[ 3 ] - beta[ 3 ];
					data[ 40 + column ] = gamma[ 2 ] - beta[ 2 ];
					data[ 48 + column ] = gamma[ 1 ] - beta[ 1 ];
					data[ 56 + column ] = gamma[ 0 ] - beta[ 0 ];

				}

			}

			function csc709Inverse( data ) {

				for ( let i = 0; i < 64; ++ i ) {

					const y = data[ 0 ][ i ];
					const cb = data[ 1 ][ i ];
					const cr = data[ 2 ][ i ];
					data[ 0 ][ i ] = y + 1.5747 * cr;
					data[ 1 ][ i ] = y - 0.1873 * cb - 0.4682 * cr;
					data[ 2 ][ i ] = y + 1.8556 * cb;

				}

			}

			function convertToHalf( src, dst, idx ) {

				for ( let i = 0; i < 64; ++ i ) {

					dst[ idx + i ] = THREE.DataUtils.toHalfFloat( toLinear( src[ i ] ) );

				}

			}

			function toLinear( float ) {

				if ( float <= 1 ) {

					return Math.sign( float ) * Math.pow( Math.abs( float ), 2.2 );

				} else {

					return Math.sign( float ) * Math.pow( logBase, Math.abs( float ) - 1.0 );

				}

			}

			function uncompressRAW( info ) {

				return new DataView( info.array.buffer, info.offset.value, info.size );

			}

			function uncompressRLE( info ) {

				const compressed = info.viewer.buffer.slice( info.offset.value, info.offset.value + info.size );
				const rawBuffer = new Uint8Array( decodeRunLength( compressed ) );
				const tmpBuffer = new Uint8Array( rawBuffer.length );
				predictor( rawBuffer ); // revert predictor

				interleaveScalar( rawBuffer, tmpBuffer ); // interleave pixels

				return new DataView( tmpBuffer.buffer );

			}

			function uncompressZIP( info ) {

				const compressed = info.array.slice( info.offset.value, info.offset.value + info.size );
				if ( typeof fflate === 'undefined' ) {

					console.error( 'THREE.EXRLoader: External library fflate.min.js required.' );

				}

				const rawBuffer = fflate.unzlibSync( compressed ); // eslint-disable-line no-undef
				const tmpBuffer = new Uint8Array( rawBuffer.length );
				predictor( rawBuffer ); // revert predictor

				interleaveScalar( rawBuffer, tmpBuffer ); // interleave pixels

				return new DataView( tmpBuffer.buffer );

			}

			function uncompressPIZ( info ) {

				const inDataView = info.viewer;
				const inOffset = {
					value: info.offset.value
				};
				const outBuffer = new Uint16Array( info.width * info.scanlineBlockSize * ( info.channels * info.type ) );
				const bitmap = new Uint8Array( BITMAP_SIZE );

				// Setup channel info
				let outBufferEnd = 0;
				const pizChannelData = new Array( info.channels );
				for ( let i = 0; i < info.channels; i ++ ) {

					pizChannelData[ i ] = {};
					pizChannelData[ i ][ 'start' ] = outBufferEnd;
					pizChannelData[ i ][ 'end' ] = pizChannelData[ i ][ 'start' ];
					pizChannelData[ i ][ 'nx' ] = info.width;
					pizChannelData[ i ][ 'ny' ] = info.lines;
					pizChannelData[ i ][ 'size' ] = info.type;
					outBufferEnd += pizChannelData[ i ].nx * pizChannelData[ i ].ny * pizChannelData[ i ].size;

				}

				// Read range compression data

				const minNonZero = parseUint16( inDataView, inOffset );
				const maxNonZero = parseUint16( inDataView, inOffset );
				if ( maxNonZero >= BITMAP_SIZE ) {

					throw new Error( 'Something is wrong with PIZ_COMPRESSION BITMAP_SIZE' );

				}

				if ( minNonZero <= maxNonZero ) {

					for ( let i = 0; i < maxNonZero - minNonZero + 1; i ++ ) {

						bitmap[ i + minNonZero ] = parseUint8( inDataView, inOffset );

					}

				}

				// Reverse LUT
				const lut = new Uint16Array( USHORT_RANGE );
				const maxValue = reverseLutFromBitmap( bitmap, lut );
				const length = parseUint32( inDataView, inOffset );

				// Huffman decoding
				hufUncompress( info.array, inDataView, inOffset, length, outBuffer, outBufferEnd );

				// Wavelet decoding
				for ( let i = 0; i < info.channels; ++ i ) {

					const cd = pizChannelData[ i ];
					for ( let j = 0; j < pizChannelData[ i ].size; ++ j ) {

						wav2Decode( outBuffer, cd.start + j, cd.nx, cd.size, cd.ny, cd.nx * cd.size, maxValue );

					}

				}

				// Expand the pixel data to their original range
				applyLut( lut, outBuffer, outBufferEnd );

				// Rearrange the pixel data into the format expected by the caller.
				let tmpOffset = 0;
				const tmpBuffer = new Uint8Array( outBuffer.buffer.byteLength );
				for ( let y = 0; y < info.lines; y ++ ) {

					for ( let c = 0; c < info.channels; c ++ ) {

						const cd = pizChannelData[ c ];
						const n = cd.nx * cd.size;
						const cp = new Uint8Array( outBuffer.buffer, cd.end * INT16_SIZE, n * INT16_SIZE );
						tmpBuffer.set( cp, tmpOffset );
						tmpOffset += n * INT16_SIZE;
						cd.end += n;

					}

				}

				return new DataView( tmpBuffer.buffer );

			}

			function uncompressPXR( info ) {

				const compressed = info.array.slice( info.offset.value, info.offset.value + info.size );
				if ( typeof fflate === 'undefined' ) {

					console.error( 'THREE.EXRLoader: External library fflate.min.js required.' );

				}

				const rawBuffer = fflate.unzlibSync( compressed ); // eslint-disable-line no-undef

				const sz = info.lines * info.channels * info.width;
				const tmpBuffer = info.type == 1 ? new Uint16Array( sz ) : new Uint32Array( sz );
				let tmpBufferEnd = 0;
				let writePtr = 0;
				const ptr = new Array( 4 );
				for ( let y = 0; y < info.lines; y ++ ) {

					for ( let c = 0; c < info.channels; c ++ ) {

						let pixel = 0;
						switch ( info.type ) {

							case 1:
								ptr[ 0 ] = tmpBufferEnd;
								ptr[ 1 ] = ptr[ 0 ] + info.width;
								tmpBufferEnd = ptr[ 1 ] + info.width;
								for ( let j = 0; j < info.width; ++ j ) {

									const diff = rawBuffer[ ptr[ 0 ] ++ ] << 8 | rawBuffer[ ptr[ 1 ] ++ ];
									pixel += diff;
									tmpBuffer[ writePtr ] = pixel;
									writePtr ++;

								}

								break;
							case 2:
								ptr[ 0 ] = tmpBufferEnd;
								ptr[ 1 ] = ptr[ 0 ] + info.width;
								ptr[ 2 ] = ptr[ 1 ] + info.width;
								tmpBufferEnd = ptr[ 2 ] + info.width;
								for ( let j = 0; j < info.width; ++ j ) {

									const diff = rawBuffer[ ptr[ 0 ] ++ ] << 24 | rawBuffer[ ptr[ 1 ] ++ ] << 16 | rawBuffer[ ptr[ 2 ] ++ ] << 8;
									pixel += diff;
									tmpBuffer[ writePtr ] = pixel;
									writePtr ++;

								}

								break;

						}

					}

				}

				return new DataView( tmpBuffer.buffer );

			}

			function uncompressDWA( info ) {

				const inDataView = info.viewer;
				const inOffset = {
					value: info.offset.value
				};
				const outBuffer = new Uint8Array( info.width * info.lines * ( info.channels * info.type * INT16_SIZE ) );

				// Read compression header information
				const dwaHeader = {
					version: parseInt64( inDataView, inOffset ),
					unknownUncompressedSize: parseInt64( inDataView, inOffset ),
					unknownCompressedSize: parseInt64( inDataView, inOffset ),
					acCompressedSize: parseInt64( inDataView, inOffset ),
					dcCompressedSize: parseInt64( inDataView, inOffset ),
					rleCompressedSize: parseInt64( inDataView, inOffset ),
					rleUncompressedSize: parseInt64( inDataView, inOffset ),
					rleRawSize: parseInt64( inDataView, inOffset ),
					totalAcUncompressedCount: parseInt64( inDataView, inOffset ),
					totalDcUncompressedCount: parseInt64( inDataView, inOffset ),
					acCompression: parseInt64( inDataView, inOffset )
				};
				if ( dwaHeader.version < 2 ) throw new Error( 'EXRLoader.parse: ' + EXRHeader.compression + ' version ' + dwaHeader.version + ' is unsupported' );

				// Read channel ruleset information
				const channelRules = new Array();
				let ruleSize = parseUint16( inDataView, inOffset ) - INT16_SIZE;
				while ( ruleSize > 0 ) {

					const name = parseNullTerminatedString( inDataView.buffer, inOffset );
					const value = parseUint8( inDataView, inOffset );
					const compression = value >> 2 & 3;
					const csc = ( value >> 4 ) - 1;
					const index = new Int8Array( [ csc ] )[ 0 ];
					const type = parseUint8( inDataView, inOffset );
					channelRules.push( {
						name: name,
						index: index,
						type: type,
						compression: compression
					} );
					ruleSize -= name.length + 3;

				}

				// Classify channels
				const channels = EXRHeader.channels;
				const channelData = new Array( info.channels );
				for ( let i = 0; i < info.channels; ++ i ) {

					const cd = channelData[ i ] = {};
					const channel = channels[ i ];
					cd.name = channel.name;
					cd.compression = UNKNOWN;
					cd.decoded = false;
					cd.type = channel.pixelType;
					cd.pLinear = channel.pLinear;
					cd.width = info.width;
					cd.height = info.lines;

				}

				const cscSet = {
					idx: new Array( 3 )
				};
				for ( let offset = 0; offset < info.channels; ++ offset ) {

					const cd = channelData[ offset ];
					for ( let i = 0; i < channelRules.length; ++ i ) {

						const rule = channelRules[ i ];
						if ( cd.name == rule.name ) {

							cd.compression = rule.compression;
							if ( rule.index >= 0 ) {

								cscSet.idx[ rule.index ] = offset;

							}

							cd.offset = offset;

						}

					}

				}

				let acBuffer, dcBuffer, rleBuffer;

				// Read DCT - AC component data
				if ( dwaHeader.acCompressedSize > 0 ) {

					switch ( dwaHeader.acCompression ) {

						case STATIC_HUFFMAN:
							acBuffer = new Uint16Array( dwaHeader.totalAcUncompressedCount );
							hufUncompress( info.array, inDataView, inOffset, dwaHeader.acCompressedSize, acBuffer, dwaHeader.totalAcUncompressedCount );
							break;
						case DEFLATE:
							const compressed = info.array.slice( inOffset.value, inOffset.value + dwaHeader.totalAcUncompressedCount );
							const data = fflate.unzlibSync( compressed ); // eslint-disable-line no-undef
							acBuffer = new Uint16Array( data.buffer );
							inOffset.value += dwaHeader.totalAcUncompressedCount;
							break;

					}

				}

				// Read DCT - DC component data
				if ( dwaHeader.dcCompressedSize > 0 ) {

					const zlibInfo = {
						array: info.array,
						offset: inOffset,
						size: dwaHeader.dcCompressedSize
					};
					dcBuffer = new Uint16Array( uncompressZIP( zlibInfo ).buffer );
					inOffset.value += dwaHeader.dcCompressedSize;

				}

				// Read RLE compressed data
				if ( dwaHeader.rleRawSize > 0 ) {

					const compressed = info.array.slice( inOffset.value, inOffset.value + dwaHeader.rleCompressedSize );
					const data = fflate.unzlibSync( compressed ); // eslint-disable-line no-undef
					rleBuffer = decodeRunLength( data.buffer );
					inOffset.value += dwaHeader.rleCompressedSize;

				}

				// Prepare outbuffer data offset
				let outBufferEnd = 0;
				const rowOffsets = new Array( channelData.length );
				for ( let i = 0; i < rowOffsets.length; ++ i ) {

					rowOffsets[ i ] = new Array();

				}

				for ( let y = 0; y < info.lines; ++ y ) {

					for ( let chan = 0; chan < channelData.length; ++ chan ) {

						rowOffsets[ chan ].push( outBufferEnd );
						outBufferEnd += channelData[ chan ].width * info.type * INT16_SIZE;

					}

				}

				// Lossy DCT decode RGB channels
				lossyDctDecode( cscSet, rowOffsets, channelData, acBuffer, dcBuffer, outBuffer );

				// Decode other channels
				for ( let i = 0; i < channelData.length; ++ i ) {

					const cd = channelData[ i ];
					if ( cd.decoded ) continue;
					switch ( cd.compression ) {

						case RLE:
							let row = 0;
							let rleOffset = 0;
							for ( let y = 0; y < info.lines; ++ y ) {

								let rowOffsetBytes = rowOffsets[ i ][ row ];
								for ( let x = 0; x < cd.width; ++ x ) {

									for ( let byte = 0; byte < INT16_SIZE * cd.type; ++ byte ) {

										outBuffer[ rowOffsetBytes ++ ] = rleBuffer[ rleOffset + byte * cd.width * cd.height ];

									}

									rleOffset ++;

								}

								row ++;

							}

							break;
						case LOSSY_DCT: // skip

						default:
							throw new Error( 'EXRLoader.parse: unsupported channel compression' );

					}

				}

				return new DataView( outBuffer.buffer );

			}

			function parseNullTerminatedString( buffer, offset ) {

				const uintBuffer = new Uint8Array( buffer );
				let endOffset = 0;
				while ( uintBuffer[ offset.value + endOffset ] != 0 ) {

					endOffset += 1;

				}

				const stringValue = new TextDecoder().decode( uintBuffer.slice( offset.value, offset.value + endOffset ) );
				offset.value = offset.value + endOffset + 1;
				return stringValue;

			}

			function parseFixedLengthString( buffer, offset, size ) {

				const stringValue = new TextDecoder().decode( new Uint8Array( buffer ).slice( offset.value, offset.value + size ) );
				offset.value = offset.value + size;
				return stringValue;

			}

			function parseRational( dataView, offset ) {

				const x = parseInt32( dataView, offset );
				const y = parseUint32( dataView, offset );
				return [ x, y ];

			}

			function parseTimecode( dataView, offset ) {

				const x = parseUint32( dataView, offset );
				const y = parseUint32( dataView, offset );
				return [ x, y ];

			}

			function parseInt32( dataView, offset ) {

				const Int32 = dataView.getInt32( offset.value, true );
				offset.value = offset.value + INT32_SIZE;
				return Int32;

			}

			function parseUint32( dataView, offset ) {

				const Uint32 = dataView.getUint32( offset.value, true );
				offset.value = offset.value + INT32_SIZE;
				return Uint32;

			}

			function parseUint8Array( uInt8Array, offset ) {

				const Uint8 = uInt8Array[ offset.value ];
				offset.value = offset.value + INT8_SIZE;
				return Uint8;

			}

			function parseUint8( dataView, offset ) {

				const Uint8 = dataView.getUint8( offset.value );
				offset.value = offset.value + INT8_SIZE;
				return Uint8;

			}

			const parseInt64 = function ( dataView, offset ) {

				const Int64 = Number( dataView.getBigInt64( offset.value, true ) );
				offset.value += ULONG_SIZE;
				return Int64;

			};

			function parseFloat32( dataView, offset ) {

				const float = dataView.getFloat32( offset.value, true );
				offset.value += FLOAT32_SIZE;
				return float;

			}

			function decodeFloat32( dataView, offset ) {

				return THREE.DataUtils.toHalfFloat( parseFloat32( dataView, offset ) );

			}

			// https://stackoverflow.com/questions/5678432/decompressing-half-precision-floats-in-javascript
			function decodeFloat16( binary ) {

				const exponent = ( binary & 0x7C00 ) >> 10,
					fraction = binary & 0x03FF;
				return ( binary >> 15 ? - 1 : 1 ) * ( exponent ? exponent === 0x1F ? fraction ? NaN : Infinity : Math.pow( 2, exponent - 15 ) * ( 1 + fraction / 0x400 ) : 6.103515625e-5 * ( fraction / 0x400 ) );

			}

			function parseUint16( dataView, offset ) {

				const Uint16 = dataView.getUint16( offset.value, true );
				offset.value += INT16_SIZE;
				return Uint16;

			}

			function parseFloat16( buffer, offset ) {

				return decodeFloat16( parseUint16( buffer, offset ) );

			}

			function parseChlist( dataView, buffer, offset, size ) {

				const startOffset = offset.value;
				const channels = [];
				while ( offset.value < startOffset + size - 1 ) {

					const name = parseNullTerminatedString( buffer, offset );
					const pixelType = parseInt32( dataView, offset );
					const pLinear = parseUint8( dataView, offset );
					offset.value += 3; // reserved, three chars
					const xSampling = parseInt32( dataView, offset );
					const ySampling = parseInt32( dataView, offset );
					channels.push( {
						name: name,
						pixelType: pixelType,
						pLinear: pLinear,
						xSampling: xSampling,
						ySampling: ySampling
					} );

				}

				offset.value += 1;
				return channels;

			}

			function parseChromaticities( dataView, offset ) {

				const redX = parseFloat32( dataView, offset );
				const redY = parseFloat32( dataView, offset );
				const greenX = parseFloat32( dataView, offset );
				const greenY = parseFloat32( dataView, offset );
				const blueX = parseFloat32( dataView, offset );
				const blueY = parseFloat32( dataView, offset );
				const whiteX = parseFloat32( dataView, offset );
				const whiteY = parseFloat32( dataView, offset );
				return {
					redX: redX,
					redY: redY,
					greenX: greenX,
					greenY: greenY,
					blueX: blueX,
					blueY: blueY,
					whiteX: whiteX,
					whiteY: whiteY
				};

			}

			function parseCompression( dataView, offset ) {

				const compressionCodes = [ 'NO_COMPRESSION', 'RLE_COMPRESSION', 'ZIPS_COMPRESSION', 'ZIP_COMPRESSION', 'PIZ_COMPRESSION', 'PXR24_COMPRESSION', 'B44_COMPRESSION', 'B44A_COMPRESSION', 'DWAA_COMPRESSION', 'DWAB_COMPRESSION' ];
				const compression = parseUint8( dataView, offset );
				return compressionCodes[ compression ];

			}

			function parseBox2i( dataView, offset ) {

				const xMin = parseUint32( dataView, offset );
				const yMin = parseUint32( dataView, offset );
				const xMax = parseUint32( dataView, offset );
				const yMax = parseUint32( dataView, offset );
				return {
					xMin: xMin,
					yMin: yMin,
					xMax: xMax,
					yMax: yMax
				};

			}

			function parseLineOrder( dataView, offset ) {

				const lineOrders = [ 'INCREASING_Y' ];
				const lineOrder = parseUint8( dataView, offset );
				return lineOrders[ lineOrder ];

			}

			function parseV2f( dataView, offset ) {

				const x = parseFloat32( dataView, offset );
				const y = parseFloat32( dataView, offset );
				return [ x, y ];

			}

			function parseV3f( dataView, offset ) {

				const x = parseFloat32( dataView, offset );
				const y = parseFloat32( dataView, offset );
				const z = parseFloat32( dataView, offset );
				return [ x, y, z ];

			}

			function parseValue( dataView, buffer, offset, type, size ) {

				if ( type === 'string' || type === 'stringvector' || type === 'iccProfile' ) {

					return parseFixedLengthString( buffer, offset, size );

				} else if ( type === 'chlist' ) {

					return parseChlist( dataView, buffer, offset, size );

				} else if ( type === 'chromaticities' ) {

					return parseChromaticities( dataView, offset );

				} else if ( type === 'compression' ) {

					return parseCompression( dataView, offset );

				} else if ( type === 'box2i' ) {

					return parseBox2i( dataView, offset );

				} else if ( type === 'lineOrder' ) {

					return parseLineOrder( dataView, offset );

				} else if ( type === 'float' ) {

					return parseFloat32( dataView, offset );

				} else if ( type === 'v2f' ) {

					return parseV2f( dataView, offset );

				} else if ( type === 'v3f' ) {

					return parseV3f( dataView, offset );

				} else if ( type === 'int' ) {

					return parseInt32( dataView, offset );

				} else if ( type === 'rational' ) {

					return parseRational( dataView, offset );

				} else if ( type === 'timecode' ) {

					return parseTimecode( dataView, offset );

				} else if ( type === 'preview' ) {

					offset.value += size;
					return 'skipped';

				} else {

					offset.value += size;
					return undefined;

				}

			}

			function parseHeader( dataView, buffer, offset ) {

				const EXRHeader = {};
				if ( dataView.getUint32( 0, true ) != 20000630 ) {

					// magic

					throw new Error( 'THREE.EXRLoader: provided file doesn\'t appear to be in OpenEXR format.' );

				}

				EXRHeader.version = dataView.getUint8( 4 );
				const spec = dataView.getUint8( 5 ); // fullMask

				EXRHeader.spec = {
					singleTile: !! ( spec & 2 ),
					longName: !! ( spec & 4 ),
					deepFormat: !! ( spec & 8 ),
					multiPart: !! ( spec & 16 )
				};

				// start of header

				offset.value = 8; // start at 8 - after pre-amble

				let keepReading = true;
				while ( keepReading ) {

					const attributeName = parseNullTerminatedString( buffer, offset );
					if ( attributeName == 0 ) {

						keepReading = false;

					} else {

						const attributeType = parseNullTerminatedString( buffer, offset );
						const attributeSize = parseUint32( dataView, offset );
						const attributeValue = parseValue( dataView, buffer, offset, attributeType, attributeSize );
						if ( attributeValue === undefined ) {

							console.warn( `EXRLoader.parse: skipped unknown header attribute type \'${attributeType}\'.` );

						} else {

							EXRHeader[ attributeName ] = attributeValue;

						}

					}

				}

				if ( ( spec & ~ 0x04 ) != 0 ) {

					// unsupported tiled, deep-image, multi-part

					console.error( 'EXRHeader:', EXRHeader );
					throw new Error( 'THREE.EXRLoader: provided file is currently unsupported.' );

				}

				return EXRHeader;

			}

			function setupDecoder( EXRHeader, dataView, uInt8Array, offset, outputType ) {

				const EXRDecoder = {
					size: 0,
					viewer: dataView,
					array: uInt8Array,
					offset: offset,
					width: EXRHeader.dataWindow.xMax - EXRHeader.dataWindow.xMin + 1,
					height: EXRHeader.dataWindow.yMax - EXRHeader.dataWindow.yMin + 1,
					channels: EXRHeader.channels.length,
					bytesPerLine: null,
					lines: null,
					inputSize: null,
					type: EXRHeader.channels[ 0 ].pixelType,
					uncompress: null,
					getter: null,
					format: null,
					encoding: null
				};
				switch ( EXRHeader.compression ) {

					case 'NO_COMPRESSION':
						EXRDecoder.lines = 1;
						EXRDecoder.uncompress = uncompressRAW;
						break;
					case 'RLE_COMPRESSION':
						EXRDecoder.lines = 1;
						EXRDecoder.uncompress = uncompressRLE;
						break;
					case 'ZIPS_COMPRESSION':
						EXRDecoder.lines = 1;
						EXRDecoder.uncompress = uncompressZIP;
						break;
					case 'ZIP_COMPRESSION':
						EXRDecoder.lines = 16;
						EXRDecoder.uncompress = uncompressZIP;
						break;
					case 'PIZ_COMPRESSION':
						EXRDecoder.lines = 32;
						EXRDecoder.uncompress = uncompressPIZ;
						break;
					case 'PXR24_COMPRESSION':
						EXRDecoder.lines = 16;
						EXRDecoder.uncompress = uncompressPXR;
						break;
					case 'DWAA_COMPRESSION':
						EXRDecoder.lines = 32;
						EXRDecoder.uncompress = uncompressDWA;
						break;
					case 'DWAB_COMPRESSION':
						EXRDecoder.lines = 256;
						EXRDecoder.uncompress = uncompressDWA;
						break;
					default:
						throw new Error( 'EXRLoader.parse: ' + EXRHeader.compression + ' is unsupported' );

				}

				EXRDecoder.scanlineBlockSize = EXRDecoder.lines;
				if ( EXRDecoder.type == 1 ) {

					// half
					switch ( outputType ) {

						case THREE.FloatType:
							EXRDecoder.getter = parseFloat16;
							EXRDecoder.inputSize = INT16_SIZE;
							break;
						case THREE.HalfFloatType:
							EXRDecoder.getter = parseUint16;
							EXRDecoder.inputSize = INT16_SIZE;
							break;

					}

				} else if ( EXRDecoder.type == 2 ) {

					// float
					switch ( outputType ) {

						case THREE.FloatType:
							EXRDecoder.getter = parseFloat32;
							EXRDecoder.inputSize = FLOAT32_SIZE;
							break;
						case THREE.HalfFloatType:
							EXRDecoder.getter = decodeFloat32;
							EXRDecoder.inputSize = FLOAT32_SIZE;

					}

				} else {

					throw new Error( 'EXRLoader.parse: unsupported pixelType ' + EXRDecoder.type + ' for ' + EXRHeader.compression + '.' );

				}

				EXRDecoder.blockCount = ( EXRHeader.dataWindow.yMax + 1 ) / EXRDecoder.scanlineBlockSize;
				for ( let i = 0; i < EXRDecoder.blockCount; i ++ ) parseInt64( dataView, offset ); // scanlineOffset

				// we should be passed the scanline offset table, ready to start reading pixel data.

				// RGB images will be converted to RGBA format, preventing software emulation in select devices.
				EXRDecoder.outputChannels = EXRDecoder.channels == 3 ? 4 : EXRDecoder.channels;
				const size = EXRDecoder.width * EXRDecoder.height * EXRDecoder.outputChannels;
				switch ( outputType ) {

					case THREE.FloatType:
						EXRDecoder.byteArray = new Float32Array( size );

						// Fill initially with 1s for the alpha value if the texture is not RGBA, RGB values will be overwritten
						if ( EXRDecoder.channels < EXRDecoder.outputChannels ) EXRDecoder.byteArray.fill( 1, 0, size );
						break;
					case THREE.HalfFloatType:
						EXRDecoder.byteArray = new Uint16Array( size );
						if ( EXRDecoder.channels < EXRDecoder.outputChannels ) EXRDecoder.byteArray.fill( 0x3C00, 0, size ); // Uint16Array holds half float data, 0x3C00 is 1

						break;
					default:
						console.error( 'THREE.EXRLoader: unsupported type: ', outputType );
						break;

				}

				EXRDecoder.bytesPerLine = EXRDecoder.width * EXRDecoder.inputSize * EXRDecoder.channels;
				if ( EXRDecoder.outputChannels == 4 ) {

					EXRDecoder.format = THREE.RGBAFormat;
					EXRDecoder.encoding = THREE.LinearEncoding;

				} else {

					EXRDecoder.format = THREE.RedFormat;
					EXRDecoder.encoding = THREE.LinearEncoding;

				}

				return EXRDecoder;

			}

			// start parsing file [START]

			const bufferDataView = new DataView( buffer );
			const uInt8Array = new Uint8Array( buffer );
			const offset = {
				value: 0
			};

			// get header information and validate format.
			const EXRHeader = parseHeader( bufferDataView, buffer, offset );

			// get input compression information and prepare decoding.
			const EXRDecoder = setupDecoder( EXRHeader, bufferDataView, uInt8Array, offset, this.type );
			const tmpOffset = {
				value: 0
			};
			const channelOffsets = {
				R: 0,
				G: 1,
				B: 2,
				A: 3,
				Y: 0
			};
			for ( let scanlineBlockIdx = 0; scanlineBlockIdx < EXRDecoder.height / EXRDecoder.scanlineBlockSize; scanlineBlockIdx ++ ) {

				const line = parseUint32( bufferDataView, offset ); // line_no
				EXRDecoder.size = parseUint32( bufferDataView, offset ); // data_len
				EXRDecoder.lines = line + EXRDecoder.scanlineBlockSize > EXRDecoder.height ? EXRDecoder.height - line : EXRDecoder.scanlineBlockSize;
				const isCompressed = EXRDecoder.size < EXRDecoder.lines * EXRDecoder.bytesPerLine;
				const viewer = isCompressed ? EXRDecoder.uncompress( EXRDecoder ) : uncompressRAW( EXRDecoder );
				offset.value += EXRDecoder.size;
				for ( let line_y = 0; line_y < EXRDecoder.scanlineBlockSize; line_y ++ ) {

					const true_y = line_y + scanlineBlockIdx * EXRDecoder.scanlineBlockSize;
					if ( true_y >= EXRDecoder.height ) break;
					for ( let channelID = 0; channelID < EXRDecoder.channels; channelID ++ ) {

						const cOff = channelOffsets[ EXRHeader.channels[ channelID ].name ];
						for ( let x = 0; x < EXRDecoder.width; x ++ ) {

							tmpOffset.value = ( line_y * ( EXRDecoder.channels * EXRDecoder.width ) + channelID * EXRDecoder.width + x ) * EXRDecoder.inputSize;
							const outIndex = ( EXRDecoder.height - 1 - true_y ) * ( EXRDecoder.width * EXRDecoder.outputChannels ) + x * EXRDecoder.outputChannels + cOff;
							EXRDecoder.byteArray[ outIndex ] = EXRDecoder.getter( viewer, tmpOffset );

						}

					}

				}

			}

			return {
				header: EXRHeader,
				width: EXRDecoder.width,
				height: EXRDecoder.height,
				data: EXRDecoder.byteArray,
				format: EXRDecoder.format,
				encoding: EXRDecoder.encoding,
				type: this.type
			};

		}
		setDataType( value ) {

			this.type = value;
			return this;

		}
		load( url, onLoad, onProgress, onError ) {

			function onLoadCallback( texture, texData ) {

				texture.encoding = texData.encoding;
				texture.minFilter = THREE.LinearFilter;
				texture.magFilter = THREE.LinearFilter;
				texture.generateMipmaps = false;
				texture.flipY = false;
				if ( onLoad ) onLoad( texture, texData );

			}

			return super.load( url, onLoadCallback, onProgress, onError );

		}

	}

	THREE.EXRLoader = EXRLoader;

} )();

;
( function () {

	/**
 * Full-screen textured quad shader
 */

	const CopyShader = {
		uniforms: {
			'tDiffuse': {
				value: null
			},
			'opacity': {
				value: 1.0
			}
		},
		vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
		fragmentShader: /* glsl */`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );
			gl_FragColor.a *= opacity;


		}`
	};

	THREE.CopyShader = CopyShader;

} )();

;
( function () {

	/**
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

	const LuminosityHighPassShader = {
		shaderID: 'luminosityHighPass',
		uniforms: {
			'tDiffuse': {
				value: null
			},
			'luminosityThreshold': {
				value: 1.0
			},
			'smoothWidth': {
				value: 1.0
			},
			'defaultColor': {
				value: new THREE.Color( 0x000000 )
			},
			'defaultOpacity': {
				value: 0.0
			}
		},
		vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
		fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`
	};

	THREE.LuminosityHighPassShader = LuminosityHighPassShader;

} )();

;
( function () {

	class EffectComposer {

		constructor( renderer, renderTarget ) {

			this.renderer = renderer;
			if ( renderTarget === undefined ) {

				const size = renderer.getSize( new THREE.Vector2() );
				this._pixelRatio = renderer.getPixelRatio();
				this._width = size.width;
				this._height = size.height;
				renderTarget = new THREE.WebGLRenderTarget( this._width * this._pixelRatio, this._height * this._pixelRatio );
				renderTarget.texture.name = 'EffectComposer.rt1';

			} else {

				this._pixelRatio = 1;
				this._width = renderTarget.width;
				this._height = renderTarget.height;

			}

			this.renderTarget1 = renderTarget;
			this.renderTarget2 = renderTarget.clone();
			this.renderTarget2.texture.name = 'EffectComposer.rt2';
			this.writeBuffer = this.renderTarget1;
			this.readBuffer = this.renderTarget2;
			this.renderToScreen = true;
			this.passes = [];

			// dependencies

			if ( THREE.CopyShader === undefined ) {

				console.error( 'THREE.EffectComposer relies on THREE.CopyShader' );

			}

			if ( THREE.ShaderPass === undefined ) {

				console.error( 'THREE.EffectComposer relies on THREE.ShaderPass' );

			}

			this.copyPass = new THREE.ShaderPass( THREE.CopyShader );
			this.clock = new THREE.Clock();

		}
		swapBuffers() {

			const tmp = this.readBuffer;
			this.readBuffer = this.writeBuffer;
			this.writeBuffer = tmp;

		}
		addPass( pass ) {

			this.passes.push( pass );
			pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

		}
		insertPass( pass, index ) {

			this.passes.splice( index, 0, pass );
			pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

		}
		removePass( pass ) {

			const index = this.passes.indexOf( pass );
			if ( index !== - 1 ) {

				this.passes.splice( index, 1 );

			}

		}
		isLastEnabledPass( passIndex ) {

			for ( let i = passIndex + 1; i < this.passes.length; i ++ ) {

				if ( this.passes[ i ].enabled ) {

					return false;

				}

			}

			return true;

		}
		render( deltaTime ) {

			// deltaTime value is in seconds

			if ( deltaTime === undefined ) {

				deltaTime = this.clock.getDelta();

			}

			const currentRenderTarget = this.renderer.getRenderTarget();
			let maskActive = false;
			for ( let i = 0, il = this.passes.length; i < il; i ++ ) {

				const pass = this.passes[ i ];
				if ( pass.enabled === false ) continue;
				pass.renderToScreen = this.renderToScreen && this.isLastEnabledPass( i );
				pass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive );
				if ( pass.needsSwap ) {

					if ( maskActive ) {

						const context = this.renderer.getContext();
						const stencil = this.renderer.state.buffers.stencil;

						//context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
						stencil.setFunc( context.NOTEQUAL, 1, 0xffffffff );
						this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime );

						//context.stencilFunc( context.EQUAL, 1, 0xffffffff );
						stencil.setFunc( context.EQUAL, 1, 0xffffffff );

					}

					this.swapBuffers();

				}

				if ( THREE.MaskPass !== undefined ) {

					if ( pass instanceof THREE.MaskPass ) {

						maskActive = true;

					} else if ( pass instanceof THREE.ClearMaskPass ) {

						maskActive = false;

					}

				}

			}

			this.renderer.setRenderTarget( currentRenderTarget );

		}
		reset( renderTarget ) {

			if ( renderTarget === undefined ) {

				const size = this.renderer.getSize( new THREE.Vector2() );
				this._pixelRatio = this.renderer.getPixelRatio();
				this._width = size.width;
				this._height = size.height;
				renderTarget = this.renderTarget1.clone();
				renderTarget.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

			}

			this.renderTarget1.dispose();
			this.renderTarget2.dispose();
			this.renderTarget1 = renderTarget;
			this.renderTarget2 = renderTarget.clone();
			this.writeBuffer = this.renderTarget1;
			this.readBuffer = this.renderTarget2;

		}
		setSize( width, height ) {

			this._width = width;
			this._height = height;
			const effectiveWidth = this._width * this._pixelRatio;
			const effectiveHeight = this._height * this._pixelRatio;
			this.renderTarget1.setSize( effectiveWidth, effectiveHeight );
			this.renderTarget2.setSize( effectiveWidth, effectiveHeight );
			for ( let i = 0; i < this.passes.length; i ++ ) {

				this.passes[ i ].setSize( effectiveWidth, effectiveHeight );

			}

		}
		setPixelRatio( pixelRatio ) {

			this._pixelRatio = pixelRatio;
			this.setSize( this._width, this._height );

		}
		dispose() {

			this.renderTarget1.dispose();
			this.renderTarget2.dispose();
			this.copyPass.dispose();

		}

	}
	class Pass {

		constructor() {

			// if set to true, the pass is processed by the composer
			this.enabled = true;

			// if set to true, the pass indicates to swap read and write buffer after rendering
			this.needsSwap = true;

			// if set to true, the pass clears its buffer before rendering
			this.clear = false;

			// if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
			this.renderToScreen = false;

		}
		setSize() {}
		render() {

			console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

		}

	}

	// Helper for passes that need to fill the viewport with a single quad.

	const _camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

	// https://github.com/mrdoob/three.js/pull/21358

	const _geometry = new THREE.BufferGeometry();
	_geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
	_geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );
	class FullScreenQuad {

		constructor( material ) {

			this._mesh = new THREE.Mesh( _geometry, material );

		}
		dispose() {

			this._mesh.geometry.dispose();

		}
		render( renderer ) {

			renderer.render( this._mesh, _camera );

		}
		get material() {

			return this._mesh.material;

		}
		set material( value ) {

			this._mesh.material = value;

		}

	}

	THREE.EffectComposer = EffectComposer;
	THREE.FullScreenQuad = FullScreenQuad;
	THREE.Pass = Pass;

} )();

;
( function () {

	class RenderPass extends THREE.Pass {

		constructor( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

			super();
			this.scene = scene;
			this.camera = camera;
			this.overrideMaterial = overrideMaterial;
			this.clearColor = clearColor;
			this.clearAlpha = clearAlpha !== undefined ? clearAlpha : 0;
			this.clear = true;
			this.clearDepth = false;
			this.needsSwap = false;
			this._oldClearColor = new THREE.Color();

		}
		render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

			const oldAutoClear = renderer.autoClear;
			renderer.autoClear = false;
			let oldClearAlpha, oldOverrideMaterial;
			if ( this.overrideMaterial !== undefined ) {

				oldOverrideMaterial = this.scene.overrideMaterial;
				this.scene.overrideMaterial = this.overrideMaterial;

			}

			if ( this.clearColor ) {

				renderer.getClearColor( this._oldClearColor );
				oldClearAlpha = renderer.getClearAlpha();
				renderer.setClearColor( this.clearColor, this.clearAlpha );

			}

			if ( this.clearDepth ) {

				renderer.clearDepth();

			}

			renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );

			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			renderer.render( this.scene, this.camera );
			if ( this.clearColor ) {

				renderer.setClearColor( this._oldClearColor, oldClearAlpha );

			}

			if ( this.overrideMaterial !== undefined ) {

				this.scene.overrideMaterial = oldOverrideMaterial;

			}

			renderer.autoClear = oldAutoClear;

		}

	}

	THREE.RenderPass = RenderPass;

} )();

;
( function () {

	class ShaderPass extends THREE.Pass {

		constructor( shader, textureID ) {

			super();
			this.textureID = textureID !== undefined ? textureID : 'tDiffuse';
			if ( shader instanceof THREE.ShaderMaterial ) {

				this.uniforms = shader.uniforms;
				this.material = shader;

			} else if ( shader ) {

				this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );
				this.material = new THREE.ShaderMaterial( {
					defines: Object.assign( {}, shader.defines ),
					uniforms: this.uniforms,
					vertexShader: shader.vertexShader,
					fragmentShader: shader.fragmentShader
				} );

			}

			this.fsQuad = new THREE.FullScreenQuad( this.material );

		}
		render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

			if ( this.uniforms[ this.textureID ] ) {

				this.uniforms[ this.textureID ].value = readBuffer.texture;

			}

			this.fsQuad.material = this.material;
			if ( this.renderToScreen ) {

				renderer.setRenderTarget( null );
				this.fsQuad.render( renderer );

			} else {

				renderer.setRenderTarget( writeBuffer );
				// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
				if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
				this.fsQuad.render( renderer );

			}

		}
		dispose() {

			this.material.dispose();
			this.fsQuad.dispose();

		}

	}

	THREE.ShaderPass = ShaderPass;

} )();

;
( function () {

	class MaskPass extends THREE.Pass {

		constructor( scene, camera ) {

			super();
			this.scene = scene;
			this.camera = camera;
			this.clear = true;
			this.needsSwap = false;
			this.inverse = false;

		}
		render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

			const context = renderer.getContext();
			const state = renderer.state;

			// don't update color or depth

			state.buffers.color.setMask( false );
			state.buffers.depth.setMask( false );

			// lock buffers

			state.buffers.color.setLocked( true );
			state.buffers.depth.setLocked( true );

			// set up stencil

			let writeValue, clearValue;
			if ( this.inverse ) {

				writeValue = 0;
				clearValue = 1;

			} else {

				writeValue = 1;
				clearValue = 0;

			}

			state.buffers.stencil.setTest( true );
			state.buffers.stencil.setOp( context.REPLACE, context.REPLACE, context.REPLACE );
			state.buffers.stencil.setFunc( context.ALWAYS, writeValue, 0xffffffff );
			state.buffers.stencil.setClear( clearValue );
			state.buffers.stencil.setLocked( true );

			// draw into the stencil buffer

			renderer.setRenderTarget( readBuffer );
			if ( this.clear ) renderer.clear();
			renderer.render( this.scene, this.camera );
			renderer.setRenderTarget( writeBuffer );
			if ( this.clear ) renderer.clear();
			renderer.render( this.scene, this.camera );

			// unlock color and depth buffer for subsequent rendering

			state.buffers.color.setLocked( false );
			state.buffers.depth.setLocked( false );

			// only render where stencil is set to 1

			state.buffers.stencil.setLocked( false );
			state.buffers.stencil.setFunc( context.EQUAL, 1, 0xffffffff ); // draw if == 1
			state.buffers.stencil.setOp( context.KEEP, context.KEEP, context.KEEP );
			state.buffers.stencil.setLocked( true );

		}

	}
	class ClearMaskPass extends THREE.Pass {

		constructor() {

			super();
			this.needsSwap = false;

		}
		render( renderer /*, writeBuffer, readBuffer, deltaTime, maskActive */ ) {

			renderer.state.buffers.stencil.setLocked( false );
			renderer.state.buffers.stencil.setTest( false );

		}

	}

	THREE.ClearMaskPass = ClearMaskPass;
	THREE.MaskPass = MaskPass;

} )();

;
( function () {

	/**
 * UnrealBloomPass is inspired by the bloom pass of Unreal Engine. It creates a
 * mip map chain of bloom textures and blurs them with different radii. Because
 * of the weighted combination of mips, and because larger blurs are done on
 * higher mips, this effect provides good quality and performance.
 *
 * Reference:
 * - https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 */
	class UnrealBloomPass extends THREE.Pass {

		constructor( resolution, strength, radius, threshold ) {

			super();
			this.strength = strength !== undefined ? strength : 1;
			this.radius = radius;
			this.threshold = threshold;
			this.resolution = resolution !== undefined ? new THREE.Vector2( resolution.x, resolution.y ) : new THREE.Vector2( 256, 256 );

			// create color only once here, reuse it later inside the render function
			this.clearColor = new THREE.Color( 0, 0, 0 );

			// render targets
			this.renderTargetsHorizontal = [];
			this.renderTargetsVertical = [];
			this.nMips = 5;
			let resx = Math.round( this.resolution.x / 2 );
			let resy = Math.round( this.resolution.y / 2 );
			this.renderTargetBright = new THREE.WebGLRenderTarget( resx, resy );
			this.renderTargetBright.texture.name = 'UnrealBloomPass.bright';
			this.renderTargetBright.texture.generateMipmaps = false;
			for ( let i = 0; i < this.nMips; i ++ ) {

				const renderTargetHorizonal = new THREE.WebGLRenderTarget( resx, resy );
				renderTargetHorizonal.texture.name = 'UnrealBloomPass.h' + i;
				renderTargetHorizonal.texture.generateMipmaps = false;
				this.renderTargetsHorizontal.push( renderTargetHorizonal );
				const renderTargetVertical = new THREE.WebGLRenderTarget( resx, resy );
				renderTargetVertical.texture.name = 'UnrealBloomPass.v' + i;
				renderTargetVertical.texture.generateMipmaps = false;
				this.renderTargetsVertical.push( renderTargetVertical );
				resx = Math.round( resx / 2 );
				resy = Math.round( resy / 2 );

			}

			// luminosity high pass material

			if ( THREE.LuminosityHighPassShader === undefined ) console.error( 'THREE.UnrealBloomPass relies on THREE.LuminosityHighPassShader' );
			const highPassShader = THREE.LuminosityHighPassShader;
			this.highPassUniforms = THREE.UniformsUtils.clone( highPassShader.uniforms );
			this.highPassUniforms[ 'luminosityThreshold' ].value = threshold;
			this.highPassUniforms[ 'smoothWidth' ].value = 0.01;
			this.materialHighPassFilter = new THREE.ShaderMaterial( {
				uniforms: this.highPassUniforms,
				vertexShader: highPassShader.vertexShader,
				fragmentShader: highPassShader.fragmentShader,
				defines: {}
			} );

			// Gaussian Blur Materials
			this.separableBlurMaterials = [];
			const kernelSizeArray = [ 3, 5, 7, 9, 11 ];
			resx = Math.round( this.resolution.x / 2 );
			resy = Math.round( this.resolution.y / 2 );
			for ( let i = 0; i < this.nMips; i ++ ) {

				this.separableBlurMaterials.push( this.getSeperableBlurMaterial( kernelSizeArray[ i ] ) );
				this.separableBlurMaterials[ i ].uniforms[ 'texSize' ].value = new THREE.Vector2( resx, resy );
				resx = Math.round( resx / 2 );
				resy = Math.round( resy / 2 );

			}

			// Composite material
			this.compositeMaterial = this.getCompositeMaterial( this.nMips );
			this.compositeMaterial.uniforms[ 'blurTexture1' ].value = this.renderTargetsVertical[ 0 ].texture;
			this.compositeMaterial.uniforms[ 'blurTexture2' ].value = this.renderTargetsVertical[ 1 ].texture;
			this.compositeMaterial.uniforms[ 'blurTexture3' ].value = this.renderTargetsVertical[ 2 ].texture;
			this.compositeMaterial.uniforms[ 'blurTexture4' ].value = this.renderTargetsVertical[ 3 ].texture;
			this.compositeMaterial.uniforms[ 'blurTexture5' ].value = this.renderTargetsVertical[ 4 ].texture;
			this.compositeMaterial.uniforms[ 'bloomStrength' ].value = strength;
			this.compositeMaterial.uniforms[ 'bloomRadius' ].value = 0.1;
			this.compositeMaterial.needsUpdate = true;
			const bloomFactors = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];
			this.compositeMaterial.uniforms[ 'bloomFactors' ].value = bloomFactors;
			this.bloomTintColors = [ new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ) ];
			this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;

			// copy material
			if ( THREE.CopyShader === undefined ) {

				console.error( 'THREE.UnrealBloomPass relies on THREE.CopyShader' );

			}

			const copyShader = THREE.CopyShader;
			this.copyUniforms = THREE.UniformsUtils.clone( copyShader.uniforms );
			this.copyUniforms[ 'opacity' ].value = 1.0;
			this.materialCopy = new THREE.ShaderMaterial( {
				uniforms: this.copyUniforms,
				vertexShader: copyShader.vertexShader,
				fragmentShader: copyShader.fragmentShader,
				blending: THREE.AdditiveBlending,
				depthTest: false,
				depthWrite: false,
				transparent: true
			} );
			this.enabled = true;
			this.needsSwap = false;
			this._oldClearColor = new THREE.Color();
			this.oldClearAlpha = 1;
			this.basic = new THREE.MeshBasicMaterial();
			this.fsQuad = new THREE.FullScreenQuad( null );

		}
		dispose() {

			for ( let i = 0; i < this.renderTargetsHorizontal.length; i ++ ) {

				this.renderTargetsHorizontal[ i ].dispose();

			}

			for ( let i = 0; i < this.renderTargetsVertical.length; i ++ ) {

				this.renderTargetsVertical[ i ].dispose();

			}

			this.renderTargetBright.dispose();

			//

			for ( let i = 0; i < this.separableBlurMaterials.length; i ++ ) {

				this.separableBlurMaterials[ i ].dispose();

			}

			this.compositeMaterial.dispose();
			this.materialCopy.dispose();
			this.basic.dispose();

			//

			this.fsQuad.dispose();

		}
		setSize( width, height ) {

			let resx = Math.round( width / 2 );
			let resy = Math.round( height / 2 );
			this.renderTargetBright.setSize( resx, resy );
			for ( let i = 0; i < this.nMips; i ++ ) {

				this.renderTargetsHorizontal[ i ].setSize( resx, resy );
				this.renderTargetsVertical[ i ].setSize( resx, resy );
				this.separableBlurMaterials[ i ].uniforms[ 'texSize' ].value = new THREE.Vector2( resx, resy );
				resx = Math.round( resx / 2 );
				resy = Math.round( resy / 2 );

			}

		}
		render( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

			renderer.getClearColor( this._oldClearColor );
			this.oldClearAlpha = renderer.getClearAlpha();
			const oldAutoClear = renderer.autoClear;
			renderer.autoClear = false;
			renderer.setClearColor( this.clearColor, 0 );
			if ( maskActive ) renderer.state.buffers.stencil.setTest( false );

			// Render input to screen

			if ( this.renderToScreen ) {

				this.fsQuad.material = this.basic;
				this.basic.map = readBuffer.texture;
				renderer.setRenderTarget( null );
				renderer.clear();
				this.fsQuad.render( renderer );

			}

			// 1. Extract Bright Areas

			this.highPassUniforms[ 'tDiffuse' ].value = readBuffer.texture;
			this.highPassUniforms[ 'luminosityThreshold' ].value = this.threshold;
			this.fsQuad.material = this.materialHighPassFilter;
			renderer.setRenderTarget( this.renderTargetBright );
			renderer.clear();
			this.fsQuad.render( renderer );

			// 2. Blur All the mips progressively

			let inputRenderTarget = this.renderTargetBright;
			for ( let i = 0; i < this.nMips; i ++ ) {

				this.fsQuad.material = this.separableBlurMaterials[ i ];
				this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = inputRenderTarget.texture;
				this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = UnrealBloomPass.BlurDirectionX;
				renderer.setRenderTarget( this.renderTargetsHorizontal[ i ] );
				renderer.clear();
				this.fsQuad.render( renderer );
				this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = this.renderTargetsHorizontal[ i ].texture;
				this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = UnrealBloomPass.BlurDirectionY;
				renderer.setRenderTarget( this.renderTargetsVertical[ i ] );
				renderer.clear();
				this.fsQuad.render( renderer );
				inputRenderTarget = this.renderTargetsVertical[ i ];

			}

			// Composite All the mips

			this.fsQuad.material = this.compositeMaterial;
			this.compositeMaterial.uniforms[ 'bloomStrength' ].value = this.strength;
			this.compositeMaterial.uniforms[ 'bloomRadius' ].value = this.radius;
			this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;
			renderer.setRenderTarget( this.renderTargetsHorizontal[ 0 ] );
			renderer.clear();
			this.fsQuad.render( renderer );

			// Blend it additively over the input texture

			this.fsQuad.material = this.materialCopy;
			this.copyUniforms[ 'tDiffuse' ].value = this.renderTargetsHorizontal[ 0 ].texture;
			if ( maskActive ) renderer.state.buffers.stencil.setTest( true );
			if ( this.renderToScreen ) {

				renderer.setRenderTarget( null );
				this.fsQuad.render( renderer );

			} else {

				renderer.setRenderTarget( readBuffer );
				this.fsQuad.render( renderer );

			}

			// Restore renderer settings

			renderer.setClearColor( this._oldClearColor, this.oldClearAlpha );
			renderer.autoClear = oldAutoClear;

		}
		getSeperableBlurMaterial( kernelRadius ) {

			return new THREE.ShaderMaterial( {
				defines: {
					'KERNEL_RADIUS': kernelRadius,
					'SIGMA': kernelRadius
				},
				uniforms: {
					'colorTexture': {
						value: null
					},
					'texSize': {
						value: new THREE.Vector2( 0.5, 0.5 )
					},
					'direction': {
						value: new THREE.Vector2( 0.5, 0.5 )
					}
				},
				vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
				fragmentShader: `#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}
				void main() {
					vec2 invSize = 1.0 / texSize;
					float fSigma = float(SIGMA);
					float weightSum = gaussianPdf(0.0, fSigma);
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianPdf(x, fSigma);
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`
			} );

		}
		getCompositeMaterial( nMips ) {

			return new THREE.ShaderMaterial( {
				defines: {
					'NUM_MIPS': nMips
				},
				uniforms: {
					'blurTexture1': {
						value: null
					},
					'blurTexture2': {
						value: null
					},
					'blurTexture3': {
						value: null
					},
					'blurTexture4': {
						value: null
					},
					'blurTexture5': {
						value: null
					},
					'bloomStrength': {
						value: 1.0
					},
					'bloomFactors': {
						value: null
					},
					'bloomTintColors': {
						value: null
					},
					'bloomRadius': {
						value: 0.0
					}
				},
				vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
				fragmentShader: `varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
			} );

		}

	}
	UnrealBloomPass.BlurDirectionX = new THREE.Vector2( 1.0, 0.0 );
	UnrealBloomPass.BlurDirectionY = new THREE.Vector2( 0.0, 1.0 );

	THREE.UnrealBloomPass = UnrealBloomPass;

} )();

;
( function () {

	/**
 * Depth-of-field shader with bokeh
 * ported from GLSL shader by Martins Upitis
 * http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html
 */

	const BokehShader = {
		defines: {
			'DEPTH_PACKING': 1,
			'PERSPECTIVE_CAMERA': 1
		},
		uniforms: {
			'tColor': {
				value: null
			},
			'tDepth': {
				value: null
			},
			'focus': {
				value: 1.0
			},
			'aspect': {
				value: 1.0
			},
			'aperture': {
				value: 0.025
			},
			'maxblur': {
				value: 0.01
			},
			'nearClip': {
				value: 1.0
			},
			'farClip': {
				value: 1000.0
			}
		},
		vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
		fragmentShader: /* glsl */`

		#include <common>

		varying vec2 vUv;

		uniform sampler2D tColor;
		uniform sampler2D tDepth;

		uniform float maxblur; // max blur amount
		uniform float aperture; // aperture - bigger values for shallower depth of field

		uniform float nearClip;
		uniform float farClip;

		uniform float focus;
		uniform float aspect;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, nearClip, farClip );
			#else
			return orthographicDepthToViewZ( depth, nearClip, farClip );
			#endif
		}


		void main() {

			vec2 aspectcorrect = vec2( 1.0, aspect );

			float viewZ = getViewZ( getDepth( vUv ) );

			float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

			vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );

			vec2 dofblur9 = dofblur * 0.9;
			vec2 dofblur7 = dofblur * 0.7;
			vec2 dofblur4 = dofblur * 0.4;

			vec4 col = vec4( 0.0 );

			col += texture2D( tColor, vUv.xy );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );

			gl_FragColor = col / 41.0;
			gl_FragColor.a = 1.0;

		}`
	};

	THREE.BokehShader = BokehShader;

} )();

;
( function () {

	/**
 * Depth-of-field post-process with bokeh shader
 */

	class BokehPass extends THREE.Pass {

		constructor( scene, camera, params ) {

			super();
			this.scene = scene;
			this.camera = camera;
			const focus = params.focus !== undefined ? params.focus : 1.0;
			const aspect = params.aspect !== undefined ? params.aspect : camera.aspect;
			const aperture = params.aperture !== undefined ? params.aperture : 0.025;
			const maxblur = params.maxblur !== undefined ? params.maxblur : 1.0;

			// render targets

			this.renderTargetDepth = new THREE.WebGLRenderTarget( 1, 1, {
				// will be resized later
				minFilter: THREE.NearestFilter,
				magFilter: THREE.NearestFilter
			} );
			this.renderTargetDepth.texture.name = 'BokehPass.depth';

			// depth material

			this.materialDepth = new THREE.MeshDepthMaterial();
			this.materialDepth.depthPacking = THREE.RGBADepthPacking;
			this.materialDepth.blending = THREE.NoBlending;

			// bokeh material

			if ( THREE.BokehShader === undefined ) {

				console.error( 'THREE.BokehPass relies on THREE.BokehShader' );

			}

			const bokehShader = THREE.BokehShader;
			const bokehUniforms = THREE.UniformsUtils.clone( bokehShader.uniforms );
			bokehUniforms[ 'tDepth' ].value = this.renderTargetDepth.texture;
			bokehUniforms[ 'focus' ].value = focus;
			bokehUniforms[ 'aspect' ].value = aspect;
			bokehUniforms[ 'aperture' ].value = aperture;
			bokehUniforms[ 'maxblur' ].value = maxblur;
			bokehUniforms[ 'nearClip' ].value = camera.near;
			bokehUniforms[ 'farClip' ].value = camera.far;
			this.materialBokeh = new THREE.ShaderMaterial( {
				defines: Object.assign( {}, bokehShader.defines ),
				uniforms: bokehUniforms,
				vertexShader: bokehShader.vertexShader,
				fragmentShader: bokehShader.fragmentShader
			} );
			this.uniforms = bokehUniforms;
			this.needsSwap = false;
			this.fsQuad = new THREE.FullScreenQuad( this.materialBokeh );
			this._oldClearColor = new THREE.Color();

		}
		render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive*/ ) {

			// Render depth into texture

			this.scene.overrideMaterial = this.materialDepth;
			renderer.getClearColor( this._oldClearColor );
			const oldClearAlpha = renderer.getClearAlpha();
			const oldAutoClear = renderer.autoClear;
			renderer.autoClear = false;
			renderer.setClearColor( 0xffffff );
			renderer.setClearAlpha( 1.0 );
			renderer.setRenderTarget( this.renderTargetDepth );
			renderer.clear();
			renderer.render( this.scene, this.camera );

			// Render bokeh composite

			this.uniforms[ 'tColor' ].value = readBuffer.texture;
			this.uniforms[ 'nearClip' ].value = this.camera.near;
			this.uniforms[ 'farClip' ].value = this.camera.far;
			if ( this.renderToScreen ) {

				renderer.setRenderTarget( null );
				this.fsQuad.render( renderer );

			} else {

				renderer.setRenderTarget( writeBuffer );
				renderer.clear();
				this.fsQuad.render( renderer );

			}

			this.scene.overrideMaterial = null;
			renderer.setClearColor( this._oldClearColor );
			renderer.setClearAlpha( oldClearAlpha );
			renderer.autoClear = oldAutoClear;

		}
		setSize( width, height ) {

			this.renderTargetDepth.setSize( width, height );

		}
		dispose() {

			this.renderTargetDepth.dispose();
			this.materialDepth.dispose();
			this.materialBokeh.dispose();
			this.fsQuad.dispose();

		}

	}

	THREE.BokehPass = BokehPass;

} )();

;
