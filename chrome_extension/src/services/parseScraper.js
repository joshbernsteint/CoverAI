function parseScraper({content}){
    if(content){
        const asList = content.split('\n').map(e => e.trim());
        return asList.join('\n').replaceAll(/(\n\n+)/g, '\n\n') + "\nAdditional Information Here: \n";
    }
    else{
        return "";
    }
}

export default parseScraper;