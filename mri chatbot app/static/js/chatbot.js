async function loadChatbotModal() {
  const response = await fetch("/chatbot/chatbot_modal.html");
  const modalHtml = await response.text();
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  console.log("Modal loaded into the DOM.");

  const sendButton = document.getElementById("sendPrompt");
  const userPrompt = document.getElementById("userPrompt");
  const chatbotResponseDiv = document.getElementById("chatbotResponse");

  if (sendButton && userPrompt && chatbotResponseDiv) {
    sendButton.addEventListener("click", async () => {
      const question = userPrompt.value.trim(); // Remove whitespace from the question
      if (!question) {
        console.error("The user question is empty.");
        chatbotResponseDiv.innerText = "Please enter a question before sending!"; // User information
        return;
      }

      console.log("User question:", question);

      // Clear the input field after clicking the button
      userPrompt.value = "";
      chatbotResponseDiv.innerText = "Please wait, generating a response..."; // Temporary message

      // Send the question to the backend
      try {
        const response = await fetch("/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: question }),
        });

        const data = await response.json();
        if (data.response) {
          console.log("Response from chatbot:", data.response);
          chatbotResponseDiv.innerText = data.response; // Display the response in the UI
        } else if (data.error) {
          console.error("Error:", data.error);
          chatbotResponseDiv.innerText = "An error occurred: " + data.error;
        }
      } catch (error) {
        console.error("An error occurred while communicating with the backend:", error);
        chatbotResponseDiv.innerText =
          "A problem occurred while communicating with the server. Please try again.";
      }
    });
  } else {
    console.error(
      "Could not find #sendPrompt, #userPrompt, or #chatbotResponse."
    );
  }

  // Handle closing the modal
  const closeButton = document.getElementById("closeChatbot");
  if (closeButton) {
    closeButton.addEventListener("click", closeChatbotModal);
  } else {
    console.error("Close button not found.");
  }
}

function closeChatbotModal() {
  const chatbotModal = document.getElementById("chatbotModal"); // Assuming the modal has id "chatbotModal"
  if (chatbotModal) {
    chatbotModal.remove(); // Remove the modal from the DOM
  }
}

// Handle opening the modal
document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("openChatbot");
  if (openButton) {
    openButton.addEventListener("click", loadChatbotModal);
  } else {
    console.error("Open chatbot button not found.");
  }
});
