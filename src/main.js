
import "./style.css";
import { gsap } from "gsap";

import { initScrapbook } from "./scrapbook.js";
import { initLetter } from "./letter.js";
import { initCake } from "./cake.js";

/* =========================================
   1. HTML ELEMENTS
========================================= */

const startScreen = document.getElementById("start-screen");
const introScreen = document.getElementById("intro-screen");
const scrapbookScreen = document.getElementById("scrapbook-screen");
const letterScreen = document.getElementById("letter-screen");
const cakeScreen = document.getElementById("cake-screen");

const summonButton = document.getElementById("summon-button");

const dialogueText = document.getElementById("dialogue-text");
const dialogueCursor = document.getElementById("dialogue-cursor");

const passwordArea = document.getElementById("password-area");
const passwordInput = document.getElementById("password-input");
const passwordButton = document.getElementById("password-button");
const passwordError = document.getElementById("password-error");

const introContinue = document.getElementById("intro-continue");
const continueButton = document.getElementById("continue-button");

const chutkuCharacter = document.getElementById("chutku-character");
const chutkuFace = document.getElementById("chutku-face");

const orientationScreen = document.getElementById("orientation-screen");
const heartContainer = document.getElementById("heart-container");


/* =========================================
   2. CHUTKU SPRITES
========================================= */

const chutkuSprites = {
    idle: "assets/poses/idle.png",
    talking: "assets/poses/talking.png",
    happy: "assets/poses/happy.png",
    angry: "assets/poses/angry.png",
    embarrassed: "assets/poses/embarrassed.png",
    surprised: "assets/poses/surprised.png",
    thinking: "assets/poses/thinking.png",
    nervous: "assets/poses/nervous.png",
    carryingBox: "assets/poses/carrying-box.png",
    hugging: "assets/poses/hugging.png"
};


/* =========================================
   3. GAME STATE
========================================= */

let nextDestination = "scrapbook";

let typingTimer = null;
let dialogueSequenceTimer = null;

let gameStarted = false;


/* =========================================
   4. SCENE MANAGEMENT
========================================= */

function showScene(sceneToShow) {

    if (!sceneToShow) {
        console.error("Scene not found!");
        return;
    }

    const scenes = [
        startScreen,
        introScreen,
        scrapbookScreen,
        letterScreen,
        cakeScreen
    ].filter(Boolean);

    scenes.forEach(scene => {
        const isTarget = scene === sceneToShow;

        scene.classList.toggle("hidden", !isTarget);
        scene.classList.toggle("active", isTarget);
    });

    if (sceneToShow !== scrapbookScreen) {
        document.getElementById("book-finish")?.classList.add("hidden");
    }

    // Make the requested scene visible even if it started hidden.
    sceneToShow.classList.remove("hidden");
    sceneToShow.classList.add("active");

    gsap.fromTo(
        sceneToShow,
        {
            opacity: 0,
            scale: 0.98
        },
        {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power2.out"
        }
    );
}


/* =========================================
   5. HEART ANIMATION
========================================= */

function createHearts() {

    if (!heartContainer) return;

    heartContainer.innerHTML = "";

    for (let i = 0; i < 12; i++) {

        const heart = document.createElement("span");

        heart.className = "falling-heart";
        heart.textContent = "♥";

        heart.style.left = `${Math.random() * 90}%`;
        heart.style.animationDelay = `${Math.random() * 3}s`;

        heartContainer.appendChild(heart);
    }
}

createHearts();


/* =========================================
   6. FULLSCREEN AND ORIENTATION
========================================= */

function enterGameMode() {

    // These are optional browser features.
    // They must never block the birthday sequence.

    if (!document.fullscreenElement) {

        document.documentElement.requestFullscreen?.()
            .catch(error => {
                console.log("Fullscreen unavailable:", error);
            });

    }

    if (screen.orientation?.lock) {

        screen.orientation.lock("landscape")
            .catch(error => {
                console.log("Landscape lock unavailable:", error);
            });

    }

    checkOrientation();
}


