import { eventAddExpenseForm } from "../events.js";
import { createExpense } from "../api.js";
class AddExpenseForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.budgets = [];
  }

  static get observedAttributes() {
    return ["data-budgets"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "data-budgets") {
      try {
        this.budgets = JSON.parse(newVal) || [];
      } catch (e) {
        console.error("Invalid budgets JSON", e);
        this.budgets = [];
      }
      this.build();
    }
  }

  connectedCallback() {
    this.build();
    eventAddExpenseForm();
    this.style(this.shadowRoot);
    this.form = this.shadowRoot.querySelector("form");
    this.input = this.shadowRoot.querySelector("#newExpense");

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      console.log("Expense submitted:", data);

      const id = this.getAttribute("id");

      async function sendData(submitButton, form, input, data, id) {
        submitButton.disabled = true;
        submitButton.innerHTML = "<span>Submitting…</span>";
        const result = await createExpense({
          name: data.newExpense,
          amount: data.newExpenseAmount,
          budgetId: data.newExpenseBudget,
        });

        await setTimeout(() => {
          form.reset();
          input.focus();
          submitButton.disabled = false;
          submitButton.innerHTML = "<span>Add Expense</span>";
        }, 5000);
        window.dispatchEvent(
          new CustomEvent(id, {
            detail: { key: "expense", value: result },
          }),
        );
      }

      sendData(this.submitButton, this.form, this.input, data, id);
    });
  }

  build() {
    const id = this.getAttribute("id") || "addexpenseform";
    this.setAttribute("id", id);
    const isSingleBudget = this.budgets.length === 1;
    const budgetName = isSingleBudget ? this.budgets[0].name : "";
    this.shadowRoot.innerHTML = `
        <div class="form-wrapper">
        <h2 class="h3">Add New <span class="accent">${budgetName}</span> Expense</h2>
        <form class="grid-sm">
          <div class="expense-inputs">
            <div class="grid-xs">
              <label for="newExpense">Expense Name</label>
              <input type="text" name="newExpense" id="newExpense" placeholder="e.g., Coffee" required />
            </div>
            <div class="grid-xs">
              <label for="newExpenseAmount">Amount</label>
              <input type="number" step="0.01" name="newExpenseAmount" id="newExpenseAmount" inputmode="decimal" placeholder="e.g., 3.50" required />
            </div>
          </div>


     ${
       !isSingleBudget
         ? `
            <div class="grid-xs">
              <label for="newExpenseBudget">Budget Category</label>
              <select name="newExpenseBudget" id="newExpenseBudget" required>
                ${this.budgets
                  .sort((a, b) => a.createdAt - b.createdAt)
                  .map((b) => `<option value="${b.id}">${b.name}</option>`)
                  .join("")}
              </select>
            </div>
          `
         : `
            <input type="hidden" name="newExpenseBudget" value="${this.budgets[0]?.id || ""}">
          `
     }

          <button type="submit" class="btn btn--dark">
            <span>Add Expense</span>
          </button>
        </form>
      </div>

    `;

    this.submitButton = this.shadowRoot.querySelector("button");
  }

  style(shadowRoot) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
            *,
*::before,
*::after {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

svg {
  pointer-events: none;
}

:root {
  /* fonts */
  --fs-200: clamp(0.78rem, calc(0.71rem + 0.35vw), 0.96rem);
  --fs-300: clamp(0.94rem, calc(0.84rem + 0.51vw), 1.2rem);
  --fs-400: clamp(1.13rem, calc(0.98rem + 0.73vw), 1.5rem);
  --fs-500: clamp(1.94rem, calc(1.56rem + 1.92vw), 2.93rem);
  --fs-600: clamp(2.8rem, calc(2.11rem + 3.47vw), 4.58rem);
  --lh-1: 1;
  --lh-1-1: 1.1;
  --lh-1-4: 1.4;

  /* colors */
  --accent: 183 74% 44%;
  --bkg: 190 60% 98%;
  --text: 185 26% 9%;
  --muted: 183 8% 55%;
  --light: 180 14% 85%;
  --warning: 4 66% 63%;

  /* utils */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 40px;
  --content-sm: 40ch;
  --content: 60ch;
  --round-sm: 4px;
  --round-md: 10px;
  --round-lg: 25px;
  --round-full: 100vmax;

  /* toast customizations */
  --toastify-color-success: hsl(var(--accent));
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: var(--fs-400);
  line-height: var(--lh-1-4);
  font-weight: 400;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  background-color: hsl(var(--bkg));
  color: hsl(var(--text));
}

/* typography */

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: bold;
  line-height: var(--lh-1);
}

h1,
.h1 {
  font-size: var(--fs-600);
}

