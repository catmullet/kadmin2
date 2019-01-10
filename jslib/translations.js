let regex = /(?:\$\{)(.*)(?:\})/g;
var content = document.body.innerHTML;
var matches = [];
var match;
while (match = regex.exec(content)) {
    matches.push(match[1]);
}

let translations = JSON.parse('{"adyen": {"error": {"contract": "Unable to contact Adyen for recurring contract."}},"common": {"message": {"info": "This message is to inform you."}},"ui": {"alert": {"failed_attempt": "An attempt to reach the server has failed."},"button": {"delete": "Delete","info": "More information","submit": "Submit","translate": "Translate"},"common": {"failed": "Something Happened!"}}}');

if (matches) {
    matches.forEach(val => {
        if (translations) {
            let translation = translations[val.split(".")[0]];
            if (translation) {
                translation = translation[val.split(".")[1]];
                if (translation) {
                    translation = translation[val.split(".")[2]];
                    content = content.replace("${" + val + "}", translation);
                }
            }
        }
    });
    document.body.innerHTML = content
}