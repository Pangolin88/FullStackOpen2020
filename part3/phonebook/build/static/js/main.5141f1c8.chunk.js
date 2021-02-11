(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{21:function(e,n,t){},40:function(e,n,t){"use strict";t.r(n);var c=t(0),r=t(1),s=t.n(r),a=t(15),o=t.n(a),u=t(6),i=t(3),l=(t(21),t(4)),d=t.n(l),h="/api/persons",j=function(){return d.a.get(h).then((function(e){return e.data}))},b=function(e){return d.a.post(h,e).then((function(e){return e.data}))},f=function(e,n){return d.a.put("".concat(h,"/").concat(e),n).then((function(e){return e.data}))},m=function(e){return d.a.delete("".concat(h,"/").concat(e)).then((function(e){return e.data}))},O=function(e){var n=e.searchPersons,t=e.deletePerson;return Object(c.jsx)("div",{children:Object(c.jsx)("ul",{children:n.map((function(e,n){return Object(c.jsxs)("li",{children:[e.name," ",e.number,Object(c.jsx)("button",{onClick:function(){return t(e)},children:"delete"})]},n)}))})})},g=function(e){var n=e.searchName,t=e.handleSearchName;return Object(c.jsx)("form",{children:Object(c.jsxs)("div",{children:["filter name with ",Object(c.jsx)("input",{value:n,onChange:t})]})})},v=function(e){var n=e.addPerson,t=e.newName,r=e.newNumber,s=e.handlePersonChange,a=e.handlePhoneChange;return Object(c.jsxs)("form",{onSubmit:n,children:[Object(c.jsxs)("div",{children:["name: ",Object(c.jsx)("input",{value:t,onChange:s})]}),Object(c.jsxs)("div",{children:["number: ",Object(c.jsx)("input",{value:r,onChange:a})]}),Object(c.jsx)("div",{children:Object(c.jsx)("button",{type:"submit",children:"add"})})]})},x=function(e){var n=e.message,t=e.isSuccess;return null===n?null:t?Object(c.jsx)("div",{className:"success",children:n}):Object(c.jsx)("div",{className:"error",children:n})},p=function(){var e=Object(r.useState)([]),n=Object(i.a)(e,2),t=n[0],s=n[1],a=Object(r.useState)(""),o=Object(i.a)(a,2),l=o[0],d=o[1],h=Object(r.useState)(""),p=Object(i.a)(h,2),S=p[0],w=p[1],P=Object(r.useState)(""),N=Object(i.a)(P,2),C=N[0],k=N[1],y=Object(r.useState)({message:null,isSuccess:!1}),L=Object(i.a)(y,2),D=L[0],E=L[1];Object(r.useEffect)((function(){j().then((function(e){return s(e)}))}),[]);var I=""===C?t:t.filter((function(e){return e.name.toLocaleLowerCase().includes(C.toLocaleLowerCase())}));return Object(c.jsxs)("div",{children:[Object(c.jsx)(x,{message:D.message,isSuccess:D.isSuccess}),Object(c.jsx)("h2",{children:"Search phone number by name (insensitive)"}),Object(c.jsx)(g,{searchName:C,handleSearchName:function(e){k(e.target.value)}}),Object(c.jsx)("h2",{children:"Phonebook"}),Object(c.jsx)(v,{addPerson:function(e){e.preventDefault();var n=t.filter((function(e){return e.name===l}));if(0===n.length)!function(){for(var e=t.length+1;t.filter((function(n){return n.id===e})).length>0;)e+=1;b({name:l,number:S,id:e}).then((function(e){s(t.concat(e)),E({message:"Added ".concat(l),isSuccess:!0})})),setTimeout((function(){return E({message:null,isSuccess:!1})}),5e3)}();else if(window.confirm("".concat(l," is already added to phonebook, replace a old number with a new one?"))){var c=Object(u.a)(Object(u.a)({},n[0]),{},{number:S});console.log("changedPerson",c),f(c.id,c).then((function(e){s(t.map((function(n){return n.id!==e.id?n:e}))),E({message:"Updated ".concat(l),isSuccess:!0})})).catch((function(e){E({message:"Information of ".concat(l," has already been removed from server"),isSuccess:!1}),s(t.filter((function(e){return e.name!==l}))),console.log(e)})),setTimeout((function(){return E({message:null,isSuccess:!1})}),5e3)}d(""),w("")},newName:l,newNumber:S,handlePersonChange:function(e){d(e.target.value)},handlePhoneChange:function(e){w(e.target.value)}}),Object(c.jsx)("h2",{children:"Numbers"}),Object(c.jsx)(O,{searchPersons:I,deletePerson:function(e){console.log(e.name),window.confirm("Do you really want to delete ".concat(e.name))&&m(e.id).then((function(){return s(t.filter((function(n){return n.id!=e.id})))})),E({message:"Removed ".concat(e.name),isSuccess:!0})}})]})};o.a.render(Object(c.jsx)(s.a.StrictMode,{children:Object(c.jsx)(p,{})}),document.getElementById("root"))}},[[40,1,2]]]);
//# sourceMappingURL=main.5141f1c8.chunk.js.map