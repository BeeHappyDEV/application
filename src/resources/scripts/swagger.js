let callback = function (mutationList) {
    for (let mutationObject of mutationList) {
        if (mutationObject.type === "childList") {
            if (mutationObject.addedNodes.length > 0) {
                for (let addedNode of mutationObject.addedNodes) {
                    processNode (addedNode);
                }
                mermaid.init ({theme: "neutral"});
            }
        }
    }
};

let mutationConfig = {
    childList: true,
    subtree: true
};

function processNode (addedNode) {
    if (addedNode.nodeName === "PRE") {
        if (addedNode.firstChild && addedNode.firstChild.nodeName === "CODE") {
            let replacedNode = document.createElement ("div");
            replacedNode.style.width = "fit-content";
            replacedNode.style.margin = "0";
            replacedNode.style.width = "100%";
            replacedNode.classList.add ("mermaid");
            replacedNode.textContent = addedNode.firstChild.textContent;
            addedNode.parentNode.replaceChild (replacedNode, addedNode);
        }
    }
    if (addedNode.nodeName === "SPAN") {
        if (addedNode.getAttribute ("class") === "opblock-summary-method") {
            const textContent = addedNode.textContent;
            if (textContent === "DELETE") {
                addedNode.textContent = "DIRECTIVE";
            }
            if (textContent === "HEAD") {
                addedNode.textContent = "TABLE";
            }
            if (textContent === "OPTIONS") {
                addedNode.textContent = "FUNCTION";
            }
            if (textContent === "PATCH") {
                addedNode.textContent = "TASK";
            }
        }
    }
    for (let childNode of addedNode.childNodes) {
        processNode (childNode);
    }
}

const htmlElement = document.getElementById ("swagger-ui");
let mutationObserver = new MutationObserver (callback);
mutationObserver.observe (htmlElement, mutationConfig);