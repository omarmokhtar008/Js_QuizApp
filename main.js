// Select Elements
let countSpanElement = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizAreaElement = document.querySelector(".quiz-area");
let answersAreaElement = document.querySelector(".answers-area");
let submitButtonElement = document.querySelector(".submit-button");
let resultsContainerElement = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswersCount = 0;
let countdownInterval;

function getQuestions() {
  let httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;

      // Create Bullets + Set Questions Count
      createBullets(questionsCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], questionsCount);

      // Start CountDown
      countdown(3, questionsCount);

      // Click On Submit
      submitButtonElement.onclick = () => {
        // Get Right Answer
        let correctAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check The Answer
        checkAnswer(correctAnswer, questionsCount);

        // Remove Previous Question
        quizAreaElement.innerHTML = "";
        answersAreaElement.innerHTML = "";

        // Add Question Data
        addQuestionData(questionsObject[currentIndex], questionsCount);

        // Handle Bullets Class
        handleBullets();

        // Start CountDown
        clearInterval(countdownInterval);
        countdown(3, questionsCount);

        // Show Results
        showResults(questionsCount);
      };
    }
  };

  httpRequest.open("GET", "html_questions.json", true);
  httpRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpanElement.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let bulletSpan = document.createElement("span");

    // Check If Its First Span
    if (i === 0) {
      bulletSpan.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(bulletSpan);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitleElement = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questionTitleElement.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizAreaElement.appendChild(questionTitleElement);

    // Create an array to hold the answers
    let answersArray = [];

    // Populate the array with the answers and their respective keys
    for (let i = 1; i <= 4; i++) {
      let answerKey = `answer_${i}`;
      answersArray.push({ key: answerKey, value: obj[answerKey] });
    }

    // Shuffle the answers array
    shuffleArray(answersArray);

    // Create The Answers
    answersArray.forEach(answerObj => {
      // Create Main Answer Div
      let answerDiv = document.createElement("div");

      // Add Class To Main Div
      answerDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = answerObj.key;
      radioInput.dataset.answer = answerObj.value;

      // Create Label
      let answerLabel = document.createElement("label");

      // Add For Attribute
      answerLabel.htmlFor = answerObj.key;

      // Create Label Text
      let labelText = document.createTextNode(answerObj.value);

      // Add The Text To Label
      answerLabel.appendChild(labelText);

      // Add Input + Label To Main Div
      answerDiv.appendChild(radioInput);
      answerDiv.appendChild(answerLabel);

      // Append All Divs To Answers Area
      answersAreaElement.appendChild(answerDiv);
    });
  }
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function checkAnswer(correctAnswer, count) {
  let answers = document.getElementsByName("question");
  let selectedAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      selectedAnswer = answers[i].dataset.answer;
    }
  }

  if (correctAnswer === selectedAnswer) {
    rightAnswersCount++;
  }
}

function handleBullets() {
  let bulletSpans = document.querySelectorAll(".bullets .spans span");
  let spansArray = Array.from(bulletSpans);
  spansArray.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let results;
  if (currentIndex === count) {
    quizAreaElement.remove();
    answersAreaElement.remove();
    submitButtonElement.remove();
    bulletsContainer.remove();

    if (rightAnswersCount > count / 2 && rightAnswersCount < count) {
      results = `<span class="good">Good</span>, ${rightAnswersCount} From ${count}`;
    } else if (rightAnswersCount === count) {
      results = `<span class="perfect">Perfect</span>, All Answers Are Correct`;
    } else {
      results = `<span class="bad">Bad</span>, ${rightAnswersCount} From ${count}`;
    }

    resultsContainerElement.innerHTML = results;
    resultsContainerElement.style.padding = "10px";
    resultsContainerElement.style.backgroundColor = "white";
    resultsContainerElement.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButtonElement.click();
      }
    }, 1000);
  }
}
