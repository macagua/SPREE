var currQueriesIn=[];
var firstLoad=true;
function refreshBoxes(_1){
if(_1%7==0){
var d=callManager.doRequest("box","io",null,null,[function(_3){
loadIOBoxes(_3);
return _3;
}]);
}
return d;
}
function refreshRightBoxes(_4){
if(_4%15==0){
var d=callManager.doRequest("box","statistics",null,null,[function(_6){
replaceNode("statisticsBoxContent",_6);
return _6;
}]);
}
if(_4%23==0){
var d=callManager.doRequest("statistics","getHighscoreList",null,null,[function(_7){
replaceNode("highscores_listContent",_7);
return _7;
}]);
}
return d;
}
function loadIOBoxes(_8){
boxes_loadQueryBox("incoming",_8.queries_in);
boxes_loadQueryBox("outgoing",_8.queries_out);
var _9=[];
for(var i=0;i<_8.queries_in.length;i++){
_9.push(_8.queries_in[i].query_id);
}
if(!firstLoad&&!utils.arrays.isSubset(_9,currQueriesIn)){
attractAttention("New Question!");
}
currQueriesIn=currQueriesIn.concat(_9);
firstLoad=false;
}
function attractAttention(_b){
utils.blinking.message=_b;
utils.blinking.blink();
}
function boxes_loadQueryBox(_c,_d){
var _e=MochiKit.DOM.getElement(_c+"_box");
var _f=MochiKit.DOM.getElementsByTagAndClassName("li",null,_e);
for(var i=0;i<_f.length-1;i++){
var _11=_f[i];
if(i<_d.length){
var _12=_d[i];
var _13=_12.in_out+"_"+_12.status;
_13+="_"+(_12.isOnline?"online":"offline");
if(current_query_id==_12.query_id){
_11.className=_13+" selected";
}else{
_11.className=_13;
_11.lang=_13;
}
_11.setAttribute("lang",_13);
_11.setAttribute("id","boxentry_"+_12.query_id);
if(i%2==0){
_11.setAttribute("style","background-color:#FFF");
_11.getAttribute("style").backgroundColor="#FFF";
}else{
_11.setAttribute("style","background-color:#ccc");
_11.getAttribute("style").backgroundColor="#ccc";
}
_11.getAttribute("style").display="";
_11.getAttribute("style").opacity=1;
var _14=MochiKit.DOM.getFirstElementByTagAndClassName("h3",null,_11);
MochiKit.DOM.swapDOM(_14,MochiKit.DOM.H3(_12.topic));
var _15=_12.date;
if(_12.user){
_15+=", "+_12.user;
}
_11.title=boxes_getTitleForQuery(_c,_12);
}else{
_11.className="hidden";
_11.setAttribute("id","boxentry_-1");
}
}
var _16=_f[_f.length-1];
if(_d.length==0){
_16.className="noEntries";
}else{
_16.className="hidden";
}
}
function boxes_getTitleForQuery(_17,_18){
var _19=_18.status;
var _1a="";
if(_19!="new"){
if(_19=="finished"){
_1a="Rate this chat";
}else{
_1a="Go to chat";
if(!_18.isOnline){
if(_17=="incoming"){
_1a=_1a+" (User offline)";
}else{
_1a=_1a+" (Expert offline)";
}
}
}
return _1a;
}
if(_17=="incoming"){
_1a="Show question details";
if(!_18.isOnline){
_1a=_1a+" (User offline)";
}
}else{
_1a="Show expert search results";
}
return _1a;
}
function boxes_selectQuery(_1b,_1c){
unselectQuery();
var _1d=_1c.id.substr(9);
var _1e=_1c.lang;
if(_1e.indexOf("myTurn")!=-1||_1e.indexOf("notMyTurn")!=-1||_1e.indexOf("finished")!=-1){
chat_loadContent(_1d);
}else{
if(_1e.indexOf("new")!=-1){
if(_1b=="incoming"){
setContent("query_overview",_1d);
}else{
loadWaitBoxContent(_1d);
}
}
}
setSelectedQuery(_1d);
}
function setSelectedQuery(_1f){
if(_1f==-1){
return;
}
if(_1f==-10){
elem_id="allquestionslink";
elem=MochiKit.DOM.getElement(elem_id);
}else{
elem_id="boxentry_"+_1f;
elem=MochiKit.DOM.getElement(elem_id);
}
if(elem==null||elem.className=="selected"){
return;
}
current_query_id=_1f;
elem.className=elem.className+" selected";
}
function unselectQuery(_20){
if(current_query_id==-1){
return;
}
if(current_query_id==-10){
elem_id="allquestionslink";
elem=MochiKit.DOM.getElement(elem_id);
}else{
elem_id="boxentry_"+current_query_id;
elem=MochiKit.DOM.getElement(elem_id);
}
if(elem==null){
return;
}
if(_20){
elem.className="hidden";
}else{
elem.className=elem.lang;
}
current_query_id=-1;
}
var blogs_classifyBack="blogs";
var blogs_classifyBackParam="-1";
function blogLoadContent(){
setContent("blogs","-1");
}
function deleteBlogEntry(_21){
d=callManager.doRequest("blog","deleteBlogEntry",_21+"",null);
d.addCallback(function(_22){
blogLoadContent();
setStatus("NoteBook entry was deleted.");
});
}
function blogentry_save(){
var _23=getElement("blogentry_topic").value;
var _24=getElement("blogentry_text").value;
var id=getElement("blog_entry_id").value;
var _26=getElement("blogentry_check").checked;
var _27=getElement("queryId").value;
if(_23.length==0){
createBlog_showDialog();
return;
}
var _28=MochiKit.DOM.getElement("blogentry_createButton");
_28.disabled=true;
d=callManager.doRequest("blog","do_BlogPost",null,{"blogentry_id":id,"title":_23,"text":_24,"private":_26,"query_id":_27,"nocache":(new Date()).getTime()});
if(d){
d.addCallback(function(_29){
setStatus("Saved notebook entry.");
if(id>0){
setContent("blogentry",id+"/"+0+"/"+0);
}else{
blogLoadContent();
}
});
}
}
function blogentry_clearFields(){
MochiKit.DOM.getElement("blogentry_topic").value="";
MochiKit.DOM.getElement("blogentry_text").value="";
MochiKit.DOM.getElement("blogentry_check").checked=false;
}
function blog_rate_showDialog(_2a){
current_blogentry_id=_2a;
var _2b=dojo.widget.byId("DialogContent_blog");
var btn=document.getElementById("blog_dialog_hider");
_2b.setCloseControl(btn);
_2b.show();
}
function blog_rate_cancelDialog(){
var _2d=dojo.widget.byId("DialogContent_blog");
_2d.hide();
}
function blog_rate(_2e){
var e=MochiKit.DOM.getElement("blog_rating_radio_1");
var _30=[];
var _31=getElement("queryId_after_rate").value;
for(var i=1;i<6;i++){
_30[i-1]=MochiKit.DOM.getElement("blog_rating_radio_"+i);
}
for(i=0;i<_30.length;i++){
if(_30[i].checked==true){
d=callManager.doRequest("blog","doBlogRating",_2e+"/"+_30[i].value,null);
d.addCallback(function(_33){
setStatus("Saved new Rating.");
setContent("blogentry",_2e+"/"+1+"/"+_31);
});
}
getElement("no_rate_blog").style.display="";
getElement("rate_blog").style.display="none";
}
unselectQuery(true);
}
function blog_modifyCategories(_34,_35){
knownArgs=2;
labelOffset=arguments.length-knownArgs;
var _36=[];
for(var i=knownArgs;i<labelOffset+knownArgs;i++){
_36.push(arguments[i]);
}
var d=callManager.doRequest("profile","getNodesInfo","",{nodeids:_36});
if(d){
d.addCallback(function(res){
_36=res.infos;
var _3a={showHeaderBlog:true,cats:_36,topic:_35,entryID:_34};
setContent("profileBlog",null,_3a,true);
});
}
}
function blogs_setBackFunction(_3b,_3c){
blogs_classifyBack=_3b;
blogs_classifyBackParam=_3c;
}
function blog_classifyManuallyAbort(){
return setContent(blogs_classifyBack,blogs_classifyBackParam);
}
function blog_classifyManuallyAccept(){
var _3d=getElement("hiddenEntryID");
var _3e={};
_3e.blogentry_id=_3d.value;
_3e.catIDs=[];
cats="";
for(var i=0;i<ftable.data.length;i++){
if(ftable.data[i].id){
_3e.catIDs.push(ftable.data[i].id);
cats+=ftable.data[i].label+", ";
}
}
var d=callManager.doRequest("blog","updateBlogCategories",null,_3e);
if(d){
d.addCallback(function(res){
d2=blog_classifyManuallyAbort();
d2.addCallback(function(res){
var _43=getElement("entryCats_"+_3d.value);
if(cats!=""){
_43.innerHTML=cats.slice(0,cats.length-2);
}
});
});
}
}
function blogedit_addChat(){
getElement("blogentry_text").value+="\n"+getElement("blogentry_chatText").value;
}
function createBlog_showDialog(){
var _44=dojo.widget.byId("Dialog_createBlog");
_44.show();
}
function createBlog_closeDialog(){
var _45=dojo.widget.byId("Dialog_createBlog");
_45.hide();
}
var chat={showActivity:function(_46){
if(_46.chat_entries.length==0){
return;
}
var _47=_46.chat_entries[_46.chat_entries.length-1].byMe;
if(_47){
return;
}
var _48=MochiKit.DOM.getElement("chat_data_isExpert").value!="True";
var _49;
if(_48){
_49=MochiKit.DOM.getElement("chat_metadata_expert");
}else{
_49=MochiKit.DOM.getElement("chat_metadata_user");
}
MochiKit.Visual.pulsate(_49,{"pulses":3});
}};
var allchats={selectMenu:function(_4a){
var _4b=MochiKit.DOM.getElement("allchats_header");
if(!_4b){
return;
}
var _4c=MochiKit.DOM.getElementsByTagAndClassName(null,"actionlink",_4b);
for(var i=0;i<_4c.length;i++){
dojo.html.removeClass(_4c[i],"actionlinkSelected");
}
switch(_4a){
case null:
case "":
case "all":
dojo.html.addClass(_4c[0],"actionlinkSelected");
break;
case "user":
dojo.html.addClass(_4c[1],"actionlinkSelected");
break;
case "expert":
dojo.html.addClass(_4c[2],"actionlinkSelected");
break;
}
},showExpertChats:function(){
var all=getElement("allchatsContent");
var _4f=getElementsByTagAndClassName(null,"chatEntryUser",all);
var _50=getElementsByTagAndClassName(null,"chatEntryExpert",all);
for(var i=0;i<_4f.length;i++){
_4f[i].style.display="none";
}
for(var i=0;i<_50.length;i++){
_50[i].style.display="";
}
},showUserChats:function(){
var all=getElement("allchatsContent");
var _53=getElementsByTagAndClassName(null,"chatEntryUser",all);
var _54=getElementsByTagAndClassName(null,"chatEntryExpert",all);
for(var i=0;i<_54.length;i++){
_54[i].style.display="none";
}
for(var i=0;i<_53.length;i++){
_53[i].style.display="";
}
},showAllChats:function(){
var all=getElement("allchatsContent");
var _57=getElementsByTagAndClassName(null,"chatEntryUser",all);
var _58=getElementsByTagAndClassName(null,"chatEntryExpert",all);
for(var i=0;i<_58.length;i++){
_58[i].style.display="";
}
for(var i=0;i<_57.length;i++){
_57[i].style.display="";
}
}};
function chat_loadContent(_5a){
var d=setContent("chat",_5a);
return d;
}
function chat_loadTable(_5c){
if(_5c==null){
return;
}
if(_5c.chat_entries.length==0){
chat_setFinished(_5c);
return;
}
chat_cleanFakedRows();
var _5d=getElement("chat_out_table_body");
appendRow=function(row){
var _5f=utils.dom.text2html(row.text);
var tr=MochiKit.DOM.TR({"id":"chat_entry_"+row.id},MochiKit.Base.map(MochiKit.Base.partial(MochiKit.DOM.TD,null),[row.date,row.user,_5f]));
tr.childNodes[2].innerHTML=tr.childNodes[2].childNodes[0].nodeValue;
MochiKit.DOM.appendChildNodes(_5d,tr);
};
MochiKit.Base.map(appendRow,_5c.chat_entries);
chat_setFinished(_5c);
pollingManager.resetInterval();
if(_5c.chat_entries.length>0){
scrollToBottom();
chat.showActivity(_5c);
}
}
function chat_fakeUpdate(_61){
var _62=MochiKit.DOM.getElement("chat_out_table_body");
var _63=MochiKit.DOM.getElement("chat_out_display_name").value;
var _64=utils.dom.text2html(_61);
var tr=MochiKit.DOM.TR({"id":"chat_dummy_row"},MochiKit.Base.map(MochiKit.Base.partial(MochiKit.DOM.TD,null),[utils_getTimeString(),_63,_64]));
tr.childNodes[2].innerHTML=tr.childNodes[2].childNodes[0].nodeValue;
MochiKit.DOM.appendChildNodes(_62,tr);
return;
}
function chat_cleanFakedRows(){
var _66=getElement("chat_out_table");
var _67=_66.getElementsByTagName("tr");
for(var i=_67.length-1;i>=0;i--){
if(_67[i].getAttribute("id")=="chat_dummy_row"){
MochiKit.DOM.removeElement(_67[i]);
}else{
break;
}
}
}
function chat_setFinished(_69){
if(chat_wasFinished()){
return;
}
if(_69.session_status=="FINISHED"||_69.session_status=="RATED"){
var _6a=MochiKit.DOM.getElement("chat_query_id").value;
getElement("chat_data_status").value="FINISHED";
chat_loadContent(_6a);
}else{
}
}
function chat_getLastEntryID(){
var _6b=getElement("chat_out_table");
var _6c=_6b.getElementsByTagName("tr");
if(_6c.length==0){
return "-1";
}
for(var i=_6c.length-1;i>=0;i--){
lastRow=_6c[i];
if(lastRow.getAttribute("id")!="chat_dummy_row"){
break;
}
}
var _6e=lastRow.getAttribute("id").split("_")[2];
return _6e;
}
function is_expert(){
return getElement("chat_data_isExpert").value=="True";
}
function chat_wasFinished(){
return getElement("chat_data_status").value=="FINISHED"||getElement("chat_data_status").value=="RATED";
}
function chat_getEntries(){
if(chat_wasFinished()){
return;
}
var _6f=chat_getLastEntryID();
var _70=MochiKit.DOM.getElement("chat_query_id").value;
var d=callManager.doRequest("chat","getEntries",_70+"/"+_6f,null,[chat_loadTable]);
if(d==null){
return;
}
return d;
}
function chat_commit(){
var _72=getElement("chat_in");
var _73=_72.value;
var _74=MochiKit.DOM.getElement("chat_query_id").value;
var d=callManager.doRequest("chat","send",_74,{"text":_73},chat_getEntries);
if(d!=null){
chat_fakeUpdate(_73);
_72.value="";
scrollToBottom();
_72.focus();
}
return false;
}
function chat_rate_showDialog(_76){
var _77=dojo.widget.byId("DialogContent");
var btn=document.getElementById("chat_dialog_hider");
_77.setCloseControl(btn);
_77.show();
}
function chat_rate_cancelDialog(){
var _79=dojo.widget.byId("DialogContent");
_79.hide();
}
function chat_finish(_7a){
var d=callManager.doRequest("chat","finish",_7a,null);
if(d!=null){
d.addCallback(function(_7c){
setStatus("Finished chat");
refreshBoxes(0);
if(is_expert()){
chat_loadContent(_7a);
}else{
var d=chat_loadContent(_7a);
if(d){
d.addcallback(chat_createContent);
}
}
});
}
}
function chat_rate(_7e){
var e=MochiKit.DOM.getElement("chat_rating_radio_1");
var _80=[];
for(var i=1;i<6;i++){
_80[i-1]=MochiKit.DOM.getElement("chat_rating_radio_"+i);
}
for(i=0;i<_80.length;i++){
if(_80[i].checked==true){
var d=callManager.doRequest("chat","rate",+_7e+"/"+_80[i].value,null);
d.addCallback(function(_83){
setStatus("Saved new Rating.");
chat_loadContent(_7e);
});
break;
}
}
unselectQuery(true);
}
function exist_blogEntry(){
return getElement("chat_exist_blog").value=="True";
}
function chat_createContent(_84){
var _85=getElement("chat_data_status").value;
var _86=getElement("chat_data_isExpert").value;
if(_85!="FINISHED"&&_85!="RATED"){
getElement("chat_input").style.display="";
var d=chat_getEntries();
if(d){
d.addCallback(scrollToBottom);
}
}else{
getElement("chat_input").style.display="none";
if(is_expert()&&!exist_blogEntry()){
getElement("chat_create_blog").style.display="";
}else{
if(is_expert()&&exist_blogEntry()){
getElement("exists_blog_entry").style.display="";
}else{
if(_85!="RATED"){
var _88=MochiKit.DOM.getElement("chat_query_id").value;
chat_rate_showDialog(_88);
}else{
getElement("chatFinished").style.display="";
}
}
}
scrollToBottom();
}
return _84;
}
function chat_refresh(_89){
if(_89%3==0){
var _8a=MochiKit.DOM.getElement("chatContent");
if(_8a!=null){
chat_getEntries();
}
}
}
function chat_query_overviewContent(_8b){
var d=setContent("query_overview",_8b);
return d;
}
function scrollToBottom(){
var _8d=getElement("chat_out");
_8d.scrollTop=_8d.scrollHeight;
}
function do_return(){
unselectQuery(true);
historyManager.setLastContent(true);
}
function allchatsLoadContent(){
setContent("chat_overview");
}
function chat_handleKey(_8e){
var e;
if(window.event){
e=window.event;
}else{
e=_8e;
}
if(e.keyCode==13){
if(e.ctrlKey){
var _90=getElement("chat_in");
_90.value+="\n";
if(window.event){
var _91=document.selection.createRange();
_91.select();
}
}else{
chat_commit();
}
var _92=getElement("chat_in");
_92.scrollTop=_92.scrollHeight;
}
}
function setContent(_93,_94,_95,_96){
var _97=new ApplicationState(_93,_94,_95,setContent2);
if(_96){
_97.setInvalid();
}
historyManager.addState(_97);
return setContent2(_93,_94,_95);
}
function setContent2(_98,_99,_9a){
setStatus("");
var _9b=getElement("ratePopup");
if(_9b){
popupRateCancel();
}
TreeBuilder.saveTree();
var _9c="content";
var _9d="current";
var _9e;
var el=getElement(_9d);
if(el!=null){
el.setAttribute("id",el.getAttribute("lang"));
}
displayLoadingScreen(_9c);
var d=callManager.doRequest("content",_98,_99,_9a);
if(d==null){
return;
}
d.addCallback(replaceNode,_9c);
switch(_98){
case "search":
d.addCallback(search_restoreAllValues);
_9e=getElement("searchMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "waitSearch":
unselectQuery();
setSelectedQuery(_99);
waitSearchLastState="";
break;
case "blogs":
_9e=getElement("blogsMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "blogentry":
_9e=getElement("blogsMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "blog_content_edit":
_9e=getElement("blogsMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "feedback":
_9e=getElement("feedbackMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "im":
_9e=getElement("imMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
d.addCallback(im.init);
break;
case "profile":
d.addCallback(function(res){
ftable.hideRating=false;
return res;
});
d.addCallback(initProfile);
d.addCallback(function(res){
if(getElement("aPrefPersonal")){
dojo.html.removeClass("aPrefPersonal","actionlinkSelected");
dojo.html.addClass("aPrefProfile","actionlinkSelected");
}
return res;
});
_9e=getElement("profileMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "allquestions":
unselectQuery();
setSelectedQuery(-10);
break;
case "preferencesSettings":
d.addCallback(function(){
dojo.html.removeClass("aPrefPersonal","actionlinkSelected");
dojo.html.addClass("aPrefSettings","actionlinkSelected");
});
_9e=getElement("profileMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "preferencesUpdateUser1":
case "preferencesUpdateUser2":
case "preferences":
d.addCallback(function(){
dojo.html.removeClass("aPrefPersonal","actionlinkSelected");
dojo.html.addClass("aPrefPersonal","actionlinkSelected");
});
_9e=getElement("profileMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "register_new":
d.addCallback(function dummy(res){
registration.selectMenuitem(1);
return res;
});
break;
case "regProfile":
d.addCallback(function dummy(res){
registration.selectMenuitem(3);
ftable.data=_9a.cats;
return res;
});
d.addCallback(initProfile);
d.addCallback(switchButtons);
break;
case "register_load_docs":
d.addCallback(function(res){
registration.selectMenuitem(2);
return res;
});
break;
case "statistics":
_9e=getElement("statisticsMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "chat":
d.addCallback(chat_createContent);
unselectQuery();
d.addCallback(function(res){
var d2=refreshBoxes(0);
current_query_id=_99;
return res;
});
break;
case "query_overview":
break;
case "chat_overview":
d.addCallback(allchats.selectMenu,_9a.chat_type);
_9e=getElement("imMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "profileSearch":
d.addCallback(function(res){
var btn=getElement("btnSubmitProfile");
btn.style.display="None";
btn=getElement("btnCategoriesBack");
btn.style.display="block";
btn=getElement("btnCategoriesAccept");
btn.style.display="block";
ftable.hideRating=true;
ftable.setListHeader("Question Classification");
return res;
});
d.addCallback(initProfile,search_catStruct);
_9e=getElement("searchMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
case "profileBlog":
d.addCallback(function(res){
var ph=getElement("noteTopic");
ph.innerHTML=_9a.topic;
var btn=getElement("btnSubmitProfile");
btn.style.display="None";
var _ad=getElement("btnCategoriesBack");
_ad.style.display="block";
if(BrowserDetector.browser=="Explorer"){
_ad.onclick="javascript:blog_classifyManuallyAbort();";
MochiKit.Signal.connect(_ad,"onclick",blog_classifyManuallyAbort);
}else{
_ad.setAttribute("onClick","javascript:blog_classifyManuallyAbort();");
}
var _ae=getElement("btnCategoriesAccept");
if(BrowserDetector.browser=="Explorer"){
_ae.onclick="javascript:blog_classifyManuallyAccept();";
MochiKit.Signal.connect(_ae,"onclick",blog_classifyManuallyAccept);
}else{
_ae.setAttribute("onClick","javascript:blog_classifyManuallyAccept();");
}
_ae.style.display="block";
ftable.hideRating=true;
ftable.setListHeader("Note Classification");
return res;
});
d.addCallback(initProfile,_9a.cats);
_9e=getElement("blogsMenuItem");
_9e.setAttribute("id",_9d);
unselectQuery();
break;
}
return d;
}
function loadContent(_af){
replaceNode("content",_af);
}
function displayLoadingScreen(_b0){
var div=getElement("loadingScreen");
getElement(_b0).innerHTML=div.innerHTML;
}
function feedback_send(){
var _b2=MochiKit.DOM.getElement("feedbackcontent_subject").value;
var _b3=MochiKit.DOM.getElement("feedbackcontent_text").value;
if(_b2.length+_b3.length<5){
feedback_showDialog();
return;
}
var _b4=MochiKit.DOM.getElement("feedbackcontent_sendButton");
_b4.disabled=true;
var d=callManager.doRequest("feedback","send",null,{"subject":_b2,"text":_b3},[function(_b6){
feedback_show_dialog();
callLater(3,feedback_close_dialog);
}]);
if(d==null){
return;
}
}
function feedback_send2DB(){
var _b7=MochiKit.DOM.getElement("feedbackcontent_design").value;
var _b8=MochiKit.DOM.getElement("feedbackcontent_interaction").value;
var _b9=MochiKit.DOM.getElement("feedbackcontent_bugs").value;
var _ba=MochiKit.DOM.getElement("feedbackcontent_ideas").value;
var sum=0;
var _bc={"fast_registration":0,"ask_many_steps":0,"change_automatic_classification":0,"easy_categorization":0,"right_categorization":0,"competent_expert":0,"see_answer":0,"see_question":0,"quick_answer":0,"helpful_answer":0,"expert_online":0,"no_system_errors":0,"system_speed":0,"everyday":0,"clear_design":0,"predictable_reaction":0,"how_to_use":0};
for(fieldname in _bc){
for(var i=0;i<document.form[fieldname].length;i++){
if(document.form[fieldname][i].checked){
_bc[fieldname]=document.form[fieldname][i].value;
}
}
sum=sum+_bc[fieldname];
}
_bc["design"]=_b7;
_bc["interaction"]=_b8;
_bc["bugs"]=_b9;
_bc["ideas"]=_ba;
if(_b7.length<2&&_b8.length<2&&_ba.length<5&&_b9.length<5&&sum=="000000000000000000000"){
feedback_showDialog();
return;
}
var _be=MochiKit.DOM.getElement("feedbackcontent_sendButton");
_be.disabled=true;
var d=callManager.doRequest("feedback","send2DB",null,_bc,[function(_c0){
feedback_show_dialog();
callLater(3,feedback_close_dialog);
}]);
if(d==null){
return;
}
}
function feedback_showDialog(){
var _c1=dojo.widget.byId("Dialog_feedback");
_c1.show();
}
function feedback_closeDialog(){
var _c2=dojo.widget.byId("Dialog_feedback");
_c2.hide();
}
function feedback_show_dialog(){
var _c3=dojo.widget.byId("dialogFeedback");
_c3.show();
}
function feedback_close_dialog(){
var _c4=dojo.widget.byId("dialogFeedback");
var ds=_c4.shared.bg.style.display!="none";
if(ds){
var _c4=dojo.widget.byId("dialogFeedback");
_c4.hide();
setContent("search");
}
}
var im={};
im.currentPage=1;
im.init=function(){
im.loadUsers();
};
im.loadUsers=function(_c6){
if(_c6==undefined){
_c6=1;
}
var d=callManager.doRequest("im","getUsers",null,{showPage:_c6},[function(_c8){
im.currentPage=_c6;
im.insertUsers(_c8);
return _c8;
}]);
};
im.insertUsers=function(_c9){
var _ca=MochiKit.DOM.getElement("imUsersBox");
var _cb=MochiKit.DOM.getElement("imUsers");
var _cc=-1;
if(_cb){
var _cd=MochiKit.DOM.getElementsByTagAndClassName(null,"selected",_cb);
if(_cd.length>0){
_cc=_cd[0].getAttribute("name");
}
}
if(!_ca){
return;
}
if(_cb){
var _ce=_cb.scrollTop;
}
replaceNode(_ca,_c9);
_cb=MochiKit.DOM.getElement("imUsers");
if(_cb&&_cc>=0){
var _cd=MochiKit.DOM.getElementsByTagAndClassName("li",null,_cb);
for(var i=0;i<_cd.length;i++){
if(_cd[i].getAttribute("name")==_cc){
_cd[i].className+=" selected";
break;
}
}
}
};
im.lastUserDetailsDefered=null;
im.showUserDetails=function(_d0){
if(im.lastUserDetailsDefered){
im.lastUserDetailsDefered.cancel();
}
var _d1=MochiKit.DOM.getElement("imUsers");
if(_d1){
var _d2=MochiKit.DOM.getElementsByTagAndClassName(null,"selected",_d1);
if(_d2.length>0){
_d2[0].className=_d2[0].className.substr(0,_d2[0].className.length-9);
}
}
var id=_d0.getAttribute("name");
_d0.className+=" selected";
var d=callManager.doRequest("im","getUserDetails",id,null,[function(_d5){
var _d6=MochiKit.DOM.getElement("imDetails");
if(_d6){
replaceNode("imDetails",_d5);
}
return _d5;
}]);
if(d){
im.lastUserDetailsDefered=d;
}
};
im.startChat=function(){
var _d7=MochiKit.DOM.getElement("imSubjectField").value;
var _d8=MochiKit.DOM.getElement("imQuestionField").value;
var _d9=MochiKit.DOM.getElement("userDetailsUserId").value;
utils.dom.disableButton("imStartChat");
var d=callManager.doRequest("im","doDirectChat",null,{"topic":_d7,"query":_d8,"expertid":_d9},[function(_db){
if(_db.failure){
setContent("im_expertFull","");
return;
}
current_query_id=_db.query_id;
loadWaitBoxContent(_db.query_id);
refreshBoxes(0);
setStatus("The selected user has been contacted.");
return _db;
}]);
};
im.autoCompleteTopic=function(txt){
var _dd=txt.substr(0,50);
var _de=MochiKit.DOM.getElement("imSubjectField");
if(_de.getAttribute("lang")=="0"){
_de.value=_dd;
}
};
im.update=function(_df){
if(_df%29==0){
if(MochiKit.DOM.getElement("imContent")){
im.loadUsers(im.currentPage);
}
}
};
var preferences={showPersonal:function(){
var d=setContent("preferences");
},showSettings:function(){
var d=setContent("preferencesSettings");
},showProfile:function(){
var d=setContent("profile",null,{showHeaderPref:true});
},clearSelectedHeaders:function(){
dojo.html.removeClass("aPrefPersonal","actionlinkSelected");
dojo.html.removeClass("aPrefSettings","actionlinkSelected");
dojo.html.removeClass("aPrefProfile","actionlinkSelected");
},submitPersonal:function(_e3){
var ct=MochiKit.DOM.formContents("preferencesContent");
var _e5={};
for(var i=0;i<ct[0].length;i++){
_e5[ct[0][i]]=ct[1][i];
}
var d=setContent("preferencesUpdateUser"+_e3,null,_e5);
if(d){
d.addCallback(function(_e8){
var _e9=getElement("inpmsg"+_e3);
if(_e9.value.length>0){
preferences.showTempDialog(_e9.value);
}
setStatus(_e9.value);
return _e8;
});
}
},showTempDialog:function(msg){
preferences.showDialog(msg);
setStatus(msg);
callLater(3,preferences.closeDialog);
},showDialog:function(msg){
var _ec=dojo.widget.byId("dialogDynamic");
var _ed=getElement("dialogDynamicMessage");
_ed.innerHTML=msg;
_ec.show();
},closeDialog:function(){
var _ee=dojo.widget.byId("dialogDynamic");
_ee.hide();
}};
var ftable=new FieldTable();
var treeClickX=0;
var treeClickY=0;
var TreeBuilder={treeDat:{treeNodes:[]},loadNodes:function(_ef){
TreeBuilder.treeDat.treeNodes=_ef;
},buildTreeNodes:function(_f0,_f1){
for(var i=0;i<_f0.length;i++){
var _f3=dojo.widget.byId(""+_f0[i].nodeId);
if(_f3&&BrowserDetector.browser=="Explorer"){
_f1.removeChild(_f3);
dojo.widget.manager.removeById(""+_f0[i].nodeId);
}
_f3=dojo.widget.createWidget("TreeNode",{title:_f0[i].title,widgetId:_f0[i].nodeId,objectId:_f0[i].objectId,isFolder:_f0[i].isFolder});
_f1.addChild(_f3);
if(_f0[i].children){
TreeBuilder.buildTreeNodes(_f0[i].children,_f3);
}
}
},buildTree:function(){
var _f4=dojo.widget.createWidget("TreeSelector",{widgetId:"myTreeSelector"});
var _f5=dojo.widget.createWidget("Tree",{widgetId:"myTreeWidget",selector:"myTreeSelector"});
dojo.event.topic.subscribe(_f4.eventNames.select,nodeSelected);
dojo.event.topic.subscribe(_f4.eventNames.dblselect,nodeSelected);
TreeBuilder.buildTreeNodes(TreeBuilder.treeDat.treeNodes,_f5);
TreeBuilder.replacePlaceHolder(_f5);
},replacePlaceHolder:function(_f6){
var _f7=getElement("myWidgetContainer");
var _f8=getElement("treePlaceHolder");
_f7.replaceChild(_f6.domNode,_f8);
},saveTree:function(){
TreeBuilder.markListUnselectedAllNodes();
TreeBuilder.unselectAllNodes();
var _f9=getElement("myWidgetContainer");
if(_f9){
dojo.body().appendChild(_f9);
_f9.style.display="None";
}
},loadTree:function(){
var _fa=getElementsByTagAndClassName("div","treeWidget",dojo.body());
var phs=getElementsByTagAndClassName("span","placeholder",_fa[0]);
if(phs.length>0){
var _fc=_fa[0];
var _fd=_fa[1];
}else{
var _fc=_fa[1];
var _fd=_fa[0];
}
_fc.parentNode.replaceChild(_fd,_fc);
_fd.style.display="block";
},markListSelected:function(_fe){
var _ff=dojo.widget.byId(_fe+"");
if(_ff){
_ff=_ff.domNode;
var a=MochiKit.DOM.getFirstElementByTagAndClassName("a",null,_ff);
dojo.html.addClass(a,"treeSelectedItem");
}
},markListUnselected:function(_101){
var node=dojo.widget.byId(_101+"");
if(node){
node=dojo.widget.byId(_101+"").domNode;
var a=MochiKit.DOM.getFirstElementByTagAndClassName("a",null,node);
dojo.html.removeClass(a,"treeSelectedItem");
}
},markListUnselectedAllNodes:function(){
var _104=getElement("myWidgetContainer");
var _105=getElementsByTagAndClassName("a","treeSelectedItem",_104);
for(var i=0;i<_105.length;i++){
dojo.html.removeClass(_105[i],"treeSelectedItem");
}
},unselectAllNodes:function(){
var _107=getElement("myWidgetContainer");
var _108=getElementsByTagAndClassName("span","dojoTreeNodeLabelSelected",_107);
for(var i=0;i<_108.length;i++){
dojo.html.removeClass(_108[i],"dojoTreeNodeLabelSelected");
}
}};
function FieldTable(){
this.hideRating=false;
this.data=[];
this.buildTable=function(_10a){
var list=dojo.widget.createWidget("FilteringTable",{widgetId:"expertFieldsTable",headClass:"fixedHeader",tbodyClass:"scrollContent",enableMultipleSelect:"false"},dojo.byId("myExpertiseFields"));
ftable.fillDataFromJson(_10a);
ftable.populateData();
};
this.replacePlaceHolder=function(_10c){
var _10d=getElement("scrolllist");
var _10e=getElement("myExpertiseFields");
_10d.replaceChild(_10c.domNode,_10e);
};
this.addEntry=function(_10f,_110,_111){
var w=dojo.widget.byId("expertFieldsTable");
var _113=this.getListCell(_110,w);
if(_113!=null){
setRatingHTML(_113,_111);
var bars=getElementsByTagAndClassName("DIV",null,_113);
markBars(bars,_111);
return;
}
TreeBuilder.markListSelected(_110);
fullTitle=ftable.getFullPath(_110);
_10f=fullTitle;
if(_10f.length>33){
_10f=_10f.substr(_10f.length-33,33);
_10f="..."+_10f;
}
var _115;
var _116=w.domNode.getElementsByTagName("tbody");
if(_116.length>0){
_115=w.domNode.getElementsByTagName("tbody")[0];
}else{
_115=document.createElement("tbody");
_115.setAttribute("class","scrollContent");
w.domNode.appendChild(_115);
}
var row=document.createElement("tr");
dojo.event.connect(row,"onclick","expRowSelected");
var cell=document.createElement("td");
cell.setAttribute("align","left");
cell.title=fullTitle;
cell.innerHTML="<a title=\""+fullTitle+"\">"+_10f+"</a>";
var _119=getElement("ratingBar");
cell.innerHTML+=_119.innerHTML;
row.appendChild(cell);
_115.appendChild(row);
var bars=getElementsByTagAndClassName("DIV",null,_115.lastChild);
if(ftable.hideRating){
for(var i=0;i<5;i++){
bars[i].style.display="None";
}
var lbl=getElementsByTagAndClassName("span","ratingBarTitle",_115.lastChild);
lbl[0].style.display="None";
}
markBars(bars,_111);
var td=bars[1].parentNode.parentNode;
td.setAttribute("nodeid",_110);
setRatingHTML(td,_111);
};
this.getListCell=function(_11d,list){
if(list.domNode.tBodies.length<1){
return null;
}
var rows=list.domNode.tBodies[0].rows;
for(var i=0;i<rows.length;i++){
if(_11d==rows[i].cells[0].getAttribute("nodeid")){
return rows[i].cells[0];
}
}
return null;
};
this.getDataIndex=function(_121){
for(var i=0;i<ftable.data.length;i++){
if(ftable.data[i].id==_121){
return i;
}
}
return -1;
};
this.removeRating=function(evt){
var _124=(evt.target)?evt.target:evt.srcElement;
var row=_124.parentNode.parentNode;
var _126=_124.parentNode.getAttribute("nodeid");
row.parentNode.removeChild(row);
ftable.data.splice(ftable.getDataIndex(_126),1);
TreeBuilder.markListUnselected(_126);
};
this.updateExpertise=function(_127,_128){
var idx=ftable.getDataIndex(_127);
if(idx<0){
return false;
}
ftable.data[idx].exp=_128;
return true;
};
this.populateData=function(){
for(var i=0;i<ftable.data.length;i++){
var _12b=ftable.data[i];
ftable.addEntry(_12b.label,_12b.id,_12b.exp);
}
};
this.setData=function(_12c){
ftable.data=_12c;
};
this.fillDataFromJson=function(_12d){
if(_12d&&(!_12d.status||_12d.status!="No expertise")){
ftable.data=_12d.rows;
}
};
this.setListHeader=function(text){
var _12f=getElement("expertFields");
var _130=getElementsByTagAndClassName(null,"tablehead",_12f)[0];
_130.innerHTML=text;
};
this.getFullPath=function(_131){
for(var i=0;i<ftable.data.length;i++){
if(ftable.data[i].id==_131&&ftable.data[i].fullpath){
return ftable.data[i].fullpath;
}
}
infos=dojo.widget.byId(_131+"").objectId;
fullTitle=infos[infos.length-1];
return fullTitle;
};
this.getBranch=function(_133){
for(var i=0;i<ftable.data.length;i++){
if(ftable.data[i].id==_133&&ftable.data[i].branch){
return ftable.data[i].branch;
}
}
infos=dojo.widget.byId(_133+"").objectId;
branch=infos.slice(0,-1);
return branch;
};
}
function initProfile(cats,_136){
if(!_136){
_136=cats;
cats=null;
}else{
newar=[];
for(var j=0;j<cats.length;j++){
newar.push(cats[j]);
}
cats=newar;
}
var _138=dojo.widget.manager.getWidgetById("myTreeWidget");
if(_138){
TreeBuilder.loadTree();
initFieldsTable(cats);
}else{
var url=tgurl+"/profile/getNode";
var d=loadJSONDoc(url,{"nocache":(new Date()).getTime()});
d.addCallback(TreeBuilder.loadNodes);
d.addCallback(TreeBuilder.buildTree);
d.addCallback(function(){
var _13b=dojo.widget.createWidget("TreeRPCController",{widgetId:"treeController",RPCUrl:url});
_13b.onTreeClick=function(_13c){
var node=_13c.source;
if(node.isExpanded){
this.expand(node);
}else{
this.collapse(node);
}
setTimeout("markChildren("+node.widgetId+")",400);
};
var _13e=document.getElementById("myWidgetContainer");
_13e.appendChild(_13b.domNode);
_13b.listenTree(dojo.widget.manager.getWidgetById("myTreeWidget"));
});
d.addCallback(initFieldsTable,cats);
}
}
function initFieldsTable(cats,_140){
var list=dojo.widget.byId("expertFieldsTable");
if(cats){
ftable.setData(cats);
}
if(list){
if(cats){
MochiKit.DOM.replaceChildNodes(list.domNode);
ftable.populateData();
ftable.replacePlaceHolder(list);
}else{
var d=callManager.doRequest("profile","getExpertise",null,null);
if(d){
d.addCallback(function(res){
ftable.fillDataFromJson(res);
MochiKit.DOM.replaceChildNodes(list.domNode);
ftable.populateData();
ftable.replacePlaceHolder(list);
});
}
}
}else{
if(cats){
ftable.buildTable();
}else{
var d=callManager.doRequest("profile","getExpertise",null,null);
d.addCallback(ftable.buildTable);
}
}
}
var inith=-1;
var branch2Expand;
function markChildren(_144){
var node=dojo.widget.byId(_144+"");
for(var j=0;j<node.children.length;j++){
var _147=node.children[j];
if(ftable.getDataIndex(_147.widgetId)>-1){
TreeBuilder.markListSelected(_147.widgetId);
}
}
}
function expandTree(idx){
var _149=branch2Expand;
node=dojo.widget.byId(_149[(+idx)]+"");
if(node&&node.lockLevel<1){
markChildren(node.parent.widgetId+"");
if(node.isFolder){
dojo.widget.byId("treeController").expandToLevel(node,1);
}
if(idx>0){
window.setTimeout("expandTree("+(idx-1)+")",200);
}else{
window.setTimeout("scrollToNode("+node.widgetId+")",200);
}
}else{
window.setTimeout("expandTree("+(idx)+")",200);
}
}
function scrollToNode(_14a){
var node=dojo.widget.byId(_14a+"");
if(node.lockLevel>0){
window.setTimeout("scrollToNode("+_14a+")",200);
return;
}
var _14c=getElement("myWidgetContainer");
_14c=MochiKit.DOM.getFirstElementByTagAndClassName("div","dojoTree",_14c);
if(BrowserDetector.browser=="Explorer"){
if(inith<0){
inith=_14c.scrollHeight;
}
}else{
inith=_14c.scrollHeight;
}
inith=_14c.scrollHeight;
posCont=MochiKit.Style.getElementPosition(_14c);
posNode=MochiKit.Style.getElementPosition(node.domNode);
pny=posNode.y;
if(BrowserDetector.browser=="Explorer"){
pny=posNode.y+_14c.scrollTop;
}
posYRel=pny+_14c.scrollTop-posCont.y;
_14c.scrollTop=posYRel-70;
TreeBuilder.unselectAllNodes();
node.markSelected();
}
function expRowSelected(evt){
var _14e;
if(evt.target){
_14e=evt.target;
}else{
_14e=evt.srcElement;
}
if(_14e.nodeName=="TR"){
_14e=_14e.childNodes[0];
}
while(_14e.nodeName!="TD"){
_14e=_14e.parentNode;
}
var _14f=_14e.getAttribute("nodeid");
var _150=ftable.getBranch(_14f);
branch2Expand=_150;
window.setTimeout("expandTree("+(_150.length-1)+")",200);
return;
}
function nodeSelected(){
var _151=dojo.widget.manager.getWidgetById("myTreeSelector");
var node=_151.selectedNode;
if(ftable.hideRating){
var _153=node.title.replace(/<.*?>/,"").replace(/<.*?>/,"");
var _154=0;
if(!ftable.updateExpertise(node.widgetId,_154)){
ftable.data.push({id:node.widgetId,exp:_154,label:_153});
}
ftable.addEntry(_153,node.widgetId,_154);
var _155=getElement("scrolllist");
_155.scrollTop=_155.scrollHeight;
return;
}
popupRateShow();
var lbl=getElement("ratepopuplabel");
lbl.innerHTML="<b>"+node.title+"</b>";
var bar=getElement("popupRatingBar");
var idx=ftable.getDataIndex(node.widgetId);
var _159=0;
if(idx>-1){
_159=ftable.data[idx].exp;
}
markBars(getElementsByTagAndClassName("DIV",null,bar),_159);
setRatingHTML(bar,_159);
var inp1=getElement("ratePopupTitle");
inp1.value=node.title.replace(/<.*?>/,"").replace(/<.*?>/,"");
var inp2=getElement("ratePopupObjectId");
inp2.value=node.widgetId;
}
function nodeClicked(evt){
TreeBuilder.unselectAllNodes();
if(evt.pageX){
treeClickX=evt.pageX;
treeClickY=evt.pageY;
}else{
treeClickX=evt.clientX;
treeClickY=evt.clientY;
}
}
function popupRateShow(){
var md=new dojo.widget.Dialog();
md.followScroll=false;
md.showModalDialog();
var _15e=getElement("ratePopup");
dojo.html.placeOnScreen(_15e,treeClickX,treeClickY);
MochiKit.Visual.appear(_15e,{duration:0.1});
}
function popupRateOk(){
var _15f=getElement("popupRatingBar");
var _160=getRatingHTML(_15f);
var inp2=getElement("ratePopupObjectId");
var nid=inp2.value;
var _163=ftable.getFullPath(nid);
if(!ftable.updateExpertise(nid,_160)){
ftable.data.push({id:nid,exp:_160,label:_163,fullpath:_163,branch:ftable.getBranch(nid)});
}
ftable.addEntry(_163,nid,_160);
var _164=getElement("scrolllist");
_164.scrollTop=_164.scrollHeight;
popupRateCancel();
}
function popupRateCancel(){
var _165=getElement("ratePopup");
MochiKit.Visual.fade(_165,{duration:0.1});
var md=new dojo.widget.Dialog();
if(md.shared.bg!=null){
md.hideModalDialog();
}
}
function highlightBar(evt,no){
var _169=(evt.target)?evt.target:evt.srcElement;
var bars=getElementsByTagAndClassName("DIV",null,_169.parentNode.parentNode);
for(i=1;i<6;i++){
var bar=bars[i-1];
if(i==no){
bar.style.borderColor="gray";
}else{
bar.style.borderColor="#000";
}
}
}
function delightBar(evt,no){
var _16e=(evt.target)?evt.target:evt.srcElement;
_16e.style.borderColor="#000";
}
function rate(evt,no){
var _171=(evt.target)?evt.target:evt.srcElement;
var cell=_171.parentNode.parentNode;
setRatingHTML(cell,no);
ftable.updateExpertise(cell.getAttribute("nodeid"),no);
var bars=getElementsByTagAndClassName("DIV",null,cell);
markBars(bars,no);
}
function ratePopup(evt,no){
var _176=(evt.target)?evt.target:evt.srcElement;
var cell=_176.parentNode.parentNode;
setRatingHTML(cell,no);
var bars=getElementsByTagAndClassName("DIV",null,cell);
markBars(bars,no);
}
function markBars(bars,no){
if(no==0){
var _17b=getElementsByTagAndClassName("span",null,bars[0].parentNode.parentNode)[0];
_17b.innerHTML="";
}
for(i=1;i<6;i++){
var bar=bars[i-1];
if(i>no){
bar.style.backgroundColor="#ffffff";
}else{
if(i==no){
var _17b=getElementsByTagAndClassName("span",null,bar.parentNode.parentNode)[0];
var _17d=bar.parentNode.title;
_17b.innerHTML=_17d;
}
switch(i){
case 1:
bar.style.backgroundColor="#8cbfd8";
break;
case 2:
bar.style.backgroundColor="#8cbfd8";
break;
case 3:
bar.style.backgroundColor="#8cbfd8";
break;
case 4:
bar.style.backgroundColor="#8cbfd8";
break;
case 5:
bar.style.backgroundColor="#8cbfd8";
break;
}
}
}
}
function setRatingHTML(td,_17f){
var inp=getElementsByTagAndClassName("input",null,td);
inp[0].value=_17f;
}
function getRatingHTML(td){
var inp=getElementsByTagAndClassName("input",null,td);
return inp[0].value;
}
function profile_showDialog(){
var _183=dojo.widget.byId("Dialog_profile");
_183.show();
}
function profile_closeDialog(){
var _184=dojo.widget.byId("Dialog_profile");
_184.hide();
}
function submitEntries(){
var url=tgurl+"/profile/setExpertise?nocache="+(new Date()).getTime()+"&";
var qs=entries2QueryString();
url+=qs;
var d=loadJSONDoc(url,{});
if(d){
d.addCallback(function(){
preferences.showTempDialog("Your profile has been saved.");
});
}
}
function entries2QueryString(){
var qs="";
for(var i=0;i<ftable.data.length;i++){
if(ftable.data[i].exp>0){
qs+=ftable.data[i].id+"="+ftable.data[i].exp+"&";
}
}
return qs.substr(0,qs.length-1);
}
function entries2AssArray(){
var _18a={};
for(var i=0;i<ftable.data.length;i++){
if(ftable.data[i].exp>0){
_18a[ftable.data[i].id]=ftable.data[i].exp;
}
}
return _18a;
}
function settingEntry_save(){
var _18c=getElement("anonymous_check").checked;
var _18d=getElement("email_check").checked;
var _18e=getElement("newsletter_check").checked;
var _18f=MochiKit.DOM.getElement("preferencesSettings_Button");
utils.dom.disableButton(_18f);
d=callManager.doRequest("profile","update_setting",null,{"anonymous":_18c,"email":_18d,"newsletter":_18e,"nocache":(new Date()).getTime()});
if(d){
d.addCallback(function(_190){
preferences.showTempDialog("Your setting has been saved.");
setStatus("Saved new settings.");
utils.dom.enableButton(_18f);
});
}
}
var doValidate=true;
var formEntries={};
var except=false;
var websites=[];
var messages=["*","*","*","*","*"];
var strKeywords="";
var conditionsAgreed=false;
var waitForCrawl=false;
var registration={selectMenuitem:function(_191,_192){
var _193=MochiKit.DOM.getElementsByTagAndClassName("li",null,MochiKit.DOM.getElement("leftMenu"));
for(var i=0;i<_193.length;i++){
if(i==_191-1){
_193[i].style.backgroundColor="white";
}else{
_193[i].style.backgroundColor="";
}
}
return _192;
}};
function personal2docs(){
var _195=getElement("ckbConditions");
if(!_195.checked){
preferences.showTempDialog("You have to agree to the terms and conditions in order to continue!");
return;
}
savePersonalForm();
var qs=form2Querystring();
var url=tgurl+"/registration/validateForm?nochache=";
var d=MochiKit.Async.loadJSONDoc(url+(new Date()).getTime()+"&"+qs);
d.addCallback(displayValidation);
}
function docs2personal(){
var elem=getElement("txtKeywords");
if(elem){
strKeywords=elem.value;
}
var d=setContent("register_new","");
if(d==null){
return;
}
d.addCallback(fillPersonalForm);
}
function docs2profile(){
var _19b=true;
var btn=getElement("btnNext");
btn.disabled=true;
var _19d=getElement("txtKeywords");
var _19e=[];
var _19f=getElement("regLoadDocsForm");
for(var i=0;i<_19f.elements.length;i++){
_19e.push(_19f.elements[i].value);
}
var args={keywords:_19d.value,websites:_19e,nocache:(new Date()).getTime()};
displayLoadingScreen("content");
registration_loadProfile(args,0);
strKeywords=_19d.value;
}
function registration_loadProfile(args,_1a3){
if(!_1a3){
_1a3=0;
}
var d=callManager.doRequest("profile","loadDocs","",args);
if(d){
d.addCallback(function(res){
if(!res.finished&&_1a3<5){
args.nocache=(new Date()).getTime();
callLater(5,registration_loadProfile,args,_1a3+1);
return false;
}else{
return true;
}
});
d.addCallback(function(_1a6){
if(!_1a6){
return;
}
var d1=callManager.doRequest("profile","extractNodes",null,args);
if(d1){
d1.addCallback(function(res){
for(x in res.status){
for(var j=0;j<websites.length;j++){
if(websites[j]==x){
if(res.status[x]==""){
messages[j]="download time exceeded";
}else{
messages[j]=res.status[x];
}
}
}
}
var d2=setContent("regProfile","",{showHeaderReg:true,cats:res.rows});
if(d2){
d2.addCallback(function(_1ab){
sitesValid=true;
problemsWith="";
for(var i=0;i<websites.length;i++){
if(messages[i]!="ok"&&messages[i]!="*"&&messages[i]!=""){
sitesValid=false;
problemsWith+=(i+1)+",";
}
}
var ph=getElement("regWebsiteStatus");
if(sitesValid){
ph.innerHTML="";
}else{
problemsWith=problemsWith.substring(0,problemsWith.length-1);
var ws="website ";
if(problemsWith.length>1){
ws="websites ";
}
var msg="Processing "+ws;
msg+=problemsWith;
msg+=" failed. Go back to previous page for more information.";
ph.innerHTML=msg;
}
});
}
return res;
});
}
});
}
}
function profile2docs(){
var d=setContent("register_load_docs","");
if(d){
d.addCallback(populateDocFields);
d.addCallback(displayStatus);
}
}
function sendSites(no){
websites=[];
var _1b2=getElement("regLoadDocsForm");
for(var i=0;i<_1b2.elements.length;i++){
websites.push(_1b2.elements[i].value);
}
var args={websites:websites,nocache:(new Date()).getTime()};
waitForCrawl=true;
var d=callManager.doRequest("profile","loadDocs","",args);
if(d){
d.addCallback(siteFeedback);
}
}
function siteFeedback(_1b6){
messages=_1b6.status;
waitForCrawl=false;
displayStatus();
return _1b6;
}
function displayStatus(){
for(var i=0;i<messages.length;i++){
var td=getElement("message_website_"+(i+1));
var inp=getElement("form_website_"+(i+1));
if(messages[i]=="ok"){
td.innerHTML="*";
if(inp.value!=""){
td.innerHTML="ok";
}
}else{
if(messages[i]==""){
td.innerHTML="*";
}else{
td.innerHTML=messages[i];
}
}
}
}
function submitRegistration(){
var _1ba=entries2AssArray();
for(fname in formEntries){
_1ba[fname]=formEntries[fname];
}
var d=setContent("register_create","",_1ba);
if(d){
except=true;
d.addCallback(fillPersonalForm);
}
}
function switchButtons(_1bc){
var _1bd=getElement("btnSubmitProfile");
_1bd.style.display="None";
var _1bd=getElement("btnSubmitRegistration");
_1bd.style.display="block";
var _1bd=getElement("btnRegistrationBack");
_1bd.style.display="block";
return _1bc;
}
function savePersonalForm(){
myForm=getElement("regPersonalForm");
for(i=0;i<myForm.elements.length;i++){
formEntries[myForm.elements[i].name]=myForm.elements[i].value;
}
var _1be=getElement("ckbConditions");
conditionsAgreed=_1be.checked;
}
function fillPersonalForm(_1bf){
myForm=getElement("regPersonalForm");
if(myForm){
for(fname in formEntries){
if(fname!=""){
myForm.elements[fname].value=formEntries[fname];
}
}
}
var _1c0=getElement("regError");
if(except){
_1c0.style.display="inline";
}else{
_1c0.style.display="None";
}
except=false;
var _1c1=getElement("ckbConditions");
_1c1.checked=conditionsAgreed;
return _1bf;
}
function displayValidation(_1c2){
if(_1c2.fields&&doValidate){
fillPersonalForm(_1c2);
var _1c3=getElement("regPersonalForm");
var _1c4=getElementsByTagAndClassName("span","fieldhelp",_1c3);
var _1c5=getElementsByTagAndClassName("input",null,_1c3);
for(xl in _1c4){
_1c4[xl].innerHTML="";
_1c4[xl].style.color="#000";
}
for(xf in _1c2.fields){
var _1c6=getElement("form_"+_1c2.fields[xf]);
var _1c7=getElementsByTagAndClassName("span","fieldhelp",_1c6.parentNode.parentNode)[0];
_1c7.innerHTML=_1c2.msgs[xf];
_1c7.style.color="red";
}
}else{
var _1c8=new ApplicationState("","","",docs2personal);
historyManager.addState(_1c8);
var d=setContent("register_load_docs","");
if(d){
d.addCallback(populateDocFields);
}
}
return _1c2;
}
function form2Querystring(){
var nv=MochiKit.DOM.formContents("regPersonalForm");
var qs=MochiKit.Base.queryString(nv[0],nv[1]);
return qs;
}
function populateDocFields(_1cc){
myForm=getElement("regLoadDocsForm");
if(myForm){
for(var i=0;i<websites.length;i++){
var _1ce=getElement("form_website_"+(i+1));
_1ce.value=websites[i];
}
}
getElement("txtKeywords").value=strKeywords;
return _1cc;
}
var lastCategories=[];
var search_questionVal;
var search_subjectVal;
var search_keywordsVal;
var search_categoriesVal;
var search_catIDs=[];
var search_userlist;
var waitSearchLastState="";
var search_isDirect=false;
var search_catStruct=[];
var tagCloudElemInnerHTML=null;
function loadWaitBoxContent(_1cf){
if(_1cf==null){
_1cf=-1;
}
setContent("waitSearch",_1cf);
}
function search_doQuery(_1d0){
search_questionVal=null;
search_subjectVal=null;
search_keywordsVal=null;
search_categoriesVal=null;
search_catIDs=[];
var _1d1=getElement("searchcontent_question").value;
var _1d2=getElement("searchcontent_topic").value;
if(lastCategories.length==0||_1d2.length+_1d1.length<10){
searchExpert_showDialog();
return;
}
var _1d3=MochiKit.DOM.getElement("searchcontent_findButton");
_1d3.disabled=true;
var d=callManager.doRequest("search","doQuery",null,{"query":_1d1,"topic":_1d2,"categories_set":lastCategories,"query_id":_1d0},[function(_1d5){
current_query_id=_1d5.query_id;
loadWaitBoxContent(_1d5.query_id);
refreshBoxes(0);
setStatus("Your question was forwarded to the experts");
return _1d5;
}]);
}
function search_setCategory(id){
var _1d7=MochiKit.DOM.getElement("searchcontent_categories");
for(var i=0;i<_1d7.options.length;i++){
if(_1d7.options[i].value==id){
_1d7.options.selectedIndex=i;
break;
}
}
}
function search_getKeywords(text){
var args={"text":text,"nocache":(new Date()).getTime()};
var d2=callManager.doRequest("search","getKeywords",null,args);
return d2;
}
function search_getClassification(_1dc,text){
var args={"topic":_1dc,"text":text,"nocache":(new Date()).getTime()};
var d=callManager.doRequest("search","getKeywordsAndCategories",null,args);
return d;
}
function search_autoCompleteTopic(txt){
var _1e1=txt.substr(0,50);
var _1e2=MochiKit.DOM.getElement("searchcontent_topic");
if(_1e2.getAttribute("lang")=="0"){
_1e2.value=_1e1;
}
}
function search_showDialog(){
var _1e3=dojo.widget.byId("Dialog_search");
_1e3.show();
}
function search_closeDialog(){
var _1e4=dojo.widget.byId("Dialog_search");
_1e4.hide();
}
function search_classifyQuery(){
search_isDirect=false;
search_hideHiddenDirect();
var _1e5=MochiKit.DOM.getElement("searchcontent_topic").value;
var _1e6=MochiKit.DOM.getElement("searchcontent_question").value;
if(_1e5.length+_1e6.length<10){
search_showDialog();
return;
}
search_saveAllValues();
var d=search_getClassification(_1e5,_1e6);
if(d==null){
return;
}
d.addCallback(function(_1e8){
var _1e9=MochiKit.DOM.getElement("searchcontent_keywords");
_1e9.value=_1e8.keywords;
search_setCategories(_1e8.rows,_1e8.html);
MochiKit.DOM.getElement("searchcontent_question").rows=2;
getElement("btnContentClassify").innerHTML="Re-classify";
search_displayHidden();
});
}
function search_showUserSelection(){
search_hideHidden();
search_isDirect=true;
var _1ea=getElement("btnShowUsers");
var _1eb=MochiKit.DOM.getElement("searchcontent_topic").value;
var _1ec=MochiKit.DOM.getElement("searchcontent_question").value;
if(_1eb.length+_1ec.length<1){
search_showDialog();
return;
}
search_saveAllValues();
MochiKit.DOM.getElement("searchcontent_question").rows=2;
search_displayHiddenDirect();
var d=callManager.doRequest("search","getUsers","");
if(d){
d.addCallback(function(_1ee){
getElement("btnContentClassify").innerHTML="Search Expert";
list=getElement("lstUsers");
search_userlist=_1ee.users;
list.options.length=0;
var cbox=getElement("showOnlineOnly");
for(var i=0;i<search_userlist.length;i++){
if(cbox.checked&&!search_userlist[i]["isonline"]){
continue;
}
var opt=new Option();
opt.value=search_userlist[i]["uid"];
opt.text=search_userlist[i]["name"];
list.options.add(opt);
}
list.selectedIndex=0;
if(list.options.length==0){
utils.dom.disableButton("btnDirectChat");
}else{
utils.dom.enableButton(getElement("btnDirectChat"));
}
search_lstUsersSelected();
return _1ee;
});
}
}
function search_lstUsersSelected(){
list=getElement("lstUsers");
var _1f2=getElement("usrName");
var _1f3=getElement("usrStatus");
if(list.options.length<1){
_1f2.innerHTML="&nbsp;";
_1f3.innerHTML="&nbsp;";
return;
}
var opt=list.options[list.selectedIndex];
var user;
for(var i=0;i<search_userlist.length;i++){
user=search_userlist[i];
if(user.uid==opt.value){
break;
}
}
var _1f7=user.isonline?"Online":"Offline";
_1f2.innerHTML=opt.text;
_1f3.innerHTML=_1f7;
}
function search_startDirectChat(_1f8){
search_questionVal=null;
search_subjectVal=null;
search_keywordsVal=null;
search_categoriesVal=null;
search_catIDs=[];
var _1f9=getElement("searchcontent_question").value;
var _1fa=getElement("searchcontent_topic").value;
if(_1fa.length+_1f9.length<1){
search_showDialog();
return;
}
if(_1f9.length<1){
_1f9=_1fa;
}
if(_1fa.length<1){
_1fa=_1f9;
}
utils.dom.disableButton("btnDirectChat");
var list=getElement("lstUsers");
var _1fc=list.options[list.selectedIndex].value;
var d=callManager.doRequest("search","doDirectChat",null,{"query":_1f9,"topic":_1fa,"expertid":_1fc,"query_id":_1f8},[function(_1fe){
if(_1fe.failure){
setContent("search_expertFull","");
return;
}
current_query_id=_1fe.query_id;
loadWaitBoxContent(_1fe.query_id);
refreshBoxes(0);
setStatus("The selected user has been contacted.");
return _1fe;
}]);
}
function search_displayHidden(){
if(search_isDirect){
return;
}
var _1ff=MochiKit.DOM.getElementsByTagAndClassName(null,"searchRow",MochiKit.DOM.getElement("searchContent"));
for(var i=0;i<_1ff.length;i++){
dojo.html.removeClass(_1ff[i],"hidden");
}
}
function search_hideHidden(){
var _201=MochiKit.DOM.getElementsByTagAndClassName(null,"searchRow",MochiKit.DOM.getElement("searchContent"));
for(var i=0;i<_201.length;i++){
dojo.html.addClass(_201[i],"hidden");
}
}
function search_displayHiddenDirect(){
if(!search_isDirect){
return;
}
var _203=MochiKit.DOM.getElementsByTagAndClassName(null,"selectRow",MochiKit.DOM.getElement("searchContent"));
for(var i=0;i<_203.length;i++){
dojo.html.removeClass(_203[i],"hidden");
}
document.getElementsByTagName("select")[0].style.visibility="visible";
}
function search_hideHiddenDirect(){
var _205=MochiKit.DOM.getElementsByTagAndClassName(null,"selectRow",MochiKit.DOM.getElement("searchContent"));
for(var i=0;i<_205.length;i++){
dojo.html.addClass(_205[i],"hidden");
}
document.getElementsByTagName("select")[0].style.visibility="hidden";
}
function search_setCategories(cats,html){
search_catStruct=cats;
lastCategories=[];
var _209="";
if(html!=null){
for(var i=0;i<search_catStruct.length;i++){
if(!search_catStruct[i].distance){
search_catStruct[i].distance=0;
}
lastCategories[lastCategories.length]=search_catStruct[i].id;
}
var _20b=MochiKit.DOM.getElement("searchcontent_categories");
_20b.style.display="";
_20b.innerHTML=html;
}else{
for(var i=0;i<search_catStruct.length;i++){
if(!search_catStruct[i].distance){
search_catStruct[i].distance=0;
}
_209+=search_catStruct[i].label+"&nbsp;&nbsp;"+"\t";
lastCategories[lastCategories.length]=search_catStruct[i].id;
}
if(_209.length>2){
_209=_209.substr(0,_209.length-2);
}
var _20b=MochiKit.DOM.getElement("searchcontent_categories");
_20b.style.display="";
_20b.innerHTML=_209;
}
tagCloudElemInnerHTML=_20b.innerHTML;
}
function doDecline(_20c){
var d=callManager.doRequest("search","doDecline",_20c,null);
if(d==null){
return;
}
d.addCallback(function dummy(_20e){
unselectQuery(true);
setContent("search");
refreshBoxes(0);
return _20e;
});
setStatus("Question declined.");
}
function search_refresh(_20f){
if(_20f%11==0){
var _210=MochiKit.DOM.getElement("waitSearchContent");
if(_210==null){
var _211=MochiKit.DOM.getElement("queryOverviewContent");
var _212=MochiKit.DOM.getElement("queryoverview_query_id");
if(_211!=null&&_212!=null){
var d=callManager.doRequest("search","getQueryStatus",_212.value,null);
if(d==null){
return;
}
d.addCallback(function dummy(_214){
if(_214.taken){
if(MochiKit.DOM.getElement("queryoverview_taken")==null){
setContent2("query_overview",current_query_id);
}
}
});
}
}else{
var _215=MochiKit.DOM.getElement("waitsearch_doPolling");
if(_215.value=="False"){
return;
}
var d=callManager.doRequest("search","getExpertsStatus",current_query_id,null);
if(d==null){
return;
}
d.addCallback(function dummy(_216){
search_updateExperts(_216);
return _216;
});
}
}
}
function search_clear(){
MochiKit.DOM.getElement("searchcontent_question").value="";
MochiKit.DOM.getElement("searchcontent_topic").value="";
search_hideHidden();
MochiKit.DOM.getElement("btnContentClassify").innerHTML="Search Expert";
MochiKit.DOM.getElement("searchcontent_question").focus();
}
function search_updateExperts(_217){
if(_217.finished){
setContent2("waitSearch",current_query_id);
return;
}
if(waitSearchLastState==""){
}
var _218=_217.experts_accepted;
var _219=_217.experts_declined;
var _21a="";
var _21b="";
for(var i=0;i<_218.length;i++){
_21b+=_218[i]+",";
}
for(var i=0;i<_219.length;i++){
_21a+=_219[i]+",";
}
MochiKit.DOM.replaceChildNodes(MochiKit.DOM.getElement("waitsearch_experts_declined"),document.createTextNode(_21a));
MochiKit.DOM.replaceChildNodes(MochiKit.DOM.getElement("waitsearch_experts_accepted"),document.createTextNode(_21b));
if(waitSearchLastState!=_217.state){
setContent2("waitSearch",current_query_id);
}
waitSearchLastState=_217.state;
}
function search_deleteQuery(_21d){
d=callManager.doRequest("search","deleteQuery",_21d,null);
unselectQuery(true);
if(d){
d.addCallback(function(_21e){
setStatus("The question has been deleted...");
setContent("search","");
refreshBoxes(0);
});
}
}
function search_saveAllValues(){
search_questionVal=getElement("searchcontent_question").value;
search_subjectVal=getElement("searchcontent_topic").value;
search_keywordsVal=getElement("searchcontent_keywords").value;
search_categoriesVal=getElement("searchcontent_categories").value;
search_catIDs=[];
for(var i=0;i<search_catStruct.length;i++){
search_catIDs.push(search_catStruct[i]);
}
}
function search_restoreAllValues(){
var _220=false;
if(search_questionVal){
_220=true;
var _221=getElement("searchcontent_question");
_221.value=search_questionVal;
getElement("searchcontent_topic").value=search_subjectVal;
getElement("searchcontent_keywords").value=search_keywordsVal;
search_setCategories(search_catStruct);
}
if(_220){
if(search_isDirect){
search_displayHiddenDirect();
search_showUserSelection();
}else{
search_displayHidden();
getElement("btnContentClassify").innerHTML="Re-classify";
}
}
_221.rows=2;
}
function search_classifyManually(){
search_saveAllValues();
setContent("profileSearch",null,{showHeaderSearch:true},true);
}
function search_classifyManuallyAbort(){
var d=search_classifyCloseProfile();
if(d){
var html=tagCloudElemInnerHTML+"";
d.addCallback(function(res){
search_setCategories(search_catStruct,html);
return res;
});
}
return d;
}
function search_classifyCloseProfile(){
search_catStruct=[];
for(var j=0;j<search_catIDs.length;j++){
search_catStruct.push(search_catIDs[j]);
}
var d=setContent("search");
return d;
}
function search_classifyManuallyAccept(){
for(var i=0;i<search_catStruct.length;i++){
var _228=true;
for(var j=0;j<search_catIDs.length;j++){
if(search_catStruct[i].id==search_catIDs[j].id){
_228=false;
}
}
if(_228){
search_catIDs.push(search_catStruct[i]);
}
}
var _22a=[];
for(var i=0;i<ftable.data.length;i++){
var _22b={};
_22b.id=ftable.data[i].id;
_22b.label=ftable.data[i].label;
_22b.fullpath=ftable.getFullPath(_22b.id);
_22b.branch=ftable.getBranch(_22b.id);
_22a.push(_22b);
}
var d=search_classifyCloseProfile();
if(d){
d.addCallback(function(res){
search_setCategories(_22a);
return res;
});
}
}
function searchExpert_showDialog(){
var _22e=dojo.widget.byId("Dialog_searchExpert");
_22e.show();
}
function searchExpert_closeDialog(){
var _22f=dojo.widget.byId("Dialog_searchExpert");
_22f.hide();
}
dojo.registerModulePath("mk",tgurl+"/static/javascript/libs/MochiKit");
dojo.require("MochiKit.MochiKit");
dojo.hostenv.writeIncludes();
var addLoadEvent=MochiKit.DOM.addLoadEvent;
var getElement=MochiKit.DOM.getElement;
var hideElement=MochiKit.Style.hideElement;
var appear=MochiKit.Style.appear;
var callLater=MochiKit.Async.callLater;
var doSimpleXMLHttpRequest=MochiKit.Async.doSimpleXMLHttpRequest;
var loadJSONDoc=MochiKit.Async.loadJSONDoc;
var appear=MochiKit.Visual.appear;
var toggle=MochiKit.Visual.toggle;
var getElementsByTagAndClassName=MochiKit.DOM.getElementsByTagAndClassName;
ApplicationState=function(type,args,_232,_233){
this.type=type;
this.args=args?args:null;
this.kwargs=_232?_232:null;
this.changeUrl=true;
this.loadFunction=_233;
this.valid=true;
};
ApplicationState.prototype.back=function(){
if(this.valid){
this.loadFunction(this.type,this.args,this.kwargs);
}
};
ApplicationState.prototype.forward=function(){
if(this.valid){
this.loadFunction(this.type,this.args,this.kwargs);
}
};
ApplicationState.prototype.setInvalid=function(){
this.valid=false;
};
BrowserAdaptor={adapt:function(){
if(BrowserDetector.isIElt7()){
var _234=MochiKit.DOM.getElementsByTagAndClassName(null,"box",document);
for(var i=0;i<_234.length;i++){
_234[i].style.overflow="hidden";
}
}
}};
var BrowserDetector={init:function(){
this.browser=this.searchString(this.dataBrowser)||"An unknown browser";
this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";
this.OS=this.searchString(this.dataOS)||"an unknown OS";
},searchString:function(data){
for(var i=0;i<data.length;i++){
var _238=data[i].string;
var _239=data[i].prop;
this.versionSearchString=data[i].versionSearch||data[i].identity;
if(_238){
if(_238.indexOf(data[i].subString)!=-1){
return data[i].identity;
}
}else{
if(_239){
return data[i].identity;
}
}
}
},searchVersion:function(_23a){
var _23b=_23a.indexOf(this.versionSearchString);
if(_23b==-1){
return;
}
return parseFloat(_23a.substring(_23b+this.versionSearchString.length+1));
},dataBrowser:[{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari"},{prop:window.opera,identity:"Opera"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.platform,subString:"Linux",identity:"Linux"}],isIElt7:function(){
return this.browser=="Explorer"&&this.version<7;
}};
BrowserDetector.init();
var callManager={timeout:20,disconnectedDelay:300000,requests:[],lastResponseArrivalTime:new Date().getTime(),call_data:[{id:"1",type:"chat",sub_type:"getEntries",url:"/content/chat/getAllEntries/",format:"json"},{id:"2",type:"chat",sub_type:"send",url:"/content/chat/send/",format:"json"},{id:"3",type:"chat",sub_type:"finish",url:"/content/chat/finish/",format:"json"},{id:"4",type:"chat",sub_type:"rate",url:"/content/chat/rate/",format:"json"},{id:"11",type:"box",sub_type:"io",url:"/boxes/getQueries",format:"json"},{id:"13",type:"box",sub_type:"statistics",url:"/boxes/getStatistics",format:"xmlhttp"},{id:"21",type:"content",sub_type:"search",url:"/content/search/getSearchContent",format:"xmlhttp"},{id:"22",type:"content",sub_type:"waitSearch",url:"/content/search/getWaitSearchContent/",format:"xmlhttp"},{id:"23",type:"content",sub_type:"blogs",url:"/content/blog/getBlogsContent/",format:"xmlhttp"},{id:"24",type:"content",sub_type:"blogentry",url:"/content/blog/getBlogEntryContent/",format:"xmlhttp"},{id:"25",type:"content",sub_type:"blog_content_edit",url:"/content/blog/getBlogEditContent/",format:"xmlhttp"},{id:"26",type:"content",sub_type:"profile",url:"/content/getProfileComponent",format:"xmlhttp"},{id:"27",type:"content",sub_type:"statistics",url:"/content/getStatisticsComponent",format:"xmlhttp"},{id:"28",type:"content",sub_type:"chat",url:"/content/chat/join/",format:"xmlhttp"},{id:"28",type:"content",sub_type:"allquestions",url:"/content/search/getAllOpenQuestionsContent/",format:"xmlhttp"},{id:"31",type:"content",sub_type:"query_overview",url:"/content/search/getQueryOverviewContent/",format:"xmlhttp"},{id:"32",type:"content",sub_type:"register_load_docs",url:"/registration/getRegisterLoadDocs",format:"xmlhttp"},{id:"33",type:"content",sub_type:"register_new",url:"/registration/new",format:"xmlhttp"},{id:"34",type:"content",sub_type:"regProfile",url:"/content/getProfileComponent",format:"xmlhttp"},{id:"35",type:"content",sub_type:"register_create",url:"/registration/create",format:"xmlhttp"},{id:"36",type:"content",sub_type:"register_lost_password",url:"/registration/lost_password",format:"xmlhttp"},{id:"37",type:"content",sub_type:"chat_overview",url:"/content/chat/getChatOverviewContent",format:"xmlhttp"},{id:"38",type:"content",sub_type:"feedback",url:"/content/feedback/getFeedbackContent/",format:"xmlhttp"},{id:"39",type:"content",sub_type:"preferences",url:"/content/getPreferencesComponent",format:"xmlhttp"},{id:"40",type:"content",sub_type:"preferencesSettings",url:"/profile/getSettingsContent",format:"xmlhttp"},{id:"41",type:"content",sub_type:"preferencesUpdateUser1",url:"/registration/update_user1",format:"xmlhttp"},{id:"411",type:"content",sub_type:"preferencesUpdateUser2",url:"/registration/update_user2",format:"xmlhttp"},{id:"42",type:"content",sub_type:"profileSearch",url:"/content/getProfileComponent",format:"xmlhttp"},{id:"43",type:"blog",sub_type:"do_BlogPost",url:"/content/blog/do_BlogPost",format:"json"},{id:"44",type:"profile",sub_type:"extractNodes",url:"/profile/extractNodes",format:"json"},{id:"45",type:"content",sub_type:"profileBlog",url:"/content/getProfileComponent",format:"xmlhttp"},{id:"46",type:"blog",sub_type:"updateBlogCategories",url:"/content/blog/updateBlogCategories",format:"json"},{id:"47",type:"profile",sub_type:"getNodesInfo",url:"/profile/getNodesInfo",format:"json"},{id:"48",type:"feedback",sub_type:"send2DB",url:"/content/feedback/sendFeedback2DB/",format:"xmlhttp"},{id:"49",type:"content",sub_type:"im_expertFull",url:"/content/im/directChatFull/",format:"xmlhttp"},{id:"50",type:"blog",sub_type:"deleteBlogEntry",url:"/content/blog/deleteBlogEntry/",format:"json"},{id:"51",type:"blog",sub_type:"doBlogRating",url:"/content/blog/doBlogRating/",format:"json"},{id:"52",type:"chat",sub_type:"rate",url:"/content/chat/rate/",format:"json"},{id:"53",type:"profile",sub_type:"getExpertise",url:"/profile/getExpertise/",format:"json"},{id:"54",type:"profile",sub_type:"loadDocs",url:"/profile/loadDocs/",format:"json"},{id:"101",type:"search",sub_type:"doQuery",url:"/content/search/doQuery",format:"json"},{id:"102",type:"search",sub_type:"doDecline",url:"/content/search/doDecline/",format:"json"},{id:"103",type:"search",sub_type:"getExpertsStatus",url:"/content/search/getExpertsStatus/",format:"json"},{id:"104",type:"search",sub_type:"getQueryStatus",url:"/content/search/getQueryStatus/",format:"json"},{id:"105",type:"feedback",sub_type:"send",url:"/content/feedback/sendFeedback/",format:"json"},{id:"106",type:"search",sub_type:"getKeywords",url:"/content/search/getKeywords/",format:"json"},{id:"107",type:"search",sub_type:"getKeywordsAndCategories",url:"/content/search/getKeywordsAndCategories/",format:"json"},{id:"108",type:"search",sub_type:"deleteQuery",url:"/content/search/deleteQuery/",format:"json"},{id:"109",type:"search",sub_type:"getUsers",url:"/content/search/getUsers/",format:"json"},{id:"110",type:"im",sub_type:"doDirectChat",url:"/content/im/doDirectChat",format:"json"},{id:"111",type:"content",sub_type:"im",url:"/content/im/getImContent/",format:"xmlhttp"},{id:"112",type:"im",sub_type:"getUsers",url:"/content/im/getUsers/",format:"xmlhttp"},{id:"113",type:"im",sub_type:"getUserDetails",url:"/statistics/getUserDetailsIM/",format:"xmlhttp"},{id:"114",type:"statistics",sub_type:"getUserDetails",url:"/statistics/getUserDetailsForTooltip/",format:"xmlhttp"},{id:"115",type:"statistics",sub_type:"getHighscoreList",url:"/statistics/getHighscoreList/",format:"xmlhttp"},{id:"116",type:"profile",sub_type:"update_setting",url:"/profile/update_setting",format:"json"}],init:function(){
},getData:function(type,_23d){
for(var i=0;i<this.call_data.length;i++){
var data=this.call_data[i];
if(data.type==type&&(data.sub_type==""||data.sub_type==_23d)){
return data;
}
}
alert("CallManager: no data for "+type+" "+_23d);
return null;
},doRequest:function(type,_241,_242,_243,_244){
var data=this.getData(type,_241);
var id=data.id;
if(type=="content"){
id="content";
}
var _247=this.requests[id];
if(_247!=null){
if(_247.fired==-1){
if(id=="content"){
_247.cancel();
}else{
return null;
}
}
}
var _248;
if(_242==null){
_242="";
}
var _249={};
if(_243!=null){
_249=_243;
}
_249["nocache"]=(new Date()).getTime();
var _24a=MochiKit.Base.queryString(_249);
urlprefix=tgurl;
if(urlprefix.charAt(tgurl.length-1)=="/"&&data.url.charAt(0)=="/"){
urlprefix=urlprefix.substring(0,urlprefix.length-1);
}
url=urlprefix+data.url;
if(_24a.length>999){
switch(data.format){
case "json":
d=this.doPostJSON(url+_242,_24a);
break;
case "xmlhttp":
d=this.doPostXML(url+_242,_24a);
break;
}
}else{
switch(data.format){
case "json":
d=MochiKit.Async.loadJSONDoc(url+_242,_249);
break;
case "xmlhttp":
d=doSimpleXMLHttpRequest(url+_242,_249);
break;
}
}
this.requests[id]=d;
if(d!=null){
d.addErrback(function(res){
var _24c=new Date().getTime();
if(_24c-callManager.lastResponseArrivalTime>callManager.disconnectedDelay){
pollingManager.stop();
var _24d=dojo.widget.byId("Dialog_Disconnected");
_24d.show();
}
return res;
});
var _24e=callLater(this.timeout,d.cancel);
d.addCallback(function(res){
_24e.cancel();
return res;
});
d.addCallback(function(res){
callManager.lastResponseArrivalTime=new Date().getTime();
return res;
});
if(_244!=null){
for(var i=0;i<_244.length;i++){
d.addCallback(_244[i]);
}
}
}
return d;
},doPostXML:function(url,args){
options={"method":"POST","sendContent":args,"headers":{"Content-Type":"application/x-www-form-urlencoded"}};
return MochiKit.Async.doXHR(url,options);
},doPostJSON:function(url,_255){
var mk=MochiKit.Async;
var req=mk.getXMLHttpRequest();
req.open("POST",url,true);
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
var d=mk.sendXMLHttpRequest(req,_255);
return d.addCallback(mk.evalJSONRequest);
}};
function HistoryManager(){
}
HistoryManager.prototype.addState=function(_259){
if(dojo.undo.browser.initialState==null){
dojo.undo.browser.setInitialState(_259);
}else{
dojo.undo.browser.addToHistory(_259);
}
};
HistoryManager.prototype.setLastContent=function(_25a){
var _25b=dojo.undo.browser.historyStack;
if(_25b.length<1){
alert("No state to go.");
return;
}
if(_25a){
var _25c=_25b[_25b.length-1];
var _25d=_25c.kwArgs["changeUrl"];
for(var i=0;i<_25b.length;i++){
if(_25b[i].kwArgs["changeUrl"]==_25d){
_25b[i].kwArgs["valid"]=false;
}
}
var _25f=dojo.undo.browser.forwardStack;
for(var i=0;i<_25f.length;i++){
if(_25f[i].kwArgs["changeUrl"]==_25d){
_25f[i].kwArgs["valid"]=false;
}
}
}
if(_25b.length==1){
var _260=dojo.undo.browser.initialState;
_260.kwArgs["back"]();
}else{
var _260=_25b[_25b.length-2];
_260.kwArgs["back"]();
}
};
function PollingManager(){
this.functions=[];
this.counter=0;
this.lastActivityTime=new Date().getTime();
this.minInterval=4;
this.maxInterval=1;
this.currentInterval=this.minInterval;
this.shouldPoll=true;
}
PollingManager.prototype.resetInterval=function(){
this.lastActivityTime=new Date().getTime();
this.currentInterval=this.minInterval;
};
PollingManager.prototype.getInterval=function(){
var _261=this.minInterval;
if(this.lastActivityTime>0){
_261=(new Date().getTime()-this.lastActivityTime)/1000;
}
_261=Math.max(Math.round(Math.pow(_261*0.05,0.5)),this.minInterval);
_261=Math.min(this.maxInterval,_261);
this.displayInterval(_261);
return _261;
};
PollingManager.prototype.callAll=function(){
var _262=this.counter%this.currentInterval==0;
for(var i=0;i<this.functions.length;i++){
if(this.maxInterval>1&&this.functions[i].maxInterval){
var _264=Math.min(this.functions[i].maxInterval,this.currentInterval);
if(this.counter%_264==0){
this.functions[i](this.counter/_264);
}
}else{
if(_262){
this.functions[i](this.counter/this.currentInterval);
}
}
}
};
PollingManager.prototype.addFunction=function(func){
this.functions.push(func);
};
PollingManager.prototype.run=function(){
this.update();
this.currentInterval=this.getInterval();
this.counter=this.counter+1;
if(pollingManager.shouldPoll){
callLater(1,polling_start);
}
};
function polling_start(){
pollingManager.run();
}
PollingManager.prototype.displayInterval=function(_266){
var elem=getElement("polling_interval");
if(elem){
elem.removeChild(elem.childNodes[0]);
elem.appendChild(document.createTextNode("Interval: "+_266+"s "+new Date().getTime()));
}
};
PollingManager.prototype.update=function(){
this.callAll();
};
PollingManager.prototype.rememberUserActivity=function(){
var time=new Date().getTime();
if(this.lastActivityTime+this.minInterval<time){
this.currentInterval=this.minInterval;
}
this.lastActivityTime=time;
};
PollingManager.prototype.stop=function(){
this.shouldPoll=false;
};
if(!utils){
var utils={};
}
if(!utils.arrays){
utils.arrays={};
}
utils.arrays.contains=function(arr,item){
if(arr){
for(var i=0;i<arr.length;i++){
if(arr[i]==item){
return true;
}
}
}
return false;
};
utils.arrays.isSubset=function(arr1,arr2){
if(!arr1||!arr2){
return false;
}
for(var i=0;i<arr1.length;i++){
if(!utils.arrays.contains(arr2,arr1[i])){
return false;
}
}
return true;
};
if(!utils){
var utils={};
}
if(!utils.blinking){
utils.blinking={};
}
utils.blinking.message="";
utils.blinking.doBlink=false;
utils.blinking.originalTitle="";
utils.blinking.evtreturn=null;
utils.blinking.blink=function(){
if(utils.blinking.evtreturn==null){
utils.blinking.originalTitle=document.title;
utils.blinking.evtreturn=MochiKit.Signal.connect(dojo.body(),"onmouseover",utils.blinking.stopIt);
utils.blinking.doBlink=true;
utils.blinking.setMessage();
}
};
utils.blinking.setMessage=function(){
document.title=utils.blinking.message;
if(utils.blinking.doBlink){
callLater(0.5,utils.blinking.clearTitle);
}else{
document.title=utils.blinking.originalTitle;
MochiKit.Signal.disconnect(utils.blinking.evtreturn);
utils.blinking.evtreturn=null;
}
};
utils.blinking.clearTitle=function(){
document.title="____________";
callLater(0.2,utils.blinking.setMessage);
};
utils.blinking.stopIt=function(){
utils.blinking.doBlink=false;
};
function utils_getTimeString(){
var date=new Date();
var _270=date.getHours();
var _271=date.getMinutes();
if(_271<10){
_271="0"+_271;
}
if(_270<10){
_270="0"+_270;
}
return _270+":"+_271;
}
if(!utils){
var utils={};
}
utils.dom={};
utils.dom.limitTextSize=function(_272,_273){
if(_272.value.length>_273){
_272.value=_272.value.substring(0,_273);
}
};
utils.dom.text2html=function(text){
return text.replace(/\n/g,"<br/>");
};
utils.dom.disableButton=function(btn){
if(btn.length){
btn=getElement(btn);
}
btn.disabled=true;
dojo.html.addClass(btn,"disabled");
};
utils.dom.enableButton=function(btn){
if(btn.length){
btn=getElement(btn);
}
btn.disabled=false;
dojo.html.removeClass(btn,"disabled");
};
var x_offset_tooltip=0;
var y_offset_tooltip=0;
var hideQueryTooltip=false;
var ajax_tooltipObj=false;
var ajax_tooltipObj_iframe=false;
var ajax_tooltip_MSIE=false;
if(navigator.userAgent.indexOf("MSIE")>=0){
ajax_tooltip_MSIE=true;
}
var tooltipLoadingDiv=false;
function ajax_showQueryTooltip(_277,_278){
var _279;
if(hideQueryTooltip){
hideQueryTooltip=false;
return;
}
_279=getElement("ajax_tooltip_content");
_279.innerHTML=_278.responseText;
if(ajax_tooltip_MSIE){
ajax_tooltipObj_iframe=document.createElement("<IFRAME frameborder=\"0\">");
ajax_tooltipObj_iframe.style.position="absolute";
ajax_tooltipObj_iframe.border="0";
ajax_tooltipObj_iframe.frameborder=0;
ajax_tooltipObj_iframe.style.backgroundColor="#FFF";
ajax_tooltipObj_iframe.src="about:blank";
_279.appendChild(ajax_tooltipObj_iframe);
ajax_tooltipObj_iframe.style.left="0px";
ajax_tooltipObj_iframe.style.top="0px";
}
ajax_tooltipObj.style.display="block";
if(ajax_tooltip_MSIE){
ajax_tooltipObj_iframe.style.width=ajax_tooltipObj.clientWidth+"px";
ajax_tooltipObj_iframe.style.height=ajax_tooltipObj.clientHeight+"px";
}
ajax_positionTooltip(_277);
}
function ajax_positionTooltip(_27a){
var _27b=(ajaxTooltip_getLeftPos(_27a)+_27a.offsetWidth);
var _27c=ajaxTooltip_getTopPos(_27a);
if(_27c>300){
_27c=300;
}
var _27d=document.getElementById("ajax_tooltip_content").offsetWidth;
ajax_tooltipObj.style.left=_27b+"px";
ajax_tooltipObj.style.top=_27c+"px";
}
function ajax_hideQueryTooltip(_27e){
_27e.show=false;
if(ajax_tooltipObj&&ajax_tooltipObj.style){
ajax_tooltipObj.style.display="none";
}
hideQueryTooltip=true;
}
function ajaxTooltip_getTopPos(_27f){
var _280=_27f.offsetTop+_27f.offsetHeight+10;
if(y_offset_tooltip){
_280+=y_offset_tooltip;
}
while((_27f=_27f.offsetParent)!=null){
if(_27f.tagName!="HTML"){
_280+=_27f.offsetTop;
}
}
return _280;
}
function ajaxTooltip_getLeftPos(_281){
var _282=_281.offsetLeft-_281.offsetWidth/2-175;
if(x_offset_tooltip){
_282+=x_offset_tooltip;
}
while((_281=_281.offsetParent)!=null){
if(_281.tagName!="HTML"){
_282+=_281.offsetLeft;
}
}
return _282;
}
function showLoadingTooltip(_283){
var _284;
if(!ajax_tooltipObj){
ajax_tooltipObj=document.createElement("DIV");
ajax_tooltipObj.style.position="absolute";
ajax_tooltipObj.id="ajax_tooltipObj";
document.body.appendChild(ajax_tooltipObj);
_284=document.createElement("DIV");
_284.className="ajax_tooltip_content";
ajax_tooltipObj.appendChild(_284);
_284.id="ajax_tooltip_content";
tooltipLoadingDiv=document.createElement("DIV");
tooltipLoadingDiv.className="loading";
tooltipLoadingDiv.id="ajax_tooltip_loading";
var text=document.createElement("h1");
text.innerHTML="Loading user data .... (Please wait)";
tooltipLoadingDiv.appendChild(text);
}else{
_284=getElement("ajax_tooltip_content");
}
_284.innerHTML="";
_284.appendChild(tooltipLoadingDiv);
if(ajax_tooltip_MSIE){
ajax_tooltipObj_iframe=document.createElement("<IFRAME frameborder=\"0\">");
ajax_tooltipObj_iframe.style.position="absolute";
ajax_tooltipObj_iframe.border="0";
ajax_tooltipObj_iframe.frameborder=0;
ajax_tooltipObj_iframe.style.backgroundColor="#FFF";
ajax_tooltipObj_iframe.src="about:blank";
_284.appendChild(ajax_tooltipObj_iframe);
ajax_tooltipObj_iframe.style.left="0px";
ajax_tooltipObj_iframe.style.top="0px";
}
ajax_tooltipObj.style.display="block";
if(ajax_tooltip_MSIE){
ajax_tooltipObj_iframe.style.width=ajax_tooltipObj.clientWidth+"px";
ajax_tooltipObj_iframe.style.height=ajax_tooltipObj.clientHeight+"px";
}
ajax_positionTooltip(_283);
}
var tooltipLastDefered=null;
function showUserDetailsTooltip(_286,_287,_288,_289,_28a){
_286.show=true;
callLater(0.5,doShowUserDetailsTooltip,_286,_287,_288,_289);
}
function doShowUserDetailsTooltip(_28b,_28c,_28d,_28e){
if(!_28b.show){
return;
}
x_offset_tooltip=_28d;
y_offset_tooltip=_28e;
hideQueryTooltip=false;
if(tooltipLastDefered){
tooltipLastDefered.cancel();
}
if(!ajax_tooltipObj||(ajax_tooltipObj&&ajax_tooltipObj.style.display=="none")){
showLoadingTooltip(_28b);
var d=callManager.doRequest("statistics","getUserDetails",_28c,null,[]);
if(d){
d.addCallback(ajax_showQueryTooltip,_28b);
}
tooltipLastDefered=d;
}
}