function checkOrientation() {

    if (!orientationScreen) return;

    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile && isPortrait) {
        orientationScreen.classList.remove("hidden");
    } else {
        orientationScreen.classList.add("hidden");
    }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);


/* =========================================
   7. TYPEWRITER DIALOGUE
========================================= */

function typeDialogue(message, callback) {

    clearInterval(typingTimer);
    clearTimeout(dialogueSequenceTimer);

    if (!dialogueText) return;

    dialogueText.textContent = "";

    dialogueCursor?.classList.remove("hidden");

    let index = 0;

    typingTimer = setInterval(() => {

        dialogueText.textContent += message[index];

        index++;

        if (index >= message.length) {

            clearInterval(typingTimer);
            typingTimer = null;

            dialogueCursor?.classList.add("hidden");

            if (callback) callback();
        }

    }, 35);
}

function waitForIntroClick(callback) {
    if (!introScreen) return;

    const handleClick = (event) => {
        if (typingTimer || event.target.closest("button, input, textarea, a")) {
            return;
        }

        introScreen.removeEventListener("click", handleClick);
        dialogueCursor?.classList.add("hidden");
        callback();
    };

    dialogueCursor.textContent = "CLICK TO CONTINUE";
    dialogueCursor.classList.remove("hidden");
    introScreen.addEventListener("click", handleClick);
}


/* =========================================
   8. CHUTKU EXPRESSIONS
========================================= */

function changeExpression(expression) {

    if (!chutkuFace || !chutkuCharacter) return;

    const imagePath = chutkuSprites[expression] || chutkuSprites.idle;

    let sprite = chutkuFace.querySelector("img");

    if (!sprite) {

        sprite = document.createElement("img");

        sprite.alt = "Chutku";

        chutkuFace.innerHTML = "";

        chutkuFace.appendChild(sprite);
    }

    sprite.src = imagePath;

    sprite.style.width = "100%";
    sprite.style.maxWidth = "190px";
    sprite.style.maxHeight = "260px";
    sprite.style.objectFit = "contain";
    sprite.style.imageRendering = "pixelated";

    sprite.onerror = () => {
        console.error("Sprite not found:", imagePath);
    };

    chutkuCharacter.classList.remove("character-bounce");

    void chutkuCharacter.offsetWidth;

    chutkuCharacter.classList.add("character-bounce");
}


/* =========================================
   9. PASSWORD INPUT
========================================= */

function showPasswordInput() {

    if (!passwordArea || !passwordInput) return;

    passwordArea.classList.remove("hidden");

    gsap.fromTo(
        passwordArea,
        {
            y: 20,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.5
        }
    );

    passwordInput.focus();
}


/* =========================================
   10. WAKE UP CHUTKU
========================================= */

function wakeUpChutku() {

    console.log("Summon button clicked. Waking Chutku...");

    if (gameStarted) return;

    gameStarted = true;

    summonButton.disabled = true;
    summonButton.textContent = "WAKING CHUTKU... ♡";

    // Start fullscreen independently.
    // Do not wait for it.
    enterGameMode();

    // Animate hearts.
    const hearts = document.querySelectorAll(".falling-heart");

    gsap.to(hearts, {
        y: -100,
        opacity: 0,
        scale: 1.8,
        stagger: 0.05,
        duration: 0.8
    });

    // Animate sleeping Chutku.
    gsap.to(".sleeping-character", {

        scale: 0,
        opacity: 0,
        duration: 0.5,

        onComplete: () => {

            console.log("Sleeping Chutku disappeared. Showing intro.");

            showScene(introScreen);

            changeExpression("surprised");

            typeDialogue(
                "Ohh! I have been summoned!",

                () => {
                    waitForIntroClick(() => {
                        changeExpression("talking");

                        typeDialogue(
                            "Hello! I am Chutku, the mind of the creator of this website.",

                            () => {
                                waitForIntroClick(() => {
                                    changeExpression("idle");

                                    typeDialogue(
                                        "Before we proceed, I need to verify who you are.",

                                        () => {
                                            waitForIntroClick(showPasswordInput);

                                        }
                                    );
                                });

                            }
                        );
                    });

                }
            );

        }

    });
}


