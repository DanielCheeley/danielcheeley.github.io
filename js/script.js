const commands = [
  "Hello! My name is Dan!",
  "Who am I really? I am very passionate about my hobbies. At the moment, I am learning web/game development, learning to become a pilot, C++/C#/python, circuitry, mechanics, piano, guitar, and 3D modeling. I want to be able to get into the web/game development scene so that I can really boost my professional learning. In the future, I want to be able to turn my hobbies into a career, which is a philosophy I think everyone should have to enjoy what they do.",
  "What Are My Future Goals? I have a handful of longterm goals that I am reaching toward, each of them are ment to push me to grow in my hobbies. A few of my long term goals include becoming a pilot, making a full fleged game, building my own cpu, and rebuilding my motorcycle. All of these goals push me to keep learning more and help me from buring out. When something goes wrong you use it to learn more about the activity you are doing and grow further than you ever thought you could.",
  "“There is a perfect and full life out there that you never knew could be lived, there is no big secret to find it as it lay right before you. Waiting...” — Daniel Alexander Cheeley"
];

const terminal = document.getElementById("terminal");
const promptText = "C:\\User\\admin> ";

let commandIndex = 0;
let charIndex = 0;
let currentLine = null;

function typeCommand() {
  if (commandIndex >= commands.length) {
    typewritterLoop()
    return;
  }

  //Create new line + prompt
  if (charIndex === 0) {
    currentLine = document.createElement("p");
    currentLine.innerHTML =
      `<span class="cmdPrompt">${promptText}</span><span class="text"></span>`;
    terminal.appendChild(currentLine);

    //Pause after prompt appears
    addCursor();

    setTimeout(() => { //add a cursor during wait then remove when wait over
      deleteCursor();
      typeCommand();
    }, 800);

    charIndex++;
    return;
  }

  const textSpan = currentLine.querySelector(".text");
  const currentCommand = commands[commandIndex];

  if (charIndex - 1 < currentCommand.length) {
    textSpan.textContent += currentCommand.charAt(charIndex - 1);
    charIndex++;
    setTimeout(typeCommand, 20);
  } else {
    commandIndex++;
    charIndex = 0;

    //add a cursor during wait then remove when wait over
    addCursor();
    setTimeout(() => {
      deleteCursor();
      typeCommand();
    }, 800); // pause between commands
  }
}

function addCursor() {
  const cursor = document.createElement("span");
  cursor.classList.add("cursor");
  cursor.textContent = "█";
  cursor.id = "activeCursor";
  terminal.lastChild.appendChild(cursor);
}

function deleteCursor() {
  const cursor = document.getElementById("activeCursor");
  if (cursor) cursor.remove();
}

typeCommand();

function typewritterLoop() {

  const words = ["Developer!", "Pilot!", "Creator!", "Engineer!", "Dreamer!", "Gamer!"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  // Create new line once
  currentLine = document.createElement("p");
  currentLine.innerHTML =
    `<span class="cmdPrompt">${promptText}</span><span class="text"></span>`;
  terminal.appendChild(currentLine);

  const textSpan = currentLine.querySelector(".text");

  function loop() {
    const baseText = "I am a ";
    const currentWord = words[wordIndex];

    if (!deleting) {
      // Typing forward
      if (charIndex < currentWord.length) {
        textSpan.textContent = baseText + currentWord.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(loop, 80);
      } else {
        // Pause before deleting
        addCursor();
        setTimeout(() => {
        deleteCursor();
        }, 2000);
        setTimeout(() => deleting = true, 1000);
        setTimeout(loop, 2000);
      }

    } else {
      // Deleting backward
      if (charIndex > 0) {
        textSpan.textContent = baseText + currentWord.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(loop, 50);
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(loop, 400);
      }
    }
  }

  loop();
}