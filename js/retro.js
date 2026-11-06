const desktop = document.querySelector(".desktop");
const panels = [...document.querySelectorAll(".desktop-window")];
const showDesktopButton = document.querySelector("#show-desktop");
let topLayer = 3;

function updateTaskbar() {
  document.querySelectorAll("[data-task]").forEach((button) => {
    const panel = document.getElementById(button.dataset.task);
    button.setAttribute(
      "aria-pressed",
      String(!desktop.hidden && !panel.hidden),
    );
  });
  showDesktopButton.textContent = desktop.hidden
    ? "Restore windows"
    : "Show desktop";
}
function raise(panel) {
  panel.style.zIndex = ++topLayer;
}
function restore(panel) {
  desktop.hidden = false;
  panel.hidden = false;
  document.querySelector(`[data-task="${panel.id}"]`).hidden = false;
  raise(panel);
  updateTaskbar();
}
function maximize(panel) {
  if (window.innerWidth <= 800) return;
  const maximized = panel.classList.toggle("is-maximized");
  panel
    .querySelector('[data-action="maximize"]')
    .setAttribute("aria-pressed", String(maximized));
  // Clearing drag offsets returns the window to its original layout when restored.
  panel.classList.remove("is-floating");
  panel.removeAttribute("style");
  raise(panel);
}

panels.forEach((panel) => {
  const bar = panel.querySelector(".title-bar");
  panel.addEventListener("pointerdown", () => raise(panel));
  panel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "maximize") maximize(panel);
      else {
        panel.hidden = true;
        if (
          button.dataset.action === "close" &&
          panel.hasAttribute("data-default-hidden")
        ) {
          document.querySelector(`[data-task="${panel.id}"]`).hidden = true;
        }
      }
      updateTaskbar();
    });
  });
  bar.addEventListener("dblclick", (event) => {
    if (!event.target.closest("button")) maximize(panel);
  });
  bar.addEventListener("pointerdown", (event) => {
    if (
      event.button !== 0 ||
      event.target.closest("button") ||
      panel.classList.contains("is-maximized") ||
      window.innerWidth <= 800
    )
      return;
    const bounds = panel.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    panel.classList.add("is-floating");
    Object.assign(panel.style, {
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
    });
    bar.setPointerCapture(event.pointerId);
    bar.onpointermove = (move) => {
      panel.style.left = `${Math.max(0, Math.min(window.innerWidth - bounds.width, move.clientX - offsetX))}px`;
      panel.style.top = `${Math.max(0, Math.min(window.innerHeight - 100, move.clientY - offsetY))}px`;
    };
    bar.onlostpointercapture = () => (bar.onpointermove = null);
  });
  bar.addEventListener("pointerup", (event) => {
    if (bar.hasPointerCapture(event.pointerId))
      bar.releasePointerCapture(event.pointerId);
  });
});

document.querySelectorAll("[data-task]").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.task);
    if (desktop.hidden || panel.hidden) restore(panel);
    else {
      panel.hidden = true;
      updateTaskbar();
    }
  });
});
document.querySelectorAll("[data-restore]").forEach((button) => {
  button.addEventListener("click", () =>
    restore(document.getElementById(button.dataset.restore)),
  );
});
showDesktopButton.addEventListener("click", () => {
  desktop.hidden = !desktop.hidden;
  updateTaskbar();
});
function resetLayout() {
  desktop.hidden = false;
  panels.forEach((panel) => {
    panel.hidden = panel.hasAttribute("data-default-hidden");
    document.querySelector(`[data-task="${panel.id}"]`).hidden = panel.hidden;
    panel.classList.remove("is-floating", "is-maximized");
    panel.removeAttribute("style");
    panel
      .querySelector('[data-action="maximize"]')
      .setAttribute("aria-pressed", "false");
  });
  updateTaskbar();
}
document.querySelector("#reset-layout").addEventListener("click", resetLayout);
window.addEventListener("resize", resetLayout);

// Both desktop dialogs support the Escape key through the native dialog element.
document.querySelectorAll("[data-open-dialog]").forEach((button) => {
  button.addEventListener("click", () =>
    document.getElementById(button.dataset.openDialog).showModal(),
  );
});
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog
    .querySelector(".close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});
const clock = document.querySelector("#desktop-clock");
function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  clock.dateTime = now.toISOString();
}
updateClock();
window.setInterval(updateClock, 60000);
updateTaskbar();

// The directory’s About link also reopens Home if it was minimized.
document.querySelector('[href="#mainh2"]').addEventListener("click", () => {
  restore(document.getElementById("home-window"));
});
