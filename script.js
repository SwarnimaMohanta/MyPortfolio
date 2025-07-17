document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', function () {
        const target = document.querySelector(this.getAttribute('data-target'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    function downloadCV() {
      const link = document.createElement('a');
      link.href = 'cv.pdf'; 
      link.download = 'My_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
      const textElement = document.querySelector(".gradient-text");

    const texts = ["AI/ML Developer", "Coder"];

    async function typeText(text) {
      for (let i = 0; i < text.length; i++) {
        textElement.textContent += text[i];
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    async function deleteText() {
      while (textElement.textContent.length > 0) {
        textElement.textContent = textElement.textContent.slice(0, -1);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    async function loopAnimation() {
      let index = 0;
      while (true) {
        await typeText(texts[index]);
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        await deleteText();
        await new Promise(resolve => setTimeout(resolve, 500));  
        index = (index + 1) % texts.length; 
      }
    }

    loopAnimation();
