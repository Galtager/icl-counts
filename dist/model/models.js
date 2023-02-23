sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,r,t,o,n){var a={createDeviceModel(){const t=new e(r);t.setDefaultBindingMode("OneWay");return t},handleErrors(e,r){try{t.error(JSON.stringify(e))}catch(e){t.error(JSON.stringify(e))}if(r||e)console.log(r,e)},QueryDataFromServer(e,r,t,a=[],s){try{const c=Object.keys(e).map(r=>new o(r,n.EQ,e[r]));let l={};if(s)l={$expand:s};return new Promise(function(e,o){myComponent.getOdataModel(r).read("/"+t,{filters:c,sorters:a,urlParameters:l,success:({results:r})=>{e(r)},error:e=>{o(e)}})})}catch(e){console.log(e)}},ReadDataFromServer(e,r,t){try{return myComponent.getOdataModel(r).metadataLoaded().then(function(){const o=myComponent.getOdataModel(r).createKey("/"+t,e);return new Promise((e,t)=>{myComponent.getOdataModel(r).read(o,{success:r=>{e(r)},error:e=>{t(e)}})})})}catch(e){console.log(e)}},CreateToServer(e,r,t){try{return new Promise((o,n)=>{myComponent.getOdataModel(r).create("/"+t,e,{success:e=>{o(e)},error:e=>{n(e)}})})}catch(e){console.log(e)}},createJsonModel(){const r={oData:{},oMaintain:{createCount:{}},oFlags:{}};const t=new e(r);return t},createEmptyJsonModel(){const r={};const t=new e(r);return t}};return a});