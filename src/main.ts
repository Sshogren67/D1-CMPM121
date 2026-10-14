// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/TargetBetter.png";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Archery Clicker";
const scoreDisplay = document.createElement("p");
scoreDisplay.textContent = "Score: 0";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

app.append(heading, image, scoreDisplay);

class ArcheryClicker {
  private score: number;

  constructor() {
    this.score = 0;
  }

  incrementScore() {
    this.score++;
    scoreDisplay.textContent = `Targets Hit: ${this.score}`;
  }
}

const game = new ArcheryClicker();
image.addEventListener("click", () => game.incrementScore());
