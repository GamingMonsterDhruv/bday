import { gsap } from "gsap";

const $ = (id) => document.getElementById(id);

let currentPhase = "wish";
let initialised = false;

const cakeSprites = {
  happy: "assets/poses/happy.png",
  talking: "assets/poses/talking.png",
  idle: "assets/poses/idle.png",
  angry: "assets/poses/angry.png"
};

const candlePattern = [
  "1110111",
  "0010001",
  "1110111",
  "1000100",
  "1110111"
];

// Each digit 2 contains 11 candle positions.
// Together, the two digits contain exactly 22 candles.
function createCandles() {
  const container = $("cake-candles");
  container.innerHTML = "";

  const rows = [
    [1, 1, 1, 0, 1, 1, 1],
    [0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 1]
  ];

  rows.forEach((row) => {
    row.forEach((occupied) => {
      const candle = document.createElement("div");
      candle.className = occupied ? "cake-candle" : "candle-empty";

      if (occupied) {
        candle.innerHTML = '<span class="candle-flame"></span>';
      }

      container.appendChild(candle);
    });
  });
}

function dialogue(text, expression = "happy") {
  $("cake-dialogue-text").textContent = text;
  const sprite = cakeSprites[expression] || cakeSprites.idle;
  $("cake-chutku-bottom-image").src = sprite;

  gsap.fromTo(
    $("cake-dialogue-text"),
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.35 }
  );
}

function burstConfetti() {
  const container = $("cake-confetti");
  if (!container) return;

  container.innerHTML = "";
  const colors = ["#d65b86", "#f2a7c3", "#f7cf63", "#9d79c7", "#79b9b0"];

  for (let index = 0; index < 44; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.setProperty("--confetti-rotation", `${Math.random() * 360}deg`);
    container.appendChild(piece);
  }

  gsap.fromTo(
    container.children,
    { y: -30, opacity: 0, rotation: 0 },
    {
      y: 360 + Math.random() * 100,
      opacity: 1,
      rotation: 540,
      duration: 2.4,
      stagger: 0.025,
      ease: "power1.out",
      onComplete: () => { container.innerHTML = ""; }
    }
  );
}

function showOnly(element) {
  [
    $("cake-birthday"),
    $("final-darkness"),
    $("final-surprise")
  ].forEach((section) => section.classList.add("hidden"));

  element.classList.remove("hidden");
}

function playMusic() {
  const music = $("birthday-music");

  if (!music) return;

  music.volume = 0.45;

  // Browsers may block automatic audio.
  // This is also retried after the first button interaction.
  music.play().catch(() => {
    console.log("Music will start after the next user interaction.");
  });
}

function startBirthday() {
  currentPhase = "wish";

  showOnly($("cake-birthday"));

  createCandles();

  $("wish-button").classList.remove("hidden");
  $("blow-button").classList.add("hidden");
  $("fan-button").classList.add("hidden");
  $("blow-again-button").classList.add("hidden");

  dialogue(
    "Madam Ji! Your special red velvet cake is finally here! Make a wish. ♡",
    "happy"
  );

  burstConfetti();

  playMusic();

  gsap.fromTo(
    ".cake-illustration",
    { scale: 0.7, opacity: 0, y: 40 },
    { scale: 1, opacity: 1, y: 0, duration: 1, ease: "back.out(1.5)" }
  );
}

function firstBlow() {
  if (currentPhase !== "wish") return;

  currentPhase = "first-blow";

  $("wish-button").classList.add("hidden");
  $("blow-button").classList.add("hidden");

  document.querySelectorAll(".candle-flame").forEach((flame) => {
    flame.classList.add("flame-bent");
  });

  gsap.fromTo(
    ".cake-illustration",
    { x: -5 },
    { x: 5, duration: 0.08, repeat: 5, yoyo: true, onComplete: () => {
      gsap.set(".cake-illustration", { x: 0 });
    }}
  );

  dialogue(
    "mereko pta hai tumne bas click kra phook bhi maaro",
    "angry"
  );

  setTimeout(() => {
    $("fan-button").classList.remove("hidden");

    gsap.fromTo(
      $("fan-button"),
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }
    );
  }, 900);
}

