// Custom.js here

// Quiz engine object literal for all logic
var settings = {
  engine: {
    questionSchema: [
      {
        number: 1,
        content: 'Jane\'s house is in London?',
        type: 'true/false',
        answer: true,
        options: [{ true: 'True' }, { false: 'False' }],
      },
      {
        number: 2,
        content: 'Which of these drinks is alcoholic?',
        type: 'multi',
        answer: 'C',
        options: [{ A: 'Orange Juice' }, { B: 'Cola' }, { C: 'Beer' }, { D: 'Apple Juice' }],
      },
      {
        number: 3,
        content: 'Which of these animals are carnivores?',
        type: 'multi-multi',
        answer: ['A', 'B', 'D'],
        options: [{ A: 'Lions' }, { B: 'Alligators' }, { C: 'Sheep' }, { D: 'Tigers' }]
      },
      {
        number: 4,
        content: 'Which of these animals are Herbivores?',
        type: 'multi-multi',
        answer: ['A', 'B'],
        options: [{ A: 'Sheep' }, { B: 'Cows' }, { C: 'Crocodiles' }, { D: 'Tigers' }]
      }
    ],
    completionMessage: 'Congratulations you have completed the Quiz.'
  }
};


// ----------------------------------------------------------------------------------------------------------------------------
//Schema ENDS
// ----------------------------------------------------------------------------------------------------------------------------


