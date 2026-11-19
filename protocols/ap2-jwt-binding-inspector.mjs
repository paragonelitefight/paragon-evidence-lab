// Narrow research inspector, NOT a full AP2 / SD-JWT mandate verifier.
// No purchase authorization, network fetch, payment or receipt issuance.
const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true});
function bytes(s){if(typeof s!=='string'||!s||!/^[A-Za-z0-9_-]+$/.test(s))throw new Error('Invalid base64url');const base=s.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(base+'='.repeat((4-base.length%4)%4)),c=>c.charCodeAt(0));}
function b64url(b){return btoa(String.fromCharCode(...b)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
export async function inspectSignedCheckoutJwt({jwt,trustedMerchantJwk,expectedIssuer,expectedCheckoutHash,nowSeconds=Math.floor(Date.now()/1000)}){
 if(typeof jwt!=='string'||jwt.length>65536||jwt.includes('~'))throw new Error('Only a compact signed Checkout JWT is supported, not SD-JWT mandates');
 if(!trustedMerchantJwk||trustedMerchantJwk.kty!=='EC'||trustedMerchantJwk.crv!=='P-256'||trustedMerchantJwk.d)throw new Error('Independently trusted PUBLIC P-256 key required');
 if(typeof expectedIssuer!=='string'||!expectedIssuer||typeof expectedCheckoutHash!=='string'||!expectedCheckoutHash||!Number.isSafeInteger(nowSeconds)||nowSeconds<0)throw new Error('Expected issuer, expected Checkout hash and valid time required');
 const parts=jwt.split('.');if(parts.length!==3)throw new Error('Invalid compact JWT');
 const header=JSON.parse(decoder.decode(bytes(parts[0]))),payload=JSON.parse(decoder.decode(bytes(parts[1])));
 if(header.alg!=='ES256'||header.crit!==undefined||header.b64!==undefined||header.jku!==undefined||header.x5u!==undefined)throw new Error('Unsupported JWT header profile');
 if(payload.iss!==expectedIssuer)throw new Error('Unexpected issuer');
 if(!Number.isSafeInteger(payload.exp)||payload.exp<=nowSeconds)throw new Error('Expiry required by this research profile');
 if(payload.nbf!==undefined&&(!Number.isSafeInteger(payload.nbf)||payload.nbf>nowSeconds))throw new Error('JWT not yet valid');
 if(payload.iat!==undefined&&(!Number.isSafeInteger(payload.iat)||payload.iat>nowSeconds))throw new Error('Invalid issue time');
 const signature=bytes(parts[2]);if(signature.length!==64)throw new Error('Expected JOSE ES256 signature');
 const key=await crypto.subtle.importKey('jwk',trustedMerchantJwk,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
 if(!await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,signature,encoder.encode(parts[0]+'.'+parts[1])))throw new Error('Signature invalid');
 const actualHash=b64url(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(jwt))));
 if(actualHash!==expectedCheckoutHash)throw new Error('Checkout hash mismatch');
 return {format:'paragon-ap2-checkout-jwt-inspection/0.1',signatureValidUnderSuppliedKey:true,issuerMatches:true,checkoutHashMatches:true,checkoutJwtHash:actualHash,authorizedToPurchase:false,fullAp2Verified:false,limitations:['No SD-JWT disclosure, holder binding, authorization delegation, constraint, mandate-chain or receipt verification.','No payment mandates accepted, no checkout completed and no payment processed.','Use the complete official AP2 SDK and required trust bindings before any real authorization.']};
}
