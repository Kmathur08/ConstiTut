const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


// Use CORS to allow cross-origin requests
app.use(cors());
app.use(express.json());

// const leftside=[
//   {

//     1 :{}
//       heading: "Name",
//       lesson: "",
//       sub:[
//         "Power",
//         "Role",
//         "Election",
//         "Quiz",
//         "cross"
//       ]
      
//   }
// ]

const constitutionContent = [
  {
    heading: "Election of the President of India",
    content: [
      {
        id: 1,
        title: "Electoral College",
        content: [
          "The President is elected by an Electoral College comprising:",
          "Elected members of both Houses of Parliament.",
          "Elected members of the Legislative Assemblies of States and Union Territories."
        ]
      },
      {
        id: 2,
        title: "Proportional Representation",
        content: [
          "The election uses a proportional representation system by means of a single transferable vote.",
          "This method ensures a wide consensus in the election process.",
          "These include freedom of speech, religion, and the press."
        ]
      },
      {
        id: 3,
        title: "Voting Process",
        content: [
          "Members of the Electoral College cast their votes, which are then counted, and the candidate securing the required quota is declared elected.",
          "This method ensures a wide consensus in the election process.",
          "These include freedom of speech, religion, and the press."
        ]
      }
    ]
  },
  {
    heading: "Role and Powers of President",
    content: [
      {
        id: 1,
        title: "Executive Head of Union",
        content: [
         "The President is the nominal head of the executive.",
          "The real executive powers are exercised by the Prime Minister and the Council of Ministers.",
          "The President acts as the symbolic leader of the country and must perform all executive actions in accordance with the aid and advice of the Council of Ministers."
        ]
      },
      {
        id: 2,
        title: "Legislative Role",
        content: [
          "The Second Amendment protects the right to bear arms.",
          "It was adopted in 1791 as part of the Bill of Rights.",
          "It is one of the most debated amendments."
        ]
      },
      {
        id: 3,
        title: "Judicial and Emergency Powers",
        content: [
          "The President appoints judges of the Supreme Court and High Courts.",
          "He has the power to grant pardons and reprieves.",
          "He can declare national, state, or financial emergencies under Articles 352, 356, and 360 of the Constitution."
        ]
      }
    ]
  }
];










