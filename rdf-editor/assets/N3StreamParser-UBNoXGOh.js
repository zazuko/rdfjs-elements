import{g as H,b as V,a as Z}from"./index-C1daphr_.js";/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */let C;var J=typeof queueMicrotask=="function"?queueMicrotask:r=>(C||(C=Promise.resolve())).then(r).catch(e=>setTimeout(()=>{throw e},0));const X=H(J),N="http://www.w3.org/1999/02/22-rdf-syntax-ns#",P="http://www.w3.org/2001/XMLSchema#",T="http://www.w3.org/2000/10/swap/",p={xsd:{decimal:`${P}decimal`,boolean:`${P}boolean`,double:`${P}double`,integer:`${P}integer`,string:`${P}string`},rdf:{type:`${N}type`,nil:`${N}nil`,first:`${N}first`,rest:`${N}rest`,langString:`${N}langString`},owl:{sameAs:"http://www.w3.org/2002/07/owl#sameAs"},r:{forSome:`${T}reify#forSome`,forAll:`${T}reify#forAll`},log:{implies:`${T}log#implies`}},{xsd:v}=p,K=/\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{8})|\\([^])/g,L={"\\":"\\","'":"'",'"':'"',n:`
`,r:"\r",t:"	",f:"\f",b:"\b",_:"_","~":"~",".":".","-":"-","!":"!",$:"$","&":"&","(":"(",")":")","*":"*","+":"+",",":",",";":";","=":"=","/":"/","?":"?","#":"#","@":"@","%":"%"},W=/[\x00-\x20<>\\"\{\}\|\^\`]/,Y={_iri:!0,_unescapedIri:!0,_simpleQuotedString:!0,_langcode:!0,_blank:!0,_newline:!0,_comment:!0,_whitespace:!0,_endOfFile:!0},ee=/$0^/;class te{constructor(e){if(this._iri=/^<((?:[^ <>{}\\]|\\[uU])+)>[ \t]*/,this._unescapedIri=/^<([^\x00-\x20<>\\"\{\}\|\^\`]*)>[ \t]*/,this._simpleQuotedString=/^"([^"\\\r\n]*)"(?=[^"])/,this._simpleApostropheString=/^'([^'\\\r\n]*)'(?=[^'])/,this._langcode=/^@([a-z]+(?:-[a-z0-9]+)*)(?=[^a-z0-9\-])/i,this._prefix=/^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:(?=[#\s<])/,this._prefixed=/^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:((?:(?:[0-:A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])(?:(?:[\.\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])*(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~]))?)?)(?:[ \t]+|(?=\.?[,;!\^\s#()\[\]\{\}"'<>]))/,this._variable=/^\?(?:(?:[A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?=[.,;!\^\s#()\[\]\{\}"'<>])/,this._blank=/^_:((?:[0-9A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?:[ \t]+|(?=\.?[,;:\s#()\[\]\{\}"'<>]))/,this._number=/^[\-+]?(?:(\d+\.\d*|\.?\d+)[eE][\-+]?|\d*(\.)?)\d+(?=\.?[,;:\s#()\[\]\{\}"'<>])/,this._boolean=/^(?:true|false)(?=[.,;\s#()\[\]\{\}"'<>])/,this._keyword=/^@[a-z]+(?=[\s#<:])/i,this._sparqlKeyword=/^(?:PREFIX|BASE|GRAPH)(?=[\s#<])/i,this._shortPredicates=/^a(?=[\s#()\[\]\{\}"'<>])/,this._newline=/^[ \t]*(?:#[^\n\r]*)?(?:\r\n|\n|\r)[ \t]*/,this._comment=/#([^\n\r]*)/,this._whitespace=/^[ \t]+/,this._endOfFile=/^(?:#[^\n\r]*)?$/,e=e||{},this._lineMode=!!e.lineMode){this._n3Mode=!1;for(const s in this)!(s in Y)&&this[s]instanceof RegExp&&(this[s]=ee)}else this._n3Mode=e.n3!==!1;this.comments=!!e.comments,this._literalClosingPos=0}_tokenizeToEnd(e,s){let t=this._input,i=t.length;for(;;){let u,c;for(;u=this._newline.exec(t);)this.comments&&(c=this._comment.exec(u[0]))&&n("comment",c[1],"",this._line,u[0].length),t=t.substr(u[0].length,t.length),i=t.length,this._line++;if(!u&&(u=this._whitespace.exec(t))&&(t=t.substr(u[0].length,t.length)),this._endOfFile.test(t))return s&&(this.comments&&(c=this._comment.exec(t))&&n("comment",c[1],"",this._line,t.length),t=null,n("eof","","",this._line,0)),this._input=t;const _=this._line,o=t[0];let l="",f="",x="",h=null,d=0,m=!1;switch(o){case"^":if(t.length<3)break;if(t[1]==="^"){if(this._previousMarker="^^",t=t.substr(2),t[0]!=="<"){m=!0;break}}else{this._n3Mode&&(d=1,l="^");break}case"<":if(h=this._unescapedIri.exec(t))l="IRI",f=h[1];else if(h=this._iri.exec(t)){if(f=this._unescape(h[1]),f===null||W.test(f))return a(this);l="IRI"}else t.length>1&&t[1]==="<"?(l="<<",d=2):this._n3Mode&&t.length>1&&t[1]==="="&&(l="inverse",d=2,f=">");break;case">":t.length>1&&t[1]===">"&&(l=">>",d=2);break;case"_":((h=this._blank.exec(t))||s&&(h=this._blank.exec(`${t} `)))&&(l="blank",x="_",f=h[1]);break;case'"':if(h=this._simpleQuotedString.exec(t))f=h[1];else if({value:f,matchLength:d}=this._parseLiteral(t),f===null)return a(this);(h!==null||d!==0)&&(l="literal",this._literalClosingPos=0);break;case"'":if(!this._lineMode){if(h=this._simpleApostropheString.exec(t))f=h[1];else if({value:f,matchLength:d}=this._parseLiteral(t),f===null)return a(this);(h!==null||d!==0)&&(l="literal",this._literalClosingPos=0)}break;case"?":this._n3Mode&&(h=this._variable.exec(t))&&(l="var",f=h[0]);break;case"@":this._previousMarker==="literal"&&(h=this._langcode.exec(t))?(l="langcode",f=h[1]):(h=this._keyword.exec(t))&&(l=h[0]);break;case".":if(t.length===1?s:t[1]<"0"||t[1]>"9"){l=".",d=1;break}case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":case"+":case"-":(h=this._number.exec(t)||s&&(h=this._number.exec(`${t} `)))&&(l="literal",f=h[0],x=typeof h[1]=="string"?v.double:typeof h[2]=="string"?v.decimal:v.integer);break;case"B":case"b":case"p":case"P":case"G":case"g":(h=this._sparqlKeyword.exec(t))?l=h[0].toUpperCase():m=!0;break;case"f":case"t":(h=this._boolean.exec(t))?(l="literal",f=h[0],x=v.boolean):m=!0;break;case"a":(h=this._shortPredicates.exec(t))?(l="abbreviation",f="a"):m=!0;break;case"=":this._n3Mode&&t.length>1&&(l="abbreviation",t[1]!==">"?(d=1,f="="):(d=2,f=">"));break;case"!":if(!this._n3Mode)break;case",":case";":case"[":case"]":case"(":case")":case"}":this._lineMode||(d=1,l=o);break;case"{":!this._lineMode&&t.length>=2&&(t[1]==="|"?(l="{|",d=2):(l=o,d=1));break;case"|":t.length>=2&&t[1]==="}"&&(l="|}",d=2);break;default:m=!0}if(m&&((this._previousMarker==="@prefix"||this._previousMarker==="PREFIX")&&(h=this._prefix.exec(t))?(l="prefix",f=h[1]||""):((h=this._prefixed.exec(t))||s&&(h=this._prefixed.exec(`${t} `)))&&(l="prefixed",x=h[1]||"",f=this._unescape(h[2]))),this._previousMarker==="^^")switch(l){case"prefixed":l="type";break;case"IRI":l="typeIRI";break;default:l=""}if(!l)return s||!/^'''|^"""/.test(t)&&/\n|\r/.test(t)?a(this):this._input=t;const k=d||h[0].length,z=n(l,f,x,_,k);this.previousToken=z,this._previousMarker=l,t=t.substr(k,t.length)}function n(u,c,_,o,l){const f=t?i-t.length:i,x=f+l,h={type:u,value:c,prefix:_,line:o,start:f,end:x};return e(null,h),h}function a(u){e(u._syntaxError(/^\S*/.exec(t)[0]))}}_unescape(e){let s=!1;const t=e.replace(K,(i,n,a,u)=>{if(typeof n=="string")return String.fromCharCode(Number.parseInt(n,16));if(typeof a=="string"){let c=Number.parseInt(a,16);return c<=65535?String.fromCharCode(Number.parseInt(a,16)):String.fromCharCode(55296+((c-=65536)>>10),56320+(c&1023))}return u in L?L[u]:(s=!0,"")});return s?null:t}_parseLiteral(e){if(e.length>=3){const s=e.match(/^(?:"""|"|'''|'|)/)[0],t=s.length;let i=Math.max(this._literalClosingPos,t);for(;(i=e.indexOf(s,i))>0;){let n=0;for(;e[i-n-1]==="\\";)n++;if(n%2===0){const a=e.substring(t,i),u=a.split(/\r\n|\r|\n/).length-1,c=i+t;if(t===1&&u!==0||t===3&&this._lineMode)break;return this._line+=u,{value:this._unescape(a),matchLength:c}}i++}this._literalClosingPos=e.length-t+1}return{value:"",matchLength:0}}_syntaxError(e){this._input=null;const s=new Error(`Unexpected "${e}" on line ${this._line}.`);return s.context={token:void 0,line:this._line,previousToken:this.previousToken},s}_readStartingBom(e){return e.startsWith("\uFEFF")?e.substr(1):e}tokenize(e,s){if(this._line=1,typeof e=="string")if(this._input=this._readStartingBom(e),typeof s=="function")X(()=>this._tokenizeToEnd(s,!0));else{const t=[];let i;if(this._tokenizeToEnd((n,a)=>n?i=n:t.push(a),!0),i)throw i;return t}else this._pendingBuffer=null,typeof e.setEncoding=="function"&&e.setEncoding("utf8"),e.on("data",t=>{this._input!==null&&t.length!==0&&(this._pendingBuffer&&(t=V.Buffer.concat([this._pendingBuffer,t]),this._pendingBuffer=null),t[t.length-1]&128?this._pendingBuffer=t:(typeof this._input>"u"?this._input=this._readStartingBom(typeof t=="string"?t:t.toString()):this._input+=t,this._tokenizeToEnd(s,!1)))}),e.on("end",()=>{typeof this._input=="string"&&this._tokenizeToEnd(s,!0)}),e.on("error",s)}}const{rdf:se,xsd:g}=p;let j,re=0;const E={namedNode:M,blankNode:O,variable:G,literal:B,defaultGraph:ne,quad:F,triple:F,fromTerm:R,fromQuad:q};class b{constructor(e){this.id=e}get value(){return this.id}equals(e){return e instanceof b?this.id===e.id:!!e&&this.termType===e.termType&&this.value===e.value}hashCode(){return 0}toJSON(){return{termType:this.termType,value:this.value}}}class $ extends b{get termType(){return"NamedNode"}}class y extends b{get termType(){return"Literal"}get value(){return this.id.substring(1,this.id.lastIndexOf('"'))}get language(){const e=this.id;let s=e.lastIndexOf('"')+1;return s<e.length&&e[s++]==="@"?e.substr(s).toLowerCase():""}get datatype(){return new $(this.datatypeString)}get datatypeString(){const e=this.id,s=e.lastIndexOf('"')+1,t=s<e.length?e[s]:"";return t==="^"?e.substr(s+2):t!=="@"?g.string:se.langString}equals(e){return e instanceof y?this.id===e.id:!!e&&!!e.datatype&&this.termType===e.termType&&this.value===e.value&&this.language===e.language&&this.datatype.value===e.datatype.value}toJSON(){return{termType:this.termType,value:this.value,language:this.language,datatype:{termType:"NamedNode",value:this.datatypeString}}}}class ie extends b{constructor(e){super(`_:${e}`)}get termType(){return"BlankNode"}get value(){return this.id.substr(2)}}class ae extends b{constructor(e){super(`?${e}`)}get termType(){return"Variable"}get value(){return this.id.substr(1)}}class ue extends b{constructor(){return super(""),j||this}get termType(){return"DefaultGraph"}equals(e){return this===e||!!e&&this.termType===e.termType}}j=new ue;function S(r,e,s){if(e=e||E,!r)return e.defaultGraph();switch(r[0]){case"?":return e.variable(r.substr(1));case"_":return e.blankNode(r.substr(2));case'"':if(e===E)return new y(r);if(r[r.length-1]==='"')return e.literal(r.substr(1,r.length-2));const t=r.lastIndexOf('"',r.length-1);return e.literal(r.substr(1,t-1),r[t+1]==="@"?r.substr(t+2):e.namedNode(r.substr(t+3)));case"[":r=JSON.parse(r);break;default:if(!s||!Array.isArray(r))return e.namedNode(r)}return e.quad(S(r[0],e,!0),S(r[1],e,!0),S(r[2],e,!0),r[3]&&S(r[3],e,!0))}function w(r,e){if(typeof r=="string")return r;if(r instanceof b&&r.termType!=="Quad")return r.id;if(!r)return j.id;switch(r.termType){case"NamedNode":return r.value;case"BlankNode":return`_:${r.value}`;case"Variable":return`?${r.value}`;case"DefaultGraph":return"";case"Literal":return`"${r.value}"${r.language?`@${r.language}`:r.datatype&&r.datatype.value!==g.string?`^^${r.datatype.value}`:""}`;case"Quad":const s=[w(r.subject,!0),w(r.predicate,!0),w(r.object,!0)];return r.graph&&r.graph.termType!=="DefaultGraph"&&s.push(w(r.graph,!0)),e?s:JSON.stringify(s);default:throw new Error(`Unexpected termType: ${r.termType}`)}}class D extends b{constructor(e,s,t,i){super(""),this._subject=e,this._predicate=s,this._object=t,this._graph=i||j}get termType(){return"Quad"}get subject(){return this._subject}get predicate(){return this._predicate}get object(){return this._object}get graph(){return this._graph}toJSON(){return{termType:this.termType,subject:this._subject.toJSON(),predicate:this._predicate.toJSON(),object:this._object.toJSON(),graph:this._graph.toJSON()}}equals(e){return!!e&&this._subject.equals(e.subject)&&this._predicate.equals(e.predicate)&&this._object.equals(e.object)&&this._graph.equals(e.graph)}}function M(r){return new $(r)}function O(r){return new ie(r||`n3-${re++}`)}function B(r,e){if(typeof e=="string")return new y(`"${r}"@${e.toLowerCase()}`);let s=e?e.value:"";return s===""&&(typeof r=="boolean"?s=g.boolean:typeof r=="number"&&(Number.isFinite(r)?s=Number.isInteger(r)?g.integer:g.double:(s=g.double,Number.isNaN(r)||(r=r>0?"INF":"-INF")))),s===""||s===g.string?new y(`"${r}"`):new y(`"${r}"^^${s}`)}function G(r){return new ae(r)}function ne(){return j}function F(r,e,s,t){return new D(r,e,s,t)}function R(r){if(r instanceof b)return r;switch(r.termType){case"NamedNode":return M(r.value);case"BlankNode":return O(r.value);case"Variable":return G(r.value);case"DefaultGraph":return j;case"Literal":return B(r.value,r.language||r.datatype);case"Quad":return q(r);default:throw new Error(`Unexpected termType: ${r.termType}`)}}function q(r){if(r instanceof D)return r;if(r.termType!=="Quad")throw new Error(`Unexpected termType: ${r.termType}`);return F(R(r.subject),R(r.predicate),R(r.object),R(r.graph))}let A=0;class U{constructor(e){this._contextStack=[],this._graph=null,e=e||{},this._setBase(e.baseIRI),e.factory&&Q(this,e.factory);const s=typeof e.format=="string"?e.format.match(/\w*$/)[0].toLowerCase():"",t=/turtle/.test(s),i=/trig/.test(s),n=/triple/.test(s),a=/quad/.test(s),u=this._n3Mode=/n3/.test(s),c=n||a;(this._supportsNamedGraphs=!(t||u))||(this._readPredicateOrNamedGraph=this._readPredicate),this._supportsQuads=!(t||i||n||u),this._supportsRDFStar=s===""||/star|\*$/.test(s),c&&(this._resolveRelativeIRI=_=>null),this._blankNodePrefix=typeof e.blankNodePrefix!="string"?"":e.blankNodePrefix.replace(/^(?!_:)/,"_:"),this._lexer=e.lexer||new te({lineMode:c,n3:u}),this._explicitQuantifiers=!!e.explicitQuantifiers}static _resetBlankNodePrefix(){A=0}_setBase(e){if(!e)this._base="",this._basePath="";else{const s=e.indexOf("#");s>=0&&(e=e.substr(0,s)),this._base=e,this._basePath=e.indexOf("/")<0?e:e.replace(/[^\/?]*(?:\?.*)?$/,""),e=e.match(/^(?:([a-z][a-z0-9+.-]*:))?(?:\/\/[^\/]*)?/i),this._baseRoot=e[0],this._baseScheme=e[1]}}_saveContext(e,s,t,i,n){const a=this._n3Mode;this._contextStack.push({type:e,subject:t,predicate:i,object:n,graph:s,inverse:a?this._inversePredicate:!1,blankPrefix:a?this._prefixes._:"",quantified:a?this._quantified:null}),a&&(this._inversePredicate=!1,this._prefixes._=this._graph?`${this._graph.value}.`:".",this._quantified=Object.create(this._quantified))}_restoreContext(e,s){const t=this._contextStack.pop();if(!t||t.type!==e)return this._error(`Unexpected ${s.type}`,s);this._subject=t.subject,this._predicate=t.predicate,this._object=t.object,this._graph=t.graph,this._n3Mode&&(this._inversePredicate=t.inverse,this._prefixes._=t.blankPrefix,this._quantified=t.quantified)}_readInTopContext(e){switch(e.type){case"eof":return this._graph!==null?this._error("Unclosed graph",e):(delete this._prefixes._,this._callback(null,null,this._prefixes));case"PREFIX":this._sparqlStyle=!0;case"@prefix":return this._readPrefix;case"BASE":this._sparqlStyle=!0;case"@base":return this._readBaseIRI;case"{":if(this._supportsNamedGraphs)return this._graph="",this._subject=null,this._readSubject;case"GRAPH":if(this._supportsNamedGraphs)return this._readNamedGraphLabel;default:return this._readSubject(e)}}_readEntity(e,s){let t;switch(e.type){case"IRI":case"typeIRI":const i=this._resolveIRI(e.value);if(i===null)return this._error("Invalid IRI",e);t=this._factory.namedNode(i);break;case"type":case"prefixed":const n=this._prefixes[e.prefix];if(n===void 0)return this._error(`Undefined prefix "${e.prefix}:"`,e);t=this._factory.namedNode(n+e.value);break;case"blank":t=this._factory.blankNode(this._prefixes[e.prefix]+e.value);break;case"var":t=this._factory.variable(e.value.substr(1));break;default:return this._error(`Expected entity but got ${e.type}`,e)}return!s&&this._n3Mode&&t.id in this._quantified&&(t=this._quantified[t.id]),t}_readSubject(e){switch(this._predicate=null,e.type){case"[":return this._saveContext("blank",this._graph,this._subject=this._factory.blankNode(),null,null),this._readBlankNodeHead;case"(":return this._saveContext("list",this._graph,this.RDF_NIL,null,null),this._subject=null,this._readListItem;case"{":return this._n3Mode?(this._saveContext("formula",this._graph,this._graph=this._factory.blankNode(),null,null),this._readSubject):this._error("Unexpected graph",e);case"}":return this._readPunctuation(e);case"@forSome":return this._n3Mode?(this._subject=null,this._predicate=this.N3_FORSOME,this._quantifier="blankNode",this._readQuantifierList):this._error('Unexpected "@forSome"',e);case"@forAll":return this._n3Mode?(this._subject=null,this._predicate=this.N3_FORALL,this._quantifier="variable",this._readQuantifierList):this._error('Unexpected "@forAll"',e);case"literal":if(!this._n3Mode)return this._error("Unexpected literal",e);if(e.prefix.length===0)return this._literalValue=e.value,this._completeSubjectLiteral;this._subject=this._factory.literal(e.value,this._factory.namedNode(e.prefix));break;case"<<":return this._supportsRDFStar?(this._saveContext("<<",this._graph,null,null,null),this._graph=null,this._readSubject):this._error("Unexpected RDF-star syntax",e);default:if((this._subject=this._readEntity(e))===void 0)return;if(this._n3Mode)return this._getPathReader(this._readPredicateOrNamedGraph)}return this._readPredicateOrNamedGraph}_readPredicate(e){const s=e.type;switch(s){case"inverse":this._inversePredicate=!0;case"abbreviation":this._predicate=this.ABBREVIATIONS[e.value];break;case".":case"]":case"}":return this._predicate===null?this._error(`Unexpected ${s}`,e):(this._subject=null,s==="]"?this._readBlankNodeTail(e):this._readPunctuation(e));case";":return this._predicate!==null?this._readPredicate:this._error("Expected predicate but got ;",e);case"[":if(this._n3Mode)return this._saveContext("blank",this._graph,this._subject,this._subject=this._factory.blankNode(),null),this._readBlankNodeHead;case"blank":if(!this._n3Mode)return this._error("Disallowed blank node as predicate",e);default:if((this._predicate=this._readEntity(e))===void 0)return}return this._readObject}_readObject(e){switch(e.type){case"literal":if(e.prefix.length===0)return this._literalValue=e.value,this._readDataTypeOrLang;this._object=this._factory.literal(e.value,this._factory.namedNode(e.prefix));break;case"[":return this._saveContext("blank",this._graph,this._subject,this._predicate,this._subject=this._factory.blankNode()),this._readBlankNodeHead;case"(":return this._saveContext("list",this._graph,this._subject,this._predicate,this.RDF_NIL),this._subject=null,this._readListItem;case"{":return this._n3Mode?(this._saveContext("formula",this._graph,this._subject,this._predicate,this._graph=this._factory.blankNode()),this._readSubject):this._error("Unexpected graph",e);case"<<":return this._supportsRDFStar?(this._saveContext("<<",this._graph,this._subject,this._predicate,null),this._graph=null,this._readSubject):this._error("Unexpected RDF-star syntax",e);default:if((this._object=this._readEntity(e))===void 0)return;if(this._n3Mode)return this._getPathReader(this._getContextEndReader())}return this._getContextEndReader()}_readPredicateOrNamedGraph(e){return e.type==="{"?this._readGraph(e):this._readPredicate(e)}_readGraph(e){return e.type!=="{"?this._error(`Expected graph but got ${e.type}`,e):(this._graph=this._subject,this._subject=null,this._readSubject)}_readBlankNodeHead(e){return e.type==="]"?(this._subject=null,this._readBlankNodeTail(e)):(this._predicate=null,this._readPredicate(e))}_readBlankNodeTail(e){if(e.type!=="]")return this._readBlankNodePunctuation(e);this._subject!==null&&this._emit(this._subject,this._predicate,this._object,this._graph);const s=this._predicate===null;return this._restoreContext("blank",e),this._object!==null?this._getContextEndReader():this._predicate!==null?this._readObject:s?this._readPredicateOrNamedGraph:this._readPredicateAfterBlank}_readPredicateAfterBlank(e){switch(e.type){case".":case"}":return this._subject=null,this._readPunctuation(e);default:return this._readPredicate(e)}}_readListItem(e){let s=null,t=null,i=this._readListItem;const n=this._subject,a=this._contextStack,u=a[a.length-1];switch(e.type){case"[":this._saveContext("blank",this._graph,t=this._factory.blankNode(),this.RDF_FIRST,this._subject=s=this._factory.blankNode()),i=this._readBlankNodeHead;break;case"(":this._saveContext("list",this._graph,t=this._factory.blankNode(),this.RDF_FIRST,this.RDF_NIL),this._subject=null;break;case")":if(this._restoreContext("list",e),a.length!==0&&a[a.length-1].type==="list"&&this._emit(this._subject,this._predicate,this._object,this._graph),this._predicate===null){if(i=this._readPredicate,this._subject===this.RDF_NIL)return i}else if(i=this._getContextEndReader(),this._object===this.RDF_NIL)return i;t=this.RDF_NIL;break;case"literal":e.prefix.length===0?(this._literalValue=e.value,i=this._readListItemDataTypeOrLang):(s=this._factory.literal(e.value,this._factory.namedNode(e.prefix)),i=this._getContextEndReader());break;case"{":return this._n3Mode?(this._saveContext("formula",this._graph,this._subject,this._predicate,this._graph=this._factory.blankNode()),this._readSubject):this._error("Unexpected graph",e);default:if((s=this._readEntity(e))===void 0)return}if(t===null&&(this._subject=t=this._factory.blankNode()),n===null?u.predicate===null?u.subject=t:u.object=t:this._emit(n,this.RDF_REST,t,this._graph),s!==null){if(this._n3Mode&&(e.type==="IRI"||e.type==="prefixed"))return this._saveContext("item",this._graph,t,this.RDF_FIRST,s),this._subject=s,this._predicate=null,this._getPathReader(this._readListItem);this._emit(t,this.RDF_FIRST,s,this._graph)}return i}_readDataTypeOrLang(e){return this._completeObjectLiteral(e,!1)}_readListItemDataTypeOrLang(e){return this._completeObjectLiteral(e,!0)}_completeLiteral(e){let s=this._factory.literal(this._literalValue);switch(e.type){case"type":case"typeIRI":const t=this._readEntity(e);if(t===void 0)return;s=this._factory.literal(this._literalValue,t),e=null;break;case"langcode":s=this._factory.literal(this._literalValue,e.value),e=null;break}return{token:e,literal:s}}_completeSubjectLiteral(e){return this._subject=this._completeLiteral(e).literal,this._readPredicateOrNamedGraph}_completeObjectLiteral(e,s){const t=this._completeLiteral(e);if(t)return this._object=t.literal,s&&this._emit(this._subject,this.RDF_FIRST,this._object,this._graph),t.token===null?this._getContextEndReader():(this._readCallback=this._getContextEndReader(),this._readCallback(t.token))}_readFormulaTail(e){return e.type!=="}"?this._readPunctuation(e):(this._subject!==null&&this._emit(this._subject,this._predicate,this._object,this._graph),this._restoreContext("formula",e),this._object===null?this._readPredicate:this._getContextEndReader())}_readPunctuation(e){let s,t=this._graph;const i=this._subject,n=this._inversePredicate;switch(e.type){case"}":if(this._graph===null)return this._error("Unexpected graph closing",e);if(this._n3Mode)return this._readFormulaTail(e);this._graph=null;case".":this._subject=null,s=this._contextStack.length?this._readSubject:this._readInTopContext,n&&(this._inversePredicate=!1);break;case";":s=this._readPredicate;break;case",":s=this._readObject;break;case"{|":if(!this._supportsRDFStar)return this._error("Unexpected RDF-star syntax",e);const a=this._predicate,u=this._object;this._subject=this._factory.quad(i,a,u,this.DEFAULTGRAPH),s=this._readPredicate;break;case"|}":if(this._subject.termType!=="Quad")return this._error("Unexpected asserted triple closing",e);this._subject=null,s=this._readPunctuation;break;default:if(this._supportsQuads&&this._graph===null&&(t=this._readEntity(e))!==void 0){s=this._readQuadPunctuation;break}return this._error(`Expected punctuation to follow "${this._object.id}"`,e)}if(i!==null){const a=this._predicate,u=this._object;n?this._emit(u,a,i,t):this._emit(i,a,u,t)}return s}_readBlankNodePunctuation(e){let s;switch(e.type){case";":s=this._readPredicate;break;case",":s=this._readObject;break;default:return this._error(`Expected punctuation to follow "${this._object.id}"`,e)}return this._emit(this._subject,this._predicate,this._object,this._graph),s}_readQuadPunctuation(e){return e.type!=="."?this._error("Expected dot to follow quad",e):this._readInTopContext}_readPrefix(e){return e.type!=="prefix"?this._error("Expected prefix to follow @prefix",e):(this._prefix=e.value,this._readPrefixIRI)}_readPrefixIRI(e){if(e.type!=="IRI")return this._error(`Expected IRI to follow prefix "${this._prefix}:"`,e);const s=this._readEntity(e);return this._prefixes[this._prefix]=s.value,this._prefixCallback(this._prefix,s),this._readDeclarationPunctuation}_readBaseIRI(e){const s=e.type==="IRI"&&this._resolveIRI(e.value);return s?(this._setBase(s),this._readDeclarationPunctuation):this._error("Expected valid IRI to follow base declaration",e)}_readNamedGraphLabel(e){switch(e.type){case"IRI":case"blank":case"prefixed":return this._readSubject(e),this._readGraph;case"[":return this._readNamedGraphBlankLabel;default:return this._error("Invalid graph label",e)}}_readNamedGraphBlankLabel(e){return e.type!=="]"?this._error("Invalid graph label",e):(this._subject=this._factory.blankNode(),this._readGraph)}_readDeclarationPunctuation(e){return this._sparqlStyle?(this._sparqlStyle=!1,this._readInTopContext(e)):e.type!=="."?this._error("Expected declaration to end with a dot",e):this._readInTopContext}_readQuantifierList(e){let s;switch(e.type){case"IRI":case"prefixed":if((s=this._readEntity(e,!0))!==void 0)break;default:return this._error(`Unexpected ${e.type}`,e)}return this._explicitQuantifiers?(this._subject===null?this._emit(this._graph||this.DEFAULTGRAPH,this._predicate,this._subject=this._factory.blankNode(),this.QUANTIFIERS_GRAPH):this._emit(this._subject,this.RDF_REST,this._subject=this._factory.blankNode(),this.QUANTIFIERS_GRAPH),this._emit(this._subject,this.RDF_FIRST,s,this.QUANTIFIERS_GRAPH)):this._quantified[s.id]=this._factory[this._quantifier](this._factory.blankNode().value),this._readQuantifierPunctuation}_readQuantifierPunctuation(e){return e.type===","?this._readQuantifierList:(this._explicitQuantifiers&&(this._emit(this._subject,this.RDF_REST,this.RDF_NIL,this.QUANTIFIERS_GRAPH),this._subject=null),this._readCallback=this._getContextEndReader(),this._readCallback(e))}_getPathReader(e){return this._afterPath=e,this._readPath}_readPath(e){switch(e.type){case"!":return this._readForwardPath;case"^":return this._readBackwardPath;default:const s=this._contextStack,t=s.length&&s[s.length-1];if(t&&t.type==="item"){const i=this._subject;this._restoreContext("item",e),this._emit(this._subject,this.RDF_FIRST,i,this._graph)}return this._afterPath(e)}}_readForwardPath(e){let s,t;const i=this._factory.blankNode();if((t=this._readEntity(e))!==void 0)return this._predicate===null?(s=this._subject,this._subject=i):(s=this._object,this._object=i),this._emit(s,t,i,this._graph),this._readPath}_readBackwardPath(e){const s=this._factory.blankNode();let t,i;if((t=this._readEntity(e))!==void 0)return this._predicate===null?(i=this._subject,this._subject=s):(i=this._object,this._object=s),this._emit(s,t,i,this._graph),this._readPath}_readRDFStarTailOrGraph(e){return e.type!==">>"?this._supportsQuads&&this._graph===null&&(this._graph=this._readEntity(e))!==void 0?this._readRDFStarTail:this._error(`Expected >> to follow "${this._object.id}"`,e):this._readRDFStarTail(e)}_readRDFStarTail(e){if(e.type!==">>")return this._error(`Expected >> but got ${e.type}`,e);const s=this._factory.quad(this._subject,this._predicate,this._object,this._graph||this.DEFAULTGRAPH);return this._restoreContext("<<",e),this._subject===null?(this._subject=s,this._readPredicate):(this._object=s,this._getContextEndReader())}_getContextEndReader(){const e=this._contextStack;if(!e.length)return this._readPunctuation;switch(e[e.length-1].type){case"blank":return this._readBlankNodeTail;case"list":return this._readListItem;case"formula":return this._readFormulaTail;case"<<":return this._readRDFStarTailOrGraph}}_emit(e,s,t,i){this._callback(null,this._factory.quad(e,s,t,i||this.DEFAULTGRAPH))}_error(e,s){const t=new Error(`${e} on line ${s.line}.`);t.context={token:s,line:s.line,previousToken:this._lexer.previousToken},this._callback(t),this._callback=I}_resolveIRI(e){return/^[a-z][a-z0-9+.-]*:/i.test(e)?e:this._resolveRelativeIRI(e)}_resolveRelativeIRI(e){if(!e.length)return this._base;switch(e[0]){case"#":return this._base+e;case"?":return this._base.replace(/(?:\?.*)?$/,e);case"/":return(e[1]==="/"?this._baseScheme:this._baseRoot)+this._removeDotSegments(e);default:return/^[^/:]*:/.test(e)?null:this._removeDotSegments(this._basePath+e)}}_removeDotSegments(e){if(!/(^|\/)\.\.?($|[/#?])/.test(e))return e;const s=e.length;let t="",i=-1,n=-1,a=0,u="/";for(;i<s;){switch(u){case":":if(n<0&&e[++i]==="/"&&e[++i]==="/")for(;(n=i+1)<s&&e[n]!=="/";)i=n;break;case"?":case"#":i=s;break;case"/":if(e[i+1]===".")switch(u=e[++i+1],u){case"/":t+=e.substring(a,i-1),a=i+1;break;case void 0:case"?":case"#":return t+e.substring(a,i)+e.substr(i+1);case".":if(u=e[++i+1],u===void 0||u==="/"||u==="?"||u==="#"){if(t+=e.substring(a,i-2),(a=t.lastIndexOf("/"))>=n&&(t=t.substr(0,a)),u!=="/")return`${t}/${e.substr(i+1)}`;a=i+1}}}u=e[++i]}return t+e.substring(a)}parse(e,s,t){let i,n,a;if(s&&(s.onQuad||s.onPrefix||s.onComment)?(i=s.onQuad,n=s.onPrefix,a=s.onComment):(i=s,n=t),this._readCallback=this._readInTopContext,this._sparqlStyle=!1,this._prefixes=Object.create(null),this._prefixes._=this._blankNodePrefix?this._blankNodePrefix.substr(2):`b${A++}_`,this._prefixCallback=n||I,this._inversePredicate=!1,this._quantified=Object.create(null),!i){const c=[];let _;if(this._callback=(o,l)=>{o?_=o:l&&c.push(l)},this._lexer.tokenize(e).every(o=>this._readCallback=this._readCallback(o)),_)throw _;return c}let u=(c,_)=>{c!==null?(this._callback(c),this._callback=I):this._readCallback&&(this._readCallback=this._readCallback(_))};a&&(this._lexer.comments=!0,u=(c,_)=>{c!==null?(this._callback(c),this._callback=I):this._readCallback&&(_.type==="comment"?a(_.value):this._readCallback=this._readCallback(_))}),this._callback=i,this._lexer.tokenize(e,u)}}function I(){}function Q(r,e){r._factory=e,r.DEFAULTGRAPH=e.defaultGraph(),r.RDF_FIRST=e.namedNode(p.rdf.first),r.RDF_REST=e.namedNode(p.rdf.rest),r.RDF_NIL=e.namedNode(p.rdf.nil),r.N3_FORALL=e.namedNode(p.r.forAll),r.N3_FORSOME=e.namedNode(p.r.forSome),r.ABBREVIATIONS={a:e.namedNode(p.rdf.type),"=":e.namedNode(p.owl.sameAs),">":e.namedNode(p.log.implies)},r.QUANTIFIERS_GRAPH=e.namedNode("urn:n3:quantifiers")}Q(U.prototype,E);class le extends Z.Transform{constructor(e){super({decodeStrings:!0}),this._readableState.objectMode=!0;const s=new U(e);let t,i;const n={onQuad:(a,u)=>{a&&this.emit("error",a)||u&&this.push(u)},onPrefix:(a,u)=>{this.emit("prefix",a,u)}};e&&e.comments&&(n.onComment=a=>{this.emit("comment",a)}),s.parse({on:(a,u)=>{switch(a){case"data":t=u;break;case"end":i=u;break}}},n),this._transform=(a,u,c)=>{t(a),c()},this._flush=a=>{i(),a()}}import(e){return e.on("data",s=>{this.write(s)}),e.on("end",()=>{this.end()}),e.on("error",s=>{this.emit("error",s)}),this}}export{ie as B,E as D,y as L,le as N,D as Q,b as T,ae as V,w as a,te as b,U as c,$ as d,ue as e,p as n,S as t};
