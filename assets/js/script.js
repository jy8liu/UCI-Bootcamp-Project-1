document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('settingsModal');
  const openButton = document.getElementById('settings-btn');
  const closeButton = document.querySelector('.closeButton');
  const saveButton = document.getElementById('saveSettingsButton');
  const form = document.getElementById('myForm');
  

  // Open the modal when the settings button is clicked
  openButton.addEventListener('click', () => {
      modal.style.display = 'block';
  });

  // Close the modal when the 'x' button is clicked
  closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  // Close the modal when clicking outside of the modal content
  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  // Handle form submission
  form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent the default form submission

      const keywords = document.getElementById('story-keywords').value;

      // Your logic to handle the form data
      console.log('Form submitted with keywords:', keywords);
  });

  // Save settings and close the modal
  saveButton.addEventListener('click', () => {
      const mode = document.getElementById('modeSelect').value;
      const wordCount = document.getElementById('wordCountInput').value;

      // Your logic to save these settings
      console.log('Settings saved:', { mode, wordCount });

      // Close the modal
      modal.style.display = 'none';
  });
});

// generateStory function
async function generateStory(mode, wordCount, input) {
    const url = 'https://chat-gpt26.p.rapidapi.com/'; // Ensure this is the correct endpoint
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Corrected header
            'X-RapidAPI-Key': 'cb676ecd46msh069024f9ad93846p1a21efjsndac1289895d8',
            'X-RapidAPI-Host': 'chat-gpt26.p.rapidapi.com'
        },
        body: JSON.stringify({ // Correctly formatted JSON body
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `give me a story of: ${input} & mode: ${mode} word_count= ${wordCount} and /\n/g for readability`
                }
            ]
        })
    };
    
    // Select the submit button
    const submitButton = document.getElementById('submit-btn');
  
    // Add the is-loading class to show the loading state
    submitButton.classList.add('is-loading');
  
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json(); // Retrieve and parse the JSON response from the endpoint
        
        console.log(result); // Log the response for debugging
        // Display the story
        const storyText = result.choices[0].message.content; // Access the "story" key
        // Replace newline characters with HTML line breaks for proper formatting
        const formattedStoryText = storyText.replace(/\n/g, '<br>');
  
        // Display the story with line breaks
        const generatedStoryElement = document.getElementById('generatedStory');
        generatedStoryElement.style.display = 'block';
        generatedStoryElement.innerHTML = formattedStoryText;
  
        // Save the story details
        saveStoryDetails(formattedStoryText);
    } catch (error) {
        console.error("Failed to generate story:", error);
        const generatedStoryElement = document.getElementById('generatedStory');
        generatedStoryElement.style.display = 'block';
        generatedStoryElement.innerHTML = 'Failed to generate story. Please try again later.';
    } finally {
        // Remove the is-loading class once the request completes or fails
        submitButton.classList.remove('is-loading');
    }
}

// Saves story details to localStorage
function saveStoryDetails(story) {
  const pastStories = JSON.parse(localStorage.getItem('pastStories')) || [];
  pastStories.push({story, timestamp: new Date().toISOString() });
  localStorage.setItem('pastStories', JSON.stringify(pastStories));
}

// Event listener for the form submission or button click to generate story
document.getElementById('submit-btn').addEventListener('click', async function(event) {
  event.preventDefault(); // 
  
  const mode = document.getElementById('modeSelect').value;
  const wordCount = document.getElementById('wordCountInput').value;
  
  await generateStory(mode, wordCount, document.getElementById('story-keywords').value);
});

// Retrieves past stories and displays them
document.getElementById('retrieveStoriesButton').addEventListener('click', function() {
  const pastStories = JSON.parse(localStorage.getItem('pastStories')) || [];
  const storiesContainer = document.getElementById('pastStoriesContainer');
  
  // Clear existing stories
  storiesContainer.innerHTML = '';
  
  if (pastStories.length === 0) {
      storiesContainer.innerHTML = '<p>No past stories found.</p>';
  } else {
    storiesContainer.style.display = 'block';
      pastStories.forEach(story => {
          const storyDiv = document.createElement('div');
          storyDiv.innerHTML = `
              <p>Story:</p>
              <p>${story.story}</p>
              <p><i>Generated on: ${story.timestamp}</i></p>
              <br>
          `;
          storiesContainer.appendChild(storyDiv);
      });
  }
});