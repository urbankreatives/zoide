"use strict";
const arr =[]
const obj ={}
 const arr1 = []
 var arr2 = []
 $.ajax({
  dataType: 'json',
 
  type: 'POST',
  url: "/parent/userX",
  success: function(data) {
for(var i = 0; i< data.length; i++){

arr.push({value:i+1,name:data[i].fullname,email:data[i].email,id:data[i]._id,photo:data[i].photo})

/*arr1.push(data[i].email)
arr2.push(i)*/
}
           
console.log(arr.length)
var KTAppInboxCompose=function()


  {
    
  
   
  
  const e=e=>{const t=e.querySelector('[data-kt-inbox-form="cc"]'),a=e.querySelector('[data-kt-inbox-form="cc_button"]'),

n=e.querySelector('[data-kt-inbox-form="cc_close"]'),o=e.querySelector('[data-kt-inbox-form="bcc"]'),
r=e.querySelector('[data-kt-inbox-form="bcc_button"]'),l=e.querySelector('[data-kt-inbox-form="bcc_close"]');
a.addEventListener("click",(e=>{e.preventDefault(),t.classList.remove("d-none"),t.classList.add("d-flex")})),
n.addEventListener("click",(e=>{e.preventDefault(),t.classList.add("d-none"),t.classList.remove("d-flex")})),
r.addEventListener("click",(e=>{e.preventDefault(),o.classList.remove("d-none"),o.classList.add("d-flex")})),
l.addEventListener("click",(e=>{e.preventDefault(),o.classList.add("d-none"),o.classList.remove("d-flex")}))},

t=e=>{const t=e.querySelector('[data-kt-inbox-form="send"]');t.addEventListener("click",

(function()
{
  let arrX = []

console.log(arr1[0].length,'arr1 length')
for(var i = 0; i<arr1[0].length;i++){
  console.log(arr1[0][i])
arrX.push(arr1[0][i].id)


}
arrX.push('')
let code1 = document.getElementById('subjectX').value
//let code2 = document.getElementById('msgX').value
let code2 = document.getElementById('kt_inbox_form_editor').textContent
console.log(code1,code2,'capacity')
 // console.log(code,'code')
  $.ajax({
    dataType: 'json',
   data:{
code:arrX,
code1:code1,
code2:code2
   },
    type: 'POST',
    url: "/parent/dataX",
    success: function(data) {
      window.location.href = "http://localhost:9000/parent/compose"
      alert('Message Sent')
     
    }
  })
  
  t.setAttribute("data-kt-indicator","on"),
setTimeout((function(){t.removeAttribute("data-kt-indicator")}),3e3)}))},a=e=>{var t,a=new Tagify(e,
    {tagTextProp:"name",enforceWhitelist:!0,skipInvalid:!0,dropdown:{closeOnSelect:!1,enabled:0,classname:"users-list",
    searchKeys:["name","email"]},templates:{tag:function(e){return  `\n                <tag title="${e.title||e.email}"\n      
                      contenteditable='false'\n                        spellcheck='false'\n                  
                            tabIndex="-1"\n                        class="${this.settings.classNames.tag} ${e.class?e.class:""}"\n   
                                                 ${this.getAttributes(e)}>\n     
                                                           
  <x title='' class='tagify__tag__removeBtn' role='button' aria-label='remove tag'></x>\n                
      <div class="d-flex align-items-center">\n                     
         <div class='tagify__tag__avatar-wrap ps-0'>\n                  
       <img onerror="this.style.visibility='hidden'" class="rounded-circle w-25px me-2" src="uploads/${e.photo}">\n       
     </div>\n                        <span class='tagify__tag-text'>${e.name}</span>\n                    </div>\n                </tag>\n            `},
     dropdownItem:function(e){return   `\n                <div ${this.getAttributes(e)}\n                 
        class='tagify__dropdown__item d-flex align-items-center ${e.class?e.class:""}'\n                    tabindex="0"\n                  
          role="option">\n\n                    ${e.photo?`\n           
                           <div class='tagify__dropdown__item__avatar-wrap me-2'>\n                    
     <img onerror="this.style.visibility='hidden'"  class="rounded-circle w-50px me-2" src="uploads/${e.photo}">\n                            </div>`:""}\n\n       
                  <div class="d-flex flex-column">\n                        <strong>${e.name}</strong>\n  
                               
     <span>${e.email}</span>\n                    </div>\n                </div>\n            `   }},

     whitelist:arr});a.on("dropdown:show dropdown:updated",(function(e){var n=e.detail.tagify.DOM.dropdown.content; 
      a.suggestedListItems.length>1&&(t=a.parseTemplate("dropdownItem",[{class:"addAll",name:"Add all",email:a.settings.whitelist.reduce((function(e,t){return a.isTagDuplicate(t.value)?e:e+1}),0)+" Members"}]),n.insertBefore(t,n.firstChild))})),a.on("dropdown:select",(function(e){e.detail.elm==t&&a.dropdown.selectAll.call(a)  ,arr1.push(a.value),console.log(arr1,'drop')  }))},
     n=e=>{new Quill("#kt_inbox_form_editor",{modules:{toolbar:[[{header:[1,2,!1]}],["bold","italic","underline"],["image","code-block"]]},placeholder:"Type your text here...",theme:"snow"});const t=e.querySelector(".ql-toolbar");if(t){const e=["px-5","border-top-0","border-start-0","border-end-0"];t.classList.add(...e)}},o=e=>{const t='[data-kt-inbox-form="dropzone"]',a=e.querySelector(t),n=e.querySelector('[data-kt-inbox-form="dropzone_upload"]');var o=a.querySelector(".dropzone-item");o.id="";var r=o.parentNode.innerHTML;o.parentNode.removeChild(o);var l=new Dropzone(t,{url:"https://preview.keenthemes.com/api/dropzone/void.php",parallelUploads:20,maxFilesize:1,previewTemplate:r,previewsContainer:t+" .dropzone-items",clickable:n});l.on("addedfile",(function(e){a.querySelectorAll(".dropzone-item").forEach((e=>{e.style.display=""}))})),l.on("totaluploadprogress",(function(e){a.querySelectorAll(".progress-bar").forEach((t=>{t.style.width=e+"%"}))})),l.on("sending",(function(e){a.querySelectorAll(".progress-bar").forEach((e=>{e.style.opacity="1"}))})),l.on("complete",(function(e){const t=a.querySelectorAll(".dz-complete");setTimeout((function(){t.forEach((e=>{e.querySelector(".progress-bar").style.opacity="0",e.querySelector(".progress").style.opacity="0"}))}),300)}))};return{init:function(){(()=>{const r=document.querySelector("#kt_inbox_compose_form"),l=r.querySelectorAll('[data-kt-inbox-form="tagify"]');e(r),t(r),l.forEach((e=>{a(e)})),n(r),o(r)})()}}}    

();KTUtil.onDOMContentLoaded((function(){KTAppInboxCompose.init()}))}});