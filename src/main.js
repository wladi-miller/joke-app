import "./style/main.scss";
import deleteIcon from "../public/delete.svg";

const jokeText = document.querySelector(".input-joke__text");
const loadBtn = document.querySelector(".input-joke__load");
const saveBtn = document.querySelector(".input-joke__save");
const savedList = document.querySelector(".saved-jokes__list");

async function getJoke() {
  try {
    const response = await fetch(
      "https://v2.jokeapi.dev/joke/Any?lang=de&blacklistFlags=racist,sexist",
    );
    const data = await response.json();

    if (data.type === "twopart") {
      jokeText.textContent = `${data.setup} \n ${data.delivery}`;
    } else {
      jokeText.textContent = data.joke;
    }
    saveBtn.classList.add("input-joke__save--invisible");
  } catch (error) {
    alert("Fehler beim Laden des Witzes. Bitte versuche es erneut.");
  }
}

loadBtn.addEventListener("click", getJoke);
jokeText.textContent =
  "Kein Witz vorhanden, bitte den Button 'neuen Witz laden' drücken";

function saveJoke() {
  const joke = jokeText.textContent;
  const savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];
  if (!savedJokes.includes(joke)) {
    savedJokes.push(joke);
    localStorage.setItem("savedJokes", JSON.stringify(savedJokes));
    displaySavedJokes();
  } else {
    alert("Du hast diesen Witz bereits gespeichert! 🐵");
  }
}
saveBtn.addEventListener("click", saveJoke);

function deleteJoke(jokeToDelete) {
  let savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];
  savedJokes = savedJokes.filter((joke) => joke !== jokeToDelete);
  localStorage.setItem("savedJokes", JSON.stringify(savedJokes));
  displaySavedJokes();
}

function displaySavedJokes() {
  const savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];

  if (savedJokes.length > 0) {
    savedList.innerHTML = "";
  } else {
    savedList.innerHTML =
      '<p class="saved-jokes__empty-msg">Noch keine Witze gespeichert 🤷‍♂️.</p>';
  }

  savedJokes.reverse().forEach((joke) => {
    const jokeElement = document.createElement("div");
    jokeElement.classList.add("saved-joke");

    const jokeText = document.createElement("p");
    jokeText.textContent = joke;
    jokeElement.appendChild(jokeText);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    const deleteIconImg = document.createElement("img");
    deleteIconImg.src = deleteIcon;
    deleteBtn.appendChild(deleteIconImg);
    deleteBtn.addEventListener("click", () => {
      deleteJoke(joke);
    });
    jokeElement.appendChild(deleteBtn);

    savedList.appendChild(jokeElement);
  });
}
displaySavedJokes();
