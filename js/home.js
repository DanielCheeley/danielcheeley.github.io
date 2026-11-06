const output = document.querySelector("#terminal-output");
const form = document.querySelector("#terminal-form");
const input = document.querySelector("#terminal-input");
const history = [];
let historyIndex = 0;

// Each destination is a link the visitor can choose to open.
const destinations = {
  projects: [
    "Development portfolio ↗",
    "https://danielcheeley.github.io/react-portfolio/",
  ],
  blog: ["Read the blog →", "blog.html"],
  github: ["Explore my GitHub ↗", "https://github.com/DanielCheeley"],
  retro: ["Enter retro mode →", "retro.html"],
};
const responses = {
  about:
    "Hey, I’m Daniel Cheeley. I’m interested in web and game development, and I love learning by building. My portfolio is where I share my development work; this site is the more personal side.",
  interests:
    "Software & games / motorcycles & mechanics / aviation / circuitry / piano & guitar / 3D modeling\n\nDifferent interests. Same instinct: figure out how it works, then try making something.",
  surprise:
    "     __o\n   _ \\<_\n  (_)/(_)\n\nA tiny two-wheeled detour. Even a terminal needs some fresh air.",
};
const commands = {
  about: "Meet the person behind the page",
  interests: "Beyond the keyboard",
  projects: "My development portfolio",
  blog: "Notes along the way",
  github: "Browse my code",
  retro: "Visit the old-school site",
  photos: "Shuffle the photo deck",
  date: "Your local date and time",
  links: "All the places to explore",
  history: "Commands you’ve tried this session",
  surprise: "A small detour",
  clear: "Clear the console",
  help: "Show this command list",
};

function runCommand(value) {
  const command = value.trim().toLowerCase();
  if (!command) return;
  history.push(value.trim());
  historyIndex = history.length;
  input.value = "";
  if (command === "clear") {
    output.replaceChildren();
    return;
  }

  const entry = document.createElement("div");
  entry.className = "terminal-entry";
  const line = document.createElement("p");
  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = "daniel ~ $";
  line.append(prompt, document.createTextNode(value.trim()));
  const response = document.createElement("p");
  response.className = "response";

  const destination =
    command === "portfolio" ? destinations.projects : destinations[command];
  if (destination || command === "links") {
    for (const [label, href] of destination
      ? [destination]
      : Object.values(destinations)) {
      const link = document.createElement("a");
      link.textContent = label;
      link.href = href;
      response.append(link, document.createElement("br"));
    }
  } else if (command === "help") {
    response.textContent =
      Object.entries(commands)
        .map(([name, description]) => `${name.padEnd(11)} ${description}`)
        .join("\n") + "\n\n↑ / ↓ revisit commands · Enter runs a command";
  } else if (command === "date") {
    response.textContent = new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date());
  } else if (command === "history") {
    response.textContent = history
      .map((item, index) => `${index + 1}  ${item}`)
      .join("\n");
  } else if (command === "photos") {
    document.querySelector("#deck-next").click();
    response.textContent =
      "Shuffling the photo deck above. A different moment, the same curiosity.";
  } else {
    response.textContent =
      (Object.hasOwn(responses, command) ? responses[command] : null) ||
      `Unknown command: ${value.trim()}\nTry “help” to see what’s here.`;
  }

  entry.append(line, response);
  output.append(entry);
  // Keep long sessions from growing the page indefinitely.
  while (output.children.length > 30) output.firstElementChild.remove();
  output.scrollTop = Math.max(0, output.scrollHeight - entry.offsetHeight);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(input.value);
});
document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => runCommand(button.dataset.command));
});
input.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  event.preventDefault();
  historyIndex = Math.max(
    0,
    Math.min(history.length, historyIndex + (event.key === "ArrowUp" ? -1 : 1)),
  );
  input.value = history[historyIndex] || "";
});