function useFan() {
  if (currentPhase !== "first-blow") return;

  currentPhase = "fan-used";

  const fanButton = $("fan-button");

  fanButton.classList.add("fan-active");

  gsap.fromTo(
    ".cake-illustration",
    { x: -3 },
    { x: 3, duration: 0.07, repeat: 12, yoyo: true, onComplete: () => {
      gsap.set(".cake-illustration", { x: 0 });
    }}
  );

  dialogue("hn ye shi hai", "idle");

  setTimeout(() => {
    fanButton.classList.add("hidden");
    $("blow-again-button").classList.remove("hidden");
  }, 1100);
}

function secondBlow() {
  if (currentPhase !== "fan-used") return;

  currentPhase = "candles-out";

  $("blow-again-button").classList.add("hidden");

  document.querySelectorAll(".candle-flame").forEach((flame, index) => {
    setTimeout(() => {
      flame.classList.add("flame-out");
    }, index * 45);
  });

  dialogue("Yayyy! Happy Birthday, Madam Ji! ♡", "happy");
  burstConfetti();

  gsap.fromTo(
    ".cake-illustration",
    { scale: 1 },
    { scale: 1.06, duration: 0.4, yoyo: true, repeat: 1 }
  );

  setTimeout(() => {
    startLightsOut();
  }, 3000);
}

function startLightsOut() {
  currentPhase = "darkness";

  const music = $("birthday-music");
  if (music) music.pause();

  showOnly($("final-darkness"));

  $("darkness-dialogue").textContent =
    "I am sorry, Madam Ji! I was bringing some stuff and the lights went out. Can you turn them on?";

  $("lights-button").classList.remove("hidden");

  gsap.fromTo(
    $("box-chutku"),
    { y: -30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
  );

  gsap.fromTo(
    $("lights-button"),
    { opacity: 0 },
    { opacity: 1, duration: 1, delay: 1 }
  );
}

function turnOnLights() {
  if (currentPhase !== "darkness") return;

  currentPhase = "final";

  showOnly($("final-surprise"));

  $("darkness-dialogue").textContent = "ohh lights are back";

  gsap.fromTo(
    $("final-surprise"),
    { opacity: 0 },
    { opacity: 1, duration: 1.2 }
  );

  document.querySelectorAll(".final-memory-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 40, rotation: index === 0 ? -8 : 8 },
      {
        opacity: 1,
        y: 0,
        rotation: index === 0 ? -3 : 3,
        duration: 0.9,
        delay: 0.3 + index * 0.3,
        ease: "back.out(1.4)"
      }
    );
  });

  const letterImage = document.querySelector(
    ".final-memory-card:first-child img"
  );

  const photoImage = document.querySelector(
    ".final-memory-card:last-child img"
  );

  [letterImage, photoImage].forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      img.parentElement.classList.add("image-missing");
    }, { once: true });
  });
}

function hugChutku() {
  if (currentPhase !== "final") return;

  currentPhase = "hugged";

  $("final-chutku-face").src = "assets/poses/hugging.png";
  $("final-dialogue").textContent =
    "A-arey! Itna bada hug?! Hehe... I love you too, Madam Ji! ♡";

  gsap.fromTo(
    $("final-chutku-face"),
    { scale: 1 },
    { scale: 1.5, duration: 0.5, yoyo: true, repeat: 1, ease: "back.out(2)" }
  );

  $("hug-button").classList.add("hidden");
  $("restart-button").classList.remove("hidden");
}

function restartExperience() {
  window.location.reload();
}

export function initCake() {
  if (!initialised) {
    $("wish-button").addEventListener("click", () => {
      const music = $("birthday-music");
      if (music && music.paused) {
        music.play().catch(() => {});
      }

      dialogue("Take your time, Madam Ji. Wish for something beautiful. ♡", "talking");

      $("wish-button").classList.add("hidden");
      $("blow-button").classList.remove("hidden");
    });

    $("blow-button").addEventListener("click", firstBlow);
    $("fan-button").addEventListener("click", useFan);
    $("blow-again-button").addEventListener("click", secondBlow);
    $("lights-button").addEventListener("click", turnOnLights);
    $("hug-button").addEventListener("click", hugChutku);
    $("restart-button").addEventListener("click", restartExperience);

    initialised = true;
  }

  startBirthday();
}
