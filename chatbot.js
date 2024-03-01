const API_KEY = "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";

// collect input
const input = document.getElementById("chatbot-input");
const submitButton = document.getElementById("ask-chatbot");
const output = document.getElementById("chatbot-output");

submitButton.addEventListener("click", function() {
  const userPart = "<b>Your question:</b> " + input.value + "<br>";

  generateResponse(input.value)
      .then(chatbotResponse => {
          const finalOutput = userPart + "<b>Chatbot's response:</b> " + chatbotResponse;
          output.innerHTML = finalOutput;
      })
      .catch(error => {
          console.error('Error:', error);
          const errorMessage = "Oops! Something went wrong. Please try again.";
          const finalOutput = userPart + "<b>Chatbot's response:</b> " + errorMessage;
          output.innerHTML = finalOutput;
      });

  input.value = "";
});


function generateResponse(userInput) {
  const API_URL = "https://api.openai.com/v1/chat/completions";

  // Define the request payload
  const requestOptions = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userInput }],
      })
  };

  // Send a POST request to OpenAI API
  return fetch(API_URL, requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          // Extract the chatbot's response from the API response
          return data.choices[0].message.content.trim();
      })
      .catch(error => {
          console.error('Error fetching data:', error);
          return "Oops! Something went wrong. Please try again.";
      });
}


