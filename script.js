document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('header nav button').forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})

   window.downloadCV = function () {
    const link = document.createElement('a');
    link.href = 'assets/Swarnima_Mohanta_CV.pdf';
    link.download = 'Swarnima_Mohanta_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const textElement = document.querySelector(".gradient-text");
  const texts = ["AI/ML Developer", "Coder"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100; 
  const deletingSpeed = 70; 
  const pauseBeforeDelete = 1500; 
  const pauseBeforeType = 500;

  function typeWriter() {
    const currentText = texts[textIndex];
    if (isDeleting) {
      textElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => isDeleting = true, pauseBeforeDelete);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(() => {}, pauseBeforeType); 
    }

    const currentSpeed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeWriter, currentSpeed);
  }

  typeWriter(); 

  


  let messengerReady = false;
    let cachedLauncher = null;
    let cachedChatWindow = null;

    
    window.addEventListener('dfMessengerLoaded', function () {
      const messenger = document.querySelector('df-messenger');
      setTimeout(() => {
        if (messenger && messenger.shadowRoot) {
          cachedLauncher = messenger.shadowRoot.querySelector('df-messenger-button');
          cachedChatWindow = messenger.shadowRoot.querySelector('df-messenger-chat');

          if (cachedLauncher && cachedChatWindow) {
            messengerReady = true;
            console.log("✅ Messenger ready.");

            tryInjectCloseBtn();
          }
        }
      }, 1200); 
    });

    let chatbotOpen = false;
    let cachedLauncher = null;
    let cachedChatWindow = null;
    let messengerReady = false;

    window.addEventListener('dfMessengerLoaded', function () {
      const messenger = document.querySelector('df-messenger');
      if (messenger && messenger.shadowRoot) {
        cachedLauncher = messenger.shadowRoot.querySelector('df-messenger-button');
        cachedChatWindow = messenger.shadowRoot.querySelector('df-messenger-chat');
        if (cachedLauncher && cachedChatWindow) {
          messengerReady = true;
        }
      }
    });

    function toggleChatbot() {
      if (!messengerReady || !cachedLauncher || !cachedChatWindow) {
        console.log("⚠ Chatbot not ready yet.");
        return;
      }

      if (cachedChatWindow.hasAttribute('opened')) {
        const closeIcon = cachedChatWindow.shadowRoot.querySelector('.close-icon');
        if (closeIcon) closeIcon.click();
        chatbotOpen = false;
        console.log("❌ Chatbot closed.");
      } else {
        cachedLauncher.click();
        chatbotOpen = true;
        console.log("✅ Chatbot opened.");
      }
    }


