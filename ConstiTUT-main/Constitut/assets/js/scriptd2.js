let selectedHeading;
const read=document.getElementsByClassName('read');
const img=document.getElementById('img');
// Function to fetch and display content based on the selected heading
function fetchAndDisplayContent(heading) {
    // Convert heading to slug format
    const slugHeading = heading.split(' ').join('-'); // Convert spaces to hyphens
    fetch(`http://localhost:3000/api/content/${slugHeading}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching content');
        }
        return response.json();
      })
      .then(data => {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = `
          <h4 class="text-center text-xl font-medium">${data.heading}</h4>
          ${data.content.map(contentItem => `
            <div class="main mt-5">
              <h5 class="font-medium">${contentItem.title}</h5>
              ${contentItem.content.map(item => `<li>${item}</li>`).join('')}
            </div>
          `).join('')}
        `;
      })
      .catch(error => console.error('Error fetching content:', error));
  }
  
// Function to add click event listeners to all heading elements
function setupClickEvents() {
  const elements = document.querySelectorAll('#element');
  
  elements.forEach(element => {
    element.addEventListener('click', event => {
      videoPlayer.style.display = "none";
      videoPlayer.pause();
      document.getElementById("content").style.display="block"
      document.getElementById('element1').classList.remove("selected")
      elements.forEach(el => el.classList.remove('selected')); // Remove 'selected' from all
      element.classList.add('selected'); // Add 'selected' to clicked element
      selectedHeading = element.textContent.trim().split(' ').join('-'); // Convert to slug format
      console.log('Selected Heading:', selectedHeading);
      
      const contentDiv = document.getElementById('content');
      contentDiv.classList.remove("flex","justify-center","bg-pink-300");
      const quiz=document.getElementById('quiz-btn');
      quiz.classList.remove("selected")
      // Fetch and display content for the selected heading
      fetchAndDisplayContent(selectedHeading);
    });
  });
}

// Initialize the page by setting up event listeners
setupClickEvents();





const videos = {
  "Powers of President": "/assets/videos/POP FINAL.mp4",
  "Legislative Role of the President": "https://example.com/legislative-role.mp4",
  "Judicial and Emergency Powers": "https://example.com/judicial-emergency.mp4"
};

// Get the video player and the video source element
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');

// Get all headings with class 'video-heading'
const videoHeadings = document.querySelectorAll('#element1');

// Function to update the video source
function updateVideoSource(title) {
  const videoUrl = videos[title];  // Get the video URL from the object using the title as a key
  
  if (videoUrl) {
      videoSource.src = videoUrl;
      videoPlayer.load();  // Reload the video with the new source
      videoPlayer.play();  // Play the video automatically
  } else {
      alert('Video not found!');
  }
}

// Add click event listeners to each video heading
videoHeadings.forEach(heading => {
  heading.addEventListener('click', () => {
  videoPlayer.style.display="block";
  // pic.style.display="none";
  
    document.getElementById('element1').classList.add("selected")
    
    const clickedTitle = heading.textContent.trim();  // Get the text content of the clicked heading
      console.log(clickedTitle)
    updateVideoSource(clickedTitle);  // Update the video source based on the clicked title 
    document.getElementById("content").style.display="none"
  });
});



//Redirecting to game page by clicking
function redirectToPage(url) {
  window.location.href = url; // Redirects to the specified URL
}

