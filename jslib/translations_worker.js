let translations = {};

window.onload = function () {
    let regex = /(?:\$\{)(.*)(?:\})/g;
    var content = document.body.innerHTML;

    //Kill the page until we can translate
    document.body.innerHTML = "";

    var matches = [];
    var match;

    while (match = regex.exec(content)) {
        matches.push(match[1]);
    }

    if (matches) {
        matches.forEach(val => {
            let value = val.split(".");
            if (translations) {
                let translation = translations[value[0]];
                if (translation) {
                    translation = translation[value[1]];
                    if (translation) {
                        translation = translation[value[2]];
                        content = content.replace("${" + val + "}", translation);
                    }
                }
            }
        });
        document.body.innerHTML = content;
    }
};