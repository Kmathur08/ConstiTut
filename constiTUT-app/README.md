# ConstiTUT - Indian Constitution Learning Platform

An interactive educational web application for learning about the Indian Constitution through structured lessons, quizzes, videos, and games.

## Features

- **Interactive Lessons**: Learn about the Indian Constitution with structured content
- **Quiz System**: Test your knowledge with multiple-choice questions
- **Video Content**: Educational videos on constitutional topics
- **Games**: Crossword puzzles and constitutional quest
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and go to `http://localhost:3000`

## Project Structure

```
constiTUT-app/
├── server.js          # Main Express server
├── videoData.js       # Video metadata
├── package.json       # Dependencies and scripts
├── public/            # Static frontend files
│   ├── index.html     # Landing page
│   ├── dash.html      # Dashboard
│   ├── study.html     # Study materials
│   ├── quest.html     # Constitutional quest
│   ├── Crossword.html # Crossword game
│   ├── signup.html    # Sign up page
│   ├── about.html     # About page
│   └── assets/        # Static assets
│       ├── css/       # Stylesheets
│       ├── js/        # JavaScript files
│       ├── image/     # Images
│       └── videos/    # Video files
```

## API Endpoints

- `GET /` - Serve the main application
- `GET /api/content` - Get all constitution content
- `GET /api/content/:heading` - Get specific content by heading
- `GET /api/quiz` - Get quiz questions
- `GET /api/left` - Get sidebar navigation data
- `GET /api/videos` - Get video metadata
- `GET /api/videos/:title` - Get metadata for a specific video
- `GET /videos/:title` - Serve video files

## Development

The application serves static files from the `public` directory and provides REST API endpoints for dynamic content. The frontend makes AJAX calls to the backend APIs for quizzes, content, and video data.

## License

ISC</content>
<parameter name="filePath">c:\Users\Kshit\OneDrive\Desktop\ConstiTUT-main\ConstiTUT-main\constiTUT-app\README.md