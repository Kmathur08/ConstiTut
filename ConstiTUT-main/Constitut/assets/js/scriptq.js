// script.js
let currentPosition = 0;

document.getElementById('roll-dice').addEventListener('click', function() {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice').innerText = `🎲 ${diceRoll}`;
    
    // Calculate new position
    const newIndex = Math.min(currentPosition + diceRoll, 26); // Cap at the last cell
    
    movePlayer(newIndex);
});

function movePlayer(newIndex) {
    const playerToken = document.getElementById('player-token');
    const targetCell = document.getElementById(`cell-${newIndex}`);
    
    // Get the offset of the target cell relative to the game board
    const board = document.querySelector('.game-board');
    const boardRect = board.getBoundingClientRect();
    const cellRect = targetCell.getBoundingClientRect();
    
    const offsetTop = cellRect.top - boardRect.top;
    const offsetLeft = cellRect.left - boardRect.left;
    
    // Set the position of the player token relative to the game board
    playerToken.style.top = `${offsetTop + 25}px`; // Adjust the +25px to center the token
    playerToken.style.left = `${offsetLeft + 25}px`; // Adjust the +25px to center the token

    
    currentPosition = newIndex;
    
    // Trigger the question pop-up
    if (newIndex !== 0 && newIndex !== 26) {
        triggerChallenge(newIndex);
    }
    // Check if the player has reached the last cell
    if (currentPosition === 26) { // Assuming cell-25 is the last cell
       displayCongratulations();
       disableDice(); // Disable the dice control
        congrats();
   }
}

function disableDice() {
    const diceButton = document.getElementById('roll-dice');
    if (diceButton) {
        diceButton.disabled = true; // Disable the button
        diceButton.style.backgroundColor = '#ddd'; // Change color to indicate it's disabled
        diceButton.style.cursor = 'not-allowed'; // Change cursor to indicate it's disabled
    }
}
function enableDice() {
    const diceButton = document.getElementById('roll-dice');
    if (diceButton) {
        diceButton.disabled = false; // enable the button
        diceButton.style.backgroundColor = ' #4CAF50'; // Change color to indicate it's disabled
        diceButton.style.cursor = ''; // Change cursor to indicate it's disabled
    }
}


function displayCongratulations() {
    // Create a message element
    const message = document.createElement('div');
    message.id = 'congratulations-message';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = 'white';
    message.style.padding = '20px';
    message.style.borderRadius = '10px';
    message.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    message.style.zIndex = '1000';
    message.innerText = 'Congratulations! You have completed the game.';

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.addEventListener('click', function() {
        message.remove();
    });

    message.appendChild(closeButton);

    // Append the message to the body
    document.body.appendChild(message);
}



