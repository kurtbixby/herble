var emailButton = document.querySelector("#emailButton")
var email1 = document.querySelector("#email")
var subject= document.querySelector("#subject")
var message1 = document.querySelector("#message")



// function linkage() {
//     $('#emailButton').click(function (event) {
//         var email1 = document.querySelector("#email")
//         var email = email1.value;
//       var subject = 'Test';
//       var message1 = 'Hi Sample,';
//       var attach = 'path';
//       document.location = "mailto:"+email+"?subject="+subject+"&body="+message1+
//           "?attach="+attach;
//     });
//   };






function connectToUser () {
//     // window.location.href = "mailto:user@example.com?subject=Subject&body=message%20goes%20here"
//     window.location.href = mailto= (email.value)?subject=Subject&message1=message%20goes%20here
var email = email1.value;
var subject = 'Test';
var message1 = 'Hi Sample,';
// var attach = 'path';
// document.location = "mailto:"+email+"?subject="+subject+"&body="+message1;
var  linkage1 = "mailto:" +'infoherbleapp@gmail.com' +'&subject='+subject+'&body='+message1;
console.log (linkage1);
location.href = linkage1;
// var test1 = "Hello"
// +"?attach="+attach;

//     // location.href = "mailto:"+'email.value'
//     // +'?cc='+'&subject='+subject+'&body='+message;

    console.log (email1.value)
    console.log (test1)
}

// connectToUser ()

emailButton.addEventListener("click", connectToUser);