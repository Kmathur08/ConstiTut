const quiz=document.getElementById('quiz-btn');
quiz.addEventListener("click", ()=>{
  console.log("hello");
  document.querySelectorAll('#element').forEach(element=>
  {
    element.classList.remove("selected")
  }
  )
  quiz.classList.add("selected")
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
fetch('http://localhost:3000/api/quiz')
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

const prev=document.getElementById("prev");
const next=document.getElementById("next");


function displayContent(id){
    
}



next.addEventListener("click",()=>
{
    document.getElementsByClassName('left').innerHTML=
    `<div
          class="flex flex-col bg-white mt-5 ml-5 py-10 px-5 rounded-xl gap-7 justify-center items-center h-xl shadow-2xl"
        >
          <h1 class="text-3xl font-bold">${a}</h1>
          <div class="chap flex flex-col gap-3">
            <div class="name flex gap-4 text-center justify-center items-center"> 
            <i id="prev" class="ctrl fa-solid fa-chevron-left transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover: duration-300 ..."></i>
            <h3 class="ctrl text-xl font-sm">Lesson ${3}: ${PoP}</h3>
            <i id="next" class="fa-solid fa-chevron-right transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover: duration-300 ..."></i>
              <hr />
            </div>
            <div class="learn flex flex-col gap-3" id="course">
              <p id="element1" class="video-heading rounded-xl px-5 py-4">
                ${PopV}
              </p>
              <p id="element" class="rounded-xl px-5 py-4">
                ${Role}
              </p>
              <p id="element" class="rounded-xl px-5 py-4">
                ${Election}
              </p>
              <p id="quiz-btn" class="rounded-xl px-5 py-4">Quiz 1</p>
              <p
                id="element"
                class="cross rounded-xl px-5 py-4"
                onclick="redirectToPage('Crossword.html')"
              >
              ${Crossword}
              </p>
              <p
                id="element"
                class="rounded-xl px-5 py-4"
                onclick="redirectToPage('quest.html')"
              >
              ${Quest}
              </p>
            </div>
          </div>
        </div>`
}
)