// Quiz Engine Starts
var engine = {
  // load question into html
  htmlGenerator: function() {
    // the question schema array, contains all questions and related content
    // Counter for setting unique ids on try again and confirm buttons
    var counterBtnConfirm = 1;
    var counterBtnTryAgain = 1;
    var counterQuestionId = 1;
    var questions = settings.engine.questionSchema;
    var totalQuestionCount = settings.engine.questionSchema.length;
    var quizContainer = document.getElementById('quiz');

    // loop through all the questions in schema
    for (var i = 0; i < totalQuestionCount; i++) {
      // create section tag
      var sectionTag = document.createElement('section');
      var headingTwoTag = document.createElement('h2');
      var questionDiv = document.createElement('div');

      sectionTag.classList.add('home');

      sectionTag.setAttribute('id', 'q-' + counterQuestionId++);
      // only add active class to first question
      if (i === 0) {
        sectionTag.classList.add('active');
      }

      var questionNumberFromSchema = questions[i].number;
      var questionTypeFromSchema = questions[i].type;
      var questionNumberHeading = 'Question ' + questionNumberFromSchema;
      var questionNumber = document.createTextNode(questionNumberHeading);

      headingTwoTag.appendChild(questionNumber);
      sectionTag.appendChild(headingTwoTag);

      // all the rest needs to be added to question div
      questionDiv.classList.add('question');
      var questionId = 'question' + questionNumberFromSchema;
      questionDiv.setAttribute('id', questionId);
      questionDiv.setAttribute('data-number', questionNumberFromSchema);
      questionDiv.setAttribute('data-type', questionTypeFromSchema);

      // Get the question content from the schema
      var questionContent = settings.engine.questionSchema[i].content;
      //console.log(questionContentEscaped);
      // Create a text node with question content
      var questionText = document.createTextNode(questionContent);
      var pTag = document.createElement('p');
      // Class to created p tag
      pTag.classList.add('question-content');
      pTag.appendChild(questionText);
      questionDiv.appendChild(pTag);
      // Get the length of options to question from schema
      var len = settings.engine.questionSchema[i].options.length;
      // Create btn-box div
      var btnBoxDiv = document.createElement('div');
      btnBoxDiv.classList.add('btn-box');

      // Loop through all the options
      for (var j = 0; j < len; j++) {
        var answerBtn = document.createElement('button');
        // get the value of the key form the options object
        var key = Object.keys(settings.engine.questionSchema[i].options[j]);

        //add all the classes and attributes to answer buttons
        answerBtn.classList.add("answer-btn");
        answerBtn.classList.add("btn");
        answerBtn.setAttribute("type", "button");
        answerBtn.setAttribute("data-logic", key[0]);
        answerBtn.innerHTML = Object.values(settings.engine.questionSchema[i].options[j]);
        // answer button to btn-box div
        btnBoxDiv.appendChild(answerBtn);
      } // for loop ENDS

      questionDiv.appendChild(btnBoxDiv);

      // Create all the control and feed back elements
      var confirmBtn = document.createElement('button');
      var tryAgainButton = document.createElement('button');
      var controlBoxDiv = document.createElement('div');

      // set all the attributes and classes of the control elements
      controlBoxDiv.classList.add('control-box');
      confirmBtn.classList.add('btn');
      confirmBtn.classList.add('confirm-btn');
      confirmBtn.setAttribute('type', 'button');
      confirmBtn.setAttribute('id', 'confirm-' + counterBtnConfirm++);
      // get rid of the innerHTML assingment here => textNode?
      confirmBtn.innerHTML = 'Confirm';
      tryAgainButton.classList.add('btn');
      tryAgainButton.classList.add('try-again-btn');
      tryAgainButton.classList.add('not-visible');
      tryAgainButton.setAttribute('type', 'button');
      tryAgainButton.setAttribute('id', 'tryAgain-' + counterBtnTryAgain++);
      // get rid of innerHTML assignment here => textNode?
      tryAgainButton.innerHTML = 'Try Again';

      // add buttons to controlbox div
      controlBoxDiv.appendChild(confirmBtn);
      controlBoxDiv.appendChild(tryAgainButton);
      questionDiv.appendChild(controlBoxDiv);

      // element is the question element from foreach loop
      sectionTag.appendChild(questionDiv);
      quizContainer.appendChild(sectionTag);
    } // end of for loop

    engine.createIsolatedSingleFeedbackBox();
    engine.createFinalSection();
  },
  createFinalSection: function() {
    // Check and find the last section
    var allSections = document.querySelectorAll("section");
    var lastSection = allSections[allSections.length - 1];

    // Copy the <li> element and its child nodes
    var clone = lastSection.cloneNode(true);
    clone.id = "finalSection";

    // Append the cloned <li> element to <ul> with id='myList1'
    document.getElementById('quiz').appendChild(clone);

    // Get the final page and remove normal question elements
    var getFinalPage = document.getElementById("finalSection");
    getFinalPage.childNodes[1].remove();

    // Update text for h2 for the completion page
    getFinalPage.childNodes["0"].innerText = "QUIZ COMPLETE";

    // Add paragraph element with congratulations message. 
    var node = document.createElement('p'); // Create a <li> node
    node.classList.add('congratulations-msg');
    var textnode = document.createTextNode(settings.engine.completionMessage); // Create a text node
    node.appendChild(textnode);  // Append the text to <li>
    getFinalPage.appendChild(node); // Append <li> to <ul> with id='myList'
  },
  createIsolatedSingleFeedbackBox: function() {
    var quiz = document.getElementById('quiz');

    // Setup feedback DOM
    var feedbackBoxDiv = document.createElement('div');
    var feedBackMsgPtag = document.createElement('p');
    var feedBackIndicator = document.createElement('i');
    var feedBackSpan = document.createElement('span');

    // Add class to feedback box div
    feedbackBoxDiv.classList.add('feedback-box');

    // Add clases and attributes to feedback elements
    feedBackMsgPtag.classList.add('feedback-msg');
    feedBackIndicator.setAttribute('id', 'feedbackIndicator');
    feedBackSpan.classList.add('msg');
    feedBackMsgPtag.appendChild(feedBackIndicator);
    feedBackMsgPtag.appendChild(feedBackSpan);
    feedbackBoxDiv.appendChild(feedBackMsgPtag);

    // Element is question element from foreach loop
    quiz.append(feedbackBoxDiv);
  },
  questionCheck: function(parent, clickedConfirmElement) {
    var questionNumber = parent.getAttribute('data-number');
    var questionType = parent.getAttribute('data-type');

    function findSeletedAnswerDataLogic() {
      // Get array of both true/false buttons based on parent passed
      // from ui object
      var selectButtons = parent.children[1].children;
      // Loop through array to find '.selected'
      for (var i = 0; i < selectButtons.length; i++) {
        // look for the selected element within the array
        if (selectButtons[i].classList.contains('selected')) {
          // return the selected element
          return selectButtons[i];
        }
      }
    }

    // Currently reviewing question type and sending to the correct methods for review
    // I.E. either multi-choice or true-false
    function sendAnswerForCheckAgainstSchema() {
      // This variable relates to the return value above
      // findSeletedAnswerDataLogic() represents the selected button element
      var selectedAnswer = findSeletedAnswerDataLogic();

      // 4 Question type paths, true/false/multi/multi-multi
      if (selectedAnswer.dataset.logic === 'true') {
        engine.checkAnswerAgainstSchema(
          true,
          questionNumber,
          clickedConfirmElement
        );
      } else if (selectedAnswer.dataset.logic === 'false') {
        engine.checkAnswerAgainstSchema(
          false,
          questionNumber,
          clickedConfirmElement
        );
      } else if (questionType === 'multi-multi') {
        engine.questionCheckMultiMulti(parent, clickedConfirmElement);
      } else {
        engine.checkAnswerAgainstSchemaMulti(selectedAnswer.dataset.logic, questionNumber, clickedConfirmElement);
      }
    }

    // Calls function above
    sendAnswerForCheckAgainstSchema();
  },
  // This function checks the question answered against the
  // json or object user data or..... schema
  checkAnswerAgainstSchema: function(answerLogic, questionNumber, clickedConfirmElement) {
    // answerReference is an Object that has
    // answer number and references fom DOM UI actions of user
    var answerReference = {
      logic: answerLogic,
      number: questionNumber
    };

    // The Schema reference variable
    // Get all questions from the json object or schema
    var questions = settings.engine.questionSchema;

    // Match and find the clicked question with the question from
    // the json schema
    var findQuestion = function(question) {
      // parseInt is used as the answer reference number is initially a string
      // needs to be turned into a number to result in a match.
      return question.number === parseInt(answerReference.number);
    };

    // Array of matched answers for checking purposes
    var schemaMatch = questions.filter(findQuestion);

    // Checking for correct or incorrect and sending to the relevant method
    function correctOrIncorrect(schemaMatch, answerReference) {
      if (schemaMatch[0].answer === answerReference.logic) {
        // Sends to the answerCorrect method with relevant message
        ui.answerCorrect('Well done, you are correct', clickedConfirmElement);
      } else {
        // Sends to the answerIncorrect method with relevant question number 
        ui.answerIncorrect(questionNumber);
      }
    }

    // Check if answe is correct or incorrect
    correctOrIncorrect(schemaMatch, answerReference, clickedConfirmElement);
  },

  checkAnswerAgainstSchemaMulti: function(answerLogic,questionNumber,clickedConfirmElement) {
    // answer number and references fom DOM UI actions of user
    var answerReference = {
      logic: answerLogic,
      number: questionNumber
    };

    // The Schema reference variable
    // Get all questions from the json object or schema
    var questions = settings.engine.questionSchema;

    // Match and find the clicked question with the question from
    // the json schema
    var findQuestion = function(question) {
      // parseInt is used as the answer reference number is initially a string
      // needs to be turned into a number to result in a match.
      return question.number === parseInt(answerReference.number);
    };

    // Array of matched answers for checking purposes
    var schemaMatch = questions.filter(findQuestion);

    // Checking for correct or incorrect
    function correctOrIncorrect(schemaMatch, answerReference) {
      if (schemaMatch[0].answer === answerReference.logic) {
        ui.answerCorrect('Well done, you are correct', clickedConfirmElement);
      } else {
        ui.answerIncorrect(questionNumber);
      }
    }

    // Call function above
    correctOrIncorrect(schemaMatch, answerReference);
  },

  questionCheckMultiMulti: function(parent, clickedConfirmElement) {
    var questionNumber = parent.getAttribute('data-number');

    function findSeletedAnswerDataLogic() {
      // Get array of both true/false buttons based on parent passed
      // from ui object
      var selectButtons = parent.children[1].children;
      var selectedButtons = [];
      // Loop through array to find '.selected'
      for (var i = 0; i < selectButtons.length; i++) {
        // look for the selected element within the array
        if (selectButtons[i].classList.contains('selected')) {
          // push buttons that are selected to selectedButtons array
          selectedButtons.push(selectButtons[i].getAttribute('data-logic'));
        }
      }
      return selectedButtons;
    }

    // Currently reviewing question type and sending to the correct methods for review
    // I.E. either multi-choice or true-false
    function sendAnswerForCheckAgainstSchema() {
      // This variable relates to the return value above
      // findSeletedAnswerDataLogic() represents the selected button element
      var selectedAnswers = findSeletedAnswerDataLogic();
      engine.checkAnswerAgainstSchemaMultiMulti(selectedAnswers, questionNumber, clickedConfirmElement);
    }

    // Calls function above
    sendAnswerForCheckAgainstSchema();
  },

  checkAnswerAgainstSchemaMultiMulti: function(answerLogic, questionNumber, clickedConfirmElement) {
    // answerReference is an Object that has
    // answer number and references fom DOM UI actions of user
    // answerLogic is array from sendAnswerForCheckAgainstSchema
    var answerReference = {
      logic: answerLogic,
      number: questionNumber
    };

    // The Schema reference variable
    // Get all questions from the json object or schema
    var questions = settings.engine.questionSchema;

    // Match and find the clicked question with the question from
    // the json schema
    var findQuestion = function(question) {
      // parseInt is used as the answer reference number is initially a string
      // needs to be turned into a number to result in a match.
      return question.number === parseInt(answerReference.number);
    };

    // Array of matched answers for checking purposes
    var schemaMatch = questions.filter(findQuestion);

    // Checking for correct or incorrect
    function multiMultiCorrectOrIncorrect(schemaMatch, answerReference) {
      var answerFromSchema = schemaMatch[0].answer;
      var selectedAnswerFromDom = answerReference.logic;
      // calls the function below and passes the returned boolean to isCorrect variable
      var isCorrect = isCorrectChecker();

      //function that checks selected answers against the schema
      // returns boolean value
      function isCorrectChecker() {
        // true or false value to be returned.
        var isCorrectVal = false;
        // if number of selected answeres is different to number of correct answers
        // returns false
        if (answerFromSchema.length != selectedAnswerFromDom.length) {
          isCorrectVal = false;
          return isCorrectVal;
        }
        // loops through selected answers and checks them against the schema
        for (var i = 0; i < selectedAnswerFromDom.length; i++) {
          if (answerFromSchema[i] == selectedAnswerFromDom[i]) {
            isCorrectVal = true;
          } else {
            // if any of the selected answers are incorrect, a false value is returned
            isCorrectVal = false;
            return isCorrectVal;
          }
        }
        // if all is correct this will return true
        return isCorrectVal;
      }

      if (isCorrect === true) {
        ui.answerCorrect('Well done, you are correct', clickedConfirmElement);
      } else {
        ui.answerIncorrect(questionNumber);
      }
    }

    // Call function above
    multiMultiCorrectOrIncorrect(schemaMatch, answerReference, clickedConfirmElement);
  }
};

