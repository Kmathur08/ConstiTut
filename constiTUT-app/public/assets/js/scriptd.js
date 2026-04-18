const quiz = document.getElementById('quiz-btn');

if (quiz) {
quiz.addEventListener("click", ()=>{
  // Remove selected class from all interactive elements
    document.querySelectorAll('.lesson-content, #video-heading, #quiz-btn, #crossword-btn, #quest-btn').forEach(element => {
    element.classList.remove("selected");
  });
  quiz.classList.add("selected");
  const quizTemplate = `
      <div id="quiz-container">
          <h1>Quiz App</h1>
          <div id="question-container">
              <p id="question"></p>
              <ul id="answers">
                  <!-- Options will be injected here -->
              </ul>
          </div>
          <button id="next-btn" onclick="nextQuestion()">Next</button>

      </div>
  `;
  document.getElementById("content").innerHTML = quizTemplate;
   const quizwrap=document.getElementById("content");
   quizwrap.classList.add("flex","justify-center","bg-pink-300");
   

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');

// Fetch quiz data from the API
fetch('/api/quiz')
  .then(response => response.json())
  .then(data => {
    quizData = data; // Store quiz data in a variable
    loadQuestion();
  })
  .catch(error => console.error('Error fetching quiz data:', error));

function loadQuestion() {
    resetState();

    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('btn');
        button.addEventListener('click', selectAnswer);
        answersElement.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = 'none';
    while (answersElement.firstChild) {
        answersElement.removeChild(answersElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const selectedAnswer = selectedButton.textContent;
    const correctAnswer = quizData[currentQuestionIndex].correctAnswer;

    if (selectedAnswer === correctAnswer) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('incorrect');
    }

    Array.from(answersElement.children).forEach(button => {
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
        }
        button.disabled = true;
    });

    nextButton.style.display = 'block';
}

nextButton.addEventListener("click",()=>
{
  nextQuestion();
})

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    resetState();
    questionElement.textContent = `You scored ${score} out of ${quizData.length}!`;
    nextButton.textContent = 'Restart';
    nextButton.style.display = 'block';
    nextButton.addEventListener('click', restartQuiz);
    if(score==20)
    {
        nextButton.textContent='Congratulations';
        congrats();
    }
}

function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    nextButton.textContent = 'Next';
    loadQuestion();
}

function congrats() {
    var end = Date.now() + (15 * 1000);

    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    document.getElementsByClassName("effect")[0].addEventListener("click", () => {
        var end = Date.now() + (15 * 1000);

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    });
}

});
}

document.addEventListener('DOMContentLoaded', function() {
  const crosswordBtn = document.getElementById('crossword-btn');
  const questBtn = document.getElementById('quest-btn');

  // Crossword functionality - opens in new tab
  crosswordBtn.addEventListener("click", () => {
    window.open('/Crossword.html', '_blank');
  });

  // Quest functionality - opens in new tab
  questBtn.addEventListener("click", () => {
    window.open('/quest.html', '_blank');
  });
});
