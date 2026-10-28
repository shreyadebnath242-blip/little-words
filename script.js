// background photos, they are in the images folder
const images = [
  "bg1.jpg",
  "bg2.jpg",
  "bg3.jpg",
  "bg4.jpg",
  "bg5.jpg"
];

// api link (gives us a quote and author)
const url = "https://dummyjson.com/quotes/random";

// getting stuff from the html
const message = document.getElementById("message");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const retryBtn = document.getElementById("retryBtn");
const card = document.getElementById("card");
const bg = document.getElementById("bg");

let lastImage = -1;
let lastColor = -1;

// dark gradients for the card (burgundy, cherry red, black, beige-ish)
const cardColors = [
  "linear-gradient(135deg, #0f0606 0%, #3a0c0c 45%, #6a1616 100%)",
  "linear-gradient(135deg, #0a0a0a 0%, #1c0a10 50%, #45101c 100%)",
  "linear-gradient(135deg, #14100b 0%, #2e2417 50%, #51412b 100%)",
  "linear-gradient(135deg, #1a0d0a 0%, #3b1a14 50%, #2a0b12 100%)"
];

// changes the background photo
function changeBackground() {
  if (images.length === 0) {
    return;
  }

  let number = Math.floor(Math.random() * images.length);

  // so we dont get the same photo twice in a row
  if (number === lastImage) {
    number = (number + 1) % images.length;
  }
  lastImage = number;

  // fade the old photo out, swap it, then fade the new one in
  bg.style.opacity = 0;
  setTimeout(function () {
    bg.style.backgroundImage =
      "linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('" + images[number] + "')";
    bg.style.opacity = 1;
  }, 800);
}

// changes the card colour
function changeCardColor() {
  let number = Math.floor(Math.random() * cardColors.length);

  // not the same colour twice in a row
  if (number === lastColor) {
    number = (number + 1) % cardColors.length;
  }
  lastColor = number;

  card.style.background = cardColors[number];
}

// makes the card tilt a little different each time
function tiltCard() {
  const angle = Math.random() * 4 - 2;
  card.style.transform = "rotate(" + angle + "deg)";
}

async function getQuote() {
  // show loading
  message.textContent = "Loading...";
  message.className = "";
  message.hidden = false;
  quoteText.hidden = true;
  authorText.hidden = true;
  retryBtn.hidden = true;
  newQuoteBtn.disabled = true;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("API problem");
    }

    const data = await response.json();

    // show the quote
    message.hidden = true;
    quoteText.textContent = '"' + data.quote + '"';
    authorText.textContent = "- " + data.author;
    quoteText.hidden = false;
    authorText.hidden = false;

    changeBackground();
    tiltCard();
    changeCardColor();
  } catch (error) {
    // something went wrong (no internet or api down)
    console.log(error);
    message.textContent = "Oops, the quote guy is sleeping 😴 Check your internet or try again in a bit.";
    message.className = "error";
    message.hidden = false;
    retryBtn.hidden = false;
  }

  newQuoteBtn.disabled = false;
}

newQuoteBtn.addEventListener("click", getQuote);
retryBtn.addEventListener("click", getQuote);

// get a quote when page opens
getQuote();