// Quiz Engine ENDS
var ui = {
  // Initialize various ui methods 
  init: function() {
    // Generate all html
    engine.htmlGenerator();

    // Initialize other ui methods
    ui.btnSelect();
    ui.pageTransitions();
    ui.setConfirmButtonEvents();
  },
  btnSelect: function() {
    var questionBtns = document.querySelector('.btn-box');
    var answerBtns = document.getElementsByClassName('answer-btn');

    // Add event listener to all answer buttons
    for (var i = 0; i < answerBtns.length; i++) {
      answerBtns[i].addEventListener('click', answerButtonClicked, false);
    }

    // answerButtonClicked Event
    function answerButtonClicked(ev) {
      // parent is btn-box
      var parent = ev.target.parentElement;
      // questionParent is question div
      questionParent = parent.parentElement;
      var questionType = questionParent.getAttribute('data-type');

      // question type checking so that if more than one answer can be selected
      if (questionType === 'multi-multi') {
        if (ev.target.classList.contains('selected')) {
          ev.target.classList.remove('selected');
        } else {
          ev.target.classList.add('selected');
        }
      } else {
        for (var i = 0; i < answerBtns.length; i++) {
          answerBtns[i].classList.remove('selected');
          ev.target.classList.add('selected');
        }
      } // if/else ENDS
    } // answerButtonClicked function Ends
  },
  setConfirmButtonEvents: function() {
    // Get all confirm buttons from DOM for event listening and question checks
    var confirmButtons = document.getElementsByClassName('confirm-btn');

    // Loop through all confirm buttons and place one time event
    Array.from(confirmButtons).forEach(function(elem) {
      // one-time event
      elem.addEventListener('click', confirmClicked, false);
    });

    // Check question based on parent element for reference purposes
    function confirmClicked(e) {
      var parentQuestionDiv = e.target.parentElement.parentElement;
      var questionType = parentQuestionDiv.getAttribute('data-type');
      engine.questionCheck(parentQuestionDiv, e.target);
    } // handler function ENDS
  },
  answerCorrect: function(msg, clickedConfirmElement) {
    // Get body element to apply new css for correct
    var getBody = document.querySelector('body');

    // Change Icon on Feedback indicator
    var feedbackItem = document.getElementById('feedbackIndicator');

    // Targets the empty paragraph element within feedback-box
    var feedBackMsg = document.querySelector('.msg');
    feedBackMsg.textContent = msg;

    // Hide the try again button
    var tryAgainBtn = document.querySelector('.try-again-btn');
    tryAgainBtn.classList.add('not-visible');

    // Change Icon on Feedback indicator
    feedbackItem.className = 'fa fa-check-circle';

    // Add correct class for color and other ui signifiers for correct answer
    getBody.classList.add('correct');

    // Hide relevant confirm button as it is no longer needed
    clickedConfirmElement.style.display = 'none';

    // Animate and show feedback answer
    ui.animateFeedbackIn();

    // Remove first TryAgain button in the stack
    ui.removeCurrentTryAgainBtn();

    // Check for final Question Event and UI
    ui.finalQuestionPageEvent(clickedConfirmElement);
  },
  // msg is never used?
  answerIncorrect: function(questionNumber, msg) {
    // Get body element to apply new css for correct
    var getBody = document.querySelector('body');
    var tryAgainBtn = document.querySelector('.try-again-btn');
    var feedbackItem = document.getElementById('feedbackIndicator');

    // Targets the empty paragraph element within feedback-box
    var tryAgainMsg = document.querySelector('.msg');
    tryAgainMsg.innerText = 'Incorrect, please try again...';

    // Change Icon on Feedback indicator
    feedbackItem.className = 'fa fa-times-circle';

    // Clear body's classslist
    getBody.className = ' ';

    // Add correct class for color and other ui signifiers for correct answer
    getBody.classList.add('incorrect');

    // Animate and show feedback answer
    ui.animateFeedbackIn('incorrect');

    // Show Try again button
    ui.tryAgainReset(tryAgainBtn, questionNumber);
  },

  tryAgainReset: function(el, questionNumber) {
    // Add event element to Try Again Reset and then clear the UI .
    var tryAgainButtons = document.getElementsByClassName('try-again-btn');

    var currentQuestionTryAgainButton = tryAgainButtons['0'];

    currentQuestionTryAgainButton.classList.remove('not-visible');
    // Loop through all confirm buttons and place event.

    // One time click event for buttons
    Array.from(tryAgainButtons).forEach(function(elem) {
      elem.addEventListener(
        'click',
        function(elem) {
          tryAgainClicked();
        },
        false
      );
    });

    // If tryAgain button is clicked trigger an animation
    function tryAgainClicked() {
      ui.animateFeedbackOut();
    }
  },
  // Method that removes current tryAgain button from the DOM
  removeCurrentTryAgainBtn: function() {
    // Find and remove current try-again button
    var tryAgainButtons = document.getElementsByClassName('try-again-btn');
    var currentQuestionTryAgainButton = tryAgainButtons['0'];
    currentQuestionTryAgainButton.parentNode.removeChild(currentQuestionTryAgainButton);
  },
  // Method that clears various ui, including try again button and inner text feedback msg. 
  clearUi: function() {
    // Get body element to clear classList
    var getBody = document.querySelector('body');

    // Remove selected from buttons
    var answerBtns = document.getElementsByClassName('answer-btn');

    // Remove try again button with a css class addition
    var tryAgainBtn = document.querySelector('.try-again-btn');
    // This conditional is used as there is no try again button on the final page
    if (tryAgainBtn) {
      tryAgainBtn.classList.add('not-visible');
    }

    // // Reset Message to an empty string
    var tryAgainMsg = document.querySelector('.msg');
    tryAgainMsg.innerText = ' ';

    // Clear body's classslist
    getBody.className = ' ';
  },
  // Method to control page transitions
  pageTransitions: function() {
    // Custom js for page transitions - Imported may need refactoring
    var navItems = document.querySelectorAll('nav > ul > li');
    var sectionItems = document.querySelectorAll('.container > section');
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].onclick = (function(i) {
        return function() {
          setActive(i, navItems);
          setActive(i, sectionItems);
        };
      })(i);
    } // loop ENDS
    function setActive(index, array) {
      for (var i = 0; i < array.length; i++) {
        array[i].classList.remove('active');
      }
      array[index].classList.add('active');
    } // setActive ENDS

    // Testing buttons for back and next transitions
    document.getElementById('next').onclick = ui.nextSection;
    document.getElementById('back').onclick = ui.previousSection;
  },
  // Move to the next section with aforementioned page transition 
  nextSection: function() {
    // Get all the section elements on the page
    var sectionItems = document.querySelectorAll('.container > section');
    var currentSection, nextSection;
    // Check each section for active element and assign markers
    for (var i = 0; i < sectionItems.length; i++) {
      // If one of the section items contains active and there is another section item
      if (sectionItems[i].classList.contains('active') && sectionItems[i + 1]) {
        // Mark the current section
        currentSection = sectionItems[i];
        // Mark the next section
        nextSection = sectionItems[i + 1];
        break;
      }
    } // for loop ends
    pageTransition(currentSection, nextSection);

    // Remove active from current add active to next section
    // This changes the page/section transition, if nextSection is not there (null or undefined)
    // The quiz is on the last page and now more transitions will occur
    // Change the active state of the sections - Do a page transition
    function pageTransition(current, next) {
      current.classList.remove('active');
      next.classList.add('active');
    }

    // Remove feedback to prep for next slide
    ui.animateFeedbackOut();
  },
  previousSection: function() {
    // Get all the section elements on the page
    var sectionItems = document.querySelectorAll('.container > section');
    var currentSection, previousSection;

    // Check each section for active element and assign markers
    for (var i = 0; i < sectionItems.length; i++) {
      if (sectionItems[i].classList.contains('active') && sectionItems[i - 1]) {
        currentSection = sectionItems[i];
        previousSection = sectionItems[i - 1];
      }
    }

    // Remove active from current add active to previous section
    // The quiz is on the last page and now more transitions will occur
    if (previousSection) {
      currentSection.classList.remove('active');
      previousSection.classList.add('active');
    }
  },
  // Animation control for feedback to fly onto the screen
  animateFeedbackIn: function(incorrect) {
    anime({
      targets: '.feedback-msg',
      opacity: 1,
      duration: 700
    });

    // If an incorrect argument comes 'shake' also use ..
    // a complete method to trigger the shake effect for the
    // try again.
    if (incorrect) {
      anime({
        targets: '.feedback-msg',
        left: 0,
        duration: 1000,
        elasticity: 100,
        complete: function() {
          ui.shake();
        }
      });
    } else {
      // If the answer is correct the complete callback after the feedback
      // has animated will remove the first try again button (current button) from
      // the DOM. - Anime.js
      anime({
        targets: '.feedback-msg',
        left: 0,
        duration: 1000,
        elasticity: 100
      });
    }
  },
  // Animation control for feedback to exit the screen
  animateFeedbackOut: function() {
    // Animate the feedback msg
    anime({
      targets: '.feedback-msg',
      opacity: 0,
      duration: 700
    });
    // Using Anime.js
    anime({
      targets: '.feedback-msg',
      left: -3000,
      duration: 500,
      elasticity: 100,
      complete: function() {
        // Clear the UI
        ui.clearUi();
      }
    });
  },
  // Shake effect for the tryAgain button
  shake: function() {
    var xMax = 12;
    anime({
      targets: '.try-again-btn',
      easing: 'easeInOutSine',
      duration: 550,
      loop: 2,
      translateX: [
        {
          value: xMax * -1
        },
        {
          value: xMax
        },
        {
          value: xMax / -2
        },
        {
          value: xMax / 2
        },
        {
          value: 0
        }
      ]
    });
  },
  // Method to control and look for the final question. Allows for final event method also. 
  finalQuestionPageEvent: function (confirmRef) {  
    // These variables find and convert the question number for the conditional check
    var parts = confirmRef.id.split("-");
    var getQuestionNumberFromId = parseInt(parts[parts.length - 1]);
    var numberOfQuestions = settings.engine.questionSchema.length;

    // Conditional for final page check
    if (getQuestionNumberFromId === numberOfQuestions) {
      setTimeout(function() {
        ui.nextSection();
      }, 1500);
      ui.finalEvent();
    } else {
      // A timeout that moves to the next section after 2 seconds
      // may be better to be triggered from a button click
      setTimeout(function() {
        ui.nextSection();
      }, 1500);
    } // else conditional ends.
  },
  finalEvent: function () {
    // Final page event code here
    console.log('final page event!');
  }
};

// Initialize the ui
ui.init();