h2,
.h2 {
  font-size: var(--fs-500);
}

h3,
.h3 {
  font-size: var(--fs-400);
}

small {
  font-size: var(--fs-200);
  line-height: var(--lh-1);
}

p {
  max-width: var(--content);
}

/* color utils */

.accent {
  color: hsl(var(--accent));
}

.muted {
  color: hsl(var(--muted));
}

/* links and buttons */

:where(a, .btn) {
  --color: hsl(var(--text));
  --backdrop: hsl(var(--accent));
  font: inherit;
  color: var(--color);
  border-radius: var(--round-sm);
  -webkit-transition: -webkit-box-shadow 300ms
    cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: -webkit-box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
  -o-transition: box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
  -webkit-transition: -webkit-box-shadow 300ms
    cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1),
    -webkit-box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1),
    -webkit-box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
}

:where(a, .btn):focus {
  outline: none;
}

:where(a, .btn):is(:hover, :focus-visible) {
  -webkit-box-shadow: 0 0 0 3px hsl(var(--bkg)), 0 0 0 6px var(--backdrop);
  box-shadow: 0 0 0 3px hsl(var(--bkg)), 0 0 0 6px var(--backdrop);
}

:where(.btn) {
  --color: hsl(var(--bkg));
  background-color: var(--backdrop);
  color: var(--color);
  padding: var(--space-xs) var(--space-sm);
  border: 2px solid var(--backdrop);
  font-size: var(--fs-300);
  text-decoration: none;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: var(--space-xs);
  max-width: -webkit-fit-content;
  max-width: -moz-fit-content;
  max-width: fit-content;
  cursor: pointer;
}

:where(.btn):is(:hover, :focus-visible) {
  background-color: var(--backdrop);
  color: var(--color);
}

:where(.btn--dark) {
  --backdrop: hsl(var(--text));
}

:where(.btn--outline) {
  background-color: var(--color);
  color: var(--backdrop);
  border: 2px solid var(--backdrop);
}

:where(.btn--outline):is(:hover, :focus-visible) {
  --backdrop: var(--outline);
  --color: hsl(var(--bkg));
  outline: 0px solid var(--outline);
}

:where(.btn--warning) {
  --backdrop: hsl(var(--warning) / 0.1);
  border: 2px solid hsl(var(--warning));
  --color: hsl(var(--warning));
}

:where(.btn--warning):is(:hover, :focus-visible) {
  --backdrop: hsl(var(--warning));
  --color: hsl(var(--bkg));
}

.btn[disabled] {
  opacity: 0.5;
}

/* utility layouts */

.flex-lg {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: start;
  gap: var(--space-lg);
}

.flex-md {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: start;
  gap: var(--space-md);
}

.flex-sm {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: start;
  gap: var(--space-sm);
}

.grid-lg {
  display: -ms-grid;
  display: grid;
  gap: var(--space-lg);
  width: 100%;
}

.grid-md {
  display: -ms-grid;
  display: grid;
  gap: var(--space-md);
  width: 100%;
}

.grid-sm {
  display: -ms-grid;
  display: grid;
  gap: var(--space-sm);
  width: 100%;
}

.grid-xs {
  display: -ms-grid;
  display: grid;
  gap: var(--space-xs);
  width: 100%;
}

[hidden] {
  display: none;
}

/* main layout */
.layout {
  display: -ms-grid;
  display: grid;
  min-height: 100vh;
  -ms-grid-rows: auto 1fr auto;
  grid-template-rows: auto 1fr auto;
}

.layout > img {
  width: 100%;
}

main {
  max-width: 1500px;
  width: 100%;
  padding: var(--space-md) var(--space-md) var(--space-xl);
  margin-inline: auto;
  display: -ms-grid;
  display: grid;
  place-items: start;
}

/* navbar */
nav {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  padding: var(--space-md);
  max-width: 1500px;
  margin-inline: auto;
}

nav a {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs);
  text-decoration: none;
  font-weight: bold;
}

@media screen and (max-width: 525px) {
  nav a span {
    display: none;
  }
}

/* forms */
label {
  font-size: var(--fs-300);
  font-weight: bold;
}

input,
select {
  width: 100%;
  font: inherit;
  font-size: var(--fs-300);
  background-color: hsl(var(--bkg));
  border: 2px solid hsl(var(--muted));
  border-radius: var(--round-sm);
  padding: var(--space-xs) var(--space-sm);
  height: 100%;
  -webkit-transition: -webkit-box-shadow 300ms
    cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: -webkit-box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
  -o-transition: box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
  -webkit-transition: -webkit-box-shadow 300ms
    cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1),
    -webkit-box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1),
    -webkit-box-shadow 300ms cubic-bezier(0.075, 0.82, 0.165, 1);
}