// Quiz Data
const quizData = [
  {
      question: "Who is the head of the Union Executive under Part 5 of the Constitution?",
      options: [
          "The President",
          "The Prime Minister",
          "The Vice President",
          "The Chief Justice"
      ],
      correctAnswer: "The President"
  },
  {
      question: "Which article under Part 5 of the Constitution deals with the President's election?",
      options: [
          "Article 52",
          "Article 54",
          "Article 56",
          "Article 58"
      ],
      correctAnswer: "Article 54"
  },
  {
      question: "Under Part 5, what is the minimum age required for a candidate to be elected as the President of India?",
      options: [
          "25 years",
          "30 years",
          "35 years",
          "40 years"
      ],
      correctAnswer: "35 years"
  },
  {
      question: "Which part of the Constitution mentions the powers and functions of the Vice President of India?",
      options: [
          "Part 5",
          "Part 6",
          "Part 7",
          "Part 8"
      ],
      correctAnswer: "Part 5"
  },
  {
      question: "What is the term of office for the President of India under Part 5 of the Constitution?",
      options: [
          "4 years",
          "5 years",
          "6 years",
          "7 years"
      ],
      correctAnswer: "5 years"
  },
  {
      question: "Under Part 5, which Article provides for the removal of the President through impeachment?",
      options: [
          "Article 61",
          "Article 62",
          "Article 63",
          "Article 64"
      ],
      correctAnswer: "Article 61"
  },
  {
      question: "Which part of the Constitution deals with the Parliament?",
      options: [
          "Part 3",
          "Part 4",
          "Part 5",
          "Part 6"
      ],
      correctAnswer: "Part 5"
  },
  {
      question: "Under Part 5, the Parliament consists of which of the following?",
      options: [
          "Lok Sabha and Rajya Sabha",
          "Lok Sabha and the President",
          "Rajya Sabha and the President",
          "Lok Sabha, Rajya Sabha, and the President"
      ],
      correctAnswer: "Lok Sabha, Rajya Sabha, and the President"
  },
  {
      question: "Which Article under Part 5 gives the Parliament the power to make laws?",
      options: [
          "Article 79",
          "Article 80",
          "Article 81",
          "Article 82"
      ],
      correctAnswer: "Article 79"
  },
  {
      question: "What is the maximum number of members allowed in the Lok Sabha as per Part 5 of the Constitution?",
      options: [
          "530",
          "545",
          "552",
          "560"
      ],
      correctAnswer: "552"
  },
  {
      question: "Under Part 5, how many members of the Rajya Sabha are nominated by the President?",
      options: [
          "10",
          "12",
          "15",
          "18"
      ],
      correctAnswer: "12"
  },
  {
      question: "Which article under Part 5 empowers the Parliament to regulate the right to freedom of trade, commerce, and intercourse?",
      options: [
          "Article 301",
          "Article 302",
          "Article 303",
          "Article 304"
      ],
      correctAnswer: "Article 302"
  },
  {
      question: "Which part of the Constitution outlines the structure and function of the State Legislatures?",
      options: [
          "Part 4",
          "Part 5",
          "Part 6",
          "Part 7"
      ],
      correctAnswer: "Part 6"
  },
  {
      question: "Who is the head of the State Executive under Part 6 of the Constitution?",
      options: [
          "The Chief Minister",
          "The Governor",
          "The Chief Justice",
          "The Speaker"
      ],
      correctAnswer: "The Governor"
  },
  {
      question: "Under Part 6, who appoints the Governor of a State?",
      options: [
          "The President",
          "The Prime Minister",
          "The Chief Minister",
          "The Chief Justice"
      ],
      correctAnswer: "The President"
  },
  {
      question: "What is the minimum age required to be appointed as a Governor under Part 6 of the Constitution?",
      options: [
          "25 years",
          "30 years",
          "35 years",
          "40 years"
      ],
      correctAnswer: "35 years"
  },
  {
      question: "Which article under Part 6 deals with the State Legislature's composition?",
      options: [
          "Article 168",
          "Article 169",
          "Article 170",
          "Article 171"
      ],
      correctAnswer: "Article 168"
  },
  {
      question: "What is the term of office for the Governor as provided under Part 6?",
      options: [
          "4 years",
          "5 years",
          "6 years",
          "7 years"
      ],
      correctAnswer: "5 years"
  },
  {
      question: "Which part of the Constitution gives the Governor the power to promulgate ordinances during recess of the State Legislature?",
      options: [
          "Part 4",
          "Part 5",
          "Part 6",
          "Part 7"
      ],
      correctAnswer: "Part 6"
  },
  {
      question: "Under Part 6, which article provides the power of the Governor to summon, prorogue, and dissolve the State Legislative Assembly?",
      options: [
          "Article 174",
          "Article 175",
          "Article 176",
          "Article 177"
      ],
      correctAnswer: "Article 174"
  }
];



const videoData = require('./videoData');

app.get('/videos/:title', (req, res) => {
  // Convert the URL-encoded title to normal and find the match
  const title = req.params.title.replace(/-/g, ' ').toLowerCase();
  
  // Debug: Log requested title and available titles
  console.log("Requested title:", title);
  console.log("Available titles:", Object.keys(videoData));
  
  // Find the matching video title (case-insensitive)
  const matchedVideo = Object.keys(videoData).find(videoTitle =>
    videoTitle.toLowerCase() === title
  );

  if (matchedVideo) {
    res.json({ title: matchedVideo, video_url: videoData[matchedVideo] });
  } else {
    // Send 404 if not found
    res.status(404).json({ error: 'Video not found' });
  }
});


app.get('/api/left', (req, res) => {
  res.json(leftside);
});









// Endpoint to get quiz data
app.get('/api/quiz', (req, res) => {
  res.json(quizData);
});

// API route to get all content
app.get('/api/content', (req, res) => {
  res.json(constitutionContent);
});

app.get('/api/content/:heading', (req, res) => {
  const requestedHeading = req.params.heading.split('-').join(' '); // Convert URL slug to heading
  const content = constitutionContent.find(item => item.heading === requestedHeading);

  if (content) {
    res.json(content);
  } else {
    res.status(404).send('Content not found');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

