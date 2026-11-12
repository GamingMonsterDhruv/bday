
import { gsap } from "gsap";

/* =========================================
   1. ELEMENTS
========================================= */

const dialogueText = document.getElementById("letter-dialogue-text");
const chutkuFace = document.getElementById("letter-chutku-face");
const letterScene = document.getElementById("letter-screen");

const takeLetterButton = document.getElementById("take-letter-button");

const envelopeArea = document.getElementById("envelope-area");
const envelope = document.getElementById("envelope");
const envelopeSeal = document.getElementById("envelope-seal");

const letterDisplay = document.getElementById("letter-display");
const letterImage = document.getElementById("handwritten-letter-image");

const returnLetterButton = document.getElementById("return-letter-button");

const zoomButton = document.getElementById("zoom-letter-button");
const zoomOverlay = document.getElementById("letter-zoom-overlay");
const zoomedImage = document.getElementById("zoomed-letter-image");
const closeZoomButton = document.getElementById("close-letter-zoom");


/* =========================================
   2. STATE
========================================= */

let typingTimer = null;
let opened = false;
let initialised = false;


/* =========================================
   3. TYPEWRITER
========================================= */

function typeLetterDialogue(message, callback) {

    clearInterval(typingTimer);

    dialogueText.textContent = "";

    let index = 0;

    typingTimer = setInterval(() => {

        dialogueText.textContent += message[index];

        index++;

        if (index >= message.length) {

            clearInterval(typingTimer);
            typingTimer = null;

            if (callback) {
                callback();
            }

        }

    }, 38);

}

function waitForLetterClick(callback) {
    if (!letterScene) return;

    const handleClick = (event) => {
        if (typingTimer || event.target.closest("button, input, textarea, a")) {
            return;
        }

        letterScene.removeEventListener("click", handleClick);
        callback();
    };

    letterScene.addEventListener("click", handleClick);
}


/* =========================================
   4. CHUTKU EXPRESSIONS
========================================= */

function setLetterExpression(expression) {

    const sprites = {
        happy: "assets/poses/happy.png",
        nervous: "assets/poses/nervous.png",
        embarrassed: "assets/poses/embarrassed.png",
        surprised: "assets/poses/surprised.png",
        idle: "assets/poses/idle.png"
    };

    const sprite = sprites[expression] || sprites.idle;
    chutkuFace.innerHTML = `<img src="${sprite}" alt="Chutku">`;

    gsap.fromTo(
        chutkuFace,
        {
            y: 0
        },
        {
            y: -9,
            duration: 0.25,
            yoyo: true,
            repeat: 1
        }
    );

}


/* =========================================
   5. INITIALISE LETTER SCENE
========================================= */

export function initLetter() {

    if (initialised) return;

    initialised = true;

    opened = false;

    envelope.classList.remove("opened");

    envelopeArea.classList.add("hidden");
    letterDisplay.classList.add("hidden");
    zoomOverlay.classList.add("hidden");

    takeLetterButton.classList.add("hidden");

    setLetterExpression("happy");

    typeLetterDialogue(
        "Oh wait! I almost forgot something. My creator specifically told me to give you this.",
        () => {
            waitForLetterClick(() => {
                setLetterExpression("nervous");

                typeLetterDialogue(
                    "He was very particular about this one. So please handle it carefully!"
                , () => {

                    takeLetterButton.classList.remove("hidden");

                    gsap.fromTo(
                        takeLetterButton,
                        {
                            opacity: 0,
                            y: 15
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5
                        }
                    );

                });

            });

        }
    );

}


/* =========================================
   6. TAKE THE ENVELOPE
========================================= */

takeLetterButton.addEventListener("click", () => {

    takeLetterButton.classList.add("hidden");

    setLetterExpression("happy");

    gsap.to(".letter-introduction", {

        y: -35,
        opacity: 0.5,
        duration: 0.4

    });

    envelopeArea.classList.remove("hidden");

    gsap.fromTo(
        envelopeArea,
        {
            opacity: 0,
            y: 35,
            scale: 0.85
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.5)"
        }
    );

});


/* =========================================
   7. OPEN ENVELOPE
========================================= */

envelopeSeal.addEventListener("click", () => {

    if (opened) return;

    opened = true;

    envelope.classList.add("opened");

    envelopeSeal.disabled = true;

    setTimeout(() => {

        gsap.to(envelopeArea, {

            opacity: 0,
            y: -30,
            duration: 0.5,

            onComplete: () => {

                envelopeArea.classList.add("hidden");

                letterDisplay.classList.remove("hidden");

                gsap.fromTo(
                    letterDisplay,
                    {
                        opacity: 0,
                        scale: 0.9,
                        y: 25
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power2.out"
                    }
                );

            }

        });

    }, 1000);

});


/* =========================================
   8. LETTER IMAGE FALLBACK
========================================= */

letterImage.addEventListener("error", () => {

    const placeholder = document.createElement("div");

    placeholder.className = "letter-image-placeholder";

    placeholder.innerHTML = `
        <span>♡</span>
        <p>Your handwritten letter will appear here.</p>
        <small>Add letter1.png to public/assets/letter/</small>
    `;

    zoomButton.replaceWith(placeholder);

    // Zoom is unavailable until the real image is added.
    returnLetterButton.style.marginTop = "15px";

});


/* =========================================
   9. ZOOM INTO LETTER
========================================= */

zoomButton.addEventListener("click", () => {

    if (!letterImage.complete || !letterImage.naturalWidth) {
        return;
    }

    zoomedImage.src = letterImage.src;

    zoomOverlay.classList.remove("hidden");

    gsap.fromTo(
        zoomOverlay,
        {
            opacity: 0
        },
        {
            opacity: 1,
            duration: 0.3
        }
    );

});


function closeLetterZoom() {

    gsap.to(zoomOverlay, {

        opacity: 0,
        duration: 0.25,

        onComplete: () => {
            zoomOverlay.classList.add("hidden");
        }

    });

}


closeZoomButton.addEventListener("click", closeLetterZoom);

zoomOverlay.addEventListener("click", (event) => {

    if (event.target === zoomOverlay) {
        closeLetterZoom();
    }

});


/* =========================================
   10. RETURN LETTER TO CHUTKU
========================================= */

returnLetterButton.addEventListener("click", () => {

    if (!zoomOverlay.classList.contains("hidden")) {
        closeLetterZoom();
    }

    gsap.to(letterDisplay, {

        opacity: 0,
        y: 20,
        duration: 0.4,

        onComplete: () => {

            window.dispatchEvent(
                new CustomEvent("letterReturned")
            );

        }

    });

});
