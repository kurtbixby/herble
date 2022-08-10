const emailButton = document.querySelector("#emailButton");

function connectToUser (event) {
    event.preventDefault();
    
    const subjectElement = document.querySelector("#subject");
    const bodyElement = document.querySelector("#messageBody");

    let emailTo = 'infoherbleapp@gmail.com';
    let subject = subjectElement.value;
    let messageBody = bodyElement.value;
    let linkage = 'mailto:' + emailTo + '?' + 'subject=' + subject + '&body=' + messageBody;
    console.log(linkage);
    location.href = linkage;
}

emailButton.addEventListener("click", connectToUser);