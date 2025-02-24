document.addEventListener("DOMContentLoaded", () => {
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip, SplitText);

// Lenis Smooth Scrolling
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// CSS Variables
const rootStyles = getComputedStyle(document.documentElement);
const cubicDefault = rootStyles.getPropertyValue("--cubic-default").trim();
const durationDefault = parseFloat(rootStyles.getPropertyValue("--duration-default")) || 0.735;
const animationSmooth = rootStyles.getPropertyValue("--animation-smooth").trim();

// Initial Setup
gsap.set(".intro", { display: "flex", autoAlpha: 1 });
gsap.set([".nav", ".bg-grid.active", ".home-hero"], { autoAlpha: 0 });

const imageWrap = document.querySelector(".intro-image_wrap");
if (imageWrap) {
  const naturalHeight = imageWrap.offsetHeight;
  gsap.set(imageWrap, { height: 0, overflow: "hidden", autoAlpha: 1, willChange: "height" });

  const image = imageWrap.querySelector("img");
  if (image && !image.complete) {
    image.onload = startAnimation;
  } else {
    startAnimation();
  }

  function startAnimation() {
    imageWrap.offsetHeight; // Force repaint
    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(imageWrap, { height: naturalHeight, duration: durationDefault, ease: cubicDefault }, 0.3)
      .to(".intro-logo__top", { y: "-50%", duration: durationDefault, ease: cubicDefault }, 0)
      .to(".intro-logo__bot", { y: "50%", duration: durationDefault, ease: cubicDefault }, 0)
      .to(".intro", {
      autoAlpha: 0,
      duration: durationDefault,
      ease: cubicDefault,
      onComplete: () => {
        gsap.set(".intro", { display: "none" });
        gsap.to([".nav", ".bg-grid.active", ".home-hero"], {
          autoAlpha: 1,
          duration: durationDefault,
          ease: animationSmooth,
        });
      }
    }, "+=0.5");
  }
}

// Progress Bar Animation
const progressBar = document.querySelector('.progress-bar');
const progressBarWrap = document.querySelector('.progress-bar-wrap');

if (progressBar && progressBarWrap) {
  gsap.to(progressBar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
    },
  });

  progressBarWrap.addEventListener('click', (event) => {
    const progress = event.clientX / progressBarWrap.offsetWidth;
    const scrollPosition = progress * (document.body.scrollHeight - window.innerHeight);
    gsap.to(window, { scrollTo: scrollPosition, duration: 0.725, ease: 'power3.out' });
  });  
}

// Flip Animation
const grid = document.querySelector(".grid-layout");
const gridItems = document.querySelectorAll(".grid-layout__image");

if (grid && gridItems.length) {
  gridItems.forEach((item) => item.classList.add("final-state"));
  grid.classList.add("final-state");
  const state = Flip.getState([grid, ...gridItems], { props: "opacity,borderRadius" });
  grid.classList.remove("final-state");
  gridItems.forEach((item) => item.classList.remove("final-state"));

  Flip.to(state, {
    ease: "none",
    absolute: true,
    scale: true,
    scrollTrigger: {
      trigger: ".grid-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });
}

// Rolling Icon Animation
const usps = document.querySelectorAll(".usp");
const icon = document.querySelector("[data-usp-icon]");

if (usps.length && icon) {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".usps",
      start: "top center",
      end: "bottom center",
      scrub: true,
    }
  });

  // Ensure the icon starts at the first USP
  gsap.set(icon, { 
    y: 0, 
    rotation: 0,
    clearProps: "transform" 
  });

  usps.forEach((usp, index) => {
    if (index === 0) return; 

    tl.to(icon, { 
      y: `+=10.33em`, 
      rotation: "+=180", 
      duration: 1 
    });
  });
}
});



document.addEventListener("DOMContentLoaded", function () {
gsap.registerPlugin(SplitText, ScrollTrigger);

function initSplit(next) {
  next = next || document;
  let lineTargets = next.querySelectorAll('[data-split="lines"]');
  let splitTextLines = null;

  function splitText() {
    if (splitTextLines) splitTextLines.revert(); // Reset previous instances

    splitTextLines = new SplitText(lineTargets, {
      type: "lines",
      linesClass: "single-line"
    });

    // Wrap each line inside a .single-line-wrap div
    splitTextLines.lines.forEach((line) => {
      let wrapper = document.createElement('div');
      wrapper.classList.add('single-line-wrap');
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
  }

  splitText();
}

function revealOnScroll() {
  gsap.utils.toArray("[data-reveal='scroll']").forEach(element => {
    gsap.fromTo(element.querySelectorAll(".single-line") || element, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger: {
                  trigger: element,
                  start: "top 85%",
                  toggleActions: "play none none none"
                }}
               );
  });
}

// Initialize SplitText and Scroll Reveal
initSplit();
revealOnScroll();
});


function initModalBasic() {

const modalGroup = document.querySelector('[data-modal-group-status]');
const modals = document.querySelectorAll('[data-modal-name]');
const modalTargets = document.querySelectorAll('[data-modal-target]');

// Open modal
modalTargets.forEach((modalTarget) => {
  modalTarget.addEventListener('click', function () {
    const modalTargetName = this.getAttribute('data-modal-target');

    // Close all modals
    modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
    modals.forEach((modal) => modal.setAttribute('data-modal-status', 'not-active'));

    // Activate clicked modal
    document.querySelector(`[data-modal-target="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');
    document.querySelector(`[data-modal-name="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');

    // Set group to active
    if (modalGroup) {
      modalGroup.setAttribute('data-modal-group-status', 'active');
    }
  });
});

// Close modal
document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
  closeBtn.addEventListener('click', closeAllModals);
});

// Close modal on `Escape` key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeAllModals();
  }
});

