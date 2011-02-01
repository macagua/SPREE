/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(typeof dojo=="undefined"){
var dj_global=this;
var dj_currentContext=this;
function dj_undef(_1,_2){
return (typeof (_2||dj_currentContext)[_1]=="undefined");
}
if(dj_undef("djConfig",this)){
var djConfig={};
}
if(dj_undef("dojo",this)){
var dojo={};
}
dojo.global=function(){
return dj_currentContext;
};
dojo.locale=djConfig.locale;
dojo.version={major:0,minor:0,patch:0,flag:"dev",revision:Number("$Rev: 6426 $".match(/[0-9]+/)[0]),toString:function(){
with(dojo.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
dojo.evalProp=function(_3,_4,_5){
if((!_4)||(!_3)){
return undefined;
}
if(!dj_undef(_3,_4)){
return _4[_3];
}
return (_5?(_4[_3]={}):undefined);
};
dojo.parseObjPath=function(_6,_7,_8){
var _9=(_7||dojo.global());
var _a=_6.split(".");
var _b=_a.pop();
for(var i=0,l=_a.length;i<l&&_9;i++){
_9=dojo.evalProp(_a[i],_9,_8);
}
return {obj:_9,prop:_b};
};
dojo.evalObjPath=function(_e,_f){
if(typeof _e!="string"){
return dojo.global();
}
if(_e.indexOf(".")==-1){
return dojo.evalProp(_e,dojo.global(),_f);
}
var ref=dojo.parseObjPath(_e,dojo.global(),_f);
if(ref){
return dojo.evalProp(ref.prop,ref.obj,_f);
}
return null;
};
dojo.errorToString=function(_11){
if(!dj_undef("message",_11)){
return _11.message;
}else{
if(!dj_undef("description",_11)){
return _11.description;
}else{
return _11;
}
}
};
dojo.raise=function(_12,_13){
if(_13){
_12=_12+": "+dojo.errorToString(_13);
}
try{
if(djConfig.isDebug){
dojo.hostenv.println("FATAL exception raised: "+_12);
}
}
catch(e){
}
throw _13||Error(_12);
};
dojo.debug=function(){
};
dojo.debugShallow=function(obj){
};
dojo.profile={start:function(){
},end:function(){
},stop:function(){
},dump:function(){
}};
function dj_eval(_15){
return dj_global.eval?dj_global.eval(_15):eval(_15);
}
dojo.unimplemented=function(_16,_17){
var _18="'"+_16+"' not implemented";
if(_17!=null){
_18+=" "+_17;
}
dojo.raise(_18);
};
dojo.deprecated=function(_19,_1a,_1b){
var _1c="DEPRECATED: "+_19;
if(_1a){
_1c+=" "+_1a;
}
if(_1b){
_1c+=" -- will be removed in version: "+_1b;
}
dojo.debug(_1c);
};
dojo.render=(function(){
function vscaffold(_1d,_1e){
var tmp={capable:false,support:{builtin:false,plugin:false},prefixes:_1d};
for(var i=0;i<_1e.length;i++){
tmp[_1e[i]]=false;
}
return tmp;
}
return {name:"",ver:dojo.version,os:{win:false,linux:false,osx:false},html:vscaffold(["html"],["ie","opera","khtml","safari","moz"]),svg:vscaffold(["svg"],["corel","adobe","batik"]),vml:vscaffold(["vml"],["ie"]),swf:vscaffold(["Swf","Flash","Mm"],["mm"]),swt:vscaffold(["Swt"],["ibm"])};
})();
dojo.hostenv=(function(){
var _21={isDebug:false,allowQueryConfig:false,baseScriptUri:"",baseRelativePath:"",libraryScriptUri:"",iePreventClobber:false,ieClobberMinimal:true,preventBackButtonFix:true,delayMozLoadingFix:false,searchIds:[],parseWidgets:true};
if(typeof djConfig=="undefined"){
djConfig=_21;
}else{
for(var _22 in _21){
if(typeof djConfig[_22]=="undefined"){
djConfig[_22]=_21[_22];
}
}
}
return {name_:"(unset)",version_:"(unset)",getName:function(){
return this.name_;
},getVersion:function(){
return this.version_;
},getText:function(uri){
dojo.unimplemented("getText","uri="+uri);
}};
})();
dojo.hostenv.getBaseScriptUri=function(){
if(djConfig.baseScriptUri.length){
return djConfig.baseScriptUri;
}
var uri=new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
if(!uri){
dojo.raise("Nothing returned by getLibraryScriptUri(): "+uri);
}
var _25=uri.lastIndexOf("/");
djConfig.baseScriptUri=djConfig.baseRelativePath;
return djConfig.baseScriptUri;
};
(function(){
var _26={pkgFileName:"__package__",loading_modules_:{},loaded_modules_:{},addedToLoadingCount:[],removedFromLoadingCount:[],inFlightCount:0,modulePrefixes_:{dojo:{name:"dojo",value:"src"}},setModulePrefix:function(_27,_28){
this.modulePrefixes_[_27]={name:_27,value:_28};
},moduleHasPrefix:function(_29){
var mp=this.modulePrefixes_;
return Boolean(mp[_29]&&mp[_29].value);
},getModulePrefix:function(_2b){
if(this.moduleHasPrefix(_2b)){
return this.modulePrefixes_[_2b].value;
}
return _2b;
},getTextStack:[],loadUriStack:[],loadedUris:[],post_load_:false,modulesLoadedListeners:[],unloadListeners:[],loadNotifying:false};
for(var _2c in _26){
dojo.hostenv[_2c]=_26[_2c];
}
})();
dojo.hostenv.loadPath=function(_2d,_2e,cb){
var uri;
if(_2d.charAt(0)=="/"||_2d.match(/^\w+:/)){
uri=_2d;
}else{
uri=this.getBaseScriptUri()+_2d;
}
if(djConfig.cacheBust&&dojo.render.html.capable){
uri+="?"+String(djConfig.cacheBust).replace(/\W+/g,"");
}
try{
return !_2e?this.loadUri(uri,cb):this.loadUriAndCheck(uri,_2e,cb);
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.hostenv.loadUri=function(uri,cb){
if(this.loadedUris[uri]){
return true;
}
var _33=this.getText(uri,null,true);
if(!_33){
return false;
}
this.loadedUris[uri]=true;
if(cb){
_33="("+_33+")";
}
var _34=dj_eval(_33);
if(cb){
cb(_34);
}
return true;
};
dojo.hostenv.loadUriAndCheck=function(uri,_36,cb){
var ok=true;
try{
ok=this.loadUri(uri,cb);
}
catch(e){
dojo.debug("failed loading ",uri," with error: ",e);
}
return Boolean(ok&&this.findModule(_36,false));
};
dojo.loaded=function(){
};
dojo.unloaded=function(){
};
dojo.hostenv.loaded=function(){
this.loadNotifying=true;
this.post_load_=true;
var mll=this.modulesLoadedListeners;
for(var x=0;x<mll.length;x++){
mll[x]();
}
this.modulesLoadedListeners=[];
this.loadNotifying=false;
dojo.loaded();
};
dojo.hostenv.unloaded=function(){
var mll=this.unloadListeners;
while(mll.length){
(mll.pop())();
}
dojo.unloaded();
};
dojo.addOnLoad=function(obj,_3d){
var dh=dojo.hostenv;
if(arguments.length==1){
dh.modulesLoadedListeners.push(obj);
}else{
if(arguments.length>1){
dh.modulesLoadedListeners.push(function(){
obj[_3d]();
});
}
}
if(dh.post_load_&&dh.inFlightCount==0&&!dh.loadNotifying){
dh.callLoaded();
}
};
dojo.addOnUnload=function(obj,_40){
var dh=dojo.hostenv;
if(arguments.length==1){
dh.unloadListeners.push(obj);
}else{
if(arguments.length>1){
dh.unloadListeners.push(function(){
obj[_40]();
});
}
}
};
dojo.hostenv.modulesLoaded=function(){
if(this.post_load_){
return;
}
if(this.loadUriStack.length==0&&this.getTextStack.length==0){
if(this.inFlightCount>0){
dojo.debug("files still in flight!");
return;
}
dojo.hostenv.callLoaded();
}
};
dojo.hostenv.callLoaded=function(){
if(typeof setTimeout=="object"){
setTimeout("dojo.hostenv.loaded();",0);
}else{
dojo.hostenv.loaded();
}
};
dojo.hostenv.getModuleSymbols=function(_42){
var _43=_42.split(".");
for(var i=_43.length;i>0;i--){
var _45=_43.slice(0,i).join(".");
if((i==1)&&!this.moduleHasPrefix(_45)){
_43[0]="../"+_43[0];
}else{
var _46=this.getModulePrefix(_45);
if(_46!=_45){
_43.splice(0,i,_46);
break;
}
}
}
return _43;
};
dojo.hostenv._global_omit_module_check=false;
dojo.hostenv.loadModule=function(_47,_48,_49){
if(!_47){
return;
}
_49=this._global_omit_module_check||_49;
var _4a=this.findModule(_47,false);
if(_4a){
return _4a;
}
if(dj_undef(_47,this.loading_modules_)){
this.addedToLoadingCount.push(_47);
}
this.loading_modules_[_47]=1;
var _4b=_47.replace(/\./g,"/")+".js";
var _4c=_47.split(".");
var _4d=this.getModuleSymbols(_47);
var _4e=((_4d[0].charAt(0)!="/")&&!_4d[0].match(/^\w+:/));
var _4f=_4d[_4d.length-1];
var ok;
if(_4f=="*"){
_47=_4c.slice(0,-1).join(".");
while(_4d.length){
_4d.pop();
_4d.push(this.pkgFileName);
_4b=_4d.join("/")+".js";
if(_4e&&_4b.charAt(0)=="/"){
_4b=_4b.slice(1);
}
ok=this.loadPath(_4b,!_49?_47:null);
if(ok){
break;
}
_4d.pop();
}
}else{
_4b=_4d.join("/")+".js";
_47=_4c.join(".");
var _51=!_49?_47:null;
ok=this.loadPath(_4b,_51);
if(!ok&&!_48){
_4d.pop();
while(_4d.length){
_4b=_4d.join("/")+".js";
ok=this.loadPath(_4b,_51);
if(ok){
break;
}
_4d.pop();
_4b=_4d.join("/")+"/"+this.pkgFileName+".js";
if(_4e&&_4b.charAt(0)=="/"){
_4b=_4b.slice(1);
}
ok=this.loadPath(_4b,_51);
if(ok){
break;
}
}
}
if(!ok&&!_49){
dojo.raise("Could not load '"+_47+"'; last tried '"+_4b+"'");
}
}
if(!_49&&!this["isXDomain"]){
_4a=this.findModule(_47,false);
if(!_4a){
dojo.raise("symbol '"+_47+"' is not defined after loading '"+_4b+"'");
}
}
return _4a;
};
dojo.hostenv.startPackage=function(_52){
var _53=String(_52);
var _54=_53;
var _55=_52.split(/\./);
if(_55[_55.length-1]=="*"){
_55.pop();
_54=_55.join(".");
}
var _56=dojo.evalObjPath(_54,true);
this.loaded_modules_[_53]=_56;
this.loaded_modules_[_54]=_56;
return _56;
};
dojo.hostenv.findModule=function(_57,_58){
var lmn=String(_57);
if(this.loaded_modules_[lmn]){
return this.loaded_modules_[lmn];
}
if(_58){
dojo.raise("no loaded module named '"+_57+"'");
}
return null;
};
dojo.kwCompoundRequire=function(_5a){
var _5b=_5a["common"]||[];
var _5c=_5a[dojo.hostenv.name_]?_5b.concat(_5a[dojo.hostenv.name_]||[]):_5b.concat(_5a["default"]||[]);
for(var x=0;x<_5c.length;x++){
var _5e=_5c[x];
if(_5e.constructor==Array){
dojo.hostenv.loadModule.apply(dojo.hostenv,_5e);
}else{
dojo.hostenv.loadModule(_5e);
}
}
};
dojo.require=function(_5f){
dojo.hostenv.loadModule.apply(dojo.hostenv,arguments);
};
dojo.requireIf=function(_60,_61){
var _62=arguments[0];
if((_62===true)||(_62=="common")||(_62&&dojo.render[_62].capable)){
var _63=[];
for(var i=1;i<arguments.length;i++){
_63.push(arguments[i]);
}
dojo.require.apply(dojo,_63);
}
};
dojo.requireAfterIf=dojo.requireIf;
dojo.provide=function(_65){
return dojo.hostenv.startPackage.apply(dojo.hostenv,arguments);
};
dojo.registerModulePath=function(_66,_67){
return dojo.hostenv.setModulePrefix(_66,_67);
};
dojo.setModulePrefix=function(_68,_69){
dojo.deprecated("dojo.setModulePrefix(\""+_68+"\", \""+_69+"\")","replaced by dojo.registerModulePath","0.5");
return dojo.registerModulePath(_68,_69);
};
dojo.exists=function(obj,_6b){
var p=_6b.split(".");
for(var i=0;i<p.length;i++){
if(!obj[p[i]]){
return false;
}
obj=obj[p[i]];
}
return true;
};
dojo.hostenv.normalizeLocale=function(_6e){
return _6e?_6e.toLowerCase():dojo.locale;
};
dojo.hostenv.searchLocalePath=function(_6f,_70,_71){
_6f=dojo.hostenv.normalizeLocale(_6f);
var _72=_6f.split("-");
var _73=[];
for(var i=_72.length;i>0;i--){
_73.push(_72.slice(0,i).join("-"));
}
_73.push(false);
if(_70){
_73.reverse();
}
for(var j=_73.length-1;j>=0;j--){
var loc=_73[j]||"ROOT";
var _77=_71(loc);
if(_77){
break;
}
}
};
dojo.hostenv.localesGenerated=["ROOT","es-es","es","it-it","pt-br","de","fr-fr","zh-cn","pt","en-us","zh","fr","zh-tw","it","en-gb","xx","de-de","ko-kr","ja-jp","ko","en","ja"];
dojo.hostenv.registerNlsPrefix=function(){
dojo.registerModulePath("nls","nls");
};
dojo.hostenv.preloadLocalizations=function(){
if(dojo.hostenv.localesGenerated){
dojo.hostenv.registerNlsPrefix();
function preload(_78){
_78=dojo.hostenv.normalizeLocale(_78);
dojo.hostenv.searchLocalePath(_78,true,function(loc){
for(var i=0;i<dojo.hostenv.localesGenerated.length;i++){
if(dojo.hostenv.localesGenerated[i]==loc){
dojo["require"]("nls.dojo_"+loc);
return true;
}
}
return false;
});
}
preload();
var _7b=djConfig.extraLocale||[];
for(var i=0;i<_7b.length;i++){
preload(_7b[i]);
}
}
dojo.hostenv.preloadLocalizations=function(){
};
};
dojo.requireLocalization=function(_7d,_7e,_7f){
dojo.hostenv.preloadLocalizations();
var _80=[_7d,"nls",_7e].join(".");
var _81=dojo.hostenv.findModule(_80);
if(_81){
if(djConfig.localizationComplete&&_81._built){
return;
}
var _82=dojo.hostenv.normalizeLocale(_7f).replace("-","_");
var _83=_80+"."+_82;
if(dojo.hostenv.findModule(_83)){
return;
}
}
_81=dojo.hostenv.startPackage(_80);
var _84=dojo.hostenv.getModuleSymbols(_7d);
var _85=_84.concat("nls").join("/");
var _86;
dojo.hostenv.searchLocalePath(_7f,false,function(loc){
var _88=loc.replace("-","_");
var _89=_80+"."+_88;
var _8a=false;
if(!dojo.hostenv.findModule(_89)){
dojo.hostenv.startPackage(_89);
var _8b=[_85];
if(loc!="ROOT"){
_8b.push(loc);
}
_8b.push(_7e);
var _8c=_8b.join("/")+".js";
_8a=dojo.hostenv.loadPath(_8c,null,function(_8d){
var _8e=function(){
};
_8e.prototype=_86;
_81[_88]=new _8e();
for(var j in _8d){
_81[_88][j]=_8d[j];
}
});
}else{
_8a=true;
}
if(_8a&&_81[_88]){
_86=_81[_88];
}else{
_81[_88]=_86;
}
});
};
(function(){
var _90=djConfig.extraLocale;
if(_90){
if(!_90 instanceof Array){
_90=[_90];
}
var req=dojo.requireLocalization;
dojo.requireLocalization=function(m,b,_94){
req(m,b,_94);
if(_94){
return;
}
for(var i=0;i<_90.length;i++){
req(m,b,_90[i]);
}
};
}
})();
}
if(typeof window!="undefined"){
(function(){
if(djConfig.allowQueryConfig){
var _96=document.location.toString();
var _97=_96.split("?",2);
if(_97.length>1){
var _98=_97[1];
var _99=_98.split("&");
for(var x in _99){
var sp=_99[x].split("=");
if((sp[0].length>9)&&(sp[0].substr(0,9)=="djConfig.")){
var opt=sp[0].substr(9);
try{
djConfig[opt]=eval(sp[1]);
}
catch(e){
djConfig[opt]=sp[1];
}
}
}
}
}
if(((djConfig["baseScriptUri"]=="")||(djConfig["baseRelativePath"]==""))&&(document&&document.getElementsByTagName)){
var _9d=document.getElementsByTagName("script");
var _9e=/(__package__|dojo|bootstrap1)\.js([\?\.]|$)/i;
for(var i=0;i<_9d.length;i++){
var src=_9d[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_9e);
if(m){
var _a2=src.substring(0,m.index);
if(src.indexOf("bootstrap1")>-1){
_a2+="../";
}
if(!this["djConfig"]){
djConfig={};
}
if(djConfig["baseScriptUri"]==""){
djConfig["baseScriptUri"]=_a2;
}
if(djConfig["baseRelativePath"]==""){
djConfig["baseRelativePath"]=_a2;
}
break;
}
}
}
var dr=dojo.render;
var drh=dojo.render.html;
var drs=dojo.render.svg;
var dua=(drh.UA=navigator.userAgent);
var dav=(drh.AV=navigator.appVersion);
var t=true;
var f=false;
drh.capable=t;
drh.support.builtin=t;
dr.ver=parseFloat(drh.AV);
dr.os.mac=dav.indexOf("Macintosh")>=0;
dr.os.win=dav.indexOf("Windows")>=0;
dr.os.linux=dav.indexOf("X11")>=0;
drh.opera=dua.indexOf("Opera")>=0;
drh.khtml=(dav.indexOf("Konqueror")>=0)||(dav.indexOf("Safari")>=0);
drh.safari=dav.indexOf("Safari")>=0;
var _aa=dua.indexOf("Gecko");
drh.mozilla=drh.moz=(_aa>=0)&&(!drh.khtml);
if(drh.mozilla){
drh.geckoVersion=dua.substring(_aa+6,_aa+14);
}
drh.ie=(document.all)&&(!drh.opera);
drh.ie50=drh.ie&&dav.indexOf("MSIE 5.0")>=0;
drh.ie55=drh.ie&&dav.indexOf("MSIE 5.5")>=0;
drh.ie60=drh.ie&&dav.indexOf("MSIE 6.0")>=0;
drh.ie70=drh.ie&&dav.indexOf("MSIE 7.0")>=0;
var cm=document["compatMode"];
drh.quirks=(cm=="BackCompat")||(cm=="QuirksMode")||drh.ie55||drh.ie50;
dojo.locale=dojo.locale||(drh.ie?navigator.userLanguage:navigator.language).toLowerCase();
dr.vml.capable=drh.ie;
drs.capable=f;
drs.support.plugin=f;
drs.support.builtin=f;
var _ac=window["document"];
var tdi=_ac["implementation"];
if((tdi)&&(tdi["hasFeature"])&&(tdi.hasFeature("org.w3c.dom.svg","1.0"))){
drs.capable=t;
drs.support.builtin=t;
drs.support.plugin=f;
}
if(drh.safari){
var tmp=dua.split("AppleWebKit/")[1];
var ver=parseFloat(tmp.split(" ")[0]);
if(ver>=420){
drs.capable=t;
drs.support.builtin=t;
drs.support.plugin=f;
}
}
})();
dojo.hostenv.startPackage("dojo.hostenv");
dojo.render.name=dojo.hostenv.name_="browser";
dojo.hostenv.searchIds=[];
dojo.hostenv._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
dojo.hostenv.getXmlhttpObject=function(){
var _b0=null;
var _b1=null;
try{
_b0=new XMLHttpRequest();
}
catch(e){
}
if(!_b0){
for(var i=0;i<3;++i){
var _b3=dojo.hostenv._XMLHTTP_PROGIDS[i];
try{
_b0=new ActiveXObject(_b3);
}
catch(e){
_b1=e;
}
if(_b0){
dojo.hostenv._XMLHTTP_PROGIDS=[_b3];
break;
}
}
}
if(!_b0){
return dojo.raise("XMLHTTP not available",_b1);
}
return _b0;
};
dojo.hostenv._blockAsync=false;
dojo.hostenv.getText=function(uri,_b5,_b6){
if(!_b5){
this._blockAsync=true;
}
var _b7=this.getXmlhttpObject();
function isDocumentOk(_b8){
var _b9=_b8["status"];
return Boolean((!_b9)||((200<=_b9)&&(300>_b9))||(_b9==304));
}
if(_b5){
var _ba=this,_bb=null,gbl=dojo.global();
var xhr=dojo.evalObjPath("dojo.io.XMLHTTPTransport");
_b7.onreadystatechange=function(){
if(_bb){
gbl.clearTimeout(_bb);
_bb=null;
}
if(_ba._blockAsync||(xhr&&xhr._blockAsync)){
_bb=gbl.setTimeout(function(){
_b7.onreadystatechange.apply(this);
},10);
}else{
if(4==_b7.readyState){
if(isDocumentOk(_b7)){
_b5(_b7.responseText);
}
}
}
};
}
_b7.open("GET",uri,_b5?true:false);
try{
_b7.send(null);
if(_b5){
return null;
}
if(!isDocumentOk(_b7)){
var err=Error("Unable to load "+uri+" status:"+_b7.status);
err.status=_b7.status;
err.responseText=_b7.responseText;
throw err;
}
}
catch(e){
this._blockAsync=false;
if((_b6)&&(!_b5)){
return null;
}else{
throw e;
}
}
this._blockAsync=false;
return _b7.responseText;
};
dojo.hostenv.defaultDebugContainerId="dojoDebug";
dojo.hostenv._println_buffer=[];
dojo.hostenv._println_safe=false;
dojo.hostenv.println=function(_bf){
if(!dojo.hostenv._println_safe){
dojo.hostenv._println_buffer.push(_bf);
}else{
try{
var _c0=document.getElementById(djConfig.debugContainerId?djConfig.debugContainerId:dojo.hostenv.defaultDebugContainerId);
if(!_c0){
_c0=dojo.body();
}
var div=document.createElement("div");
div.appendChild(document.createTextNode(_bf));
_c0.appendChild(div);
}
catch(e){
try{
document.write("<div>"+_bf+"</div>");
}
catch(e2){
window.status=_bf;
}
}
}
};
dojo.addOnLoad(function(){
dojo.hostenv._println_safe=true;
while(dojo.hostenv._println_buffer.length>0){
dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
}
});
function dj_addNodeEvtHdlr(_c2,_c3,fp,_c5){
var _c6=_c2["on"+_c3]||function(){
};
_c2["on"+_c3]=function(){
fp.apply(_c2,arguments);
_c6.apply(_c2,arguments);
};
return true;
}
function dj_load_init(e){
var _c8=(e&&e.type)?e.type.toLowerCase():"load";
if(arguments.callee.initialized||(_c8!="domcontentloaded"&&_c8!="load")){
return;
}
arguments.callee.initialized=true;
if(typeof (_timer)!="undefined"){
clearInterval(_timer);
delete _timer;
}
var _c9=function(){
if(dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
};
if(dojo.hostenv.inFlightCount==0){
_c9();
dojo.hostenv.modulesLoaded();
}else{
dojo.addOnLoad(_c9);
}
}
if(document.addEventListener){
if(dojo.render.html.opera||(dojo.render.html.moz&&!djConfig.delayMozLoadingFix)){
document.addEventListener("DOMContentLoaded",dj_load_init,null);
}
window.addEventListener("load",dj_load_init,null);
}
if(dojo.render.html.ie&&dojo.render.os.win){
document.attachEvent("onreadystatechange",function(e){
if(document.readyState=="complete"){
dj_load_init();
}
});
}
if(/(WebKit|khtml)/i.test(navigator.userAgent)){
var _timer=setInterval(function(){
if(/loaded|complete/.test(document.readyState)){
dj_load_init();
}
},10);
}
if(dojo.render.html.ie){
dj_addNodeEvtHdlr(window,"beforeunload",function(){
dojo.hostenv._unloading=true;
window.setTimeout(function(){
dojo.hostenv._unloading=false;
},0);
});
}
dj_addNodeEvtHdlr(window,"unload",function(){
dojo.hostenv.unloaded();
if((!dojo.render.html.ie)||(dojo.render.html.ie&&dojo.hostenv._unloading)){
dojo.hostenv.unloaded();
}
});
dojo.hostenv.makeWidgets=function(){
var _cb=[];
if(djConfig.searchIds&&djConfig.searchIds.length>0){
_cb=_cb.concat(djConfig.searchIds);
}
if(dojo.hostenv.searchIds&&dojo.hostenv.searchIds.length>0){
_cb=_cb.concat(dojo.hostenv.searchIds);
}
if((djConfig.parseWidgets)||(_cb.length>0)){
if(dojo.evalObjPath("dojo.widget.Parse")){
var _cc=new dojo.xml.Parse();
if(_cb.length>0){
for(var x=0;x<_cb.length;x++){
var _ce=document.getElementById(_cb[x]);
if(!_ce){
continue;
}
var _cf=_cc.parseElement(_ce,null,true);
dojo.widget.getParser().createComponents(_cf);
}
}else{
if(djConfig.parseWidgets){
var _cf=_cc.parseElement(dojo.body(),null,true);
dojo.widget.getParser().createComponents(_cf);
}
}
}
}
};
dojo.addOnLoad(function(){
if(!dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
});
try{
if(dojo.render.html.ie){
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
document.createStyleSheet().addRule("v\\:*","behavior:url(#default#VML)");
}
}
catch(e){
}
dojo.hostenv.writeIncludes=function(){
};
if(!dj_undef("document",this)){
dj_currentDocument=this.document;
}
dojo.doc=function(){
return dj_currentDocument;
};
dojo.body=function(){
return dojo.doc().body||dojo.doc().getElementsByTagName("body")[0];
};
dojo.byId=function(id,doc){
if((id)&&((typeof id=="string")||(id instanceof String))){
if(!doc){
doc=dj_currentDocument;
}
var ele=doc.getElementById(id);
if(ele&&(ele.id!=id)&&doc.all){
ele=null;
eles=doc.all[id];
if(eles){
if(eles.length){
for(var i=0;i<eles.length;i++){
if(eles[i].id==id){
ele=eles[i];
break;
}
}
}else{
ele=eles;
}
}
}
return ele;
}
return id;
};
dojo.setContext=function(_d4,_d5){
dj_currentContext=_d4;
dj_currentDocument=_d5;
};
dojo._fireCallback=function(_d6,_d7,_d8){
if((_d7)&&((typeof _d6=="string")||(_d6 instanceof String))){
_d6=_d7[_d6];
}
return (_d7?_d6.apply(_d7,_d8||[]):_d6());
};
dojo.withGlobal=function(_d9,_da,_db,_dc){
var _dd;
var _de=dj_currentContext;
var _df=dj_currentDocument;
try{
dojo.setContext(_d9,_d9.document);
_dd=dojo._fireCallback(_da,_db,_dc);
}
finally{
dojo.setContext(_de,_df);
}
return _dd;
};
dojo.withDoc=function(_e0,_e1,_e2,_e3){
var _e4;
var _e5=dj_currentDocument;
try{
dj_currentDocument=_e0;
_e4=dojo._fireCallback(_e1,_e2,_e3);
}
finally{
dj_currentDocument=_e5;
}
return _e4;
};
}
(function(){
if(typeof dj_usingBootstrap!="undefined"){
return;
}
var _e6=false;
var _e7=false;
var _e8=false;
if((typeof this["load"]=="function")&&((typeof this["Packages"]=="function")||(typeof this["Packages"]=="object"))){
_e6=true;
}else{
if(typeof this["load"]=="function"){
_e7=true;
}else{
if(window.widget){
_e8=true;
}
}
}
var _e9=[];
if((this["djConfig"])&&((djConfig["isDebug"])||(djConfig["debugAtAllCosts"]))){
_e9.push("debug.js");
}
if((this["djConfig"])&&(djConfig["debugAtAllCosts"])&&(!_e6)&&(!_e8)){
_e9.push("browser_debug.js");
}
var _ea=djConfig["baseScriptUri"];
if((this["djConfig"])&&(djConfig["baseLoaderUri"])){
_ea=djConfig["baseLoaderUri"];
}
for(var x=0;x<_e9.length;x++){
var _ec=_ea+"src/"+_e9[x];
if(_e6||_e7){
load(_ec);
}else{
try{
document.write("<scr"+"ipt type='text/javascript' src='"+_ec+"'></scr"+"ipt>");
}
catch(e){
var _ed=document.createElement("script");
_ed.src=_ec;
document.getElementsByTagName("head")[0].appendChild(_ed);
}
}
}
})();
dojo.provide("dojo.lang.common");
dojo.lang.inherits=function(_ee,_ef){
if(typeof _ef!="function"){
dojo.raise("dojo.inherits: superclass argument ["+_ef+"] must be a function (subclass: ["+_ee+"']");
}
_ee.prototype=new _ef();
_ee.prototype.constructor=_ee;
_ee.superclass=_ef.prototype;
_ee["super"]=_ef.prototype;
};
dojo.lang._mixin=function(obj,_f1){
var _f2={};
for(var x in _f1){
if((typeof _f2[x]=="undefined")||(_f2[x]!=_f1[x])){
obj[x]=_f1[x];
}
}
if(dojo.render.html.ie&&(typeof (_f1["toString"])=="function")&&(_f1["toString"]!=obj["toString"])&&(_f1["toString"]!=_f2["toString"])){
obj.toString=_f1.toString;
}
return obj;
};
dojo.lang.mixin=function(obj,_f5){
for(var i=1,l=arguments.length;i<l;i++){
dojo.lang._mixin(obj,arguments[i]);
}
return obj;
};
dojo.lang.extend=function(_f8,_f9){
for(var i=1,l=arguments.length;i<l;i++){
dojo.lang._mixin(_f8.prototype,arguments[i]);
}
return _f8;
};
dojo.inherits=dojo.lang.inherits;
dojo.mixin=dojo.lang.mixin;
dojo.extend=dojo.lang.extend;
dojo.lang.find=function(_fc,_fd,_fe,_ff){
if(!dojo.lang.isArrayLike(_fc)&&dojo.lang.isArrayLike(_fd)){
dojo.deprecated("dojo.lang.find(value, array)","use dojo.lang.find(array, value) instead","0.5");
var temp=_fc;
_fc=_fd;
_fd=temp;
}
var _101=dojo.lang.isString(_fc);
if(_101){
_fc=_fc.split("");
}
if(_ff){
var step=-1;
var i=_fc.length-1;
var end=-1;
}else{
var step=1;
var i=0;
var end=_fc.length;
}
if(_fe){
while(i!=end){
if(_fc[i]===_fd){
return i;
}
i+=step;
}
}else{
while(i!=end){
if(_fc[i]==_fd){
return i;
}
i+=step;
}
}
return -1;
};
dojo.lang.indexOf=dojo.lang.find;
dojo.lang.findLast=function(_105,_106,_107){
return dojo.lang.find(_105,_106,_107,true);
};
dojo.lang.lastIndexOf=dojo.lang.findLast;
dojo.lang.inArray=function(_108,_109){
return dojo.lang.find(_108,_109)>-1;
};
dojo.lang.isObject=function(it){
if(typeof it=="undefined"){
return false;
}
return (typeof it=="object"||it===null||dojo.lang.isArray(it)||dojo.lang.isFunction(it));
};
dojo.lang.isArray=function(it){
return (it&&it instanceof Array||typeof it=="array");
};
dojo.lang.isArrayLike=function(it){
if((!it)||(dojo.lang.isUndefined(it))){
return false;
}
if(dojo.lang.isString(it)){
return false;
}
if(dojo.lang.isFunction(it)){
return false;
}
if(dojo.lang.isArray(it)){
return true;
}
if((it.tagName)&&(it.tagName.toLowerCase()=="form")){
return false;
}
if(dojo.lang.isNumber(it.length)&&isFinite(it.length)){
return true;
}
return false;
};
dojo.lang.isFunction=function(it){
if(!it){
return false;
}
if((typeof (it)=="function")&&(it=="[object NodeList]")){
return false;
}
return (it instanceof Function||typeof it=="function");
};
dojo.lang.isString=function(it){
return (typeof it=="string"||it instanceof String);
};
dojo.lang.isAlien=function(it){
if(!it){
return false;
}
return !dojo.lang.isFunction()&&/\{\s*\[native code\]\s*\}/.test(String(it));
};
dojo.lang.isBoolean=function(it){
return (it instanceof Boolean||typeof it=="boolean");
};
dojo.lang.isNumber=function(it){
return (it instanceof Number||typeof it=="number");
};
dojo.lang.isUndefined=function(it){
return ((typeof (it)=="undefined")&&(it==undefined));
};
dojo.provide("dojo.lang.array");
dojo.lang.has=function(obj,name){
try{
return typeof obj[name]!="undefined";
}
catch(e){
return false;
}
};
dojo.lang.isEmpty=function(obj){
if(dojo.lang.isObject(obj)){
var tmp={};
var _117=0;
for(var x in obj){
if(obj[x]&&(!tmp[x])){
_117++;
break;
}
}
return _117==0;
}else{
if(dojo.lang.isArrayLike(obj)||dojo.lang.isString(obj)){
return obj.length==0;
}
}
};
dojo.lang.map=function(arr,obj,_11b){
var _11c=dojo.lang.isString(arr);
if(_11c){
arr=arr.split("");
}
if(dojo.lang.isFunction(obj)&&(!_11b)){
_11b=obj;
obj=dj_global;
}else{
if(dojo.lang.isFunction(obj)&&_11b){
var _11d=obj;
obj=_11b;
_11b=_11d;
}
}
if(Array.map){
var _11e=Array.map(arr,_11b,obj);
}else{
var _11e=[];
for(var i=0;i<arr.length;++i){
_11e.push(_11b.call(obj,arr[i]));
}
}
if(_11c){
return _11e.join("");
}else{
return _11e;
}
};
dojo.lang.reduce=function(arr,_121,obj,_123){
var _124=_121;
var ob=obj?obj:dj_global;
dojo.lang.map(arr,function(val){
_124=_123.call(ob,_124,val);
});
return _124;
};
dojo.lang.forEach=function(_127,_128,_129){
if(dojo.lang.isString(_127)){
_127=_127.split("");
}
if(Array.forEach){
Array.forEach(_127,_128,_129);
}else{
if(!_129){
_129=dj_global;
}
for(var i=0,l=_127.length;i<l;i++){
_128.call(_129,_127[i],i,_127);
}
}
};
dojo.lang._everyOrSome=function(_12c,arr,_12e,_12f){
if(dojo.lang.isString(arr)){
arr=arr.split("");
}
if(Array.every){
return Array[_12c?"every":"some"](arr,_12e,_12f);
}else{
if(!_12f){
_12f=dj_global;
}
for(var i=0,l=arr.length;i<l;i++){
var _132=_12e.call(_12f,arr[i],i,arr);
if(_12c&&!_132){
return false;
}else{
if((!_12c)&&(_132)){
return true;
}
}
}
return Boolean(_12c);
}
};
dojo.lang.every=function(arr,_134,_135){
return this._everyOrSome(true,arr,_134,_135);
};
dojo.lang.some=function(arr,_137,_138){
return this._everyOrSome(false,arr,_137,_138);
};
dojo.lang.filter=function(arr,_13a,_13b){
var _13c=dojo.lang.isString(arr);
if(_13c){
arr=arr.split("");
}
var _13d;
if(Array.filter){
_13d=Array.filter(arr,_13a,_13b);
}else{
if(!_13b){
if(arguments.length>=3){
dojo.raise("thisObject doesn't exist!");
}
_13b=dj_global;
}
_13d=[];
for(var i=0;i<arr.length;i++){
if(_13a.call(_13b,arr[i],i,arr)){
_13d.push(arr[i]);
}
}
}
if(_13c){
return _13d.join("");
}else{
return _13d;
}
};
dojo.lang.unnest=function(){
var out=[];
for(var i=0;i<arguments.length;i++){
if(dojo.lang.isArrayLike(arguments[i])){
var add=dojo.lang.unnest.apply(this,arguments[i]);
out=out.concat(add);
}else{
out.push(arguments[i]);
}
}
return out;
};
dojo.lang.toArray=function(_142,_143){
var _144=[];
for(var i=_143||0;i<_142.length;i++){
_144.push(_142[i]);
}
return _144;
};
dojo.provide("dojo.lang.type");
dojo.lang.whatAmI=function(_146){
dojo.deprecated("dojo.lang.whatAmI","use dojo.lang.getType instead","0.5");
return dojo.lang.getType(_146);
};
dojo.lang.whatAmI.custom={};
dojo.lang.getType=function(_147){
try{
if(dojo.lang.isArray(_147)){
return "array";
}
if(dojo.lang.isFunction(_147)){
return "function";
}
if(dojo.lang.isString(_147)){
return "string";
}
if(dojo.lang.isNumber(_147)){
return "number";
}
if(dojo.lang.isBoolean(_147)){
return "boolean";
}
if(dojo.lang.isAlien(_147)){
return "alien";
}
if(dojo.lang.isUndefined(_147)){
return "undefined";
}
for(var name in dojo.lang.whatAmI.custom){
if(dojo.lang.whatAmI.custom[name](_147)){
return name;
}
}
if(dojo.lang.isObject(_147)){
return "object";
}
}
catch(e){
}
return "unknown";
};
dojo.lang.isNumeric=function(_149){
return (!isNaN(_149)&&isFinite(_149)&&(_149!=null)&&!dojo.lang.isBoolean(_149)&&!dojo.lang.isArray(_149)&&!/^\s*$/.test(_149));
};
dojo.lang.isBuiltIn=function(_14a){
return (dojo.lang.isArray(_14a)||dojo.lang.isFunction(_14a)||dojo.lang.isString(_14a)||dojo.lang.isNumber(_14a)||dojo.lang.isBoolean(_14a)||(_14a==null)||(_14a instanceof Error)||(typeof _14a=="error"));
};
dojo.lang.isPureObject=function(_14b){
return ((_14b!=null)&&dojo.lang.isObject(_14b)&&_14b.constructor==Object);
};
dojo.lang.isOfType=function(_14c,type,_14e){
var _14f=false;
if(_14e){
_14f=_14e["optional"];
}
if(_14f&&((_14c===null)||dojo.lang.isUndefined(_14c))){
return true;
}
if(dojo.lang.isArray(type)){
var _150=type;
for(var i in _150){
var _152=_150[i];
if(dojo.lang.isOfType(_14c,_152)){
return true;
}
}
return false;
}else{
if(dojo.lang.isString(type)){
type=type.toLowerCase();
}
switch(type){
case Array:
case "array":
return dojo.lang.isArray(_14c);
case Function:
case "function":
return dojo.lang.isFunction(_14c);
case String:
case "string":
return dojo.lang.isString(_14c);
case Number:
case "number":
return dojo.lang.isNumber(_14c);
case "numeric":
return dojo.lang.isNumeric(_14c);
case Boolean:
case "boolean":
return dojo.lang.isBoolean(_14c);
case Object:
case "object":
return dojo.lang.isObject(_14c);
case "pureobject":
return dojo.lang.isPureObject(_14c);
case "builtin":
return dojo.lang.isBuiltIn(_14c);
case "alien":
return dojo.lang.isAlien(_14c);
case "undefined":
return dojo.lang.isUndefined(_14c);
case null:
case "null":
return (_14c===null);
case "optional":
dojo.deprecated("dojo.lang.isOfType(value, [type, \"optional\"])","use dojo.lang.isOfType(value, type, {optional: true} ) instead","0.5");
return ((_14c===null)||dojo.lang.isUndefined(_14c));
default:
if(dojo.lang.isFunction(type)){
return (_14c instanceof type);
}else{
dojo.raise("dojo.lang.isOfType() was passed an invalid type");
}
}
}
dojo.raise("If we get here, it means a bug was introduced above.");
};
dojo.lang.getObject=function(str){
var _154=str.split("."),i=0,obj=dj_global;
do{
obj=obj[_154[i++]];
}while(i<_154.length&&obj);
return (obj!=dj_global)?obj:null;
};
dojo.lang.doesObjectExist=function(str){
var _158=str.split("."),i=0,obj=dj_global;
do{
obj=obj[_158[i++]];
}while(i<_158.length&&obj);
return (obj&&obj!=dj_global);
};
dojo.provide("dojo.lang.assert");
dojo.lang.assert=function(_15b,_15c){
if(!_15b){
var _15d="An assert statement failed.\n"+"The method dojo.lang.assert() was called with a 'false' value.\n";
if(_15c){
_15d+="Here's the assert message:\n"+_15c+"\n";
}
throw new Error(_15d);
}
};
dojo.lang.assertType=function(_15e,type,_160){
if(dojo.lang.isString(_160)){
dojo.deprecated("dojo.lang.assertType(value, type, \"message\")","use dojo.lang.assertType(value, type) instead","0.5");
}
if(!dojo.lang.isOfType(_15e,type,_160)){
if(!dojo.lang.assertType._errorMessage){
dojo.lang.assertType._errorMessage="Type mismatch: dojo.lang.assertType() failed.";
}
dojo.lang.assert(false,dojo.lang.assertType._errorMessage);
}
};
dojo.lang.assertValidKeywords=function(_161,_162,_163){
var key;
if(!_163){
if(!dojo.lang.assertValidKeywords._errorMessage){
dojo.lang.assertValidKeywords._errorMessage="In dojo.lang.assertValidKeywords(), found invalid keyword:";
}
_163=dojo.lang.assertValidKeywords._errorMessage;
}
if(dojo.lang.isArray(_162)){
for(key in _161){
if(!dojo.lang.inArray(_162,key)){
dojo.lang.assert(false,_163+" "+key);
}
}
}else{
for(key in _161){
if(!(key in _162)){
dojo.lang.assert(false,_163+" "+key);
}
}
}
};
dojo.provide("dojo.lang.func");
dojo.lang.hitch=function(_165,_166){
var fcn=(dojo.lang.isString(_166)?_165[_166]:_166)||function(){
};
return function(){
return fcn.apply(_165,arguments);
};
};
dojo.lang.anonCtr=0;
dojo.lang.anon={};
dojo.lang.nameAnonFunc=function(_168,_169,_16a){
var nso=(_169||dojo.lang.anon);
if((_16a)||((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"]==true))){
for(var x in nso){
try{
if(nso[x]===_168){
return x;
}
}
catch(e){
}
}
}
var ret="__"+dojo.lang.anonCtr++;
while(typeof nso[ret]!="undefined"){
ret="__"+dojo.lang.anonCtr++;
}
nso[ret]=_168;
return ret;
};
dojo.lang.forward=function(_16e){
return function(){
return this[_16e].apply(this,arguments);
};
};
dojo.lang.curry=function(ns,func){
var _171=[];
ns=ns||dj_global;
if(dojo.lang.isString(func)){
func=ns[func];
}
for(var x=2;x<arguments.length;x++){
_171.push(arguments[x]);
}
var _173=(func["__preJoinArity"]||func.length)-_171.length;
function gather(_174,_175,_176){
var _177=_176;
var _178=_175.slice(0);
for(var x=0;x<_174.length;x++){
_178.push(_174[x]);
}
_176=_176-_174.length;
if(_176<=0){
var res=func.apply(ns,_178);
_176=_177;
return res;
}else{
return function(){
return gather(arguments,_178,_176);
};
}
}
return gather([],_171,_173);
};
dojo.lang.curryArguments=function(ns,func,args,_17e){
var _17f=[];
var x=_17e||0;
for(x=_17e;x<args.length;x++){
_17f.push(args[x]);
}
return dojo.lang.curry.apply(dojo.lang,[ns,func].concat(_17f));
};
dojo.lang.tryThese=function(){
for(var x=0;x<arguments.length;x++){
try{
if(typeof arguments[x]=="function"){
var ret=(arguments[x]());
if(ret){
return ret;
}
}
}
catch(e){
dojo.debug(e);
}
}
};
dojo.lang.delayThese=function(farr,cb,_185,_186){
if(!farr.length){
if(typeof _186=="function"){
_186();
}
return;
}
if((typeof _185=="undefined")&&(typeof cb=="number")){
_185=cb;
cb=function(){
};
}else{
if(!cb){
cb=function(){
};
if(!_185){
_185=0;
}
}
}
setTimeout(function(){
(farr.shift())();
cb();
dojo.lang.delayThese(farr,cb,_185,_186);
},_185);
};
dojo.provide("dojo.lang.extras");
dojo.lang.setTimeout=function(func,_188){
var _189=window,_18a=2;
if(!dojo.lang.isFunction(func)){
_189=func;
func=_188;
_188=arguments[2];
_18a++;
}
if(dojo.lang.isString(func)){
func=_189[func];
}
var args=[];
for(var i=_18a;i<arguments.length;i++){
args.push(arguments[i]);
}
return dojo.global().setTimeout(function(){
func.apply(_189,args);
},_188);
};
dojo.lang.clearTimeout=function(_18d){
dojo.global().clearTimeout(_18d);
};
dojo.lang.getNameInObj=function(ns,item){
if(!ns){
ns=dj_global;
}
for(var x in ns){
if(ns[x]===item){
return new String(x);
}
}
return null;
};
dojo.lang.shallowCopy=function(obj,deep){
var i,ret;
if(obj===null){
return null;
}
if(dojo.lang.isObject(obj)){
ret=new obj.constructor();
for(i in obj){
if(dojo.lang.isUndefined(ret[i])){
ret[i]=deep?dojo.lang.shallowCopy(obj[i],deep):obj[i];
}
}
}else{
if(dojo.lang.isArray(obj)){
ret=[];
for(i=0;i<obj.length;i++){
ret[i]=deep?dojo.lang.shallowCopy(obj[i],deep):obj[i];
}
}else{
ret=obj;
}
}
return ret;
};
dojo.lang.firstValued=function(){
for(var i=0;i<arguments.length;i++){
if(typeof arguments[i]!="undefined"){
return arguments[i];
}
}
return undefined;
};
dojo.lang.getObjPathValue=function(_196,_197,_198){
with(dojo.parseObjPath(_196,_197,_198)){
return dojo.evalProp(prop,obj,_198);
}
};
dojo.lang.setObjPathValue=function(_199,_19a,_19b,_19c){
if(arguments.length<4){
_19c=true;
}
with(dojo.parseObjPath(_199,_19b,_19c)){
if(obj&&(_19c||(prop in obj))){
obj[prop]=_19a;
}
}
};
dojo.provide("dojo.AdapterRegistry");
dojo.AdapterRegistry=function(_19d){
this.pairs=[];
this.returnWrappers=_19d||false;
};
dojo.lang.extend(dojo.AdapterRegistry,{register:function(name,_19f,wrap,_1a1,_1a2){
var type=(_1a2)?"unshift":"push";
this.pairs[type]([name,_19f,wrap,_1a1]);
},match:function(){
for(var i=0;i<this.pairs.length;i++){
var pair=this.pairs[i];
if(pair[1].apply(this,arguments)){
if((pair[3])||(this.returnWrappers)){
return pair[2];
}else{
return pair[2].apply(this,arguments);
}
}
}
throw new Error("No match found");
},unregister:function(name){
for(var i=0;i<this.pairs.length;i++){
var pair=this.pairs[i];
if(pair[0]==name){
this.pairs.splice(i,1);
return true;
}
}
return false;
}});
dojo.provide("dojo.string.common");
dojo.string.trim=function(str,wh){
if(!str.replace){
return str;
}
if(!str.length){
return str;
}
var re=(wh>0)?(/^\s+/):(wh<0)?(/\s+$/):(/^\s+|\s+$/g);
return str.replace(re,"");
};
dojo.string.trimStart=function(str){
return dojo.string.trim(str,1);
};
dojo.string.trimEnd=function(str){
return dojo.string.trim(str,-1);
};
dojo.string.repeat=function(str,_1af,_1b0){
var out="";
for(var i=0;i<_1af;i++){
out+=str;
if(_1b0&&i<_1af-1){
out+=_1b0;
}
}
return out;
};
dojo.string.pad=function(str,len,c,dir){
var out=String(str);
if(!c){
c="0";
}
if(!dir){
dir=1;
}
while(out.length<len){
if(dir>0){
out=c+out;
}else{
out+=c;
}
}
return out;
};
dojo.string.padLeft=function(str,len,c){
return dojo.string.pad(str,len,c,1);
};
dojo.string.padRight=function(str,len,c){
return dojo.string.pad(str,len,c,-1);
};
dojo.provide("dojo.string.extras");
dojo.string.substituteParams=function(_1be,hash){
var map=(typeof hash=="object")?hash:dojo.lang.toArray(arguments,1);
return _1be.replace(/\%\{(\w+)\}/g,function(_1c1,key){
if(typeof (map[key])!="undefined"&&map[key]!=null){
return map[key];
}
dojo.raise("Substitution not found: "+key);
});
};
dojo.string.capitalize=function(str){
if(!dojo.lang.isString(str)){
return "";
}
if(arguments.length==0){
str=this;
}
var _1c4=str.split(" ");
for(var i=0;i<_1c4.length;i++){
_1c4[i]=_1c4[i].charAt(0).toUpperCase()+_1c4[i].substring(1);
}
return _1c4.join(" ");
};
dojo.string.isBlank=function(str){
if(!dojo.lang.isString(str)){
return true;
}
return (dojo.string.trim(str).length==0);
};
dojo.string.encodeAscii=function(str){
if(!dojo.lang.isString(str)){
return str;
}
var ret="";
var _1c9=escape(str);
var _1ca,re=/%u([0-9A-F]{4})/i;
while((_1ca=_1c9.match(re))){
var num=Number("0x"+_1ca[1]);
var _1cd=escape("&#"+num+";");
ret+=_1c9.substring(0,_1ca.index)+_1cd;
_1c9=_1c9.substring(_1ca.index+_1ca[0].length);
}
ret+=_1c9.replace(/\+/g,"%2B");
return ret;
};
dojo.string.escape=function(type,str){
var args=dojo.lang.toArray(arguments,1);
switch(type.toLowerCase()){
case "xml":
case "html":
case "xhtml":
return dojo.string.escapeXml.apply(this,args);
case "sql":
return dojo.string.escapeSql.apply(this,args);
case "regexp":
case "regex":
return dojo.string.escapeRegExp.apply(this,args);
case "javascript":
case "jscript":
case "js":
return dojo.string.escapeJavaScript.apply(this,args);
case "ascii":
return dojo.string.encodeAscii.apply(this,args);
default:
return str;
}
};
dojo.string.escapeXml=function(str,_1d2){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_1d2){
str=str.replace(/'/gm,"&#39;");
}
return str;
};
dojo.string.escapeSql=function(str){
return str.replace(/'/gm,"''");
};
dojo.string.escapeRegExp=function(str){
return str.replace(/\\/gm,"\\\\").replace(/([\f\b\n\t\r[\^$|?*+(){}])/gm,"\\$1");
};
dojo.string.escapeJavaScript=function(str){
return str.replace(/(["'\f\b\n\t\r])/gm,"\\$1");
};
dojo.string.escapeString=function(str){
return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");
};
dojo.string.summary=function(str,len){
if(!len||str.length<=len){
return str;
}
return str.substring(0,len).replace(/\.+$/,"")+"...";
};
dojo.string.endsWith=function(str,end,_1db){
if(_1db){
str=str.toLowerCase();
end=end.toLowerCase();
}
if((str.length-end.length)<0){
return false;
}
return str.lastIndexOf(end)==str.length-end.length;
};
dojo.string.endsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.endsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.startsWith=function(str,_1df,_1e0){
if(_1e0){
str=str.toLowerCase();
_1df=_1df.toLowerCase();
}
return str.indexOf(_1df)==0;
};
dojo.string.startsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.startsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.has=function(str){
for(var i=1;i<arguments.length;i++){
if(str.indexOf(arguments[i])>-1){
return true;
}
}
return false;
};
dojo.string.normalizeNewlines=function(text,_1e6){
if(_1e6=="\n"){
text=text.replace(/\r\n/g,"\n");
text=text.replace(/\r/g,"\n");
}else{
if(_1e6=="\r"){
text=text.replace(/\r\n/g,"\r");
text=text.replace(/\n/g,"\r");
}else{
text=text.replace(/([^\r])\n/g,"$1\r\n").replace(/\r([^\n])/g,"\r\n$1");
}
}
return text;
};
dojo.string.splitEscaped=function(str,_1e8){
var _1e9=[];
for(var i=0,_1eb=0;i<str.length;i++){
if(str.charAt(i)=="\\"){
i++;
continue;
}
if(str.charAt(i)==_1e8){
_1e9.push(str.substring(_1eb,i));
_1eb=i+1;
}
}
_1e9.push(str.substr(_1eb));
return _1e9;
};
dojo.provide("dojo.lang.repr");
dojo.lang.reprRegistry=new dojo.AdapterRegistry();
dojo.lang.registerRepr=function(name,_1ed,wrap,_1ef){
dojo.lang.reprRegistry.register(name,_1ed,wrap,_1ef);
};
dojo.lang.repr=function(obj){
if(typeof (obj)=="undefined"){
return "undefined";
}else{
if(obj===null){
return "null";
}
}
try{
if(typeof (obj["__repr__"])=="function"){
return obj["__repr__"]();
}else{
if((typeof (obj["repr"])=="function")&&(obj.repr!=arguments.callee)){
return obj["repr"]();
}
}
return dojo.lang.reprRegistry.match(obj);
}
catch(e){
if(typeof (obj.NAME)=="string"&&(obj.toString==Function.prototype.toString||obj.toString==Object.prototype.toString)){
return obj.NAME;
}
}
if(typeof (obj)=="function"){
obj=(obj+"").replace(/^\s+/,"");
var idx=obj.indexOf("{");
if(idx!=-1){
obj=obj.substr(0,idx)+"{...}";
}
}
return obj+"";
};
dojo.lang.reprArrayLike=function(arr){
try{
var na=dojo.lang.map(arr,dojo.lang.repr);
return "["+na.join(", ")+"]";
}
catch(e){
}
};
(function(){
var m=dojo.lang;
m.registerRepr("arrayLike",m.isArrayLike,m.reprArrayLike);
m.registerRepr("string",m.isString,m.reprString);
m.registerRepr("numbers",m.isNumber,m.reprNumber);
m.registerRepr("boolean",m.isBoolean,m.reprNumber);
})();
dojo.provide("dojo.lang.declare");
dojo.lang.declare=function(_1f5,_1f6,init,_1f8){
if((dojo.lang.isFunction(_1f8))||((!_1f8)&&(!dojo.lang.isFunction(init)))){
var temp=_1f8;
_1f8=init;
init=temp;
}
var _1fa=[];
if(dojo.lang.isArray(_1f6)){
_1fa=_1f6;
_1f6=_1fa.shift();
}
if(!init){
init=dojo.evalObjPath(_1f5,false);
if((init)&&(!dojo.lang.isFunction(init))){
init=null;
}
}
var ctor=dojo.lang.declare._makeConstructor();
var scp=(_1f6?_1f6.prototype:null);
if(scp){
scp.prototyping=true;
ctor.prototype=new _1f6();
scp.prototyping=false;
}
ctor.superclass=scp;
ctor.mixins=_1fa;
for(var i=0,l=_1fa.length;i<l;i++){
dojo.lang.extend(ctor,_1fa[i].prototype);
}
ctor.prototype.initializer=null;
ctor.prototype.declaredClass=_1f5;
if(dojo.lang.isArray(_1f8)){
dojo.lang.extend.apply(dojo.lang,[ctor].concat(_1f8));
}else{
dojo.lang.extend(ctor,(_1f8)||{});
}
dojo.lang.extend(ctor,dojo.lang.declare._common);
ctor.prototype.constructor=ctor;
ctor.prototype.initializer=(ctor.prototype.initializer)||(init)||(function(){
});
dojo.lang.setObjPathValue(_1f5,ctor,null,true);
return ctor;
};
dojo.lang.declare._makeConstructor=function(){
return function(){
var self=this._getPropContext();
var s=self.constructor.superclass;
if((s)&&(s.constructor)){
if(s.constructor==arguments.callee){
this._inherited("constructor",arguments);
}else{
this._contextMethod(s,"constructor",arguments);
}
}
var ms=(self.constructor.mixins)||([]);
for(var i=0,m;(m=ms[i]);i++){
(((m.prototype)&&(m.prototype.initializer))||(m)).apply(this,arguments);
}
if((!this.prototyping)&&(self.initializer)){
self.initializer.apply(this,arguments);
}
};
};
dojo.lang.declare._common={_getPropContext:function(){
return (this.___proto||this);
},_contextMethod:function(_204,_205,args){
var _207,_208=this.___proto;
this.___proto=_204;
try{
_207=_204[_205].apply(this,(args||[]));
}
catch(e){
throw e;
}
finally{
this.___proto=_208;
}
return _207;
},_inherited:function(prop,args){
var p=this._getPropContext();
do{
if((!p.constructor)||(!p.constructor.superclass)){
return;
}
p=p.constructor.superclass;
}while(!(prop in p));
return (dojo.lang.isFunction(p[prop])?this._contextMethod(p,prop,args):p[prop]);
}};
dojo.declare=dojo.lang.declare;
dojo.provide("dojo.lang.*");
dojo.provide("dojo.dom");
dojo.dom.ELEMENT_NODE=1;
dojo.dom.ATTRIBUTE_NODE=2;
dojo.dom.TEXT_NODE=3;
dojo.dom.CDATA_SECTION_NODE=4;
dojo.dom.ENTITY_REFERENCE_NODE=5;
dojo.dom.ENTITY_NODE=6;
dojo.dom.PROCESSING_INSTRUCTION_NODE=7;
dojo.dom.COMMENT_NODE=8;
dojo.dom.DOCUMENT_NODE=9;
dojo.dom.DOCUMENT_TYPE_NODE=10;
dojo.dom.DOCUMENT_FRAGMENT_NODE=11;
dojo.dom.NOTATION_NODE=12;
dojo.dom.dojoml="http://www.dojotoolkit.org/2004/dojoml";
dojo.dom.xmlns={svg:"http://www.w3.org/2000/svg",smil:"http://www.w3.org/2001/SMIL20/",mml:"http://www.w3.org/1998/Math/MathML",cml:"http://www.xml-cml.org",xlink:"http://www.w3.org/1999/xlink",xhtml:"http://www.w3.org/1999/xhtml",xul:"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",xbl:"http://www.mozilla.org/xbl",fo:"http://www.w3.org/1999/XSL/Format",xsl:"http://www.w3.org/1999/XSL/Transform",xslt:"http://www.w3.org/1999/XSL/Transform",xi:"http://www.w3.org/2001/XInclude",xforms:"http://www.w3.org/2002/01/xforms",saxon:"http://icl.com/saxon",xalan:"http://xml.apache.org/xslt",xsd:"http://www.w3.org/2001/XMLSchema",dt:"http://www.w3.org/2001/XMLSchema-datatypes",xsi:"http://www.w3.org/2001/XMLSchema-instance",rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",rdfs:"http://www.w3.org/2000/01/rdf-schema#",dc:"http://purl.org/dc/elements/1.1/",dcq:"http://purl.org/dc/qualifiers/1.0","soap-env":"http://schemas.xmlsoap.org/soap/envelope/",wsdl:"http://schemas.xmlsoap.org/wsdl/",AdobeExtensions:"http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"};
dojo.dom.isNode=function(wh){
if(typeof Element=="function"){
try{
return wh instanceof Element;
}
catch(E){
}
}else{
return wh&&!isNaN(wh.nodeType);
}
};
dojo.dom.getUniqueId=function(){
var _20d=dojo.doc();
do{
var id="dj_unique_"+(++arguments.callee._idIncrement);
}while(_20d.getElementById(id));
return id;
};
dojo.dom.getUniqueId._idIncrement=0;
dojo.dom.firstElement=dojo.dom.getFirstChildElement=function(_20f,_210){
var node=_20f.firstChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.nextSibling;
}
if(_210&&node&&node.tagName&&node.tagName.toLowerCase()!=_210.toLowerCase()){
node=dojo.dom.nextElement(node,_210);
}
return node;
};
dojo.dom.lastElement=dojo.dom.getLastChildElement=function(_212,_213){
var node=_212.lastChild;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.previousSibling;
}
if(_213&&node&&node.tagName&&node.tagName.toLowerCase()!=_213.toLowerCase()){
node=dojo.dom.prevElement(node,_213);
}
return node;
};
dojo.dom.nextElement=dojo.dom.getNextSiblingElement=function(node,_216){
if(!node){
return null;
}
do{
node=node.nextSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
if(node&&_216&&_216.toLowerCase()!=node.tagName.toLowerCase()){
return dojo.dom.nextElement(node,_216);
}
return node;
};
dojo.dom.prevElement=dojo.dom.getPreviousSiblingElement=function(node,_218){
if(!node){
return null;
}
if(_218){
_218=_218.toLowerCase();
}
do{
node=node.previousSibling;
}while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE);
if(node&&_218&&_218.toLowerCase()!=node.tagName.toLowerCase()){
return dojo.dom.prevElement(node,_218);
}
return node;
};
dojo.dom.moveChildren=function(_219,_21a,trim){
var _21c=0;
if(trim){
while(_219.hasChildNodes()&&_219.firstChild.nodeType==dojo.dom.TEXT_NODE){
_219.removeChild(_219.firstChild);
}
while(_219.hasChildNodes()&&_219.lastChild.nodeType==dojo.dom.TEXT_NODE){
_219.removeChild(_219.lastChild);
}
}
while(_219.hasChildNodes()){
_21a.appendChild(_219.firstChild);
_21c++;
}
return _21c;
};
dojo.dom.copyChildren=function(_21d,_21e,trim){
var _220=_21d.cloneNode(true);
return this.moveChildren(_220,_21e,trim);
};
dojo.dom.removeChildren=function(node){
var _222=node.childNodes.length;
while(node.hasChildNodes()){
node.removeChild(node.firstChild);
}
return _222;
};
dojo.dom.replaceChildren=function(node,_224){
dojo.dom.removeChildren(node);
node.appendChild(_224);
};
dojo.dom.removeNode=function(node){
if(node&&node.parentNode){
return node.parentNode.removeChild(node);
}
};
dojo.dom.getAncestors=function(node,_227,_228){
var _229=[];
var _22a=(_227&&(_227 instanceof Function||typeof _227=="function"));
while(node){
if(!_22a||_227(node)){
_229.push(node);
}
if(_228&&_229.length>0){
return _229[0];
}
node=node.parentNode;
}
if(_228){
return null;
}
return _229;
};
dojo.dom.getAncestorsByTag=function(node,tag,_22d){
tag=tag.toLowerCase();
return dojo.dom.getAncestors(node,function(el){
return ((el.tagName)&&(el.tagName.toLowerCase()==tag));
},_22d);
};
dojo.dom.getFirstAncestorByTag=function(node,tag){
return dojo.dom.getAncestorsByTag(node,tag,true);
};
dojo.dom.isDescendantOf=function(node,_232,_233){
if(_233&&node){
node=node.parentNode;
}
while(node){
if(node==_232){
return true;
}
node=node.parentNode;
}
return false;
};
dojo.dom.innerXML=function(node){
if(node.innerXML){
return node.innerXML;
}else{
if(node.xml){
return node.xml;
}else{
if(typeof XMLSerializer!="undefined"){
return (new XMLSerializer()).serializeToString(node);
}
}
}
};
dojo.dom.createDocument=function(){
var doc=null;
var _236=dojo.doc();
if(!dj_undef("ActiveXObject")){
var _237=["MSXML2","Microsoft","MSXML","MSXML3"];
for(var i=0;i<_237.length;i++){
try{
doc=new ActiveXObject(_237[i]+".XMLDOM");
}
catch(e){
}
if(doc){
break;
}
}
}else{
if((_236.implementation)&&(_236.implementation.createDocument)){
doc=_236.implementation.createDocument("","",null);
}
}
return doc;
};
dojo.dom.createDocumentFromText=function(str,_23a){
if(!_23a){
_23a="text/xml";
}
if(!dj_undef("DOMParser")){
var _23b=new DOMParser();
return _23b.parseFromString(str,_23a);
}else{
if(!dj_undef("ActiveXObject")){
var _23c=dojo.dom.createDocument();
if(_23c){
_23c.async=false;
_23c.loadXML(str);
return _23c;
}else{
dojo.debug("toXml didn't work?");
}
}else{
var _23d=dojo.doc();
if(_23d.createElement){
var tmp=_23d.createElement("xml");
tmp.innerHTML=str;
if(_23d.implementation&&_23d.implementation.createDocument){
var _23f=_23d.implementation.createDocument("foo","",null);
for(var i=0;i<tmp.childNodes.length;i++){
_23f.importNode(tmp.childNodes.item(i),true);
}
return _23f;
}
return ((tmp.document)&&(tmp.document.firstChild?tmp.document.firstChild:tmp));
}
}
}
return null;
};
dojo.dom.prependChild=function(node,_242){
if(_242.firstChild){
_242.insertBefore(node,_242.firstChild);
}else{
_242.appendChild(node);
}
return true;
};
dojo.dom.insertBefore=function(node,ref,_245){
if(_245!=true&&(node===ref||node.nextSibling===ref)){
return false;
}
var _246=ref.parentNode;
_246.insertBefore(node,ref);
return true;
};
dojo.dom.insertAfter=function(node,ref,_249){
var pn=ref.parentNode;
if(ref==pn.lastChild){
if((_249!=true)&&(node===ref)){
return false;
}
pn.appendChild(node);
}else{
return this.insertBefore(node,ref.nextSibling,_249);
}
return true;
};
dojo.dom.insertAtPosition=function(node,ref,_24d){
if((!node)||(!ref)||(!_24d)){
return false;
}
switch(_24d.toLowerCase()){
case "before":
return dojo.dom.insertBefore(node,ref);
case "after":
return dojo.dom.insertAfter(node,ref);
case "first":
if(ref.firstChild){
return dojo.dom.insertBefore(node,ref.firstChild);
}else{
ref.appendChild(node);
return true;
}
break;
default:
ref.appendChild(node);
return true;
}
};
dojo.dom.insertAtIndex=function(node,_24f,_250){
var _251=_24f.childNodes;
if(!_251.length){
_24f.appendChild(node);
return true;
}
var _252=null;
for(var i=0;i<_251.length;i++){
var _254=_251.item(i)["getAttribute"]?parseInt(_251.item(i).getAttribute("dojoinsertionindex")):-1;
if(_254<_250){
_252=_251.item(i);
}
}
if(_252){
return dojo.dom.insertAfter(node,_252);
}else{
return dojo.dom.insertBefore(node,_251.item(0));
}
};
dojo.dom.textContent=function(node,text){
if(arguments.length>1){
var _257=dojo.doc();
dojo.dom.replaceChildren(node,_257.createTextNode(text));
return text;
}else{
if(node.textContent!=undefined){
return node.textContent;
}
var _258="";
if(node==null){
return _258;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
_258+=dojo.dom.textContent(node.childNodes[i]);
break;
case 3:
case 2:
case 4:
_258+=node.childNodes[i].nodeValue;
break;
default:
break;
}
}
return _258;
}
};
dojo.dom.hasParent=function(node){
return node&&node.parentNode&&dojo.dom.isNode(node.parentNode);
};
dojo.dom.isTag=function(node){
if(node&&node.tagName){
for(var i=1;i<arguments.length;i++){
if(node.tagName==String(arguments[i])){
return String(arguments[i]);
}
}
}
return "";
};
dojo.dom.setAttributeNS=function(elem,_25e,_25f,_260){
if(elem==null||((elem==undefined)&&(typeof elem=="undefined"))){
dojo.raise("No element given to dojo.dom.setAttributeNS");
}
if(!((elem.setAttributeNS==undefined)&&(typeof elem.setAttributeNS=="undefined"))){
elem.setAttributeNS(_25e,_25f,_260);
}else{
var _261=elem.ownerDocument;
var _262=_261.createNode(2,_25f,_25e);
_262.nodeValue=_260;
elem.setAttributeNode(_262);
}
};
dojo.provide("dojo.xml.Parse");
dojo.xml.Parse=function(){
function getTagName(node){
return ((node)&&(node.tagName)?node.tagName.toLowerCase():"");
}
function getDojoTagName(node){
var _265=getTagName(node);
if(!_265){
return "";
}
if((dojo.widget)&&(dojo.widget.tags[_265])){
return _265;
}
var p=_265.indexOf(":");
if(p>=0){
return _265;
}
if(_265.substr(0,5)=="dojo:"){
return _265;
}
if(dojo.render.html.capable&&dojo.render.html.ie&&node.scopeName!="HTML"){
return node.scopeName.toLowerCase()+":"+_265;
}
if(_265.substr(0,4)=="dojo"){
return "dojo:"+_265.substring(4);
}
var djt=node.getAttribute("dojoType")||node.getAttribute("dojotype");
if(djt){
if(djt.indexOf(":")<0){
djt="dojo:"+djt;
}
return djt.toLowerCase();
}
djt=node.getAttributeNS&&node.getAttributeNS(dojo.dom.dojoml,"type");
if(djt){
return "dojo:"+djt.toLowerCase();
}
try{
djt=node.getAttribute("dojo:type");
}
catch(e){
}
if(djt){
return "dojo:"+djt.toLowerCase();
}
if((!dj_global["djConfig"])||(djConfig["ignoreClassNames"])){
var _268=node.className||node.getAttribute("class");
if((_268)&&(_268.indexOf)&&(_268.indexOf("dojo-")!=-1)){
var _269=_268.split(" ");
for(var x=0,c=_269.length;x<c;x++){
if(_269[x].slice(0,5)=="dojo-"){
return "dojo:"+_269[x].substr(5).toLowerCase();
}
}
}
}
return "";
}
this.parseElement=function(node,_26d,_26e,_26f){
var _270={};
var _271=getTagName(node);
if((_271)&&(_271.indexOf("/")==0)){
return null;
}
var _272=true;
if(_26e){
var _273=getDojoTagName(node);
_271=_273||_271;
_272=Boolean(_273);
}
if(node&&node.getAttribute&&node.getAttribute("parseWidgets")&&node.getAttribute("parseWidgets")=="false"){
return {};
}
_270[_271]=[];
var pos=_271.indexOf(":");
if(pos>0){
var ns=_271.substring(0,pos);
_270["ns"]=ns;
if((dojo.ns)&&(!dojo.ns.allow(ns))){
_272=false;
}
}
if(_272){
var _276=this.parseAttributes(node);
for(var attr in _276){
if((!_270[_271][attr])||(typeof _270[_271][attr]!="array")){
_270[_271][attr]=[];
}
_270[_271][attr].push(_276[attr]);
}
_270[_271].nodeRef=node;
_270.tagName=_271;
_270.index=_26f||0;
}
var _278=0;
for(var i=0;i<node.childNodes.length;i++){
var tcn=node.childNodes.item(i);
switch(tcn.nodeType){
case dojo.dom.ELEMENT_NODE:
_278++;
var ctn=getDojoTagName(tcn)||getTagName(tcn);
if(!_270[ctn]){
_270[ctn]=[];
}
_270[ctn].push(this.parseElement(tcn,true,_26e,_278));
if((tcn.childNodes.length==1)&&(tcn.childNodes.item(0).nodeType==dojo.dom.TEXT_NODE)){
_270[ctn][_270[ctn].length-1].value=tcn.childNodes.item(0).nodeValue;
}
break;
case dojo.dom.TEXT_NODE:
if(node.childNodes.length==1){
_270[_271].push({value:node.childNodes.item(0).nodeValue});
}
break;
default:
break;
}
}
return _270;
};
this.parseAttributes=function(node){
var _27d={};
var atts=node.attributes;
var _27f,i=0;
while((_27f=atts[i++])){
if((dojo.render.html.capable)&&(dojo.render.html.ie)){
if(!_27f){
continue;
}
if((typeof _27f=="object")&&(typeof _27f.nodeValue=="undefined")||(_27f.nodeValue==null)||(_27f.nodeValue=="")){
continue;
}
}
var nn=_27f.nodeName.split(":");
nn=(nn.length==2)?nn[1]:_27f.nodeName;
_27d[nn]={value:_27f.nodeValue};
}
return _27d;
};
};
dojo.provide("dojo.ns");
dojo.ns={namespaces:{},failed:{},loading:{},loaded:{},register:function(name,_283,_284,_285){
if(!_285||!this.namespaces[name]){
this.namespaces[name]=new dojo.ns.Ns(name,_283,_284);
}
},allow:function(name){
if(this.failed[name]){
return false;
}
if((djConfig.excludeNamespace)&&(dojo.lang.inArray(djConfig.excludeNamespace,name))){
return false;
}
return ((name==this.dojo)||(!djConfig.includeNamespace)||(dojo.lang.inArray(djConfig.includeNamespace,name)));
},get:function(name){
return this.namespaces[name];
},require:function(name){
var ns=this.namespaces[name];
if((ns)&&(this.loaded[name])){
return ns;
}
if(!this.allow(name)){
return false;
}
if(this.loading[name]){
dojo.debug("dojo.namespace.require: re-entrant request to load namespace \""+name+"\" must fail.");
return false;
}
var req=dojo.require;
this.loading[name]=true;
try{
if(name=="dojo"){
req("dojo.namespaces.dojo");
}else{
if(!dojo.hostenv.moduleHasPrefix(name)){
dojo.registerModulePath(name,"../"+name);
}
req([name,"manifest"].join("."),false,true);
}
if(!this.namespaces[name]){
this.failed[name]=true;
}
}
finally{
this.loading[name]=false;
}
return this.namespaces[name];
}};
dojo.ns.Ns=function(name,_28c,_28d){
this.name=name;
this.module=_28c;
this.resolver=_28d;
this._loaded=[];
this._failed=[];
};
dojo.ns.Ns.prototype.resolve=function(name,_28f,_290){
if(!this.resolver||djConfig["skipAutoRequire"]){
return false;
}
var _291=this.resolver(name,_28f);
if((_291)&&(!this._loaded[_291])&&(!this._failed[_291])){
var req=dojo.require;
req(_291,false,true);
if(dojo.hostenv.findModule(_291,false)){
this._loaded[_291]=true;
}else{
if(!_290){
dojo.raise("dojo.ns.Ns.resolve: module '"+_291+"' not found after loading via namespace '"+this.name+"'");
}
this._failed[_291]=true;
}
}
return Boolean(this._loaded[_291]);
};
dojo.registerNamespace=function(name,_294,_295){
dojo.ns.register.apply(dojo.ns,arguments);
};
dojo.registerNamespaceResolver=function(name,_297){
var n=dojo.ns.namespaces[name];
if(n){
n.resolver=_297;
}
};
dojo.registerNamespaceManifest=function(_299,path,name,_29c,_29d){
dojo.registerModulePath(name,path);
dojo.registerNamespace(name,_29c,_29d);
};
dojo.registerNamespace("dojo","dojo.widget");
dojo.provide("dojo.event.common");
dojo.event=new function(){
this._canTimeout=dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);
function interpolateArgs(args,_29f){
var dl=dojo.lang;
var ao={srcObj:dj_global,srcFunc:null,adviceObj:dj_global,adviceFunc:null,aroundObj:null,aroundFunc:null,adviceType:(args.length>2)?args[0]:"after",precedence:"last",once:false,delay:null,rate:0,adviceMsg:false};
switch(args.length){
case 0:
return;
case 1:
return;
case 2:
ao.srcFunc=args[0];
ao.adviceFunc=args[1];
break;
case 3:
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isFunction(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
var _2a2=dl.nameAnonFunc(args[2],ao.adviceObj,_29f);
ao.adviceFunc=_2a2;
}else{
if((dl.isFunction(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=dj_global;
var _2a2=dl.nameAnonFunc(args[0],ao.srcObj,_29f);
ao.srcFunc=_2a2;
ao.adviceObj=args[1];
ao.adviceFunc=args[2];
}
}
}
}
break;
case 4:
if((dl.isObject(args[0]))&&(dl.isObject(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isString(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isFunction(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
var _2a2=dl.nameAnonFunc(args[1],dj_global,_29f);
ao.srcFunc=_2a2;
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))&&(dl.isFunction(args[3]))){
ao.srcObj=args[1];
ao.srcFunc=args[2];
var _2a2=dl.nameAnonFunc(args[3],dj_global,_29f);
ao.adviceObj=dj_global;
ao.adviceFunc=_2a2;
}else{
if(dl.isObject(args[1])){
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=dj_global;
ao.adviceFunc=args[3];
}else{
if(dl.isObject(args[2])){
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
ao.srcObj=ao.adviceObj=ao.aroundObj=dj_global;
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
ao.aroundFunc=args[3];
}
}
}
}
}
}
break;
case 6:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundFunc=args[5];
ao.aroundObj=dj_global;
break;
default:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundObj=args[5];
ao.aroundFunc=args[6];
ao.once=args[7];
ao.delay=args[8];
ao.rate=args[9];
ao.adviceMsg=args[10];
break;
}
if(dl.isFunction(ao.aroundFunc)){
var _2a2=dl.nameAnonFunc(ao.aroundFunc,ao.aroundObj,_29f);
ao.aroundFunc=_2a2;
}
if(dl.isFunction(ao.srcFunc)){
ao.srcFunc=dl.getNameInObj(ao.srcObj,ao.srcFunc);
}
if(dl.isFunction(ao.adviceFunc)){
ao.adviceFunc=dl.getNameInObj(ao.adviceObj,ao.adviceFunc);
}
if((ao.aroundObj)&&(dl.isFunction(ao.aroundFunc))){
ao.aroundFunc=dl.getNameInObj(ao.aroundObj,ao.aroundFunc);
}
if(!ao.srcObj){
dojo.raise("bad srcObj for srcFunc: "+ao.srcFunc);
}
if(!ao.adviceObj){
dojo.raise("bad adviceObj for adviceFunc: "+ao.adviceFunc);
}
if(!ao.adviceFunc){
dojo.debug("bad adviceFunc for srcFunc: "+ao.srcFunc);
dojo.debugShallow(ao);
}
return ao;
}
this.connect=function(){
if(arguments.length==1){
var ao=arguments[0];
}else{
var ao=interpolateArgs(arguments,true);
}
if(dojo.lang.isString(ao.srcFunc)&&(ao.srcFunc.toLowerCase()=="onkey")){
if(dojo.render.html.ie){
ao.srcFunc="onkeydown";
this.connect(ao);
}
ao.srcFunc="onkeypress";
}
if(dojo.lang.isArray(ao.srcObj)&&ao.srcObj!=""){
var _2a4={};
for(var x in ao){
_2a4[x]=ao[x];
}
var mjps=[];
dojo.lang.forEach(ao.srcObj,function(src){
if((dojo.render.html.capable)&&(dojo.lang.isString(src))){
src=dojo.byId(src);
}
_2a4.srcObj=src;
mjps.push(dojo.event.connect.call(dojo.event,_2a4));
});
return mjps;
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
if(ao.adviceFunc){
var mjp2=dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj,ao.adviceFunc);
}
mjp.kwAddAdvice(ao);
return mjp;
};
this.log=function(a1,a2){
var _2ac;
if((arguments.length==1)&&(typeof a1=="object")){
_2ac=a1;
}else{
_2ac={srcObj:a1,srcFunc:a2};
}
_2ac.adviceFunc=function(){
var _2ad=[];
for(var x=0;x<arguments.length;x++){
_2ad.push(arguments[x]);
}
dojo.debug("("+_2ac.srcObj+")."+_2ac.srcFunc,":",_2ad.join(", "));
};
this.kwConnect(_2ac);
};
this.connectBefore=function(){
var args=["before"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this.connectAround=function(){
var args=["around"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this.connectOnce=function(){
var ao=interpolateArgs(arguments,true);
ao.once=true;
return this.connect(ao);
};
this._kwConnectImpl=function(_2b4,_2b5){
var fn=(_2b5)?"disconnect":"connect";
if(typeof _2b4["srcFunc"]=="function"){
_2b4.srcObj=_2b4["srcObj"]||dj_global;
var _2b7=dojo.lang.nameAnonFunc(_2b4.srcFunc,_2b4.srcObj,true);
_2b4.srcFunc=_2b7;
}
if(typeof _2b4["adviceFunc"]=="function"){
_2b4.adviceObj=_2b4["adviceObj"]||dj_global;
var _2b7=dojo.lang.nameAnonFunc(_2b4.adviceFunc,_2b4.adviceObj,true);
_2b4.adviceFunc=_2b7;
}
_2b4.srcObj=_2b4["srcObj"]||dj_global;
_2b4.adviceObj=_2b4["adviceObj"]||_2b4["targetObj"]||dj_global;
_2b4.adviceFunc=_2b4["adviceFunc"]||_2b4["targetFunc"];
return dojo.event[fn](_2b4);
};
this.kwConnect=function(_2b8){
return this._kwConnectImpl(_2b8,false);
};
this.disconnect=function(){
if(arguments.length==1){
var ao=arguments[0];
}else{
var ao=interpolateArgs(arguments,true);
}
if(!ao.adviceFunc){
return;
}
if(dojo.lang.isString(ao.srcFunc)&&(ao.srcFunc.toLowerCase()=="onkey")){
if(dojo.render.html.ie){
ao.srcFunc="onkeydown";
this.disconnect(ao);
}
ao.srcFunc="onkeypress";
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
return mjp.removeAdvice(ao.adviceObj,ao.adviceFunc,ao.adviceType,ao.once);
};
this.kwDisconnect=function(_2bb){
return this._kwConnectImpl(_2bb,true);
};
};
dojo.event.MethodInvocation=function(_2bc,obj,args){
this.jp_=_2bc;
this.object=obj;
this.args=[];
for(var x=0;x<args.length;x++){
this.args[x]=args[x];
}
this.around_index=-1;
};
dojo.event.MethodInvocation.prototype.proceed=function(){
this.around_index++;
if(this.around_index>=this.jp_.around.length){
return this.jp_.object[this.jp_.methodname].apply(this.jp_.object,this.args);
}else{
var ti=this.jp_.around[this.around_index];
var mobj=ti[0]||dj_global;
var meth=ti[1];
return mobj[meth].call(mobj,this);
}
};
dojo.event.MethodJoinPoint=function(obj,_2c4){
this.object=obj||dj_global;
this.methodname=_2c4;
this.methodfunc=this.object[_2c4];
this.squelch=false;
};
dojo.event.MethodJoinPoint.getForMethod=function(obj,_2c6){
if(!obj){
obj=dj_global;
}
if(!obj[_2c6]){
obj[_2c6]=function(){
};
if(!obj[_2c6]){
dojo.raise("Cannot set do-nothing method on that object "+_2c6);
}
}else{
if((!dojo.lang.isFunction(obj[_2c6]))&&(!dojo.lang.isAlien(obj[_2c6]))){
return null;
}
}
var _2c7=_2c6+"$joinpoint";
var _2c8=_2c6+"$joinpoint$method";
var _2c9=obj[_2c7];
if(!_2c9){
var _2ca=false;
if(dojo.event["browser"]){
if((obj["attachEvent"])||(obj["nodeType"])||(obj["addEventListener"])){
_2ca=true;
dojo.event.browser.addClobberNodeAttrs(obj,[_2c7,_2c8,_2c6]);
}
}
var _2cb=obj[_2c6].length;
obj[_2c8]=obj[_2c6];
_2c9=obj[_2c7]=new dojo.event.MethodJoinPoint(obj,_2c8);
obj[_2c6]=function(){
var args=[];
if((_2ca)&&(!arguments.length)){
var evt=null;
try{
if(obj.ownerDocument){
evt=obj.ownerDocument.parentWindow.event;
}else{
if(obj.documentElement){
evt=obj.documentElement.ownerDocument.parentWindow.event;
}else{
if(obj.event){
evt=obj.event;
}else{
evt=window.event;
}
}
}
}
catch(e){
evt=window.event;
}
if(evt){
args.push(dojo.event.browser.fixEvent(evt,this));
}
}else{
for(var x=0;x<arguments.length;x++){
if((x==0)&&(_2ca)&&(dojo.event.browser.isEvent(arguments[x]))){
args.push(dojo.event.browser.fixEvent(arguments[x],this));
}else{
args.push(arguments[x]);
}
}
}
return _2c9.run.apply(_2c9,args);
};
obj[_2c6].__preJoinArity=_2cb;
}
return _2c9;
};
dojo.lang.extend(dojo.event.MethodJoinPoint,{unintercept:function(){
this.object[this.methodname]=this.methodfunc;
this.before=[];
this.after=[];
this.around=[];
},disconnect:dojo.lang.forward("unintercept"),run:function(){
var obj=this.object||dj_global;
var args=arguments;
var _2d1=[];
for(var x=0;x<args.length;x++){
_2d1[x]=args[x];
}
var _2d3=function(marr){
if(!marr){
dojo.debug("Null argument to unrollAdvice()");
return;
}
var _2d5=marr[0]||dj_global;
var _2d6=marr[1];
if(!_2d5[_2d6]){
dojo.raise("function \""+_2d6+"\" does not exist on \""+_2d5+"\"");
}
var _2d7=marr[2]||dj_global;
var _2d8=marr[3];
var msg=marr[6];
var _2da;
var to={args:[],jp_:this,object:obj,proceed:function(){
return _2d5[_2d6].apply(_2d5,to.args);
}};
to.args=_2d1;
var _2dc=parseInt(marr[4]);
var _2dd=((!isNaN(_2dc))&&(marr[4]!==null)&&(typeof marr[4]!="undefined"));
if(marr[5]){
var rate=parseInt(marr[5]);
var cur=new Date();
var _2e0=false;
if((marr["last"])&&((cur-marr.last)<=rate)){
if(dojo.event._canTimeout){
if(marr["delayTimer"]){
clearTimeout(marr.delayTimer);
}
var tod=parseInt(rate*2);
var mcpy=dojo.lang.shallowCopy(marr);
marr.delayTimer=setTimeout(function(){
mcpy[5]=0;
_2d3(mcpy);
},tod);
}
return;
}else{
marr.last=cur;
}
}
if(_2d8){
_2d7[_2d8].call(_2d7,to);
}else{
if((_2dd)&&((dojo.render.html)||(dojo.render.svg))){
dj_global["setTimeout"](function(){
if(msg){
_2d5[_2d6].call(_2d5,to);
}else{
_2d5[_2d6].apply(_2d5,args);
}
},_2dc);
}else{
if(msg){
_2d5[_2d6].call(_2d5,to);
}else{
_2d5[_2d6].apply(_2d5,args);
}
}
}
};
var _2e3=function(){
if(this.squelch){
try{
return _2d3.apply(this,arguments);
}
catch(e){
dojo.debug(e);
}
}else{
return _2d3.apply(this,arguments);
}
};
if((this["before"])&&(this.before.length>0)){
dojo.lang.forEach(this.before.concat(new Array()),_2e3);
}
var _2e4;
try{
if((this["around"])&&(this.around.length>0)){
var mi=new dojo.event.MethodInvocation(this,obj,args);
_2e4=mi.proceed();
}else{
if(this.methodfunc){
_2e4=this.object[this.methodname].apply(this.object,args);
}
}
}
catch(e){
if(!this.squelch){
dojo.raise(e);
}
}
if((this["after"])&&(this.after.length>0)){
dojo.lang.forEach(this.after.concat(new Array()),_2e3);
}
return (this.methodfunc)?_2e4:null;
},getArr:function(kind){
var type="after";
if((typeof kind=="string")&&(kind.indexOf("before")!=-1)){
type="before";
}else{
if(kind=="around"){
type="around";
}
}
if(!this[type]){
this[type]=[];
}
return this[type];
},kwAddAdvice:function(args){
this.addAdvice(args["adviceObj"],args["adviceFunc"],args["aroundObj"],args["aroundFunc"],args["adviceType"],args["precedence"],args["once"],args["delay"],args["rate"],args["adviceMsg"]);
},addAdvice:function(_2e9,_2ea,_2eb,_2ec,_2ed,_2ee,once,_2f0,rate,_2f2){
var arr=this.getArr(_2ed);
if(!arr){
dojo.raise("bad this: "+this);
}
var ao=[_2e9,_2ea,_2eb,_2ec,_2f0,rate,_2f2];
if(once){
if(this.hasAdvice(_2e9,_2ea,_2ed,arr)>=0){
return;
}
}
if(_2ee=="first"){
arr.unshift(ao);
}else{
arr.push(ao);
}
},hasAdvice:function(_2f5,_2f6,_2f7,arr){
if(!arr){
arr=this.getArr(_2f7);
}
var ind=-1;
for(var x=0;x<arr.length;x++){
var aao=(typeof _2f6=="object")?(new String(_2f6)).toString():_2f6;
var a1o=(typeof arr[x][1]=="object")?(new String(arr[x][1])).toString():arr[x][1];
if((arr[x][0]==_2f5)&&(a1o==aao)){
ind=x;
}
}
return ind;
},removeAdvice:function(_2fd,_2fe,_2ff,once){
var arr=this.getArr(_2ff);
var ind=this.hasAdvice(_2fd,_2fe,_2ff,arr);
if(ind==-1){
return false;
}
while(ind!=-1){
arr.splice(ind,1);
if(once){
break;
}
ind=this.hasAdvice(_2fd,_2fe,_2ff,arr);
}
return true;
}});
dojo.provide("dojo.event.topic");
dojo.event.topic=new function(){
this.topics={};
this.getTopic=function(_303){
if(!this.topics[_303]){
this.topics[_303]=new this.TopicImpl(_303);
}
return this.topics[_303];
};
this.registerPublisher=function(_304,obj,_306){
var _304=this.getTopic(_304);
_304.registerPublisher(obj,_306);
};
this.subscribe=function(_307,obj,_309){
var _307=this.getTopic(_307);
_307.subscribe(obj,_309);
};
this.unsubscribe=function(_30a,obj,_30c){
var _30a=this.getTopic(_30a);
_30a.unsubscribe(obj,_30c);
};
this.destroy=function(_30d){
this.getTopic(_30d).destroy();
delete this.topics[_30d];
};
this.publishApply=function(_30e,args){
var _30e=this.getTopic(_30e);
_30e.sendMessage.apply(_30e,args);
};
this.publish=function(_310,_311){
var _310=this.getTopic(_310);
var args=[];
for(var x=1;x<arguments.length;x++){
args.push(arguments[x]);
}
_310.sendMessage.apply(_310,args);
};
};
dojo.event.topic.TopicImpl=function(_314){
this.topicName=_314;
this.subscribe=function(_315,_316){
var tf=_316||_315;
var to=(!_316)?dj_global:_315;
return dojo.event.kwConnect({srcObj:this,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
this.unsubscribe=function(_319,_31a){
var tf=(!_31a)?_319:_31a;
var to=(!_31a)?null:_319;
return dojo.event.kwDisconnect({srcObj:this,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
this._getJoinPoint=function(){
return dojo.event.MethodJoinPoint.getForMethod(this,"sendMessage");
};
this.setSquelch=function(_31d){
this._getJoinPoint().squelch=_31d;
};
this.destroy=function(){
this._getJoinPoint().disconnect();
};
this.registerPublisher=function(_31e,_31f){
dojo.event.connect(_31e,_31f,this,"sendMessage");
};
this.sendMessage=function(_320){
};
};
dojo.provide("dojo.event.browser");
dojo._ie_clobber=new function(){
this.clobberNodes=[];
function nukeProp(node,prop){
try{
node[prop]=null;
}
catch(e){
}
try{
delete node[prop];
}
catch(e){
}
try{
node.removeAttribute(prop);
}
catch(e){
}
}
this.clobber=function(_323){
var na;
var tna;
if(_323){
tna=_323.all||_323.getElementsByTagName("*");
na=[_323];
for(var x=0;x<tna.length;x++){
if(tna[x]["__doClobber__"]){
na.push(tna[x]);
}
}
}else{
try{
window.onload=null;
}
catch(e){
}
na=(this.clobberNodes.length)?this.clobberNodes:document.all;
}
tna=null;
var _327={};
for(var i=na.length-1;i>=0;i=i-1){
var el=na[i];
try{
if(el&&el["__clobberAttrs__"]){
for(var j=0;j<el.__clobberAttrs__.length;j++){
nukeProp(el,el.__clobberAttrs__[j]);
}
nukeProp(el,"__clobberAttrs__");
nukeProp(el,"__doClobber__");
}
}
catch(e){
}
}
na=null;
};
};
if(dojo.render.html.ie){
dojo.addOnUnload(function(){
dojo._ie_clobber.clobber();
try{
if((dojo["widget"])&&(dojo.widget["manager"])){
dojo.widget.manager.destroyAll();
}
}
catch(e){
}
try{
window.onload=null;
}
catch(e){
}
try{
window.onunload=null;
}
catch(e){
}
dojo._ie_clobber.clobberNodes=[];
});
}
dojo.event.browser=new function(){
var _32b=0;
this.normalizedEventName=function(_32c){
switch(_32c){
case "CheckboxStateChange":
case "DOMAttrModified":
case "DOMMenuItemActive":
case "DOMMenuItemInactive":
case "DOMMouseScroll":
case "DOMNodeInserted":
case "DOMNodeRemoved":
case "RadioStateChange":
return _32c;
break;
default:
return _32c.toLowerCase();
break;
}
};
this.clean=function(node){
if(dojo.render.html.ie){
dojo._ie_clobber.clobber(node);
}
};
this.addClobberNode=function(node){
if(!dojo.render.html.ie){
return;
}
if(!node["__doClobber__"]){
node.__doClobber__=true;
dojo._ie_clobber.clobberNodes.push(node);
node.__clobberAttrs__=[];
}
};
this.addClobberNodeAttrs=function(node,_330){
if(!dojo.render.html.ie){
return;
}
this.addClobberNode(node);
for(var x=0;x<_330.length;x++){
node.__clobberAttrs__.push(_330[x]);
}
};
this.removeListener=function(node,_333,fp,_335){
if(!_335){
var _335=false;
}
_333=dojo.event.browser.normalizedEventName(_333);
if((_333=="onkey")||(_333=="key")){
if(dojo.render.html.ie){
this.removeListener(node,"onkeydown",fp,_335);
}
_333="onkeypress";
}
if(_333.substr(0,2)=="on"){
_333=_333.substr(2);
}
if(node.removeEventListener){
node.removeEventListener(_333,fp,_335);
}
};
this.addListener=function(node,_337,fp,_339,_33a){
if(!node){
return;
}
if(!_339){
var _339=false;
}
_337=dojo.event.browser.normalizedEventName(_337);
if((_337=="onkey")||(_337=="key")){
if(dojo.render.html.ie){
this.addListener(node,"onkeydown",fp,_339,_33a);
}
_337="onkeypress";
}
if(_337.substr(0,2)!="on"){
_337="on"+_337;
}
if(!_33a){
var _33b=function(evt){
if(!evt){
evt=window.event;
}
var ret=fp(dojo.event.browser.fixEvent(evt,this));
if(_339){
dojo.event.browser.stopEvent(evt);
}
return ret;
};
}else{
_33b=fp;
}
if(node.addEventListener){
node.addEventListener(_337.substr(2),_33b,_339);
return _33b;
}else{
if(typeof node[_337]=="function"){
var _33e=node[_337];
node[_337]=function(e){
_33e(e);
return _33b(e);
};
}else{
node[_337]=_33b;
}
if(dojo.render.html.ie){
this.addClobberNodeAttrs(node,[_337]);
}
return _33b;
}
};
this.isEvent=function(obj){
return (typeof obj!="undefined")&&(typeof Event!="undefined")&&(obj.eventPhase);
};
this.currentEvent=null;
this.callListener=function(_341,_342){
if(typeof _341!="function"){
dojo.raise("listener not a function: "+_341);
}
dojo.event.browser.currentEvent.currentTarget=_342;
return _341.call(_342,dojo.event.browser.currentEvent);
};
this._stopPropagation=function(){
dojo.event.browser.currentEvent.cancelBubble=true;
};
this._preventDefault=function(){
dojo.event.browser.currentEvent.returnValue=false;
};
this.keys={KEY_BACKSPACE:8,KEY_TAB:9,KEY_CLEAR:12,KEY_ENTER:13,KEY_SHIFT:16,KEY_CTRL:17,KEY_ALT:18,KEY_PAUSE:19,KEY_CAPS_LOCK:20,KEY_ESCAPE:27,KEY_SPACE:32,KEY_PAGE_UP:33,KEY_PAGE_DOWN:34,KEY_END:35,KEY_HOME:36,KEY_LEFT_ARROW:37,KEY_UP_ARROW:38,KEY_RIGHT_ARROW:39,KEY_DOWN_ARROW:40,KEY_INSERT:45,KEY_DELETE:46,KEY_HELP:47,KEY_LEFT_WINDOW:91,KEY_RIGHT_WINDOW:92,KEY_SELECT:93,KEY_NUMPAD_0:96,KEY_NUMPAD_1:97,KEY_NUMPAD_2:98,KEY_NUMPAD_3:99,KEY_NUMPAD_4:100,KEY_NUMPAD_5:101,KEY_NUMPAD_6:102,KEY_NUMPAD_7:103,KEY_NUMPAD_8:104,KEY_NUMPAD_9:105,KEY_NUMPAD_MULTIPLY:106,KEY_NUMPAD_PLUS:107,KEY_NUMPAD_ENTER:108,KEY_NUMPAD_MINUS:109,KEY_NUMPAD_PERIOD:110,KEY_NUMPAD_DIVIDE:111,KEY_F1:112,KEY_F2:113,KEY_F3:114,KEY_F4:115,KEY_F5:116,KEY_F6:117,KEY_F7:118,KEY_F8:119,KEY_F9:120,KEY_F10:121,KEY_F11:122,KEY_F12:123,KEY_F13:124,KEY_F14:125,KEY_F15:126,KEY_NUM_LOCK:144,KEY_SCROLL_LOCK:145};
this.revKeys=[];
for(var key in this.keys){
this.revKeys[this.keys[key]]=key;
}
this.fixEvent=function(evt,_345){
if(!evt){
if(window["event"]){
evt=window.event;
}
}
if((evt["type"])&&(evt["type"].indexOf("key")==0)){
evt.keys=this.revKeys;
for(var key in this.keys){
evt[key]=this.keys[key];
}
if(evt["type"]=="keydown"&&dojo.render.html.ie){
switch(evt.keyCode){
case evt.KEY_SHIFT:
case evt.KEY_CTRL:
case evt.KEY_ALT:
case evt.KEY_CAPS_LOCK:
case evt.KEY_LEFT_WINDOW:
case evt.KEY_RIGHT_WINDOW:
case evt.KEY_SELECT:
case evt.KEY_NUM_LOCK:
case evt.KEY_SCROLL_LOCK:
case evt.KEY_NUMPAD_0:
case evt.KEY_NUMPAD_1:
case evt.KEY_NUMPAD_2:
case evt.KEY_NUMPAD_3:
case evt.KEY_NUMPAD_4:
case evt.KEY_NUMPAD_5:
case evt.KEY_NUMPAD_6:
case evt.KEY_NUMPAD_7:
case evt.KEY_NUMPAD_8:
case evt.KEY_NUMPAD_9:
case evt.KEY_NUMPAD_PERIOD:
break;
case evt.KEY_NUMPAD_MULTIPLY:
case evt.KEY_NUMPAD_PLUS:
case evt.KEY_NUMPAD_ENTER:
case evt.KEY_NUMPAD_MINUS:
case evt.KEY_NUMPAD_DIVIDE:
break;
case evt.KEY_PAUSE:
case evt.KEY_TAB:
case evt.KEY_BACKSPACE:
case evt.KEY_ENTER:
case evt.KEY_ESCAPE:
case evt.KEY_PAGE_UP:
case evt.KEY_PAGE_DOWN:
case evt.KEY_END:
case evt.KEY_HOME:
case evt.KEY_LEFT_ARROW:
case evt.KEY_UP_ARROW:
case evt.KEY_RIGHT_ARROW:
case evt.KEY_DOWN_ARROW:
case evt.KEY_INSERT:
case evt.KEY_DELETE:
case evt.KEY_F1:
case evt.KEY_F2:
case evt.KEY_F3:
case evt.KEY_F4:
case evt.KEY_F5:
case evt.KEY_F6:
case evt.KEY_F7:
case evt.KEY_F8:
case evt.KEY_F9:
case evt.KEY_F10:
case evt.KEY_F11:
case evt.KEY_F12:
case evt.KEY_F12:
case evt.KEY_F13:
case evt.KEY_F14:
case evt.KEY_F15:
case evt.KEY_CLEAR:
case evt.KEY_HELP:
evt.key=evt.keyCode;
break;
default:
if(evt.ctrlKey||evt.altKey){
var _347=evt.keyCode;
if(_347>=65&&_347<=90&&evt.shiftKey==false){
_347+=32;
}
if(_347>=1&&_347<=26&&evt.ctrlKey){
_347+=96;
}
evt.key=String.fromCharCode(_347);
}
}
}else{
if(evt["type"]=="keypress"){
if(dojo.render.html.opera){
if(evt.which==0){
evt.key=evt.keyCode;
}else{
if(evt.which>0){
switch(evt.which){
case evt.KEY_SHIFT:
case evt.KEY_CTRL:
case evt.KEY_ALT:
case evt.KEY_CAPS_LOCK:
case evt.KEY_NUM_LOCK:
case evt.KEY_SCROLL_LOCK:
break;
case evt.KEY_PAUSE:
case evt.KEY_TAB:
case evt.KEY_BACKSPACE:
case evt.KEY_ENTER:
case evt.KEY_ESCAPE:
evt.key=evt.which;
break;
default:
var _347=evt.which;
if((evt.ctrlKey||evt.altKey||evt.metaKey)&&(evt.which>=65&&evt.which<=90&&evt.shiftKey==false)){
_347+=32;
}
evt.key=String.fromCharCode(_347);
}
}
}
}else{
if(dojo.render.html.ie){
if(!evt.ctrlKey&&!evt.altKey&&evt.keyCode>=evt.KEY_SPACE){
evt.key=String.fromCharCode(evt.keyCode);
}
}else{
if(dojo.render.html.safari){
switch(evt.keyCode){
case 63232:
evt.key=evt.KEY_UP_ARROW;
break;
case 63233:
evt.key=evt.KEY_DOWN_ARROW;
break;
case 63234:
evt.key=evt.KEY_LEFT_ARROW;
break;
case 63235:
evt.key=evt.KEY_RIGHT_ARROW;
break;
default:
evt.key=evt.charCode>0?String.fromCharCode(evt.charCode):evt.keyCode;
}
}else{
evt.key=evt.charCode>0?String.fromCharCode(evt.charCode):evt.keyCode;
}
}
}
}
}
}
if(dojo.render.html.ie){
if(!evt.target){
evt.target=evt.srcElement;
}
if(!evt.currentTarget){
evt.currentTarget=(_345?_345:evt.srcElement);
}
if(!evt.layerX){
evt.layerX=evt.offsetX;
}
if(!evt.layerY){
evt.layerY=evt.offsetY;
}
var doc=(evt.srcElement&&evt.srcElement.ownerDocument)?evt.srcElement.ownerDocument:document;
var _349=((dojo.render.html.ie55)||(doc["compatMode"]=="BackCompat"))?doc.body:doc.documentElement;
if(!evt.pageX){
evt.pageX=evt.clientX+(_349.scrollLeft||0);
}
if(!evt.pageY){
evt.pageY=evt.clientY+(_349.scrollTop||0);
}
if(evt.type=="mouseover"){
evt.relatedTarget=evt.fromElement;
}
if(evt.type=="mouseout"){
evt.relatedTarget=evt.toElement;
}
this.currentEvent=evt;
evt.callListener=this.callListener;
evt.stopPropagation=this._stopPropagation;
evt.preventDefault=this._preventDefault;
}
return evt;
};
this.stopEvent=function(evt){
if(window.event){
evt.returnValue=false;
evt.cancelBubble=true;
}else{
evt.preventDefault();
evt.stopPropagation();
}
};
};
dojo.provide("dojo.event.*");
dojo.provide("dojo.widget.Manager");
dojo.widget.manager=new function(){
this.widgets=[];
this.widgetIds=[];
this.topWidgets={};
var _34b={};
var _34c=[];
this.getUniqueId=function(_34d){
var _34e;
do{
_34e=_34d+"_"+(_34b[_34d]!=undefined?++_34b[_34d]:_34b[_34d]=0);
}while(this.getWidgetById(_34e));
return _34e;
};
this.add=function(_34f){
this.widgets.push(_34f);
if(!_34f.extraArgs["id"]){
_34f.extraArgs["id"]=_34f.extraArgs["ID"];
}
if(_34f.widgetId==""){
if(_34f["id"]){
_34f.widgetId=_34f["id"];
}else{
if(_34f.extraArgs["id"]){
_34f.widgetId=_34f.extraArgs["id"];
}else{
_34f.widgetId=this.getUniqueId(_34f.widgetType);
}
}
}
if(this.widgetIds[_34f.widgetId]){
dojo.debug("widget ID collision on ID: "+_34f.widgetId);
}
this.widgetIds[_34f.widgetId]=_34f;
};
this.destroyAll=function(){
for(var x=this.widgets.length-1;x>=0;x--){
try{
this.widgets[x].destroy(true);
delete this.widgets[x];
}
catch(e){
}
}
};
this.remove=function(_351){
if(dojo.lang.isNumber(_351)){
var tw=this.widgets[_351].widgetId;
delete this.widgetIds[tw];
this.widgets.splice(_351,1);
}else{
this.removeById(_351);
}
};
this.removeById=function(id){
if(!dojo.lang.isString(id)){
id=id["widgetId"];
if(!id){
dojo.debug("invalid widget or id passed to removeById");
return;
}
}
for(var i=0;i<this.widgets.length;i++){
if(this.widgets[i].widgetId==id){
this.remove(i);
break;
}
}
};
this.getWidgetById=function(id){
if(dojo.lang.isString(id)){
return this.widgetIds[id];
}
return id;
};
this.getWidgetsByType=function(type){
var lt=type.toLowerCase();
var _358=(type.indexOf(":")<0?function(x){
return x.widgetType.toLowerCase();
}:function(x){
return x.getNamespacedType();
});
var ret=[];
dojo.lang.forEach(this.widgets,function(x){
if(_358(x)==lt){
ret.push(x);
}
});
return ret;
};
this.getWidgetsByFilter=function(_35d,_35e){
var ret=[];
dojo.lang.every(this.widgets,function(x){
if(_35d(x)){
ret.push(x);
if(_35e){
return false;
}
}
return true;
});
return (_35e?ret[0]:ret);
};
this.getAllWidgets=function(){
return this.widgets.concat();
};
this.getWidgetByNode=function(node){
var w=this.getAllWidgets();
node=dojo.byId(node);
for(var i=0;i<w.length;i++){
if(w[i].domNode==node){
return w[i];
}
}
return null;
};
this.byId=this.getWidgetById;
this.byType=this.getWidgetsByType;
this.byFilter=this.getWidgetsByFilter;
this.byNode=this.getWidgetByNode;
var _364={};
var _365=["dojo.widget"];
for(var i=0;i<_365.length;i++){
_365[_365[i]]=true;
}
this.registerWidgetPackage=function(_367){
if(!_365[_367]){
_365[_367]=true;
_365.push(_367);
}
};
this.getWidgetPackageList=function(){
return dojo.lang.map(_365,function(elt){
return (elt!==true?elt:undefined);
});
};
this.getImplementation=function(_369,_36a,_36b,ns){
var impl=this.getImplementationName(_369,ns);
if(impl){
var ret=_36a?new impl(_36a):new impl();
return ret;
}
};
function buildPrefixCache(){
for(var _36f in dojo.render){
if(dojo.render[_36f]["capable"]===true){
var _370=dojo.render[_36f].prefixes;
for(var i=0;i<_370.length;i++){
_34c.push(_370[i].toLowerCase());
}
}
}
}
var _372=function(_373,_374){
if(!_374){
return null;
}
for(var i=0,l=_34c.length,_377;i<=l;i++){
_377=(i<l?_374[_34c[i]]:_374);
if(!_377){
continue;
}
for(var name in _377){
if(name.toLowerCase()==_373){
return _377[name];
}
}
}
return null;
};
var _379=function(_37a,_37b){
var _37c=dojo.evalObjPath(_37b,false);
return (_37c?_372(_37a,_37c):null);
};
this.getImplementationName=function(_37d,ns){
var _37f=_37d.toLowerCase();
ns=ns||"dojo";
var imps=_364[ns]||(_364[ns]={});
var impl=imps[_37f];
if(impl){
return impl;
}
if(!_34c.length){
buildPrefixCache();
}
var _382=dojo.ns.get(ns);
if(!_382){
dojo.ns.register(ns,ns+".widget");
_382=dojo.ns.get(ns);
}
if(_382){
_382.resolve(_37d);
}
impl=_379(_37f,_382.module);
if(impl){
return (imps[_37f]=impl);
}
_382=dojo.ns.require(ns);
if((_382)&&(_382.resolver)){
_382.resolve(_37d);
impl=_379(_37f,_382.module);
if(impl){
return (imps[_37f]=impl);
}
}
dojo.deprecated("dojo.widget.Manager.getImplementationName","Could not locate widget implementation for \""+_37d+"\" in \""+_382.module+"\" registered to namespace \""+_382.name+"\". "+"Developers must specify correct namespaces for all non-Dojo widgets","0.5");
for(var i=0;i<_365.length;i++){
impl=_379(_37f,_365[i]);
if(impl){
return (imps[_37f]=impl);
}
}
throw new Error("Could not locate widget implementation for \""+_37d+"\" in \""+_382.module+"\" registered to namespace \""+_382.name+"\"");
};
this.resizing=false;
this.onWindowResized=function(){
if(this.resizing){
return;
}
try{
this.resizing=true;
for(var id in this.topWidgets){
var _385=this.topWidgets[id];
if(_385.checkSize){
_385.checkSize();
}
}
}
catch(e){
}
finally{
this.resizing=false;
}
};
if(typeof window!="undefined"){
dojo.addOnLoad(this,"onWindowResized");
dojo.event.connect(window,"onresize",this,"onWindowResized");
}
};
(function(){
var dw=dojo.widget;
var dwm=dw.manager;
var h=dojo.lang.curry(dojo.lang,"hitch",dwm);
var g=function(_38a,_38b){
dw[(_38b||_38a)]=h(_38a);
};
g("add","addWidget");
g("destroyAll","destroyAllWidgets");
g("remove","removeWidget");
g("removeById","removeWidgetById");
g("getWidgetById");
g("getWidgetById","byId");
g("getWidgetsByType");
g("getWidgetsByFilter");
g("getWidgetsByType","byType");
g("getWidgetsByFilter","byFilter");
g("getWidgetByNode","byNode");
dw.all=function(n){
var _38d=dwm.getAllWidgets.apply(dwm,arguments);
if(arguments.length>0){
return _38d[n];
}
return _38d;
};
g("registerWidgetPackage");
g("getImplementation","getWidgetImplementation");
g("getImplementationName","getWidgetImplementationName");
dw.widgets=dwm.widgets;
dw.widgetIds=dwm.widgetIds;
dw.root=dwm.root;
})();
dojo.provide("dojo.uri.Uri");
dojo.uri=new function(){
this.dojoUri=function(uri){
return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri(),uri);
};
this.moduleUri=function(_38f,uri){
var loc=dojo.hostenv.getModulePrefix(_38f);
if(!loc){
return null;
}
if(loc.lastIndexOf("/")!=loc.length-1){
loc+="/";
}
return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri()+loc,uri);
};
this.Uri=function(){
var uri=arguments[0];
for(var i=1;i<arguments.length;i++){
if(!arguments[i]){
continue;
}
var _394=new dojo.uri.Uri(arguments[i].toString());
var _395=new dojo.uri.Uri(uri.toString());
if((_394.path=="")&&(_394.scheme==null)&&(_394.authority==null)&&(_394.query==null)){
if(_394.fragment!=null){
_395.fragment=_394.fragment;
}
_394=_395;
}else{
if(_394.scheme==null){
_394.scheme=_395.scheme;
if(_394.authority==null){
_394.authority=_395.authority;
if(_394.path.charAt(0)!="/"){
var path=_395.path.substring(0,_395.path.lastIndexOf("/")+1)+_394.path;
var segs=path.split("/");
for(var j=0;j<segs.length;j++){
if(segs[j]=="."){
if(j==segs.length-1){
segs[j]="";
}else{
segs.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&segs[0]=="")&&segs[j]==".."&&segs[j-1]!=".."){
if(j==segs.length-1){
segs.splice(j,1);
segs[j-1]="";
}else{
segs.splice(j-1,2);
j-=2;
}
}
}
}
_394.path=segs.join("/");
}
}
}
}
uri="";
if(_394.scheme!=null){
uri+=_394.scheme+":";
}
if(_394.authority!=null){
uri+="//"+_394.authority;
}
uri+=_394.path;
if(_394.query!=null){
uri+="?"+_394.query;
}
if(_394.fragment!=null){
uri+="#"+_394.fragment;
}
}
this.uri=uri.toString();
var _399="^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
var r=this.uri.match(new RegExp(_399));
this.scheme=r[2]||(r[1]?"":null);
this.authority=r[4]||(r[3]?"":null);
this.path=r[5];
this.query=r[7]||(r[6]?"":null);
this.fragment=r[9]||(r[8]?"":null);
if(this.authority!=null){
_399="^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
r=this.authority.match(new RegExp(_399));
this.user=r[3]||null;
this.password=r[4]||null;
this.host=r[5];
this.port=r[7]||null;
}
this.toString=function(){
return this.uri;
};
};
};
dojo.provide("dojo.uri.*");
dojo.provide("dojo.html.common");
dojo.lang.mixin(dojo.html,dojo.dom);
dojo.html.body=function(){
dojo.deprecated("dojo.html.body() moved to dojo.body()","0.5");
return dojo.body();
};
dojo.html.getEventTarget=function(evt){
if(!evt){
evt=dojo.global().event||{};
}
var t=(evt.srcElement?evt.srcElement:(evt.target?evt.target:null));
while((t)&&(t.nodeType!=1)){
t=t.parentNode;
}
return t;
};
dojo.html.getViewport=function(){
var _39d=dojo.global();
var _39e=dojo.doc();
var w=0;
var h=0;
if(dojo.render.html.mozilla){
w=_39e.documentElement.clientWidth;
h=_39d.innerHeight;
}else{
if(!dojo.render.html.opera&&_39d.innerWidth){
w=_39d.innerWidth;
h=_39d.innerHeight;
}else{
if(!dojo.render.html.opera&&dojo.exists(_39e,"documentElement.clientWidth")){
var w2=_39e.documentElement.clientWidth;
if(!w||w2&&w2<w){
w=w2;
}
h=_39e.documentElement.clientHeight;
}else{
if(dojo.body().clientWidth){
w=dojo.body().clientWidth;
h=dojo.body().clientHeight;
}
}
}
}
return {width:w,height:h};
};
dojo.html.getScroll=function(){
var _3a2=dojo.global();
var _3a3=dojo.doc();
var top=_3a2.pageYOffset||_3a3.documentElement.scrollTop||dojo.body().scrollTop||0;
var left=_3a2.pageXOffset||_3a3.documentElement.scrollLeft||dojo.body().scrollLeft||0;
return {top:top,left:left,offset:{x:left,y:top}};
};
dojo.html.getParentByType=function(node,type){
var _3a8=dojo.doc();
var _3a9=dojo.byId(node);
type=type.toLowerCase();
while((_3a9)&&(_3a9.nodeName.toLowerCase()!=type)){
if(_3a9==(_3a8["body"]||_3a8["documentElement"])){
return null;
}
_3a9=_3a9.parentNode;
}
return _3a9;
};
dojo.html.getAttribute=function(node,attr){
node=dojo.byId(node);
if((!node)||(!node.getAttribute)){
return null;
}
var ta=typeof attr=="string"?attr:new String(attr);
var v=node.getAttribute(ta.toUpperCase());
if((v)&&(typeof v=="string")&&(v!="")){
return v;
}
if(v&&v.value){
return v.value;
}
if((node.getAttributeNode)&&(node.getAttributeNode(ta))){
return (node.getAttributeNode(ta)).value;
}else{
if(node.getAttribute(ta)){
return node.getAttribute(ta);
}else{
if(node.getAttribute(ta.toLowerCase())){
return node.getAttribute(ta.toLowerCase());
}
}
}
return null;
};
dojo.html.hasAttribute=function(node,attr){
return dojo.html.getAttribute(dojo.byId(node),attr)?true:false;
};
dojo.html.getCursorPosition=function(e){
e=e||dojo.global().event;
var _3b1={x:0,y:0};
if(e.pageX||e.pageY){
_3b1.x=e.pageX;
_3b1.y=e.pageY;
}else{
var de=dojo.doc().documentElement;
var db=dojo.body();
_3b1.x=e.clientX+((de||db)["scrollLeft"])-((de||db)["clientLeft"]);
_3b1.y=e.clientY+((de||db)["scrollTop"])-((de||db)["clientTop"]);
}
return _3b1;
};
dojo.html.isTag=function(node){
node=dojo.byId(node);
if(node&&node.tagName){
for(var i=1;i<arguments.length;i++){
if(node.tagName.toLowerCase()==String(arguments[i]).toLowerCase()){
return String(arguments[i]).toLowerCase();
}
}
}
return "";
};
if(dojo.render.html.ie&&!dojo.render.html.ie70){
if(window.location.href.substr(0,6).toLowerCase()!="https:"){
(function(){
var _3b6=dojo.doc().createElement("script");
_3b6.src="javascript:'dojo.html.createExternalElement=function(doc, tag){ return doc.createElement(tag); }'";
dojo.doc().getElementsByTagName("head")[0].appendChild(_3b6);
})();
}
}else{
dojo.html.createExternalElement=function(doc,tag){
return doc.createElement(tag);
};
}
dojo.html._callDeprecated=function(_3b9,_3ba,args,_3bc,_3bd){
dojo.deprecated("dojo.html."+_3b9,"replaced by dojo.html."+_3ba+"("+(_3bc?"node, {"+_3bc+": "+_3bc+"}":"")+")"+(_3bd?"."+_3bd:""),"0.5");
var _3be=[];
if(_3bc){
var _3bf={};
_3bf[_3bc]=args[1];
_3be.push(args[0]);
_3be.push(_3bf);
}else{
_3be=args;
}
var ret=dojo.html[_3ba].apply(dojo.html,args);
if(_3bd){
return ret[_3bd];
}else{
return ret;
}
};
dojo.html.getViewportWidth=function(){
return dojo.html._callDeprecated("getViewportWidth","getViewport",arguments,null,"width");
};
dojo.html.getViewportHeight=function(){
return dojo.html._callDeprecated("getViewportHeight","getViewport",arguments,null,"height");
};
dojo.html.getViewportSize=function(){
return dojo.html._callDeprecated("getViewportSize","getViewport",arguments);
};
dojo.html.getScrollTop=function(){
return dojo.html._callDeprecated("getScrollTop","getScroll",arguments,null,"top");
};
dojo.html.getScrollLeft=function(){
return dojo.html._callDeprecated("getScrollLeft","getScroll",arguments,null,"left");
};
dojo.html.getScrollOffset=function(){
return dojo.html._callDeprecated("getScrollOffset","getScroll",arguments,null,"offset");
};
dojo.provide("dojo.a11y");
dojo.a11y={imgPath:dojo.uri.dojoUri("src/widget/templates/images"),doAccessibleCheck:true,accessible:null,checkAccessible:function(){
if(this.accessible===null){
this.accessible=false;
if(this.doAccessibleCheck==true){
this.accessible=this.testAccessible();
}
}
return this.accessible;
},testAccessible:function(){
this.accessible=false;
if(dojo.render.html.ie||dojo.render.html.mozilla){
var div=document.createElement("div");
div.style.backgroundImage="url(\""+this.imgPath+"/tab_close.gif\")";
dojo.body().appendChild(div);
var _3c2=null;
if(window.getComputedStyle){
var _3c3=getComputedStyle(div,"");
_3c2=_3c3.getPropertyValue("background-image");
}else{
_3c2=div.currentStyle.backgroundImage;
}
var _3c4=false;
if(_3c2!=null&&(_3c2=="none"||_3c2=="url(invalid-url:)")){
this.accessible=true;
}
dojo.body().removeChild(div);
}
return this.accessible;
},setCheckAccessible:function(_3c5){
this.doAccessibleCheck=_3c5;
},setAccessibleMode:function(){
if(this.accessible===null){
if(this.checkAccessible()){
dojo.render.html.prefixes.unshift("a11y");
}
}
return this.accessible;
}};
dojo.provide("dojo.widget.Widget");
dojo.declare("dojo.widget.Widget",null,function(){
this.children=[];
this.extraArgs={};
},{parent:null,children:[],extraArgs:{},isTopLevel:false,isModal:false,isEnabled:true,isHidden:false,isContainer:false,widgetId:"",widgetType:"Widget",ns:"dojo",getNamespacedType:function(){
return (this.ns?this.ns+":"+this.widgetType:this.widgetType).toLowerCase();
},toString:function(){
return "[Widget "+this.getNamespacedType()+", "+(this.widgetId||"NO ID")+"]";
},repr:function(){
return this.toString();
},enable:function(){
this.isEnabled=true;
},disable:function(){
this.isEnabled=false;
},hide:function(){
this.isHidden=true;
},show:function(){
this.isHidden=false;
},onResized:function(){
this.notifyChildrenOfResize();
},notifyChildrenOfResize:function(){
for(var i=0;i<this.children.length;i++){
var _3c7=this.children[i];
if(_3c7.onResized){
_3c7.onResized();
}
}
},create:function(args,_3c9,_3ca,ns){
if(ns){
this.ns=ns;
}
this.satisfyPropertySets(args,_3c9,_3ca);
this.mixInProperties(args,_3c9,_3ca);
this.postMixInProperties(args,_3c9,_3ca);
dojo.widget.manager.add(this);
this.buildRendering(args,_3c9,_3ca);
this.initialize(args,_3c9,_3ca);
this.postInitialize(args,_3c9,_3ca);
this.postCreate(args,_3c9,_3ca);
return this;
},destroy:function(_3cc){
this.destroyChildren();
this.uninitialize();
this.destroyRendering(_3cc);
dojo.widget.manager.removeById(this.widgetId);
},destroyChildren:function(){
var _3cd;
var i=0;
while(this.children.length>i){
_3cd=this.children[i];
if(_3cd instanceof dojo.widget.Widget){
this.removeChild(_3cd);
_3cd.destroy();
continue;
}
i++;
}
},getChildrenOfType:function(type,_3d0){
var ret=[];
var _3d2=dojo.lang.isFunction(type);
if(!_3d2){
type=type.toLowerCase();
}
for(var x=0;x<this.children.length;x++){
if(_3d2){
if(this.children[x] instanceof type){
ret.push(this.children[x]);
}
}else{
if(this.children[x].widgetType.toLowerCase()==type){
ret.push(this.children[x]);
}
}
if(_3d0){
ret=ret.concat(this.children[x].getChildrenOfType(type,_3d0));
}
}
return ret;
},getDescendants:function(){
var _3d4=[];
var _3d5=[this];
var elem;
while((elem=_3d5.pop())){
_3d4.push(elem);
if(elem.children){
dojo.lang.forEach(elem.children,function(elem){
_3d5.push(elem);
});
}
}
return _3d4;
},isFirstChild:function(){
return this===this.parent.children[0];
},isLastChild:function(){
return this===this.parent.children[this.parent.children.length-1];
},satisfyPropertySets:function(args){
return args;
},mixInProperties:function(args,frag){
if((args["fastMixIn"])||(frag["fastMixIn"])){
for(var x in args){
this[x]=args[x];
}
return;
}
var _3dc;
var _3dd=dojo.widget.lcArgsCache[this.widgetType];
if(_3dd==null){
_3dd={};
for(var y in this){
_3dd[((new String(y)).toLowerCase())]=y;
}
dojo.widget.lcArgsCache[this.widgetType]=_3dd;
}
var _3df={};
for(var x in args){
if(!this[x]){
var y=_3dd[(new String(x)).toLowerCase()];
if(y){
args[y]=args[x];
x=y;
}
}
if(_3df[x]){
continue;
}
_3df[x]=true;
if((typeof this[x])!=(typeof _3dc)){
if(typeof args[x]!="string"){
this[x]=args[x];
}else{
if(dojo.lang.isString(this[x])){
this[x]=args[x];
}else{
if(dojo.lang.isNumber(this[x])){
this[x]=new Number(args[x]);
}else{
if(dojo.lang.isBoolean(this[x])){
this[x]=(args[x].toLowerCase()=="false")?false:true;
}else{
if(dojo.lang.isFunction(this[x])){
if(args[x].search(/[^\w\.]+/i)==-1){
this[x]=dojo.evalObjPath(args[x],false);
}else{
var tn=dojo.lang.nameAnonFunc(new Function(args[x]),this);
dojo.event.kwConnect({srcObj:this,srcFunc:x,adviceObj:this,adviceFunc:tn});
}
}else{
if(dojo.lang.isArray(this[x])){
this[x]=args[x].split(";");
}else{
if(this[x] instanceof Date){
this[x]=new Date(Number(args[x]));
}else{
if(typeof this[x]=="object"){
if(this[x] instanceof dojo.uri.Uri){
this[x]=args[x];
}else{
var _3e1=args[x].split(";");
for(var y=0;y<_3e1.length;y++){
var si=_3e1[y].indexOf(":");
if((si!=-1)&&(_3e1[y].length>si)){
this[x][_3e1[y].substr(0,si).replace(/^\s+|\s+$/g,"")]=_3e1[y].substr(si+1);
}
}
}
}else{
this[x]=args[x];
}
}
}
}
}
}
}
}
}else{
this.extraArgs[x.toLowerCase()]=args[x];
}
}
},postMixInProperties:function(args,frag,_3e5){
},initialize:function(args,frag,_3e8){
return false;
},postInitialize:function(args,frag,_3eb){
return false;
},postCreate:function(args,frag,_3ee){
return false;
},uninitialize:function(){
return false;
},buildRendering:function(args,frag,_3f1){
dojo.unimplemented("dojo.widget.Widget.buildRendering, on "+this.toString()+", ");
return false;
},destroyRendering:function(){
dojo.unimplemented("dojo.widget.Widget.destroyRendering");
return false;
},cleanUp:function(){
dojo.unimplemented("dojo.widget.Widget.cleanUp");
return false;
},addedTo:function(_3f2){
},addChild:function(_3f3){
dojo.unimplemented("dojo.widget.Widget.addChild");
return false;
},removeChild:function(_3f4){
for(var x=0;x<this.children.length;x++){
if(this.children[x]===_3f4){
this.children.splice(x,1);
break;
}
}
return _3f4;
},resize:function(_3f6,_3f7){
this.setWidth(_3f6);
this.setHeight(_3f7);
},setWidth:function(_3f8){
if((typeof _3f8=="string")&&(_3f8.substr(-1)=="%")){
this.setPercentageWidth(_3f8);
}else{
this.setNativeWidth(_3f8);
}
},setHeight:function(_3f9){
if((typeof _3f9=="string")&&(_3f9.substr(-1)=="%")){
this.setPercentageHeight(_3f9);
}else{
this.setNativeHeight(_3f9);
}
},setPercentageHeight:function(_3fa){
return false;
},setNativeHeight:function(_3fb){
return false;
},setPercentageWidth:function(_3fc){
return false;
},setNativeWidth:function(_3fd){
return false;
},getPreviousSibling:function(){
var idx=this.getParentIndex();
if(idx<=0){
return null;
}
return this.parent.children[idx-1];
},getSiblings:function(){
return this.parent.children;
},getParentIndex:function(){
return dojo.lang.indexOf(this.parent.children,this,true);
},getNextSibling:function(){
var idx=this.getParentIndex();
if(idx==this.parent.children.length-1){
return null;
}
if(idx<0){
return null;
}
return this.parent.children[idx+1];
}});
dojo.widget.lcArgsCache={};
dojo.widget.tags={};
dojo.widget.tags.addParseTreeHandler=function(type){
dojo.deprecated("addParseTreeHandler",". ParseTreeHandlers are now reserved for components. Any unfiltered DojoML tag without a ParseTreeHandler is assumed to be a widget","0.5");
};
dojo.widget.tags["dojo:propertyset"]=function(_401,_402,_403){
var _404=_402.parseProperties(_401["dojo:propertyset"]);
};
dojo.widget.tags["dojo:connect"]=function(_405,_406,_407){
var _408=_406.parseProperties(_405["dojo:connect"]);
};
dojo.widget.buildWidgetFromParseTree=function(type,frag,_40b,_40c,_40d,_40e){
dojo.a11y.setAccessibleMode();
var _40f=type.split(":");
_40f=(_40f.length==2)?_40f[1]:type;
var _410=_40e||_40b.parseProperties(frag[frag["ns"]+":"+_40f]);
var _411=dojo.widget.manager.getImplementation(_40f,null,null,frag["ns"]);
if(!_411){
throw new Error("cannot find \""+type+"\" widget");
}else{
if(!_411.create){
throw new Error("\""+type+"\" widget object has no \"create\" method and does not appear to implement *Widget");
}
}
_410["dojoinsertionindex"]=_40d;
var ret=_411.create(_410,frag,_40c,frag["ns"]);
return ret;
};
dojo.widget.defineWidget=function(_413,_414,_415,init,_417){
if(dojo.lang.isString(arguments[3])){
dojo.widget._defineWidget(arguments[0],arguments[3],arguments[1],arguments[4],arguments[2]);
}else{
var args=[arguments[0]],p=3;
if(dojo.lang.isString(arguments[1])){
args.push(arguments[1],arguments[2]);
}else{
args.push("",arguments[1]);
p=2;
}
if(dojo.lang.isFunction(arguments[p])){
args.push(arguments[p],arguments[p+1]);
}else{
args.push(null,arguments[p]);
}
dojo.widget._defineWidget.apply(this,args);
}
};
dojo.widget.defineWidget.renderers="html|svg|vml";
dojo.widget._defineWidget=function(_41a,_41b,_41c,init,_41e){
var _41f=_41a.split(".");
var type=_41f.pop();
var regx="\\.("+(_41b?_41b+"|":"")+dojo.widget.defineWidget.renderers+")\\.";
var r=_41a.search(new RegExp(regx));
_41f=(r<0?_41f.join("."):_41a.substr(0,r));
dojo.widget.manager.registerWidgetPackage(_41f);
var pos=_41f.indexOf(".");
var _424=(pos>-1)?_41f.substring(0,pos):_41f;
_41e=(_41e)||{};
_41e.widgetType=type;
if((!init)&&(_41e["classConstructor"])){
init=_41e.classConstructor;
delete _41e.classConstructor;
}
dojo.declare(_41a,_41c,init,_41e);
};
dojo.provide("dojo.widget.Parse");
dojo.widget.Parse=function(_425){
this.propertySetsList=[];
this.fragment=_425;
this.createComponents=function(frag,_427){
var _428=[];
var _429=false;
try{
if((frag)&&(frag["tagName"])&&(frag!=frag["nodeRef"])){
var _42a=dojo.widget.tags;
var tna=String(frag["tagName"]).split(";");
for(var x=0;x<tna.length;x++){
var ltn=(tna[x].replace(/^\s+|\s+$/g,"")).toLowerCase();
frag.tagName=ltn;
if(_42a[ltn]){
_429=true;
var ret=_42a[ltn](frag,this,_427,frag["index"]);
_428.push(ret);
}else{
if(ltn.indexOf(":")==-1){
ltn="dojo:"+ltn;
}
var ret=dojo.widget.buildWidgetFromParseTree(ltn,frag,this,_427,frag["index"]);
if(ret){
_429=true;
_428.push(ret);
}
}
}
}
}
catch(e){
dojo.debug("dojo.widget.Parse: error:"+e);
}
if(!_429){
_428=_428.concat(this.createSubComponents(frag,_427));
}
return _428;
};
this.createSubComponents=function(_42f,_430){
var frag,_432=[];
for(var item in _42f){
frag=_42f[item];
if((frag)&&(typeof frag=="object")&&(frag!=_42f.nodeRef)&&(frag!=_42f["tagName"])){
_432=_432.concat(this.createComponents(frag,_430));
}
}
return _432;
};
this.parsePropertySets=function(_434){
return [];
};
this.parseProperties=function(_435){
var _436={};
for(var item in _435){
if((_435[item]==_435["tagName"])||(_435[item]==_435.nodeRef)){
}else{
if((_435[item]["tagName"])&&(dojo.widget.tags[_435[item].tagName.toLowerCase()])){
}else{
if((_435[item][0])&&(_435[item][0].value!="")&&(_435[item][0].value!=null)){
try{
if(item.toLowerCase()=="dataprovider"){
var _438=this;
this.getDataProvider(_438,_435[item][0].value);
_436.dataProvider=this.dataProvider;
}
_436[item]=_435[item][0].value;
var _439=this.parseProperties(_435[item]);
for(var _43a in _439){
_436[_43a]=_439[_43a];
}
}
catch(e){
dojo.debug(e);
}
}
}
switch(item.toLowerCase()){
case "checked":
case "disabled":
if(typeof _436[item]!="boolean"){
_436[item]=true;
}
break;
}
}
}
return _436;
};
this.getDataProvider=function(_43b,_43c){
dojo.io.bind({url:_43c,load:function(type,_43e){
if(type=="load"){
_43b.dataProvider=_43e;
}
},mimetype:"text/javascript",sync:true});
};
this.getPropertySetById=function(_43f){
for(var x=0;x<this.propertySetsList.length;x++){
if(_43f==this.propertySetsList[x]["id"][0].value){
return this.propertySetsList[x];
}
}
return "";
};
this.getPropertySetsByType=function(_441){
var _442=[];
for(var x=0;x<this.propertySetsList.length;x++){
var cpl=this.propertySetsList[x];
var cpcc=cpl["componentClass"]||cpl["componentType"]||null;
var _446=this.propertySetsList[x]["id"][0].value;
if((cpcc)&&(_446==cpcc[0].value)){
_442.push(cpl);
}
}
return _442;
};
this.getPropertySets=function(_447){
var ppl="dojo:propertyproviderlist";
var _449=[];
var _44a=_447["tagName"];
if(_447[ppl]){
var _44b=_447[ppl].value.split(" ");
for(var _44c in _44b){
if((_44c.indexOf("..")==-1)&&(_44c.indexOf("://")==-1)){
var _44d=this.getPropertySetById(_44c);
if(_44d!=""){
_449.push(_44d);
}
}else{
}
}
}
return (this.getPropertySetsByType(_44a)).concat(_449);
};
this.createComponentFromScript=function(_44e,_44f,_450,ns){
_450.fastMixIn=true;
var ltn=(ns||"dojo")+":"+_44f.toLowerCase();
if(dojo.widget.tags[ltn]){
return [dojo.widget.tags[ltn](_450,this,null,null,_450)];
}
return [dojo.widget.buildWidgetFromParseTree(ltn,_450,this,null,null,_450)];
};
};
dojo.widget._parser_collection={"dojo":new dojo.widget.Parse()};
dojo.widget.getParser=function(name){
if(!name){
name="dojo";
}
if(!this._parser_collection[name]){
this._parser_collection[name]=new dojo.widget.Parse();
}
return this._parser_collection[name];
};
dojo.widget.createWidget=function(name,_455,_456,_457){
var _458=false;
var _459=(typeof name=="string");
if(_459){
var pos=name.indexOf(":");
var ns=(pos>-1)?name.substring(0,pos):"dojo";
if(pos>-1){
name=name.substring(pos+1);
}
var _45c=name.toLowerCase();
var _45d=ns+":"+_45c;
_458=(dojo.byId(name)&&(!dojo.widget.tags[_45d]));
}
if((arguments.length==1)&&((_458)||(!_459))){
var xp=new dojo.xml.Parse();
var tn=(_458)?dojo.byId(name):name;
return dojo.widget.getParser().createComponents(xp.parseElement(tn,null,true))[0];
}
function fromScript(_460,name,_462,ns){
_462[_45d]={dojotype:[{value:_45c}],nodeRef:_460,fastMixIn:true};
_462.ns=ns;
return dojo.widget.getParser().createComponentFromScript(_460,name,_462,ns);
}
_455=_455||{};
var _464=false;
var tn=null;
var h=dojo.render.html.capable;
if(h){
tn=document.createElement("span");
}
if(!_456){
_464=true;
_456=tn;
if(h){
dojo.body().appendChild(_456);
}
}else{
if(_457){
dojo.dom.insertAtPosition(tn,_456,_457);
}else{
tn=_456;
}
}
var _466=fromScript(tn,name.toLowerCase(),_455,ns);
if((!_466)||(!_466[0])||(typeof _466[0].widgetType=="undefined")){
throw new Error("createWidget: Creation of \""+name+"\" widget failed.");
}
try{
if(_464){
if(_466[0].domNode.parentNode){
_466[0].domNode.parentNode.removeChild(_466[0].domNode);
}
}
}
catch(e){
dojo.debug(e);
}
return _466[0];
};
dojo.provide("dojo.string");
dojo.provide("dojo.io.common");
dojo.io.transports=[];
dojo.io.hdlrFuncNames=["load","error","timeout"];
dojo.io.Request=function(url,_468,_469,_46a){
if((arguments.length==1)&&(arguments[0].constructor==Object)){
this.fromKwArgs(arguments[0]);
}else{
this.url=url;
if(_468){
this.mimetype=_468;
}
if(_469){
this.transport=_469;
}
if(arguments.length>=4){
this.changeUrl=_46a;
}
}
};
dojo.lang.extend(dojo.io.Request,{url:"",mimetype:"text/plain",method:"GET",content:undefined,transport:undefined,changeUrl:undefined,formNode:undefined,sync:false,bindSuccess:false,useCache:false,preventCache:false,load:function(type,data,_46d,_46e){
},error:function(type,_470,_471,_472){
},timeout:function(type,_474,_475,_476){
},handle:function(type,data,_479,_47a){
},timeoutSeconds:0,abort:function(){
},fromKwArgs:function(_47b){
if(_47b["url"]){
_47b.url=_47b.url.toString();
}
if(_47b["formNode"]){
_47b.formNode=dojo.byId(_47b.formNode);
}
if(!_47b["method"]&&_47b["formNode"]&&_47b["formNode"].method){
_47b.method=_47b["formNode"].method;
}
if(!_47b["handle"]&&_47b["handler"]){
_47b.handle=_47b.handler;
}
if(!_47b["load"]&&_47b["loaded"]){
_47b.load=_47b.loaded;
}
if(!_47b["changeUrl"]&&_47b["changeURL"]){
_47b.changeUrl=_47b.changeURL;
}
_47b.encoding=dojo.lang.firstValued(_47b["encoding"],djConfig["bindEncoding"],"");
_47b.sendTransport=dojo.lang.firstValued(_47b["sendTransport"],djConfig["ioSendTransport"],false);
var _47c=dojo.lang.isFunction;
for(var x=0;x<dojo.io.hdlrFuncNames.length;x++){
var fn=dojo.io.hdlrFuncNames[x];
if(_47b[fn]&&_47c(_47b[fn])){
continue;
}
if(_47b["handle"]&&_47c(_47b["handle"])){
_47b[fn]=_47b.handle;
}
}
dojo.lang.mixin(this,_47b);
}});
dojo.io.Error=function(msg,type,num){
this.message=msg;
this.type=type||"unknown";
this.number=num||0;
};
dojo.io.transports.addTransport=function(name){
this.push(name);
this[name]=dojo.io[name];
};
dojo.io.bind=function(_483){
if(!(_483 instanceof dojo.io.Request)){
try{
_483=new dojo.io.Request(_483);
}
catch(e){
dojo.debug(e);
}
}
var _484="";
if(_483["transport"]){
_484=_483["transport"];
if(!this[_484]){
dojo.io.sendBindError(_483,"No dojo.io.bind() transport with name '"+_483["transport"]+"'.");
return _483;
}
if(!this[_484].canHandle(_483)){
dojo.io.sendBindError(_483,"dojo.io.bind() transport with name '"+_483["transport"]+"' cannot handle this type of request.");
return _483;
}
}else{
for(var x=0;x<dojo.io.transports.length;x++){
var tmp=dojo.io.transports[x];
if((this[tmp])&&(this[tmp].canHandle(_483))){
_484=tmp;
break;
}
}
if(_484==""){
dojo.io.sendBindError(_483,"None of the loaded transports for dojo.io.bind()"+" can handle the request.");
return _483;
}
}
this[_484].bind(_483);
_483.bindSuccess=true;
return _483;
};
dojo.io.sendBindError=function(_487,_488){
if((typeof _487.error=="function"||typeof _487.handle=="function")&&(typeof setTimeout=="function"||typeof setTimeout=="object")){
var _489=new dojo.io.Error(_488);
setTimeout(function(){
_487[(typeof _487.error=="function")?"error":"handle"]("error",_489,null,_487);
},50);
}else{
dojo.raise(_488);
}
};
dojo.io.queueBind=function(_48a){
if(!(_48a instanceof dojo.io.Request)){
try{
_48a=new dojo.io.Request(_48a);
}
catch(e){
dojo.debug(e);
}
}
var _48b=_48a.load;
_48a.load=function(){
dojo.io._queueBindInFlight=false;
var ret=_48b.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
var _48d=_48a.error;
_48a.error=function(){
dojo.io._queueBindInFlight=false;
var ret=_48d.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
dojo.io._bindQueue.push(_48a);
dojo.io._dispatchNextQueueBind();
return _48a;
};
dojo.io._dispatchNextQueueBind=function(){
if(!dojo.io._queueBindInFlight){
dojo.io._queueBindInFlight=true;
if(dojo.io._bindQueue.length>0){
dojo.io.bind(dojo.io._bindQueue.shift());
}else{
dojo.io._queueBindInFlight=false;
}
}
};
dojo.io._bindQueue=[];
dojo.io._queueBindInFlight=false;
dojo.io.argsFromMap=function(map,_490,last){
var enc=/utf/i.test(_490||"")?encodeURIComponent:dojo.string.encodeAscii;
var _493=[];
var _494=new Object();
for(var name in map){
var _496=function(elt){
var val=enc(name)+"="+enc(elt);
_493[(last==name)?"push":"unshift"](val);
};
if(!_494[name]){
var _499=map[name];
if(dojo.lang.isArray(_499)){
dojo.lang.forEach(_499,_496);
}else{
_496(_499);
}
}
}
return _493.join("&");
};
dojo.io.setIFrameSrc=function(_49a,src,_49c){
try{
var r=dojo.render.html;
if(!_49c){
if(r.safari){
_49a.location=src;
}else{
frames[_49a.name].location=src;
}
}else{
var idoc;
if(r.ie){
idoc=_49a.contentWindow.document;
}else{
if(r.safari){
idoc=_49a.document;
}else{
idoc=_49a.contentWindow;
}
}
if(!idoc){
_49a.location=src;
return;
}else{
idoc.location.replace(src);
}
}
}
catch(e){
dojo.debug(e);
dojo.debug("setIFrameSrc: "+e);
}
};
dojo.provide("dojo.undo.browser");
try{
if((!djConfig["preventBackButtonFix"])&&(!dojo.hostenv.post_load_)){
document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(dojo.hostenv.getBaseScriptUri()+"iframe_history.html")+"'></iframe>");
}
}
catch(e){
}
if(dojo.render.html.opera){
dojo.debug("Opera is not supported with dojo.undo.browser, so back/forward detection will not work.");
}
dojo.undo.browser={initialHref:window.location.href,initialHash:window.location.hash,moveForward:false,historyStack:[],forwardStack:[],historyIframe:null,bookmarkAnchor:null,locationTimer:null,setInitialState:function(args){
this.initialState=this._createState(this.initialHref,args,this.initialHash);
},addToHistory:function(args){
this.forwardStack=[];
var hash=null;
var url=null;
if(!this.historyIframe){
this.historyIframe=window.frames["djhistory"];
}
if(!this.bookmarkAnchor){
this.bookmarkAnchor=document.createElement("a");
dojo.body().appendChild(this.bookmarkAnchor);
this.bookmarkAnchor.style.display="none";
}
if(args["changeUrl"]){
hash="#"+((args["changeUrl"]!==true)?args["changeUrl"]:(new Date()).getTime());
if(this.historyStack.length==0&&this.initialState.urlHash==hash){
this.initialState=this._createState(url,args,hash);
return;
}else{
if(this.historyStack.length>0&&this.historyStack[this.historyStack.length-1].urlHash==hash){
this.historyStack[this.historyStack.length-1]=this._createState(url,args,hash);
return;
}
}
this.changingUrl=true;
setTimeout("window.location.href = '"+hash+"'; dojo.undo.browser.changingUrl = false;",1);
this.bookmarkAnchor.href=hash;
if(dojo.render.html.ie){
url=this._loadIframeHistory();
var _4a3=args["back"]||args["backButton"]||args["handle"];
var tcb=function(_4a5){
if(window.location.hash!=""){
setTimeout("window.location.href = '"+hash+"';",1);
}
_4a3.apply(this,[_4a5]);
};
if(args["back"]){
args.back=tcb;
}else{
if(args["backButton"]){
args.backButton=tcb;
}else{
if(args["handle"]){
args.handle=tcb;
}
}
}
var _4a6=args["forward"]||args["forwardButton"]||args["handle"];
var tfw=function(_4a8){
if(window.location.hash!=""){
window.location.href=hash;
}
if(_4a6){
_4a6.apply(this,[_4a8]);
}
};
if(args["forward"]){
args.forward=tfw;
}else{
if(args["forwardButton"]){
args.forwardButton=tfw;
}else{
if(args["handle"]){
args.handle=tfw;
}
}
}
}else{
if(dojo.render.html.moz){
if(!this.locationTimer){
this.locationTimer=setInterval("dojo.undo.browser.checkLocation();",200);
}
}
}
}else{
url=this._loadIframeHistory();
}
this.historyStack.push(this._createState(url,args,hash));
},checkLocation:function(){
if(!this.changingUrl){
var hsl=this.historyStack.length;
if((window.location.hash==this.initialHash||window.location.href==this.initialHref)&&(hsl==1)){
this.handleBackButton();
return;
}
if(this.forwardStack.length>0){
if(this.forwardStack[this.forwardStack.length-1].urlHash==window.location.hash){
this.handleForwardButton();
return;
}
}
if((hsl>=2)&&(this.historyStack[hsl-2])){
if(this.historyStack[hsl-2].urlHash==window.location.hash){
this.handleBackButton();
return;
}
}
}
},iframeLoaded:function(evt,_4ab){
if(!dojo.render.html.opera){
var _4ac=this._getUrlQuery(_4ab.href);
if(_4ac==null){
if(this.historyStack.length==1){
this.handleBackButton();
}
return;
}
if(this.moveForward){
this.moveForward=false;
return;
}
if(this.historyStack.length>=2&&_4ac==this._getUrlQuery(this.historyStack[this.historyStack.length-2].url)){
this.handleBackButton();
}else{
if(this.forwardStack.length>0&&_4ac==this._getUrlQuery(this.forwardStack[this.forwardStack.length-1].url)){
this.handleForwardButton();
}
}
}
},handleBackButton:function(){
var _4ad=this.historyStack.pop();
if(!_4ad){
return;
}
var last=this.historyStack[this.historyStack.length-1];
if(!last&&this.historyStack.length==0){
last=this.initialState;
}
if(last){
if(last.kwArgs["back"]){
last.kwArgs["back"]();
}else{
if(last.kwArgs["backButton"]){
last.kwArgs["backButton"]();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("back");
}
}
}
}
this.forwardStack.push(_4ad);
},handleForwardButton:function(){
var last=this.forwardStack.pop();
if(!last){
return;
}
if(last.kwArgs["forward"]){
last.kwArgs.forward();
}else{
if(last.kwArgs["forwardButton"]){
last.kwArgs.forwardButton();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("forward");
}
}
}
this.historyStack.push(last);
},_createState:function(url,args,hash){
return {"url":url,"kwArgs":args,"urlHash":hash};
},_getUrlQuery:function(url){
var _4b4=url.split("?");
if(_4b4.length<2){
return null;
}else{
return _4b4[1];
}
},_loadIframeHistory:function(){
var url=dojo.hostenv.getBaseScriptUri()+"iframe_history.html?"+(new Date()).getTime();
this.moveForward=true;
dojo.io.setIFrameSrc(this.historyIframe,url,false);
return url;
}};
dojo.provide("dojo.io.BrowserIO");
dojo.io.checkChildrenForFile=function(node){
var _4b7=false;
var _4b8=node.getElementsByTagName("input");
dojo.lang.forEach(_4b8,function(_4b9){
if(_4b7){
return;
}
if(_4b9.getAttribute("type")=="file"){
_4b7=true;
}
});
return _4b7;
};
dojo.io.formHasFile=function(_4ba){
return dojo.io.checkChildrenForFile(_4ba);
};
dojo.io.updateNode=function(node,_4bc){
node=dojo.byId(node);
var args=_4bc;
if(dojo.lang.isString(_4bc)){
args={url:_4bc};
}
args.mimetype="text/html";
args.load=function(t,d,e){
while(node.firstChild){
if(dojo["event"]){
try{
dojo.event.browser.clean(node.firstChild);
}
catch(e){
}
}
node.removeChild(node.firstChild);
}
node.innerHTML=d;
};
dojo.io.bind(args);
};
dojo.io.formFilter=function(node){
var type=(node.type||"").toLowerCase();
return !node.disabled&&node.name&&!dojo.lang.inArray(["file","submit","image","reset","button"],type);
};
dojo.io.encodeForm=function(_4c3,_4c4,_4c5){
if((!_4c3)||(!_4c3.tagName)||(!_4c3.tagName.toLowerCase()=="form")){
dojo.raise("Attempted to encode a non-form element.");
}
if(!_4c5){
_4c5=dojo.io.formFilter;
}
var enc=/utf/i.test(_4c4||"")?encodeURIComponent:dojo.string.encodeAscii;
var _4c7=[];
for(var i=0;i<_4c3.elements.length;i++){
var elm=_4c3.elements[i];
if(!elm||elm.tagName.toLowerCase()=="fieldset"||!_4c5(elm)){
continue;
}
var name=enc(elm.name);
var type=elm.type.toLowerCase();
if(type=="select-multiple"){
for(var j=0;j<elm.options.length;j++){
if(elm.options[j].selected){
_4c7.push(name+"="+enc(elm.options[j].value));
}
}
}else{
if(dojo.lang.inArray(["radio","checkbox"],type)){
if(elm.checked){
_4c7.push(name+"="+enc(elm.value));
}
}else{
_4c7.push(name+"="+enc(elm.value));
}
}
}
var _4cd=_4c3.getElementsByTagName("input");
for(var i=0;i<_4cd.length;i++){
var _4ce=_4cd[i];
if(_4ce.type.toLowerCase()=="image"&&_4ce.form==_4c3&&_4c5(_4ce)){
var name=enc(_4ce.name);
_4c7.push(name+"="+enc(_4ce.value));
_4c7.push(name+".x=0");
_4c7.push(name+".y=0");
}
}
return _4c7.join("&")+"&";
};
dojo.io.FormBind=function(args){
this.bindArgs={};
if(args&&args.formNode){
this.init(args);
}else{
if(args){
this.init({formNode:args});
}
}
};
dojo.lang.extend(dojo.io.FormBind,{form:null,bindArgs:null,clickedButton:null,init:function(args){
var form=dojo.byId(args.formNode);
if(!form||!form.tagName||form.tagName.toLowerCase()!="form"){
throw new Error("FormBind: Couldn't apply, invalid form");
}else{
if(this.form==form){
return;
}else{
if(this.form){
throw new Error("FormBind: Already applied to a form");
}
}
}
dojo.lang.mixin(this.bindArgs,args);
this.form=form;
this.connect(form,"onsubmit","submit");
for(var i=0;i<form.elements.length;i++){
var node=form.elements[i];
if(node&&node.type&&dojo.lang.inArray(["submit","button"],node.type.toLowerCase())){
this.connect(node,"onclick","click");
}
}
var _4d4=form.getElementsByTagName("input");
for(var i=0;i<_4d4.length;i++){
var _4d5=_4d4[i];
if(_4d5.type.toLowerCase()=="image"&&_4d5.form==form){
this.connect(_4d5,"onclick","click");
}
}
},onSubmit:function(form){
return true;
},submit:function(e){
e.preventDefault();
if(this.onSubmit(this.form)){
dojo.io.bind(dojo.lang.mixin(this.bindArgs,{formFilter:dojo.lang.hitch(this,"formFilter")}));
}
},click:function(e){
var node=e.currentTarget;
if(node.disabled){
return;
}
this.clickedButton=node;
},formFilter:function(node){
var type=(node.type||"").toLowerCase();
var _4dc=false;
if(node.disabled||!node.name){
_4dc=false;
}else{
if(dojo.lang.inArray(["submit","button","image"],type)){
if(!this.clickedButton){
this.clickedButton=node;
}
_4dc=node==this.clickedButton;
}else{
_4dc=!dojo.lang.inArray(["file","submit","reset","button"],type);
}
}
return _4dc;
},connect:function(_4dd,_4de,_4df){
if(dojo.evalObjPath("dojo.event.connect")){
dojo.event.connect(_4dd,_4de,this,_4df);
}else{
var fcn=dojo.lang.hitch(this,_4df);
_4dd[_4de]=function(e){
if(!e){
e=window.event;
}
if(!e.currentTarget){
e.currentTarget=e.srcElement;
}
if(!e.preventDefault){
e.preventDefault=function(){
window.event.returnValue=false;
};
}
fcn(e);
};
}
}});
dojo.io.XMLHTTPTransport=new function(){
var _4e2=this;
var _4e3={};
this.useCache=false;
this.preventCache=false;
function getCacheKey(url,_4e5,_4e6){
return url+"|"+_4e5+"|"+_4e6.toLowerCase();
}
function addToCache(url,_4e8,_4e9,http){
_4e3[getCacheKey(url,_4e8,_4e9)]=http;
}
function getFromCache(url,_4ec,_4ed){
return _4e3[getCacheKey(url,_4ec,_4ed)];
}
this.clearCache=function(){
_4e3={};
};
function doLoad(_4ee,http,url,_4f1,_4f2){
if(((http.status>=200)&&(http.status<300))||(http.status==304)||(location.protocol=="file:"&&(http.status==0||http.status==undefined))||(location.protocol=="chrome:"&&(http.status==0||http.status==undefined))){
var ret;
if(_4ee.method.toLowerCase()=="head"){
var _4f4=http.getAllResponseHeaders();
ret={};
ret.toString=function(){
return _4f4;
};
var _4f5=_4f4.split(/[\r\n]+/g);
for(var i=0;i<_4f5.length;i++){
var pair=_4f5[i].match(/^([^:]+)\s*:\s*(.+)$/i);
if(pair){
ret[pair[1]]=pair[2];
}
}
}else{
if(_4ee.mimetype=="text/javascript"){
try{
ret=dj_eval(http.responseText);
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=null;
}
}else{
if(_4ee.mimetype=="text/json"||_4ee.mimetype=="application/json"){
try{
ret=dj_eval("("+http.responseText+")");
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=false;
}
}else{
if((_4ee.mimetype=="application/xml")||(_4ee.mimetype=="text/xml")){
ret=http.responseXML;
if(!ret||typeof ret=="string"||!http.getResponseHeader("Content-Type")){
ret=dojo.dom.createDocumentFromText(http.responseText);
}
}else{
ret=http.responseText;
}
}
}
}
if(_4f2){
addToCache(url,_4f1,_4ee.method,http);
}
_4ee[(typeof _4ee.load=="function")?"load":"handle"]("load",ret,http,_4ee);
}else{
var _4f8=new dojo.io.Error("XMLHttpTransport Error: "+http.status+" "+http.statusText);
_4ee[(typeof _4ee.error=="function")?"error":"handle"]("error",_4f8,http,_4ee);
}
}
function setHeaders(http,_4fa){
if(_4fa["headers"]){
for(var _4fb in _4fa["headers"]){
if(_4fb.toLowerCase()=="content-type"&&!_4fa["contentType"]){
_4fa["contentType"]=_4fa["headers"][_4fb];
}else{
http.setRequestHeader(_4fb,_4fa["headers"][_4fb]);
}
}
}
}
this.inFlight=[];
this.inFlightTimer=null;
this.startWatchingInFlight=function(){
if(!this.inFlightTimer){
this.inFlightTimer=setTimeout("dojo.io.XMLHTTPTransport.watchInFlight();",10);
}
};
this.watchInFlight=function(){
var now=null;
if(!dojo.hostenv._blockAsync&&!_4e2._blockAsync){
for(var x=this.inFlight.length-1;x>=0;x--){
try{
var tif=this.inFlight[x];
if(!tif||tif.http._aborted||!tif.http.readyState){
this.inFlight.splice(x,1);
continue;
}
if(4==tif.http.readyState){
this.inFlight.splice(x,1);
doLoad(tif.req,tif.http,tif.url,tif.query,tif.useCache);
}else{
if(tif.startTime){
if(!now){
now=(new Date()).getTime();
}
if(tif.startTime+(tif.req.timeoutSeconds*1000)<now){
if(typeof tif.http.abort=="function"){
tif.http.abort();
}
this.inFlight.splice(x,1);
tif.req[(typeof tif.req.timeout=="function")?"timeout":"handle"]("timeout",null,tif.http,tif.req);
}
}
}
}
catch(e){
try{
var _4ff=new dojo.io.Error("XMLHttpTransport.watchInFlight Error: "+e);
tif.req[(typeof tif.req.error=="function")?"error":"handle"]("error",_4ff,tif.http,tif.req);
}
catch(e2){
dojo.debug("XMLHttpTransport error callback failed: "+e2);
}
}
}
}
clearTimeout(this.inFlightTimer);
if(this.inFlight.length==0){
this.inFlightTimer=null;
return;
}
this.inFlightTimer=setTimeout("dojo.io.XMLHTTPTransport.watchInFlight();",10);
};
var _500=dojo.hostenv.getXmlhttpObject()?true:false;
this.canHandle=function(_501){
return _500&&dojo.lang.inArray(["text/plain","text/html","application/xml","text/xml","text/javascript","text/json","application/json"],(_501["mimetype"].toLowerCase()||""))&&!(_501["formNode"]&&dojo.io.formHasFile(_501["formNode"]));
};
this.multipartBoundary="45309FFF-BD65-4d50-99C9-36986896A96F";
this.bind=function(_502){
if(!_502["url"]){
if(!_502["formNode"]&&(_502["backButton"]||_502["back"]||_502["changeUrl"]||_502["watchForURL"])&&(!djConfig.preventBackButtonFix)){
dojo.deprecated("Using dojo.io.XMLHTTPTransport.bind() to add to browser history without doing an IO request","Use dojo.undo.browser.addToHistory() instead.","0.4");
dojo.undo.browser.addToHistory(_502);
return true;
}
}
var url=_502.url;
var _504="";
if(_502["formNode"]){
var ta=_502.formNode.getAttribute("action");
if((ta)&&(!_502["url"])){
url=ta;
}
var tp=_502.formNode.getAttribute("method");
if((tp)&&(!_502["method"])){
_502.method=tp;
}
_504+=dojo.io.encodeForm(_502.formNode,_502.encoding,_502["formFilter"]);
}
if(url.indexOf("#")>-1){
dojo.debug("Warning: dojo.io.bind: stripping hash values from url:",url);
url=url.split("#")[0];
}
if(_502["file"]){
_502.method="post";
}
if(!_502["method"]){
_502.method="get";
}
if(_502.method.toLowerCase()=="get"){
_502.multipart=false;
}else{
if(_502["file"]){
_502.multipart=true;
}else{
if(!_502["multipart"]){
_502.multipart=false;
}
}
}
if(_502["backButton"]||_502["back"]||_502["changeUrl"]){
dojo.undo.browser.addToHistory(_502);
}
var _507=_502["content"]||{};
if(_502.sendTransport){
_507["dojo.transport"]="xmlhttp";
}
do{
if(_502.postContent){
_504=_502.postContent;
break;
}
if(_507){
_504+=dojo.io.argsFromMap(_507,_502.encoding);
}
if(_502.method.toLowerCase()=="get"||!_502.multipart){
break;
}
var t=[];
if(_504.length){
var q=_504.split("&");
for(var i=0;i<q.length;++i){
if(q[i].length){
var p=q[i].split("=");
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+p[0]+"\"","",p[1]);
}
}
}
if(_502.file){
if(dojo.lang.isArray(_502.file)){
for(var i=0;i<_502.file.length;++i){
var o=_502.file[i];
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}else{
var o=_502.file;
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}
if(t.length){
t.push("--"+this.multipartBoundary+"--","");
_504=t.join("\r\n");
}
}while(false);
var _50d=_502["sync"]?false:true;
var _50e=_502["preventCache"]||(this.preventCache==true&&_502["preventCache"]!=false);
var _50f=_502["useCache"]==true||(this.useCache==true&&_502["useCache"]!=false);
if(!_50e&&_50f){
var _510=getFromCache(url,_504,_502.method);
if(_510){
doLoad(_502,_510,url,_504,false);
return;
}
}
var http=dojo.hostenv.getXmlhttpObject(_502);
var _512=false;
if(_50d){
var _513=this.inFlight.push({"req":_502,"http":http,"url":url,"query":_504,"useCache":_50f,"startTime":_502.timeoutSeconds?(new Date()).getTime():0});
this.startWatchingInFlight();
}else{
_4e2._blockAsync=true;
}
if(_502.method.toLowerCase()=="post"){
if(!_502.user){
http.open("POST",url,_50d);
}else{
http.open("POST",url,_50d,_502.user,_502.password);
}
setHeaders(http,_502);
http.setRequestHeader("Content-Type",_502.multipart?("multipart/form-data; boundary="+this.multipartBoundary):(_502.contentType||"application/x-www-form-urlencoded"));
try{
http.send(_504);
}
catch(e){
if(typeof http.abort=="function"){
http.abort();
}
doLoad(_502,{status:404},url,_504,_50f);
}
}else{
var _514=url;
if(_504!=""){
_514+=(_514.indexOf("?")>-1?"&":"?")+_504;
}
if(_50e){
_514+=(dojo.string.endsWithAny(_514,"?","&")?"":(_514.indexOf("?")>-1?"&":"?"))+"dojo.preventCache="+new Date().valueOf();
}
if(!_502.user){
http.open(_502.method.toUpperCase(),_514,_50d);
}else{
http.open(_502.method.toUpperCase(),_514,_50d,_502.user,_502.password);
}
setHeaders(http,_502);
try{
http.send(null);
}
catch(e){
if(typeof http.abort=="function"){
http.abort();
}
doLoad(_502,{status:404},url,_504,_50f);
}
}
if(!_50d){
doLoad(_502,http,url,_504,_50f);
_4e2._blockAsync=false;
}
_502.abort=function(){
try{
http._aborted=true;
}
catch(e){
}
return http.abort();
};
return;
};
dojo.io.transports.addTransport("XMLHTTPTransport");
};
dojo.provide("dojo.io.cookie");
dojo.io.cookie.setCookie=function(name,_516,days,path,_519,_51a){
var _51b=-1;
if(typeof days=="number"&&days>=0){
var d=new Date();
d.setTime(d.getTime()+(days*24*60*60*1000));
_51b=d.toGMTString();
}
_516=escape(_516);
document.cookie=name+"="+_516+";"+(_51b!=-1?" expires="+_51b+";":"")+(path?"path="+path:"")+(_519?"; domain="+_519:"")+(_51a?"; secure":"");
};
dojo.io.cookie.set=dojo.io.cookie.setCookie;
dojo.io.cookie.getCookie=function(name){
var idx=document.cookie.lastIndexOf(name+"=");
if(idx==-1){
return null;
}
var _51f=document.cookie.substring(idx+name.length+1);
var end=_51f.indexOf(";");
if(end==-1){
end=_51f.length;
}
_51f=_51f.substring(0,end);
_51f=unescape(_51f);
return _51f;
};
dojo.io.cookie.get=dojo.io.cookie.getCookie;
dojo.io.cookie.deleteCookie=function(name){
dojo.io.cookie.setCookie(name,"-",0);
};
dojo.io.cookie.setObjectCookie=function(name,obj,days,path,_526,_527,_528){
if(arguments.length==5){
_528=_526;
_526=null;
_527=null;
}
var _529=[],_52a,_52b="";
if(!_528){
_52a=dojo.io.cookie.getObjectCookie(name);
}
if(days>=0){
if(!_52a){
_52a={};
}
for(var prop in obj){
if(prop==null){
delete _52a[prop];
}else{
if(typeof obj[prop]=="string"||typeof obj[prop]=="number"){
_52a[prop]=obj[prop];
}
}
}
prop=null;
for(var prop in _52a){
_529.push(escape(prop)+"="+escape(_52a[prop]));
}
_52b=_529.join("&");
}
dojo.io.cookie.setCookie(name,_52b,days,path,_526,_527);
};
dojo.io.cookie.getObjectCookie=function(name){
var _52e=null,_52f=dojo.io.cookie.getCookie(name);
if(_52f){
_52e={};
var _530=_52f.split("&");
for(var i=0;i<_530.length;i++){
var pair=_530[i].split("=");
var _533=pair[1];
if(isNaN(_533)){
_533=unescape(pair[1]);
}
_52e[unescape(pair[0])]=_533;
}
}
return _52e;
};
dojo.io.cookie.isSupported=function(){
if(typeof navigator.cookieEnabled!="boolean"){
dojo.io.cookie.setCookie("__TestingYourBrowserForCookieSupport__","CookiesAllowed",90,null);
var _534=dojo.io.cookie.getCookie("__TestingYourBrowserForCookieSupport__");
navigator.cookieEnabled=(_534=="CookiesAllowed");
if(navigator.cookieEnabled){
this.deleteCookie("__TestingYourBrowserForCookieSupport__");
}
}
return navigator.cookieEnabled;
};
if(!dojo.io.cookies){
dojo.io.cookies=dojo.io.cookie;
}
dojo.provide("dojo.io.*");
dojo.provide("dojo.html.style");
dojo.html.getClass=function(node){
node=dojo.byId(node);
if(!node){
return "";
}
var cs="";
if(node.className){
cs=node.className;
}else{
if(dojo.html.hasAttribute(node,"class")){
cs=dojo.html.getAttribute(node,"class");
}
}
return cs.replace(/^\s+|\s+$/g,"");
};
dojo.html.getClasses=function(node){
var c=dojo.html.getClass(node);
return (c=="")?[]:c.split(/\s+/g);
};
dojo.html.hasClass=function(node,_53a){
return (new RegExp("(^|\\s+)"+_53a+"(\\s+|$)")).test(dojo.html.getClass(node));
};
dojo.html.prependClass=function(node,_53c){
_53c+=" "+dojo.html.getClass(node);
return dojo.html.setClass(node,_53c);
};
dojo.html.addClass=function(node,_53e){
if(dojo.html.hasClass(node,_53e)){
return false;
}
_53e=(dojo.html.getClass(node)+" "+_53e).replace(/^\s+|\s+$/g,"");
return dojo.html.setClass(node,_53e);
};
dojo.html.setClass=function(node,_540){
node=dojo.byId(node);
var cs=new String(_540);
try{
if(typeof node.className=="string"){
node.className=cs;
}else{
if(node.setAttribute){
node.setAttribute("class",_540);
node.className=cs;
}else{
return false;
}
}
}
catch(e){
dojo.debug("dojo.html.setClass() failed",e);
}
return true;
};
dojo.html.removeClass=function(node,_543,_544){
try{
if(!_544){
var _545=dojo.html.getClass(node).replace(new RegExp("(^|\\s+)"+_543+"(\\s+|$)"),"$1$2");
}else{
var _545=dojo.html.getClass(node).replace(_543,"");
}
dojo.html.setClass(node,_545);
}
catch(e){
dojo.debug("dojo.html.removeClass() failed",e);
}
return true;
};
dojo.html.replaceClass=function(node,_547,_548){
dojo.html.removeClass(node,_548);
dojo.html.addClass(node,_547);
};
dojo.html.classMatchType={ContainsAll:0,ContainsAny:1,IsOnly:2};
dojo.html.getElementsByClass=function(_549,_54a,_54b,_54c,_54d){
_54d=false;
var _54e=dojo.doc();
_54a=dojo.byId(_54a)||_54e;
var _54f=_549.split(/\s+/g);
var _550=[];
if(_54c!=1&&_54c!=2){
_54c=0;
}
var _551=new RegExp("(\\s|^)(("+_54f.join(")|(")+"))(\\s|$)");
var _552=_54f.join(" ").length;
var _553=[];
if(!_54d&&_54e.evaluate){
var _554=".//"+(_54b||"*")+"[contains(";
if(_54c!=dojo.html.classMatchType.ContainsAny){
_554+="concat(' ',@class,' '), ' "+_54f.join(" ') and contains(concat(' ',@class,' '), ' ")+" ')";
if(_54c==2){
_554+=" and string-length(@class)="+_552+"]";
}else{
_554+="]";
}
}else{
_554+="concat(' ',@class,' '), ' "+_54f.join(" ') or contains(concat(' ',@class,' '), ' ")+" ')]";
}
var _555=_54e.evaluate(_554,_54a,null,XPathResult.ANY_TYPE,null);
var _556=_555.iterateNext();
while(_556){
try{
_553.push(_556);
_556=_555.iterateNext();
}
catch(e){
break;
}
}
return _553;
}else{
if(!_54b){
_54b="*";
}
_553=_54a.getElementsByTagName(_54b);
var node,i=0;
outer:
while(node=_553[i++]){
var _559=dojo.html.getClasses(node);
if(_559.length==0){
continue outer;
}
var _55a=0;
for(var j=0;j<_559.length;j++){
if(_551.test(_559[j])){
if(_54c==dojo.html.classMatchType.ContainsAny){
_550.push(node);
continue outer;
}else{
_55a++;
}
}else{
if(_54c==dojo.html.classMatchType.IsOnly){
continue outer;
}
}
}
if(_55a==_54f.length){
if((_54c==dojo.html.classMatchType.IsOnly)&&(_55a==_559.length)){
_550.push(node);
}else{
if(_54c==dojo.html.classMatchType.ContainsAll){
_550.push(node);
}
}
}
}
return _550;
}
};
dojo.html.getElementsByClassName=dojo.html.getElementsByClass;
dojo.html.toCamelCase=function(_55c){
var arr=_55c.split("-"),cc=arr[0];
for(var i=1;i<arr.length;i++){
cc+=arr[i].charAt(0).toUpperCase()+arr[i].substring(1);
}
return cc;
};
dojo.html.toSelectorCase=function(_560){
return _560.replace(/([A-Z])/g,"-$1").toLowerCase();
};
dojo.html.getComputedStyle=function(node,_562,_563){
node=dojo.byId(node);
var _562=dojo.html.toSelectorCase(_562);
var _564=dojo.html.toCamelCase(_562);
if(!node||!node.style){
return _563;
}else{
if(document.defaultView&&dojo.html.isDescendantOf(node,node.ownerDocument)){
try{
var cs=document.defaultView.getComputedStyle(node,"");
if(cs){
return cs.getPropertyValue(_562);
}
}
catch(e){
if(node.style.getPropertyValue){
return node.style.getPropertyValue(_562);
}else{
return _563;
}
}
}else{
if(node.currentStyle){
return node.currentStyle[_564];
}
}
}
if(node.style.getPropertyValue){
return node.style.getPropertyValue(_562);
}else{
return _563;
}
};
dojo.html.getStyleProperty=function(node,_567){
node=dojo.byId(node);
return (node&&node.style?node.style[dojo.html.toCamelCase(_567)]:undefined);
};
dojo.html.getStyle=function(node,_569){
var _56a=dojo.html.getStyleProperty(node,_569);
return (_56a?_56a:dojo.html.getComputedStyle(node,_569));
};
dojo.html.setStyle=function(node,_56c,_56d){
node=dojo.byId(node);
if(node&&node.style){
var _56e=dojo.html.toCamelCase(_56c);
node.style[_56e]=_56d;
}
};
dojo.html.setStyleText=function(_56f,text){
try{
_56f.style.cssText=text;
}
catch(e){
_56f.setAttribute("style",text);
}
};
dojo.html.copyStyle=function(_571,_572){
if(!_572.style.cssText){
_571.setAttribute("style",_572.getAttribute("style"));
}else{
_571.style.cssText=_572.style.cssText;
}
dojo.html.addClass(_571,dojo.html.getClass(_572));
};
dojo.html.getUnitValue=function(node,_574,_575){
var s=dojo.html.getComputedStyle(node,_574);
if((!s)||((s=="auto")&&(_575))){
return {value:0,units:"px"};
}
var _577=s.match(/(\-?[\d.]+)([a-z%]*)/i);
if(!_577){
return dojo.html.getUnitValue.bad;
}
return {value:Number(_577[1]),units:_577[2].toLowerCase()};
};
dojo.html.getUnitValue.bad={value:NaN,units:""};
dojo.html.getPixelValue=function(node,_579,_57a){
var _57b=dojo.html.getUnitValue(node,_579,_57a);
if(isNaN(_57b.value)){
return 0;
}
if((_57b.value)&&(_57b.units!="px")){
return NaN;
}
return _57b.value;
};
dojo.html.setPositivePixelValue=function(node,_57d,_57e){
if(isNaN(_57e)){
return false;
}
node.style[_57d]=Math.max(0,_57e)+"px";
return true;
};
dojo.html.styleSheet=null;
dojo.html.insertCssRule=function(_57f,_580,_581){
if(!dojo.html.styleSheet){
if(document.createStyleSheet){
dojo.html.styleSheet=document.createStyleSheet();
}else{
if(document.styleSheets[0]){
dojo.html.styleSheet=document.styleSheets[0];
}else{
return null;
}
}
}
if(arguments.length<3){
if(dojo.html.styleSheet.cssRules){
_581=dojo.html.styleSheet.cssRules.length;
}else{
if(dojo.html.styleSheet.rules){
_581=dojo.html.styleSheet.rules.length;
}else{
return null;
}
}
}
if(dojo.html.styleSheet.insertRule){
var rule=_57f+" { "+_580+" }";
return dojo.html.styleSheet.insertRule(rule,_581);
}else{
if(dojo.html.styleSheet.addRule){
return dojo.html.styleSheet.addRule(_57f,_580,_581);
}else{
return null;
}
}
};
dojo.html.removeCssRule=function(_583){
if(!dojo.html.styleSheet){
dojo.debug("no stylesheet defined for removing rules");
return false;
}
if(dojo.render.html.ie){
if(!_583){
_583=dojo.html.styleSheet.rules.length;
dojo.html.styleSheet.removeRule(_583);
}
}else{
if(document.styleSheets[0]){
if(!_583){
_583=dojo.html.styleSheet.cssRules.length;
}
dojo.html.styleSheet.deleteRule(_583);
}
}
return true;
};
dojo.html._insertedCssFiles=[];
dojo.html.insertCssFile=function(URI,doc,_586,_587){
if(!URI){
return;
}
if(!doc){
doc=document;
}
var _588=dojo.hostenv.getText(URI,false,_587);
if(_588===null){
return;
}
_588=dojo.html.fixPathsInCssText(_588,URI);
if(_586){
var idx=-1,node,ent=dojo.html._insertedCssFiles;
for(var i=0;i<ent.length;i++){
if((ent[i].doc==doc)&&(ent[i].cssText==_588)){
idx=i;
node=ent[i].nodeRef;
break;
}
}
if(node){
var _58d=doc.getElementsByTagName("style");
for(var i=0;i<_58d.length;i++){
if(_58d[i]==node){
return;
}
}
dojo.html._insertedCssFiles.shift(idx,1);
}
}
var _58e=dojo.html.insertCssText(_588);
dojo.html._insertedCssFiles.push({"doc":doc,"cssText":_588,"nodeRef":_58e});
if(_58e&&djConfig.isDebug){
_58e.setAttribute("dbgHref",URI);
}
return _58e;
};
dojo.html.insertCssText=function(_58f,doc,URI){
if(!_58f){
return;
}
if(!doc){
doc=document;
}
if(URI){
_58f=dojo.html.fixPathsInCssText(_58f,URI);
}
var _592=doc.createElement("style");
_592.setAttribute("type","text/css");
var head=doc.getElementsByTagName("head")[0];
if(!head){
dojo.debug("No head tag in document, aborting styles");
return;
}else{
head.appendChild(_592);
}
if(_592.styleSheet){
_592.styleSheet.cssText=_58f;
}else{
var _594=doc.createTextNode(_58f);
_592.appendChild(_594);
}
return _592;
};
dojo.html.fixPathsInCssText=function(_595,URI){
function iefixPathsInCssText(){
var _597=/AlphaImageLoader\(src\=['"]([\t\s\w()\/.\\'"-:#=&?~]*)['"]/;
while(_598=_597.exec(_595)){
url=_598[1].replace(_59a,"$2");
if(!_59b.exec(url)){
url=(new dojo.uri.Uri(URI,url).toString());
}
str+=_595.substring(0,_598.index)+"AlphaImageLoader(src='"+url+"'";
_595=_595.substr(_598.index+_598[0].length);
}
return str+_595;
}
if(!_595||!URI){
return;
}
var _598,str="",url="";
var _59d=/url\(\s*([\t\s\w()\/.\\'"-:#=&?]+)\s*\)/;
var _59b=/(file|https?|ftps?):\/\//;
var _59a=/^[\s]*(['"]?)([\w()\/.\\'"-:#=&?]*)\1[\s]*?$/;
if(dojo.render.html.ie55||dojo.render.html.ie60){
_595=iefixPathsInCssText();
}
while(_598=_59d.exec(_595)){
url=_598[1].replace(_59a,"$2");
if(!_59b.exec(url)){
url=(new dojo.uri.Uri(URI,url).toString());
}
str+=_595.substring(0,_598.index)+"url("+url+")";
_595=_595.substr(_598.index+_598[0].length);
}
return str+_595;
};
dojo.html.setActiveStyleSheet=function(_59e){
var i=0,a,els=dojo.doc().getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")){
a.disabled=true;
if(a.getAttribute("title")==_59e){
a.disabled=false;
}
}
}
};
dojo.html.getActiveStyleSheet=function(){
var i=0,a,els=dojo.doc().getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")&&!a.disabled){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.getPreferredStyleSheet=function(){
var i=0,a,els=dojo.doc().getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("rel").indexOf("alt")==-1&&a.getAttribute("title")){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.applyBrowserClass=function(node){
var drh=dojo.render.html;
var _5aa={dj_ie:drh.ie,dj_ie55:drh.ie55,dj_ie6:drh.ie60,dj_ie7:drh.ie70,dj_iequirks:drh.ie&&drh.quirks,dj_opera:drh.opera,dj_opera8:drh.opera&&(Math.floor(dojo.render.version)==8),dj_opera9:drh.opera&&(Math.floor(dojo.render.version)==9),dj_khtml:drh.khtml,dj_safari:drh.safari,dj_gecko:drh.mozilla};
for(var p in _5aa){
if(_5aa[p]){
dojo.html.addClass(node,p);
}
}
};
dojo.provide("dojo.widget.DomWidget");
dojo.widget._cssFiles={};
dojo.widget._cssStrings={};
dojo.widget._templateCache={};
dojo.widget.defaultStrings={dojoRoot:dojo.hostenv.getBaseScriptUri(),baseScriptUri:dojo.hostenv.getBaseScriptUri()};
dojo.widget.fillFromTemplateCache=function(obj,_5ad,_5ae,_5af){
var _5b0=_5ad||obj.templatePath;
var _5b1=dojo.widget._templateCache;
if(!obj["widgetType"]){
do{
var _5b2="__dummyTemplate__"+dojo.widget._templateCache.dummyCount++;
}while(_5b1[_5b2]);
obj.widgetType=_5b2;
}
var wt=obj.widgetType;
var ts=_5b1[wt];
if(!ts){
_5b1[wt]={"string":null,"node":null};
if(_5af){
ts={};
}else{
ts=_5b1[wt];
}
}
if((!obj.templateString)&&(!_5af)){
obj.templateString=_5ae||ts["string"];
}
if((!obj.templateNode)&&(!_5af)){
obj.templateNode=ts["node"];
}
if((!obj.templateNode)&&(!obj.templateString)&&(_5b0)){
var _5b5=dojo.hostenv.getText(_5b0);
if(_5b5){
_5b5=_5b5.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,"");
var _5b6=_5b5.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_5b6){
_5b5=_5b6[1];
}
}else{
_5b5="";
}
obj.templateString=_5b5;
if(!_5af){
_5b1[wt]["string"]=_5b5;
}
}
if((!ts["string"])&&(!_5af)){
ts.string=obj.templateString;
}
};
dojo.widget._templateCache.dummyCount=0;
dojo.widget.attachProperties=["dojoAttachPoint","id"];
dojo.widget.eventAttachProperty="dojoAttachEvent";
dojo.widget.onBuildProperty="dojoOnBuild";
dojo.widget.waiNames=["waiRole","waiState"];
dojo.widget.wai={waiRole:{name:"waiRole","namespace":"http://www.w3.org/TR/xhtml2",alias:"x2",prefix:"wairole:"},waiState:{name:"waiState","namespace":"http://www.w3.org/2005/07/aaa",alias:"aaa",prefix:""},setAttr:function(node,ns,attr,_5ba){
if(dojo.render.html.ie){
node.setAttribute(this[ns].alias+":"+attr,this[ns].prefix+_5ba);
}else{
node.setAttributeNS(this[ns]["namespace"],attr,this[ns].prefix+_5ba);
}
},getAttr:function(node,ns,attr){
if(dojo.render.html.ie){
return node.getAttribute(this[ns].alias+":"+attr);
}else{
return node.getAttributeNS(this[ns]["namespace"],attr);
}
},removeAttr:function(node,ns,attr){
var _5c1=true;
if(dojo.render.html.ie){
_5c1=node.removeAttribute(this[ns].alias+":"+attr);
}else{
node.removeAttributeNS(this[ns]["namespace"],attr);
}
return _5c1;
}};
dojo.widget.attachTemplateNodes=function(_5c2,_5c3,_5c4){
var _5c5=dojo.dom.ELEMENT_NODE;
function trim(str){
return str.replace(/^\s+|\s+$/g,"");
}
if(!_5c2){
_5c2=_5c3.domNode;
}
if(_5c2.nodeType!=_5c5){
return;
}
var _5c7=_5c2.all||_5c2.getElementsByTagName("*");
var _5c8=_5c3;
for(var x=-1;x<_5c7.length;x++){
var _5ca=(x==-1)?_5c2:_5c7[x];
var _5cb=[];
if(!_5c3.widgetsInTemplate||!_5ca.getAttribute("dojoType")){
for(var y=0;y<this.attachProperties.length;y++){
var _5cd=_5ca.getAttribute(this.attachProperties[y]);
if(_5cd){
_5cb=_5cd.split(";");
for(var z=0;z<_5cb.length;z++){
if(dojo.lang.isArray(_5c3[_5cb[z]])){
_5c3[_5cb[z]].push(_5ca);
}else{
_5c3[_5cb[z]]=_5ca;
}
}
break;
}
}
var _5cf=_5ca.getAttribute(this.eventAttachProperty);
if(_5cf){
var evts=_5cf.split(";");
for(var y=0;y<evts.length;y++){
if((!evts[y])||(!evts[y].length)){
continue;
}
var _5d1=null;
var tevt=trim(evts[y]);
if(evts[y].indexOf(":")>=0){
var _5d3=tevt.split(":");
tevt=trim(_5d3[0]);
_5d1=trim(_5d3[1]);
}
if(!_5d1){
_5d1=tevt;
}
var tf=function(){
var ntf=new String(_5d1);
return function(evt){
if(_5c8[ntf]){
_5c8[ntf](dojo.event.browser.fixEvent(evt,this));
}
};
}();
dojo.event.browser.addListener(_5ca,tevt,tf,false,true);
}
}
for(var y=0;y<_5c4.length;y++){
var _5d7=_5ca.getAttribute(_5c4[y]);
if((_5d7)&&(_5d7.length)){
var _5d1=null;
var _5d8=_5c4[y].substr(4);
_5d1=trim(_5d7);
var _5d9=[_5d1];
if(_5d1.indexOf(";")>=0){
_5d9=dojo.lang.map(_5d1.split(";"),trim);
}
for(var z=0;z<_5d9.length;z++){
if(!_5d9[z].length){
continue;
}
var tf=function(){
var ntf=new String(_5d9[z]);
return function(evt){
if(_5c8[ntf]){
_5c8[ntf](dojo.event.browser.fixEvent(evt,this));
}
};
}();
dojo.event.browser.addListener(_5ca,_5d8,tf,false,true);
}
}
}
}
var _5dc=_5ca.getAttribute(this.templateProperty);
if(_5dc){
_5c3[_5dc]=_5ca;
}
dojo.lang.forEach(dojo.widget.waiNames,function(name){
var wai=dojo.widget.wai[name];
var val=_5ca.getAttribute(wai.name);
if(val){
if(val.indexOf("-")==-1){
dojo.widget.wai.setAttr(_5ca,wai.name,"role",val);
}else{
var _5e0=val.split("-");
dojo.widget.wai.setAttr(_5ca,wai.name,_5e0[0],_5e0[1]);
}
}
},this);
var _5e1=_5ca.getAttribute(this.onBuildProperty);
if(_5e1){
eval("var node = baseNode; var widget = targetObj; "+_5e1);
}
}
};
dojo.widget.getDojoEventsFromStr=function(str){
var re=/(dojoOn([a-z]+)(\s?))=/gi;
var evts=str?str.match(re)||[]:[];
var ret=[];
var lem={};
for(var x=0;x<evts.length;x++){
if(evts[x].length<1){
continue;
}
var cm=evts[x].replace(/\s/,"");
cm=(cm.slice(0,cm.length-1));
if(!lem[cm]){
lem[cm]=true;
ret.push(cm);
}
}
return ret;
};
dojo.declare("dojo.widget.DomWidget",dojo.widget.Widget,function(){
if((arguments.length>0)&&(typeof arguments[0]=="object")){
this.create(arguments[0]);
}
},{templateNode:null,templateString:null,templateCssString:null,preventClobber:false,domNode:null,containerNode:null,widgetsInTemplate:false,addChild:function(_5e9,_5ea,pos,ref,_5ed){
if(!this.isContainer){
dojo.debug("dojo.widget.DomWidget.addChild() attempted on non-container widget");
return null;
}else{
if(_5ed==undefined){
_5ed=this.children.length;
}
this.addWidgetAsDirectChild(_5e9,_5ea,pos,ref,_5ed);
this.registerChild(_5e9,_5ed);
}
return _5e9;
},addWidgetAsDirectChild:function(_5ee,_5ef,pos,ref,_5f2){
if((!this.containerNode)&&(!_5ef)){
this.containerNode=this.domNode;
}
var cn=(_5ef)?_5ef:this.containerNode;
if(!pos){
pos="after";
}
if(!ref){
if(!cn){
cn=dojo.body();
}
ref=cn.lastChild;
}
if(!_5f2){
_5f2=0;
}
_5ee.domNode.setAttribute("dojoinsertionindex",_5f2);
if(!ref){
cn.appendChild(_5ee.domNode);
}else{
if(pos=="insertAtIndex"){
dojo.dom.insertAtIndex(_5ee.domNode,ref.parentNode,_5f2);
}else{
if((pos=="after")&&(ref===cn.lastChild)){
cn.appendChild(_5ee.domNode);
}else{
dojo.dom.insertAtPosition(_5ee.domNode,cn,pos);
}
}
}
},registerChild:function(_5f4,_5f5){
_5f4.dojoInsertionIndex=_5f5;
var idx=-1;
for(var i=0;i<this.children.length;i++){
if(this.children[i].dojoInsertionIndex<=_5f5){
idx=i;
}
}
this.children.splice(idx+1,0,_5f4);
_5f4.parent=this;
_5f4.addedTo(this,idx+1);
delete dojo.widget.manager.topWidgets[_5f4.widgetId];
},removeChild:function(_5f8){
dojo.dom.removeNode(_5f8.domNode);
return dojo.widget.DomWidget.superclass.removeChild.call(this,_5f8);
},getFragNodeRef:function(frag){
if(!frag){
return null;
}
if(!frag[this.getNamespacedType()]){
dojo.raise("Error: no frag for widget type "+this.getNamespacedType()+", id "+this.widgetId+" (maybe a widget has set it's type incorrectly)");
}
return frag[this.getNamespacedType()]["nodeRef"];
},postInitialize:function(args,frag,_5fc){
var _5fd=this.getFragNodeRef(frag);
if(_5fc&&(_5fc.snarfChildDomOutput||!_5fd)){
_5fc.addWidgetAsDirectChild(this,"","insertAtIndex","",args["dojoinsertionindex"],_5fd);
}else{
if(_5fd){
if(this.domNode&&(this.domNode!==_5fd)){
var _5fe=_5fd.parentNode.replaceChild(this.domNode,_5fd);
}
}
}
if(_5fc){
_5fc.registerChild(this,args.dojoinsertionindex);
}else{
dojo.widget.manager.topWidgets[this.widgetId]=this;
}
if(this.widgetsInTemplate){
var _5ff=new dojo.xml.Parse();
var _600;
var _601=this.domNode.getElementsByTagName("*");
for(var i=0;i<_601.length;i++){
if(_601[i].getAttribute("dojoAttachPoint")=="subContainerWidget"){
_600=_601[i];
}
if(_601[i].getAttribute("dojoType")){
_601[i].setAttribute("_isSubWidget",true);
}
}
if(this.isContainer&&!this.containerNode){
if(_600){
var src=this.getFragNodeRef(frag);
if(src){
dojo.dom.moveChildren(src,_600);
frag["dojoDontFollow"]=true;
}
}else{
dojo.debug("No subContainerWidget node can be found in template file for widget "+this);
}
}
var _604=_5ff.parseElement(this.domNode,null,true);
dojo.widget.getParser().createSubComponents(_604,this);
var _605=[];
var _606=[this];
var w;
while((w=_606.pop())){
for(var i=0;i<w.children.length;i++){
var _608=w.children[i];
if(_608._processedSubWidgets||!_608.extraArgs["_issubwidget"]){
continue;
}
_605.push(_608);
if(_608.isContainer){
_606.push(_608);
}
}
}
for(var i=0;i<_605.length;i++){
var _609=_605[i];
if(_609._processedSubWidgets){
dojo.debug("This should not happen: widget._processedSubWidgets is already true!");
return;
}
_609._processedSubWidgets=true;
if(_609.extraArgs["dojoattachevent"]){
var evts=_609.extraArgs["dojoattachevent"].split(";");
for(var j=0;j<evts.length;j++){
var _60c=null;
var tevt=dojo.string.trim(evts[j]);
if(tevt.indexOf(":")>=0){
var _60e=tevt.split(":");
tevt=dojo.string.trim(_60e[0]);
_60c=dojo.string.trim(_60e[1]);
}
if(!_60c){
_60c=tevt;
}
if(dojo.lang.isFunction(_609[tevt])){
dojo.event.kwConnect({srcObj:_609,srcFunc:tevt,targetObj:this,targetFunc:_60c});
}else{
alert(tevt+" is not a function in widget "+_609);
}
}
}
if(_609.extraArgs["dojoattachpoint"]){
this[_609.extraArgs["dojoattachpoint"]]=_609;
}
}
}
if(this.isContainer&&!frag["dojoDontFollow"]){
dojo.widget.getParser().createSubComponents(frag,this);
}
},buildRendering:function(args,frag){
var ts=dojo.widget._templateCache[this.widgetType];
if(args["templatecsspath"]){
args["templateCssPath"]=args["templatecsspath"];
}
var _612=args["templateCssPath"]||this.templateCssPath;
if(_612&&!dojo.widget._cssFiles[_612.toString()]){
if((!this.templateCssString)&&(_612)){
this.templateCssString=dojo.hostenv.getText(_612);
this.templateCssPath=null;
}
dojo.widget._cssFiles[_612.toString()]=true;
}
if((this["templateCssString"])&&(!this.templateCssString["loaded"])){
dojo.html.insertCssText(this.templateCssString,null,_612);
if(!this.templateCssString){
this.templateCssString="";
}
this.templateCssString.loaded=true;
}
if((!this.preventClobber)&&((this.templatePath)||(this.templateNode)||((this["templateString"])&&(this.templateString.length))||((typeof ts!="undefined")&&((ts["string"])||(ts["node"]))))){
this.buildFromTemplate(args,frag);
}else{
this.domNode=this.getFragNodeRef(frag);
}
this.fillInTemplate(args,frag);
},buildFromTemplate:function(args,frag){
var _615=false;
if(args["templatepath"]){
_615=true;
args["templatePath"]=args["templatepath"];
}
dojo.widget.fillFromTemplateCache(this,args["templatePath"],null,_615);
var ts=dojo.widget._templateCache[this.widgetType];
if((ts)&&(!_615)){
if(!this.templateString.length){
this.templateString=ts["string"];
}
if(!this.templateNode){
this.templateNode=ts["node"];
}
}
var _617=false;
var node=null;
var tstr=this.templateString;
if((!this.templateNode)&&(this.templateString)){
_617=this.templateString.match(/\$\{([^\}]+)\}/g);
if(_617){
var hash=this.strings||{};
for(var key in dojo.widget.defaultStrings){
if(dojo.lang.isUndefined(hash[key])){
hash[key]=dojo.widget.defaultStrings[key];
}
}
for(var i=0;i<_617.length;i++){
var key=_617[i];
key=key.substring(2,key.length-1);
var kval=(key.substring(0,5)=="this.")?dojo.lang.getObjPathValue(key.substring(5),this):hash[key];
var _61e;
if((kval)||(dojo.lang.isString(kval))){
_61e=new String((dojo.lang.isFunction(kval))?kval.call(this,key,this.templateString):kval);
while(_61e.indexOf("\"")>-1){
_61e=_61e.replace("\"","&quot;");
}
tstr=tstr.replace(_617[i],_61e);
}
}
}else{
this.templateNode=this.createNodesFromText(this.templateString,true)[0];
if(!_615){
ts.node=this.templateNode;
}
}
}
if((!this.templateNode)&&(!_617)){
dojo.debug("DomWidget.buildFromTemplate: could not create template");
return false;
}else{
if(!_617){
node=this.templateNode.cloneNode(true);
if(!node){
return false;
}
}else{
node=this.createNodesFromText(tstr,true)[0];
}
}
this.domNode=node;
this.attachTemplateNodes();
if(this.isContainer&&this.containerNode){
var src=this.getFragNodeRef(frag);
if(src){
dojo.dom.moveChildren(src,this.containerNode);
}
}
},attachTemplateNodes:function(_620,_621){
if(!_620){
_620=this.domNode;
}
if(!_621){
_621=this;
}
return dojo.widget.attachTemplateNodes(_620,_621,dojo.widget.getDojoEventsFromStr(this.templateString));
},fillInTemplate:function(){
},destroyRendering:function(){
try{
delete this.domNode;
}
catch(e){
}
},cleanUp:function(){
},getContainerHeight:function(){
dojo.unimplemented("dojo.widget.DomWidget.getContainerHeight");
},getContainerWidth:function(){
dojo.unimplemented("dojo.widget.DomWidget.getContainerWidth");
},createNodesFromText:function(){
dojo.unimplemented("dojo.widget.DomWidget.createNodesFromText");
}});
dojo.provide("dojo.html.display");
dojo.html._toggle=function(node,_623,_624){
node=dojo.byId(node);
_624(node,!_623(node));
return _623(node);
};
dojo.html.show=function(node){
node=dojo.byId(node);
if(dojo.html.getStyleProperty(node,"display")=="none"){
dojo.html.setStyle(node,"display",(node.dojoDisplayCache||""));
node.dojoDisplayCache=undefined;
}
};
dojo.html.hide=function(node){
node=dojo.byId(node);
if(typeof node["dojoDisplayCache"]=="undefined"){
var d=dojo.html.getStyleProperty(node,"display");
if(d!="none"){
node.dojoDisplayCache=d;
}
}
dojo.html.setStyle(node,"display","none");
};
dojo.html.setShowing=function(node,_629){
dojo.html[(_629?"show":"hide")](node);
};
dojo.html.isShowing=function(node){
return (dojo.html.getStyleProperty(node,"display")!="none");
};
dojo.html.toggleShowing=function(node){
return dojo.html._toggle(node,dojo.html.isShowing,dojo.html.setShowing);
};
dojo.html.displayMap={tr:"",td:"",th:"",img:"inline",span:"inline",input:"inline",button:"inline"};
dojo.html.suggestDisplayByTagName=function(node){
node=dojo.byId(node);
if(node&&node.tagName){
var tag=node.tagName.toLowerCase();
return (tag in dojo.html.displayMap?dojo.html.displayMap[tag]:"block");
}
};
dojo.html.setDisplay=function(node,_62f){
dojo.html.setStyle(node,"display",((_62f instanceof String||typeof _62f=="string")?_62f:(_62f?dojo.html.suggestDisplayByTagName(node):"none")));
};
dojo.html.isDisplayed=function(node){
return (dojo.html.getComputedStyle(node,"display")!="none");
};
dojo.html.toggleDisplay=function(node){
return dojo.html._toggle(node,dojo.html.isDisplayed,dojo.html.setDisplay);
};
dojo.html.setVisibility=function(node,_633){
dojo.html.setStyle(node,"visibility",((_633 instanceof String||typeof _633=="string")?_633:(_633?"visible":"hidden")));
};
dojo.html.isVisible=function(node){
return (dojo.html.getComputedStyle(node,"visibility")!="hidden");
};
dojo.html.toggleVisibility=function(node){
return dojo.html._toggle(node,dojo.html.isVisible,dojo.html.setVisibility);
};
dojo.html.setOpacity=function(node,_637,_638){
node=dojo.byId(node);
var h=dojo.render.html;
if(!_638){
if(_637>=1){
if(h.ie){
dojo.html.clearOpacity(node);
return;
}else{
_637=0.999999;
}
}else{
if(_637<0){
_637=0;
}
}
}
if(h.ie){
if(node.nodeName.toLowerCase()=="tr"){
var tds=node.getElementsByTagName("td");
for(var x=0;x<tds.length;x++){
tds[x].style.filter="Alpha(Opacity="+_637*100+")";
}
}
node.style.filter="Alpha(Opacity="+_637*100+")";
}else{
if(h.moz){
node.style.opacity=_637;
node.style.MozOpacity=_637;
}else{
if(h.safari){
node.style.opacity=_637;
node.style.KhtmlOpacity=_637;
}else{
node.style.opacity=_637;
}
}
}
};
dojo.html.clearOpacity=function(node){
node=dojo.byId(node);
var ns=node.style;
var h=dojo.render.html;
if(h.ie){
try{
if(node.filters&&node.filters.alpha){
ns.filter="";
}
}
catch(e){
}
}else{
if(h.moz){
ns.opacity=1;
ns.MozOpacity=1;
}else{
if(h.safari){
ns.opacity=1;
ns.KhtmlOpacity=1;
}else{
ns.opacity=1;
}
}
}
};
dojo.html.getOpacity=function(node){
node=dojo.byId(node);
var h=dojo.render.html;
if(h.ie){
var opac=(node.filters&&node.filters.alpha&&typeof node.filters.alpha.opacity=="number"?node.filters.alpha.opacity:100)/100;
}else{
var opac=node.style.opacity||node.style.MozOpacity||node.style.KhtmlOpacity||1;
}
return opac>=0.999999?1:Number(opac);
};
dojo.provide("dojo.html.layout");
dojo.html.sumAncestorProperties=function(node,prop){
node=dojo.byId(node);
if(!node){
return 0;
}
var _644=0;
while(node){
if(dojo.html.getComputedStyle(node,"position")=="fixed"){
return 0;
}
var val=node[prop];
if(val){
_644+=val-0;
if(node==dojo.body()){
break;
}
}
node=node.parentNode;
}
return _644;
};
dojo.html.setStyleAttributes=function(node,_647){
node=dojo.byId(node);
var _648=_647.replace(/(;)?\s*$/,"").split(";");
for(var i=0;i<_648.length;i++){
var _64a=_648[i].split(":");
var name=_64a[0].replace(/\s*$/,"").replace(/^\s*/,"").toLowerCase();
var _64c=_64a[1].replace(/\s*$/,"").replace(/^\s*/,"");
switch(name){
case "opacity":
dojo.html.setOpacity(node,_64c);
break;
case "content-height":
dojo.html.setContentBox(node,{height:_64c});
break;
case "content-width":
dojo.html.setContentBox(node,{width:_64c});
break;
case "outer-height":
dojo.html.setMarginBox(node,{height:_64c});
break;
case "outer-width":
dojo.html.setMarginBox(node,{width:_64c});
break;
default:
node.style[dojo.html.toCamelCase(name)]=_64c;
}
}
};
dojo.html.boxSizing={MARGIN_BOX:"margin-box",BORDER_BOX:"border-box",PADDING_BOX:"padding-box",CONTENT_BOX:"content-box"};
dojo.html.getAbsolutePosition=dojo.html.abs=function(node,_64e,_64f){
node=dojo.byId(node,node.ownerDocument);
var ret={x:0,y:0};
var bs=dojo.html.boxSizing;
if(!_64f){
_64f=bs.CONTENT_BOX;
}
var _652=2;
var _653;
switch(_64f){
case bs.MARGIN_BOX:
_653=3;
break;
case bs.BORDER_BOX:
_653=2;
break;
case bs.PADDING_BOX:
default:
_653=1;
break;
case bs.CONTENT_BOX:
_653=0;
break;
}
var h=dojo.render.html;
var db=document["body"]||document["documentElement"];
if(h.ie){
with(node.getBoundingClientRect()){
ret.x=left-2;
ret.y=top-2;
}
}else{
if(document.getBoxObjectFor){
_652=1;
try{
var bo=document.getBoxObjectFor(node);
ret.x=bo.x-dojo.html.sumAncestorProperties(node,"scrollLeft");
ret.y=bo.y-dojo.html.sumAncestorProperties(node,"scrollTop");
}
catch(e){
}
}else{
if(node["offsetParent"]){
var _657;
if((h.safari)&&(node.style.getPropertyValue("position")=="absolute")&&(node.parentNode==db)){
_657=db;
}else{
_657=db.parentNode;
}
if(node.parentNode!=db){
var nd=node;
if(dojo.render.html.opera){
nd=db;
}
ret.x-=dojo.html.sumAncestorProperties(nd,"scrollLeft");
ret.y-=dojo.html.sumAncestorProperties(nd,"scrollTop");
}
var _659=node;
do{
var n=_659["offsetLeft"];
if(!h.opera||n>0){
ret.x+=isNaN(n)?0:n;
}
var m=_659["offsetTop"];
ret.y+=isNaN(m)?0:m;
_659=_659.offsetParent;
}while((_659!=_657)&&(_659!=null));
}else{
if(node["x"]&&node["y"]){
ret.x+=isNaN(node.x)?0:node.x;
ret.y+=isNaN(node.y)?0:node.y;
}
}
}
}
if(_64e){
var _65c=dojo.html.getScroll();
ret.y+=_65c.top;
ret.x+=_65c.left;
}
var _65d=[dojo.html.getPaddingExtent,dojo.html.getBorderExtent,dojo.html.getMarginExtent];
if(_652>_653){
for(var i=_653;i<_652;++i){
ret.y+=_65d[i](node,"top");
ret.x+=_65d[i](node,"left");
}
}else{
if(_652<_653){
for(var i=_653;i>_652;--i){
ret.y-=_65d[i-1](node,"top");
ret.x-=_65d[i-1](node,"left");
}
}
}
ret.top=ret.y;
ret.left=ret.x;
return ret;
};
dojo.html.isPositionAbsolute=function(node){
return (dojo.html.getComputedStyle(node,"position")=="absolute");
};
dojo.html._sumPixelValues=function(node,_661,_662){
var _663=0;
for(var x=0;x<_661.length;x++){
_663+=dojo.html.getPixelValue(node,_661[x],_662);
}
return _663;
};
dojo.html.getMargin=function(node){
return {width:dojo.html._sumPixelValues(node,["margin-left","margin-right"],(dojo.html.getComputedStyle(node,"position")=="absolute")),height:dojo.html._sumPixelValues(node,["margin-top","margin-bottom"],(dojo.html.getComputedStyle(node,"position")=="absolute"))};
};
dojo.html.getBorder=function(node){
return {width:dojo.html.getBorderExtent(node,"left")+dojo.html.getBorderExtent(node,"right"),height:dojo.html.getBorderExtent(node,"top")+dojo.html.getBorderExtent(node,"bottom")};
};
dojo.html.getBorderExtent=function(node,side){
return (dojo.html.getStyle(node,"border-"+side+"-style")=="none"?0:dojo.html.getPixelValue(node,"border-"+side+"-width"));
};
dojo.html.getMarginExtent=function(node,side){
return dojo.html._sumPixelValues(node,["margin-"+side],dojo.html.isPositionAbsolute(node));
};
dojo.html.getPaddingExtent=function(node,side){
return dojo.html._sumPixelValues(node,["padding-"+side],true);
};
dojo.html.getPadding=function(node){
return {width:dojo.html._sumPixelValues(node,["padding-left","padding-right"],true),height:dojo.html._sumPixelValues(node,["padding-top","padding-bottom"],true)};
};
dojo.html.getPadBorder=function(node){
var pad=dojo.html.getPadding(node);
var _670=dojo.html.getBorder(node);
return {width:pad.width+_670.width,height:pad.height+_670.height};
};
dojo.html.getBoxSizing=function(node){
var h=dojo.render.html;
var bs=dojo.html.boxSizing;
if((h.ie)||(h.opera)){
var cm=document["compatMode"];
if((cm=="BackCompat")||(cm=="QuirksMode")){
return bs.BORDER_BOX;
}else{
return bs.CONTENT_BOX;
}
}else{
if(arguments.length==0){
node=document.documentElement;
}
var _675=dojo.html.getStyle(node,"-moz-box-sizing");
if(!_675){
_675=dojo.html.getStyle(node,"box-sizing");
}
return (_675?_675:bs.CONTENT_BOX);
}
};
dojo.html.isBorderBox=function(node){
return (dojo.html.getBoxSizing(node)==dojo.html.boxSizing.BORDER_BOX);
};
dojo.html.getBorderBox=function(node){
node=dojo.byId(node);
return {width:node.offsetWidth,height:node.offsetHeight};
};
dojo.html.getPaddingBox=function(node){
var box=dojo.html.getBorderBox(node);
var _67a=dojo.html.getBorder(node);
return {width:box.width-_67a.width,height:box.height-_67a.height};
};
dojo.html.getContentBox=function(node){
node=dojo.byId(node);
var _67c=dojo.html.getPadBorder(node);
return {width:node.offsetWidth-_67c.width,height:node.offsetHeight-_67c.height};
};
dojo.html.setContentBox=function(node,args){
node=dojo.byId(node);
var _67f=0;
var _680=0;
var isbb=dojo.html.isBorderBox(node);
var _682=(isbb?dojo.html.getPadBorder(node):{width:0,height:0});
var ret={};
if(typeof args.width!="undefined"){
_67f=args.width+_682.width;
ret.width=dojo.html.setPositivePixelValue(node,"width",_67f);
}
if(typeof args.height!="undefined"){
_680=args.height+_682.height;
ret.height=dojo.html.setPositivePixelValue(node,"height",_680);
}
return ret;
};
dojo.html.getMarginBox=function(node){
var _685=dojo.html.getBorderBox(node);
var _686=dojo.html.getMargin(node);
return {width:_685.width+_686.width,height:_685.height+_686.height};
};
dojo.html.setMarginBox=function(node,args){
node=dojo.byId(node);
var _689=0;
var _68a=0;
var isbb=dojo.html.isBorderBox(node);
var _68c=(!isbb?dojo.html.getPadBorder(node):{width:0,height:0});
var _68d=dojo.html.getMargin(node);
var ret={};
if(typeof args.width!="undefined"){
_689=args.width-_68c.width;
_689-=_68d.width;
ret.width=dojo.html.setPositivePixelValue(node,"width",_689);
}
if(typeof args.height!="undefined"){
_68a=args.height-_68c.height;
_68a-=_68d.height;
ret.height=dojo.html.setPositivePixelValue(node,"height",_68a);
}
return ret;
};
dojo.html.getElementBox=function(node,type){
var bs=dojo.html.boxSizing;
switch(type){
case bs.MARGIN_BOX:
return dojo.html.getMarginBox(node);
case bs.BORDER_BOX:
return dojo.html.getBorderBox(node);
case bs.PADDING_BOX:
return dojo.html.getPaddingBox(node);
case bs.CONTENT_BOX:
default:
return dojo.html.getContentBox(node);
}
};
dojo.html.toCoordinateObject=dojo.html.toCoordinateArray=function(_692,_693,_694){
if(_692 instanceof Array||typeof _692=="array"){
dojo.deprecated("dojo.html.toCoordinateArray","use dojo.html.toCoordinateObject({left: , top: , width: , height: }) instead","0.5");
while(_692.length<4){
_692.push(0);
}
while(_692.length>4){
_692.pop();
}
var ret={left:_692[0],top:_692[1],width:_692[2],height:_692[3]};
}else{
if(!_692.nodeType&&!(_692 instanceof String||typeof _692=="string")&&("width" in _692||"height" in _692||"left" in _692||"x" in _692||"top" in _692||"y" in _692)){
var ret={left:_692.left||_692.x||0,top:_692.top||_692.y||0,width:_692.width||0,height:_692.height||0};
}else{
var node=dojo.byId(_692);
var pos=dojo.html.abs(node,_693,_694);
var _698=dojo.html.getMarginBox(node);
var ret={left:pos.left,top:pos.top,width:_698.width,height:_698.height};
}
}
ret.x=ret.left;
ret.y=ret.top;
return ret;
};
dojo.html.setMarginBoxWidth=dojo.html.setOuterWidth=function(node,_69a){
return dojo.html._callDeprecated("setMarginBoxWidth","setMarginBox",arguments,"width");
};
dojo.html.setMarginBoxHeight=dojo.html.setOuterHeight=function(){
return dojo.html._callDeprecated("setMarginBoxHeight","setMarginBox",arguments,"height");
};
dojo.html.getMarginBoxWidth=dojo.html.getOuterWidth=function(){
return dojo.html._callDeprecated("getMarginBoxWidth","getMarginBox",arguments,null,"width");
};
dojo.html.getMarginBoxHeight=dojo.html.getOuterHeight=function(){
return dojo.html._callDeprecated("getMarginBoxHeight","getMarginBox",arguments,null,"height");
};
dojo.html.getTotalOffset=function(node,type,_69d){
return dojo.html._callDeprecated("getTotalOffset","getAbsolutePosition",arguments,null,type);
};
dojo.html.getAbsoluteX=function(node,_69f){
return dojo.html._callDeprecated("getAbsoluteX","getAbsolutePosition",arguments,null,"x");
};
dojo.html.getAbsoluteY=function(node,_6a1){
return dojo.html._callDeprecated("getAbsoluteY","getAbsolutePosition",arguments,null,"y");
};
dojo.html.totalOffsetLeft=function(node,_6a3){
return dojo.html._callDeprecated("totalOffsetLeft","getAbsolutePosition",arguments,null,"left");
};
dojo.html.totalOffsetTop=function(node,_6a5){
return dojo.html._callDeprecated("totalOffsetTop","getAbsolutePosition",arguments,null,"top");
};
dojo.html.getMarginWidth=function(node){
return dojo.html._callDeprecated("getMarginWidth","getMargin",arguments,null,"width");
};
dojo.html.getMarginHeight=function(node){
return dojo.html._callDeprecated("getMarginHeight","getMargin",arguments,null,"height");
};
dojo.html.getBorderWidth=function(node){
return dojo.html._callDeprecated("getBorderWidth","getBorder",arguments,null,"width");
};
dojo.html.getBorderHeight=function(node){
return dojo.html._callDeprecated("getBorderHeight","getBorder",arguments,null,"height");
};
dojo.html.getPaddingWidth=function(node){
return dojo.html._callDeprecated("getPaddingWidth","getPadding",arguments,null,"width");
};
dojo.html.getPaddingHeight=function(node){
return dojo.html._callDeprecated("getPaddingHeight","getPadding",arguments,null,"height");
};
dojo.html.getPadBorderWidth=function(node){
return dojo.html._callDeprecated("getPadBorderWidth","getPadBorder",arguments,null,"width");
};
dojo.html.getPadBorderHeight=function(node){
return dojo.html._callDeprecated("getPadBorderHeight","getPadBorder",arguments,null,"height");
};
dojo.html.getBorderBoxWidth=dojo.html.getInnerWidth=function(){
return dojo.html._callDeprecated("getBorderBoxWidth","getBorderBox",arguments,null,"width");
};
dojo.html.getBorderBoxHeight=dojo.html.getInnerHeight=function(){
return dojo.html._callDeprecated("getBorderBoxHeight","getBorderBox",arguments,null,"height");
};
dojo.html.getContentBoxWidth=dojo.html.getContentWidth=function(){
return dojo.html._callDeprecated("getContentBoxWidth","getContentBox",arguments,null,"width");
};
dojo.html.getContentBoxHeight=dojo.html.getContentHeight=function(){
return dojo.html._callDeprecated("getContentBoxHeight","getContentBox",arguments,null,"height");
};
dojo.html.setContentBoxWidth=dojo.html.setContentWidth=function(node,_6af){
return dojo.html._callDeprecated("setContentBoxWidth","setContentBox",arguments,"width");
};
dojo.html.setContentBoxHeight=dojo.html.setContentHeight=function(node,_6b1){
return dojo.html._callDeprecated("setContentBoxHeight","setContentBox",arguments,"height");
};
dojo.provide("dojo.html.util");
dojo.html.getElementWindow=function(_6b2){
return dojo.html.getDocumentWindow(_6b2.ownerDocument);
};
dojo.html.getDocumentWindow=function(doc){
if(dojo.render.html.safari&&!doc._parentWindow){
var fix=function(win){
win.document._parentWindow=win;
for(var i=0;i<win.frames.length;i++){
fix(win.frames[i]);
}
};
fix(window.top);
}
if(dojo.render.html.ie&&window!==document.parentWindow&&!doc._parentWindow){
doc.parentWindow.execScript("document._parentWindow = window;","Javascript");
var win=doc._parentWindow;
doc._parentWindow=null;
return win;
}
return doc._parentWindow||doc.parentWindow||doc.defaultView;
};
dojo.html.gravity=function(node,e){
node=dojo.byId(node);
var _6ba=dojo.html.getCursorPosition(e);
with(dojo.html){
var _6bb=getAbsolutePosition(node,true);
var bb=getBorderBox(node);
var _6bd=_6bb.x+(bb.width/2);
var _6be=_6bb.y+(bb.height/2);
}
with(dojo.html.gravity){
return ((_6ba.x<_6bd?WEST:EAST)|(_6ba.y<_6be?NORTH:SOUTH));
}
};
dojo.html.gravity.NORTH=1;
dojo.html.gravity.SOUTH=1<<1;
dojo.html.gravity.EAST=1<<2;
dojo.html.gravity.WEST=1<<3;
dojo.html.overElement=function(_6bf,e){
_6bf=dojo.byId(_6bf);
var _6c1=dojo.html.getCursorPosition(e);
var bb=dojo.html.getBorderBox(_6bf);
var _6c3=dojo.html.getAbsolutePosition(_6bf,true,dojo.html.boxSizing.BORDER_BOX);
var top=_6c3.y;
var _6c5=top+bb.height;
var left=_6c3.x;
var _6c7=left+bb.width;
return (_6c1.x>=left&&_6c1.x<=_6c7&&_6c1.y>=top&&_6c1.y<=_6c5);
};
dojo.html.renderedTextContent=function(node){
node=dojo.byId(node);
var _6c9="";
if(node==null){
return _6c9;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
var _6cb="unknown";
try{
_6cb=dojo.html.getStyle(node.childNodes[i],"display");
}
catch(E){
}
switch(_6cb){
case "block":
case "list-item":
case "run-in":
case "table":
case "table-row-group":
case "table-header-group":
case "table-footer-group":
case "table-row":
case "table-column-group":
case "table-column":
case "table-cell":
case "table-caption":
_6c9+="\n";
_6c9+=dojo.html.renderedTextContent(node.childNodes[i]);
_6c9+="\n";
break;
case "none":
break;
default:
if(node.childNodes[i].tagName&&node.childNodes[i].tagName.toLowerCase()=="br"){
_6c9+="\n";
}else{
_6c9+=dojo.html.renderedTextContent(node.childNodes[i]);
}
break;
}
break;
case 3:
case 2:
case 4:
var text=node.childNodes[i].nodeValue;
var _6cd="unknown";
try{
_6cd=dojo.html.getStyle(node,"text-transform");
}
catch(E){
}
switch(_6cd){
case "capitalize":
var _6ce=text.split(" ");
for(var i=0;i<_6ce.length;i++){
_6ce[i]=_6ce[i].charAt(0).toUpperCase()+_6ce[i].substring(1);
}
text=_6ce.join(" ");
break;
case "uppercase":
text=text.toUpperCase();
break;
case "lowercase":
text=text.toLowerCase();
break;
default:
break;
}
switch(_6cd){
case "nowrap":
break;
case "pre-wrap":
break;
case "pre-line":
break;
case "pre":
break;
default:
text=text.replace(/\s+/," ");
if(/\s$/.test(_6c9)){
text.replace(/^\s/,"");
}
break;
}
_6c9+=text;
break;
default:
break;
}
}
return _6c9;
};
dojo.html.createNodesFromText=function(txt,trim){
if(trim){
txt=txt.replace(/^\s+|\s+$/g,"");
}
var tn=dojo.doc().createElement("div");
tn.style.visibility="hidden";
dojo.body().appendChild(tn);
var _6d2="none";
if((/^<t[dh][\s\r\n>]/i).test(txt.replace(/^\s+/))){
txt="<table><tbody><tr>"+txt+"</tr></tbody></table>";
_6d2="cell";
}else{
if((/^<tr[\s\r\n>]/i).test(txt.replace(/^\s+/))){
txt="<table><tbody>"+txt+"</tbody></table>";
_6d2="row";
}else{
if((/^<(thead|tbody|tfoot)[\s\r\n>]/i).test(txt.replace(/^\s+/))){
txt="<table>"+txt+"</table>";
_6d2="section";
}
}
}
tn.innerHTML=txt;
if(tn["normalize"]){
tn.normalize();
}
var _6d3=null;
switch(_6d2){
case "cell":
_6d3=tn.getElementsByTagName("tr")[0];
break;
case "row":
_6d3=tn.getElementsByTagName("tbody")[0];
break;
case "section":
_6d3=tn.getElementsByTagName("table")[0];
break;
default:
_6d3=tn;
break;
}
var _6d4=[];
for(var x=0;x<_6d3.childNodes.length;x++){
_6d4.push(_6d3.childNodes[x].cloneNode(true));
}
tn.style.display="none";
dojo.body().removeChild(tn);
return _6d4;
};
dojo.html.placeOnScreen=function(node,_6d7,_6d8,_6d9,_6da,_6db,_6dc){
if(_6d7 instanceof Array||typeof _6d7=="array"){
_6dc=_6db;
_6db=_6da;
_6da=_6d9;
_6d9=_6d8;
_6d8=_6d7[1];
_6d7=_6d7[0];
}
if(_6db instanceof String||typeof _6db=="string"){
_6db=_6db.split(",");
}
if(!isNaN(_6d9)){
_6d9=[Number(_6d9),Number(_6d9)];
}else{
if(!(_6d9 instanceof Array||typeof _6d9=="array")){
_6d9=[0,0];
}
}
var _6dd=dojo.html.getScroll().offset;
var view=dojo.html.getViewport();
node=dojo.byId(node);
var _6df=node.style.display;
node.style.display="";
var bb=dojo.html.getBorderBox(node);
var w=bb.width;
var h=bb.height;
node.style.display=_6df;
if(!(_6db instanceof Array||typeof _6db=="array")){
_6db=["TL"];
}
var _6e3,_6e4,_6e5=Infinity,_6e6;
for(var _6e7=0;_6e7<_6db.length;++_6e7){
var _6e8=_6db[_6e7];
var _6e9=true;
var tryX=_6d7-(_6e8.charAt(1)=="L"?0:w)+_6d9[0]*(_6e8.charAt(1)=="L"?1:-1);
var tryY=_6d8-(_6e8.charAt(0)=="T"?0:h)+_6d9[1]*(_6e8.charAt(0)=="T"?1:-1);
if(_6da){
tryX-=_6dd.x;
tryY-=_6dd.y;
}
if(tryX<0){
tryX=0;
_6e9=false;
}
if(tryY<0){
tryY=0;
_6e9=false;
}
var x=tryX+w;
if(x>view.width){
x=view.width-w;
_6e9=false;
}else{
x=tryX;
}
x=Math.max(_6d9[0],x)+_6dd.x;
var y=tryY+h;
if(y>view.height){
y=view.height-h;
_6e9=false;
}else{
y=tryY;
}
y=Math.max(_6d9[1],y)+_6dd.y;
if(_6e9){
_6e3=x;
_6e4=y;
_6e5=0;
_6e6=_6e8;
break;
}else{
var dist=Math.pow(x-tryX-_6dd.x,2)+Math.pow(y-tryY-_6dd.y,2);
if(_6e5>dist){
_6e5=dist;
_6e3=x;
_6e4=y;
_6e6=_6e8;
}
}
}
if(!_6dc){
node.style.left=_6e3+"px";
node.style.top=_6e4+"px";
}
return {left:_6e3,top:_6e4,x:_6e3,y:_6e4,dist:_6e5,corner:_6e6};
};
dojo.html.placeOnScreenPoint=function(node,_6f0,_6f1,_6f2,_6f3){
dojo.deprecated("dojo.html.placeOnScreenPoint","use dojo.html.placeOnScreen() instead","0.5");
return dojo.html.placeOnScreen(node,_6f0,_6f1,_6f2,_6f3,["TL","TR","BL","BR"]);
};
dojo.html.placeOnScreenAroundElement=function(node,_6f5,_6f6,_6f7,_6f8,_6f9){
var best,_6fb=Infinity;
_6f5=dojo.byId(_6f5);
var _6fc=_6f5.style.display;
_6f5.style.display="";
var mb=dojo.html.getElementBox(_6f5,_6f7);
var _6fe=mb.width;
var _6ff=mb.height;
var _700=dojo.html.getAbsolutePosition(_6f5,true,_6f7);
_6f5.style.display=_6fc;
for(var _701 in _6f8){
var pos,_703,_704;
var _705=_6f8[_701];
_703=_700.x+(_701.charAt(1)=="L"?0:_6fe);
_704=_700.y+(_701.charAt(0)=="T"?0:_6ff);
pos=dojo.html.placeOnScreen(node,_703,_704,_6f6,true,_705,true);
if(pos.dist==0){
best=pos;
break;
}else{
if(_6fb>pos.dist){
_6fb=pos.dist;
best=pos;
}
}
}
if(!_6f9){
node.style.left=best.left+"px";
node.style.top=best.top+"px";
}
return best;
};
dojo.html.scrollIntoView=function(node){
if(!node){
return;
}
if(dojo.render.html.ie){
if(dojo.html.getBorderBox(node.parentNode).height<node.parentNode.scrollHeight){
node.scrollIntoView(false);
}
}else{
if(dojo.render.html.mozilla){
node.scrollIntoView(false);
}else{
var _707=node.parentNode;
var _708=_707.scrollTop+dojo.html.getBorderBox(_707).height;
var _709=node.offsetTop+dojo.html.getMarginBox(node).height;
if(_708<_709){
_707.scrollTop+=(_709-_708);
}else{
if(_707.scrollTop>node.offsetTop){
_707.scrollTop-=(_707.scrollTop-node.offsetTop);
}
}
}
}
};
dojo.provide("dojo.gfx.color");
dojo.gfx.color.Color=function(r,g,b,a){
if(dojo.lang.isArray(r)){
this.r=r[0];
this.g=r[1];
this.b=r[2];
this.a=r[3]||1;
}else{
if(dojo.lang.isString(r)){
var rgb=dojo.gfx.color.extractRGB(r);
this.r=rgb[0];
this.g=rgb[1];
this.b=rgb[2];
this.a=g||1;
}else{
if(r instanceof dojo.gfx.color.Color){
this.r=r.r;
this.b=r.b;
this.g=r.g;
this.a=r.a;
}else{
this.r=r;
this.g=g;
this.b=b;
this.a=a;
}
}
}
};
dojo.gfx.color.Color.fromArray=function(arr){
return new dojo.gfx.color.Color(arr[0],arr[1],arr[2],arr[3]);
};
dojo.extend(dojo.gfx.color.Color,{toRgb:function(_710){
if(_710){
return this.toRgba();
}else{
return [this.r,this.g,this.b];
}
},toRgba:function(){
return [this.r,this.g,this.b,this.a];
},toHex:function(){
return dojo.gfx.color.rgb2hex(this.toRgb());
},toCss:function(){
return "rgb("+this.toRgb().join()+")";
},toString:function(){
return this.toHex();
},blend:function(_711,_712){
var rgb=null;
if(dojo.lang.isArray(_711)){
rgb=_711;
}else{
if(_711 instanceof dojo.gfx.color.Color){
rgb=_711.toRgb();
}else{
rgb=new dojo.gfx.color.Color(_711).toRgb();
}
}
return dojo.gfx.color.blend(this.toRgb(),rgb,_712);
}});
dojo.gfx.color.named={white:[255,255,255],black:[0,0,0],red:[255,0,0],green:[0,255,0],lime:[0,255,0],blue:[0,0,255],navy:[0,0,128],gray:[128,128,128],silver:[192,192,192]};
dojo.gfx.color.blend=function(a,b,_716){
if(typeof a=="string"){
return dojo.gfx.color.blendHex(a,b,_716);
}
if(!_716){
_716=0;
}
_716=Math.min(Math.max(-1,_716),1);
_716=((_716+1)/2);
var c=[];
for(var x=0;x<3;x++){
c[x]=parseInt(b[x]+((a[x]-b[x])*_716));
}
return c;
};
dojo.gfx.color.blendHex=function(a,b,_71b){
return dojo.gfx.color.rgb2hex(dojo.gfx.color.blend(dojo.gfx.color.hex2rgb(a),dojo.gfx.color.hex2rgb(b),_71b));
};
dojo.gfx.color.extractRGB=function(_71c){
var hex="0123456789abcdef";
_71c=_71c.toLowerCase();
if(_71c.indexOf("rgb")==0){
var _71e=_71c.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
var ret=_71e.splice(1,3);
return ret;
}else{
var _720=dojo.gfx.color.hex2rgb(_71c);
if(_720){
return _720;
}else{
return dojo.gfx.color.named[_71c]||[255,255,255];
}
}
};
dojo.gfx.color.hex2rgb=function(hex){
var _722="0123456789ABCDEF";
var rgb=new Array(3);
if(hex.indexOf("#")==0){
hex=hex.substring(1);
}
hex=hex.toUpperCase();
if(hex.replace(new RegExp("["+_722+"]","g"),"")!=""){
return null;
}
if(hex.length==3){
rgb[0]=hex.charAt(0)+hex.charAt(0);
rgb[1]=hex.charAt(1)+hex.charAt(1);
rgb[2]=hex.charAt(2)+hex.charAt(2);
}else{
rgb[0]=hex.substring(0,2);
rgb[1]=hex.substring(2,4);
rgb[2]=hex.substring(4);
}
for(var i=0;i<rgb.length;i++){
rgb[i]=_722.indexOf(rgb[i].charAt(0))*16+_722.indexOf(rgb[i].charAt(1));
}
return rgb;
};
dojo.gfx.color.rgb2hex=function(r,g,b){
if(dojo.lang.isArray(r)){
g=r[1]||0;
b=r[2]||0;
r=r[0]||0;
}
var ret=dojo.lang.map([r,g,b],function(x){
x=new Number(x);
var s=x.toString(16);
while(s.length<2){
s="0"+s;
}
return s;
});
ret.unshift("#");
return ret.join("");
};
dojo.provide("dojo.lfx.Animation");
dojo.lfx.Line=function(_72b,end){
this.start=_72b;
this.end=end;
if(dojo.lang.isArray(_72b)){
var diff=[];
dojo.lang.forEach(this.start,function(s,i){
diff[i]=this.end[i]-s;
},this);
this.getValue=function(n){
var res=[];
dojo.lang.forEach(this.start,function(s,i){
res[i]=(diff[i]*n)+s;
},this);
return res;
};
}else{
var diff=end-_72b;
this.getValue=function(n){
return (diff*n)+this.start;
};
}
};
dojo.lfx.easeDefault=function(n){
if(dojo.render.html.khtml){
return (parseFloat("0.5")+((Math.sin((n+parseFloat("1.5"))*Math.PI))/2));
}else{
return (0.5+((Math.sin((n+1.5)*Math.PI))/2));
}
};
dojo.lfx.easeIn=function(n){
return Math.pow(n,3);
};
dojo.lfx.easeOut=function(n){
return (1-Math.pow(1-n,3));
};
dojo.lfx.easeInOut=function(n){
return ((3*Math.pow(n,2))-(2*Math.pow(n,3)));
};
dojo.lfx.IAnimation=function(){
};
dojo.lang.extend(dojo.lfx.IAnimation,{curve:null,duration:1000,easing:null,repeatCount:0,rate:25,handler:null,beforeBegin:null,onBegin:null,onAnimate:null,onEnd:null,onPlay:null,onPause:null,onStop:null,play:null,pause:null,stop:null,connect:function(evt,_73a,_73b){
if(!_73b){
_73b=_73a;
_73a=this;
}
_73b=dojo.lang.hitch(_73a,_73b);
var _73c=this[evt]||function(){
};
this[evt]=function(){
var ret=_73c.apply(this,arguments);
_73b.apply(this,arguments);
return ret;
};
return this;
},fire:function(evt,args){
if(this[evt]){
this[evt].apply(this,(args||[]));
}
return this;
},repeat:function(_740){
this.repeatCount=_740;
return this;
},_active:false,_paused:false});
dojo.lfx.Animation=function(_741,_742,_743,_744,_745,rate){
dojo.lfx.IAnimation.call(this);
if(dojo.lang.isNumber(_741)||(!_741&&_742.getValue)){
rate=_745;
_745=_744;
_744=_743;
_743=_742;
_742=_741;
_741=null;
}else{
if(_741.getValue||dojo.lang.isArray(_741)){
rate=_744;
_745=_743;
_744=_742;
_743=_741;
_742=null;
_741=null;
}
}
if(dojo.lang.isArray(_743)){
this.curve=new dojo.lfx.Line(_743[0],_743[1]);
}else{
this.curve=_743;
}
if(_742!=null&&_742>0){
this.duration=_742;
}
if(_745){
this.repeatCount=_745;
}
if(rate){
this.rate=rate;
}
if(_741){
dojo.lang.forEach(["handler","beforeBegin","onBegin","onEnd","onPlay","onStop","onAnimate"],function(item){
if(_741[item]){
this.connect(item,_741[item]);
}
},this);
}
if(_744&&dojo.lang.isFunction(_744)){
this.easing=_744;
}
};
dojo.inherits(dojo.lfx.Animation,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Animation,{_startTime:null,_endTime:null,_timer:null,_percent:0,_startRepeatCount:0,play:function(_748,_749){
if(_749){
clearTimeout(this._timer);
this._active=false;
this._paused=false;
this._percent=0;
}else{
if(this._active&&!this._paused){
return this;
}
}
this.fire("handler",["beforeBegin"]);
this.fire("beforeBegin");
if(_748>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_749);
}),_748);
return this;
}
this._startTime=new Date().valueOf();
if(this._paused){
this._startTime-=(this.duration*this._percent/100);
}
this._endTime=this._startTime+this.duration;
this._active=true;
this._paused=false;
var step=this._percent/100;
var _74b=this.curve.getValue(step);
if(this._percent==0){
if(!this._startRepeatCount){
this._startRepeatCount=this.repeatCount;
}
this.fire("handler",["begin",_74b]);
this.fire("onBegin",[_74b]);
}
this.fire("handler",["play",_74b]);
this.fire("onPlay",[_74b]);
this._cycle();
return this;
},pause:function(){
clearTimeout(this._timer);
if(!this._active){
return this;
}
this._paused=true;
var _74c=this.curve.getValue(this._percent/100);
this.fire("handler",["pause",_74c]);
this.fire("onPause",[_74c]);
return this;
},gotoPercent:function(pct,_74e){
clearTimeout(this._timer);
this._active=true;
this._paused=true;
this._percent=pct;
if(_74e){
this.play();
}
return this;
},stop:function(_74f){
clearTimeout(this._timer);
var step=this._percent/100;
if(_74f){
step=1;
}
var _751=this.curve.getValue(step);
this.fire("handler",["stop",_751]);
this.fire("onStop",[_751]);
this._active=false;
this._paused=false;
return this;
},status:function(){
if(this._active){
return this._paused?"paused":"playing";
}else{
return "stopped";
}
return this;
},_cycle:function(){
clearTimeout(this._timer);
if(this._active){
var curr=new Date().valueOf();
var step=(curr-this._startTime)/(this._endTime-this._startTime);
if(step>=1){
step=1;
this._percent=100;
}else{
this._percent=step*100;
}
if((this.easing)&&(dojo.lang.isFunction(this.easing))){
step=this.easing(step);
}
var _754=this.curve.getValue(step);
this.fire("handler",["animate",_754]);
this.fire("onAnimate",[_754]);
if(step<1){
this._timer=setTimeout(dojo.lang.hitch(this,"_cycle"),this.rate);
}else{
this._active=false;
this.fire("handler",["end"]);
this.fire("onEnd");
if(this.repeatCount>0){
this.repeatCount--;
this.play(null,true);
}else{
if(this.repeatCount==-1){
this.play(null,true);
}else{
if(this._startRepeatCount){
this.repeatCount=this._startRepeatCount;
this._startRepeatCount=0;
}
}
}
}
}
return this;
}});
dojo.lfx.Combine=function(_755){
dojo.lfx.IAnimation.call(this);
this._anims=[];
this._animsEnded=0;
var _756=arguments;
if(_756.length==1&&(dojo.lang.isArray(_756[0])||dojo.lang.isArrayLike(_756[0]))){
_756=_756[0];
}
dojo.lang.forEach(_756,function(anim){
this._anims.push(anim);
anim.connect("onEnd",dojo.lang.hitch(this,"_onAnimsEnded"));
},this);
};
dojo.inherits(dojo.lfx.Combine,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Combine,{_animsEnded:0,play:function(_758,_759){
if(!this._anims.length){
return this;
}
this.fire("beforeBegin");
if(_758>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_759);
}),_758);
return this;
}
if(_759||this._anims[0].percent==0){
this.fire("onBegin");
}
this.fire("onPlay");
this._animsCall("play",null,_759);
return this;
},pause:function(){
this.fire("onPause");
this._animsCall("pause");
return this;
},stop:function(_75a){
this.fire("onStop");
this._animsCall("stop",_75a);
return this;
},_onAnimsEnded:function(){
this._animsEnded++;
if(this._animsEnded>=this._anims.length){
this.fire("onEnd");
}
return this;
},_animsCall:function(_75b){
var args=[];
if(arguments.length>1){
for(var i=1;i<arguments.length;i++){
args.push(arguments[i]);
}
}
var _75e=this;
dojo.lang.forEach(this._anims,function(anim){
anim[_75b](args);
},_75e);
return this;
}});
dojo.lfx.Chain=function(_760){
dojo.lfx.IAnimation.call(this);
this._anims=[];
this._currAnim=-1;
var _761=arguments;
if(_761.length==1&&(dojo.lang.isArray(_761[0])||dojo.lang.isArrayLike(_761[0]))){
_761=_761[0];
}
var _762=this;
dojo.lang.forEach(_761,function(anim,i,_765){
this._anims.push(anim);
if(i<_765.length-1){
anim.connect("onEnd",dojo.lang.hitch(this,"_playNext"));
}else{
anim.connect("onEnd",dojo.lang.hitch(this,function(){
this.fire("onEnd");
}));
}
},this);
};
dojo.inherits(dojo.lfx.Chain,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Chain,{_currAnim:-1,play:function(_766,_767){
if(!this._anims.length){
return this;
}
if(_767||!this._anims[this._currAnim]){
this._currAnim=0;
}
var _768=this._anims[this._currAnim];
this.fire("beforeBegin");
if(_766>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_767);
}),_766);
return this;
}
if(_768){
if(this._currAnim==0){
this.fire("handler",["begin",this._currAnim]);
this.fire("onBegin",[this._currAnim]);
}
this.fire("onPlay",[this._currAnim]);
_768.play(null,_767);
}
return this;
},pause:function(){
if(this._anims[this._currAnim]){
this._anims[this._currAnim].pause();
this.fire("onPause",[this._currAnim]);
}
return this;
},playPause:function(){
if(this._anims.length==0){
return this;
}
if(this._currAnim==-1){
this._currAnim=0;
}
var _769=this._anims[this._currAnim];
if(_769){
if(!_769._active||_769._paused){
this.play();
}else{
this.pause();
}
}
return this;
},stop:function(){
var _76a=this._anims[this._currAnim];
if(_76a){
_76a.stop();
this.fire("onStop",[this._currAnim]);
}
return _76a;
},_playNext:function(){
if(this._currAnim==-1||this._anims.length==0){
return this;
}
this._currAnim++;
if(this._anims[this._currAnim]){
this._anims[this._currAnim].play(null,true);
}
return this;
}});
dojo.lfx.combine=function(_76b){
var _76c=arguments;
if(dojo.lang.isArray(arguments[0])){
_76c=arguments[0];
}
if(_76c.length==1){
return _76c[0];
}
return new dojo.lfx.Combine(_76c);
};
dojo.lfx.chain=function(_76d){
var _76e=arguments;
if(dojo.lang.isArray(arguments[0])){
_76e=arguments[0];
}
if(_76e.length==1){
return _76e[0];
}
return new dojo.lfx.Chain(_76e);
};
dojo.provide("dojo.html.color");
dojo.html.getBackgroundColor=function(node){
node=dojo.byId(node);
var _770;
do{
_770=dojo.html.getStyle(node,"background-color");
if(_770.toLowerCase()=="rgba(0, 0, 0, 0)"){
_770="transparent";
}
if(node==document.getElementsByTagName("body")[0]){
node=null;
break;
}
node=node.parentNode;
}while(node&&dojo.lang.inArray(["transparent",""],_770));
if(_770=="transparent"){
_770=[255,255,255,0];
}else{
_770=dojo.gfx.color.extractRGB(_770);
}
return _770;
};
dojo.provide("dojo.lfx.html");
dojo.lfx.html._byId=function(_771){
if(!_771){
return [];
}
if(dojo.lang.isArrayLike(_771)){
if(!_771.alreadyChecked){
var n=[];
dojo.lang.forEach(_771,function(node){
n.push(dojo.byId(node));
});
n.alreadyChecked=true;
return n;
}else{
return _771;
}
}else{
var n=[];
n.push(dojo.byId(_771));
n.alreadyChecked=true;
return n;
}
};
dojo.lfx.html.propertyAnimation=function(_774,_775,_776,_777,_778){
_774=dojo.lfx.html._byId(_774);
var _779={"propertyMap":_775,"nodes":_774,"duration":_776,"easing":_777||dojo.lfx.easeDefault};
var _77a=function(args){
if(args.nodes.length==1){
var pm=args.propertyMap;
if(!dojo.lang.isArray(args.propertyMap)){
var parr=[];
for(var _77e in pm){
pm[_77e].property=_77e;
parr.push(pm[_77e]);
}
pm=args.propertyMap=parr;
}
dojo.lang.forEach(pm,function(prop){
if(dj_undef("start",prop)){
if(prop.property!="opacity"){
prop.start=parseInt(dojo.html.getComputedStyle(args.nodes[0],prop.property));
}else{
prop.start=dojo.html.getOpacity(args.nodes[0]);
}
}
});
}
};
var _780=function(_781){
var _782=[];
dojo.lang.forEach(_781,function(c){
_782.push(Math.round(c));
});
return _782;
};
var _784=function(n,_786){
n=dojo.byId(n);
if(!n||!n.style){
return;
}
for(var s in _786){
if(s=="opacity"){
dojo.html.setOpacity(n,_786[s]);
}else{
n.style[s]=_786[s];
}
}
};
var _788=function(_789){
this._properties=_789;
this.diffs=new Array(_789.length);
dojo.lang.forEach(_789,function(prop,i){
if(dojo.lang.isFunction(prop.start)){
prop.start=prop.start(prop,i);
}
if(dojo.lang.isFunction(prop.end)){
prop.end=prop.end(prop,i);
}
if(dojo.lang.isArray(prop.start)){
this.diffs[i]=null;
}else{
if(prop.start instanceof dojo.gfx.color.Color){
prop.startRgb=prop.start.toRgb();
prop.endRgb=prop.end.toRgb();
}else{
this.diffs[i]=prop.end-prop.start;
}
}
},this);
this.getValue=function(n){
var ret={};
dojo.lang.forEach(this._properties,function(prop,i){
var _790=null;
if(dojo.lang.isArray(prop.start)){
}else{
if(prop.start instanceof dojo.gfx.color.Color){
_790=(prop.units||"rgb")+"(";
for(var j=0;j<prop.startRgb.length;j++){
_790+=Math.round(((prop.endRgb[j]-prop.startRgb[j])*n)+prop.startRgb[j])+(j<prop.startRgb.length-1?",":"");
}
_790+=")";
}else{
_790=((this.diffs[i])*n)+prop.start+(prop.property!="opacity"?prop.units||"px":"");
}
}
ret[dojo.html.toCamelCase(prop.property)]=_790;
},this);
return ret;
};
};
var anim=new dojo.lfx.Animation({beforeBegin:function(){
_77a(_779);
anim.curve=new _788(_779.propertyMap);
},onAnimate:function(_793){
dojo.lang.forEach(_779.nodes,function(node){
_784(node,_793);
});
}},_779.duration,null,_779.easing);
if(_778){
for(var x in _778){
if(dojo.lang.isFunction(_778[x])){
anim.connect(x,anim,_778[x]);
}
}
}
return anim;
};
dojo.lfx.html._makeFadeable=function(_796){
var _797=function(node){
if(dojo.render.html.ie){
if((node.style.zoom.length==0)&&(dojo.html.getStyle(node,"zoom")=="normal")){
node.style.zoom="1";
}
if((node.style.width.length==0)&&(dojo.html.getStyle(node,"width")=="auto")){
node.style.width="auto";
}
}
};
if(dojo.lang.isArrayLike(_796)){
dojo.lang.forEach(_796,_797);
}else{
_797(_796);
}
};
dojo.lfx.html.fade=function(_799,_79a,_79b,_79c,_79d){
_799=dojo.lfx.html._byId(_799);
var _79e={property:"opacity"};
if(!dj_undef("start",_79a)){
_79e.start=_79a.start;
}else{
_79e.start=function(){
return dojo.html.getOpacity(_799[0]);
};
}
if(!dj_undef("end",_79a)){
_79e.end=_79a.end;
}else{
dojo.raise("dojo.lfx.html.fade needs an end value");
}
var anim=dojo.lfx.propertyAnimation(_799,[_79e],_79b,_79c);
anim.connect("beforeBegin",function(){
dojo.lfx.html._makeFadeable(_799);
});
if(_79d){
anim.connect("onEnd",function(){
_79d(_799,anim);
});
}
return anim;
};
dojo.lfx.html.fadeIn=function(_7a0,_7a1,_7a2,_7a3){
return dojo.lfx.html.fade(_7a0,{end:1},_7a1,_7a2,_7a3);
};
dojo.lfx.html.fadeOut=function(_7a4,_7a5,_7a6,_7a7){
return dojo.lfx.html.fade(_7a4,{end:0},_7a5,_7a6,_7a7);
};
dojo.lfx.html.fadeShow=function(_7a8,_7a9,_7aa,_7ab){
_7a8=dojo.lfx.html._byId(_7a8);
dojo.lang.forEach(_7a8,function(node){
dojo.html.setOpacity(node,0);
});
var anim=dojo.lfx.html.fadeIn(_7a8,_7a9,_7aa,_7ab);
anim.connect("beforeBegin",function(){
if(dojo.lang.isArrayLike(_7a8)){
dojo.lang.forEach(_7a8,dojo.html.show);
}else{
dojo.html.show(_7a8);
}
});
return anim;
};
dojo.lfx.html.fadeHide=function(_7ae,_7af,_7b0,_7b1){
var anim=dojo.lfx.html.fadeOut(_7ae,_7af,_7b0,function(){
if(dojo.lang.isArrayLike(_7ae)){
dojo.lang.forEach(_7ae,dojo.html.hide);
}else{
dojo.html.hide(_7ae);
}
if(_7b1){
_7b1(_7ae,anim);
}
});
return anim;
};
dojo.lfx.html.wipeIn=function(_7b3,_7b4,_7b5,_7b6){
_7b3=dojo.lfx.html._byId(_7b3);
var _7b7=[];
dojo.lang.forEach(_7b3,function(node){
var _7b9={};
dojo.html.show(node);
var _7ba=dojo.html.getBorderBox(node).height;
dojo.html.hide(node);
var anim=dojo.lfx.propertyAnimation(node,{"height":{start:1,end:function(){
return _7ba;
}}},_7b4,_7b5);
anim.connect("beforeBegin",function(){
_7b9.overflow=node.style.overflow;
_7b9.height=node.style.height;
with(node.style){
overflow="hidden";
_7ba="1px";
}
dojo.html.show(node);
});
anim.connect("onEnd",function(){
with(node.style){
overflow=_7b9.overflow;
_7ba=_7b9.height;
}
if(_7b6){
_7b6(node,anim);
}
});
_7b7.push(anim);
});
return dojo.lfx.combine(_7b7);
};
dojo.lfx.html.wipeOut=function(_7bc,_7bd,_7be,_7bf){
_7bc=dojo.lfx.html._byId(_7bc);
var _7c0=[];
dojo.lang.forEach(_7bc,function(node){
var _7c2={};
var anim=dojo.lfx.propertyAnimation(node,{"height":{start:function(){
return dojo.html.getContentBox(node).height;
},end:1}},_7bd,_7be,{"beforeBegin":function(){
_7c2.overflow=node.style.overflow;
_7c2.height=node.style.height;
with(node.style){
overflow="hidden";
}
dojo.html.show(node);
},"onEnd":function(){
dojo.html.hide(node);
with(node.style){
overflow=_7c2.overflow;
height=_7c2.height;
}
if(_7bf){
_7bf(node,anim);
}
}});
_7c0.push(anim);
});
return dojo.lfx.combine(_7c0);
};
dojo.lfx.html.slideTo=function(_7c4,_7c5,_7c6,_7c7,_7c8){
_7c4=dojo.lfx.html._byId(_7c4);
var _7c9=[];
var _7ca=dojo.html.getComputedStyle;
if(dojo.lang.isArray(_7c5)){
dojo.deprecated("dojo.lfx.html.slideTo(node, array)","use dojo.lfx.html.slideTo(node, {top: value, left: value});","0.5");
_7c5={top:_7c5[0],left:_7c5[1]};
}
dojo.lang.forEach(_7c4,function(node){
var top=null;
var left=null;
var init=(function(){
var _7cf=node;
return function(){
var pos=_7ca(_7cf,"position");
top=(pos=="absolute"?node.offsetTop:parseInt(_7ca(node,"top"))||0);
left=(pos=="absolute"?node.offsetLeft:parseInt(_7ca(node,"left"))||0);
if(!dojo.lang.inArray(["absolute","relative"],pos)){
var ret=dojo.html.abs(_7cf,true);
dojo.html.setStyleAttributes(_7cf,"position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
top=ret.y;
left=ret.x;
}
};
})();
init();
var anim=dojo.lfx.propertyAnimation(node,{"top":{start:top,end:(_7c5.top||0)},"left":{start:left,end:(_7c5.left||0)}},_7c6,_7c7,{"beforeBegin":init});
if(_7c8){
anim.connect("onEnd",function(){
_7c8(_7c4,anim);
});
}
_7c9.push(anim);
});
return dojo.lfx.combine(_7c9);
};
dojo.lfx.html.slideBy=function(_7d3,_7d4,_7d5,_7d6,_7d7){
_7d3=dojo.lfx.html._byId(_7d3);
var _7d8=[];
var _7d9=dojo.html.getComputedStyle;
if(dojo.lang.isArray(_7d4)){
dojo.deprecated("dojo.lfx.html.slideBy(node, array)","use dojo.lfx.html.slideBy(node, {top: value, left: value});","0.5");
_7d4={top:_7d4[0],left:_7d4[1]};
}
dojo.lang.forEach(_7d3,function(node){
var top=null;
var left=null;
var init=(function(){
var _7de=node;
return function(){
var pos=_7d9(_7de,"position");
top=(pos=="absolute"?node.offsetTop:parseInt(_7d9(node,"top"))||0);
left=(pos=="absolute"?node.offsetLeft:parseInt(_7d9(node,"left"))||0);
if(!dojo.lang.inArray(["absolute","relative"],pos)){
var ret=dojo.html.abs(_7de,true);
dojo.html.setStyleAttributes(_7de,"position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
top=ret.y;
left=ret.x;
}
};
})();
init();
var anim=dojo.lfx.propertyAnimation(node,{"top":{start:top,end:top+(_7d4.top||0)},"left":{start:left,end:left+(_7d4.left||0)}},_7d5,_7d6).connect("beforeBegin",init);
if(_7d7){
anim.connect("onEnd",function(){
_7d7(_7d3,anim);
});
}
_7d8.push(anim);
});
return dojo.lfx.combine(_7d8);
};
dojo.lfx.html.explode=function(_7e2,_7e3,_7e4,_7e5,_7e6){
var h=dojo.html;
_7e2=dojo.byId(_7e2);
_7e3=dojo.byId(_7e3);
var _7e8=h.toCoordinateObject(_7e2,true);
var _7e9=document.createElement("div");
h.copyStyle(_7e9,_7e3);
if(_7e3.explodeClassName){
_7e9.className=_7e3.explodeClassName;
}
with(_7e9.style){
position="absolute";
display="none";
}
dojo.body().appendChild(_7e9);
with(_7e3.style){
visibility="hidden";
display="block";
}
var _7ea=h.toCoordinateObject(_7e3,true);
with(_7e3.style){
display="none";
visibility="visible";
}
var _7eb={opacity:{start:0.5,end:1}};
dojo.lang.forEach(["height","width","top","left"],function(type){
_7eb[type]={start:_7e8[type],end:_7ea[type]};
});
var anim=new dojo.lfx.propertyAnimation(_7e9,_7eb,_7e4,_7e5,{"beforeBegin":function(){
h.setDisplay(_7e9,"block");
},"onEnd":function(){
h.setDisplay(_7e3,"block");
_7e9.parentNode.removeChild(_7e9);
}});
if(_7e6){
anim.connect("onEnd",function(){
_7e6(_7e3,anim);
});
}
return anim;
};
dojo.lfx.html.implode=function(_7ee,end,_7f0,_7f1,_7f2){
var h=dojo.html;
_7ee=dojo.byId(_7ee);
end=dojo.byId(end);
var _7f4=dojo.html.toCoordinateObject(_7ee,true);
var _7f5=dojo.html.toCoordinateObject(end,true);
var _7f6=document.createElement("div");
dojo.html.copyStyle(_7f6,_7ee);
if(_7ee.explodeClassName){
_7f6.className=_7ee.explodeClassName;
}
dojo.html.setOpacity(_7f6,0.3);
with(_7f6.style){
position="absolute";
display="none";
backgroundColor=h.getStyle(_7ee,"background-color").toLowerCase();
}
dojo.body().appendChild(_7f6);
var _7f7={opacity:{start:1,end:0.5}};
dojo.lang.forEach(["height","width","top","left"],function(type){
_7f7[type]={start:_7f4[type],end:_7f5[type]};
});
var anim=new dojo.lfx.propertyAnimation(_7f6,_7f7,_7f0,_7f1,{"beforeBegin":function(){
dojo.html.hide(_7ee);
dojo.html.show(_7f6);
},"onEnd":function(){
_7f6.parentNode.removeChild(_7f6);
}});
if(_7f2){
anim.connect("onEnd",function(){
_7f2(_7ee,anim);
});
}
return anim;
};
dojo.lfx.html.highlight=function(_7fa,_7fb,_7fc,_7fd,_7fe){
_7fa=dojo.lfx.html._byId(_7fa);
var _7ff=[];
dojo.lang.forEach(_7fa,function(node){
var _801=dojo.html.getBackgroundColor(node);
var bg=dojo.html.getStyle(node,"background-color").toLowerCase();
var _803=dojo.html.getStyle(node,"background-image");
var _804=(bg=="transparent"||bg=="rgba(0, 0, 0, 0)");
while(_801.length>3){
_801.pop();
}
var rgb=new dojo.gfx.color.Color(_7fb);
var _806=new dojo.gfx.color.Color(_801);
var anim=dojo.lfx.propertyAnimation(node,{"background-color":{start:rgb,end:_806}},_7fc,_7fd,{"beforeBegin":function(){
if(_803){
node.style.backgroundImage="none";
}
node.style.backgroundColor="rgb("+rgb.toRgb().join(",")+")";
},"onEnd":function(){
if(_803){
node.style.backgroundImage=_803;
}
if(_804){
node.style.backgroundColor="transparent";
}
if(_7fe){
_7fe(node,anim);
}
}});
_7ff.push(anim);
});
return dojo.lfx.combine(_7ff);
};
dojo.lfx.html.unhighlight=function(_808,_809,_80a,_80b,_80c){
_808=dojo.lfx.html._byId(_808);
var _80d=[];
dojo.lang.forEach(_808,function(node){
var _80f=new dojo.gfx.color.Color(dojo.html.getBackgroundColor(node));
var rgb=new dojo.gfx.color.Color(_809);
var _811=dojo.html.getStyle(node,"background-image");
var anim=dojo.lfx.propertyAnimation(node,{"background-color":{start:_80f,end:rgb}},_80a,_80b,{"beforeBegin":function(){
if(_811){
node.style.backgroundImage="none";
}
node.style.backgroundColor="rgb("+_80f.toRgb().join(",")+")";
},"onEnd":function(){
if(_80c){
_80c(node,anim);
}
}});
_80d.push(anim);
});
return dojo.lfx.combine(_80d);
};
dojo.lang.mixin(dojo.lfx,dojo.lfx.html);
dojo.provide("dojo.lfx.*");
dojo.provide("dojo.lfx.toggle");
dojo.lfx.toggle.plain={show:function(node,_814,_815,_816){
dojo.html.show(node);
if(dojo.lang.isFunction(_816)){
_816();
}
},hide:function(node,_818,_819,_81a){
dojo.html.hide(node);
if(dojo.lang.isFunction(_81a)){
_81a();
}
}};
dojo.lfx.toggle.fade={show:function(node,_81c,_81d,_81e){
dojo.lfx.fadeShow(node,_81c,_81d,_81e).play();
},hide:function(node,_820,_821,_822){
dojo.lfx.fadeHide(node,_820,_821,_822).play();
}};
dojo.lfx.toggle.wipe={show:function(node,_824,_825,_826){
dojo.lfx.wipeIn(node,_824,_825,_826).play();
},hide:function(node,_828,_829,_82a){
dojo.lfx.wipeOut(node,_828,_829,_82a).play();
}};
dojo.lfx.toggle.explode={show:function(node,_82c,_82d,_82e,_82f){
dojo.lfx.explode(_82f||{x:0,y:0,width:0,height:0},node,_82c,_82d,_82e).play();
},hide:function(node,_831,_832,_833,_834){
dojo.lfx.implode(node,_834||{x:0,y:0,width:0,height:0},_831,_832,_833).play();
}};
dojo.provide("dojo.widget.HtmlWidget");
dojo.declare("dojo.widget.HtmlWidget",dojo.widget.DomWidget,{widgetType:"HtmlWidget",templateCssPath:null,templatePath:null,lang:"",toggle:"plain",toggleDuration:150,animationInProgress:false,initialize:function(args,frag){
},postMixInProperties:function(args,frag){
if(this.lang===""){
this.lang=null;
}
this.toggleObj=dojo.lfx.toggle[this.toggle.toLowerCase()]||dojo.lfx.toggle.plain;
},getContainerHeight:function(){
dojo.unimplemented("dojo.widget.HtmlWidget.getContainerHeight");
},getContainerWidth:function(){
return this.parent.domNode.offsetWidth;
},setNativeHeight:function(_839){
var ch=this.getContainerHeight();
},createNodesFromText:function(txt,wrap){
return dojo.html.createNodesFromText(txt,wrap);
},destroyRendering:function(_83d){
try{
if(!_83d&&this.domNode){
dojo.event.browser.clean(this.domNode);
}
this.domNode.parentNode.removeChild(this.domNode);
delete this.domNode;
}
catch(e){
}
},isShowing:function(){
return dojo.html.isShowing(this.domNode);
},toggleShowing:function(){
if(this.isHidden){
this.show();
}else{
this.hide();
}
},show:function(){
this.animationInProgress=true;
this.isHidden=false;
this.toggleObj.show(this.domNode,this.toggleDuration,null,dojo.lang.hitch(this,this.onShow),this.explodeSrc);
},onShow:function(){
this.animationInProgress=false;
this.checkSize();
},hide:function(){
this.animationInProgress=true;
this.isHidden=true;
this.toggleObj.hide(this.domNode,this.toggleDuration,null,dojo.lang.hitch(this,this.onHide),this.explodeSrc);
},onHide:function(){
this.animationInProgress=false;
},_isResized:function(w,h){
if(!this.isShowing()){
return false;
}
var wh=dojo.html.getMarginBox(this.domNode);
var _841=w||wh.width;
var _842=h||wh.height;
if(this.width==_841&&this.height==_842){
return false;
}
this.width=_841;
this.height=_842;
return true;
},checkSize:function(){
if(!this._isResized()){
return;
}
this.onResized();
},resizeTo:function(w,h){
dojo.html.setMarginBox(this.domNode,{width:w,height:h});
if(this.isShowing()){
this.onResized();
}
},resizeSoon:function(){
if(this.isShowing()){
dojo.lang.setTimeout(this,this.onResized,0);
}
},onResized:function(){
dojo.lang.forEach(this.children,function(_845){
if(_845.checkSize){
_845.checkSize();
}
});
}});
dojo.provide("dojo.widget.*");
dojo.provide("dojo.html.*");
dojo.provide("dojo.widget.TreeNode");
dojo.widget.defineWidget("dojo.widget.TreeNode",dojo.widget.HtmlWidget,function(){
this.actionsDisabled=[];
},{widgetType:"TreeNode",loadStates:{UNCHECKED:"UNCHECKED",LOADING:"LOADING",LOADED:"LOADED"},actions:{MOVE:"MOVE",REMOVE:"REMOVE",EDIT:"EDIT",ADDCHILD:"ADDCHILD"},isContainer:true,lockLevel:0,templateString:("<div class=\"dojoTreeNode\"> "+"<span treeNode=\"${this.widgetId}\" class=\"dojoTreeNodeLabel\" dojoAttachPoint=\"labelNode\"> "+"\t\t<span dojoAttachPoint=\"titleNode\" dojoAttachEvent=\"onClick: onTitleClick\" class=\"dojoTreeNodeLabelTitle\">${this.title}</span> "+"</span> "+"<span class=\"dojoTreeNodeAfterLabel\" dojoAttachPoint=\"afterLabelNode\">${this.afterLabel}</span> "+"<div dojoAttachPoint=\"containerNode\" style=\"display:none\"></div> "+"</div>").replace(/(>|<)\s+/g,"$1"),childIconSrc:"",childIconFolderSrc:dojo.uri.dojoUri("src/widget/templates/images/Tree/closed.gif"),childIconDocumentSrc:dojo.uri.dojoUri("src/widget/templates/images/Tree/document.gif"),childIcon:null,isTreeNode:true,objectId:"",afterLabel:"",afterLabelNode:null,expandIcon:null,title:"",object:"",isFolder:false,labelNode:null,titleNode:null,imgs:null,expandLevel:"",tree:null,depth:0,isExpanded:false,state:null,domNodeInitialized:false,isFirstChild:function(){
return this.getParentIndex()==0?true:false;
},isLastChild:function(){
return this.getParentIndex()==this.parent.children.length-1?true:false;
},lock:function(){
return this.tree.lock.apply(this,arguments);
},unlock:function(){
return this.tree.unlock.apply(this,arguments);
},isLocked:function(){
return this.tree.isLocked.apply(this,arguments);
},cleanLock:function(){
return this.tree.cleanLock.apply(this,arguments);
},actionIsDisabled:function(_846){
var _847=this;
var _848=false;
if(this.tree.strictFolders&&_846==this.actions.ADDCHILD&&!this.isFolder){
_848=true;
}
if(dojo.lang.inArray(_847.actionsDisabled,_846)){
_848=true;
}
if(this.isLocked()){
_848=true;
}
return _848;
},getInfo:function(){
var info={widgetId:this.widgetId,objectId:this.objectId,index:this.getParentIndex(),isFolder:this.isFolder};
return info;
},initialize:function(args,frag){
this.state=this.loadStates.UNCHECKED;
for(var i=0;i<this.actionsDisabled.length;i++){
this.actionsDisabled[i]=this.actionsDisabled[i].toUpperCase();
}
this.expandLevel=parseInt(this.expandLevel);
},adjustDepth:function(_84d){
for(var i=0;i<this.children.length;i++){
this.children[i].adjustDepth(_84d);
}
this.depth+=_84d;
if(_84d>0){
for(var i=0;i<_84d;i++){
var img=this.tree.makeBlankImg();
this.imgs.unshift(img);
dojo.html.insertBefore(this.imgs[0],this.domNode.firstChild);
}
}
if(_84d<0){
for(var i=0;i<-_84d;i++){
this.imgs.shift();
dojo.html.removeNode(this.domNode.firstChild);
}
}
},markLoading:function(){
this._markLoadingSavedIcon=this.expandIcon.src;
this.expandIcon.src=this.tree.expandIconSrcLoading;
},unMarkLoading:function(){
if(!this._markLoadingSavedIcon){
return;
}
var im=new Image();
im.src=this.tree.expandIconSrcLoading;
if(this.expandIcon.src==im.src){
this.expandIcon.src=this._markLoadingSavedIcon;
}
this._markLoadingSavedIcon=null;
},setFolder:function(){
dojo.event.connect(this.expandIcon,"onclick",this,"onTreeClick");
this.expandIcon.src=this.isExpanded?this.tree.expandIconSrcMinus:this.tree.expandIconSrcPlus;
this.isFolder=true;
},createDOMNode:function(tree,_852){
this.tree=tree;
this.depth=_852;
this.imgs=[];
for(var i=0;i<this.depth+1;i++){
var img=this.tree.makeBlankImg();
this.domNode.insertBefore(img,this.labelNode);
this.imgs.push(img);
}
this.expandIcon=this.imgs[this.imgs.length-1];
this.childIcon=this.tree.makeBlankImg();
this.imgs.push(this.childIcon);
dojo.html.insertBefore(this.childIcon,this.titleNode);
if(this.children.length||this.isFolder){
this.setFolder();
}else{
this.state=this.loadStates.LOADED;
}
dojo.event.connect(this.childIcon,"onclick",this,"onIconClick");
for(var i=0;i<this.children.length;i++){
this.children[i].parent=this;
var node=this.children[i].createDOMNode(this.tree,this.depth+1);
this.containerNode.appendChild(node);
}
if(this.children.length){
this.state=this.loadStates.LOADED;
}
this.updateIcons();
this.domNodeInitialized=true;
dojo.event.topic.publish(this.tree.eventNames.createDOMNode,{source:this});
return this.domNode;
},onTreeClick:function(e){
dojo.event.topic.publish(this.tree.eventNames.treeClick,{source:this,event:e});
},onIconClick:function(e){
dojo.event.topic.publish(this.tree.eventNames.iconClick,{source:this,event:e});
},onTitleClick:function(e){
dojo.event.topic.publish(this.tree.eventNames.titleClick,{source:this,event:e});
},markSelected:function(){
dojo.html.addClass(this.titleNode,"dojoTreeNodeLabelSelected");
},unMarkSelected:function(){
dojo.html.removeClass(this.titleNode,"dojoTreeNodeLabelSelected");
},updateExpandIcon:function(){
if(this.isFolder){
this.expandIcon.src=this.isExpanded?this.tree.expandIconSrcMinus:this.tree.expandIconSrcPlus;
}else{
this.expandIcon.src=this.tree.blankIconSrc;
}
},updateExpandGrid:function(){
if(this.tree.showGrid){
if(this.depth){
this.setGridImage(-2,this.isLastChild()?this.tree.gridIconSrcL:this.tree.gridIconSrcT);
}else{
if(this.isFirstChild()){
this.setGridImage(-2,this.isLastChild()?this.tree.gridIconSrcX:this.tree.gridIconSrcY);
}else{
this.setGridImage(-2,this.isLastChild()?this.tree.gridIconSrcL:this.tree.gridIconSrcT);
}
}
}else{
this.setGridImage(-2,this.tree.blankIconSrc);
}
},updateChildGrid:function(){
if((this.depth||this.tree.showRootGrid)&&this.tree.showGrid){
this.setGridImage(-1,(this.children.length&&this.isExpanded)?this.tree.gridIconSrcP:this.tree.gridIconSrcC);
}else{
if(this.tree.showGrid&&!this.tree.showRootGrid){
this.setGridImage(-1,(this.children.length&&this.isExpanded)?this.tree.gridIconSrcZ:this.tree.blankIconSrc);
}else{
this.setGridImage(-1,this.tree.blankIconSrc);
}
}
},updateParentGrid:function(){
var _859=this.parent;
for(var i=0;i<this.depth;i++){
var idx=this.imgs.length-(3+i);
var img=(this.tree.showGrid&&!_859.isLastChild())?this.tree.gridIconSrcV:this.tree.blankIconSrc;
this.setGridImage(idx,img);
_859=_859.parent;
}
},updateExpandGridColumn:function(){
if(!this.tree.showGrid){
return;
}
var _85d=this;
var icon=this.isLastChild()?this.tree.blankIconSrc:this.tree.gridIconSrcV;
dojo.lang.forEach(_85d.getDescendants(),function(node){
node.setGridImage(_85d.depth,icon);
});
this.updateExpandGrid();
},updateIcons:function(){
this.imgs[0].style.display=this.tree.showRootGrid?"inline":"none";
this.buildChildIcon();
this.updateExpandGrid();
this.updateChildGrid();
this.updateParentGrid();
dojo.profile.stop("updateIcons");
},buildChildIcon:function(){
if(this.childIconSrc){
this.childIcon.src=this.childIconSrc;
}
this.childIcon.style.display=this.childIconSrc?"inline":"none";
},setGridImage:function(idx,src){
if(idx<0){
idx=this.imgs.length+idx;
}
this.imgs[idx].style.backgroundImage="url("+src+")";
},updateIconTree:function(){
this.tree.updateIconTree.call(this);
},expand:function(){
if(this.isExpanded){
return;
}
if(this.children.length){
this.showChildren();
}
this.isExpanded=true;
this.updateExpandIcon();
dojo.event.topic.publish(this.tree.eventNames.expand,{source:this});
},collapse:function(){
if(!this.isExpanded){
return;
}
this.hideChildren();
this.isExpanded=false;
this.updateExpandIcon();
dojo.event.topic.publish(this.tree.eventNames.collapse,{source:this});
},hideChildren:function(){
this.tree.toggleObj.hide(this.containerNode,this.toggleDuration,this.explodeSrc,dojo.lang.hitch(this,"onHide"));
if(dojo.exists(dojo,"dnd.dragManager.dragObjects")&&dojo.dnd.dragManager.dragObjects.length){
dojo.dnd.dragManager.cacheTargetLocations();
}
},showChildren:function(){
this.tree.toggleObj.show(this.containerNode,this.toggleDuration,this.explodeSrc,dojo.lang.hitch(this,"onShow"));
if(dojo.exists(dojo,"dnd.dragManager.dragObjects")&&dojo.dnd.dragManager.dragObjects.length){
dojo.dnd.dragManager.cacheTargetLocations();
}
},addChild:function(){
return this.tree.addChild.apply(this,arguments);
},doAddChild:function(){
return this.tree.doAddChild.apply(this,arguments);
},edit:function(_862){
dojo.lang.mixin(this,_862);
if(_862.title){
this.titleNode.innerHTML=this.title;
}
if(_862.afterLabel){
this.afterLabelNode.innerHTML=this.afterLabel;
}
if(_862.childIconSrc){
this.buildChildIcon();
}
},removeNode:function(){
return this.tree.removeNode.apply(this,arguments);
},doRemoveNode:function(){
return this.tree.doRemoveNode.apply(this,arguments);
},toString:function(){
return "["+this.widgetType+" Tree:"+this.tree+" ID:"+this.widgetId+" Title:"+this.title+"]";
}});
dojo.provide("dojo.html.selection");
dojo.html.selectionType={NONE:0,TEXT:1,CONTROL:2};
dojo.html.clearSelection=function(){
var _863=dojo.global();
var _864=dojo.doc();
try{
if(_863["getSelection"]){
if(dojo.render.html.safari){
_863.getSelection().collapse();
}else{
_863.getSelection().removeAllRanges();
}
}else{
if(_864.selection){
if(_864.selection.empty){
_864.selection.empty();
}else{
if(_864.selection.clear){
_864.selection.clear();
}
}
}
}
return true;
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.html.disableSelection=function(_865){
_865=dojo.byId(_865)||dojo.body();
var h=dojo.render.html;
if(h.mozilla){
_865.style.MozUserSelect="none";
}else{
if(h.safari){
_865.style.KhtmlUserSelect="none";
}else{
if(h.ie){
_865.unselectable="on";
}else{
return false;
}
}
}
return true;
};
dojo.html.enableSelection=function(_867){
_867=dojo.byId(_867)||dojo.body();
var h=dojo.render.html;
if(h.mozilla){
_867.style.MozUserSelect="";
}else{
if(h.safari){
_867.style.KhtmlUserSelect="";
}else{
if(h.ie){
_867.unselectable="off";
}else{
return false;
}
}
}
return true;
};
dojo.html.selectElement=function(_869){
dojo.deprecated("dojo.html.selectElement","replaced by dojo.html.selection.selectElementChildren",0.5);
};
dojo.html.selectInputText=function(_86a){
var _86b=dojo.global();
var _86c=dojo.doc();
_86a=dojo.byId(_86a);
if(_86c["selection"]&&dojo.body()["createTextRange"]){
var _86d=_86a.createTextRange();
_86d.moveStart("character",0);
_86d.moveEnd("character",_86a.value.length);
_86d.select();
}else{
if(_86b["getSelection"]){
var _86e=_86b.getSelection();
_86a.setSelectionRange(0,_86a.value.length);
}
}
_86a.focus();
};
dojo.html.isSelectionCollapsed=function(){
dojo.deprecated("dojo.html.isSelectionCollapsed","replaced by dojo.html.selection.isCollapsed",0.5);
return dojo.html.selection.isCollapsed();
};
dojo.lang.mixin(dojo.html.selection,{getType:function(){
if(dojo.doc()["selection"]){
return dojo.html.selectionType[dojo.doc().selection.type.toUpperCase()];
}else{
var _86f=dojo.html.selectionType.TEXT;
var oSel;
try{
oSel=dojo.global().getSelection();
}
catch(e){
}
if(oSel&&oSel.rangeCount==1){
var _871=oSel.getRangeAt(0);
if(_871.startContainer==_871.endContainer&&(_871.endOffset-_871.startOffset)==1&&_871.startContainer.nodeType!=dojo.dom.TEXT_NODE){
_86f=dojo.html.selectionType.CONTROL;
}
}
return _86f;
}
},isCollapsed:function(){
var _872=dojo.global();
var _873=dojo.doc();
if(_873["selection"]){
return _873.selection.createRange().text=="";
}else{
if(_872["getSelection"]){
var _874=_872.getSelection();
if(dojo.lang.isString(_874)){
return _874=="";
}else{
return _874.isCollapsed||_874.toString()=="";
}
}
}
},getSelectedElement:function(){
if(dojo.html.selection.getType()==dojo.html.selectionType.CONTROL){
if(dojo.doc()["selection"]){
var _875=dojo.doc().selection.createRange();
if(_875&&_875.item){
return dojo.doc().selection.createRange().item(0);
}
}else{
var _876=dojo.global().getSelection();
return _876.anchorNode.childNodes[_876.anchorOffset];
}
}
},getParentElement:function(){
if(dojo.html.selection.getType()==dojo.html.selectionType.CONTROL){
var p=dojo.html.selection.getSelectedElement();
if(p){
return p.parentNode;
}
}else{
if(dojo.doc()["selection"]){
return dojo.doc().selection.createRange().parentElement();
}else{
var _878=dojo.global().getSelection();
if(_878){
var node=_878.anchorNode;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.parentNode;
}
return node;
}
}
}
},getSelectedText:function(){
if(dojo.doc()["selection"]){
if(dojo.html.selection.getType()==dojo.html.selectionType.CONTROL){
return null;
}
return dojo.doc().selection.createRange().text;
}else{
var _87a=dojo.global().getSelection();
if(_87a){
return _87a.toString();
}
}
},getSelectedHtml:function(){
if(dojo.doc()["selection"]){
if(dojo.html.selection.getType()==dojo.html.selectionType.CONTROL){
return null;
}
return dojo.doc().selection.createRange().htmlText;
}else{
var _87b=dojo.global().getSelection();
if(_87b&&_87b.rangeCount){
var frag=_87b.getRangeAt(0).cloneContents();
var div=document.createElement("div");
div.appendChild(frag);
return div.innerHTML;
}
return null;
}
},hasAncestorElement:function(_87e){
return (dojo.html.selection.getAncestorElement.apply(this,arguments)!=null);
},getAncestorElement:function(_87f){
var node=dojo.html.selection.getSelectedElement()||dojo.html.selection.getParentElement();
while(node){
if(dojo.html.selection.isTag(node,arguments).length>0){
return node;
}
node=node.parentNode;
}
return null;
},isTag:function(node,tags){
if(node&&node.tagName){
for(var i=0;i<tags.length;i++){
if(node.tagName.toLowerCase()==String(tags[i]).toLowerCase()){
return String(tags[i]).toLowerCase();
}
}
}
return "";
},selectElement:function(_884){
var _885=dojo.global();
var _886=dojo.doc();
_884=dojo.byId(_884);
if(_886.selection&&dojo.body().createTextRange){
try{
var _887=dojo.body().createControlRange();
_887.addElement(_884);
_887.select();
}
catch(e){
dojo.html.selection.selectElementChildren(_884);
}
}else{
if(_885["getSelection"]){
var _888=_885.getSelection();
if(_888["removeAllRanges"]){
var _887=_886.createRange();
_887.selectNode(_884);
_888.removeAllRanges();
_888.addRange(_887);
}
}
}
},selectElementChildren:function(_889){
var _88a=dojo.global();
var _88b=dojo.doc();
_889=dojo.byId(_889);
if(_88b.selection&&dojo.body().createTextRange){
var _88c=dojo.body().createTextRange();
_88c.moveToElementText(_889);
_88c.select();
}else{
if(_88a["getSelection"]){
var _88d=_88a.getSelection();
if(_88d["setBaseAndExtent"]){
_88d.setBaseAndExtent(_889,0,_889,_889.innerText.length-1);
}else{
if(_88d["selectAllChildren"]){
_88d.selectAllChildren(_889);
}
}
}
}
},getBookmark:function(){
var _88e;
var _88f=dojo.doc();
if(_88f["selection"]){
var _890=_88f.selection.createRange();
_88e=_890.getBookmark();
}else{
var _891;
try{
_891=dojo.global().getSelection();
}
catch(e){
}
if(_891){
var _890=_891.getRangeAt(0);
_88e=_890.cloneRange();
}else{
dojo.debug("No idea how to store the current selection for this browser!");
}
}
return _88e;
},moveToBookmark:function(_892){
var _893=dojo.doc();
if(_893["selection"]){
var _894=_893.selection.createRange();
_894.moveToBookmark(_892);
_894.select();
}else{
var _895;
try{
_895=dojo.global().getSelection();
}
catch(e){
}
if(_895&&_895["removeAllRanges"]){
_895.removeAllRanges();
_895.addRange(_892);
}else{
dojo.debug("No idea how to restore selection for this browser!");
}
}
},collapse:function(_896){
if(dojo.global()["getSelection"]){
var _897=dojo.global().getSelection();
if(_897.removeAllRanges){
if(_896){
_897.collapseToStart();
}else{
_897.collapseToEnd();
}
}else{
dojo.global().getSelection().collapse(_896);
}
}else{
if(dojo.doc().selection){
var _898=dojo.doc().selection.createRange();
_898.collapse(_896);
_898.select();
}
}
},remove:function(){
if(dojo.doc().selection){
var _899=dojo.doc().selection;
if(_899.type.toUpperCase()!="NONE"){
_899.clear();
}
return _899;
}else{
var _899=dojo.global().getSelection();
for(var i=0;i<_899.rangeCount;i++){
_899.getRangeAt(i).deleteContents();
}
return _899;
}
}});
dojo.provide("dojo.json");
dojo.json={jsonRegistry:new dojo.AdapterRegistry(),register:function(name,_89c,wrap,_89e){
dojo.json.jsonRegistry.register(name,_89c,wrap,_89e);
},evalJson:function(json){
try{
return eval("("+json+")");
}
catch(e){
dojo.debug(e);
return json;
}
},serialize:function(o){
var _8a1=typeof (o);
if(_8a1=="undefined"){
return "undefined";
}else{
if((_8a1=="number")||(_8a1=="boolean")){
return o+"";
}else{
if(o===null){
return "null";
}
}
}
if(_8a1=="string"){
return dojo.string.escapeString(o);
}
var me=arguments.callee;
var _8a3;
if(typeof (o.__json__)=="function"){
_8a3=o.__json__();
if(o!==_8a3){
return me(_8a3);
}
}
if(typeof (o.json)=="function"){
_8a3=o.json();
if(o!==_8a3){
return me(_8a3);
}
}
if(_8a1!="function"&&typeof (o.length)=="number"){
var res=[];
for(var i=0;i<o.length;i++){
var val=me(o[i]);
if(typeof (val)!="string"){
val="undefined";
}
res.push(val);
}
return "["+res.join(",")+"]";
}
try{
window.o=o;
_8a3=dojo.json.jsonRegistry.match(o);
return me(_8a3);
}
catch(e){
}
if(_8a1=="function"){
return null;
}
res=[];
for(var k in o){
var _8a8;
if(typeof (k)=="number"){
_8a8="\""+k+"\"";
}else{
if(typeof (k)=="string"){
_8a8=dojo.string.escapeString(k);
}else{
continue;
}
}
val=me(o[k]);
if(typeof (val)!="string"){
continue;
}
res.push(_8a8+":"+val);
}
return "{"+res.join(",")+"}";
}};
dojo.provide("dojo.dnd.DragAndDrop");
dojo.declare("dojo.dnd.DragSource",null,{type:"",onDragEnd:function(){
},onDragStart:function(){
},onSelected:function(){
},unregister:function(){
dojo.dnd.dragManager.unregisterDragSource(this);
},reregister:function(){
dojo.dnd.dragManager.registerDragSource(this);
}},function(){
var dm=dojo.dnd.dragManager;
if(dm["registerDragSource"]){
dm.registerDragSource(this);
}
});
dojo.declare("dojo.dnd.DragObject",null,{type:"",onDragStart:function(){
},onDragMove:function(){
},onDragOver:function(){
},onDragOut:function(){
},onDragEnd:function(){
},onDragLeave:this.onDragOut,onDragEnter:this.onDragOver,ondragout:this.onDragOut,ondragover:this.onDragOver},function(){
var dm=dojo.dnd.dragManager;
if(dm["registerDragObject"]){
dm.registerDragObject(this);
}
});
dojo.declare("dojo.dnd.DropTarget",null,{acceptsType:function(type){
if(!dojo.lang.inArray(this.acceptedTypes,"*")){
if(!dojo.lang.inArray(this.acceptedTypes,type)){
return false;
}
}
return true;
},accepts:function(_8ac){
if(!dojo.lang.inArray(this.acceptedTypes,"*")){
for(var i=0;i<_8ac.length;i++){
if(!dojo.lang.inArray(this.acceptedTypes,_8ac[i].type)){
return false;
}
}
}
return true;
},unregister:function(){
dojo.dnd.dragManager.unregisterDropTarget(this);
},onDragOver:function(){
},onDragOut:function(){
},onDragMove:function(){
},onDropStart:function(){
},onDrop:function(){
},onDropEnd:function(){
}},function(){
if(this.constructor==dojo.dnd.DropTarget){
return;
}
this.acceptedTypes=[];
dojo.dnd.dragManager.registerDropTarget(this);
});
dojo.dnd.DragEvent=function(){
this.dragSource=null;
this.dragObject=null;
this.target=null;
this.eventStatus="success";
};
dojo.declare("dojo.dnd.DragManager",null,{selectedSources:[],dragObjects:[],dragSources:[],registerDragSource:function(){
},dropTargets:[],registerDropTarget:function(){
},lastDragTarget:null,currentDragTarget:null,onKeyDown:function(){
},onMouseOut:function(){
},onMouseMove:function(){
},onMouseUp:function(){
}});
dojo.provide("dojo.dnd.HtmlDragManager");
dojo.declare("dojo.dnd.HtmlDragManager",dojo.dnd.DragManager,{disabled:false,nestedTargets:false,mouseDownTimer:null,dsCounter:0,dsPrefix:"dojoDragSource",dropTargetDimensions:[],currentDropTarget:null,previousDropTarget:null,_dragTriggered:false,selectedSources:[],dragObjects:[],currentX:null,currentY:null,lastX:null,lastY:null,mouseDownX:null,mouseDownY:null,threshold:7,dropAcceptable:false,cancelEvent:function(e){
e.stopPropagation();
e.preventDefault();
},registerDragSource:function(ds){
if(ds["domNode"]){
var dp=this.dsPrefix;
var _8b1=dp+"Idx_"+(this.dsCounter++);
ds.dragSourceId=_8b1;
this.dragSources[_8b1]=ds;
ds.domNode.setAttribute(dp,_8b1);
if(dojo.render.html.ie){
dojo.event.browser.addListener(ds.domNode,"ondragstart",this.cancelEvent);
}
}
},unregisterDragSource:function(ds){
if(ds["domNode"]){
var dp=this.dsPrefix;
var _8b4=ds.dragSourceId;
delete ds.dragSourceId;
delete this.dragSources[_8b4];
ds.domNode.setAttribute(dp,null);
if(dojo.render.html.ie){
dojo.event.browser.removeListener(ds.domNode,"ondragstart",this.cancelEvent);
}
}
},registerDropTarget:function(dt){
this.dropTargets.push(dt);
},unregisterDropTarget:function(dt){
var _8b7=dojo.lang.find(this.dropTargets,dt,true);
if(_8b7>=0){
this.dropTargets.splice(_8b7,1);
}
},getDragSource:function(e){
var tn=e.target;
if(tn===dojo.body()){
return;
}
var ta=dojo.html.getAttribute(tn,this.dsPrefix);
while((!ta)&&(tn)){
tn=tn.parentNode;
if((!tn)||(tn===dojo.body())){
return;
}
ta=dojo.html.getAttribute(tn,this.dsPrefix);
}
return this.dragSources[ta];
},onKeyDown:function(e){
},onMouseDown:function(e){
if(this.disabled){
return;
}
if(dojo.render.html.ie){
if(e.button!=1){
return;
}
}else{
if(e.which!=1){
return;
}
}
var _8bd=e.target.nodeType==dojo.html.TEXT_NODE?e.target.parentNode:e.target;
if(dojo.html.isTag(_8bd,"button","textarea","input","select","option")){
return;
}
var ds=this.getDragSource(e);
if(!ds){
return;
}
if(!dojo.lang.inArray(this.selectedSources,ds)){
this.selectedSources.push(ds);
ds.onSelected();
}
this.mouseDownX=e.pageX;
this.mouseDownY=e.pageY;
e.preventDefault();
dojo.event.connect(document,"onmousemove",this,"onMouseMove");
},onMouseUp:function(e,_8c0){
if(this.selectedSources.length==0){
return;
}
this.mouseDownX=null;
this.mouseDownY=null;
this._dragTriggered=false;
e.dragSource=this.dragSource;
if((!e.shiftKey)&&(!e.ctrlKey)){
if(this.currentDropTarget){
this.currentDropTarget.onDropStart();
}
dojo.lang.forEach(this.dragObjects,function(_8c1){
var ret=null;
if(!_8c1){
return;
}
if(this.currentDropTarget){
e.dragObject=_8c1;
var ce=this.currentDropTarget.domNode.childNodes;
if(ce.length>0){
e.dropTarget=ce[0];
while(e.dropTarget==_8c1.domNode){
e.dropTarget=e.dropTarget.nextSibling;
}
}else{
e.dropTarget=this.currentDropTarget.domNode;
}
if(this.dropAcceptable){
ret=this.currentDropTarget.onDrop(e);
}else{
this.currentDropTarget.onDragOut(e);
}
}
e.dragStatus=this.dropAcceptable&&ret?"dropSuccess":"dropFailure";
dojo.lang.delayThese([function(){
try{
_8c1.dragSource.onDragEnd(e);
}
catch(err){
var _8c4={};
for(var i in e){
if(i=="type"){
_8c4.type="mouseup";
continue;
}
_8c4[i]=e[i];
}
_8c1.dragSource.onDragEnd(_8c4);
}
},function(){
_8c1.onDragEnd(e);
}]);
},this);
this.selectedSources=[];
this.dragObjects=[];
this.dragSource=null;
if(this.currentDropTarget){
this.currentDropTarget.onDropEnd();
}
}else{
}
dojo.event.disconnect(document,"onmousemove",this,"onMouseMove");
this.currentDropTarget=null;
},onScroll:function(){
for(var i=0;i<this.dragObjects.length;i++){
if(this.dragObjects[i].updateDragOffset){
this.dragObjects[i].updateDragOffset();
}
}
if(this.dragObjects.length){
this.cacheTargetLocations();
}
},_dragStartDistance:function(x,y){
if((!this.mouseDownX)||(!this.mouseDownX)){
return;
}
var dx=Math.abs(x-this.mouseDownX);
var dx2=dx*dx;
var dy=Math.abs(y-this.mouseDownY);
var dy2=dy*dy;
return parseInt(Math.sqrt(dx2+dy2),10);
},cacheTargetLocations:function(){
dojo.profile.start("cacheTargetLocations");
this.dropTargetDimensions=[];
dojo.lang.forEach(this.dropTargets,function(_8cd){
var tn=_8cd.domNode;
if(!tn||dojo.lang.find(_8cd.acceptedTypes,this.dragSource.type)<0){
return;
}
var abs=dojo.html.getAbsolutePosition(tn,true);
var bb=dojo.html.getBorderBox(tn);
this.dropTargetDimensions.push([[abs.x,abs.y],[abs.x+bb.width,abs.y+bb.height],_8cd]);
},this);
dojo.profile.end("cacheTargetLocations");
},onMouseMove:function(e){
if((dojo.render.html.ie)&&(e.button!=1)){
this.currentDropTarget=null;
this.onMouseUp(e,true);
return;
}
if((this.selectedSources.length)&&(!this.dragObjects.length)){
var dx;
var dy;
if(!this._dragTriggered){
this._dragTriggered=(this._dragStartDistance(e.pageX,e.pageY)>this.threshold);
if(!this._dragTriggered){
return;
}
dx=e.pageX-this.mouseDownX;
dy=e.pageY-this.mouseDownY;
}
this.dragSource=this.selectedSources[0];
dojo.lang.forEach(this.selectedSources,function(_8d4){
if(!_8d4){
return;
}
var tdo=_8d4.onDragStart(e);
if(tdo){
tdo.onDragStart(e);
tdo.dragOffset.y+=dy;
tdo.dragOffset.x+=dx;
tdo.dragSource=_8d4;
this.dragObjects.push(tdo);
}
},this);
this.previousDropTarget=null;
this.cacheTargetLocations();
}
dojo.lang.forEach(this.dragObjects,function(_8d6){
if(_8d6){
_8d6.onDragMove(e);
}
});
if(this.currentDropTarget){
var c=dojo.html.toCoordinateObject(this.currentDropTarget.domNode,true);
var dtp=[[c.x,c.y],[c.x+c.width,c.y+c.height]];
}
if((!this.nestedTargets)&&(dtp)&&(this.isInsideBox(e,dtp))){
if(this.dropAcceptable){
this.currentDropTarget.onDragMove(e,this.dragObjects);
}
}else{
var _8d9=this.findBestTarget(e);
if(_8d9.target===null){
if(this.currentDropTarget){
this.currentDropTarget.onDragOut(e);
this.previousDropTarget=this.currentDropTarget;
this.currentDropTarget=null;
}
this.dropAcceptable=false;
return;
}
if(this.currentDropTarget!==_8d9.target){
if(this.currentDropTarget){
this.previousDropTarget=this.currentDropTarget;
this.currentDropTarget.onDragOut(e);
}
this.currentDropTarget=_8d9.target;
e.dragObjects=this.dragObjects;
this.dropAcceptable=this.currentDropTarget.onDragOver(e);
}else{
if(this.dropAcceptable){
this.currentDropTarget.onDragMove(e,this.dragObjects);
}
}
}
},findBestTarget:function(e){
var _8db=this;
var _8dc=new Object();
_8dc.target=null;
_8dc.points=null;
dojo.lang.every(this.dropTargetDimensions,function(_8dd){
if(!_8db.isInsideBox(e,_8dd)){
return true;
}
_8dc.target=_8dd[2];
_8dc.points=_8dd;
return Boolean(_8db.nestedTargets);
});
return _8dc;
},isInsideBox:function(e,_8df){
if((e.pageX>_8df[0][0])&&(e.pageX<_8df[1][0])&&(e.pageY>_8df[0][1])&&(e.pageY<_8df[1][1])){
return true;
}
return false;
},onMouseOver:function(e){
},onMouseOut:function(e){
}});
dojo.dnd.dragManager=new dojo.dnd.HtmlDragManager();
(function(){
var d=document;
var dm=dojo.dnd.dragManager;
dojo.event.connect(d,"onkeydown",dm,"onKeyDown");
dojo.event.connect(d,"onmouseover",dm,"onMouseOver");
dojo.event.connect(d,"onmouseout",dm,"onMouseOut");
dojo.event.connect(d,"onmousedown",dm,"onMouseDown");
dojo.event.connect(d,"onmouseup",dm,"onMouseUp");
dojo.event.connect(window,"onscroll",dm,"onScroll");
})();
dojo.provide("dojo.html.iframe");
dojo.html.iframeContentWindow=function(_8e4){
var win=dojo.html.getDocumentWindow(dojo.html.iframeContentDocument(_8e4))||dojo.html.iframeContentDocument(_8e4).__parent__||(_8e4.name&&document.frames[_8e4.name])||null;
return win;
};
dojo.html.iframeContentDocument=function(_8e6){
var doc=_8e6.contentDocument||((_8e6.contentWindow)&&(_8e6.contentWindow.document))||((_8e6.name)&&(document.frames[_8e6.name])&&(document.frames[_8e6.name].document))||null;
return doc;
};
dojo.html.BackgroundIframe=function(node){
if(dojo.render.html.ie55||dojo.render.html.ie60){
var html="<iframe src='javascript:false'"+"' style='position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;"+"z-index: -1; filter:Alpha(Opacity=\"0\");' "+">";
this.iframe=dojo.doc().createElement(html);
this.iframe.tabIndex=-1;
if(node){
node.appendChild(this.iframe);
this.domNode=node;
}else{
dojo.body().appendChild(this.iframe);
this.iframe.style.display="none";
}
}
};
dojo.lang.extend(dojo.html.BackgroundIframe,{iframe:null,onResized:function(){
if(this.iframe&&this.domNode&&this.domNode.parentNode){
var _8ea=dojo.html.getMarginBox(this.domNode);
if(_8ea.width==0||_8ea.height==0){
dojo.lang.setTimeout(this,this.onResized,100);
return;
}
this.iframe.style.width=_8ea.width+"px";
this.iframe.style.height=_8ea.height+"px";
}
},size:function(node){
if(!this.iframe){
return;
}
var _8ec=dojo.html.toCoordinateObject(node,true,dojo.html.boxSizing.BORDER_BOX);
this.iframe.style.width=_8ec.width+"px";
this.iframe.style.height=_8ec.height+"px";
this.iframe.style.left=_8ec.left+"px";
this.iframe.style.top=_8ec.top+"px";
},setZIndex:function(node){
if(!this.iframe){
return;
}
if(dojo.dom.isNode(node)){
this.iframe.style.zIndex=dojo.html.getStyle(node,"z-index")-1;
}else{
if(!isNaN(node)){
this.iframe.style.zIndex=node;
}
}
},show:function(){
if(!this.iframe){
return;
}
this.iframe.style.display="block";
},hide:function(){
if(!this.iframe){
return;
}
this.iframe.style.display="none";
},remove:function(){
dojo.html.removeNode(this.iframe);
}});
dojo.provide("dojo.dnd.HtmlDragAndDrop");
dojo.declare("dojo.dnd.HtmlDragSource",dojo.dnd.DragSource,{dragClass:"",onDragStart:function(){
var _8ee=new dojo.dnd.HtmlDragObject(this.dragObject,this.type);
if(this.dragClass){
_8ee.dragClass=this.dragClass;
}
if(this.constrainToContainer){
_8ee.constrainTo(this.constrainingContainer||this.domNode.parentNode);
}
return _8ee;
},setDragHandle:function(node){
node=dojo.byId(node);
dojo.dnd.dragManager.unregisterDragSource(this);
this.domNode=node;
dojo.dnd.dragManager.registerDragSource(this);
},setDragTarget:function(node){
this.dragObject=node;
},constrainTo:function(_8f1){
this.constrainToContainer=true;
if(_8f1){
this.constrainingContainer=_8f1;
}
},onSelected:function(){
for(var i=0;i<this.dragObjects.length;i++){
dojo.dnd.dragManager.selectedSources.push(new dojo.dnd.HtmlDragSource(this.dragObjects[i]));
}
},addDragObjects:function(el){
for(var i=0;i<arguments.length;i++){
this.dragObjects.push(arguments[i]);
}
}},function(node,type){
node=dojo.byId(node);
this.dragObjects=[];
this.constrainToContainer=false;
if(node){
this.domNode=node;
this.dragObject=node;
dojo.dnd.DragSource.call(this);
this.type=(type)||(this.domNode.nodeName.toLowerCase());
}
});
dojo.declare("dojo.dnd.HtmlDragObject",dojo.dnd.DragObject,{dragClass:"",opacity:0.5,createIframe:true,disableX:false,disableY:false,createDragNode:function(){
var node=this.domNode.cloneNode(true);
if(this.dragClass){
dojo.html.addClass(node,this.dragClass);
}
if(this.opacity<1){
dojo.html.setOpacity(node,this.opacity);
}
if(node.tagName.toLowerCase()=="tr"){
var doc=this.domNode.ownerDocument;
var _8f9=doc.createElement("table");
var _8fa=doc.createElement("tbody");
_8f9.appendChild(_8fa);
_8fa.appendChild(node);
var _8fb=this.domNode.childNodes;
var _8fc=node.childNodes;
for(var i=0;i<_8fb.length;i++){
if((_8fc[i])&&(_8fc[i].style)){
_8fc[i].style.width=dojo.html.getContentBox(_8fb[i]).width+"px";
}
}
node=_8f9;
}
if((dojo.render.html.ie55||dojo.render.html.ie60)&&this.createIframe){
with(node.style){
top="0px";
left="0px";
}
var _8fe=document.createElement("div");
_8fe.appendChild(node);
this.bgIframe=new dojo.html.BackgroundIframe(_8fe);
_8fe.appendChild(this.bgIframe.iframe);
node=_8fe;
}
node.style.zIndex=999;
return node;
},onDragStart:function(e){
dojo.html.clearSelection();
this.scrollOffset=dojo.html.getScroll().offset;
this.dragStartPosition=dojo.html.getAbsolutePosition(this.domNode,true);
this.dragOffset={y:this.dragStartPosition.y-e.pageY,x:this.dragStartPosition.x-e.pageX};
this.dragClone=this.createDragNode();
this.containingBlockPosition=this.domNode.offsetParent?dojo.html.getAbsolutePosition(this.domNode.offsetParent,true):{x:0,y:0};
if(this.constrainToContainer){
this.constraints=this.getConstraints();
}
with(this.dragClone.style){
position="absolute";
top=this.dragOffset.y+e.pageY+"px";
left=this.dragOffset.x+e.pageX+"px";
}
dojo.body().appendChild(this.dragClone);
dojo.event.connect(this.domNode,"onclick",this,"squelchOnClick");
dojo.event.topic.publish("dragStart",{source:this});
},getConstraints:function(){
if(this.constrainingContainer.nodeName.toLowerCase()=="body"){
var _900=dojo.html.getViewport();
var _901=_900.width;
var _902=_900.height;
var x=0;
var y=0;
}else{
var _905=dojo.html.getContentBox(this.constrainingContainer);
_901=_905.width;
_902=_905.height;
x=this.containingBlockPosition.x+dojo.html.getPixelValue(this.constrainingContainer,"padding-left",true)+dojo.html.getBorderExtent(this.constrainingContainer,"left");
y=this.containingBlockPosition.y+dojo.html.getPixelValue(this.constrainingContainer,"padding-top",true)+dojo.html.getBorderExtent(this.constrainingContainer,"top");
}
var mb=dojo.html.getMarginBox(this.domNode);
return {minX:x,minY:y,maxX:x+_901-mb.width,maxY:y+_902-mb.height};
},updateDragOffset:function(){
var _907=dojo.html.getScroll().offset;
if(_907.y!=this.scrollOffset.y){
var diff=_907.y-this.scrollOffset.y;
this.dragOffset.y+=diff;
this.scrollOffset.y=_907.y;
}
if(_907.x!=this.scrollOffset.x){
var diff=_907.x-this.scrollOffset.x;
this.dragOffset.x+=diff;
this.scrollOffset.x=_907.x;
}
},onDragMove:function(e){
this.updateDragOffset();
var x=this.dragOffset.x+e.pageX;
var y=this.dragOffset.y+e.pageY;
if(this.constrainToContainer){
if(x<this.constraints.minX){
x=this.constraints.minX;
}
if(y<this.constraints.minY){
y=this.constraints.minY;
}
if(x>this.constraints.maxX){
x=this.constraints.maxX;
}
if(y>this.constraints.maxY){
y=this.constraints.maxY;
}
}
this.setAbsolutePosition(x,y);
dojo.event.topic.publish("dragMove",{source:this});
},setAbsolutePosition:function(x,y){
if(!this.disableY){
this.dragClone.style.top=y+"px";
}
if(!this.disableX){
this.dragClone.style.left=x+"px";
}
},onDragEnd:function(e){
switch(e.dragStatus){
case "dropSuccess":
dojo.html.removeNode(this.dragClone);
this.dragClone=null;
break;
case "dropFailure":
var _90f=dojo.html.getAbsolutePosition(this.dragClone,true);
var _910={left:this.dragStartPosition.x+1,top:this.dragStartPosition.y+1};
var anim=dojo.lfx.slideTo(this.dragClone,_910,500,dojo.lfx.easeOut);
var _912=this;
dojo.event.connect(anim,"onEnd",function(e){
dojo.lang.setTimeout(function(){
dojo.html.removeNode(_912.dragClone);
_912.dragClone=null;
},200);
});
anim.play();
break;
}
dojo.event.topic.publish("dragEnd",{source:this});
},squelchOnClick:function(e){
dojo.event.browser.stopEvent(e);
dojo.lang.setTimeout(function(){
dojo.event.disconnect(this.domNode,"onclick",this,"squelchOnClick");
},50);
},constrainTo:function(_915){
this.constrainToContainer=true;
if(_915){
this.constrainingContainer=_915;
}else{
this.constrainingContainer=this.domNode.parentNode;
}
}},function(node,type){
this.domNode=dojo.byId(node);
this.type=type;
this.constrainToContainer=false;
this.dragSource=null;
});
dojo.declare("dojo.dnd.HtmlDropTarget",dojo.dnd.DropTarget,{vertical:false,onDragOver:function(e){
if(!this.accepts(e.dragObjects)){
return false;
}
this.childBoxes=[];
for(var i=0,_91a;i<this.domNode.childNodes.length;i++){
_91a=this.domNode.childNodes[i];
if(_91a.nodeType!=dojo.html.ELEMENT_NODE){
continue;
}
var pos=dojo.html.getAbsolutePosition(_91a,true);
var _91c=dojo.html.getBorderBox(_91a);
this.childBoxes.push({top:pos.y,bottom:pos.y+_91c.height,left:pos.x,right:pos.x+_91c.width,height:_91c.height,width:_91c.width,node:_91a});
}
return true;
},_getNodeUnderMouse:function(e){
for(var i=0,_91f;i<this.childBoxes.length;i++){
with(this.childBoxes[i]){
if(e.pageX>=left&&e.pageX<=right&&e.pageY>=top&&e.pageY<=bottom){
return i;
}
}
}
return -1;
},createDropIndicator:function(){
this.dropIndicator=document.createElement("div");
with(this.dropIndicator.style){
position="absolute";
zIndex=999;
if(this.vertical){
borderLeftWidth="1px";
borderLeftColor="black";
borderLeftStyle="solid";
height=dojo.html.getBorderBox(this.domNode).height+"px";
top=dojo.html.getAbsolutePosition(this.domNode,true).y+"px";
}else{
borderTopWidth="1px";
borderTopColor="black";
borderTopStyle="solid";
width=dojo.html.getBorderBox(this.domNode).width+"px";
left=dojo.html.getAbsolutePosition(this.domNode,true).x+"px";
}
}
},onDragMove:function(e,_921){
var i=this._getNodeUnderMouse(e);
if(!this.dropIndicator){
this.createDropIndicator();
}
var _923=this.vertical?dojo.html.gravity.WEST:dojo.html.gravity.NORTH;
var hide=false;
if(i<0){
if(this.childBoxes.length){
var _925=(dojo.html.gravity(this.childBoxes[0].node,e)&_923);
if(_925){
hide=true;
}
}else{
var _925=true;
}
}else{
var _926=this.childBoxes[i];
var _925=(dojo.html.gravity(_926.node,e)&_923);
if(_926.node===_921[0].dragSource.domNode){
hide=true;
}else{
var _927=_925?(i>0?this.childBoxes[i-1]:_926):(i<this.childBoxes.length-1?this.childBoxes[i+1]:_926);
if(_927.node===_921[0].dragSource.domNode){
hide=true;
}
}
}
if(hide){
this.dropIndicator.style.display="none";
return;
}else{
this.dropIndicator.style.display="";
}
this.placeIndicator(e,_921,i,_925);
if(!dojo.html.hasParent(this.dropIndicator)){
dojo.body().appendChild(this.dropIndicator);
}
},placeIndicator:function(e,_929,_92a,_92b){
var _92c=this.vertical?"left":"top";
var _92d;
if(_92a<0){
if(this.childBoxes.length){
_92d=_92b?this.childBoxes[0]:this.childBoxes[this.childBoxes.length-1];
}else{
this.dropIndicator.style[_92c]=dojo.html.getAbsolutePosition(this.domNode,true)[this.vertical?"x":"y"]+"px";
}
}else{
_92d=this.childBoxes[_92a];
}
if(_92d){
this.dropIndicator.style[_92c]=(_92b?_92d[_92c]:_92d[this.vertical?"right":"bottom"])+"px";
if(this.vertical){
this.dropIndicator.style.height=_92d.height+"px";
this.dropIndicator.style.top=_92d.top+"px";
}else{
this.dropIndicator.style.width=_92d.width+"px";
this.dropIndicator.style.left=_92d.left+"px";
}
}
},onDragOut:function(e){
if(this.dropIndicator){
dojo.html.removeNode(this.dropIndicator);
delete this.dropIndicator;
}
},onDrop:function(e){
this.onDragOut(e);
var i=this._getNodeUnderMouse(e);
var _931=this.vertical?dojo.html.gravity.WEST:dojo.html.gravity.NORTH;
if(i<0){
if(this.childBoxes.length){
if(dojo.html.gravity(this.childBoxes[0].node,e)&_931){
return this.insert(e,this.childBoxes[0].node,"before");
}else{
return this.insert(e,this.childBoxes[this.childBoxes.length-1].node,"after");
}
}
return this.insert(e,this.domNode,"append");
}
var _932=this.childBoxes[i];
if(dojo.html.gravity(_932.node,e)&_931){
return this.insert(e,_932.node,"before");
}else{
return this.insert(e,_932.node,"after");
}
},insert:function(e,_934,_935){
var node=e.dragObject.domNode;
if(_935=="before"){
return dojo.html.insertBefore(node,_934);
}else{
if(_935=="after"){
return dojo.html.insertAfter(node,_934);
}else{
if(_935=="append"){
_934.appendChild(node);
return true;
}
}
}
return false;
}},function(node,_938){
if(arguments.length==0){
return;
}
this.domNode=dojo.byId(node);
dojo.dnd.DropTarget.call(this);
if(_938&&dojo.lang.isString(_938)){
_938=[_938];
}
this.acceptedTypes=_938||[];
});
dojo.provide("dojo.dnd.TreeDragAndDrop");
dojo.dnd.TreeDragSource=function(node,_93a,type,_93c){
this.controller=_93a;
this.treeNode=_93c;
dojo.dnd.HtmlDragSource.call(this,node,type);
};
dojo.inherits(dojo.dnd.TreeDragSource,dojo.dnd.HtmlDragSource);
dojo.lang.extend(dojo.dnd.TreeDragSource,{onDragStart:function(){
var _93d=dojo.dnd.HtmlDragSource.prototype.onDragStart.call(this);
_93d.treeNode=this.treeNode;
_93d.onDragStart=dojo.lang.hitch(_93d,function(e){
this.savedSelectedNode=this.treeNode.tree.selector.selectedNode;
if(this.savedSelectedNode){
this.savedSelectedNode.unMarkSelected();
}
var _93f=dojo.dnd.HtmlDragObject.prototype.onDragStart.apply(this,arguments);
var _940=this.dragClone.getElementsByTagName("img");
for(var i=0;i<_940.length;i++){
_940.item(i).style.backgroundImage="url()";
}
return _93f;
});
_93d.onDragEnd=function(e){
if(this.savedSelectedNode){
this.savedSelectedNode.markSelected();
}
return dojo.dnd.HtmlDragObject.prototype.onDragEnd.apply(this,arguments);
};
return _93d;
},onDragEnd:function(e){
var res=dojo.dnd.HtmlDragSource.prototype.onDragEnd.call(this,e);
return res;
}});
dojo.dnd.TreeDropTarget=function(_945,_946,type,_948){
this.treeNode=_948;
this.controller=_946;
dojo.dnd.HtmlDropTarget.apply(this,[_945,type]);
};
dojo.inherits(dojo.dnd.TreeDropTarget,dojo.dnd.HtmlDropTarget);
dojo.lang.extend(dojo.dnd.TreeDropTarget,{autoExpandDelay:1500,autoExpandTimer:null,position:null,indicatorStyle:"2px black solid",showIndicator:function(_949){
if(this.position==_949){
return;
}
this.hideIndicator();
this.position=_949;
if(_949=="before"){
this.treeNode.labelNode.style.borderTop=this.indicatorStyle;
}else{
if(_949=="after"){
this.treeNode.labelNode.style.borderBottom=this.indicatorStyle;
}else{
if(_949=="onto"){
this.treeNode.markSelected();
}
}
}
},hideIndicator:function(){
this.treeNode.labelNode.style.borderBottom="";
this.treeNode.labelNode.style.borderTop="";
this.treeNode.unMarkSelected();
this.position=null;
},onDragOver:function(e){
var _94b=dojo.dnd.HtmlDropTarget.prototype.onDragOver.apply(this,arguments);
if(_94b&&this.treeNode.isFolder&&!this.treeNode.isExpanded){
this.setAutoExpandTimer();
}
return _94b;
},accepts:function(_94c){
var _94d=dojo.dnd.HtmlDropTarget.prototype.accepts.apply(this,arguments);
if(!_94d){
return false;
}
var _94e=_94c[0].treeNode;
if(dojo.lang.isUndefined(_94e)||!_94e||!_94e.isTreeNode){
dojo.raise("Source is not TreeNode or not found");
}
if(_94e===this.treeNode){
return false;
}
return true;
},setAutoExpandTimer:function(){
var _94f=this;
var _950=function(){
if(dojo.dnd.dragManager.currentDropTarget===_94f){
_94f.controller.expand(_94f.treeNode);
}
};
this.autoExpandTimer=dojo.lang.setTimeout(_950,_94f.autoExpandDelay);
},getDNDMode:function(){
return this.treeNode.tree.DNDMode;
},getAcceptPosition:function(e,_952){
var _953=this.getDNDMode();
if(_953&dojo.widget.Tree.prototype.DNDModes.ONTO&&!(!this.treeNode.actionIsDisabled(dojo.widget.TreeNode.prototype.actions.ADDCHILD)&&_952.parent!==this.treeNode&&this.controller.canMove(_952,this.treeNode))){
_953&=~dojo.widget.Tree.prototype.DNDModes.ONTO;
}
var _954=this.getPosition(e,_953);
if(_954=="onto"||(!this.isAdjacentNode(_952,_954)&&this.controller.canMove(_952,this.treeNode.parent))){
return _954;
}else{
return false;
}
},onDragOut:function(e){
this.clearAutoExpandTimer();
this.hideIndicator();
},clearAutoExpandTimer:function(){
if(this.autoExpandTimer){
clearTimeout(this.autoExpandTimer);
this.autoExpandTimer=null;
}
},onDragMove:function(e,_957){
var _958=_957[0].treeNode;
var _959=this.getAcceptPosition(e,_958);
if(_959){
this.showIndicator(_959);
}
},isAdjacentNode:function(_95a,_95b){
if(_95a===this.treeNode){
return true;
}
if(_95a.getNextSibling()===this.treeNode&&_95b=="before"){
return true;
}
if(_95a.getPreviousSibling()===this.treeNode&&_95b=="after"){
return true;
}
return false;
},getPosition:function(e,_95d){
var node=dojo.byId(this.treeNode.labelNode);
var _95f=e.pageY||e.clientY+dojo.body().scrollTop;
var _960=dojo.html.getAbsolutePosition(node).y;
var _961=dojo.html.getBorderBox(node).height;
var relY=_95f-_960;
var p=relY/_961;
var _964="";
if(_95d&dojo.widget.Tree.prototype.DNDModes.ONTO&&_95d&dojo.widget.Tree.prototype.DNDModes.BETWEEN){
if(p<=0.3){
_964="before";
}else{
if(p<=0.7){
_964="onto";
}else{
_964="after";
}
}
}else{
if(_95d&dojo.widget.Tree.prototype.DNDModes.BETWEEN){
if(p<=0.5){
_964="before";
}else{
_964="after";
}
}else{
if(_95d&dojo.widget.Tree.prototype.DNDModes.ONTO){
_964="onto";
}
}
}
return _964;
},getTargetParentIndex:function(_965,_966){
var _967=_966=="before"?this.treeNode.getParentIndex():this.treeNode.getParentIndex()+1;
if(this.treeNode.parent===_965.parent&&this.treeNode.getParentIndex()>_965.getParentIndex()){
_967--;
}
return _967;
},onDrop:function(e){
var _969=this.position;
this.onDragOut(e);
var _96a=e.dragObject.treeNode;
if(!dojo.lang.isObject(_96a)){
dojo.raise("TreeNode not found in dragObject");
}
if(_969=="onto"){
return this.controller.move(_96a,this.treeNode,0);
}else{
var _96b=this.getTargetParentIndex(_96a,_969);
return this.controller.move(_96a,this.treeNode.parent,_96b);
}
}});
dojo.dnd.TreeDNDController=function(_96c){
this.treeController=_96c;
this.dragSources={};
this.dropTargets={};
};
dojo.lang.extend(dojo.dnd.TreeDNDController,{listenTree:function(tree){
dojo.event.topic.subscribe(tree.eventNames.createDOMNode,this,"onCreateDOMNode");
dojo.event.topic.subscribe(tree.eventNames.moveFrom,this,"onMoveFrom");
dojo.event.topic.subscribe(tree.eventNames.moveTo,this,"onMoveTo");
dojo.event.topic.subscribe(tree.eventNames.addChild,this,"onAddChild");
dojo.event.topic.subscribe(tree.eventNames.removeNode,this,"onRemoveNode");
dojo.event.topic.subscribe(tree.eventNames.treeDestroy,this,"onTreeDestroy");
},unlistenTree:function(tree){
dojo.event.topic.unsubscribe(tree.eventNames.createDOMNode,this,"onCreateDOMNode");
dojo.event.topic.unsubscribe(tree.eventNames.moveFrom,this,"onMoveFrom");
dojo.event.topic.unsubscribe(tree.eventNames.moveTo,this,"onMoveTo");
dojo.event.topic.unsubscribe(tree.eventNames.addChild,this,"onAddChild");
dojo.event.topic.unsubscribe(tree.eventNames.removeNode,this,"onRemoveNode");
dojo.event.topic.unsubscribe(tree.eventNames.treeDestroy,this,"onTreeDestroy");
},onTreeDestroy:function(_96f){
this.unlistenTree(_96f.source);
},onCreateDOMNode:function(_970){
this.registerDNDNode(_970.source);
},onAddChild:function(_971){
this.registerDNDNode(_971.child);
},onMoveFrom:function(_972){
var _973=this;
dojo.lang.forEach(_972.child.getDescendants(),function(node){
_973.unregisterDNDNode(node);
});
},onMoveTo:function(_975){
var _976=this;
dojo.lang.forEach(_975.child.getDescendants(),function(node){
_976.registerDNDNode(node);
});
},registerDNDNode:function(node){
if(!node.tree.DNDMode){
return;
}
var _979=null;
var _97a=null;
if(!node.actionIsDisabled(node.actions.MOVE)){
var _979=new dojo.dnd.TreeDragSource(node.labelNode,this,node.tree.widgetId,node);
this.dragSources[node.widgetId]=_979;
}
var _97a=new dojo.dnd.TreeDropTarget(node.labelNode,this.treeController,node.tree.DNDAcceptTypes,node);
this.dropTargets[node.widgetId]=_97a;
},unregisterDNDNode:function(node){
if(this.dragSources[node.widgetId]){
dojo.dnd.dragManager.unregisterDragSource(this.dragSources[node.widgetId]);
delete this.dragSources[node.widgetId];
}
if(this.dropTargets[node.widgetId]){
dojo.dnd.dragManager.unregisterDropTarget(this.dropTargets[node.widgetId]);
delete this.dropTargets[node.widgetId];
}
}});
dojo.provide("dojo.widget.TreeBasicController");
dojo.widget.defineWidget("dojo.widget.TreeBasicController",dojo.widget.HtmlWidget,{widgetType:"TreeBasicController",DNDController:"",dieWithTree:false,initialize:function(args,frag){
if(this.DNDController=="create"){
dojo.require("dojo.dnd.TreeDragAndDrop");
this.DNDController=new dojo.dnd.TreeDNDController(this);
}
},listenTree:function(tree){
dojo.event.topic.subscribe(tree.eventNames.createDOMNode,this,"onCreateDOMNode");
dojo.event.topic.subscribe(tree.eventNames.treeClick,this,"onTreeClick");
dojo.event.topic.subscribe(tree.eventNames.treeCreate,this,"onTreeCreate");
dojo.event.topic.subscribe(tree.eventNames.treeDestroy,this,"onTreeDestroy");
if(this.DNDController){
this.DNDController.listenTree(tree);
}
},unlistenTree:function(tree){
dojo.event.topic.unsubscribe(tree.eventNames.createDOMNode,this,"onCreateDOMNode");
dojo.event.topic.unsubscribe(tree.eventNames.treeClick,this,"onTreeClick");
dojo.event.topic.unsubscribe(tree.eventNames.treeCreate,this,"onTreeCreate");
dojo.event.topic.unsubscribe(tree.eventNames.treeDestroy,this,"onTreeDestroy");
},onTreeDestroy:function(_980){
var tree=_980.source;
this.unlistenTree(tree);
if(this.dieWithTree){
this.destroy();
}
},onCreateDOMNode:function(_982){
var node=_982.source;
if(node.expandLevel>0){
this.expandToLevel(node,node.expandLevel);
}
},onTreeCreate:function(_984){
var tree=_984.source;
var _986=this;
if(tree.expandLevel){
dojo.lang.forEach(tree.children,function(_987){
_986.expandToLevel(_987,tree.expandLevel-1);
});
}
},expandToLevel:function(node,_989){
if(_989==0){
return;
}
var _98a=node.children;
var _98b=this;
var _98c=function(node,_98e){
this.node=node;
this.expandLevel=_98e;
this.process=function(){
for(var i=0;i<this.node.children.length;i++){
var _990=node.children[i];
_98b.expandToLevel(_990,this.expandLevel);
}
};
};
var h=new _98c(node,_989-1);
this.expand(node,false,h,h.process);
},onTreeClick:function(_992){
var node=_992.source;
if(node.isLocked()){
return false;
}
if(node.isExpanded){
this.collapse(node);
}else{
this.expand(node);
}
},expand:function(node,sync,_996,_997){
node.expand();
if(_997){
_997.apply(_996,[node]);
}
},collapse:function(node){
node.collapse();
},canMove:function(_999,_99a){
if(_999.actionIsDisabled(_999.actions.MOVE)){
return false;
}
if(_999.parent!==_99a&&_99a.actionIsDisabled(_99a.actions.ADDCHILD)){
return false;
}
var node=_99a;
while(node.isTreeNode){
if(node===_999){
return false;
}
node=node.parent;
}
return true;
},move:function(_99c,_99d,_99e){
if(!this.canMove(_99c,_99d)){
return false;
}
var _99f=this.doMove(_99c,_99d,_99e);
if(!_99f){
return _99f;
}
if(_99d.isTreeNode){
this.expand(_99d);
}
return _99f;
},doMove:function(_9a0,_9a1,_9a2){
_9a0.tree.move(_9a0,_9a1,_9a2);
return true;
},canRemoveNode:function(_9a3){
if(_9a3.actionIsDisabled(_9a3.actions.REMOVE)){
return false;
}
return true;
},removeNode:function(node,_9a5,_9a6){
if(!this.canRemoveNode(node)){
return false;
}
return this.doRemoveNode(node,_9a5,_9a6);
},doRemoveNode:function(node,_9a8,_9a9){
node.tree.removeNode(node);
if(_9a9){
_9a9.apply(dojo.lang.isUndefined(_9a8)?this:_9a8,[node]);
}
},canCreateChild:function(_9aa,_9ab,data){
if(_9aa.actionIsDisabled(_9aa.actions.ADDCHILD)){
return false;
}
return true;
},createChild:function(_9ad,_9ae,data,_9b0,_9b1){
if(!this.canCreateChild(_9ad,_9ae,data)){
return false;
}
return this.doCreateChild.apply(this,arguments);
},doCreateChild:function(_9b2,_9b3,data,_9b5,_9b6){
var _9b7=data.widgetType?data.widgetType:"TreeNode";
var _9b8=dojo.widget.createWidget(_9b7,data);
_9b2.addChild(_9b8,_9b3);
this.expand(_9b2);
if(_9b6){
_9b6.apply(_9b5,[_9b8]);
}
return _9b8;
}});
dojo.provide("dojo.widget.TreeSelector");
dojo.widget.defineWidget("dojo.widget.TreeSelector",dojo.widget.HtmlWidget,function(){
this.eventNames={};
this.listenedTrees=[];
},{widgetType:"TreeSelector",selectedNode:null,dieWithTree:false,eventNamesDefault:{select:"select",destroy:"destroy",deselect:"deselect",dblselect:"dblselect"},initialize:function(){
for(name in this.eventNamesDefault){
if(dojo.lang.isUndefined(this.eventNames[name])){
this.eventNames[name]=this.widgetId+"/"+this.eventNamesDefault[name];
}
}
},destroy:function(){
dojo.event.topic.publish(this.eventNames.destroy,{source:this});
return dojo.widget.HtmlWidget.prototype.destroy.apply(this,arguments);
},listenTree:function(tree){
dojo.event.topic.subscribe(tree.eventNames.titleClick,this,"select");
dojo.event.topic.subscribe(tree.eventNames.iconClick,this,"select");
dojo.event.topic.subscribe(tree.eventNames.collapse,this,"onCollapse");
dojo.event.topic.subscribe(tree.eventNames.moveFrom,this,"onMoveFrom");
dojo.event.topic.subscribe(tree.eventNames.removeNode,this,"onRemoveNode");
dojo.event.topic.subscribe(tree.eventNames.treeDestroy,this,"onTreeDestroy");
this.listenedTrees.push(tree);
},unlistenTree:function(tree){
dojo.event.topic.unsubscribe(tree.eventNames.titleClick,this,"select");
dojo.event.topic.unsubscribe(tree.eventNames.iconClick,this,"select");
dojo.event.topic.unsubscribe(tree.eventNames.collapse,this,"onCollapse");
dojo.event.topic.unsubscribe(tree.eventNames.moveFrom,this,"onMoveFrom");
dojo.event.topic.unsubscribe(tree.eventNames.removeNode,this,"onRemoveNode");
dojo.event.topic.unsubscribe(tree.eventNames.treeDestroy,this,"onTreeDestroy");
for(var i=0;i<this.listenedTrees.length;i++){
if(this.listenedTrees[i]===tree){
this.listenedTrees.splice(i,1);
break;
}
}
},onTreeDestroy:function(_9bc){
this.unlistenTree(_9bc.source);
if(this.dieWithTree){
this.destroy();
}
},onCollapse:function(_9bd){
if(!this.selectedNode){
return;
}
var node=_9bd.source;
var _9bf=this.selectedNode.parent;
while(_9bf!==node&&_9bf.isTreeNode){
_9bf=_9bf.parent;
}
if(_9bf.isTreeNode){
this.deselect();
}
},select:function(_9c0){
var node=_9c0.source;
var e=_9c0.event;
if(this.selectedNode===node){
if(e.ctrlKey||e.shiftKey||e.metaKey){
this.deselect();
return;
}
dojo.event.topic.publish(this.eventNames.dblselect,{node:node});
return;
}
if(this.selectedNode){
this.deselect();
}
this.doSelect(node);
dojo.event.topic.publish(this.eventNames.select,{node:node});
},onMoveFrom:function(_9c3){
if(_9c3.child!==this.selectedNode){
return;
}
if(!dojo.lang.inArray(this.listenedTrees,_9c3.newTree)){
this.deselect();
}
},onRemoveNode:function(_9c4){
if(_9c4.child!==this.selectedNode){
return;
}
this.deselect();
},doSelect:function(node){
node.markSelected();
this.selectedNode=node;
},deselect:function(){
var node=this.selectedNode;
this.selectedNode=null;
node.unMarkSelected();
dojo.event.topic.publish(this.eventNames.deselect,{node:node});
}});
dojo.provide("dojo.widget.Tree");
dojo.widget.defineWidget("dojo.widget.Tree",dojo.widget.HtmlWidget,function(){
this.eventNames={};
this.tree=this;
this.DNDAcceptTypes=[];
this.actionsDisabled=[];
},{widgetType:"Tree",eventNamesDefault:{createDOMNode:"createDOMNode",treeCreate:"treeCreate",treeDestroy:"treeDestroy",treeClick:"treeClick",iconClick:"iconClick",titleClick:"titleClick",moveFrom:"moveFrom",moveTo:"moveTo",addChild:"addChild",removeNode:"removeNode",expand:"expand",collapse:"collapse"},isContainer:true,DNDMode:"off",lockLevel:0,strictFolders:true,DNDModes:{BETWEEN:1,ONTO:2},DNDAcceptTypes:"",templateCssPath:dojo.uri.dojoUri("src/widget/templates/images/Tree/Tree.css"),templateString:"<div class=\"dojoTree\"></div>",isExpanded:true,isTree:true,objectId:"",controller:"",selector:"",menu:"",expandLevel:"",blankIconSrc:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_blank.gif"),gridIconSrcT:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_grid_t.gif"),gridIconSrcL:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_grid_l.gif"),gridIconSrcV:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_grid_v.gif"),gridIconSrcP:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_grid_p.gif"),gridIconSrcC:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_grid_c.gif"),gridIconSrcX:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_grid_x.gif"),gridIconSrcY:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_grid_y.gif"),gridIconSrcZ:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_grid_z.gif"),expandIconSrcPlus:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_expand_plus.gif"),expandIconSrcMinus:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_expand_minus.gif"),expandIconSrcLoading:dojo.uri.dojoUri("src/widget/templates/images/Tree/treenode_loading.gif"),iconWidth:18,iconHeight:18,showGrid:true,showRootGrid:true,actionIsDisabled:function(_9c7){
var _9c8=this;
return dojo.lang.inArray(_9c8.actionsDisabled,_9c7);
},actions:{ADDCHILD:"ADDCHILD"},getInfo:function(){
var info={widgetId:this.widgetId,objectId:this.objectId};
return info;
},initializeController:function(){
if(this.controller!="off"){
if(this.controller){
this.controller=dojo.widget.byId(this.controller);
}else{
dojo.require("dojo.widget.TreeBasicController");
this.controller=dojo.widget.createWidget("TreeBasicController",{DNDController:(this.DNDMode?"create":""),dieWithTree:true});
}
this.controller.listenTree(this);
}else{
this.controller=null;
}
},initializeSelector:function(){
if(this.selector!="off"){
if(this.selector){
this.selector=dojo.widget.byId(this.selector);
}else{
dojo.require("dojo.widget.TreeSelector");
this.selector=dojo.widget.createWidget("TreeSelector",{dieWithTree:true});
}
this.selector.listenTree(this);
}else{
this.selector=null;
}
},initialize:function(args,frag){
var _9cc=this;
for(name in this.eventNamesDefault){
if(dojo.lang.isUndefined(this.eventNames[name])){
this.eventNames[name]=this.widgetId+"/"+this.eventNamesDefault[name];
}
}
for(var i=0;i<this.actionsDisabled.length;i++){
this.actionsDisabled[i]=this.actionsDisabled[i].toUpperCase();
}
if(this.DNDMode=="off"){
this.DNDMode=0;
}else{
if(this.DNDMode=="between"){
this.DNDMode=this.DNDModes.ONTO|this.DNDModes.BETWEEN;
}else{
if(this.DNDMode=="onto"){
this.DNDMode=this.DNDModes.ONTO;
}
}
}
this.expandLevel=parseInt(this.expandLevel);
this.initializeSelector();
this.initializeController();
if(this.menu){
this.menu=dojo.widget.byId(this.menu);
this.menu.listenTree(this);
}
this.containerNode=this.domNode;
},postCreate:function(){
this.createDOMNode();
},createDOMNode:function(){
dojo.html.disableSelection(this.domNode);
for(var i=0;i<this.children.length;i++){
this.children[i].parent=this;
var node=this.children[i].createDOMNode(this,0);
this.domNode.appendChild(node);
}
if(!this.showRootGrid){
for(var i=0;i<this.children.length;i++){
this.children[i].expand();
}
}
dojo.event.topic.publish(this.eventNames.treeCreate,{source:this});
},destroy:function(){
dojo.event.topic.publish(this.tree.eventNames.treeDestroy,{source:this});
return dojo.widget.HtmlWidget.prototype.destroy.apply(this,arguments);
},addChild:function(_9d0,_9d1){
var _9d2={child:_9d0,index:_9d1,parent:this,domNodeInitialized:_9d0.domNodeInitialized};
this.doAddChild.apply(this,arguments);
dojo.event.topic.publish(this.tree.eventNames.addChild,_9d2);
},doAddChild:function(_9d3,_9d4){
if(dojo.lang.isUndefined(_9d4)){
_9d4=this.children.length;
}
if(!_9d3.isTreeNode){
dojo.raise("You can only add TreeNode widgets to a "+this.widgetType+" widget!");
return;
}
if(this.isTreeNode){
if(!this.isFolder){
this.setFolder();
}
}
var _9d5=this;
dojo.lang.forEach(_9d3.getDescendants(),function(elem){
elem.tree=_9d5.tree;
});
_9d3.parent=this;
if(this.isTreeNode){
this.state=this.loadStates.LOADED;
}
if(_9d4<this.children.length){
dojo.html.insertBefore(_9d3.domNode,this.children[_9d4].domNode);
}else{
this.containerNode.appendChild(_9d3.domNode);
if(this.isExpanded&&this.isTreeNode){
this.showChildren();
}
}
this.children.splice(_9d4,0,_9d3);
if(_9d3.domNodeInitialized){
var d=this.isTreeNode?this.depth:-1;
_9d3.adjustDepth(d-_9d3.depth+1);
_9d3.updateIconTree();
}else{
_9d3.depth=this.isTreeNode?this.depth+1:0;
_9d3.createDOMNode(_9d3.tree,_9d3.depth);
}
var _9d8=_9d3.getPreviousSibling();
if(_9d3.isLastChild()&&_9d8){
_9d8.updateExpandGridColumn();
}
},makeBlankImg:function(){
var img=document.createElement("img");
img.style.width=this.iconWidth+"px";
img.style.height=this.iconHeight+"px";
img.src=this.blankIconSrc;
img.style.verticalAlign="middle";
return img;
},updateIconTree:function(){
if(!this.isTree){
this.updateIcons();
}
for(var i=0;i<this.children.length;i++){
this.children[i].updateIconTree();
}
},toString:function(){
return "["+this.widgetType+" ID:"+this.widgetId+"]";
},move:function(_9db,_9dc,_9dd){
var _9de=_9db.parent;
var _9df=_9db.tree;
this.doMove.apply(this,arguments);
var _9dc=_9db.parent;
var _9e0=_9db.tree;
var _9e1={oldParent:_9de,oldTree:_9df,newParent:_9dc,newTree:_9e0,child:_9db};
dojo.event.topic.publish(_9df.eventNames.moveFrom,_9e1);
dojo.event.topic.publish(_9e0.eventNames.moveTo,_9e1);
},doMove:function(_9e2,_9e3,_9e4){
_9e2.parent.doRemoveNode(_9e2);
_9e3.doAddChild(_9e2,_9e4);
},removeNode:function(_9e5){
if(!_9e5.parent){
return;
}
var _9e6=_9e5.tree;
var _9e7=_9e5.parent;
var _9e8=this.doRemoveNode.apply(this,arguments);
dojo.event.topic.publish(this.tree.eventNames.removeNode,{child:_9e8,tree:_9e6,parent:_9e7});
return _9e8;
},doRemoveNode:function(_9e9){
if(!_9e9.parent){
return;
}
var _9ea=_9e9.parent;
var _9eb=_9ea.children;
var _9ec=_9e9.getParentIndex();
if(_9ec<0){
dojo.raise("Couldn't find node "+_9e9+" for removal");
}
_9eb.splice(_9ec,1);
dojo.html.removeNode(_9e9.domNode);
if(_9ea.children.length==0&&!_9ea.isTree){
_9ea.containerNode.style.display="none";
}
if(_9ec==_9eb.length&&_9ec>0){
_9eb[_9ec-1].updateExpandGridColumn();
}
if(_9ea instanceof dojo.widget.Tree&&_9ec==0&&_9eb.length>0){
_9eb[0].updateExpandGrid();
}
_9e9.parent=_9e9.tree=null;
return _9e9;
},markLoading:function(){
},unMarkLoading:function(){
},lock:function(){
!this.lockLevel&&this.markLoading();
this.lockLevel++;
},unlock:function(){
if(!this.lockLevel){
dojo.raise("unlock: not locked");
}
this.lockLevel--;
!this.lockLevel&&this.unMarkLoading();
},isLocked:function(){
var node=this;
while(true){
if(node.lockLevel){
return true;
}
if(node instanceof dojo.widget.Tree){
break;
}
node=node.parent;
}
return false;
},flushLock:function(){
this.lockLevel=0;
this.unMarkLoading();
}});
dojo.provide("dojo.widget.TreeLoadingController");
dojo.widget.defineWidget("dojo.widget.TreeLoadingController",dojo.widget.TreeBasicController,{RPCUrl:"",RPCActionParam:"action",RPCErrorHandler:function(type,obj,evt){
alert("RPC Error: "+(obj.message||"no message"));
},preventCache:true,getRPCUrl:function(_9f1){
if(this.RPCUrl=="local"){
var dir=document.location.href.substr(0,document.location.href.lastIndexOf("/"));
var _9f3=dir+"/"+_9f1;
return _9f3;
}
if(!this.RPCUrl){
dojo.raise("Empty RPCUrl: can't load");
}
return this.RPCUrl+(this.RPCUrl.indexOf("?")>-1?"&":"?")+this.RPCActionParam+"="+_9f1;
},loadProcessResponse:function(node,_9f5,_9f6,_9f7){
if(!dojo.lang.isUndefined(_9f5.error)){
this.RPCErrorHandler("server",_9f5.error);
return false;
}
var _9f8=_9f5;
if(!dojo.lang.isArray(_9f8)){
dojo.raise("loadProcessResponse: Not array loaded: "+_9f8);
}
for(var i=0;i<_9f8.length;i++){
_9f8[i]=dojo.widget.createWidget(node.widgetType,_9f8[i]);
node.addChild(_9f8[i]);
}
node.state=node.loadStates.LOADED;
if(dojo.lang.isFunction(_9f7)){
_9f7.apply(dojo.lang.isUndefined(_9f6)?this:_9f6,[node,_9f8]);
}
},getInfo:function(obj){
return obj.getInfo();
},runRPC:function(kw){
var _9fc=this;
var _9fd=function(type,data,evt){
if(kw.lock){
dojo.lang.forEach(kw.lock,function(t){
t.unlock();
});
}
if(type=="load"){
kw.load.call(this,data);
}else{
this.RPCErrorHandler(type,data,evt);
}
};
if(kw.lock){
dojo.lang.forEach(kw.lock,function(t){
t.lock();
});
}
dojo.io.bind({url:kw.url,handle:dojo.lang.hitch(this,_9fd),mimetype:"text/json",preventCache:_9fc.preventCache,sync:kw.sync,content:{data:dojo.json.serialize(kw.params)}});
},loadRemote:function(node,sync,_a05,_a06){
var _a07=this;
var _a08={node:this.getInfo(node),tree:this.getInfo(node.tree)};
this.runRPC({url:this.getRPCUrl("getChildren"),load:function(_a09){
_a07.loadProcessResponse(node,_a09,_a05,_a06);
},sync:sync,lock:[node],params:_a08});
},expand:function(node,sync,_a0c,_a0d){
if(node.state==node.loadStates.UNCHECKED&&node.isFolder){
this.loadRemote(node,sync,this,function(node,_a0f){
this.expand(node,sync,_a0c,_a0d);
});
return;
}
dojo.widget.TreeBasicController.prototype.expand.apply(this,arguments);
},doMove:function(_a10,_a11,_a12){
if(_a11.isTreeNode&&_a11.state==_a11.loadStates.UNCHECKED){
this.loadRemote(_a11,true);
}
return dojo.widget.TreeBasicController.prototype.doMove.apply(this,arguments);
},doCreateChild:function(_a13,_a14,data,_a16,_a17){
if(_a13.state==_a13.loadStates.UNCHECKED){
this.loadRemote(_a13,true);
}
return dojo.widget.TreeBasicController.prototype.doCreateChild.apply(this,arguments);
}});
dojo.provide("dojo.widget.TreeRPCController");
dojo.widget.defineWidget("dojo.widget.TreeRPCController",dojo.widget.TreeLoadingController,{doMove:function(_a18,_a19,_a1a){
var _a1b={child:this.getInfo(_a18),childTree:this.getInfo(_a18.tree),newParent:this.getInfo(_a19),newParentTree:this.getInfo(_a19.tree),newIndex:_a1a};
var _a1c;
this.runRPC({url:this.getRPCUrl("move"),load:function(_a1d){
_a1c=this.doMoveProcessResponse(_a1d,_a18,_a19,_a1a);
},sync:true,lock:[_a18,_a19],params:_a1b});
return _a1c;
},doMoveProcessResponse:function(_a1e,_a1f,_a20,_a21){
if(!dojo.lang.isUndefined(_a1e.error)){
this.RPCErrorHandler("server",_a1e.error);
return false;
}
var args=[_a1f,_a20,_a21];
return dojo.widget.TreeLoadingController.prototype.doMove.apply(this,args);
},doRemoveNode:function(node,_a24,_a25){
var _a26={node:this.getInfo(node),tree:this.getInfo(node.tree)};
this.runRPC({url:this.getRPCUrl("removeNode"),load:function(_a27){
this.doRemoveNodeProcessResponse(_a27,node,_a24,_a25);
},params:_a26,lock:[node]});
},doRemoveNodeProcessResponse:function(_a28,node,_a2a,_a2b){
if(!dojo.lang.isUndefined(_a28.error)){
this.RPCErrorHandler("server",_a28.error);
return false;
}
if(!_a28){
return false;
}
if(_a28==true){
var args=[node,_a2a,_a2b];
dojo.widget.TreeLoadingController.prototype.doRemoveNode.apply(this,args);
return;
}else{
if(dojo.lang.isObject(_a28)){
dojo.raise(_a28.error);
}else{
dojo.raise("Invalid response "+_a28);
}
}
},doCreateChild:function(_a2d,_a2e,_a2f,_a30,_a31){
var _a32={tree:this.getInfo(_a2d.tree),parent:this.getInfo(_a2d),index:_a2e,data:_a2f};
this.runRPC({url:this.getRPCUrl("createChild"),load:function(_a33){
this.doCreateChildProcessResponse(_a33,_a2d,_a2e,_a30,_a31);
},params:_a32,lock:[_a2d]});
},doCreateChildProcessResponse:function(_a34,_a35,_a36,_a37,_a38){
if(!dojo.lang.isUndefined(_a34.error)){
this.RPCErrorHandler("server",_a34.error);
return false;
}
if(!dojo.lang.isObject(_a34)){
dojo.raise("Invalid result "+_a34);
}
var args=[_a35,_a36,_a34,_a37,_a38];
dojo.widget.TreeLoadingController.prototype.doCreateChild.apply(this,args);
}});
dojo.provide("dojo.date.common");
dojo.date.setDayOfYear=function(_a3a,_a3b){
_a3a.setMonth(0);
_a3a.setDate(_a3b);
return _a3a;
};
dojo.date.getDayOfYear=function(_a3c){
var _a3d=_a3c.getFullYear();
var _a3e=new Date(_a3d-1,11,31);
return Math.floor((_a3c.getTime()-_a3e.getTime())/86400000);
};
dojo.date.setWeekOfYear=function(_a3f,week,_a41){
if(arguments.length==1){
_a41=0;
}
dojo.unimplemented("dojo.date.setWeekOfYear");
};
dojo.date.getWeekOfYear=function(_a42,_a43){
if(arguments.length==1){
_a43=0;
}
var _a44=new Date(_a42.getFullYear(),0,1);
var day=_a44.getDay();
_a44.setDate(_a44.getDate()-day+_a43-(day>_a43?7:0));
return Math.floor((_a42.getTime()-_a44.getTime())/604800000);
};
dojo.date.setIsoWeekOfYear=function(_a46,week,_a48){
if(arguments.length==1){
_a48=1;
}
dojo.unimplemented("dojo.date.setIsoWeekOfYear");
};
dojo.date.getIsoWeekOfYear=function(_a49,_a4a){
if(arguments.length==1){
_a4a=1;
}
dojo.unimplemented("dojo.date.getIsoWeekOfYear");
};
dojo.date.shortTimezones=["IDLW","BET","HST","MART","AKST","PST","MST","CST","EST","AST","NFT","BST","FST","AT","GMT","CET","EET","MSK","IRT","GST","AFT","AGTT","IST","NPT","ALMT","MMT","JT","AWST","JST","ACST","AEST","LHST","VUT","NFT","NZT","CHAST","PHOT","LINT"];
dojo.date.timezoneOffsets=[-720,-660,-600,-570,-540,-480,-420,-360,-300,-240,-210,-180,-120,-60,0,60,120,180,210,240,270,300,330,345,360,390,420,480,540,570,600,630,660,690,720,765,780,840];
dojo.date.getDaysInMonth=function(_a4b){
var _a4c=_a4b.getMonth();
var days=[31,28,31,30,31,30,31,31,30,31,30,31];
if(_a4c==1&&dojo.date.isLeapYear(_a4b)){
return 29;
}else{
return days[_a4c];
}
};
dojo.date.isLeapYear=function(_a4e){
var year=_a4e.getFullYear();
return (year%400==0)?true:(year%100==0)?false:(year%4==0)?true:false;
};
dojo.date.getTimezoneName=function(_a50){
var str=_a50.toString();
var tz="";
var _a53;
var pos=str.indexOf("(");
if(pos>-1){
pos++;
tz=str.substring(pos,str.indexOf(")"));
}else{
var pat=/([A-Z\/]+) \d{4}$/;
if((_a53=str.match(pat))){
tz=_a53[1];
}else{
str=_a50.toLocaleString();
pat=/ ([A-Z\/]+)$/;
if((_a53=str.match(pat))){
tz=_a53[1];
}
}
}
return tz=="AM"||tz=="PM"?"":tz;
};
dojo.date.getOrdinal=function(_a56){
var date=_a56.getDate();
if(date%100!=11&&date%10==1){
return "st";
}else{
if(date%100!=12&&date%10==2){
return "nd";
}else{
if(date%100!=13&&date%10==3){
return "rd";
}else{
return "th";
}
}
}
};
dojo.date.compareTypes={DATE:1,TIME:2};
dojo.date.compare=function(_a58,_a59,_a5a){
var dA=_a58;
var dB=_a59||new Date();
var now=new Date();
with(dojo.date.compareTypes){
var opt=_a5a||(DATE|TIME);
var d1=new Date((opt&DATE)?dA.getFullYear():now.getFullYear(),(opt&DATE)?dA.getMonth():now.getMonth(),(opt&DATE)?dA.getDate():now.getDate(),(opt&TIME)?dA.getHours():0,(opt&TIME)?dA.getMinutes():0,(opt&TIME)?dA.getSeconds():0);
var d2=new Date((opt&DATE)?dB.getFullYear():now.getFullYear(),(opt&DATE)?dB.getMonth():now.getMonth(),(opt&DATE)?dB.getDate():now.getDate(),(opt&TIME)?dB.getHours():0,(opt&TIME)?dB.getMinutes():0,(opt&TIME)?dB.getSeconds():0);
}
if(d1.valueOf()>d2.valueOf()){
return 1;
}
if(d1.valueOf()<d2.valueOf()){
return -1;
}
return 0;
};
dojo.date.dateParts={YEAR:0,MONTH:1,DAY:2,HOUR:3,MINUTE:4,SECOND:5,MILLISECOND:6,QUARTER:7,WEEK:8,WEEKDAY:9};
dojo.date.add=function(dt,_a62,incr){
if(typeof dt=="number"){
dt=new Date(dt);
}
function fixOvershoot(){
if(sum.getDate()<dt.getDate()){
sum.setDate(0);
}
}
var sum=new Date(dt);
with(dojo.date.dateParts){
switch(_a62){
case YEAR:
sum.setFullYear(dt.getFullYear()+incr);
fixOvershoot();
break;
case QUARTER:
incr*=3;
case MONTH:
sum.setMonth(dt.getMonth()+incr);
fixOvershoot();
break;
case WEEK:
incr*=7;
case DAY:
sum.setDate(dt.getDate()+incr);
break;
case WEEKDAY:
var dat=dt.getDate();
var _a66=0;
var days=0;
var strt=0;
var trgt=0;
var adj=0;
var mod=incr%5;
if(mod==0){
days=(incr>0)?5:-5;
_a66=(incr>0)?((incr-5)/5):((incr+5)/5);
}else{
days=mod;
_a66=parseInt(incr/5);
}
strt=dt.getDay();
if(strt==6&&incr>0){
adj=1;
}else{
if(strt==0&&incr<0){
adj=-1;
}
}
trgt=(strt+days);
if(trgt==0||trgt==6){
adj=(incr>0)?2:-2;
}
sum.setDate(dat+(7*_a66)+days+adj);
break;
case HOUR:
sum.setHours(sum.getHours()+incr);
break;
case MINUTE:
sum.setMinutes(sum.getMinutes()+incr);
break;
case SECOND:
sum.setSeconds(sum.getSeconds()+incr);
break;
case MILLISECOND:
sum.setMilliseconds(sum.getMilliseconds()+incr);
break;
default:
break;
}
}
return sum;
};
dojo.date.diff=function(dtA,dtB,_a6e){
if(typeof dtA=="number"){
dtA=new Date(dtA);
}
if(typeof dtB=="number"){
dtB=new Date(dtB);
}
var _a6f=dtB.getFullYear()-dtA.getFullYear();
var _a70=(dtB.getMonth()-dtA.getMonth())+(_a6f*12);
var _a71=dtB.getTime()-dtA.getTime();
var _a72=_a71/1000;
var _a73=_a72/60;
var _a74=_a73/60;
var _a75=_a74/24;
var _a76=_a75/7;
var _a77=0;
with(dojo.date.dateParts){
switch(_a6e){
case YEAR:
_a77=_a6f;
break;
case QUARTER:
var mA=dtA.getMonth();
var mB=dtB.getMonth();
var qA=Math.floor(mA/3)+1;
var qB=Math.floor(mB/3)+1;
qB+=(_a6f*4);
_a77=qB-qA;
break;
case MONTH:
_a77=_a70;
break;
case WEEK:
_a77=parseInt(_a76);
break;
case DAY:
_a77=_a75;
break;
case WEEKDAY:
var days=Math.round(_a75);
var _a7d=parseInt(days/7);
var mod=days%7;
if(mod==0){
days=_a7d*5;
}else{
var adj=0;
var aDay=dtA.getDay();
var bDay=dtB.getDay();
_a7d=parseInt(days/7);
mod=days%7;
var _a82=new Date(dtA);
_a82.setDate(_a82.getDate()+(_a7d*7));
var _a83=_a82.getDay();
if(_a75>0){
switch(true){
case aDay==6:
adj=-1;
break;
case aDay==0:
adj=0;
break;
case bDay==6:
adj=-1;
break;
case bDay==0:
adj=-2;
break;
case (_a83+mod)>5:
adj=-2;
break;
default:
break;
}
}else{
if(_a75<0){
switch(true){
case aDay==6:
adj=0;
break;
case aDay==0:
adj=1;
break;
case bDay==6:
adj=2;
break;
case bDay==0:
adj=1;
break;
case (_a83+mod)<0:
adj=2;
break;
default:
break;
}
}
}
days+=adj;
days-=(_a7d*2);
}
_a77=days;
break;
case HOUR:
_a77=_a74;
break;
case MINUTE:
_a77=_a73;
break;
case SECOND:
_a77=_a72;
break;
case MILLISECOND:
_a77=_a71;
break;
default:
break;
}
}
return Math.round(_a77);
};
dojo.provide("dojo.date.supplemental");
dojo.date.getFirstDayOfWeek=function(_a84){
var _a85={mv:5,ae:6,af:6,bh:6,dj:6,dz:6,eg:6,er:6,et:6,iq:6,ir:6,jo:6,ke:6,kw:6,lb:6,ly:6,ma:6,om:6,qa:6,sa:6,sd:6,so:6,tn:6,ye:6,as:0,au:0,az:0,bw:0,ca:0,cn:0,fo:0,ge:0,gl:0,gu:0,hk:0,ie:0,il:0,is:0,jm:0,jp:0,kg:0,kr:0,la:0,mh:0,mo:0,mp:0,mt:0,nz:0,ph:0,pk:0,sg:0,th:0,tt:0,tw:0,um:0,us:0,uz:0,vi:0,za:0,zw:0,et:0,mw:0,ng:0,tj:0,gb:0,sy:4};
_a84=dojo.hostenv.normalizeLocale(_a84);
var _a86=_a84.split("-")[1];
var dow=_a85[_a86];
return (typeof dow=="undefined")?1:dow;
};
dojo.date.getWeekend=function(_a88){
var _a89={eg:5,il:5,sy:5,"in":0,ae:4,bh:4,dz:4,iq:4,jo:4,kw:4,lb:4,ly:4,ma:4,om:4,qa:4,sa:4,sd:4,tn:4,ye:4};
var _a8a={ae:5,bh:5,dz:5,iq:5,jo:5,kw:5,lb:5,ly:5,ma:5,om:5,qa:5,sa:5,sd:5,tn:5,ye:5,af:5,ir:5,eg:6,il:6,sy:6};
_a88=dojo.hostenv.normalizeLocale(_a88);
var _a8b=_a88.split("-")[1];
var _a8c=_a89[_a8b];
var end=_a8a[_a8b];
if(typeof _a8c=="undefined"){
_a8c=6;
}
if(typeof end=="undefined"){
end=0;
}
return {start:_a8c,end:end};
};
dojo.date.isWeekend=function(_a8e,_a8f){
var _a90=dojo.date.getWeekend(_a8f);
var day=(_a8e||new Date()).getDay();
if(_a90.end<_a90.start){
_a90.end+=7;
if(day<_a90.start){
day+=7;
}
}
return day>=_a90.start&&day<=_a90.end;
};
dojo.provide("dojo.i18n.common");
dojo.i18n.getLocalization=function(_a92,_a93,_a94){
dojo.hostenv.preloadLocalizations();
_a94=dojo.hostenv.normalizeLocale(_a94);
var _a95=_a94.split("-");
var _a96=[_a92,"nls",_a93].join(".");
var _a97=dojo.hostenv.findModule(_a96,true);
var _a98;
for(var i=_a95.length;i>0;i--){
var loc=_a95.slice(0,i).join("_");
if(_a97[loc]){
_a98=_a97[loc];
break;
}
}
if(!_a98){
_a98=_a97.ROOT;
}
if(_a98){
var _a9b=function(){
};
_a9b.prototype=_a98;
return new _a9b();
}
dojo.raise("Bundle not found: "+_a93+" in "+_a92+" , locale="+_a94);
};
dojo.i18n.isLTR=function(_a9c){
var lang=dojo.hostenv.normalizeLocale(_a9c).split("-")[0];
var RTL={ar:true,fa:true,he:true,ur:true,yi:true};
return !RTL[lang];
};
dojo.provide("dojo.date.format");
(function(){
dojo.date.format=function(_a9f,_aa0){
if(typeof _aa0=="string"){
dojo.deprecated("dojo.date.format","To format dates with POSIX-style strings, please use dojo.date.strftime instead","0.5");
return dojo.date.strftime(_a9f,_aa0);
}
function formatPattern(_aa1,_aa2){
return _aa2.replace(/[a-zA-Z]+/g,function(_aa3){
var s;
var c=_aa3.charAt(0);
var l=_aa3.length;
var pad;
var _aa8=["abbr","wide","narrow"];
switch(c){
case "G":
if(l>3){
dojo.unimplemented("Era format not implemented");
}
s=info.eras[_aa1.getFullYear()<0?1:0];
break;
case "y":
s=_aa1.getFullYear();
switch(l){
case 1:
break;
case 2:
s=String(s).substr(-2);
break;
default:
pad=true;
}
break;
case "Q":
case "q":
s=Math.ceil((_aa1.getMonth()+1)/3);
switch(l){
case 1:
case 2:
pad=true;
break;
case 3:
case 4:
dojo.unimplemented("Quarter format not implemented");
}
break;
case "M":
case "L":
var m=_aa1.getMonth();
var _aab;
switch(l){
case 1:
case 2:
s=m+1;
pad=true;
break;
case 3:
case 4:
case 5:
_aab=_aa8[l-3];
break;
}
if(_aab){
var type=(c=="L")?"standalone":"format";
var prop=["months",type,_aab].join("-");
s=info[prop][m];
}
break;
case "w":
var _aae=0;
s=dojo.date.getWeekOfYear(_aa1,_aae);
pad=true;
break;
case "d":
s=_aa1.getDate();
pad=true;
break;
case "D":
s=dojo.date.getDayOfYear(_aa1);
pad=true;
break;
case "E":
case "e":
case "c":
var d=_aa1.getDay();
var _aab;
switch(l){
case 1:
case 2:
if(c=="e"){
var _ab0=dojo.date.getFirstDayOfWeek(_aa0.locale);
d=(d-_ab0+7)%7;
}
if(c!="c"){
s=d+1;
pad=true;
break;
}
case 3:
case 4:
case 5:
_aab=_aa8[l-3];
break;
}
if(_aab){
var type=(c=="c")?"standalone":"format";
var prop=["days",type,_aab].join("-");
s=info[prop][d];
}
break;
case "a":
var _ab1=(_aa1.getHours()<12)?"am":"pm";
s=info[_ab1];
break;
case "h":
case "H":
case "K":
case "k":
var h=_aa1.getHours();
switch(c){
case "h":
s=(h%12)||12;
break;
case "H":
s=h;
break;
case "K":
s=(h%12);
break;
case "k":
s=h||24;
break;
}
pad=true;
break;
case "m":
s=_aa1.getMinutes();
pad=true;
break;
case "s":
s=_aa1.getSeconds();
pad=true;
break;
case "S":
s=Math.round(_aa1.getMilliseconds()*Math.pow(10,l-3));
break;
case "v":
case "z":
s=dojo.date.getTimezoneName(_aa1);
if(s){
break;
}
l=4;
case "Z":
var _ab3=_aa1.getTimezoneOffset();
var tz=[(_ab3<=0?"+":"-"),dojo.string.pad(Math.floor(Math.abs(_ab3)/60),2),dojo.string.pad(Math.abs(_ab3)%60,2)];
if(l==4){
tz.splice(0,0,"GMT");
tz.splice(3,0,":");
}
s=tz.join("");
break;
case "Y":
case "u":
case "W":
case "F":
case "g":
case "A":
dojo.debug(_aa3+" modifier not yet implemented");
s="?";
break;
default:
dojo.raise("dojo.date.format: invalid pattern char: "+_aa2);
}
if(pad){
s=dojo.string.pad(s,l);
}
return s;
});
}
_aa0=_aa0||{};
var _ab5=dojo.hostenv.normalizeLocale(_aa0.locale);
var _ab6=_aa0.formatLength||"full";
var info=dojo.date._getGregorianBundle(_ab5);
var str=[];
var _ab8=dojo.lang.curry(this,formatPattern,_a9f);
if(_aa0.selector!="timeOnly"){
var _ab9=_aa0.datePattern||info["dateFormat-"+_ab6];
if(_ab9){
str.push(_processPattern(_ab9,_ab8));
}
}
if(_aa0.selector!="dateOnly"){
var _aba=_aa0.timePattern||info["timeFormat-"+_ab6];
if(_aba){
str.push(_processPattern(_aba,_ab8));
}
}
var _abb=str.join(" ");
return _abb;
};
dojo.date.parse=function(_abc,_abd){
_abd=_abd||{};
var _abe=dojo.hostenv.normalizeLocale(_abd.locale);
var info=dojo.date._getGregorianBundle(_abe);
var _ac0=_abd.formatLength||"full";
if(!_abd.selector){
_abd.selector="dateOnly";
}
var _ac1=_abd.datePattern||info["dateFormat-"+_ac0];
var _ac2=_abd.timePattern||info["timeFormat-"+_ac0];
var _ac3;
if(_abd.selector=="dateOnly"){
_ac3=_ac1;
}else{
if(_abd.selector=="timeOnly"){
_ac3=_ac2;
}else{
if(_abd.selector=="dateTime"){
_ac3=_ac1+" "+_ac2;
}else{
var msg="dojo.date.parse: Unknown selector param passed: '"+_abd.selector+"'.";
msg+=" Defaulting to date pattern.";
dojo.debug(msg);
_ac3=_ac1;
}
}
}
var _ac5=[];
var _ac6=_processPattern(_ac3,dojo.lang.curry(this,_buildDateTimeRE,_ac5,info,_abd));
var _ac7=new RegExp("^"+_ac6+"$");
var _ac8=_ac7.exec(_abc);
if(!_ac8){
return null;
}
var _ac9=["abbr","wide","narrow"];
var _aca=new Date(1972,0);
var _acb={};
for(var i=1;i<_ac8.length;i++){
var grp=_ac5[i-1];
var l=grp.length;
var v=_ac8[i];
switch(grp.charAt(0)){
case "y":
if(l!=2){
_aca.setFullYear(v);
_acb.year=v;
}else{
if(v<100){
v=Number(v);
var year=""+new Date().getFullYear();
var _ad1=year.substring(0,2)*100;
var _ad2=Number(year.substring(2,4));
var _ad3=Math.min(_ad2+20,99);
var num=(v<_ad3)?_ad1+v:_ad1-100+v;
_aca.setFullYear(num);
_acb.year=num;
}else{
if(_abd.strict){
return null;
}
_aca.setFullYear(v);
_acb.year=v;
}
}
break;
case "M":
if(l>2){
if(!_abd.strict){
v=v.replace(/\./g,"");
v=v.toLowerCase();
}
var _ad5=info["months-format-"+_ac9[l-3]].concat();
for(var j=0;j<_ad5.length;j++){
if(!_abd.strict){
_ad5[j]=_ad5[j].toLowerCase();
}
if(v==_ad5[j]){
_aca.setMonth(j);
_acb.month=j;
break;
}
}
if(j==_ad5.length){
dojo.debug("dojo.date.parse: Could not parse month name: '"+v+"'.");
return null;
}
}else{
_aca.setMonth(v-1);
_acb.month=v-1;
}
break;
case "E":
case "e":
if(!_abd.strict){
v=v.toLowerCase();
}
var days=info["days-format-"+_ac9[l-3]].concat();
for(var j=0;j<days.length;j++){
if(!_abd.strict){
days[j]=days[j].toLowerCase();
}
if(v==days[j]){
break;
}
}
if(j==days.length){
dojo.debug("dojo.date.parse: Could not parse weekday name: '"+v+"'.");
return null;
}
break;
case "d":
_aca.setDate(v);
_acb.date=v;
break;
case "a":
var am=_abd.am||info.am;
var pm=_abd.pm||info.pm;
if(!_abd.strict){
v=v.replace(/\./g,"").toLowerCase();
am=am.replace(/\./g,"").toLowerCase();
pm=pm.replace(/\./g,"").toLowerCase();
}
if(_abd.strict&&v!=am&&v!=pm){
dojo.debug("dojo.date.parse: Could not parse am/pm part.");
return null;
}
var _ada=_aca.getHours();
if(v==pm&&_ada<12){
_aca.setHours(_ada+12);
}else{
if(v==am&&_ada==12){
_aca.setHours(0);
}
}
break;
case "K":
if(v==24){
v=0;
}
case "h":
case "H":
case "k":
if(v>23){
dojo.debug("dojo.date.parse: Illegal hours value");
return null;
}
_aca.setHours(v);
break;
case "m":
_aca.setMinutes(v);
break;
case "s":
_aca.setSeconds(v);
break;
case "S":
_aca.setMilliseconds(v);
break;
default:
dojo.unimplemented("dojo.date.parse: unsupported pattern char="+grp.charAt(0));
}
}
if(_acb.year&&_aca.getFullYear()!=_acb.year){
dojo.debug("Parsed year: '"+_aca.getFullYear()+"' did not match input year: '"+_acb.year+"'.");
return null;
}
if(_acb.month&&_aca.getMonth()!=_acb.month){
dojo.debug("Parsed month: '"+_aca.getMonth()+"' did not match input month: '"+_acb.month+"'.");
return null;
}
if(_acb.date&&_aca.getDate()!=_acb.date){
dojo.debug("Parsed day of month: '"+_aca.getDate()+"' did not match input day of month: '"+_acb.date+"'.");
return null;
}
return _aca;
};
function _processPattern(_adb,_adc,_add,_ade){
var _adf=function(x){
return x;
};
_adc=_adc||_adf;
_add=_add||_adf;
_ade=_ade||_adf;
var _ae1=_adb.match(/(''|[^'])+/g);
var _ae2=false;
for(var i=0;i<_ae1.length;i++){
if(!_ae1[i]){
_ae1[i]="";
}else{
_ae1[i]=(_ae2?_add:_adc)(_ae1[i]);
_ae2=!_ae2;
}
}
return _ade(_ae1.join(""));
}
function _buildDateTimeRE(_ae4,info,_ae6,_ae7){
return _ae7.replace(/[a-zA-Z]+/g,function(_ae8){
var s;
var c=_ae8.charAt(0);
var l=_ae8.length;
switch(c){
case "y":
s="\\d"+((l==2)?"{2,4}":"+");
break;
case "M":
s=(l>2)?"\\S+":"\\d{1,2}";
break;
case "d":
s="\\d{1,2}";
break;
case "E":
s="\\S+";
break;
case "h":
case "H":
case "K":
case "k":
s="\\d{1,2}";
break;
case "m":
case "s":
s="[0-5]\\d";
break;
case "S":
s="\\d{1,3}";
break;
case "a":
var am=_ae6.am||info.am||"AM";
var pm=_ae6.pm||info.pm||"PM";
if(_ae6.strict){
s=am+"|"+pm;
}else{
s=am;
s+=(am!=am.toLowerCase())?"|"+am.toLowerCase():"";
s+="|";
s+=(pm!=pm.toLowerCase())?pm+"|"+pm.toLowerCase():pm;
}
break;
default:
dojo.unimplemented("parse of date format, pattern="+_ae7);
}
if(_ae4){
_ae4.push(_ae8);
}
return "\\s*("+s+")\\s*";
});
}
})();
dojo.date.strftime=function(_aee,_aef,_af0){
var _af1=null;
function _(s,n){
return dojo.string.pad(s,n||2,_af1||"0");
}
var info=dojo.date._getGregorianBundle(_af0);
function $(_af5){
switch(_af5){
case "a":
return dojo.date.getDayShortName(_aee,_af0);
case "A":
return dojo.date.getDayName(_aee,_af0);
case "b":
case "h":
return dojo.date.getMonthShortName(_aee,_af0);
case "B":
return dojo.date.getMonthName(_aee,_af0);
case "c":
return dojo.date.format(_aee,{locale:_af0});
case "C":
return _(Math.floor(_aee.getFullYear()/100));
case "d":
return _(_aee.getDate());
case "D":
return $("m")+"/"+$("d")+"/"+$("y");
case "e":
if(_af1==null){
_af1=" ";
}
return _(_aee.getDate());
case "f":
if(_af1==null){
_af1=" ";
}
return _(_aee.getMonth()+1);
case "g":
break;
case "G":
dojo.unimplemented("unimplemented modifier 'G'");
break;
case "F":
return $("Y")+"-"+$("m")+"-"+$("d");
case "H":
return _(_aee.getHours());
case "I":
return _(_aee.getHours()%12||12);
case "j":
return _(dojo.date.getDayOfYear(_aee),3);
case "k":
if(_af1==null){
_af1=" ";
}
return _(_aee.getHours());
case "l":
if(_af1==null){
_af1=" ";
}
return _(_aee.getHours()%12||12);
case "m":
return _(_aee.getMonth()+1);
case "M":
return _(_aee.getMinutes());
case "n":
return "\n";
case "p":
return info[_aee.getHours()<12?"am":"pm"];
case "r":
return $("I")+":"+$("M")+":"+$("S")+" "+$("p");
case "R":
return $("H")+":"+$("M");
case "S":
return _(_aee.getSeconds());
case "t":
return "\t";
case "T":
return $("H")+":"+$("M")+":"+$("S");
case "u":
return String(_aee.getDay()||7);
case "U":
return _(dojo.date.getWeekOfYear(_aee));
case "V":
return _(dojo.date.getIsoWeekOfYear(_aee));
case "W":
return _(dojo.date.getWeekOfYear(_aee,1));
case "w":
return String(_aee.getDay());
case "x":
return dojo.date.format(_aee,{selector:"dateOnly",locale:_af0});
case "X":
return dojo.date.format(_aee,{selector:"timeOnly",locale:_af0});
case "y":
return _(_aee.getFullYear()%100);
case "Y":
return String(_aee.getFullYear());
case "z":
var _af6=_aee.getTimezoneOffset();
return (_af6>0?"-":"+")+_(Math.floor(Math.abs(_af6)/60))+":"+_(Math.abs(_af6)%60);
case "Z":
return dojo.date.getTimezoneName(_aee);
case "%":
return "%";
}
}
var _af7="";
var i=0;
var _af9=0;
var _afa=null;
while((_af9=_aef.indexOf("%",i))!=-1){
_af7+=_aef.substring(i,_af9++);
switch(_aef.charAt(_af9++)){
case "_":
_af1=" ";
break;
case "-":
_af1="";
break;
case "0":
_af1="0";
break;
case "^":
_afa="upper";
break;
case "*":
_afa="lower";
break;
case "#":
_afa="swap";
break;
default:
_af1=null;
_af9--;
break;
}
var _afb=$(_aef.charAt(_af9++));
switch(_afa){
case "upper":
_afb=_afb.toUpperCase();
break;
case "lower":
_afb=_afb.toLowerCase();
break;
case "swap":
var _afc=_afb.toLowerCase();
var _afd="";
var j=0;
var ch="";
while(j<_afb.length){
ch=_afb.charAt(j);
_afd+=(ch==_afc.charAt(j))?ch.toUpperCase():ch.toLowerCase();
j++;
}
_afb=_afd;
break;
default:
break;
}
_afa=null;
_af7+=_afb;
i=_af9;
}
_af7+=_aef.substring(i);
return _af7;
};
(function(){
var _b00=[];
dojo.date.addCustomFormats=function(_b01,_b02){
_b00.push({pkg:_b01,name:_b02});
};
dojo.date._getGregorianBundle=function(_b03){
var _b04={};
dojo.lang.forEach(_b00,function(desc){
var _b06=dojo.i18n.getLocalization(desc.pkg,desc.name,_b03);
_b04=dojo.lang.mixin(_b04,_b06);
},this);
return _b04;
};
})();
dojo.date.addCustomFormats("dojo.i18n.calendar","gregorian");
dojo.date.addCustomFormats("dojo.i18n.calendar","gregorianExtras");
dojo.date.getNames=function(item,type,use,_b0a){
var _b0b;
var _b0c=dojo.date._getGregorianBundle(_b0a);
var _b0d=[item,use,type];
if(use=="standAlone"){
_b0b=_b0c[_b0d.join("-")];
}
_b0d[1]="format";
return (_b0b||_b0c[_b0d.join("-")]).concat();
};
dojo.date.getDayName=function(_b0e,_b0f){
return dojo.date.getNames("days","wide","format",_b0f)[_b0e.getDay()];
};
dojo.date.getDayShortName=function(_b10,_b11){
return dojo.date.getNames("days","abbr","format",_b11)[_b10.getDay()];
};
dojo.date.getMonthName=function(_b12,_b13){
return dojo.date.getNames("months","wide","format",_b13)[_b12.getMonth()];
};
dojo.date.getMonthShortName=function(_b14,_b15){
return dojo.date.getNames("months","abbr","format",_b15)[_b14.getMonth()];
};
dojo.date.toRelativeString=function(_b16){
var now=new Date();
var diff=(now-_b16)/1000;
var end=" ago";
var _b1a=false;
if(diff<0){
_b1a=true;
end=" from now";
diff=-diff;
}
if(diff<60){
diff=Math.round(diff);
return diff+" second"+(diff==1?"":"s")+end;
}
if(diff<60*60){
diff=Math.round(diff/60);
return diff+" minute"+(diff==1?"":"s")+end;
}
if(diff<60*60*24){
diff=Math.round(diff/3600);
return diff+" hour"+(diff==1?"":"s")+end;
}
if(diff<60*60*24*7){
diff=Math.round(diff/(3600*24));
if(diff==1){
return _b1a?"Tomorrow":"Yesterday";
}else{
return diff+" days"+end;
}
}
return dojo.date.format(_b16);
};
dojo.date.toSql=function(_b1b,_b1c){
return dojo.date.strftime(_b1b,"%F"+!_b1c?" %T":"");
};
dojo.date.fromSql=function(_b1d){
var _b1e=_b1d.split(/[\- :]/g);
while(_b1e.length<6){
_b1e.push(0);
}
return new Date(_b1e[0],(parseInt(_b1e[1],10)-1),_b1e[2],_b1e[3],_b1e[4],_b1e[5]);
};
dojo.provide("dojo.collections.Store");
dojo.collections.Store=function(_b1f){
var data=[];
this.keyField="Id";
this.get=function(){
return data;
};
this.getByKey=function(key){
for(var i=0;i<data.length;i++){
if(data[i].key==key){
return data[i];
}
}
return null;
};
this.getByIndex=function(idx){
return data[idx];
};
this.getData=function(){
var arr=[];
for(var i=0;i<data.length;i++){
arr.push(data[i].src);
}
return arr;
};
this.getDataByKey=function(key){
for(var i=0;i<data.length;i++){
if(data[i].key==key){
return data[i].src;
}
}
return null;
};
this.getDataByIndex=function(idx){
return data[idx].src;
};
this.update=function(obj,_b2a,val){
var _b2c=_b2a.split("."),i=0,o=obj,_b2f;
if(_b2c.length>1){
_b2f=_b2c.pop();
do{
if(_b2c[i].indexOf("()")>-1){
var temp=_b2c[i++].split("()")[0];
if(!o[temp]){
dojo.raise("dojo.collections.Store.getField(obj, '"+_b2f+"'): '"+temp+"' is not a property of the passed object.");
}else{
o=o[temp]();
}
}else{
o=o[_b2c[i++]];
}
}while(i<_b2c.length&&o!=null);
}else{
_b2f=_b2c[0];
}
obj[_b2f]=val;
this.onUpdateField(obj,_b2a,val);
};
this.forEach=function(fn){
if(Array.forEach){
Array.forEach(data,fn,this);
}else{
for(var i=0;i<data.length;i++){
fn.call(this,data[i]);
}
}
};
this.forEachData=function(fn){
if(Array.forEach){
Array.forEach(this.getData(),fn,this);
}else{
var a=this.getData();
for(var i=0;i<a.length;i++){
fn.call(this,a[i]);
}
}
};
this.setData=function(arr){
data=[];
for(var i=0;i<arr.length;i++){
data.push({key:arr[i][this.keyField],src:arr[i]});
}
this.onSetData();
};
this.clearData=function(){
data=[];
this.onClearData();
};
this.addData=function(obj,key){
var k=key||obj[this.keyField];
if(this.getByKey(k)){
var o=this.getByKey(k);
o.src=obj;
}else{
var o={key:k,src:obj};
data.push(o);
}
this.onAddData(o);
};
this.addDataRange=function(arr){
var _b3d=[];
for(var i=0;i<arr.length;i++){
var k=arr[i][this.keyField];
if(this.getByKey(k)){
var o=this.getByKey(k);
o.src=obj;
}else{
var o={key:k,src:arr[i]};
data.push(o);
}
_b3d.push(o);
}
this.onAddDataRange(_b3d);
};
this.removeData=function(obj){
var idx=-1;
var o=null;
for(var i=0;i<data.length;i++){
if(data[i].src==obj){
idx=i;
o=data[i];
break;
}
}
this.onRemoveData(o);
if(idx>-1){
data.splice(idx,1);
}
};
this.removeDataByKey=function(key){
this.removeData(this.getDataByKey(key));
};
this.removeDataByIndex=function(idx){
this.removeData(this.getDataByIndex(idx));
};
if(_b1f&&_b1f.length&&_b1f[0]){
this.setData(_b1f);
}
};
dojo.extend(dojo.collections.Store,{getField:function(obj,_b48){
var _b49=_b48.split("."),i=0,o=obj;
do{
if(_b49[i].indexOf("()")>-1){
var temp=_b49[i++].split("()")[0];
if(!o[temp]){
dojo.raise("dojo.collections.Store.getField(obj, '"+_b48+"'): '"+temp+"' is not a property of the passed object.");
}else{
o=o[temp]();
}
}else{
o=o[_b49[i++]];
}
}while(i<_b49.length&&o!=null);
if(i<_b49.length){
dojo.raise("dojo.collections.Store.getField(obj, '"+_b48+"'): '"+_b48+"' is not a property of the passed object.");
}
return o;
},getFromHtml:function(meta,body,_b4f){
var rows=body.rows;
var ctor=function(row){
var obj={};
for(var i=0;i<meta.length;i++){
var o=obj;
var data=row.cells[i].innerHTML;
var p=meta[i].getField();
if(p.indexOf(".")>-1){
p=p.split(".");
while(p.length>1){
var pr=p.shift();
o[pr]={};
o=o[pr];
}
p=p[0];
}
var type=meta[i].getType();
if(type==String){
o[p]=data;
}else{
if(data){
o[p]=new type(data);
}else{
o[p]=new type();
}
}
}
return obj;
};
var arr=[];
for(var i=0;i<rows.length;i++){
var o=ctor(rows[i]);
if(_b4f){
_b4f(o,rows[i]);
}
arr.push(o);
}
return arr;
},onSetData:function(){
},onClearData:function(){
},onAddData:function(obj){
},onAddDataRange:function(arr){
},onRemoveData:function(obj){
},onUpdateField:function(obj,_b61,val){
}});
dojo.provide("dojo.widget.FilteringTable");
dojo.widget.defineWidget("dojo.widget.FilteringTable",dojo.widget.HtmlWidget,function(){
this.store=new dojo.collections.Store();
this.valueField="Id";
this.multiple=false;
this.maxSelect=0;
this.maxSortable=1;
this.minRows=0;
this.defaultDateFormat="%D";
this.isInitialized=false;
this.alternateRows=false;
this.columns=[];
this.sortInformation=[{index:0,direction:0}];
this.headClass="";
this.tbodyClass="";
this.headerClass="";
this.headerUpClass="selectedUp";
this.headerDownClass="selectedDown";
this.rowClass="";
this.rowAlternateClass="alt";
this.rowSelectedClass="selected";
this.columnSelected="sorted-column";
},{isContainer:false,templatePath:null,templateCssPath:null,getTypeFromString:function(s){
var _b64=s.split("."),i=0,obj=dj_global;
do{
obj=obj[_b64[i++]];
}while(i<_b64.length&&obj);
return (obj!=dj_global)?obj:null;
},getByRow:function(row){
return this.store.getByKey(dojo.html.getAttribute(row,"value"));
},getDataByRow:function(row){
return this.store.getDataByKey(dojo.html.getAttribute(row,"value"));
},getRow:function(obj){
var rows=this.domNode.tBodies[0].rows;
for(var i=0;i<rows.length;i++){
if(this.store.getDataByKey(dojo.html.getAttribute(rows[i],"value"))==obj){
return rows[i];
}
}
return null;
},getColumnIndex:function(_b6c){
for(var i=0;i<this.columns.length;i++){
if(this.columns[i].getField()==_b6c){
return i;
}
}
return -1;
},getSelectedData:function(){
var data=this.store.get();
var a=[];
for(var i=0;i<data.length;i++){
if(data[i].isSelected){
a.push(data[i].src);
}
}
if(this.multiple){
return a;
}else{
return a[0];
}
},isSelected:function(obj){
var data=this.store.get();
for(var i=0;i<data.length;i++){
if(data[i].src==obj){
return true;
}
}
return false;
},isValueSelected:function(val){
var v=this.store.getByKey(val);
if(v){
return v.isSelected;
}
return false;
},isIndexSelected:function(idx){
var v=this.store.getByIndex(idx);
if(v){
return v.isSelected;
}
return false;
},isRowSelected:function(row){
var v=this.getByRow(row);
if(v){
return v.isSelected;
}
return false;
},reset:function(){
this.store.clearData();
this.columns=[];
this.sortInformation=[{index:0,direction:0}];
this.resetSelections();
this.isInitialized=false;
this.onReset();
},resetSelections:function(){
this.store.forEach(function(_b7a){
_b7a.isSelected=false;
});
},onReset:function(){
},select:function(obj){
var data=this.store.get();
for(var i=0;i<data.length;i++){
if(data[i].src==obj){
data[i].isSelected=true;
break;
}
}
this.onDataSelect(obj);
},selectByValue:function(val){
this.select(this.store.getDataByKey(val));
},selectByIndex:function(idx){
this.select(this.store.getDataByIndex(idx));
},selectByRow:function(row){
this.select(this.getDataByRow(row));
},selectAll:function(){
this.store.forEach(function(_b81){
_b81.isSelected=true;
});
},onDataSelect:function(obj){
},toggleSelection:function(obj){
var data=this.store.get();
for(var i=0;i<data.length;i++){
if(data[i].src==obj){
data[i].isSelected=!data[i].isSelected;
break;
}
}
this.onDataToggle(obj);
},toggleSelectionByValue:function(val){
this.toggleSelection(this.store.getDataByKey(val));
},toggleSelectionByIndex:function(idx){
this.toggleSelection(this.store.getDataByIndex(idx));
},toggleSelectionByRow:function(row){
this.toggleSelection(this.getDataByRow(row));
},toggleAll:function(){
this.store.forEach(function(_b89){
_b89.isSelected=!_b89.isSelected;
});
},onDataToggle:function(obj){
},_meta:{field:null,format:null,filterer:null,noSort:false,sortType:"String",dataType:String,sortFunction:null,filterFunction:null,label:null,align:"left",valign:"middle",getField:function(){
return this.field||this.label;
},getType:function(){
return this.dataType;
}},createMetaData:function(obj){
for(var p in this._meta){
if(!obj[p]){
obj[p]=this._meta[p];
}
}
if(!obj.label){
obj.label=obj.field;
}
if(!obj.filterFunction){
obj.filterFunction=this._defaultFilter;
}
return obj;
},parseMetadata:function(head){
this.columns=[];
this.sortInformation=[];
var row=head.getElementsByTagName("tr")[0];
var _b8f=row.getElementsByTagName("td");
if(_b8f.length==0){
_b8f=row.getElementsByTagName("th");
}
for(var i=0;i<_b8f.length;i++){
var o=this.createMetaData({});
if(dojo.html.hasAttribute(_b8f[i],"align")){
o.align=dojo.html.getAttribute(_b8f[i],"align");
}
if(dojo.html.hasAttribute(_b8f[i],"valign")){
o.valign=dojo.html.getAttribute(_b8f[i],"valign");
}
if(dojo.html.hasAttribute(_b8f[i],"nosort")){
o.noSort=(dojo.html.getAttribute(_b8f[i],"nosort")=="true");
}
if(dojo.html.hasAttribute(_b8f[i],"sortusing")){
var _b92=dojo.html.getAttribute(_b8f[i],"sortusing");
var f=this.getTypeFromString(_b92);
if(f!=null&&f!=window&&typeof (f)=="function"){
o.sortFunction=f;
}
}
o.label=dojo.html.renderedTextContent(_b8f[i]);
if(dojo.html.hasAttribute(_b8f[i],"field")){
o.field=dojo.html.getAttribute(_b8f[i],"field");
}else{
if(o.label.length>0){
o.field=o.label;
}else{
o.field="field"+i;
}
}
if(dojo.html.hasAttribute(_b8f[i],"format")){
o.format=dojo.html.getAttribute(_b8f[i],"format");
}
if(dojo.html.hasAttribute(_b8f[i],"dataType")){
var _b94=dojo.html.getAttribute(_b8f[i],"dataType");
if(_b94.toLowerCase()=="html"||_b94.toLowerCase()=="markup"){
o.sortType="__markup__";
}else{
var type=this.getTypeFromString(_b94);
if(type){
o.sortType=_b94;
o.dataType=type;
}
}
}
if(dojo.html.hasAttribute(_b8f[i],"filterusing")){
var _b92=dojo.html.getAttribute(_b8f[i],"filterusing");
var f=this.getTypeFromString(_b92);
if(f!=null&&f!=window&&typeof (f)=="function"){
o.filterFunction=f;
}
}
this.columns.push(o);
if(dojo.html.hasAttribute(_b8f[i],"sort")){
var info={index:i,direction:0};
var dir=dojo.html.getAttribute(_b8f[i],"sort");
if(!isNaN(parseInt(dir))){
dir=parseInt(dir);
info.direction=(dir!=0)?1:0;
}else{
info.direction=(dir.toLowerCase()=="desc")?1:0;
}
this.sortInformation.push(info);
}
}
if(this.sortInformation.length==0){
this.sortInformation.push({index:0,direction:0});
}else{
if(this.sortInformation.length>this.maxSortable){
this.sortInformation.length=this.maxSortable;
}
}
},parseData:function(body){
if(body.rows.length==0&&this.columns.length==0){
return;
}
var self=this;
this["__selected__"]=[];
var arr=this.store.getFromHtml(this.columns,body,function(obj,row){
obj[self.valueField]=dojo.html.getAttribute(row,"value");
if(dojo.html.getAttribute(row,"selected")=="true"){
self["__selected__"].push(obj);
}
});
this.store.setData(arr);
for(var i=0;i<this["__selected__"].length;i++){
this.select(this["__selected__"][i]);
}
this.renderSelections();
delete this["__selected__"];
this.isInitialized=true;
},onSelect:function(e){
var row=dojo.html.getParentByType(e.target,"tr");
if(dojo.html.hasAttribute(row,"emptyRow")){
return;
}
var body=dojo.html.getParentByType(row,"tbody");
if(this.multiple){
if(e.shiftKey){
var _ba1;
var rows=body.rows;
for(var i=0;i<rows.length;i++){
if(rows[i]==row){
break;
}
if(this.isRowSelected(rows[i])){
_ba1=rows[i];
}
}
if(!_ba1){
_ba1=row;
for(;i<rows.length;i++){
if(this.isRowSelected(rows[i])){
row=rows[i];
break;
}
}
}
this.resetSelections();
if(_ba1==row){
this.toggleSelectionByRow(row);
}else{
var _ba4=false;
for(var i=0;i<rows.length;i++){
if(rows[i]==_ba1){
_ba4=true;
}
if(_ba4){
this.selectByRow(rows[i]);
}
if(rows[i]==row){
_ba4=false;
}
}
}
}else{
this.toggleSelectionByRow(row);
}
}else{
this.resetSelections();
this.toggleSelectionByRow(row);
}
this.renderSelections();
},onSort:function(e){
var _ba6=this.sortIndex;
var _ba7=this.sortDirection;
var _ba8=e.target;
var row=dojo.html.getParentByType(_ba8,"tr");
var _baa="td";
if(row.getElementsByTagName(_baa).length==0){
_baa="th";
}
var _bab=row.getElementsByTagName(_baa);
var _bac=dojo.html.getParentByType(_ba8,_baa);
for(var i=0;i<_bab.length;i++){
dojo.html.setClass(_bab[i],this.headerClass);
if(_bab[i]==_bac){
if(this.sortInformation[0].index!=i){
this.sortInformation.unshift({index:i,direction:0});
}else{
this.sortInformation[0]={index:i,direction:(~this.sortInformation[0].direction)&1};
}
}
}
this.sortInformation.length=Math.min(this.sortInformation.length,this.maxSortable);
for(var i=0;i<this.sortInformation.length;i++){
var idx=this.sortInformation[i].index;
var dir=(~this.sortInformation[i].direction)&1;
dojo.html.setClass(_bab[idx],dir==0?this.headerDownClass:this.headerUpClass);
}
this.render();
},onFilter:function(){
},_defaultFilter:function(obj){
return true;
},setFilter:function(_bb1,fn){
for(var i=0;i<this.columns.length;i++){
if(this.columns[i].getField()==_bb1){
this.columns[i].filterFunction=fn;
break;
}
}
this.applyFilters();
},setFilterByIndex:function(idx,fn){
this.columns[idx].filterFunction=fn;
this.applyFilters();
},clearFilter:function(_bb6){
for(var i=0;i<this.columns.length;i++){
if(this.columns[i].getField()==_bb6){
this.columns[i].filterFunction=this._defaultFilter;
break;
}
}
this.applyFilters();
},clearFilterByIndex:function(idx){
this.columns[idx].filterFunction=this._defaultFilter;
this.applyFilters();
},clearFilters:function(){
for(var i=0;i<this.columns.length;i++){
this.columns[i].filterFunction=this._defaultFilter;
}
var rows=this.domNode.tBodies[0].rows;
for(var i=0;i<rows.length;i++){
rows[i].style.display="";
if(this.alternateRows){
dojo.html[((i%2==1)?"addClass":"removeClass")](rows[i],this.rowAlternateClass);
}
}
this.onFilter();
},applyFilters:function(){
var alt=0;
var rows=this.domNode.tBodies[0].rows;
for(var i=0;i<rows.length;i++){
var b=true;
var row=rows[i];
for(var j=0;j<this.columns.length;j++){
var _bc1=this.store.getField(this.getDataByRow(row),this.columns[j].getField());
if(this.columns[j].getType()==Date&&_bc1!=null&&!_bc1.getYear){
_bc1=new Date(_bc1);
}
if(!this.columns[j].filterFunction(_bc1)){
b=false;
break;
}
}
row.style.display=(b?"":"none");
if(b&&this.alternateRows){
dojo.html[((alt++%2==1)?"addClass":"removeClass")](row,this.rowAlternateClass);
}
}
this.onFilter();
},createSorter:function(info){
var self=this;
var _bc4=[];
function createSortFunction(_bc5,dir){
var meta=self.columns[_bc5];
var _bc8=meta.getField();
return function(rowA,rowB){
if(dojo.html.hasAttribute(rowA,"emptyRow")||dojo.html.hasAttribute(rowB,"emptyRow")){
return -1;
}
var a=self.store.getField(self.getDataByRow(rowA),_bc8);
var b=self.store.getField(self.getDataByRow(rowB),_bc8);
var ret=0;
if(a>b){
ret=1;
}
if(a<b){
ret=-1;
}
return dir*ret;
};
}
var _bce=0;
var max=Math.min(info.length,this.maxSortable,this.columns.length);
while(_bce<max){
var _bd0=(info[_bce].direction==0)?1:-1;
_bc4.push(createSortFunction(info[_bce].index,_bd0));
_bce++;
}
return function(rowA,rowB){
var idx=0;
while(idx<_bc4.length){
var ret=_bc4[idx++](rowA,rowB);
if(ret!=0){
return ret;
}
}
return 0;
};
},createRow:function(obj){
var row=document.createElement("tr");
dojo.html.disableSelection(row);
if(obj.key!=null){
row.setAttribute("value",obj.key);
}
for(var j=0;j<this.columns.length;j++){
var cell=document.createElement("td");
cell.setAttribute("align",this.columns[j].align);
cell.setAttribute("valign",this.columns[j].valign);
dojo.html.disableSelection(cell);
var val=this.store.getField(obj.src,this.columns[j].getField());
if(typeof (val)=="undefined"){
val="";
}
this.fillCell(cell,this.columns[j],val);
row.appendChild(cell);
}
return row;
},fillCell:function(cell,meta,val){
if(meta.sortType=="__markup__"){
cell.innerHTML=val;
}else{
if(meta.getType()==Date){
val=new Date(val);
if(!isNaN(val)){
var _bdd=this.defaultDateFormat;
if(meta.format){
_bdd=meta.format;
}
cell.innerHTML=dojo.date.strftime(val,_bdd);
}else{
cell.innerHTML=val;
}
}else{
if("Number number int Integer float Float".indexOf(meta.getType())>-1){
if(val.length==0){
val="0";
}
var n=parseFloat(val,10)+"";
if(n.indexOf(".")>-1){
n=dojo.math.round(parseFloat(val,10),2);
}
cell.innerHTML=n;
}else{
cell.innerHTML=val;
}
}
}
},prefill:function(){
this.isInitialized=false;
var body=this.domNode.tBodies[0];
while(body.childNodes.length>0){
body.removeChild(body.childNodes[0]);
}
if(this.minRows>0){
for(var i=0;i<this.minRows;i++){
var row=document.createElement("tr");
if(this.alternateRows){
dojo.html[((i%2==1)?"addClass":"removeClass")](row,this.rowAlternateClass);
}
row.setAttribute("emptyRow","true");
for(var j=0;j<this.columns.length;j++){
var cell=document.createElement("td");
cell.innerHTML="&nbsp;";
row.appendChild(cell);
}
body.appendChild(row);
}
}
},init:function(){
this.isInitialized=false;
var head=this.domNode.getElementsByTagName("thead")[0];
if(head.getElementsByTagName("tr").length==0){
var row=document.createElement("tr");
for(var i=0;i<this.columns.length;i++){
var cell=document.createElement("td");
cell.setAttribute("align",this.columns[i].align);
cell.setAttribute("valign",this.columns[i].valign);
dojo.html.disableSelection(cell);
cell.innerHTML=this.columns[i].label;
row.appendChild(cell);
if(!this.columns[i].noSort){
dojo.event.connect(cell,"onclick",this,"onSort");
}
}
dojo.html.prependChild(row,head);
}
if(this.store.get().length==0){
return false;
}
var idx=this.domNode.tBodies[0].rows.length;
if(!idx||idx==0||this.domNode.tBodies[0].rows[0].getAttribute("emptyRow")=="true"){
idx=0;
var body=this.domNode.tBodies[0];
while(body.childNodes.length>0){
body.removeChild(body.childNodes[0]);
}
var data=this.store.get();
for(var i=0;i<data.length;i++){
var row=this.createRow(data[i]);
dojo.event.connect(row,"onclick",this,"onSelect");
body.appendChild(row);
idx++;
}
}
if(this.minRows>0&&idx<this.minRows){
idx=this.minRows-idx;
for(var i=0;i<idx;i++){
row=document.createElement("tr");
row.setAttribute("emptyRow","true");
for(var j=0;j<this.columns.length;j++){
cell=document.createElement("td");
cell.innerHTML="&nbsp;";
row.appendChild(cell);
}
body.appendChild(row);
}
}
var row=this.domNode.getElementsByTagName("thead")[0].rows[0];
var _bec="td";
if(row.getElementsByTagName(_bec).length==0){
_bec="th";
}
var _bed=row.getElementsByTagName(_bec);
for(var i=0;i<_bed.length;i++){
dojo.html.setClass(_bed[i],this.headerClass);
}
for(var i=0;i<this.sortInformation.length;i++){
var idx=this.sortInformation[i].index;
var dir=(~this.sortInformation[i].direction)&1;
dojo.html.setClass(_bed[idx],dir==0?this.headerDownClass:this.headerUpClass);
}
this.isInitialized=true;
return this.isInitialized;
},render:function(){
if(!this.isInitialized){
var b=this.init();
if(!b){
this.prefill();
return;
}
}
var rows=[];
var body=this.domNode.tBodies[0];
var _bf2=-1;
for(var i=0;i<body.rows.length;i++){
rows.push(body.rows[i]);
}
var _bf4=this.createSorter(this.sortInformation);
if(_bf4){
rows.sort(_bf4);
}
for(var i=0;i<rows.length;i++){
if(this.alternateRows){
dojo.html[((i%2==1)?"addClass":"removeClass")](rows[i],this.rowAlternateClass);
}
dojo.html[(this.isRowSelected(body.rows[i])?"addClass":"removeClass")](body.rows[i],this.rowSelectedClass);
body.appendChild(rows[i]);
}
},renderSelections:function(){
var body=this.domNode.tBodies[0];
for(var i=0;i<body.rows.length;i++){
dojo.html[(this.isRowSelected(body.rows[i])?"addClass":"removeClass")](body.rows[i],this.rowSelectedClass);
}
},initialize:function(){
var self=this;
dojo.event.connect(this.store,"onSetData",function(){
self.store.forEach(function(_bf8){
_bf8.isSelected=false;
});
self.isInitialized=false;
var body=self.domNode.tBodies[0];
if(body){
while(body.childNodes.length>0){
body.removeChild(body.childNodes[0]);
}
}
self.render();
});
dojo.event.connect(this.store,"onClearData",function(){
self.render();
});
dojo.event.connect(this.store,"onAddData",function(_bfa){
var row=self.createRow(_bfa);
dojo.event.connect(row,"onclick",self,"onSelect");
self.domNode.tBodies[0].appendChild(row);
self.render();
});
dojo.event.connect(this.store,"onAddDataRange",function(arr){
for(var i=0;i<arr.length;i++){
arr[i].isSelected=false;
var row=self.createRow(arr[i]);
dojo.event.connect(row,"onclick",self,"onSelect");
self.domNode.tBodies[0].appendChild(row);
}
self.render();
});
dojo.event.connect(this.store,"onRemoveData",function(_bff){
var rows=self.domNode.tBodies[0].rows;
for(var i=0;i<rows.length;i++){
if(self.getDataByRow(rows[i])==_bff.src){
rows[i].parentNode.removeChild(rows[i]);
break;
}
}
self.render();
});
dojo.event.connect(this.store,"onUpdateField",function(obj,_c03,val){
var row=self.getRow(obj);
var idx=self.getColumnIndex(_c03);
if(row&&row.cells[idx]&&self.columns[idx]){
self.fillCell(row.cells[idx],self.columns[idx],val);
}
});
},postCreate:function(){
this.store.keyField=this.valueField;
if(this.domNode){
if(this.domNode.nodeName.toLowerCase()!="table"){
}
if(this.domNode.getElementsByTagName("thead")[0]){
var head=this.domNode.getElementsByTagName("thead")[0];
if(this.headClass.length>0){
head.className=this.headClass;
}
dojo.html.disableSelection(this.domNode);
this.parseMetadata(head);
var _c08="td";
if(head.getElementsByTagName(_c08).length==0){
_c08="th";
}
var _c09=head.getElementsByTagName(_c08);
for(var i=0;i<_c09.length;i++){
if(!this.columns[i].noSort){
dojo.event.connect(_c09[i],"onclick",this,"onSort");
}
}
}else{
this.domNode.appendChild(document.createElement("thead"));
}
if(this.domNode.tBodies.length<1){
var body=document.createElement("tbody");
this.domNode.appendChild(body);
}else{
var body=this.domNode.tBodies[0];
}
if(this.tbodyClass.length>0){
body.className=this.tbodyClass;
}
this.parseData(body);
}
}});
dojo.provide("dojo.widget.ContentPane");
dojo.widget.defineWidget("dojo.widget.ContentPane",dojo.widget.HtmlWidget,function(){
this._styleNodes=[];
this._onLoadStack=[];
this._onUnloadStack=[];
this._callOnUnload=false;
this._ioBindObj;
this.scriptScope;
this.bindArgs={};
},{isContainer:true,adjustPaths:true,href:"",extractContent:true,parseContent:true,cacheContent:true,preload:false,refreshOnShow:false,handler:"",executeScripts:false,scriptSeparation:true,loadingMessage:"Loading...",isLoaded:false,postCreate:function(args,frag,_c0e){
if(this.handler!==""){
this.setHandler(this.handler);
}
if(this.isShowing()||this.preload){
this.loadContents();
}
},show:function(){
if(this.refreshOnShow){
this.refresh();
}else{
this.loadContents();
}
dojo.widget.ContentPane.superclass.show.call(this);
},refresh:function(){
this.isLoaded=false;
this.loadContents();
},loadContents:function(){
if(this.isLoaded){
return;
}
if(dojo.lang.isFunction(this.handler)){
this._runHandler();
}else{
if(this.href!=""){
this._downloadExternalContent(this.href,this.cacheContent&&!this.refreshOnShow);
}
}
},setUrl:function(url){
this.href=url;
this.isLoaded=false;
if(this.preload||this.isShowing()){
this.loadContents();
}
},abort:function(){
var bind=this._ioBindObj;
if(!bind||!bind.abort){
return;
}
bind.abort();
delete this._ioBindObj;
},_downloadExternalContent:function(url,_c12){
this.abort();
this._handleDefaults(this.loadingMessage,"onDownloadStart");
var self=this;
this._ioBindObj=dojo.io.bind(this._cacheSetting({url:url,mimetype:"text/html",handler:function(type,data,xhr){
delete self._ioBindObj;
if(type=="load"){
self.onDownloadEnd.call(self,url,data);
}else{
var e={responseText:xhr.responseText,status:xhr.status,statusText:xhr.statusText,responseHeaders:xhr.getAllResponseHeaders(),text:"Error loading '"+url+"' ("+xhr.status+" "+xhr.statusText+")"};
self._handleDefaults.call(self,e,"onDownloadError");
self.onLoad();
}
}},_c12));
},_cacheSetting:function(_c18,_c19){
for(var x in this.bindArgs){
if(dojo.lang.isUndefined(_c18[x])){
_c18[x]=this.bindArgs[x];
}
}
if(dojo.lang.isUndefined(_c18.useCache)){
_c18.useCache=_c19;
}
if(dojo.lang.isUndefined(_c18.preventCache)){
_c18.preventCache=!_c19;
}
if(dojo.lang.isUndefined(_c18.mimetype)){
_c18.mimetype="text/html";
}
return _c18;
},onLoad:function(e){
this._runStack("_onLoadStack");
this.isLoaded=true;
},onUnLoad:function(e){
dojo.deprecated(this.widgetType+".onUnLoad, use .onUnload (lowercased load)",0.5);
},onUnload:function(e){
this._runStack("_onUnloadStack");
delete this.scriptScope;
if(this.onUnLoad!==dojo.widget.ContentPane.prototype.onUnLoad){
this.onUnLoad.apply(this,arguments);
}
},_runStack:function(_c1e){
var st=this[_c1e];
var err="";
var _c21=this.scriptScope||window;
for(var i=0;i<st.length;i++){
try{
st[i].call(_c21);
}
catch(e){
err+="\n"+st[i]+" failed: "+e.description;
}
}
this[_c1e]=[];
if(err.length){
var name=(_c1e=="_onLoadStack")?"addOnLoad":"addOnUnLoad";
this._handleDefaults(name+" failure\n "+err,"onExecError","debug");
}
},addOnLoad:function(obj,func){
this._pushOnStack(this._onLoadStack,obj,func);
},addOnUnload:function(obj,func){
this._pushOnStack(this._onUnloadStack,obj,func);
},addOnUnLoad:function(){
dojo.deprecated(this.widgetType+".addOnUnLoad, use addOnUnload instead. (lowercased Load)",0.5);
this.addOnUnload.apply(this,arguments);
},_pushOnStack:function(_c28,obj,func){
if(typeof func=="undefined"){
_c28.push(obj);
}else{
_c28.push(function(){
obj[func]();
});
}
},destroy:function(){
this.onUnload();
dojo.widget.ContentPane.superclass.destroy.call(this);
},onExecError:function(e){
},onContentError:function(e){
},onDownloadError:function(e){
},onDownloadStart:function(e){
},onDownloadEnd:function(url,data){
data=this.splitAndFixPaths(data,url);
this.setContent(data);
},_handleDefaults:function(e,_c32,_c33){
if(!_c32){
_c32="onContentError";
}
if(dojo.lang.isString(e)){
e={text:e};
}
if(!e.text){
e.text=e.toString();
}
e.toString=function(){
return this.text;
};
if(typeof e.returnValue!="boolean"){
e.returnValue=true;
}
if(typeof e.preventDefault!="function"){
e.preventDefault=function(){
this.returnValue=false;
};
}
this[_c32](e);
if(e.returnValue){
switch(_c33){
case true:
case "alert":
alert(e.toString());
break;
case "debug":
dojo.debug(e.toString());
break;
default:
if(this._callOnUnload){
this.onUnload();
}
this._callOnUnload=false;
if(arguments.callee._loopStop){
dojo.debug(e.toString());
}else{
arguments.callee._loopStop=true;
this._setContent(e.toString());
}
}
}
arguments.callee._loopStop=false;
},splitAndFixPaths:function(s,url){
var _c36=[],_c37=[],tmp=[];
var _c39=[],_c3a=[],attr=[],_c3c=[];
var str="",path="",fix="",_c40="",tag="",_c42="";
if(!url){
url="./";
}
if(s){
var _c43=/<title[^>]*>([\s\S]*?)<\/title>/i;
while(_c39=_c43.exec(s)){
_c36.push(_c39[1]);
s=s.substring(0,_c39.index)+s.substr(_c39.index+_c39[0].length);
}
if(this.adjustPaths){
var _c44=/<[a-z][a-z0-9]*[^>]*\s(?:(?:src|href|style)=[^>])+[^>]*>/i;
var _c45=/\s(src|href|style)=(['"]?)([\w()\[\]\/.,\\'"-:;#=&?\s@]+?)\2/i;
var _c46=/^(?:[#]|(?:(?:https?|ftps?|file|javascript|mailto|news):))/;
while(tag=_c44.exec(s)){
str+=s.substring(0,tag.index);
s=s.substring((tag.index+tag[0].length),s.length);
tag=tag[0];
_c40="";
while(attr=_c45.exec(tag)){
path="";
_c42=attr[3];
switch(attr[1].toLowerCase()){
case "src":
case "href":
if(_c46.exec(_c42)){
path=_c42;
}else{
path=(new dojo.uri.Uri(url,_c42).toString());
}
break;
case "style":
path=dojo.html.fixPathsInCssText(_c42,url);
break;
default:
path=_c42;
}
fix=" "+attr[1]+"="+attr[2]+path+attr[2];
_c40+=tag.substring(0,attr.index)+fix;
tag=tag.substring((attr.index+attr[0].length),tag.length);
}
str+=_c40+tag;
}
s=str+s;
}
_c43=/(?:<(style)[^>]*>([\s\S]*?)<\/style>|<link ([^>]*rel=['"]?stylesheet['"]?[^>]*)>)/i;
while(_c39=_c43.exec(s)){
if(_c39[1]&&_c39[1].toLowerCase()=="style"){
_c3c.push(dojo.html.fixPathsInCssText(_c39[2],url));
}else{
if(attr=_c39[3].match(/href=(['"]?)([^'">]*)\1/i)){
_c3c.push({path:attr[2]});
}
}
s=s.substring(0,_c39.index)+s.substr(_c39.index+_c39[0].length);
}
var _c43=/<script([^>]*)>([\s\S]*?)<\/script>/i;
var _c47=/src=(['"]?)([^"']*)\1/i;
var _c48=/.*(\bdojo\b\.js(?:\.uncompressed\.js)?)$/;
var _c49=/(?:var )?\bdjConfig\b(?:[\s]*=[\s]*\{[^}]+\}|\.[\w]*[\s]*=[\s]*[^;\n]*)?;?|dojo\.hostenv\.writeIncludes\(\s*\);?/g;
var _c4a=/dojo\.(?:(?:require(?:After)?(?:If)?)|(?:widget\.(?:manager\.)?registerWidgetPackage)|(?:(?:hostenv\.)?setModulePrefix|registerModulePath)|defineNamespace)\((['"]).*?\1\)\s*;?/;
while(_c39=_c43.exec(s)){
if(this.executeScripts&&_c39[1]){
if(attr=_c47.exec(_c39[1])){
if(_c48.exec(attr[2])){
dojo.debug("Security note! inhibit:"+attr[2]+" from  being loaded again.");
}else{
_c37.push({path:attr[2]});
}
}
}
if(_c39[2]){
var sc=_c39[2].replace(_c49,"");
if(!sc){
continue;
}
while(tmp=_c4a.exec(sc)){
_c3a.push(tmp[0]);
sc=sc.substring(0,tmp.index)+sc.substr(tmp.index+tmp[0].length);
}
if(this.executeScripts){
_c37.push(sc);
}
}
s=s.substr(0,_c39.index)+s.substr(_c39.index+_c39[0].length);
}
if(this.extractContent){
_c39=s.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_c39){
s=_c39[1];
}
}
if(this.executeScripts&&this.scriptSeparation){
var _c43=/(<[a-zA-Z][a-zA-Z0-9]*\s[^>]*?\S=)((['"])[^>]*scriptScope[^>]*>)/;
var _c4c=/([\s'";:\(])scriptScope(.*)/;
str="";
while(tag=_c43.exec(s)){
tmp=((tag[3]=="'")?"\"":"'");
fix="";
str+=s.substring(0,tag.index)+tag[1];
while(attr=_c4c.exec(tag[2])){
tag[2]=tag[2].substring(0,attr.index)+attr[1]+"dojo.widget.byId("+tmp+this.widgetId+tmp+").scriptScope"+attr[2];
}
str+=tag[2];
s=s.substr(tag.index+tag[0].length);
}
s=str+s;
}
}
return {"xml":s,"styles":_c3c,"titles":_c36,"requires":_c3a,"scripts":_c37,"url":url};
},_setContent:function(cont){
this.destroyChildren();
for(var i=0;i<this._styleNodes.length;i++){
if(this._styleNodes[i]&&this._styleNodes[i].parentNode){
this._styleNodes[i].parentNode.removeChild(this._styleNodes[i]);
}
}
this._styleNodes=[];
var node=this.containerNode||this.domNode;
while(node.firstChild){
try{
dojo.event.browser.clean(node.firstChild);
}
catch(e){
}
node.removeChild(node.firstChild);
}
try{
if(typeof cont!="string"){
node.innerHTML="";
node.appendChild(cont);
}else{
node.innerHTML=cont;
}
}
catch(e){
e.text="Couldn't load content:"+e.description;
this._handleDefaults(e,"onContentError");
}
},setContent:function(data){
this.abort();
if(this._callOnUnload){
this.onUnload();
}
this._callOnUnload=true;
if(!data||dojo.html.isNode(data)){
this._setContent(data);
this.onResized();
this.onLoad();
}else{
if(typeof data.xml!="string"){
this.href="";
data=this.splitAndFixPaths(data);
}
this._setContent(data.xml);
for(var i=0;i<data.styles.length;i++){
if(data.styles[i].path){
this._styleNodes.push(dojo.html.insertCssFile(data.styles[i].path));
}else{
this._styleNodes.push(dojo.html.insertCssText(data.styles[i]));
}
}
if(this.parseContent){
for(var i=0;i<data.requires.length;i++){
try{
eval(data.requires[i]);
}
catch(e){
e.text="ContentPane: error in package loading calls, "+(e.description||e);
this._handleDefaults(e,"onContentError","debug");
}
}
}
var _c52=this;
function asyncParse(){
if(_c52.executeScripts){
_c52._executeScripts(data.scripts);
}
if(_c52.parseContent){
var node=_c52.containerNode||_c52.domNode;
var _c54=new dojo.xml.Parse();
var frag=_c54.parseElement(node,null,true);
dojo.widget.getParser().createSubComponents(frag,_c52);
}
_c52.onResized();
_c52.onLoad();
}
if(dojo.hostenv.isXDomain&&data.requires.length){
dojo.addOnLoad(asyncParse);
}else{
asyncParse();
}
}
},setHandler:function(_c56){
var fcn=dojo.lang.isFunction(_c56)?_c56:window[_c56];
if(!dojo.lang.isFunction(fcn)){
this._handleDefaults("Unable to set handler, '"+_c56+"' not a function.","onExecError",true);
return;
}
this.handler=function(){
return fcn.apply(this,arguments);
};
},_runHandler:function(){
var ret=true;
if(dojo.lang.isFunction(this.handler)){
this.handler(this,this.domNode);
ret=false;
}
this.onLoad();
return ret;
},_executeScripts:function(_c59){
var self=this;
var tmp="",code="";
for(var i=0;i<_c59.length;i++){
if(_c59[i].path){
dojo.io.bind(this._cacheSetting({"url":_c59[i].path,"load":function(type,_c5f){
dojo.lang.hitch(self,tmp=";"+_c5f);
},"error":function(type,_c61){
_c61.text=type+" downloading remote script";
self._handleDefaults.call(self,_c61,"onExecError","debug");
},"mimetype":"text/plain","sync":true},this.cacheContent));
code+=tmp;
}else{
code+=_c59[i];
}
}
try{
if(this.scriptSeparation){
delete this.scriptScope;
this.scriptScope=new (new Function("_container_",code+"; return this;"))(self);
}else{
var djg=dojo.global();
if(djg.execScript){
djg.execScript(code);
}else{
var djd=dojo.doc();
var sc=djd.createElement("script");
sc.appendChild(djd.createTextNode(code));
(this.containerNode||this.domNode).appendChild(sc);
}
}
}
catch(e){
e.text="Error running scripts from content:\n"+e.description;
this._handleDefaults(e,"onExecError","debug");
}
}});
dojo.provide("dojo.widget.Dialog");
dojo.declare("dojo.widget.ModalDialogBase",null,{isContainer:true,shared:{bg:null,bgIframe:null},focusElement:"",bgColor:"black",bgOpacity:0.4,followScroll:true,trapTabs:function(e){
if(e.target==this.tabStartOuter){
if(this._fromTrap){
this.tabStart.focus();
this._fromTrap=false;
}else{
this._fromTrap=true;
this.tabEnd.focus();
}
}else{
if(e.target==this.tabStart){
if(this._fromTrap){
this._fromTrap=false;
}else{
this._fromTrap=true;
this.tabEnd.focus();
}
}else{
if(e.target==this.tabEndOuter){
if(this._fromTrap){
this.tabEnd.focus();
this._fromTrap=false;
}else{
this._fromTrap=true;
this.tabStart.focus();
}
}else{
if(e.target==this.tabEnd){
if(this._fromTrap){
this._fromTrap=false;
}else{
this._fromTrap=true;
this.tabStart.focus();
}
}
}
}
}
},clearTrap:function(e){
var _c67=this;
setTimeout(function(){
_c67._fromTrap=false;
},100);
},postCreate:function(){
with(this.domNode.style){
position="absolute";
zIndex=999;
display="none";
overflow="visible";
}
var b=dojo.body();
b.appendChild(this.domNode);
if(!this.shared.bg){
this.shared.bg=document.createElement("div");
this.shared.bg.className="dialogUnderlay";
with(this.shared.bg.style){
position="absolute";
left=top="0px";
zIndex=998;
display="none";
}
this.setBackgroundColor(this.bgColor);
b.appendChild(this.shared.bg);
this.shared.bgIframe=new dojo.html.BackgroundIframe(this.shared.bg);
}
},setBackgroundColor:function(_c69){
if(arguments.length>=3){
_c69=new dojo.gfx.color.Color(arguments[0],arguments[1],arguments[2]);
}else{
_c69=new dojo.gfx.color.Color(_c69);
}
this.shared.bg.style.backgroundColor=_c69.toString();
return this.bgColor=_c69;
},setBackgroundOpacity:function(op){
if(arguments.length==0){
op=this.bgOpacity;
}
dojo.html.setOpacity(this.shared.bg,op);
try{
this.bgOpacity=dojo.html.getOpacity(this.shared.bg);
}
catch(e){
this.bgOpacity=op;
}
return this.bgOpacity;
},_sizeBackground:function(){
if(this.bgOpacity>0){
var _c6b=dojo.html.getViewport();
var h=_c6b.height;
var w=_c6b.width;
with(this.shared.bg.style){
width=w+"px";
height=h+"px";
}
var _c6e=dojo.html.getScroll().offset;
this.shared.bg.style.top=_c6e.y+"px";
this.shared.bg.style.left=_c6e.x+"px";
var _c6b=dojo.html.getViewport();
if(_c6b.width!=w){
this.shared.bg.style.width=_c6b.width+"px";
}
if(_c6b.height!=h){
this.shared.bg.style.height=_c6b.height+"px";
}
}
},_showBackground:function(){
if(this.bgOpacity>0){
this.shared.bg.style.display="block";
}
},placeModalDialog:function(){
var _c6f=dojo.html.getScroll().offset;
var _c70=dojo.html.getViewport();
var mb=dojo.html.getMarginBox(this.containerNode);
var x=_c6f.x+(_c70.width-mb.width)/2;
var y=_c6f.y+(_c70.height-mb.height)/2;
with(this.domNode.style){
left=x+"px";
top=y+"px";
}
},showModalDialog:function(){
if(this.followScroll&&!this._scrollConnected){
this._scrollConnected=true;
dojo.event.connect(window,"onscroll",this,"_onScroll");
}
this.setBackgroundOpacity();
this._sizeBackground();
this._showBackground();
},hideModalDialog:function(){
if(this.focusElement){
dojo.byId(this.focusElement).focus();
dojo.byId(this.focusElement).blur();
}
this.shared.bg.style.display="none";
this.shared.bg.style.width=this.shared.bg.style.height="1px";
if(this._scrollConnected){
this._scrollConnected=false;
dojo.event.disconnect(window,"onscroll",this,"_onScroll");
}
},_onScroll:function(){
var _c74=dojo.html.getScroll().offset;
this.shared.bg.style.top=_c74.y+"px";
this.shared.bg.style.left=_c74.x+"px";
this.placeModalDialog();
},checkSize:function(){
if(this.isShowing()){
this._sizeBackground();
this.placeModalDialog();
this.onResized();
}
}});
dojo.widget.defineWidget("dojo.widget.Dialog",[dojo.widget.ContentPane,dojo.widget.ModalDialogBase],{templatePath:dojo.uri.dojoUri("src/widget/templates/Dialog.html"),blockDuration:0,lifetime:0,show:function(){
if(this.lifetime){
this.timeRemaining=this.lifetime;
if(!this.blockDuration){
dojo.event.connect(this.shared.bg,"onclick",this,"hide");
}else{
dojo.event.disconnect(this.shared.bg,"onclick",this,"hide");
}
if(this.timerNode){
this.timerNode.innerHTML=Math.ceil(this.timeRemaining/1000);
}
if(this.blockDuration&&this.closeNode){
if(this.lifetime>this.blockDuration){
this.closeNode.style.visibility="hidden";
}else{
this.closeNode.style.display="none";
}
}
this.timer=setInterval(dojo.lang.hitch(this,"_onTick"),100);
}
this.showModalDialog();
dojo.widget.Dialog.superclass.show.call(this);
},onLoad:function(){
this.placeModalDialog();
dojo.widget.Dialog.superclass.onLoad.call(this);
},fillInTemplate:function(){
},hide:function(){
this.hideModalDialog();
dojo.widget.Dialog.superclass.hide.call(this);
if(this.timer){
clearInterval(this.timer);
}
},setTimerNode:function(node){
this.timerNode=node;
},setCloseControl:function(node){
this.closeNode=node;
dojo.event.connect(node,"onclick",this,"hide");
},setShowControl:function(node){
dojo.event.connect(node,"onclick",this,"show");
},_onTick:function(){
if(this.timer){
this.timeRemaining-=100;
if(this.lifetime-this.timeRemaining>=this.blockDuration){
dojo.event.connect(this.shared.bg,"onclick",this,"hide");
if(this.closeNode){
this.closeNode.style.visibility="visible";
}
}
if(!this.timeRemaining){
clearInterval(this.timer);
this.hide();
}else{
if(this.timerNode){
this.timerNode.innerHTML=Math.ceil(this.timeRemaining/1000);
}
}
}
}});
dojo.provide("dojo.widget.TitlePane");
dojo.widget.defineWidget("dojo.widget.TitlePane",dojo.widget.ContentPane,{labelNode:"",labelNodeClass:"",containerNodeClass:"",label:"",open:true,templatePath:dojo.uri.dojoUri("src/widget/templates/TitlePane.html"),postCreate:function(){
if(this.label){
this.labelNode.appendChild(document.createTextNode(this.label));
}
if(this.labelNodeClass){
dojo.html.addClass(this.labelNode,this.labelNodeClass);
}
if(this.containerNodeClass){
dojo.html.addClass(this.containerNode,this.containerNodeClass);
}
if(!this.open){
dojo.html.hide(this.containerNode);
}
dojo.widget.TitlePane.superclass.postCreate.apply(this,arguments);
},onLabelClick:function(){
if(this.open){
dojo.lfx.wipeOut(this.containerNode,250).play();
this.open=false;
}else{
dojo.lfx.wipeIn(this.containerNode,250).play();
this.open=true;
}
},setLabel:function(_c78){
this.labelNode.innerHTML=_c78;
}});

