const browser = require('webextension-polyfill');

function absolutePath (href) {
    var a = document.createElement('a');
    a.href = href;
    return a.href;
}

function shouldDownload(href, accepts, rejects) {
    for (var r of rejects) {
        if (href.match(r)) {
            return false;
        }
    }
    for (var a of accepts) {
        if (href.match(a)) {
            return true;
        }
    }
    return false;
}

// Find all links 
const allLinks = document.querySelectorAll('a[href]');

chrome.storage.sync.get({
    // Default values
    accepts: [".*\\.pdf"],
    rejects: [],
    batchSize: 10
    }, function(settings) {
        // Build the validators
        accepts = []
        rejects = []
        for (const m of settings.accepts) {
            accepts.push(new RegExp(m));
        }
        for (const r of settings.rejects) {
            rejects.push(new RegExp(r));
        }

        links = []
        for (const link of allLinks) {
            var href = link.getAttribute('href');
            if (shouldDownload(href, accepts, rejects)) {
                links.push(absolutePath(href));
            }
        }

        const batchSize = settings["batchSize"]
        const linksLength = links.length;
        if (confirm("Found " + linksLength + " links - continue?")) {
        for (let index = 0; index < linksLength; ++index) {
            // Initiate a download
            browser.runtime.sendMessage({
                action: "saveAs",
                url: links[index],
            });

            // Pause for user input every 10 files to avoid getting blocked for too many simultaneous download attempts
            const completed = index + 1
            if ((completed < linksLength) && (index % batchSize == batchSize - 1)) {
                if (!confirm(completed + '/' + linksLength + ' files downloaded - continue?')) {
                    break;
                }
            }
        }
    }
});