// Function to close all modals
function closeAllModals() {
  modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));

  if (modalGroup) {
    modalGroup.setAttribute('data-modal-group-status', 'not-active');
  }
}
}

// Initialize Basic Modal
document.addEventListener('DOMContentLoaded', () => {
initModalBasic();
});



document.querySelectorAll(".nav").forEach(navWrap => {
const hamburgerEl = navWrap.querySelector(".button.is--menu");
const menuContainEl = navWrap.querySelector(".menu-contain");
const flipItemEl = navWrap.querySelector(".button-base");
const menuWrapEl = navWrap.querySelector(".menu-wrapper");
const menuBaseEl = navWrap.querySelector(".menu-base");
const menuLinkEl = navWrap.querySelectorAll(".menu-link");

const flipDuration = 0.6;

function flip(forwards) {
    const state = Flip.getState(flipItemEl);
    if (forwards) {
        menuContainEl.appendChild(flipItemEl);
    } else {
        hamburgerEl.appendChild(flipItemEl);
    }
    Flip.from(state, { duration: flipDuration });
}

const tl = gsap.timeline({ paused: true });
tl.set(menuWrapEl, { display: "flex" });
tl.from(menuBaseEl, {
    opacity: 0,
    duration: flipDuration,
    ease: "none",
    onStart: () => flip(true)
});
tl.from(menuLinkEl, {
    opacity: 0,
    yPercent: 50,
    duration: 0.2,
    stagger: { amount: 0.2 },
    onReverseComplete: () => flip(false)
});

function openMenu(open) {
    if (!tl.isActive()) {
        if (open) {
            tl.play();
            hamburgerEl.classList.add("nav-open");
        } else {
            tl.reverse();
            hamburgerEl.classList.remove("nav-open");
        }
    }
}

hamburgerEl.addEventListener("click", () => {
    openMenu(!hamburgerEl.classList.contains("nav-open"));
});

menuBaseEl.addEventListener("mouseenter", () => openMenu(false));
menuBaseEl.addEventListener("click", () => openMenu(false));

document.addEventListener("keydown", e => {
    if (e.key === "Escape") openMenu(false);
});

menuLinkEl.forEach(link => {
    link.addEventListener("click", () => openMenu(false));
});
});


function initSliders(next) {
const sliderLists = gsap.utils.toArray(next.querySelectorAll('[data-slider="list"]'));

sliderLists.forEach((wrapper) => {
  const slides = gsap.utils.toArray(wrapper.querySelectorAll('[data-slider="slide"]'));
  const section = wrapper.closest(".section");
  const thumbs = section ? gsap.utils.toArray(section.querySelectorAll('[data-slider="button"]')) : [];
  
  let activeElement;
  let activeThumb;
  let autoplay;

  const loop = horizontalLoop(slides, {
    paused: true,
    draggable: true,
    center: true,
    onChange: (element, index) => {
      activeElement && activeElement.classList.remove("active");
      element.classList.add("active");
      activeElement = element;

      if (thumbs.length > 0) {
        activeThumb && activeThumb.classList.remove("active");
        thumbs[index].classList.add("active");
        activeThumb = thumbs[index];
      }
    }
  });

  loop.toIndex(3, { ease: "linear", duration: 0.1 });

  ScrollTrigger.create({
    trigger: wrapper,
    start: "top 75%",
    once: true,
    onEnter: () => {
      loop.toIndex(4, { ease: "cubic-bezier(0.625, 0.05, 0, 1)", duration: 0.725 });
    }
  });

  function startAutoplay() {
    if (!autoplay) {
      autoplay = gsap.delayedCall(4, autoplayNext);
    }
  }

  function stopAutoplay() {
    autoplay && autoplay.kill();
    autoplay = null;
  }

  function autoplayNext() {
    loop.next({ ease: "cubic-bezier(0.625, 0.05, 0, 1)", duration: 0.725 });
    autoplay = gsap.delayedCall(4, autoplayNext);
  }

  ScrollTrigger.create({
    trigger: wrapper,
    start: "top bottom",
    end: "bottom top",
    onEnter: startAutoplay,
    onLeave: stopAutoplay,
    onEnterBack: startAutoplay,
    onLeaveBack: stopAutoplay
  });

  [wrapper].forEach((element) => {
    if (element) {
      element.addEventListener("mouseenter", stopAutoplay);
      element.addEventListener("mouseleave", () => {
        if (ScrollTrigger.isInViewport(wrapper)) startAutoplay();
      });
    }
  });

  slides.forEach((slide, i) =>
    slide.addEventListener("click", () =>
      loop.toIndex(i, { ease: "cubic-bezier(0.625, 0.05, 0, 1)", duration: 0.725 })
    )
  );

  if (thumbs.length > 0) {
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener("click", () => {
        loop.toIndex(i, { ease: "cubic-bezier(0.625, 0.05, 0, 1)", duration: 0.725 });

        activeThumb && activeThumb.classList.remove("active");
        thumb.classList.add("active");
        activeThumb = thumb;
      });
    });
  }
});
}




