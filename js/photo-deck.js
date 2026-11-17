(() => {
  const deck = document.querySelector(".photo-deck");
  const stack = document.querySelector("#photo-stack");
  const nextButton = document.querySelector("#deck-next");
  const pauseButton = document.querySelector("#deck-pause");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cards = Array.from(stack.querySelectorAll(".photo-card"));

  const SHUFFLE_INTERVAL = 5000;
  const HALF_SHUFFLE_DURATION = 380;
  let timer;
  let shuffling = false;
  let paused = reducedMotion.matches;
  let pointerInside = false;

  function updatePositions() {
    cards.forEach((card, index) => {
      card.dataset.position = index;
      card.setAttribute("aria-hidden", String(index !== 0));
    });
  }

  function scheduleShuffle() {
    window.clearTimeout(timer);
    const focused = deck.contains(document.activeElement);
    if (!paused && !pointerInside && !focused && !document.hidden) {
      timer = window.setTimeout(shuffle, SHUFFLE_INTERVAL);
    }
  }

  function updatePauseButton() {
    pauseButton.textContent = paused ? "Resume" : "Pause";
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.setAttribute(
      "aria-label",
      paused
        ? "Resume automatic photo shuffle"
        : "Pause automatic photo shuffle",
    );
  }

  async function shuffle() {
    if (shuffling) return;
    window.clearTimeout(timer);
    shuffling = true;
    const frontCard = cards[0];
    frontCard.classList.add("is-shuffling");
    let outgoingAnimation;
    let returningAnimation;

    try {
      if (!reducedMotion.matches) {
        // Pull the front card clear of the stack before moving it underneath.
        outgoingAnimation = frontCard.animate(
          [
            { transform: getComputedStyle(frontCard).transform },
            { transform: "translate(82%, -12%) rotate(18deg)" },
          ],
          {
            duration: HALF_SHUFFLE_DURATION,
            easing: "ease-in-out",
            fill: "forwards",
          },
        );
        await outgoingAnimation.finished;
      }

      cards.push(cards.shift());
      updatePositions();

      if (outgoingAnimation) {
        // The other cards settle forward while this card slides into the back.
        returningAnimation = frontCard.animate(
          [
            { transform: "translate(82%, -12%) rotate(18deg)" },
            { transform: "translate(24px, 12px) rotate(9deg)" },
          ],
          {
            duration: HALF_SHUFFLE_DURATION,
            easing: "ease-in-out",
            fill: "forwards",
          },
        );
        await returningAnimation.finished;
      }
    } finally {
      outgoingAnimation?.cancel();
      returningAnimation?.cancel();
      frontCard.classList.remove("is-shuffling");
      shuffling = false;
      scheduleShuffle();
    }
  }

  nextButton.addEventListener("click", shuffle);
  pauseButton.addEventListener("click", () => {
    paused = !paused;
    updatePauseButton();
    scheduleShuffle();
  });
  deck.addEventListener("pointerenter", () => {
    pointerInside = true;
    window.clearTimeout(timer);
  });
  deck.addEventListener("pointerleave", () => {
    pointerInside = false;
    scheduleShuffle();
  });
  deck.addEventListener("focusin", () => window.clearTimeout(timer));
  deck.addEventListener("focusout", () => {
    // Wait for focus to reach its next element before deciding to restart.
    window.setTimeout(scheduleShuffle, 0);
  });
  document.addEventListener("visibilitychange", scheduleShuffle);
  reducedMotion.addEventListener("change", () => {
    paused = reducedMotion.matches;
    updatePauseButton();
    scheduleShuffle();
  });

  updatePositions();
  updatePauseButton();
  scheduleShuffle();
})();
