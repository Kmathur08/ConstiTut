// const pic=document.getElementById('pic');
// // Get the video player and the video source element
// const videoPlayer = document.getElementById('videoPlayer');
// const videoSource = document.getElementById('videoSource');

// // Get all headings with class 'video-heading'
// const videoHeadings = document.querySelectorAll('.video-heading');

// // Function to match the clicked heading with the video title and update the video source
// videoHeadings.forEach(heading => {
//   heading.addEventListener('click', () => {
//     videoPlayer.style.display="block";
//     pic.style.display="none";
//     // Get the text content of the clicked heading
//     const clickedTitle = heading.textContent.trim();

//     // Find the video that matches the title
//     const matchedVideo = videos.videoList.find(video => video.title === clickedTitle);

//     // If the video is found, update the video source and load the video
//     if (matchedVideo) {
//       videoSource.src = matchedVideo.video_url;
//       videoPlayer.load(); // Reload the video player with the new source
//       videoPlayer.play(); // Auto-play the video after loading
//     } else {
//       alert('Video not found!');
//     }
//   });
// });




// app.js

// Get the video player and the video source element
// const videoPlayer = document.getElementById('videoPlayer');
// const videoSource = document.getElementById('videoSource');

// // Function to URL encode titles (spaces to hyphens, etc.)
// function encodeTitle(title) {
//   return encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
// }

// // Function to fetch video data from the API
// function fetchVideoData(title) {
//   const encodedTitle = encodeTitle(title);
//   fetch(`http://localhost:3000/videos/${encodedTitle}`)
//     .then(response => response.json())
//     .then(data => {
//       if (data.video_url) {
//         videoSource.src = data.video_url;
//         videoPlayer.load();  // Reload the video with the new source
//         videoPlayer.play();  // Play the video automatically
//       } else {
//         alert('Video not found!');
//       }
//     })
//     .catch(error => {
//       console.error('Error fetching video data:', error);
//     });
// }

// // Get all headings with class 'video-heading'
// const videoHeadings = document.querySelectorAll('.video-heading');

// // Add click event listeners to each video heading
// videoHeadings.forEach(heading => {
//   heading.addEventListener('click', () => {
//     videoPlayer.style.display="block";
//     pic.style.display="none";
//     const clickedTitle = heading.textContent.trim();
//     fetchVideoData(clickedTitle);  // Fetch video data from API on click
//   });
// });


// Function to URL encode titles (spaces to hyphens, etc.)
// function encodeTitle(title) {
//     return encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
//   }

//   // Get the video player and the video source element
//   const videoPlayer = document.getElementById('videoPlayer');
//   const videoSource = document.getElementById('videoSource');

//   // Get all headings with class 'video-heading'
//   const videoHeadings = document.querySelectorAll('.video-heading');

//   // Function to fetch video data from API
//   function fetchVideoData(title) {
//     const encodedTitle = encodeTitle(title);
//     fetch(`http://localhost:3000/videos/${encodedTitle}`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`API request failed with status ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (data.video_url) {
//           videoSource.src = data.video_url;
//           videoPlayer.load();  // Reload the video with the new source
//           videoPlayer.play();  // Play the video automatically
//         } else {
//           alert('Video not found!');
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching video data:', error);
//       });
//   }

//   // Add click event listeners to each video heading
//   videoHeadings.forEach(heading => {
//     heading.addEventListener('click', () => {
//     videoPlayer.style.display="block";
//     pic.style.display="none";
//       const clickedTitle = heading.textContent.trim();  // Get the text content of the clicked heading
//       fetchVideoData(clickedTitle);  // Fetch video data from API on click
//     });
//   });


