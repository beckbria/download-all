function accepts_element() {
    return document.getElementById("accepts");
}

function rejects_element() {
    return document.getElementById("rejects");
}

function batch_size_element() {
    return document.getElementById("batchSize");
}

function status_element() {
    return document.getElementById("status");
}

function validPattern(pattern) {
    valid = true;
    try {
        found = "".match(new RegExp(pattern));
    } catch {
        valid = false;
    }
    return valid;
}

function save_options() {
    var acceptsRaw = accepts_element().value;
    var rejectsRaw = rejects_element().value;
    var batchSizeRaw = batch_size_element().value;

    errors = [];

    // Validate the inputs
    batchSize = parseInt(batchSizeRaw);
    if (isNaN(batchSize) || batchSize < 1 || batchSize > 1000) {
        errors.push("Invalid batch size");
    }

    accepts = acceptsRaw.split("\n").filter(a => a.length > 0);
    for (const a of accepts) {
        if (!validPattern(a)) {
            errors.push(`Invalid match pattern: ${r}`)
        }
    }

    rejects = rejectsRaw.split("\n").filter(r => r.length > 0);
    for (const r of rejects) {
        if (!validPattern(r)) {
            errors.push(`Invalid reject pattern: ${r}`)
        }
    }

    if (errors.length == 0) {
        chrome.storage.sync.set({
            accepts: accepts,
            rejects: rejects,
            batchSize: batchSize
        }, function() {
            status_element().textContent = "Options saved.";
            setTimeout(function() {
                status_element().textContent = "";
            }, 5000);
            restore_options();
        });
    } else {
        status_element().textContent = errors.join("\n");
    }
}

function restore_options() {
    chrome.storage.sync.get({
        // Default values
        accepts: [".*\\.pdf"],
        rejects: [],
        batchSize: 10
    }, function(settings) {
        accepts_element().value = settings.accepts.join("\n");
        rejects_element().value = settings.rejects.join("\n");
        batch_size_element().value = settings.batchSize;
    });
}

function reset_options() {
    chrome.storage.sync.clear(restore_options);
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
document.getElementById("reset").addEventListener("click", reset_options);