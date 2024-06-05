/* eslint-disable no-console */
/* eslint-disable no-undef */
class Slide {
  constructor(container) {
    this.initializeSlide(container);
  }

  initializeSlide(container) {
    if (!container || !container.children.length) {
      console.error('Elemento não encontrado ou não possui filhos.');
      return;
    }

    const dots = container.parentElement.querySelector('.dots');
    if (!dots) {
      console.error('Elementos .dot não encontrados.');
      return;
    }

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let slideWidth = 0;

    const images = container.querySelectorAll('img');
    if (images.length) {
      slideWidth = images[0].getBoundingClientRect().width;
    }


    function showSlide(index, transition = true) {
      const newPosition = -slideWidth * (index ); 
      
      if (transition) {
        container.style.transition = 'transform 0.5s ease';
        container.style.transform = `translateX(${newPosition}px)`;
      } else {
        container.style.transition = 'none';
        container.style.transform = `translateX(${newPosition}px)`;
      }
    
      const containerRect = container.getBoundingClientRect();
      const slideRect = container.children[index ].getBoundingClientRect(); 
      
      if (slideRect.right > containerRect.right) {
        const adjustment = containerRect.right - slideRect.right;
        container.style.transform = `translateX(${newPosition + adjustment}px)`;
      } else if (slideRect.left < containerRect.left) {
        const adjustment = containerRect.left - slideRect.left;
        container.style.transform = `translateX(${newPosition + adjustment}px)`;
      }
    }
    
    

    function updateDots(index) {
      const dots = container.parentElement.querySelector('.dots');
      if (!dots) {
        console.error('Elementos .dot não encontrados.');
        return;
      }
    
      const dotElements = dots.querySelectorAll('.dot');
      const dotsCount = dotElements.length;
    
      dotElements.forEach(dot => {
        if (dot.classList) {
          dot.classList.remove('active-dot');
        }
      });
    
      if (dotsCount > 0) {
        const targetIndex = index >= dotsCount ? dotsCount - 1 : index < 0 ? 0 : index;
        dotElements[targetIndex].classList.add('active-dot');
      }
    }
    

    dots.querySelectorAll('.dot').forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        currentIndex = dotIndex;
        showSlide(currentIndex);
        updateDots(currentIndex);
      });
    });
    

    function handleMouseDown(e) {
      isDragging = true;
      startX = e.clientX;
      container.style.transition = 'none';
    }

    function handleMouseMove(e) {
      if (!isDragging) return;
      const x = e.clientX;
      const distance = x - startX;
      container.style.transform = `translateX(-${slideWidth * currentIndex + distance}px)`;
    }

    function handleMouseUp(e) {
      if (!isDragging) return;
      const x = e.clientX;
      const distance = x - startX;
      const dragThreshold = 50;
    
      if (Math.abs(distance) > dragThreshold) {
        if (distance < 0) {
          currentIndex++;
        } else {
          currentIndex--;
        }
      }
    
    
      currentIndex = Math.max(0, Math.min(currentIndex, dots.children.length - 1));
    

      showSlide(currentIndex, true);
    
      updateDots(currentIndex);
    
      isDragging = false;
    }
    
    
    
    

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    container.addEventListener('transitionend', () => {
      if (container.children[currentIndex].classList.contains('clone')) {
        container.style.transition = 'none';
        if (currentIndex === 0) {
          currentIndex = dots.children.length - 1;
          container.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        } else if (currentIndex === dots.children.length) {
          currentIndex = 0;
          container.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        }
      }
    });

    showSlide(currentIndex);
    updateDots(currentIndex);
  }
}

export default Slide;