// Attach the click event.
if (summonButton) {

    summonButton.addEventListener("click", wakeUpChutku);

} else {

    console.error("Cannot find summon-button in index.html!");

}


/* =========================================
   11. PASSWORD VALIDATION
========================================= */

function checkPassword() {

    if (!passwordArea || passwordArea.classList.contains("hidden")) return;

    const enteredPassword = passwordInput.value;

    const normalisedPassword = enteredPassword
        .toLowerCase()
        .replace(/[^a-z]/g, "");

    if (passwordError) {
        passwordError.textContent = "";
    }

    if (normalisedPassword === "madamji") {

        passwordArea.classList.add("hidden");

        changeExpression("happy");

        typeDialogue(
            "Ohh! Madam Ji! I'm so sorry, I didn't recognise you. I've been waiting for you!",

            () => {
                waitForIntroClick(() => {
                    changeExpression("nervous");

                    typeDialogue(
                        "Wait... I have something for you before we proceed.",

                        () => {

                            introContinue.classList.remove("hidden");

                            gsap.fromTo(
                                introContinue,
                                {
                                    y: 20,
                                    opacity: 0
                                },
                                {
                                    y: 0,
                                    opacity: 1,
                                    duration: 0.5
                                }
                            );

                        }
                    );

                });

            }
        );

    } else {

        changeExpression("angry");

        typeDialogue(
            "I will only allow my Madam Ji in! Tell the correct password now."
        );

        passwordInput.value = "";
        passwordInput.focus();
    }
}


passwordButton?.addEventListener("click", checkPassword);

passwordInput?.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        checkPassword();
    }

});


/* =========================================
   12. CONTINUE BUTTON
========================================= */

continueButton?.addEventListener("click", () => {

    introContinue.classList.add("hidden");

    if (nextDestination === "scrapbook") {

        changeExpression("happy");

        showScene(scrapbookScreen);

        initScrapbook();

    } else if (nextDestination === "letter") {

        changeExpression("happy");

        showScene(letterScreen);

        initLetter();

    } else if (nextDestination === "cake") {

        changeExpression("happy");

        showScene(cakeScreen);
        initCake();

    }

});


/* =========================================
   13. SCRAPBOOK RETURNED
========================================= */

window.addEventListener("scrapbookReturned", () => {

    nextDestination = "letter";

    showScene(introScreen);

    changeExpression("happy");

    continueButton.textContent = "SHOW ME THE LETTER ♡";

    typeDialogue(
        "I hope you liked it! I know my writing isn't very beautiful, but I put a lot of thought into it.",

        () => {
            waitForIntroClick(() => {
                changeExpression("nervous");

                typeDialogue(
                    "Actually... there's one more thing I have been meaning to give you.",

                    () => {

                        introContinue.classList.remove("hidden");

                        gsap.fromTo(
                            introContinue,
                            {
                                y: 20,
                                opacity: 0
                            },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.5
                            }
                        );

                    }
                );

            });

        }
    );

});


/* =========================================
   14. LETTER RETURNED
========================================= */

window.addEventListener("letterReturned", () => {

    nextDestination = "cake";

    showScene(introScreen);

    changeExpression("embarrassed");

    typeDialogue(
        "Hope you like it! Ik my writing isn't much beautiful.",

        () => {
            waitForIntroClick(() => {
                changeExpression("happy");

                typeDialogue(
                    "Okayyy! Now that the letter is safely back... let's bring out the cake!",

                    () => {

                        continueButton.textContent = "BRING OUT THE CAKE 🎂";

                        introContinue.classList.remove("hidden");

                        gsap.fromTo(
                            introContinue,
                            {
                                y: 20,
                                opacity: 0
                            },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.5
                            }
                        );

                    }
                );

            });

        }
    );

});


/* =========================================
   15. INITIAL SETUP
========================================= */

showScene(startScreen);

checkOrientation();
