// --- CAPTURADOR VISUAL D'ERRORS DE DESENVOLUPAMENT ---
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global JS Error caught:", message, "at", source, ":", lineno);
  const statusEl = document.getElementById('status') || document.body;
  if (statusEl) {
    const errorBox = document.createElement('div');
    errorBox.style.cssText = "color: #e74c3c; background: #fdf2f2; border: 2px solid #fde8e8; padding: 12px; border-radius: 6px; margin: 10px; font-family: monospace; font-size: 0.85rem; text-align: left; box-shadow: 0 4px 10px rgba(0,0,0,0.1); position: relative; z-index: 99999;";
    errorBox.innerHTML = `<strong>⚠️ Error de JavaScript en execució:</strong><br>${message}<br><small>Arxiu: ${source} (Línia ${lineno}:${colno})</small>`;
    statusEl.insertBefore(errorBox, statusEl.firstChild);
  }
  return false;
};

// --- GENERADOR DE CODI QR INTERN TOTALMENT OFFLINE (qrcode-generator) ---
var qrcode = function() {
  function r(t,e){if(void 0===t.length)throw new Error(t.length+"/"+e);var n=function(){for(var r=0;r<t.length&&0==t[r];)r+=1;for(var n=new Array(t.length-r+e),o=0;o<t.length-r;o+=1)n[o]=t[o+r];return n}(),o={};return o.getAt=function(r){return n[r]},o.getLength=function(){return n.length},o.multiply=function(t){for(var e=new Array(o.getLength()+t.getLength()-1),n=0;n<o.getLength();n+=1)for(var a=0;a<t.getLength();a+=1)e[n+a]^=i.gexp(i.glog(o.getAt(n))+i.glog(t.getAt(a)));return r(e,0)},o.mod=function(t){if(o.getLength()-t.getLength()<0)return o;for(var e=i.glog(o.getAt(0))-i.glog(t.getAt(0)),n=new Array(o.getLength()),a=0;a<o.getLength();a+=1)n[a]=o.getAt(a);for(var a=0;a<t.getLength();a+=1)n[a]^=i.gexp(i.glog(t.getAt(a))+e);return r(n,0).mod(t)},o}var t=function(t,e){var o=t,i=n[e],c=null,h=0,v=null,l=new Array,w={},d=function(r,t){h=4*o+17,c=function(r){for(var t=new Array(r),e=0;e<r;e+=1){t[e]=new Array(r);for(var n=0;n<r;n+=1)t[e][n]=null}return t}(h),y(0,0),y(h-7,0),y(0,h-7),E(),B(),T(r,t),o>=7&&p(r),null==v&&(v=k(o,i,l)),M(v,t)},y=function(r,t){for(var e=-1;e<=7;e+=1)if(!(r+e<=-1||h<=r+e))for(var n=-1;n<=7;n+=1)t+n<=-1||h<=t+n||(c[r+e][t+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},A=function(){for(var r=0,t=0,e=0;e<8;e+=1){d(!0,e);var n=a.getLostPoint(w);(0==e||r>n)&&(r=n,t=e)}return t},B=function(){for(var r=8;r<h-8;r+=1)null==c[r][6]&&(c[r][6]=r%2==0);for(var t=8;t<h-8;t+=1)null==c[6][t]&&(c[6][t]=t%2==0)},E=function(){for(var r=a.getPatternPosition(o),t=0;t<r.length;t+=1)for(var e=0;e<r.length;e+=1){var n=r[t],i=r[e];if(null==c[n][i])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)c[n+u][i+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},p=function(r){for(var t=a.getBCHTypeNumber(o),e=0;e<18;e+=1){var n=!r&&1==(t>>e&1);c[Math.floor(e/3)][e%3+h-8-3]=n}for(var e=0;e<18;e+=1){var n=!r&&1==(t>>e&1);c[e%3+h-8-3][Math.floor(e/3)]=n}},T=function(r,t){for(var e=i<<3|t,n=a.getBCHTypeInfo(e),o=0;o<15;o+=1){var u=!r&&1==(n>>o&1);o<6?c[o][8]=u:o<8?c[o+1][8]=u:c[h-15+o][8]=u}for(var o=0;o<15;o+=1){var u=!r&&1==(n>>o&1);o<8?c[8][h-o-1]=u:o<9?c[8][15-o-1+1]=u:c[8][15-o-1]=u}c[h-8][8]=!r},M=function(r,t){for(var e=-1,n=h-1,o=7,i=0,u=a.getMaskFunction(t),f=h-1;f>0;f-=2)for(6==f&&(f-=1);;){for(var g=0;g<2;g+=1)if(null==c[n][f-g]){var v=!1;i<r.length&&(v=1==(r[i]>>>o&1));var l=u(n,f-g);l&&(v=!v),c[n][f-g]=v,o-=1,-1==o&&(i+=1,o=7)}if((n+=e)<0||h<=n){n-=e,e=-e;break}}},D=function(t,e){for(var n=0,o=0,i=0,u=new Array(e.length),f=new Array(e.length),g=0;g<e.length;g+=1){var c=e[g].dataCount,h=e[g].totalCount-c;o=Math.max(o,c),i=Math.max(i,h),u[g]=new Array(c);for(var v=0;v<u[g].length;v+=1)u[g][v]=255&t.getBuffer()[v+n];n+=c;var l=a.getErrorCorrectPolynomial(h),s=r(u[g],l.getLength()-1),w=s.mod(l);f[g]=new Array(l.getLength()-1);for(var v=0;v<f[g].length;v+=1){var d=v+w.getLength()-f[g].length;f[g][v]=d>=0?w.getAt(d):0}}for(var y=0,v=0;v<e.length;v+=1)y+=e[v].totalCount;for(var A=new Array(y),B=0,v=0;v<o;v+=1)for(var g=0;g<e.length;g+=1)v<u[g].length&&(A[B]=u[g][v],B+=1);for(var v=0;v<i;v+=1)for(var g=0;g<e.length;g+=1)v<f[g].length&&(A[B]=f[g][v],B+=1);return A},k=function(r,t,e){for(var n=u.getRSBlocks(r,t),o=f(),i=0;i<e.length;i+=1){var g=e[i];o.put(g.getMode(),4),o.put(g.getLength(),a.getLengthInBits(g.getMode(),r)),g.write(o)}for(var c=0,i=0;i<n.length;i+=1)c+=n[i].dataCount;if(o.getLengthInBits()>8*c)throw new Error("code length overflow. ("+o.getLengthInBits()+">"+8*c+")");for(o.getLengthInBits()+4<=8*c&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;;){if(o.getLengthInBits()>=8*c)break;if(o.put(236,8),o.getLengthInBits()>=8*c)break;o.put(17,8)}return D(o,n)};return w.addData=function(r){var t=g(r);l.push(t),v=null},w.isDark=function(r,t){if(r<0||h<=r||t<0||h<=t)throw new Error(r+","+t);return c[r][t]},w.getModuleCount=function(){return h},w.make=function(){d(!1,A())},w.createTableTag=function(r,t){r=r||2,t=void 0===t?4*r:t;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+t+"px;",e+='">',e+="<tbody>";for(var n=0;n<w.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<w.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+r+"px;",e+=" height: "+r+"px;",e+=" background-color: ",e+=w.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},w.createSvgTag=function(r,t){r=r||2,t=void 0===t?4*r:t;var e,n,o,a,i,u=w.getModuleCount()*r+2*t,f="";for(i="l"+r+",0 0,"+r+" -"+r+",0 0,-"+r+"z ",f+="<svg",f+=' width="'+u+'px"',f+=' height="'+u+'px"',f+=' xmlns="http://www.w3.org/2000/svg"',f+=">",f+='<path d="',o=0;o<w.getModuleCount();o+=1)for(a=o*r+t,e=0;e<w.getModuleCount();e+=1)w.isDark(o,e)&&(n=e*r+t,f+="M"+n+","+a+i);return f+='" stroke="transparent" fill="black"/>',f+="</svg>"},w.createImgTag=function(r,t){r=r||2,t=void 0===t?4*r:t;var e=w.getModuleCount()*r+2*t,n=t,o=e-t;return s(e,e,function(t,e){if(n<=t&&t<o&&n<=e&&e<o){var a=Math.floor((t-n)/r),i=Math.floor((e-n)/r);return w.isDark(i,a)?0:1}return 1})},w};t.stringToBytes=function(r){for(var t=new Array,e=0;e<r.length;e+=1){var n=r.charCodeAt(e);t.push(255&n)}return t},t.createStringToBytes=function(r,t){var e=function(){for(var e=v(r),n=function(){var r=e.read();if(-1==r)throw new Error;return r},o=0,a={};;){var i=e.read();if(-1==i)break;var u=n(),f=n(),g=n(),c=String.fromCharCode(i<<8|u),h=f<<8|g;a[c]=h,o+=1}if(o!=t)throw new Error(o+" != "+t);return a}(),n="?".charCodeAt(0);return function(r){for(var t=new Array,o=0;o<r.length;o+=1){var a=r.charCodeAt(o);if(a<128)t.push(a);else{var i=e[r.charAt(o)];"number"==typeof i?(255&i)==i?t.push(i):(t.push(i>>>8),t.push(255&i)):t.push(n)}}return t}};var e={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},n={L:1,M:0,Q:3,H:2},o={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},a=function(){var t=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n={},a=function(r){for(var t=0;0!=r;)t+=1,r>>>=1;return t};return n.getBCHTypeInfo=function(r){for(var t=r<<10;a(t)-a(1335)>=0;)t^=1335<<a(t)-a(1335);return 21522^(r<<10|t)},n.getBCHTypeNumber=function(r){for(var t=r<<12;a(t)-a(7973)>=0;)t^=7973<<a(t)-a(7973);return r<<12|t},n.getPatternPosition=function(r){return t[r-1]},n.getMaskFunction=function(r){switch(r){case o.PATTERN000:return function(r,t){return(r+t)%2==0};case o.PATTERN001:return function(r,t){return r%2==0};case o.PATTERN010:return function(r,t){return t%3==0};case o.PATTERN011:return function(r,t){return(r+t)%3==0};case o.PATTERN100:return function(r,t){return(Math.floor(r/2)+Math.floor(t/3))%2==0};case o.PATTERN101:return function(r,t){return r*t%2+r*t%3==0};case o.PATTERN110:return function(r,t){return(r*t%2+r*t%3)%2==0};case o.PATTERN111:return function(r,t){return(r*t%3+(r+t)%2)%2==0};default:throw new Error("bad maskPattern:"+r)}},n.getErrorCorrectPolynomial=function(t){for(var e=r([1],0),n=0;n<t;n+=1)e=e.multiply(r([1,i.gexp(n)],0));return e},n.getLengthInBits=function(r,t){if(1<=t&&t<10)switch(r){case e.MODE_NUMBER:return 10;case e.MODE_ALPHA_NUM:return 9;case e.MODE_8BIT_BYTE:case e.MODE_KANJI:return 8;default:throw new Error("mode:"+r)}else if(t<27)switch(r){case e.MODE_NUMBER:return 12;case e.MODE_ALPHA_NUM:return 11;case e.MODE_8BIT_BYTE:return 16;case e.MODE_KANJI:return 10;default:throw new Error("mode:"+r)}else{if(!(t<41))throw new Error("type:"+t);switch(r){case e.MODE_NUMBER:return 14;case e.MODE_ALPHA_NUM:return 13;case e.MODE_8BIT_BYTE:return 16;case e.MODE_KANJI:return 12;default:throw new Error("mode:"+r)}}},n.getLostPoint=function(r){for(var t=r.getModuleCount(),e=0,n=0;n<t;n+=1)for(var o=0;o<t;o+=1){for(var a=0,i=r.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||t<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||t<=o+f||0==u&&0==f||i==r.isDark(n+u,o+f)&&(a+=1);a>5&&(e+=3+a-5)}for(var n=0;n<t-1;n+=1)for(var o=0;o<t-1;o+=1){var g=0;r.isDark(n,o)&&(g+=1),r.isDark(n+1,o)&&(g+=1),r.isDark(n,o+1)&&(g+=1),r.isDark(n+1,o+1)&&(g+=1),0!=g&&4!=g||(e+=3)}for(var n=0;n<t;n+=1)for(var o=0;o<t-6;o+=1)r.isDark(n,o)&&!r.isDark(n,o+1)&&r.isDark(n,o+2)&&r.isDark(n,o+3)&&r.isDark(n,o+4)&&!r.isDark(n,o+5)&&r.isDark(n,o+6)&&(e+=40);for(var o=0;o<t;o+=1)for(var n=0;n<t-6;n+=1)r.isDark(n,o)&&!r.isDark(n+1,o)&&r.isDark(n+2,o)&&r.isDark(n+3,o)&&r.isDark(n+4,o)&&!r.isDark(n+5,o)&&r.isDark(n+6,o)&&(e+=40);for(var c=0,o=0;o<t;o+=1)for(var n=0;n<t;n+=1)r.isDark(n,o)&&(c+=1);return e+=Math.abs(100*c/t/t-50)/5*10},n}(),i=function(){for(var r=new Array(256),t=new Array(256),e=0;e<8;e+=1)r[e]=1<<e;for(var e=8;e<256;e+=1)r[e]=r[e-4]^r[e-5]^r[e-6]^r[e-8];for(var e=0;e<255;e+=1)t[r[e]]=e;var n={};return n.glog=function(r){if(r<1)throw new Error("glog("+r+")");return t[r]},n.gexp=function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return r[t]},n}(),u=function(){var r=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(r,t){var e={};return e.totalCount=r,e.dataCount=t,e},e={},o=function(t,e){switch(e){case n.L:return r[4*(t-1)+0];case n.M:return r[4*(t-1)+1];case n.Q:return r[4*(t-1)+2];case n.H:return r[4*(t-1)+3];default:return}};return e.getRSBlocks=function(r,e){var n=o(r,e);if(void 0===n)throw new Error("bad rs block @ typeNumber:"+r+"/errorCorrectionLevel:"+e);for(var a=n.length/3,i=new Array,u=0;u<a;u+=1)for(var f=n[3*u+0],g=n[3*u+1],c=n[3*u+2],h=0;h<f;h+=1)i.push(t(g,c));return i},e}(),f=function(){var r=new Array,t=0,e={};return e.getBuffer=function(){return r},e.getAt=function(t){var e=Math.floor(t/8);return 1==(r[e]>>>7-t%8&1)},e.put=function(r,t){for(var n=0;n<t;n+=1)e.putBit(1==(r>>>t-n-1&1))},e.getLengthInBits=function(){return t},e.putBit=function(e){var n=Math.floor(t/8);r.length<=n&&r.push(0),e&&(r[n]|=128>>>t%8),t+=1},e},g=function(r){var n=e.MODE_8BIT_BYTE,o=t.stringToBytes(r),a={};return a.getMode=function(){return n},a.getLength=function(r){return o.length},a.write=function(r){for(var t=0;t<o.length;t+=1)r.put(o[t],8)},a},c=function(){var r=new Array,t={};return t.writeByte=function(t){r.push(255&t)},t.writeShort=function(r){t.writeByte(r),t.writeByte(r>>>8)},t.writeBytes=function(r,e,n){e=e||0,n=n||r.length;for(var o=0;o<n;o+=1)t.writeByte(r[o+e])},t.writeString=function(r){for(var e=0;e<r.length;e+=1)t.writeByte(r.charCodeAt(e))},t.toByteArray=function(){return r},t.toString=function(){var t="";t+="[";for(var e=0;e<r.length;e+=1)e>0&&(t+=","),t+=r[e];return t+="]"},t},h=function(){var r=0,t=0,e=0,n="",o={},a=function(r){n+=String.fromCharCode(i(63&r))},i=function(r){if(r<0);else{if(r<26)return 65+r;if(r<52)return r-26+97;if(r<62)return r-52+48;if(62==r)return 43;if(63==r)return 47}throw new Error("n:"+r)};return o.writeByte=function(n){for(r=r<<8|255&n,t+=8,e+=1;t>=6;)a(r>>>t-6),t-=6},o.flush=function(){if(t>0&&(a(r<<6-t),r=0,t=0),e%3!=0)for(var o=3-e%3,i=0;i<o;i+=1)n+="="},o.toString=function(){return n},o},v=function(r){var t=r,e=0,n=0,o=0,a={};a.read=function(){for(;o<8;){if(e>=t.length){if(0==o)return-1;throw new Error("unexpected end of file./"+o)}var r=t.charAt(e);if(e+=1,"="==r)return o=0,-1;r.match(/^\s$/)||(n=n<<6|i(r.charCodeAt(0)),o+=6)}var a=n>>>o-8&255;return o-=8,a};var i=function(r){if(65<=r&&r<=90)return r-65;if(97<=r&&r<=122)return r-97+26;if(48<=r&&r<=57)return r-48+52;if(43==r)return 62;if(47==r)return 63;throw new Error("c:"+r)};return a},l=function(r,t){var e=r,n=t,o=new Array(r*t),a={};a.setPixel=function(r,t,n){o[t*e+r]=n},a.write=function(r){r.writeString("GIF87a"),r.writeShort(e),r.writeShort(n),r.writeByte(128),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(255),r.writeByte(255),r.writeByte(255),r.writeString(","),r.writeShort(0),r.writeShort(0),r.writeShort(e),r.writeShort(n),r.writeByte(0);var t=u(2);r.writeByte(2);for(var o=0;t.length-o>255;)r.writeByte(255),r.writeBytes(t,o,255),o+=255;r.writeByte(t.length-o),r.writeBytes(t,o,t.length-o),r.writeByte(0),r.writeString(";")};var i=function(r){var t=r,e=0,n=0,o={};return o.write=function(r,o){if(r>>>o!=0)throw new Error("length over");for(;e+o>=8;)t.writeByte(255&(r<<e|n)),o-=8-e,r>>>=8-e,n=0,e=0;n|=r<<e,e+=o},o.flush=function(){e>0&&t.writeByte(n)},o},u=function(r){for(var t=1<<r,e=1+(1<<r),n=r+1,a=f(),u=0;u<t;u+=1)a.add(String.fromCharCode(u));a.add(String.fromCharCode(t)),a.add(String.fromCharCode(e));var g=c(),h=i(g);h.write(t,n);var v=0,l=String.fromCharCode(o[v]);for(v+=1;v<o.length;){var s=String.fromCharCode(o[v]);v+=1,a.contains(l+s)?l+=s:(h.write(a.indexOf(l),n),a.size()<4095&&(a.size()==1<<n&&(n+=1),a.add(l+s)),l=s)}return h.write(a.indexOf(l),n),h.write(e,n),h.flush(),g.toByteArray()},f=function(){var r={},t=0,e={};return e.add=function(n){if(e.contains(n))throw new Error("dup key:"+n);r[n]=t,t+=1},e.size=function(){return t},e.indexOf=function(t){return r[t]},e.contains=function(t){return void 0!==r[t]},e};return a},s=function(r,t,e,n){for(var o=l(r,t),a=0;a<t;a+=1)for(var i=0;i<r;i+=1)o.setPixel(i,a,e(i,a));var u=c();o.write(u);for(var f=h(),g=u.toByteArray(),v=0;v<g.length;v+=1)f.writeByte(g[v]);f.flush();var s="";return s+="<img",s+=' src="',s+="data:image/gif;base64,",s+=f,s+='"',s+=' width="',s+=r,s+='"',s+=' height="',s+=t,s+='"',n&&(s+=' alt="',s+=n,s+='"'),s+="/>"};return t}();!function(r){"function"==typeof define&&define.amd?define([],r):"object"==typeof exports&&(module.exports=r())}(function(){return qrcode});

// --- RESOLUCIÓ D'URL DEL SERVIDOR LOCAL ---
// Detectem la URL base del servidor Python de forma automàtica.
// Si estem en localtunnel o un túnel d'Internet, respectem l'origen del túnel.
// Si estem en xarxa local (localhost / IPs), normalitzem els ports.
function isLocalHostOrIp() {
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.')
  );
}

function getBaseUrl() {
  const proto = window.location.protocol;
  if (proto === 'http:' || proto === 'https:') {
    if (isLocalHostOrIp()) {
      const url = new URL(window.location.href);
      url.port = '8080';
      url.protocol = 'http:';
      return url.origin;
    }
    return window.location.origin;
  }
  return 'http://localhost:8080';
}

function getRelayBase() {
  const proto = window.location.protocol;
  if (proto === 'http:' || proto === 'https:') {
    if (isLocalHostOrIp()) {
      const url = new URL(window.location.href);
      url.port = '8080';
      url.protocol = 'http:';
      return url.origin;
    }
    return window.location.origin;
  }
  return 'http://localhost:8080';
}

function getBneApiUrl(keywords) {
  return `${getBaseUrl()}/api/bne?isbn=${encodeURIComponent(keywords)}`;
}

window.syncSelectedBook = function(bookData) {
  fetch(`${getBaseUrl()}/api/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  })
  .then(res => {
    if (res.ok) {
      const btn = document.getElementById('sync-desktop-btn');
      if (btn) {
        btn.innerHTML = '✅ Enviat correctament!';
        btn.style.background = '#27ae60';
        setTimeout(() => {
          btn.innerHTML = '📥 Enviar a l\'ordinador de treball';
          btn.style.background = btn.dataset.origColor || '#8cc63f';
        }, 3000);
      }
    } else {
      alert("Error en enviar: " + res.statusText);
    }
  })
  .catch(err => {
    alert("Error de connexió: " + err.message);
  });
};

// Variables d'estat global per a la cerca de llibres
window._biblio = {
  allScoredBooks: [],
  lastSearchStrategy: '',
  lastUsedBNE: false,
  currentThreshold: 0.98
};

// ─── Mòdul de Relay de Càmera Mòbil ──────────────────────────────────────────
(function initCameraRelay() {
  const POLL_MS = 300; // interval de polling (ms) → ~3fps
  let lastTimestamp = 0;
  let relayActive = false;
  let pollTimer = null;

  const relayImg        = document.getElementById('relay-img');
  const relayPlaceholder = document.getElementById('relay-placeholder');
  const relayBadge      = document.getElementById('relay-badge');
  const relayStatusText = document.getElementById('relay-status-text');
  const btnRelayOcr     = document.getElementById('btn-relay-ocr');
  const relayOpenMobile = document.getElementById('relay-open-mobile');

  // Configurem l'enllaç al mòbil de forma dinàmica segons la ruta actual
  if (relayOpenMobile) {
    let path = window.location.pathname;
    // Extraiem el directori de la URL eliminant el fitxer del final si hi és (ex: index.html)
    const lastSlash = path.lastIndexOf('/');
    if (lastSlash !== -1) {
      path = path.substring(0, lastSlash + 1);
    } else {
      path = '/';
    }
    relayOpenMobile.href = path + 'camera_mobile/';
  }

  if (!relayImg) return; // pàgina sense el panel de relay (ex: mòbil)

  async function pollFrame() {
    try {
      const res = await fetch(`${getRelayBase()}/api/camera-frame?t=${Date.now()}`, {
        cache: 'no-store'
      });

      if (res.status === 204) {
        // Cap frame encara
        setInactive();
      } else if (res.ok) {
        const ts = res.headers.get('X-Frame-Timestamp') || Date.now();
        if (ts !== lastTimestamp) {
          lastTimestamp = ts;
          const blob = await res.blob();
          const url  = URL.createObjectURL(blob);
          const old  = relayImg.src;
          relayImg.src = url;
          relayImg.style.display = 'block';
          relayPlaceholder.style.display = 'none';
          if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
          setActive();
        }
      }
    } catch (e) {
      // Silenci — servidor no disponible o xarxa tallada
    }

    if (pollTimer !== null) {
      pollTimer = setTimeout(pollFrame, POLL_MS);
    }
  }

  function setActive() {
    if (!relayActive) {
      relayActive = true;
      relayBadge.className = 'live';
      btnRelayOcr.disabled = false;
      relayStatusText.textContent = 'Càmera mòbil connectada i transmetent.';
    }
  }

  function setInactive() {
    if (relayActive) {
      relayActive = false;
      relayBadge.className = '';
      btnRelayOcr.disabled = true;
      relayStatusText.textContent = 'Esperant connexió del mòbil…';
    }
  }

  // Comprovem l'estat de la connexió cada 2.5s per detectar desconnexions
  setInterval(async () => {
    try {
      const res = await fetch(`${getRelayBase()}/api/camera-status`);
      if (res.ok) {
        const data = await res.json();
        if (!data.active) setInactive();
      }
    } catch(e) {}
  }, 2500);

  // Botó OCR: captura el frame actual i el processa
  btnRelayOcr.addEventListener('click', async () => {
    if (!relayImg.src || relayImg.style.display === 'none') return;

    btnRelayOcr.disabled = true;
    btnRelayOcr.textContent = '⏳ Processant…';
    relayStatusText.textContent = 'Executant OCR sobre el fotograma…';

    try {
      // Dibuixem la imatge en un canvas per poder-la passar a Tesseract
      const cvs = document.createElement('canvas');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = relayImg.src;
      await img.decode();
      cvs.width  = img.naturalWidth;
      cvs.height = img.naturalHeight;
      cvs.getContext('2d').drawImage(img, 0, 0);

      // Mostrem el preview a la secció principal
      const previewEl  = document.getElementById('preview');
      const previewCon = document.getElementById('preview-container');
      if (previewEl && previewCon) {
        previewEl.src = relayImg.src;
        previewCon.style.display = 'block';
      }

      // Disparem el flux d'anàlisi existent: creem un File objecte i simulem el canvi
      cvs.toBlob(async (blob) => {
        const file = new File([blob], 'relay-frame.jpg', { type: 'image/jpeg' });
        const dt = new DataTransfer();
        dt.items.add(file);
        const fi = document.getElementById('file-input');
        if (fi) {
          fi.files = dt.files;
          fi.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 'image/jpeg', 0.92);
    } catch (err) {
      relayStatusText.textContent = 'Error en processar: ' + err.message;
    } finally {
      setTimeout(() => {
        btnRelayOcr.disabled = false;
        btnRelayOcr.textContent = '🔍 Analitzar fotograma actual';
        relayStatusText.textContent = relayActive
          ? 'Càmera mòbil connectada i transmetent.'
          : 'Esperant connexió del mòbil…';
      }, 2000);
    }
  });

  // Iniciem el polling en carregar la pàgina
  pollTimer = setTimeout(pollFrame, 500);
})();

// --- Filtre de Pre-processament d'Imatge (Visió per Computador Avançada) ---
function preprocessImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const SCALE_FACTOR = 1.0;
      let width = img.width * SCALE_FACTOR;
      let height = img.height * SCALE_FACTOR;
      
      const MAX_WIDTH = 450;
      if (width > MAX_WIDTH) {
        height = Math.round(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.imageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const numPixels = width * height;

      // 1. Equalització d'histograma a color per a la visualització de l'usuari (mantenint un disseny premium)
      const histR = new Array(256).fill(0);
      const histG = new Array(256).fill(0);
      const histB = new Array(256).fill(0);
      for (let i = 0; i < data.length; i += 4) {
        histR[data[i]]++;
        histG[data[i+1]]++;
        histB[data[i+2]]++;
      }

      const cdfR = new Array(256).fill(0);
      const cdfG = new Array(256).fill(0);
      const cdfB = new Array(256).fill(0);
      cdfR[0] = histR[0]; cdfG[0] = histG[0]; cdfB[0] = histB[0];
      for (let i = 1; i < 256; i++) {
        cdfR[i] = cdfR[i-1] + histR[i];
        cdfG[i] = cdfG[i-1] + histG[i];
        cdfB[i] = cdfB[i-1] + histB[i];
      }
      
      const cdfMinR = cdfR.find(v => v > 0) || 0;
      const cdfMinG = cdfG.find(v => v > 0) || 0;
      const cdfMinB = cdfB.find(v => v > 0) || 0;

      const lutR = cdfR.map(v => (numPixels === cdfMinR) ? 0 : Math.round(((v - cdfMinR) / (numPixels - cdfMinR)) * 255));
      const lutG = cdfG.map(v => (numPixels === cdfMinG) ? 0 : Math.round(((v - cdfMinG) / (numPixels - cdfMinG)) * 255));
      const lutB = cdfB.map(v => (numPixels === cdfMinB) ? 0 : Math.round(((v - cdfMinB) / (numPixels - cdfMinB)) * 255));

      const previewCanvas = document.createElement('canvas');
      previewCanvas.width = width;
      previewCanvas.height = height;
      const previewCtx = previewCanvas.getContext('2d');
      const previewImageData = previewCtx.createImageData(width, height);
      const previewData = previewImageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = lutR[data[i]];
        const g = lutG[data[i+1]];
        const b = lutB[data[i+2]];
        previewData[i]   = r;
        previewData[i+1] = g;
        previewData[i+2] = b;
        previewData[i+3] = 255;
      }
      previewCtx.putImageData(previewImageData, 0, 0);
      const previewUrl = previewCanvas.toDataURL('image/jpeg', 1.0);

      // 2. Generem les dues imatges en escala de grisos d'alt contrast, processades senceres
      const cropHeight = height;
      
      const normalCanvas = document.createElement('canvas');
      normalCanvas.width = width;
      normalCanvas.height = cropHeight;
      const normalCtx = normalCanvas.getContext('2d');
      const normalImageData = normalCtx.createImageData(width, cropHeight);
      const normalData = normalImageData.data;

      const invertedCanvas = document.createElement('canvas');
      invertedCanvas.width = width;
      invertedCanvas.height = cropHeight;
      const invertedCtx = invertedCanvas.getContext('2d');
      const invertedImageData = invertedCtx.createImageData(width, cropHeight);
      const invertedData = invertedImageData.data;

      // Canvases adicionals per a l'estirament de contrast (contrast stretching)
      const normalCanvasStretched = document.createElement('canvas');
      normalCanvasStretched.width = width;
      normalCanvasStretched.height = cropHeight;
      const normalCtxStretched = normalCanvasStretched.getContext('2d');
      const normalImageDataStretched = normalCtxStretched.createImageData(width, cropHeight);
      const normalDataStretched = normalImageDataStretched.data;

      const invertedCanvasStretched = document.createElement('canvas');
      invertedCanvasStretched.width = width;
      invertedCanvasStretched.height = cropHeight;
      const invertedCtxStretched = invertedCanvasStretched.getContext('2d');
      const invertedImageDataStretched = invertedCtxStretched.createImageData(width, cropHeight);
      const invertedDataStretched = invertedImageDataStretched.data;

      // Primer, calculem la mitjana de grisos per a tot el crop per separat
      const normalGrays = new Uint8Array(width * cropHeight);
      const invertedGrays = new Uint8Array(width * cropHeight);
      const numCropPixels = width * cropHeight;
      
      for (let i = 0; i < numCropPixels; i++) {
        const r = previewData[i * 4];
        const g = previewData[i * 4 + 1];
        const b = previewData[i * 4 + 2];
        const grayVal = Math.round((r + g + b) / 3);
        
        normalGrays[i] = grayVal;
        invertedGrays[i] = 255 - grayVal;
      }
      
      // 3. Imatge Integral per a càlcul O(1) de la mitjana local (Bradley-Roth)
      const integralNormal = new Float64Array(numCropPixels);
      const integralInverted = new Float64Array(numCropPixels);
      
      for (let y = 0; y < cropHeight; y++) {
        let sumNormal = 0;
        let sumInverted = 0;
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          sumNormal += normalGrays[idx];
          sumInverted += invertedGrays[idx];
          
          if (y === 0) {
            integralNormal[idx] = sumNormal;
            integralInverted[idx] = sumInverted;
          } else {
            const upIdx = (y - 1) * width + x;
            integralNormal[idx] = integralNormal[upIdx] + sumNormal;
            integralInverted[idx] = integralInverted[upIdx] + sumInverted;
          }
        }
      }

      const windowSize = Math.max(40, Math.round(width / 8));
      const halfWin = Math.floor(windowSize / 2);
      const C = 10; // Llindar de contrast local

      for (let y = 0; y < cropHeight; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          
          const x0 = Math.max(0, x - halfWin);
          const x1 = Math.min(width - 1, x + halfWin);
          const y0 = Math.max(0, y - halfWin);
          const y1 = Math.min(cropHeight - 1, y + halfWin);
          
          const count = (x1 - x0 + 1) * (y1 - y0 + 1);
          
          // --- Passada Normal Adaptativa ---
          let sumN = integralNormal[y1 * width + x1];
          if (y0 > 0) sumN -= integralNormal[(y0 - 1) * width + x1];
          if (x0 > 0) sumN -= integralNormal[y1 * width + (x0 - 1)];
          if (x0 > 0 && y0 > 0) sumN += integralNormal[(y0 - 1) * width + (x0 - 1)];
          const avgN = sumN / count;
          const normalVal = (normalGrays[idx] < (avgN - C)) ? 0 : 255;

          // --- Passada Invertida Adaptativa ---
          let sumI = integralInverted[y1 * width + x1];
          if (y0 > 0) sumI -= integralInverted[(y0 - 1) * width + x1];
          if (x0 > 0) sumI -= integralInverted[y1 * width + (x0 - 1)];
          if (x0 > 0 && y0 > 0) sumI += integralInverted[(y0 - 1) * width + (x0 - 1)];
          const avgI = sumI / count;
          const invertedVal = (invertedGrays[idx] < (avgI - C)) ? 0 : 255;

          const outIdx = idx * 4;
          normalData[outIdx]     = normalVal;
          normalData[outIdx + 1] = normalVal;
          normalData[outIdx + 2] = normalVal;
          normalData[outIdx + 3] = 255;

          invertedData[outIdx]     = invertedVal;
          invertedData[outIdx + 1] = invertedVal;
          invertedData[outIdx + 2] = invertedVal;
          invertedData[outIdx + 3] = 255;
        }
      }

      // --- Passada de Binarització Fixa (T = 105) ---
      const T = 105;
      for (let i = 0; i < numCropPixels; i++) {
        const nG = normalGrays[i];
        const normalValStr = (nG < T) ? 0 : 255;

        const iG = invertedGrays[i];
        const invertedValStr = (iG < T) ? 0 : 255;

        const outIdx = i * 4;
        normalDataStretched[outIdx]     = normalValStr;
        normalDataStretched[outIdx + 1] = normalValStr;
        normalDataStretched[outIdx + 2] = normalValStr;
        normalDataStretched[outIdx + 3] = 255;

        invertedDataStretched[outIdx]     = invertedValStr;
        invertedDataStretched[outIdx + 1] = invertedValStr;
        invertedDataStretched[outIdx + 2] = invertedValStr;
        invertedDataStretched[outIdx + 3] = 255;
      }

      normalCtx.putImageData(normalImageData, 0, 0);
      const normalUrl = normalCanvas.toDataURL('image/jpeg', 1.0);

      invertedCtx.putImageData(invertedImageData, 0, 0);
      const invertedUrl = invertedCanvas.toDataURL('image/jpeg', 1.0);

      normalCtxStretched.putImageData(normalImageDataStretched, 0, 0);
      const normalUrlStretched = normalCanvasStretched.toDataURL('image/jpeg', 1.0);

      invertedCtxStretched.putImageData(invertedImageDataStretched, 0, 0);
      const invertedUrlStretched = invertedCanvasStretched.toDataURL('image/jpeg', 1.0);

      // --- Càlcul de la llegibilitat / nitidesa per a tota la imatge ---
      let minGrayVal = 255;
      let maxGrayVal = 0;
      let edgeSumVal = 0;
      let edgeCountVal = 0;
      
      const step = Math.max(1, Math.round(numCropPixels / 40000));
      for (let i = 0; i < numCropPixels; i += step) {
        const g = normalGrays[i];
        if (g < minGrayVal) minGrayVal = g;
        if (g > maxGrayVal) maxGrayVal = g;
      }
      
      const contrastVal = maxGrayVal - minGrayVal;
      const skip = step * 2 + 1;
      
      for (let y = 1; y < cropHeight - 1; y += skip) {
        for (let x = 1; x < width - 1; x += skip) {
          const idx = y * width + x;
          const val = normalGrays[idx];
          
          const diffX = Math.abs(val - normalGrays[idx + 1]);
          const diffY = Math.abs(val - normalGrays[idx + width]);
          
          if (diffX > 15 || diffY > 15) {
            edgeSumVal += (diffX + diffY);
            edgeCountVal++;
          }
        }
      }
      
      const edgeDensityVal = edgeCountVal / ((width * cropHeight) / (skip * skip));
      const avgEdgeStrengthVal = edgeCountVal > 0 ? (edgeSumVal / edgeCountVal) : 0;
      
      let focusScoreVal = Math.min(100, Math.round((avgEdgeStrengthVal / 50) * 100));
      let densityScoreVal = Math.min(100, Math.round((edgeDensityVal / 0.16) * 100));
      
      let readabilityScore = Math.round((focusScoreVal * 0.6) + (densityScoreVal * 0.4));
      
      if (contrastVal < 90) {
        readabilityScore = Math.round(readabilityScore * (contrastVal / 90));
      }
      
      readabilityScore = Math.max(5, Math.min(99, readabilityScore));
      
      let readabilityLabel = '';
      let readabilityColor = '';
      
      if (readabilityScore < 40) {
        readabilityLabel = '⚠️ Desenfocada o amb poc text';
        readabilityColor = '#e74c3c';
      } else if (readabilityScore < 75) {
        readabilityLabel = '⚡ Nitidesa mitjana';
        readabilityColor = '#f39c12';
      } else {
        readabilityLabel = '✨ Nitidesa excel·lent';
        readabilityColor = '#2ecc71';
      }

      resolve({ 
        previewUrl, normalUrl, invertedUrl, normalUrlStretched, invertedUrlStretched,
        readabilityScore, readabilityLabel, readabilityColor
      });
    };
    img.onerror = reject;
    
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    reader.readAsDataURL(file);
  });
}

// Funció per calcular el % de paraules del títol i de l'autor que es troben dins l'OCR
function calculateOverlapScore(book, ocrTextRaw) {
  const ocrWords = new Set(ocrTextRaw.toLowerCase().replace(/[^\w\sàéèíóòúüçñ]/g, '').split(/\s+/));
  
  // Analitzar Títol
  const titleWords = (book.title || '').toLowerCase().replace(/[^\w\sàéèíóòúüçñ]/g, '').split(/\s+/).filter(w => w.length > 1);
  let titleMatches = 0;
  for (let w of titleWords) {
    if (ocrWords.has(w)) titleMatches++;
  }
  const titleScore = titleWords.length > 0 ? (titleMatches / titleWords.length) : 0;

  // Analitzar Autor
  let authorScore = 0;
  if (book.author_name && book.author_name.length > 0) {
    const authorWords = book.author_name[0].toLowerCase().replace(/[^\w\sàéèíóòúüçñ]/g, '').split(/\s+/).filter(w => w.length > 1);
    let authorMatches = 0;
    for (let w of authorWords) {
      if (ocrWords.has(w)) authorMatches++;
    }
    authorScore = authorWords.length > 0 ? (authorMatches / authorWords.length) : 0;
  }

  return (titleScore * 0.6) + (authorScore * 0.4);
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const preview = document.getElementById('preview');
  const previewContainer = document.getElementById('preview-container');
  const overlayCanvas = document.getElementById('overlay-canvas');
  const status = document.getElementById('status');
  const resultsContainer = document.getElementById('results-container');
  const rawOcr = document.getElementById('raw-ocr');
  const cleanOcr = document.getElementById('clean-ocr');
  const bookResults = document.getElementById('book-results');
  const thresholdSlider = document.getElementById('threshold-slider');
  const thresholdVal = document.getElementById('threshold-val');
  const debugCheck = document.getElementById('debug-check');
  const debugImagesContainer = document.getElementById('debug-images-container');
  const debugNormal = document.getElementById('debug-normal');
  const debugInverted = document.getElementById('debug-inverted');

  // --- Generació i enllaç de la Sessió de Sincronització Estàtica (GitHub Pages) ---
  let sessionID = localStorage.getItem('biblioscan_session_id');
  if (!sessionID) {
    sessionID = Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('biblioscan_session_id', sessionID);
  }
  const qrContainer = document.getElementById('session-qr-container');
  const relayOpenMobile = document.getElementById('relay-open-mobile');
  const relayStatusText = document.getElementById('relay-status-text');

  if (qrContainer) {
    let path = window.location.pathname;
    const lastSlash = path.lastIndexOf('/');
    if (lastSlash !== -1) {
      path = path.substring(0, lastSlash + 1);
    } else {
      path = '/';
    }
    
    let baseOrigin = window.location.origin;
    if (baseOrigin === 'null' || !baseOrigin) {
      baseOrigin = 'http://localhost:8000';
    }
    
    const mobileUrl = `${baseOrigin}${path}camera_mobile/?session=${sessionID}`;
    
    // Generem el codi QR de forma 100% local i offline amb la llibreria qrcode
    try {
      // typeNumber = 0 (auto-detecció), errorCorrectionLevel = 'M' (mitjà)
      const qr = qrcode(0, 'M');
      qr.addData(mobileUrl);
      qr.make();
      
      // La llibreria ens retorna un tag HTML complet de tipus <img src="data:image/gif;base64,...">
      qrContainer.innerHTML = qr.createImgTag(3, 4); // pixelsize = 3, margin = 4
      
      // Li donem estil a la imatge generada
      const imgEl = qrContainer.querySelector('img');
      if (imgEl) {
        imgEl.style.cssText = "display: block; margin: 0 auto; border: 4px solid #fff; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 130px; height: auto;";
        imgEl.alt = "Codi QR de connexió";
      }
    } catch (qrErr) {
      console.warn("Error generant QR local, provant fallback de Google Charts:", qrErr);
      // Fallback extrem per si la llibreria no s'hagués carregat correctament
      qrContainer.innerHTML = `<img src="https://chart.googleapis.com/chart?chs=130x130&cht=qr&chl=${encodeURIComponent(mobileUrl)}&choe=UTF-8" style="display: block; margin: 0 auto; border: 4px solid #fff; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" width="130" height="130" alt="Codi QR de connexió">`;
    }
    
    if (relayOpenMobile) {
      relayOpenMobile.href = mobileUrl;
    }

    // Botó per copiar l'enllaç de sincronització al portaretalls
    const btnCopy = document.getElementById('btn-copy-mobile-url');
    const copyMsg = document.getElementById('copy-success-msg');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(mobileUrl).then(() => {
          if (copyMsg) {
            copyMsg.style.display = 'inline';
            setTimeout(() => {
              copyMsg.style.display = 'none';
            }, 2000);
          }
        }).catch(err => {
          alert("Copia aquest enllaç manualment al teu mòbil:\n" + mobileUrl);
        });
      });
    }
  }

  if (relayStatusText) {
    relayStatusText.innerHTML = `Sessió: <strong>${sessionID}</strong>. Escoltant canal estàtic...`;
  }

  // Connexió SSE cap a ntfy.sh per a rebre dades de text OCR o de llibres directament des del mòbil
  const eventSource = new EventSource(`https://ntfy.sh/biblioscan-sync-${sessionID}/sse`);
  eventSource.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg && msg.message) {
        const payload = JSON.parse(msg.message);
        if (payload) {
          if (payload.ocrText) {
            handleSyncedOcr(payload.ocrText);
          } else if (payload.isFinalBook && payload.title) {
            handleSyncedBook(payload);
          }
        }
      }
    } catch (e) {
      // Ignorem missatges no JSON
    }
  };

  function handleSyncedOcr(ocrTextVal) {
    if (relayStatusText) {
      relayStatusText.innerHTML = `📥 OCR rebut des del mòbil. Cercant en catàlegs...`;
    }
    
    // Omplim la interfície principal
    resultsContainer.style.display = 'block';
    rawOcr.innerText = `[Sincronització Mòbil - OCR brut]\n${ocrTextVal}`;
    cleanOcr.innerText = ocrTextVal;
    
    // Cridem a la cerca unificada del llibre utilitzant els catàlegs globals (Open Library + BNE)
    searchBookByText(ocrTextVal, status);
  }

  function handleSyncedBook(payload) {
    if (relayStatusText) {
      relayStatusText.innerHTML = `📥 Llibre sincronitzat: <strong style="color: #2ecc71;">${payload.title}</strong> (${payload.score}% coinc.)`;
    }
    
    // Aquest codi s'assegura que el llibre es mostra en pantalla si per exemple arriba d'una altra banda
    resultsContainer.style.display = 'block';
    const doc = {
      title: payload.title,
      author_name: payload.authors ? [payload.authors] : ['Desconegut'],
      publisher: payload.publisher ? [payload.publisher] : ['Desconegut'],
      first_publish_year: payload.publishYear,
      isbn: payload.isbn ? [payload.isbn] : [],
      publish_place: payload.place ? [payload.place] : [],
      subject: payload.subjects ? payload.subjects.split(', ') : []
    };
    
    allScoredBooks = [{
      book: doc,
      score: payload.score / 100,
      matchedWords: []
    }];
    
    window._biblio.allScoredBooks = allScoredBooks;
    renderBookList();
  }

  // Sincronització Bookmarklet via SSE (sense dependre del servidor local Python)
  const bookmarkletLink = document.getElementById('bookmarklet-link');
  if (bookmarkletLink) {
    const bookmarkletCode = `javascript:(async () => {
      console.log("Iniciant sincronització BiblioScan estàtica...");
      let active = true;
      const statusDiv = document.createElement('div');
      statusDiv.style.position = 'fixed';
      statusDiv.style.top = '10px';
      statusDiv.style.right = '10px';
      statusDiv.style.background = '#2ecc71';
      statusDiv.style.color = 'white';
      statusDiv.style.padding = '10px 15px';
      statusDiv.style.borderRadius = '5px';
      statusDiv.style.zIndex = '999999';
      statusDiv.style.fontFamily = 'sans-serif';
      statusDiv.style.fontSize = '12px';
      statusDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      statusDiv.innerHTML = '🔄 Escoltant canal BiblioScan (${sessionID})... <button id="stop-sync-btn" style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;margin-left:10px;">[X]</button>';
      document.body.appendChild(statusDiv);
      
      document.getElementById('stop-sync-btn').onclick = () => {
        active = false;
        statusDiv.remove();
        alert("Sincronització aturada.");
      };

      const eventSource = new EventSource('https://ntfy.sh/biblioscan-sync-${sessionID}/sse');
      eventSource.onmessage = (event) => {
        if (!active) { eventSource.close(); return; }
        try {
          const msg = JSON.parse(event.data);
          if (msg && msg.message) {
            const data = JSON.parse(msg.message);
            if (data && data.title) {
              statusDiv.style.background = '#3498db';
              statusDiv.innerHTML = '📥 Rebut: ' + data.title + '...';
              
              const mappings = {
                'titol': data.title,
                'title': data.title,
                'nom': data.title,
                'name': data.title,
                'autor': data.authors,
                'author': data.authors,
                'creator': data.authors,
                'editorial': data.publisher,
                'publisher': data.publisher,
                'editorial_dest': data.publisher,
                'any': data.publishYear,
                'year': data.publishYear,
                'date': data.publishYear,
                'lloc': data.place,
                'place': data.place,
                'isbn': data.isbn,
                'gènere': data.subjects,
                'genere': data.subjects,
                'subject': data.subjects,
                'tema': data.subjects
              };
              
              const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
              inputs.forEach(el => {
                const name = (el.name || el.id || el.className || '').toLowerCase();
                for (const [key, val] of Object.entries(mappings)) {
                  if (name.includes(key) && val) {
                    el.value = val;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }
              });

              setTimeout(() => {
                statusDiv.style.background = '#2ecc71';
                statusDiv.innerHTML = '🔄 Escoltant canal BiblioScan (${sessionID})... <button id="stop-sync-btn" style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;margin-left:10px;">[X]</button>';
                const stopBtn = document.getElementById('stop-sync-btn');
                if (stopBtn) {
                  stopBtn.onclick = () => {
                    active = false;
                    statusDiv.remove();
                  };
                }
              }, 3000);
            }
          }
        } catch (e) {
          console.error("Error al processar missatge SSE:", e);
        }
      };
    })();`;
    bookmarkletLink.href = bookmarkletCode.replace(/\s+/g, ' ');
  }

  // Variables d'estat per a la renderització dinàmica amb la barra de probabilitat
  let allScoredBooks = window._biblio.allScoredBooks;
  let lastSearchStrategy = window._biblio.lastSearchStrategy;
  let lastUsedBNE = window._biblio.lastUsedBNE;
  let currentThreshold = window._biblio.currentThreshold;

  thresholdSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    thresholdVal.innerText = `${val}%`;
    currentThreshold = val / 100;
    if (allScoredBooks.length > 0) {
      renderBookList();
    }
  });

  debugCheck.addEventListener('change', (e) => {
    debugImagesContainer.style.display = e.target.checked ? 'flex' : 'none';
  });

  fileInput.addEventListener('change', handleFile);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Reset UI
    resultsContainer.style.display = 'none';
    bookResults.innerHTML = '';
    previewContainer.style.display = 'none';
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      preview.src = event.target.result;
      previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);

    try {
      status.innerText = '⚙️ Inicialitzant motor OCR i aplicant filtres de visió...';
      const { 
        previewUrl, normalUrl, invertedUrl, normalUrlStretched, invertedUrlStretched,
        readabilityScore, readabilityLabel, readabilityColor
      } = await preprocessImage(file);
      
      // Mostrem la imatge a color equalitzada al preview per a una millor estètica
      preview.src = previewUrl;
      
      // Assignem les imatges de depuració adaptativa
      debugNormal.src = normalUrl;
      debugInverted.src = invertedUrl;
      
      // Mostrem la llegibilitat de la foto abans de fer OCR
      status.innerHTML = `⚙️ Nitidesa de la foto: <strong style="color: ${readabilityColor}">${readabilityScore}% (${readabilityLabel})</strong>.<br>Inicialitzant motor OCR i processant...`;
      
      const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const ocrLang = isMobileDevice ? 'cat' : 'spa+cat';

      let currentPass = 1;
      const worker = await Tesseract.createWorker(ocrLang, 1, {
        logger: m => {
          if (m && m.status === 'recognizing text') {
            status.innerText = `🔍 Reconeixent text (Passada ${currentPass} de 4): ${Math.round(m.progress * 100)}%`;
          } else if (m && m.status) {
            status.innerText = `⚙️ Tesseract: ${m.status}...`;
          }
        }
      });
      
      // Passada 1: Imatge Normal Adaptativa
      currentPass = 1;
      const { data: ocrResultNormal } = await worker.recognize(normalUrl);
      
      // Passada 2: Imatge Invertida Adaptativa
      currentPass = 2;
      const { data: ocrResultInverted } = await worker.recognize(invertedUrl);

      // Passada 3: Imatge Normal Estirada
      currentPass = 3;
      const { data: ocrResultNormalStr } = await worker.recognize(normalUrlStretched);

      // Passada 4: Imatge Invertida Estirada
      currentPass = 4;
      const { data: ocrResultInvertedStr } = await worker.recognize(invertedUrlStretched);
      
      await worker.terminate();

      const wordsNormal = (ocrResultNormal.words || []).map(w => { w.source = 'normal_adaptive'; return w; });
      const wordsInverted = (ocrResultInverted.words || []).map(w => { w.source = 'inverted_adaptive'; return w; });
      const wordsNormalStr = (ocrResultNormalStr.words || []).map(w => { w.source = 'normal_stretched'; return w; });
      const wordsInvertedStr = (ocrResultInvertedStr.words || []).map(w => { w.source = 'inverted_stretched'; return w; });

      if (wordsNormal.length === 0 && wordsInverted.length === 0 && wordsNormalStr.length === 0 && wordsInvertedStr.length === 0) {
        status.innerText = '❌ No s\'ha detectat cap paraula a la portada.';
        return;
      }

      // --- VISIÓ PER COMPUTADOR / DETECCIÓ I SEGMENTACIÓ D'ÀREES DE TEXT ---
      // Calculem la mida (alçada de caixa) de totes les paraules detectades entre les passades
      const allHeights = [...wordsNormal, ...wordsInverted, ...wordsNormalStr, ...wordsInvertedStr].map(w => w.bbox.y1 - w.bbox.y0);
      const maxWordHeight = allHeights.length > 0 ? Math.max(...allHeights) : 0;
      
      // Ajustem el llindar d'alçada al 20% de la lletra més gran perquè l'autor no quedi descartat si és més petit que el títol
      const heightThreshold = maxWordHeight * 0.20;

      // Filtrem per alçada i confiança.
      const canvasHeight = preview.naturalHeight || preview.height || 800;
      const validNormal = wordsNormal.filter(w => 
        (w.bbox.y1 - w.bbox.y0) >= heightThreshold && 
        w.confidence > 40
      );
      const validInverted = wordsInverted.filter(w => 
        (w.bbox.y1 - w.bbox.y0) >= heightThreshold && 
        w.confidence > 40
      );
      const validNormalStr = wordsNormalStr.filter(w => 
        (w.bbox.y1 - w.bbox.y0) >= heightThreshold && 
        w.confidence > 40
      );
      const validInvertedStr = wordsInvertedStr.filter(w => 
        (w.bbox.y1 - w.bbox.y0) >= heightThreshold && 
        w.confidence > 40
      );

      // Funció de fusió evitant duplicats espacials per IoU (Intersection over Union)
      function mergeWordLists(target, source) {
        source.forEach(wSource => {
          const isDuplicate = target.some(wTarget => {
            const boxTarget = wTarget.bbox;
            const boxSource = wSource.bbox;
            
            const xOverlap = Math.max(0, Math.min(boxTarget.x1, boxSource.x1) - Math.max(boxTarget.x0, boxSource.x0));
            const yOverlap = Math.max(0, Math.min(boxTarget.y1, boxSource.y1) - Math.max(boxTarget.y0, boxSource.y0));
            const overlapArea = xOverlap * yOverlap;
            
            const areaTarget = (boxTarget.x1 - boxTarget.x0) * (boxTarget.y1 - boxTarget.y0);
            const areaSource = (boxSource.x1 - boxSource.x0) * (boxSource.y1 - boxSource.y0);
            const minArea = Math.min(areaTarget, areaSource);
            
            return (overlapArea / minArea) > 0.40;
          });

          if (!isDuplicate) {
            target.push(wSource);
          } else {
            const idx = target.findIndex(wTarget => {
              const boxTarget = wTarget.bbox;
              const boxSource = wSource.bbox;
              const xOverlap = Math.max(0, Math.min(boxTarget.x1, boxSource.x1) - Math.max(boxTarget.x0, boxSource.x0));
              const yOverlap = Math.max(0, Math.min(boxTarget.y1, boxSource.y1) - Math.max(boxTarget.y0, boxSource.y0));
              const overlapArea = xOverlap * yOverlap;
              const areaTarget = (boxTarget.x1 - boxTarget.x0) * (boxTarget.y1 - boxTarget.y0);
              const areaSource = (boxSource.x1 - boxSource.x0) * (boxSource.y1 - boxSource.y0);
              return (overlapArea / Math.min(areaTarget, areaSource)) > 0.40;
            });
            if (idx !== -1 && wSource.confidence > target[idx].confidence) {
              target[idx] = wSource;
            }
          }
        });
      }

      const mergedWords = [...validNormal];
      mergeWordLists(mergedWords, validInverted);
      mergeWordLists(mergedWords, validNormalStr);
      mergeWordLists(mergedWords, validInvertedStr);

      // Preparem el Canvas overlay per dibuixar les caixes de visió artificial sobre la imatge normal
      const ctx = overlayCanvas.getContext('2d');
      overlayCanvas.width = preview.naturalWidth || preview.width || 600;
      overlayCanvas.height = preview.naturalHeight || preview.height || 800;
      ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

      // Dibuixem les caixes verdes (text vàlid fusionat) i vermelles (tots els descarts no duplicats)
      const discardedNormal = wordsNormal.filter(w => !validNormal.includes(w));
      const discardedInverted = wordsInverted.filter(w => !validInverted.includes(w));
      const discardedNormalStr = wordsNormalStr.filter(w => !validNormalStr.includes(w));
      const discardedInvertedStr = wordsInvertedStr.filter(w => !validInvertedStr.includes(w));
      const allDiscarded = [...discardedNormal, ...discardedInverted, ...discardedNormalStr, ...discardedInvertedStr];
      
      ctx.lineWidth = Math.max(2, Math.round(overlayCanvas.width / 400));
      
      // Pintem les àrees descartades en vermell molt tènue
      allDiscarded.forEach(w => {
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
        ctx.fillStyle = 'rgba(231, 76, 60, 0.03)';
        ctx.fillRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0);
        ctx.strokeRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0);
      });

      // Pintem les àrees vàlides fusionades en verd brillant
      mergedWords.forEach(w => {
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.9)';
        ctx.fillStyle = 'rgba(46, 204, 113, 0.15)';
        ctx.fillRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0);
        ctx.strokeRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0);
      });

      if (mergedWords.length === 0) {
        status.innerText = '❌ No s\'ha trobat cap bloc de text principal a la portada.';
        resultsContainer.style.display = 'block';
        rawOcr.innerHTML = `<strong>Avís:</strong> S'han filtrat totes les paraules.\n\n` +
                           `<strong>Paraules brutes detectades abans de filtrar:</strong>\n` +
                           [...wordsNormal, ...wordsInverted, ...wordsNormalStr, ...wordsInvertedStr].map(w => `- [${w.source}] "${w.text}" (confiança: ${w.confidence}%, alçada: ${w.bbox.y1 - w.bbox.y0}px, y: ${w.bbox.y0}px-${w.bbox.y1}px)`).join('\n');
        return;
      }

      // Ordenem les paraules de dalt a baix i d'esquerra a dreta segons la seva posició per mantenir el flux de lectura coherent
      mergedWords.sort((a, b) => {
        if (Math.abs(a.bbox.y0 - b.bbox.y0) < 15) {
          return a.bbox.x0 - b.bbox.x0;
        }
        return a.bbox.y0 - b.bbox.y0;
      });

      let text = mergedWords.map(w => w.text).join(' ');

      // 2. NORMALITZACIÓ D'ARTEFACTES D'OCR
      // Arreglem el clàssic error de la xarxa neuronal LSTM que confon la "ñ" amb la lligadura "fi"
      text = text.replace(/ufia/gi, 'uña')
                 .replace(/fio/gi, 'ño')
                 .replace(/fia/gi, 'ña')
                 .replace(/iriba/gi, 'i riba')
                 .replace(/\brba\b/gi, 'riba')
                 .replace(/ll['’]?imperí?/gi, "i l'imperi")
                 .replace(/il['’]?imperí?/gi, "i l'imperi")
                 .replace(/l['’]?imperí?/gi, "l'imperi");

      resultsContainer.style.display = 'block';
      rawOcr.innerHTML = `<strong>Text final normalitzat:</strong> ${text}\n\n` +
                         `<strong>Llista detallada de paraules detectades:</strong>\n` +
                         mergedWords.map(w => `- [${w.source}] "${w.text}" (confiança: ${w.confidence}%, y: ${w.bbox.y0}px-${w.bbox.y1}px)`).join('\n');
      
       status.innerText = '🧹 Netejant i analitzant el text...';
       await searchBookByText(text, status);
     } catch (err) {
       console.error(err);
       status.innerText = `❌ Error en el procés: ${err.message}`;
     }
   }
 
   // --- CERCA UNIFICADA DE LLIBRES EN CATÀLEGS (OPEN LIBRARY + FALLBACK BNE) ---
   async function searchBookByText(text, statusTarget = status) {
     try {
       statusTarget.innerText = '🧹 Netejant i analitzant el text...';
       const stopwords = new Set(['el', 'la', 'els', 'les', 'un', 'una', 'de', 'del', 'i', 'a', 'en', 'per', 'amb', 'y', 'los', 'las', 'para', 'con', 'the', 'of', 'and', 'in', 'for']);
       
       const cleanText = text.toLowerCase().replace(/[^\w\sàéèíóòúüçñ]/g, '');
       const ocrWordsList = cleanText.split(/\s+/);
       const keywords = ocrWordsList.filter(w => !stopwords.has(w) && w.length > 2);
 
       if (cleanOcr) cleanOcr.innerText = `Paraules clau extretes:\n[ ${keywords.join(', ')} ]`;
       
       if (keywords.length === 0) {
         statusTarget.innerText = '❌ El text llegit era massa curt o invàlid.';
         return;
       }
 
       const apiKeywords = keywords.slice(0, 8);
 
       statusTarget.innerText = '🌐 Cercant a Open Library (Cerca estricta AND)...';
       let andQuery = apiKeywords.join('+');
       let url = `https://openlibrary.org/search.json?q=${andQuery}&fields=key,title,author_name,first_publish_year,cover_i,publisher&limit=30`;
       
       let response = await fetch(url);
       let data = await response.json();
       let searchStrategy = 'AND (Totes les paraules principals)';
 
       if (data.numFound === 0 || data.docs.length === 0) {
         statusTarget.innerText = '🌐 Cap resultat exacte. Cercant amb Cerca laxada OR...';
         searchStrategy = 'OR (Major nombre de coincidències)';
         let orQuery = apiKeywords.join('+OR+');
         url = `https://openlibrary.org/search.json?q=${orQuery}&fields=key,title,author_name,first_publish_year,cover_i,publisher&limit=30`;
         response = await fetch(url);
         data = await response.json();
       }
 
       statusTarget.innerText = '✅ Analitzant les probabilitats...';
              if (data.numFound === 0 || data.docs.length === 0) {
          bookResults.innerHTML = '<p>No s\'ha trobat cap llibre a nivell mundial que tingui aquestes paraules.</p>';
          statusTarget.innerText = '❌ Cerca finalitzada sense resultats.';
          if (typeof relayStatusText !== 'undefined' && relayStatusText) {
            relayStatusText.innerHTML = `<span style="color: #e74c3c;">❌ Cap llibre trobat als catàlegs.</span>`;
          }
          return;
        }
 
       // Reordenar localment basat en Token Overlap
       allScoredBooks = data.docs.map(book => {
         book.matchScore = calculateOverlapScore(book, text);
         return book;
       });
       window._biblio.allScoredBooks = allScoredBooks;
       lastSearchStrategy = searchStrategy;
       lastUsedBNE = false;
 
       const maxOLScore = allScoredBooks.length > 0 ? Math.max(...allScoredBooks.map(b => b.matchScore)) : 0;
 
       // Fallback a la Biblioteca Nacional de España (BNE)
       if (maxOLScore < 0.99) {
         statusTarget.innerText = '🌐 Coincidència Open Library parcial o inexistent. Consultant la BNE...';
         try {
           const bneQuery = apiKeywords.join(' ');
           const bneUrl = getBneApiUrl(bneQuery);
           
           const controller = new AbortController();
           const timeoutId = setTimeout(() => controller.abort(), 3000);
 
           const bneResData = await fetch(bneUrl, { signal: controller.signal })
             .then(r => r.ok ? r.json() : null)
             .catch(err => {
               console.warn("La crida a la BNE ha fallat o ha expirat el temps d'espera:", err);
               return null;
             })
             .finally(() => clearTimeout(timeoutId));
           
           if (bneResData && bneResData.docs && bneResData.docs.length > 0) {
             window.bneCache = window.bneCache || {};
             
             const bneBooks = bneResData.docs.map(doc => {
               const display = doc.pnx.display || {};
               const addata = doc.pnx.addata || {};
               
               let title = 'Llibre desconegut';
               if (display.title && display.title[0]) {
                 title = display.title[0].split('/')[0].trim();
               }
               
               let author_name = [];
               if (display.creator && display.creator[0]) {
                 author_name = [display.creator[0].split('$$')[0].trim()];
               } else if (addata.creatorfull && addata.creatorfull[0]) {
                 author_name = [addata.creatorfull[0].split('$$')[0].trim()];
               }
               if (author_name.length > 0) {
                 let cleanAuthor = author_name[0].replace(/[\d-]/g, '').trim();
                 if (cleanAuthor.endsWith(',')) cleanAuthor = cleanAuthor.slice(0, -1).trim();
                 if (cleanAuthor.includes(',')) {
                   cleanAuthor = cleanAuthor.split(',').reverse().join(' ').trim();
                 }
                 author_name = [cleanAuthor];
               }
 
               let publisher = [];
               if (display.publisher && display.publisher[0]) {
                 let pub = display.publisher[0].split(':')[1];
                 if (pub) pub = pub.split(',')[0].trim();
                 else pub = display.publisher[0].trim();
                 publisher = [pub];
               } else if (addata.pub && addata.pub[0]) {
                 publisher = [addata.pub[0]];
               }
 
               let first_publish_year = display.creationdate ? display.creationdate[0] : 'Any desc.';
               let isbn = '';
               if (addata.isbn && addata.isbn[0]) {
                 isbn = addata.isbn[0].replace(/[^0-9X]/gi, '');
               }
 
               const key = `/bne/${doc.context || 'L'}/${doc.recordid || (doc.pnx.control && doc.pnx.control.sourcrecordid ? doc.pnx.control.sourcrecordid[0] : Math.random())}`;
               window.bneCache[key] = doc;
 
               return {
                 key: key,
                 title: title,
                 author_name: author_name,
                 first_publish_year: first_publish_year,
                 publisher: publisher,
                 cover_i: null,
                 isBNE: true,
                 isbn: isbn
               };
             });
 
             let scoredBne = bneBooks.map(book => {
               book.matchScore = calculateOverlapScore(book, text);
               return book;
             });

             allScoredBooks = [...allScoredBooks, ...scoredBne];
             window._biblio.allScoredBooks = allScoredBooks;
             if (scoredBne.length > 0) {
               lastUsedBNE = true;
             }
           }
         } catch (e) {
           console.warn("Error consultant la BNE:", e);
         }
       }

       // Pintem
       renderBookList();

       // Publiquem el llibre guanyador a ntfy.sh i sync local
       let filtered = allScoredBooks.filter(book => book.matchScore >= currentThreshold);
       filtered.sort((a, b) => b.matchScore - a.matchScore);
       if (filtered.length > 0) {
         const winner = filtered[0];
         const payload = {
           title: winner.title,
           authors: winner.author_name ? winner.author_name.join(', ') : 'Desconegut',
           publisher: winner.publisher ? winner.publisher[0] : 'Desconegut',
           publishYear: winner.first_publish_year || '',
           isbn: winner.isbn ? (Array.isArray(winner.isbn) ? winner.isbn[0] : winner.isbn) : '',
           place: winner.publish_place ? winner.publish_place[0] : '',
           subjects: winner.subject ? (Array.isArray(winner.subject) ? winner.subject.slice(0, 3).join(', ') : winner.subject) : '',
           score: Math.round(winner.matchScore * 100),
           isFinalBook: true
         };

         if (relayStatusText) {
           relayStatusText.innerHTML = `✅ Trobat: <strong style="color: #2ecc71;">${winner.title}</strong> (${Math.round(winner.matchScore * 100)}% coinc.)`;
         }

         fetch(`https://ntfy.sh/biblioscan-sync-${sessionID}`, {
           method: 'POST',
           body: JSON.stringify(payload)
         }).catch(e => {});

         fetch(`${getRelayBase()}/api/sync-poll`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             title: payload.title,
             authors: payload.authors,
             publisher: payload.publisher,
             publishYear: payload.publishYear,
             isbn: payload.isbn,
             place: payload.place,
             subjects: payload.subjects
           })
         }).catch(e => {});
       } else {
         statusTarget.innerText = '❌ Cap llibre supera el llindar d\'èxit.';
         if (relayStatusText) {
           relayStatusText.innerHTML = `<span style="color: #e74c3c;">❌ Cap llibre coincideix amb prou qualitat.</span>`;
         }
       }
     } catch (err) {
       console.error(err);
       statusTarget.innerText = `❌ Error en cercar catalogs: ${err.message}`;
     }
   }
  }

  // --- FUNCIÓ DE PINTAT DINÀMIC QUE RESPECTA EL LLINDAR DEL SLIDER ---
  function renderBookList() {
    // Filtrem segons el llindar actual triat per l'usuari amb el slider
    let filtered = allScoredBooks.filter(book => book.matchScore >= currentThreshold);
    
    // Ordenem de major probabilitat a menor
    filtered.sort((a, b) => b.matchScore - a.matchScore);
    
    // Ens quedem amb els 5 millors resultats
    let topBooks = filtered.slice(0, 5);

    if (topBooks.length === 0) {
      status.innerText = '❌ Cerca finalitzada sense resultats.';
      bookResults.innerHTML = `<p style="color: #e74c3c;">❌ No s'ha trobat cap llibre coincident a Open Library ni a la BNE amb probabilitat >= ${(currentThreshold * 100).toFixed(0)}%.</p>`;
      return;
    }

    status.innerText = '✅ Cerca finalitzada.';
    let htmlContent = `<p>Resultats unificats (OL / BNE) via: <span class="badge ${lastSearchStrategy.includes('OR') ? 'or' : ''}">${lastSearchStrategy}</span>${lastUsedBNE ? ' + <span class="badge" style="background:#e74c3c;">BNE Fallback</span>' : ''}</p><p style="font-size: 0.85rem; color: #7f8c8d;">💡 Clica sobre qualsevol llibre per veure'n la fitxa completa.</p>`;
    
    topBooks.forEach((book, index) => {
      const placeholderSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2280%22%20height%3D%22120%22%20viewBox%3D%220%200%2080%20120%22%3E%3Crect%20fill%3D%22%23ecf0f1%22%20width%3D%2280%22%20height%3D%22120%22%2F%3E%3Ctext%20fill%3D%22%2395a5a6%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ESense%20Port.%3C%2Ftext%3E%3C%2Fsvg%3E";
      
      let coverUrl = placeholderSvg;
      if (book.isBNE && book.isbn) {
        coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
      } else if (book.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      }

      const authors = book.author_name ? book.author_name.join(', ') : 'Autor desconegut';
      const apiTitle = book.title;
      const publishers = book.publisher ? book.publisher.slice(0,2).join(', ') : 'Varis/Desconegut';
      const scorePercent = (book.matchScore * 100).toFixed(1);
      
      let color = scorePercent > 70 ? 'green' : (scorePercent > 40 ? 'orange' : 'red');

      // Escapem cometes per la funció de clic
      const safeTitle = apiTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const safeAuthors = authors.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const publishYear = book.first_publish_year || 'Desconegut';

      const sourceBadge = book.isBNE 
        ? `<span style="background: #e74c3c; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; margin-left: 5px;">BNE</span>`
        : `<span style="background: #3498db; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; margin-left: 5px;">OL</span>`;

      htmlContent += `
        <div class="book-result" style="cursor: pointer; transition: background 0.2s; padding: 10px; border-radius: 8px; border: 1px solid transparent;" onclick="window.fetchBookDetails('${book.key}', '${safeTitle}', '${coverUrl}', '${safeAuthors}', '${publishYear}')" onmouseover="this.style.background='#f0f8ff'; this.style.borderColor='#b3d4fc';" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent';">
          <img src="${coverUrl}" alt="Cover" onerror="this.src='${placeholderSvg}'">
          <div class="book-info">
            <h4>${index + 1}. ${apiTitle} (${book.first_publish_year || 'Any desc.'}) ${sourceBadge}</h4>
            <p>👤 Autor: ${authors}</p>
            <p>🏢 Editorial dest.: ${publishers}</p>
            <p style="margin-top: 5px;">📊 Probabilitat: <strong style="color: ${color};">${scorePercent}%</strong></p>
          </div>
        </div>
      `;
    });
    
    bookResults.innerHTML = htmlContent;
  }
});

