/*
This file contains global variables which are used in 'mainScript.js'
*/

var questionObject = [],
answerObject = [],
canFindAnswer = 0,
checkIfQuestionIsCorrect = 1,
IsFullOrPartialMatch = 2;
var answerRelationName = "",
    argumentToMatch = "",
	answerArgumentIndex = "",
    questionInput,
    questionFile,
    textType,
	indexOfQuestionRelation = -1,
	originalQuestionObject,
	originalAnswerObject,
 	answer = "",
    answerInput,
    answerFile,
    probableAnswers = [],
    matchCount = 0,
    extraInfoCountInQuestion = 0,
    arrQuestionFirstArguments = [],
    arrQuestionSecondArguments = [];