// Experimental request-header construction only. No request is sent.
// Requires Web Crypto, an independently published matching signed key directory,
// and a caller-supplied PRIVATE Ed25519 JWK kept outside this repository.
const enc=new TextEncoder();
const b64=bytes=>btoa(String.fromCharCode(...bytes));
const b64url=bytes=>b64(bytes).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
export async function createWebBotAuthHeaders({url,directoryUrl,privateJwk}){
 const target=new URL(url),directory=new URL(directoryUrl);
 if(target.protocol!=='https:'||directory.protocol!=='https:'||target.username||target.password||directory.username||directory.password||target.hash||directory.hash)throw new Error('HTTPS URLs without credentials or fragments required');
 if(!privateJwk||privateJwk.kty!=='OKP'||privateJwk.crv!=='Ed25519'||typeof privateJwk.x!=='string'||typeof privateJwk.d!=='string')throw new Error('Expected private Ed25519 JWK');
 const publicJwk={crv:'Ed25519',kty:'OKP',x:privateJwk.x};
 const thumbprint=b64url(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(JSON.stringify(publicJwk)))));
 const created=Math.floor(Date.now()/1000),expires=created+60;
 const agent=JSON.stringify(directory.href);
 const params='("@method" "@authority" "@path" "@query" "signature-agent");created='+created+';expires='+expires+';keyid="'+thumbprint+'";alg="ed25519";tag="web-bot-auth"';
 const base='"@method": GET\n"@authority": '+target.host+'\n"@path": '+target.pathname+'\n"@query": '+(target.search||'?')+'\n"signature-agent": '+agent+'\n"@signature-params": '+params;
 const key=await crypto.subtle.importKey('jwk',privateJwk,{name:'Ed25519'},false,['sign']);
 const signature=new Uint8Array(await crypto.subtle.sign('Ed25519',key,enc.encode(base)));
 return {method:'GET',url:target.href,headers:{'Signature-Agent':agent,'Signature-Input':'sig1='+params,Signature:'sig1=:'+b64(signature)+':'},expires,publicJwk,thumbprint,limitations:['Untested request-signing profile only; no network request sent.','No Cloudflare registration, verified-bot status or guarantee of request acceptance.','No receiver-side verification, nonce replay store or anti-abuse controls.','The matching key must be independently bound to the correct signed directory.']};
}
