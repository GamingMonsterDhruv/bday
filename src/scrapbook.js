import { PageFlip } from "page-flip";

/* =========================================
   SCRAPBOOK CONTENT
========================================= */

const memories = [
    {
        photo: "assets/scrapbook/memory-01.jpg",
        message: "Somewhere along the way, you became one of my favourite parts of an ordinary day.",
        decoration: "flowers"
    },
    {
        photo: "assets/scrapbook/memory-02.jpg",
        message: "I don't think you realise how easily your smile can make someone's day better.",
        decoration: "hearts"
    },
    {
        photo: "assets/scrapbook/memory-03.jpg",
        message: "The little conversations, the silly moments, and everything in between. I treasure them.",
        decoration: "stars"
    },
    {
        photo: "assets/scrapbook/memory-04.jpg",
        message: "Somehow, even without trying, you make every picture look a little more beautiful.",
        decoration: "ribbons"
    },
    {
        photo: "assets/scrapbook/memory-05.jpg",
        message: "You have this wonderful way of making even the simplest things feel special.",
        decoration: "flowers"
    },
    {
        photo: "assets/scrapbook/memory-06.jpg",
        message: "Some people make memories without even trying. You're one of those people.",
        decoration: "stars"
    },
    {
        photo: "assets/scrapbook/memory-07.jpg",
        message: "If I could keep a few moments in a tiny box, I would probably fill it with moments like these.",
        decoration: "hearts"
    },
    {
        photo: "assets/scrapbook/memory-08.jpg",
        message: "And if there's one thing I hope you remember, it's that you are appreciated more than you know.",
        decoration: "ribbons"
    }
];


/* =========================================
   ELEMENTS
========================================= */

const bookElement = document.getElementById("scrapbook-book");
const scrapbookScreen = document.getElementById("scrapbook-screen");

const pageLabel = document.getElementById("book-page-label");
const finishScreen = document.getElementById("book-finish");

const rereadButton = document.getElementById("reread-book");
const returnButton = document.getElementById("return-book");

let pageFlip = null;
let currentPage = 0;
let isFlipping = false;
let hasReturned = false;


/* =========================================
   DECORATIONS
========================================= */

const decorations = {
    flowers: ["✿", "❀", "✾", "🌷"],
    hearts: ["♡", "♥", "ღ", "❣"],
    stars: ["✧", "✦", "⋆", "✩"],
    ribbons: ["୨୧", "🎀", "♡", "✧"]
};


/* =========================================
   REMOVE OLD ARROW BUTTONS
========================================= */

function removeArrowButtons() {
    document.getElementById("previous-page")?.remove();
    document.getElementById("next-page")?.remove();

    const hint = document.querySelector(".book-hint");

    if (hint) {
        hint.textContent = "Swipe the pages to explore the little book ♡";
    }
}


/* =========================================
   CREATE FRONT COVER
========================================= */

function createFrontCover() {
    return `
        <div class="page cover-page">
            <div class="cover-border">

                <div class="cover-small-text">
                    A LITTLE BOOK
                </div>

                <div class="cover-bow">୨୧</div>

                <h1>
                    For My<br>
                    Madam Ji
                </h1>

                <div class="cover-divider">
                    ♡ ─── ✿ ─── ♡
                </div>

                <p>
                    Eight little chapters<br>
                    of things I wanted you to know.
                </p>

                <div class="cover-bottom">
                    Made with love, by Dhruv ♡
                </div>

            </div>
        </div>
    `;
}


/* =========================================
   CREATE PHOTOGRAPH PAGE
========================================= */

function createPhotoPage(memory, index) {
    const decorationList = decorations[memory.decoration];

    return `
        <div class="page photo-page">

            <div class="paper-texture"></div>

            <div class="photo-page-inner">

                <div class="photo-decoration top-decoration">
                    ${decorationList[0]}
                </div>

                <div class="photo-decoration left-decoration">
                    ${decorationList[1]}
                </div>

                <div class="photo-decoration right-decoration">
                    ${decorationList[2]}
                </div>

                <div class="photo-decoration bottom-decoration">
                    ${decorationList[3]}
                </div>

                <div class="polaroid">

                    <img
                        src="${memory.photo}"
                        alt="A special memory"
                        class="memory-image"
                        loading="lazy"
                    >

                    <div class="polaroid-caption">
                        a little moment ♡
                    </div>

                </div>

                <div class="photo-tape"></div>

            </div>
        </div>
    `;
}


/* =========================================
   CREATE MESSAGE PAGE
========================================= */

function createMessagePage(memory, index) {
    const decorationList = decorations[memory.decoration];

    return `
        <div class="page message-page">

            <div class="message-paper">

                <div class="message-decoration">
                    ${decorationList[0]} ${decorationList[2]}
                </div>

                <div class="message-content">

                    <div class="message-small-heading">
                        A LITTLE NOTE FOR YOU
                    </div>

                    <p class="handwritten-message">
                        ${memory.message}
                    </p>

                </div>

                <div class="message-bottom-decoration">
                    ${decorationList[1]}
                    <span>with love ♡</span>
                    ${decorationList[3]}
                </div>

            </div>
        </div>
    `;
}