// --- LÒGICA DE LES DADES MESTRES (Finestra Flotant) ---
window.fetchBookDetails = async function(key, title, coverUrl, authors, publishYear) {
  const modal = document.getElementById('book-details-modal');
  const detailsContent = document.getElementById('details-content');
  
  modal.style.display = 'flex';
  detailsContent.innerHTML = `<div style="text-align: center; color: #3498db; margin: 20px 0;">⏳ Obtenint dades de catàleg per "${title}"...</div>`;

  try {
    // Interceptem els llibres de la Biblioteca Nacional de España (BNE)
    if (key.startsWith('/bne/')) {
      const doc = window.bneCache ? window.bneCache[key] : null;
      if (!doc) throw new Error("No s'han trobat dades locals per aquest llibre de la BNE.");
      
      const display = doc.pnx.display || {};
      const addata = doc.pnx.addata || {};

      let finalPublishers = 'Desconeguda';
      if (display.publisher && display.publisher[0]) {
        let pub = display.publisher[0].split(':')[1];
        if (pub) finalPublishers = pub.split(',')[0].trim();
        else finalPublishers = display.publisher[0].trim();
      } else if (addata.pub && addata.pub[0]) {
        finalPublishers = addata.pub[0];
      }

      let finalPlaces = 'Desconegut';
      if (display.publisher && display.publisher[0]) {
        finalPlaces = display.publisher[0].split(':')[0].trim();
      }

      let subjects = [];
      if (display.genre) display.genre.forEach(g => subjects.push(g.split('$$')[0].trim()));
      if (display.subject) display.subject.forEach(s => subjects.push(s.split('$$')[0].trim()));
      let finalSubjects = subjects.length > 0 ? Array.from(new Set(subjects)).slice(0, 5).join(', ') : 'No categoritzat';

      if (finalSubjects !== 'No categoritzat') {
        try {
          const translateResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(finalSubjects)}&langpair=en|ca`);
          const translateData = await translateResponse.json();
          if (translateData && translateData.responseData && translateData.responseData.translatedText) {
            finalSubjects = translateData.responseData.translatedText;
          }
        } catch (e) {}
      }

      const book = window._biblio.allScoredBooks.find(b => b.key === key);
      const isbnVal = book ? (book.isbn || "") : "";

      detailsContent.innerHTML = `
        <div style="display: flex; gap: 30px; margin-bottom: 20px; flex-wrap: wrap;">
          <img src="${coverUrl}" style="width: 220px; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" alt="Cover" onerror="this.style.display='none'">
          
          <div style="flex: 1; min-width: 280px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <h2 style="margin: 0 0 10px 0; font-size: 1.7rem; color: #2c3e50; line-height: 1.3;">${title}</h2>
            <span style="background: #e74c3c; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; display: inline-block; margin-bottom: 25px;">Llibre (BNE)</span>
            
            <div style="margin-top: 10px;">
              <h3 style="background: #f2f2f2; padding: 10px 15px; margin: 0 0 15px 0; font-size: 1.1rem; color: #444; font-weight: normal; border-radius: 4px;">Informació general</h3>
              
              <div style="font-size: 0.95rem; color: #666; line-height: 1.9; padding-left: 5px;">
                <div>Autor: <span style="color: #7ab800;">${authors}</span></div>
                <div>Editorial: <span style="color: #555;">${finalPublishers}</span></div>
                <div>Any d'edició: <span style="color: #555;">${publishYear}</span></div>
                <div>Lloc d'edició: <span style="color: #555;">${finalPlaces}</span></div>
                <div>Categoria: <span style="color: #7ab800;">${finalSubjects}</span></div>
              </div>
              
              <button id="sync-desktop-btn" data-orig-color="#e74c3c" onclick="window.syncSelectedBook({ title: '${title.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', authors: '${authors.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', publisher: '${finalPublishers.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', publishYear: '${publishYear}', place: '${finalPlaces.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', subjects: '${finalSubjects.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', isbn: '${isbnVal}', source: 'BNE' })" style="margin-top: 20px; width: 100%; padding: 12px; background: #e74c3c; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s;">
                📥 Enviar a l'ordinador de treball
              </button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const workResponse = await fetch(`https://openlibrary.org${key}.json`);
    const workData = await workResponse.json();
    
    const editionsResponse = await fetch(`https://openlibrary.org${key}/editions.json?limit=50`);
    const editionsData = await editionsResponse.json();

    // 1. Mineria de Temes/Tags
    let subjectsSet = new Set();
    if (workData.subjects) workData.subjects.forEach(s => subjectsSet.add(s));

    // 2. Mineria de Dades Físiques d'Edicions
    let placesSet = new Set();
    let publishersSet = new Set();
    let firstValidIsbn = null;
    let subtitle = '';
    
    if (editionsData.entries && editionsData.entries.length > 0) {
      editionsData.entries.forEach(ed => {
        if (ed.subjects) ed.subjects.forEach(s => subjectsSet.add(s));
        if (ed.publish_places) ed.publish_places.forEach(p => placesSet.add(p));
        if (ed.publishers) ed.publishers.forEach(p => publishersSet.add(p));
        if (ed.subtitle && !subtitle) subtitle = ed.subtitle;

        if (ed.isbn_13 && !firstValidIsbn) firstValidIsbn = ed.isbn_13[0];
        else if (ed.isbn_10 && !firstValidIsbn) firstValidIsbn = ed.isbn_10[0];
      });
    }

    // 3. API Extra
    if (firstValidIsbn) {
      try {
        const isbnResponse = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${firstValidIsbn}&format=json&jscmd=data`);
        const isbnData = await isbnResponse.json();
        const specificBook = isbnData[`ISBN:${firstValidIsbn}`];
        if (specificBook && specificBook.subtitle && !subtitle) subtitle = specificBook.subtitle;
      } catch(e) {}
    }

    let finalSubjects = subjectsSet.size > 0 ? Array.from(subjectsSet).slice(0, 5).join(', ') : 'No categoritzat';
    let finalPlaces = placesSet.size > 0 ? Array.from(placesSet).slice(0, 3).join(', ') : 'Desconegut';
    let finalPublishers = publishersSet.size > 0 ? Array.from(publishersSet).slice(0, 2).join(', ') : 'Desconeguda';
    
    // --- TRADUCTOR AUTOMÀTIC (Anglès -> Català) ---
    if (finalSubjects !== 'No categoritzat') {
      try {
        const translateResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(finalSubjects)}&langpair=en|ca`);
        const translateData = await translateResponse.json();
        if (translateData && translateData.responseData && translateData.responseData.translatedText) {
          finalSubjects = translateData.responseData.translatedText;
        }
      } catch (e) {
        console.warn("No s'ha pogut connectar amb el servei de traducció:", e);
      }
    }
    
    let displayTitle = subtitle ? `${title}. ${subtitle}` : title;

    // INTERFÍCIE NETA ESTIL CATÀLEG
    detailsContent.innerHTML = `
      <div style="display: flex; gap: 30px; margin-bottom: 20px; flex-wrap: wrap;">
        <img src="${coverUrl}" style="width: 220px; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" alt="Cover">
        
        <div style="flex: 1; min-width: 280px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <h2 style="margin: 0 0 10px 0; font-size: 1.7rem; color: #2c3e50; line-height: 1.3;">${displayTitle}</h2>
          <span style="background: #8cc63f; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; display: inline-block; margin-bottom: 25px;">Llibre</span>
          
          <div style="margin-top: 10px;">
            <h3 style="background: #f2f2f2; padding: 10px 15px; margin: 0 0 15px 0; font-size: 1.1rem; color: #444; font-weight: normal; border-radius: 4px;">Informació general</h3>
            
            <div style="font-size: 0.95rem; color: #666; line-height: 1.9; padding-left: 5px;">
              <div>Autor: <span style="color: #7ab800;">${authors}</span></div>
              <div>Editorial: <span style="color: #555;">${finalPublishers}</span></div>
              <div>Any d'edició: <span style="color: #555;">${publishYear}</span></div>
              <div>Lloc d'edició: <span style="color: #555;">${finalPlaces}</span></div>
              <div>Categoria: <span style="color: #7ab800;">${finalSubjects}</span></div>
            </div>
            
            <button id="sync-desktop-btn" data-orig-color="#8cc63f" onclick="window.syncSelectedBook({ title: '${displayTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', authors: '${authors.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', publisher: '${finalPublishers.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', publishYear: '${publishYear}', place: '${finalPlaces.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', subjects: '${finalSubjects.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', isbn: '${firstValidIsbn || ""}', source: 'Open Library' })" style="margin-top: 20px; width: 100%; padding: 12px; background: #8cc63f; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s;">
              📥 Enviar a l'ordinador de treball
            </button>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    detailsContent.innerHTML = `<div style="text-align: center; color: #e74c3c;">❌ Error de connexió amb Open Library: ${err.message}</div>`;
  }
};

document.getElementById('close-details')?.addEventListener('click', () => {
  document.getElementById('book-details-modal').style.display = 'none';
});