:is(input, select):focus {
  outline: none;
  border-color: hsl(var(--accent));
  -webkit-box-shadow: 0 0 0 1px hsl(var(--accent));
  box-shadow: 0 0 0 1px hsl(var(--accent));
}

/* Intro */
.intro {
  /* display: -webkit-box;
  display: -ms-flexbox; */
  display: none;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-item-align: center;
  -ms-grid-row-align: center;
  align-self: center;
  -ms-grid-column-align: center;
  justify-self: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  gap: var(--space-lg);
}

.intro div {
  display: -ms-grid;
  display: grid;
  gap: var(--space-sm);
  max-width: var(--content-sm);
}

.intro form {
  display: -ms-grid;
  display: grid;
  gap: var(--space-sm);
  max-width: 25ch;
}

/* dashboard */
.dashboard {
  /* display: -ms-grid; */
  display: none;
  gap: var(--space-lg);
  place-items: start;
  width: 100%;
}

/* form */
.form-wrapper {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 48%;
  flex: 1 1 48%;
  max-width: 800px;
  position: relative;
  display: -ms-grid;
  display: grid;
  gap: var(--space-sm);
  background-color: var(--bkg);
  padding: var(--space-xl);
  border-radius: var(--round-lg);
  -webkit-box-shadow: 0.25em 0.3em 1em hsl(var(--muted) / 0.2);
  box-shadow: 0.25em 0.3em 1em hsl(var(--muted) / 0.2);
  border-top: 0.15em solid white;
  border-left: 0.15em solid white;
  border-right: 0.15em solid hsl(var(--bkg));
  border-bottom: 0.15em solid hsl(var(--bkg));
}

.form-wrapper::before {
  content: "";
  position: absolute;
  inset: 0.55rem;
  border: 2px dashed hsl(var(--text));
  border-radius: calc(var(--round-lg) * 0.6);
  z-index: -1;
}

.expense-inputs {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  gap: var(--space-md);
}

@media screen and (max-width: 725px) {
  .expense-inputs {
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }
}

/* budgets */
.budgets {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.budget {
  --backdrop: var(--accent);
  display: -ms-grid;
  display: grid;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 32.2%;
  flex: 1 1 32.2%;
  max-width: 600px;
  -webkit-box-shadow: 0.25em 0.3em 1em hsl(var(--muted) / 0.2);
  box-shadow: 0.25em 0.3em 1em hsl(var(--muted) / 0.2);
  background-color: var(--bkg);
  border-radius: var(--round-lg);
  border: 3px solid hsl(var(--backdrop));
  padding: calc(var(--space-md) / 1.5) calc(var(--space-md) / 1.2);
  gap: var(--space-sm);
  text-decoration: none;
  color: hsl(var(--backdrop));
}

.budget > .flex-sm {
  padding-top: var(--space-sm);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.progress-text {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  gap: var(--space-lg);
}

.progress-text :nth-child(2) {
  text-align: right;
}

.progress-text:nth-of-type(2) :nth-child(2) {
  color: hsl(var(--muted));
}

progress {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  width: 100%;
  height: var(--space-sm);
  border-radius: 100vmax;
  overflow: hidden;
  -webkit-transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
  -o-transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
}

progress[value]::-webkit-progress-bar {
  background-color: hsl(var(--light));
}

progress[value]::-moz-progress-bar {
  -moz-transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
  background-color: hsl(var(--backdrop));
}

progress[value]::-webkit-progress-value {
  background-color: hsl(var(--backdrop));
  -webkit-transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
}

/* error pages */
.error {
  -ms-grid-row-align: center;
  -ms-grid-column-align: center;
  place-self: center;
  display: -ms-grid;
  display: grid;
  place-items: center;
  place-content: center;
  gap: var(--space-lg);
  padding-block: var(--space-lg);
  text-align: center;
}

/* chart component */
.table {
  overflow-x: auto;
}

table {
  width: 100%;
}

tr:nth-child(odd) {
  background-color: hsl(var(--accent) / 0.04);
}

td {
  border: none;
  font-size: var(--fs-200);
}

thead > tr:nth-child(odd) {
  background-color: hsl(var(--bkg));
}

td,
th {
  text-align: center;
  padding: var(--space-xs);
}

table .btn {
  margin-inline: auto;
}

table a {
  text-decoration: none;
  color: hsl(var(--bkg));
  background-color: hsl(var(--accent));
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--round-full);
}

/* toast */
.Toastify__toast-body {
  font-size: var(--fs-300);
}

            `);
    shadowRoot.adoptedStyleSheets = [sheet];
  }
}

customElements.define("add-expense-form", AddExpenseForm);