/* =========================================
   CREATE BACK COVER
========================================= */

function createBackCover() {
    return `
        <div class="page back-cover-page">

            <div class="back-cover-border">

                <div class="back-cover-decoration">
                    ♡ ୨୧ ♡
                </div>

                <h2>
                    The end of this<br>
                    little book...
                </h2>

                <p>
                    ...but hopefully not<br>
                    the end of all the little moments.
                </p>

                <div class="back-cover-signature">
                    Yours truly,<br>
                    Dhruv ♡
                </div>

            </div>
        </div>
    `;
}


/* =========================================
   BUILD ALL 18 PAGES
========================================= */

function buildBook() {
    bookElement.innerHTML = "";

    bookElement.insertAdjacentHTML(
        "beforeend",
        createFrontCover()
    );

    memories.forEach((memory, index) => {
        bookElement.insertAdjacentHTML(
            "beforeend",
            createPhotoPage(memory, index)
        );

        bookElement.insertAdjacentHTML(
            "beforeend",
            createMessagePage(memory, index)
        );
    });

    bookElement.insertAdjacentHTML(
        "beforeend",
        createBackCover()
    );
}


/* =========================================
   UPDATE PAGE LABEL
========================================= */

function updatePageLabel(pageIndex) {
    currentPage = pageIndex;

    if (pageIndex === 0) {
        pageLabel.textContent = "THE BEGINNING ♡";
    } else if (pageIndex === 17) {
        pageLabel.textContent = "THE END ♡";
    } else {
        const spreadNumber = Math.ceil(pageIndex / 2);

        pageLabel.textContent =
            `LITTLE MOMENT ${spreadNumber} OF 8 ♡`;
    }

    if (pageIndex === 17) {
        finishScreen.classList.remove("hidden");
    } else {
        finishScreen.classList.add("hidden");
    }
}


/* =========================================
   KEYBOARD NAVIGATION
========================================= */

function handleKeyboardNavigation(event) {
    if (
        !scrapbookScreen ||
        scrapbookScreen.classList.contains("hidden") ||
        !pageFlip ||
        isFlipping
    ) {
        return;
    }

    const activeElement = document.activeElement;

    if (
        activeElement &&
        ["INPUT", "TEXTAREA"].includes(activeElement.tagName)
    ) {
        return;
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();

        if (currentPage < 17) {
            isFlipping = true;
            pageFlip.flipNext();
        }
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();

        if (currentPage > 0) {
            isFlipping = true;
            pageFlip.flipPrev();
        }
    }
}


/* =========================================
   INITIALISE SCRAPBOOK
========================================= */

export function initScrapbook() {
    if (
        !bookElement ||
        !pageLabel ||
        !finishScreen ||
        !rereadButton ||
        !returnButton
    ) {
        console.error("Scrapbook HTML elements are missing.");
        return;
    }

    if (pageFlip) {
        pageFlip.destroy();
        pageFlip = null;
    }

    removeArrowButtons();

    currentPage = 0;
    isFlipping = false;
    hasReturned = false;

    buildBook();

    finishScreen.classList.add("hidden");

    pageFlip = new PageFlip(bookElement, {
        width: 480,
        height: 620,

        size: "stretch",

        minWidth: 280,
        maxWidth: 1000,

        minHeight: 350,
        maxHeight: 700,

        drawShadow: true,
        flippingTime: 1000,

        usePortrait: false,

        startPage: 0,
        startZIndex: 10,

        autoSize: true,
        maxShadowOpacity: 0.45,

        showCover: true,
        mobileScrollSupport: false,

        swipeDistance: 30,
        clickEventForward: true,
        useMouseEvents: true,
        showPageCorners: true,

        disableFlipByClick: true
    });

    pageFlip.loadFromHTML(
        bookElement.querySelectorAll(".page")
    );

    pageFlip.on("flip", (event) => {
        isFlipping = false;
        updatePageLabel(event.data);
    });

    pageFlip.on("changeState", (event) => {
        if (event.data === "flipping") {
            isFlipping = true;
        }
    });

    updatePageLabel(0);

    window.removeEventListener(
        "keydown",
        handleKeyboardNavigation
    );

    window.addEventListener(
        "keydown",
        handleKeyboardNavigation
    );

    rereadButton.onclick = () => {
        if (!pageFlip || isFlipping) return;

        isFlipping = true;
        finishScreen.classList.add("hidden");

        pageFlip.flip(0);
    };

    returnButton.onclick = () => {
        if (hasReturned) return;

        hasReturned = true;
        finishScreen.classList.add("hidden");

        window.dispatchEvent(
            new CustomEvent("scrapbookReturned")
        );
    };
}
