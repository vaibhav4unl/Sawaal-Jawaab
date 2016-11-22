/*
When the Page Loads it calls '$(document).ready' function
*/

$(document).ready(function () {
    readQuestionUNLFile();
    readAnswerUNLFile();

    /* 
    This function reads the input Question text file and if answer file is already uploaded then it calls 'findAnswer'
    function 
    */
    function readQuestionUNLFile() {
        questionInput = document.getElementById('questionFileInput');
        questionInput.addEventListener('change', function (e) {
            questionFile = questionInput.files[0];
            textType = /text.*/;
            if (questionFile.type.match(textType)) {
                var questionReader = new FileReader();
                questionReader.onload = function (e) {
                    var x = questionReader.result.split("{unl}")[1].split(")");
                    var iCount = 0;
                    while (iCount < x.length - 1) {
                        questionObject.push(
                {
                    relationName: x[iCount].split("(")[0].trim(),
                    firstArgument: x[iCount].split("(")[1].split(",")[0].trim(),
                    secondArgument: x[iCount].split("(")[1].split(",")[1].trim(),
                    otherInfo: "no"
                }
		                    );
                        iCount++;
                    }
                    var xx = questionObject[1].relationName.substring(1, 2);
                    canFindAnswer++;
                    if (canFindAnswer > 1) { findAnswer(); }
                }
                questionReader.readAsText(questionFile);
            }
            else {
                alert("Input file cannot be read");
            }
        });
    }

    /* 
    This function reads the input answer text file and if answer file is already uploaded then it calls 'findAnswer'
    function 
    */

    function readAnswerUNLFile() {
        answerInput = document.getElementById('answerFileInput');
        answerInput.addEventListener('change', function (e) {
            answerFile = answerInput.files[0];
            textType = /text.*/;
            if (answerFile.type.match(textType)) {
                var answerReader = new FileReader();
                answerReader.onload = function (e) {
                    var x = answerReader.result.split("{unl}")[1].split(")");
                    var iCount = 0;
                    while (iCount < x.length - 1) {
                        answerObject.push(
                {
                    relationName: x[iCount].split("(")[0].trim(),
                    firstArgument: x[iCount].split("(")[1].split(",")[0].trim(),
                    secondArgument: x[iCount].split("(")[1].split(",")[1].trim(),
                    otherInfo: "no"
                }
		                    );
                        iCount++;
                    }
                    canFindAnswer++;
                    if (canFindAnswer > 1) { findAnswer(); }
                }
                answerReader.readAsText(answerFile);
            }
            else {
                alert("Output file cannot be read");
            }
        });
    }

    /* Start Crawling and find the answer*/
    function findAnswer() {
        probableAnswers = [];
        answerRelationName = "";
        argumentToMatch = "";
        answerArgumentIndex = "";
        var count = 0,
	    indexOfQuestionRelation = -1;
        originalQuestionObject = questionObject;
        originalAnswerObject = answerObject;
        answer = "";

        while (count < questionObject.length) {
            if (-1 !== questionObject[count].firstArgument.indexOf("@wh")) {
                indexOfQuestionRelation = count;
                answerRelationName = questionObject[count].relationName.split(":")[0];
                argumentToMatch = questionObject[count].secondArgument.split(":")[0];
                answerArgumentIndex = 0;
                break;
            }
            if (-1 !== questionObject[count].secondArgument.indexOf("@wh")) {
                indexOfQuestionRelation = count;
                answerRelationName = questionObject[count].relationName.split(":")[0];
                argumentToMatch = questionObject[count].firstArgument.split(":")[0];
                answerArgumentIndex = 1;
                break;
            }
            count++;
        }

        /* 
        If index of Question relation = -1, means no question is asked in question UNL i.e., it is not 
        having any '@wh' attribute.
        */    

       /*
       Call 'Optimizer' to check if question is asked or not
       */
        optimizer(checkIfQuestionIsCorrect, indexOfQuestionRelation);
        arrQuestionFirstArguments = [];
        arrQuestionSecondArguments = [];
        // refine question unl for matching with answer unl
        count = 0;
        while (count < questionObject.length) {
            questionObject[count].relationName = questionObject[count].relationName.split(":")[0];
            questionObject[count].firstArgument = questionObject[count].firstArgument.split(".")[0] !== "" ? questionObject[count].firstArgument.split(".")[0] : questionObject[count].firstArgument;
            questionObject[count].secondArgument = questionObject[count].secondArgument.split(".")[0] !== "" ? questionObject[count].secondArgument.split(".")[0] : questionObject[count].secondArgument;
            arrQuestionFirstArguments.push(questionObject[count].firstArgument);
            arrQuestionSecondArguments.push(questionObject[count].secondArgument);
            count++;
        }

        // find an answer
        count = 0;
        var loop = 0, exit = 0;
        if (questionObject.length === 1) {
            for (var i = 0; i < answerObject.length; i++) {
                if (answerObject[i].relationName.split(":")[0] == answerRelationName) {
                    if (answerArgumentIndex === 0) {
                        // Match second argument
                        if (answerObject[i].secondArgument.split(":")[0] == argumentToMatch) { answer = answerObject[i].firstArgument.split(":")[0]; }
                        else { if (arrQuestionFirstArguments.indexOf(answerObject[i].firstArgument.split(":")[0]) != -1) { probableAnswers.push(answerObject[i].firstArgument.split(":")[0]); } }
                    }
                    else {
                        if (answerObject[i].firstArgument.split(":")[0] == argumentToMatch) { answer = answerObject[i].secondArgument.split(":")[0]; }
                        else { if (arrQuestionSecondArguments.indexOf(answerObject[i].secondArgument.split(":")[0]) != -1) { probableAnswers.push(answerObject[i].secondArgument.split(":")[0]); } }
                    }
                }
                else { continue; }
            }
        }
        else {

            // Start finding answer
            for (var i = 0; i < answerObject.length; i++) {
                if (answerObject[i].relationName.split(":")[0] == answerRelationName) {
                    if (answerArgumentIndex === 0) {
                        // Match second argument
                        if (answerObject[i].secondArgument.split(":")[0] == argumentToMatch) { answer = answerObject[i].firstArgument.split(":")[0]; }
                        else { if (arrQuestionFirstArguments.indexOf(answerObject[i].firstArgument.split(":")[0]) != -1) { probableAnswers.push(answerObject[i].firstArgument.split(":")[0]); } }
                    }
                    else {
                        if (answerObject[i].firstArgument.split(":")[0] == argumentToMatch) { answer = answerObject[i].secondArgument.split(":")[0]; }
                        else { if (arrQuestionSecondArguments.indexOf(answerObject[i].secondArgument.split(":")[0]) != -1) { probableAnswers.push(answerObject[i].secondArgument.split(":")[0]); } }
                    }
                }
                else { continue; }
            }
            // End finding answer
        }

        /*
        Call 'Optimizer' to check if its a full/ partial match
        */
        optimizer(IsFullOrPartialMatch, indexOfQuestionRelation);
    }

    function optimizer(whatToDo, context) {
        matchCount = 0;
        var partialMatch = 0;
        switch (whatToDo) {
            case 1: // checkIfQuestionIsCorrect
                if (context === -1) {
                    alert("Sorry, we cannot find any question. Please ask the question again");
                    window.location.reload(true);
                }
                break;

            case 2:  // IsFullOrPartialMatch
                var innerText = "";
                var count = 0;
                indexOfQuestionRelation = context;
                // Find Match Percentage
                while (count < questionObject.length) {
                    if (count === indexOfQuestionRelation) { count++; continue; }
                    exit = 0;
                    for (loop = 0; loop < answerObject.length && exit == 0; loop++) {
                        if (
	answerObject[loop].relationName.split(":")[0] == questionObject[count].relationName
	&& answerObject[loop].firstArgument.split(":")[0] == questionObject[count].firstArgument.split(":")[0]
        && answerObject[loop].secondArgument.split(":")[0] == questionObject[count].secondArgument.split(":")[0]
	) { matchCount++; exit = 1; }
                        else if (
	answerObject[loop].relationName.split(":")[0] == questionObject[count].relationName
	&& (answerObject[loop].firstArgument.split(":")[0] == questionObject[count].firstArgument.split(":")[0]
        || answerObject[loop].secondArgument.split(":")[0] == questionObject[count].secondArgument.split(":")[0])
	) {
    // There can be a case that despite the current relation name match, there can be another instance of 
    //the same relation with perfect match
                            var localFlag = 1;
                            for (var localLooper = loop + 1; localLooper < answerObject.length && localFlag; localLooper++) {
                                if (
	                                answerObject[localLooper].relationName.split(":")[0] == questionObject[count].relationName
	                                && answerObject[localLooper].firstArgument.split(":")[0] == questionObject[count].firstArgument.split(":")[0]
                                        && answerObject[localLooper].secondArgument.split(":")[0] == questionObject[count].secondArgument.split(":")[0]
	                                ) { matchCount++; exit = 1; localFlag = 0;}
                            }
                            if (localFlag) {
                                partialMatch++; exit = 1;
                            }
                        }
                        else if (loop === answerObject.length - 1 && answerObject[loop].relationName.split(":")[0] != questionObject[count].relationName) { extraInfoCountInQuestion++; }
                    }
                    count++;
                }
                // End Match %age		
                var x = document.getElementById("matchPercentage");
                if (matchCount === questionObject.length - 1 && answer !== "") {

                    x.innerText = "Its a perfect match. Your answer is: ";
                    answerArea.innerText = answer;
                }
                else if (matchCount + extraInfoCountInQuestion === questionObject.length - 1 && answer !== "") {
                    x.innerText = "Its ALMOST a perfect match. We cannot find some information in Database. The answer is:";
                    answerArea.innerText = answer;
                }

                else if ((matchCount === 0 && answer === "" && partialMatch === 0) || questionObject.length - 1 === partialMatch) {
                    x.innerText = "Cannot find the answer";
                }
                else if (partialMatch !== 0 && answer !== "") {
                    x.innerText = "Its a partial match. The most probable answer is:";
                    answerArea.innerText = answer;
                }

                else if (partialMatch !== 0 && answer === "") {
                    if (0 === probableAnswers.length) {
                        x.innerText = "";
                        innerText = "Cannot find the answer";
                    }
                    else {
                        x.innerText = "Its a partial match. The most probable answers are:";
                        for (var i = 0; i < probableAnswers.length; i++) {
                            innerText = i + 1 + ".) " + probableAnswers[i] + "\n";
                        }
                    }
                    answerArea.innerText = innerText;
                }
                else if (answer === "" && matchCount === questionObject.length - 1) {
                    x.innerText = "Your question is correct but we are sorry because our database does not contain sufficient information to answer this";
                }
                else {
                    x.innerText = "Something went wrong. Cannot find the answer";
                }

                break;

            default:
                break;
        }
    };
});