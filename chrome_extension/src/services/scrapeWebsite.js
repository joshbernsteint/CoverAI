// scrapes any html that could contain either of these words/phrases
const textsToFind = ['responsibilities', 'role', 'qualifications', 'skills', 'description', 'duties', 'expect', "what you'll do"];
function findDivsWithText(texts) {
    const htmlTags = 'h1, h2, h3, h4, h5, h6, strong, b, em, i, span, blockquote, pre, figcaption';
    const textElements = document.querySelectorAll(htmlTags);
    const foundDivs = new Set(); // Use a Set to prevent duplicate entries

    textElements.forEach(elem => {
        if (texts.some(text => elem.textContent.toLowerCase().includes(text))) {
            const div = elem.closest('div');
            if (div) {
                // Get the formatted text with newlines for the div and its children
                const formattedText = getTextWithNewlines(div).trim();
                // Add the formatted text to the Set
                foundDivs.add(formattedText);
            }
        }
    });

    if (foundDivs.size === 0) {
        throw "Error: could not find any job posting";
    }
    // Convert the Set to an array and join with a newline to separate each div's content
    let output = Array.from(foundDivs).join('\n');
    output = output.replace(/(\n{3,})/g, '\n\n\n');
    return output;
}




// gets the path to a certain element of the dom
function getCssSelectorPath(element) {
    let path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.id) {
        selector += '#' + element.id;
        path.unshift(selector);
        break; // ID is unique, no need to go further
      } else {
        let sibling = element;
        let nth = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.nodeName.toLowerCase() === selector) nth++;
        }
        if (nth !== 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      element = element.parentNode;
    }
    return path.join(' > ');
}
  
// if there is a button that reveals the full text, the script will click it
const keyButtonWords = ['show more', 'view more', 'show full description', 'view full description', 'read more', 'more'];
function findHiddenTextButton() {
    // clicks the button that reveals the full text
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        keyButtonWords.forEach((keyword) => {
            if (button.textContent.toLowerCase() === keyword) {
                button.click();
            }
        }); 
    });
}

async function scrape(){
    function getTextWithNewlines(elem) {
        let text = '';
        // Node.TEXT_NODE === 3
        if (elem.nodeType === 3) {
            text += elem.textContent + '\n';
        } else {
            for (let child of elem.childNodes) {
                text += getTextWithNewlines(child);
            }
        }
        return text;
    }
    console.log('scraping....!');
    const currentUrl = window.location.href.toLowerCase();
            
    if (!(currentUrl.includes("job") || currentUrl.includes("posting") || currentUrl.includes("career"))) {
        // urls for any job application have the word "job", "career", or "posting" in it
        return ({status: "Not Found"});
    } 
    
    // any job description page will have an "apply" button, if it doesn't the page doesn't have a job posting
    // const buttons = document.querySelectorAll('button');
    // if (!Array.from(buttons).some((button) => button.textContent.toLowerCase().includes("apply"))) {
    //     return return ({status: "Not Found"});
    // }

    try {
        if (currentUrl.includes('ziprecruiter')) {
            console.log("ziprecruiter");
            const div = document.querySelector("div.job_details_container");
            const content = getTextWithNewlines(div);
            return ({status: "Found", content: content});
        } else if (currentUrl.includes('linkedin.com')) {
            console.log("linkedin");
            const substring = 'jobs-description__container';
            const articles = document.querySelectorAll('article');
            let jobArticle = Array.from(articles).filter(article => 
                article.className.toLowerCase().includes(substring));
            jobArticle = jobArticle[0];
            const content = getTextWithNewlines(jobArticle);
            return ({status: "Found", content: content});
        } else if (currentUrl.includes('indeed.com')) {
            console.log("indeed");
            const jobDiv = document.getElementById('jobDescriptionText');
            const content = getTextWithNewlines(jobDiv);
            console.log(jobDiv);
            return ({status: "Found", content: content});
        } else {
            console.log("other");
            findHiddenTextButton();
            const outputString = findDivsWithText(textsToFind);
            return ({status: "Found", content: outputString});  
        }
    } catch(e) {
        return ({status: "Not Found", error: e.toString()});
    }
}


async function scrapeWebsite(){
    try {
        let tab;
        await new Promise(res => chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          tab = tabs[0];
          res();
        }));
        const output = await window.chrome.scripting.executeScript({func: scrape, target: {tabId: tab.id}});
        console.log(output[0].result);
        return output[0].result;
    } catch (error) {
        return {status: "Error", error: error.toString()};
    }
}

export default scrapeWebsite;