function triggerChallenge(index) {
    const questions = {
        // Part V: The Union
        1: {
            question: "Which article of the Indian Constitution vests the executive power of the Union in the President?",
            options: ["Article 52", "Article 53", "Article 54"],
            correct: "Article 53"
        },
        2: {
            question: "How long is the term of the President of India?",
            options: ["4 years", "5 years", "6 years"],
            correct: "5 years"
        },
        3: {
            question: "Which body elects the President of India?",
            options: ["The Parliament", "The State Legislatures", "The Electoral College"],
            correct: "The Electoral College"
        },
        4: {
            question: "Who appoints the Prime Minister of India?",
            options: ["The President", "The Parliament", "The Chief Justice"],
            correct: "The President"
        },
        5: {
            question: "Which article empowers the President to dissolve the Lok Sabha?",
            options: ["Article 74", "Article 75", "Article 76"],
            correct: "Article 75"
        },
        6: {
            question: "The President of India can be impeached under which article?",
            options: ["Article 61", "Article 62", "Article 63"],
            correct: "Article 61"
        },
        7: {
            question: "Which article of the Indian Constitution defines the powers and functions of the Council of Ministers?",
            options: ["Article 74", "Article 75", "Article 76"],
            correct: "Article 75"
        },
        8: {
            question: "Who is responsible for the implementation of laws in India?",
            options: ["The President", "The Prime Minister", "The Union Cabinet"],
            correct: "The Union Cabinet"
        },
        9: {
            question: "What is the maximum period that the President's Rule can be imposed in a state?",
            options: ["6 months", "1 year", "2 years"],
            correct: "1 year"
        },
        10: {
            question: "Which article provides for the appointment of the Attorney General of India?",
            options: ["Article 76", "Article 77", "Article 78"],
            correct: "Article 76"
        },
    
        // Part VI: The States
        11: {
            question: "Which article deals with the Governor's powers and responsibilities?",
            options: ["Article 153", "Article 154", "Article 155"],
            correct: "Article 154"
        },
        12: {
            question: "What is the term of office for a Governor?",
            options: ["3 years", "4 years", "5 years"],
            correct: "5 years"
        },
        13: {
            question: "Who appoints the Governor of a state?",
            options: ["The President", "The Prime Minister", "The Chief Justice"],
            correct: "The President"
        },
        14: {
            question: "Which article provides for the division of powers between the Union and the States?",
            options: ["Article 245", "Article 246", "Article 247"],
            correct: "Article 246"
        },
        15: {
            question: "The power to dissolve the State Legislative Assembly is vested in whom?",
            options: ["The Governor", "The President", "The Chief Minister"],
            correct: "The Governor"
        },
        16: {
            question: "Under which article can the President of India dissolve the State Legislative Assembly?",
            options: ["Article 174", "Article 175", "Article 176"],
            correct: "Article 174"
        },
        17: {
            question: "Which article of the Indian Constitution deals with the composition of the State Legislature?",
            options: ["Article 168", "Article 169", "Article 170"],
            correct: "Article 170"
        },
        18: {
            question: "What is the minimum age for becoming a member of the State Legislative Assembly?",
            options: ["21 years", "25 years", "30 years"],
            correct: "25 years"
        },
        19: {
            question: "Who appoints the Chief Minister of a state?",
            options: ["The Governor", "The President", "The Prime Minister"],
            correct: "The Governor"
        },
        20: {
            question: "Which article deals with the State Election Commission?",
            options: ["Article 324", "Article 325", "Article 326"],
            correct: "Article 324"
        },
        21: {
            question: "Which article empowers the Governor to reserve certain bills for the President's consideration?",
            options: ["Article 200", "Article 201", "Article 202"],
            correct: "Article 200"
        },
        22: {
            question: "The power to appoint the State's High Court judges is vested in whom?",
            options: ["The President", "The Governor", "The Chief Justice of India"],
            correct: "The Governor"
        },
        23: {
            question: "Which article describes the powers and duties of the State Legislature?",
            options: ["Article 168", "Article 169", "Article 170"],
            correct: "Article 168"
        },
        24: {
            question: "What is the minimum age for becoming a member of the State Legislative Council?",
            options: ["30 years", "25 years", "21 years"],
            correct: "30 years"
        },
        25: {
            question: "Which article deals with the Governor's responsibility for law and order in the state?",
            options: ["Article 160", "Article 161", "Article 162"],
            correct: "Article 162"
        }
    };
    

    const currentQuestion = questions[index];
    const questionModal = document.getElementById('question-modal');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    questionText.innerText = currentQuestion.question;
    optionsContainer.innerHTML = ''; // Clear previous options

    currentQuestion.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option-button');
        optionButton.innerText = option;
        optionButton.addEventListener('click', function() {
            checkAnswer(option, currentQuestion.correct);
        });
        optionsContainer.appendChild(optionButton);
    });

    questionModal.style.display = "block";
}

function checkAnswer(selected, correct) {
    const questionModal = document.getElementById('question-modal');

    if (selected === correct) {
        alert("Correct!");
    } else {
        alert("Incorrect, try again!");
        resetBoard();
    }

    questionModal.style.display = "none";
}

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('question-modal').style.display = "none";
});

// Function to reset the board
function resetBoard() {
    // Reset the player's position
    currentPosition = 0;
    const playerToken = document.getElementById('player-token');
    const startCell = document.getElementById('cell-0');

    // Get the position of the start cell relative to the game board
    const board = document.querySelector('.game-board');
    const boardRect = board.getBoundingClientRect();
    const cellRect = startCell.getBoundingClientRect();
    
    // Calculate the offsets to position the token correctly within the start cell
    const offsetTop = cellRect.top - boardRect.top;
    const offsetLeft = cellRect.left - boardRect.left;
    
    // Move the player token to the start cell
    playerToken.style.top = `${offsetTop + 25}px`;  // Adjust to center the token
    playerToken.style.left = `${offsetLeft + 25}px`; // Adjust to center the token

    // Clear the dice display
    document.getElementById('dice').innerText = "🎲";

    // Close any open modals
    document.getElementById('question-modal').style.display = "none";
    enableDice();
}

document.getElementById('reset-board').addEventListener('click', resetBoard);




const congrats=()=>
{
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var skew = 1;
    
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    (function frame() {
      var timeLeft = animationEnd - Date.now();
      var ticks = Math.max(200, 500 * (timeLeft / duration));
      skew = Math.max(0.8, skew - 0.001);
    
      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          // since particles fall down, skew start toward the top
          y: (Math.random() * skew) - 0.2
        },
        colors: ['#ffffff'],
        shapes: ['circle'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4)
      });
    
      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    }());
}