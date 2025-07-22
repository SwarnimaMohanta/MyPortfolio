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


  window.downloadCV = function() {
    const link = document.createElement('a');
    link.href = 'cv.pdf'; 
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

  window.robotAction = function() {
    const circle = document.getElementById("circle");
    circle.classList.add("active");
    setTimeout(() => {
      circle.classList.remove("active");
    }, 1000);
  };
});
