// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import "./style.css";

const _app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Archery Clicker";
const scoreDisplay = document.createElement("p");
scoreDisplay.textContent = "Score: 0";

// Interface for hireable archers and their properties
interface Hires {
  name: string;
  baseCost: number;
  rate: number;
  time: number;
  quantity: number;
  cost: number;
  description?: string;
  buttonElement: HTMLButtonElement;
}

// List of available hires in the game
const availableHires: Hires[] = [
  {
    name: "Novice Archer",
    baseCost: 10,
    rate: 1,
    time: 3000,
    quantity: 0,
    cost: 10,
    description: "A novice archer to help you hit more targets.",
    buttonElement: document.createElement("button"),
  },
];

// Main game class handling the clicker logic and DOM interactions
class ArcheryClicker {
  private score: number;
  private scoreDisplay: HTMLParagraphElement;
  private targetButtonElement!: HTMLButtonElement;

  // Sets up the initial DOM structure, including the target button and hire buttons
  private setupDOM(): void {
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.backgroundColor = "rgb(135, 224, 249)";
    document.body.style.fontFamily = "Arial, sans-serif";

    const buttonRow = document.createElement("div");
    buttonRow.style.display = "flex";
    buttonRow.style.flexDirection = "row";
    buttonRow.style.justifyContent = "center";
    buttonRow.style.marginTop = "20px";

    // Target Button Setup
    this.targetButtonElement = document.createElement("button");
    this.targetButtonElement.id = "target-button";
    this.targetButtonElement.style.width = "200px";
    this.targetButtonElement.style.height = "200px";
    this.targetButtonElement.style.borderRadius = "50%";
    // this.targetButtonElement.style.background = "red";
    this.targetButtonElement.style.color = "white";
    this.targetButtonElement.style.fontSize = "24px";
    this.targetButtonElement.style.border = "none";
    this.targetButtonElement.style.cursor = "pointer";
    this.targetButtonElement.style.transition = "transform 0.1s";

    // Hire Buttons Setup
    availableHires.forEach((hire) => {
      const btn = hire.buttonElement;
      btn.style.width = "150px";
      btn.style.height = "100px";
      btn.style.margin = "10px";
      btn.style.fontSize = "18px";
      btn.style.border = "none";
      btn.style.borderRadius = "4px";
      btn.style.backgroundColor = "#333";
      btn.style.color = "white";
      btn.style.cursor = "pointer";
      btn.title = hire.description ?? "";
      hire.buttonElement = btn;
      buttonRow.appendChild(btn);
    });

    document.body.prepend(this.targetButtonElement);
    document.body.appendChild(buttonRow);

    document.body.prepend(heading, scoreDisplay);
  }

  // Constructor initializes the game state, sets up the DOM, and starts the game loop
  constructor() {
    this.score = 0;
    this.scoreDisplay = scoreDisplay;
    this.setupDOM();
    this.attachEventListeners();
    this.updateScoreDisplay();

    availableHires.forEach((hire) => {
      setInterval(() => {
        this.score += hire.quantity * hire.rate;
        this.updateScoreDisplay();
      }, hire.time);
      this.updateScoreDisplay();
    });
  }

  // Attaches event listeners to the target button and hire buttons for user interactions
  private attachEventListeners(): void {
    this.targetButtonElement.addEventListener("click", () => {
      this.score++;
      this.updateScoreDisplay();
    });

    availableHires.forEach((hires) => {
      hires.buttonElement.addEventListener("click", () => {
        if (this.score >= hires.cost) {
          this.score -= hires.cost;
          hires.quantity++;
          hires.cost = Math.floor(hires.baseCost * 1.15 ** hires.quantity);
          this.updateScoreDisplay();
        }
      });
    });
  }

  // Updates the score display and the state of hire buttons based on the current score
  private updateScoreDisplay(): void {
    this.scoreDisplay.textContent = `Targets hit: ${this.score}`;

    availableHires.forEach((hire) => {
      hire.buttonElement.textContent =
        `${hire.name} (${hire.cost})\nOwned: ${hire.quantity}`;

        const canAfford = this.score >= hire.cost;

        hire.buttonElement.disabled = !canAfford;

        if(canAfford){
          hire.buttonElement.style.backgroundColor = "#28a745"; // green = affordable
          hire.buttonElement.style.boxShadow = "0 0 12px rgba(40, 167, 69, 0.7)";
        }
        else{
          hire.buttonElement.style.backgroundColor = "#333"; // grey = unaffordable
          hire.buttonElement.style.boxShadow = "none"; 
        }

        //hire.buttonElement.disabled = this.score < hire.cost;
    });
  }
}

// Game Initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new ArcheryClicker());
} else {
  new ArcheryClicker();
}
