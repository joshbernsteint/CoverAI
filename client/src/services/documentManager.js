function splitByLetterCount(str, maxCount){
    const words = str.split(" ");
    const lines = [];
    let curLine = "";
    for (const word of words) {
        if(word.length + curLine.length > maxCount){
            lines.push(curLine);
            curLine = word;
        }
        else if(curLine.length === 0){
            curLine = word;
        }
        else{
            curLine = `${curLine} ${word}`;
        }
    }
    lines.push(curLine);
    return lines.join("\n");
}



class DocumentManager{
    document = {};
    /**
     * 
     * @param {Object} document 
     */
    constructor(document={}){
        if(!document.ops){//If it's not already a delta object
            this.document = this.toDeltaObject(document);
        }
    }


    /**
     * {
        "first_name": "Joshua",
        "last_name": "Bernstein",
        "email": "jbernstein@example.com",
        "date": "2023-09-15",
        "employer_name": "Google",
        "greeting": "Dear Hiring Manager,",
        "first_paragraph": "I am writing to express my interest in the Software Engineer position at Google as advertised. With a strong background in computer science and a passion for innovative technology, I am excited about the opportunity to contribute to Google's cutting-edge projects that impact millions of users worldwide.",
        "second_paragraph": "During my previous roles at tech companies, I have honed my skills in software development, problem-solving, and collaboration. I have experience working on diverse projects that have equipped me with a deep understanding of programming languages and frameworks. I am particularly drawn to Google's commitment to pushing the boundaries of technology and creating products that shape the future.",
        "third_paragraph": "I am confident that my technical expertise, combined with my adaptability and eagerness to learn, make me a strong candidate for this position. I am excited about the prospect of joining a talented team of engineers at Google and contributing to the company's mission of making information accessible and useful to everyone.",
        "closing_statement": "Thank you for considering my application. I am looking forward to the possibility of discussing how my skills and experiences align with the needs of Google. I am eager to bring my enthusiasm and dedication to the team and help contribute to Google's success.",
        "signature": "Sincerely, Joshua Bernstein"
        }
     */
    static toDeltaObject(openAIObj){
        const result = [];
        const paragraph_keys = ["first_paragraph", "second_paragraph", "third_paragraph"];
        //Add greeting
        result.push({insert: `${openAIObj.greeting}\n\n`});

        //Add paragraphs
        for (const key of paragraph_keys) {
            result.push({insert: `\t${openAIObj[key]}\n\n`});
        }


        //Add signature
        result.push({insert: `\n${openAIObj.signature.replace(', ', ",\n")}`})

        return {ops: result};
    }
}

export default DocumentManager;