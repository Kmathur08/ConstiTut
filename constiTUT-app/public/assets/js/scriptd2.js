document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content');
  const videoPlayer = document.getElementById('videoPlayer');
  const videoSource = document.getElementById('videoSource');
  const videoLesson = document.getElementById('video-heading');
  const lessonItems = document.querySelectorAll('.lesson-content');

  const lessonMap = {
    'Powers of President': {
      type: 'video',
      src: '/assets/videos/POP FINAL.mp4'
    },
    'Role and Powers of President': {
      type: 'content',
      heading: 'Role and Powers of President'
    },
    'Election of the President of India': {
      type: 'content',
      heading: 'Election of the President of India'
    }
  };

  function setActiveItem(activeItem) {
    document.querySelectorAll('.video-heading, .lesson-content').forEach(item => {
      item.classList.remove('selected');
    });
    if (activeItem) {
      activeItem.classList.add('selected');
    }
  }

  function showVideo(src) {
    if (!contentDiv || !videoPlayer || !videoSource) {
      return;
    }

    contentDiv.style.display = 'none';
    videoPlayer.style.display = 'block';
    videoSource.src = src;
    videoPlayer.load();
    videoPlayer.play().catch(() => {
      // Browsers may block autoplay in some cases; the video source still updates.
    });
  }

  function showContent(heading) {
    if (!contentDiv || !videoPlayer) {
      return;
    }

    videoPlayer.pause();
    videoPlayer.style.display = 'none';
    contentDiv.style.display = 'block';

    fetch(`/api/content/${encodeURIComponent(heading.replace(/\s+/g, '-'))}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching content');
        }
        return response.json();
      })
      .then(data => {
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
      .catch(error => {
        console.error('Error fetching content:', error);
        contentDiv.innerHTML = '<p class="text-red-600">Unable to load lesson content right now.</p>';
      });
  }

  if (videoLesson) {
    videoLesson.addEventListener('click', () => {
      setActiveItem(videoLesson);
      const lesson = lessonMap[videoLesson.textContent.trim()];
      if (lesson && lesson.type === 'video') {
        showVideo(lesson.src);
      }
    });
  }

  lessonItems.forEach(item => {
    item.addEventListener('click', () => {
      const heading = item.dataset.heading || item.textContent.trim();
      const lesson = lessonMap[heading];
      setActiveItem(item);

      if (lesson && lesson.type === 'content') {
        showContent(lesson.heading);
      }
    });
  });

  if (contentDiv) {
    contentDiv.style.display = 'block';
  }
  if (videoPlayer) {
    videoPlayer.style.display = 'none';
  }
});

