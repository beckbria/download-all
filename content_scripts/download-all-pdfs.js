const browser = require('webextension-polyfill');

function absolutePath (href) {
    var a = document.createElement('a');
    a.href = href;
    return a.href;
}

// Find all links ending in "pdf"
const links = document.querySelectorAll('a[href$="pdf" i]');
let linksLength = links.length;
if (confirm("Found " + linksLength + " links - continue?")) {
    // Go through each link and grab the URL it points to
    for (let index = 0; index < linksLength; ++index) {
        const link = links[index].cloneNode(false);
        const targetURL = absolutePath(links[index].getAttribute('href'));
        // Initiate a download
        browser.runtime.sendMessage({
            action: "saveAs",
            url: targetURL,
        });

        // Pause for user input every 10 files to avoid getting blocked for too many simultaneous download attempts
        const completed = index + 1
        if ((completed < linksLength) && (index % 10 == 9)) {
            if (!confirm(completed + '/' + linksLength + ' files downloaded - continue?')) {
                break;
            }
        }
    }
}
