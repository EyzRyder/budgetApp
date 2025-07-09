import { showApp } from "./ui.js";
import { checkElementExistThenExecTrue } from "./helper.js";

export function bindEvents() {
  eventNameForm();

  window.addEventListener("addUserName", function (event) {
    if (event.detail.key === "userName") {
      showApp(event.detail.value);
    }
  });
}

export function eventNameForm() {
  const nameForm = document.getElementById("name-form");

  checkElementExistThenExecTrue(nameForm, () => {
    nameForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = e.target.userName.value.trim();
      localStorage.setItem("userName", name);
      window.dispatchEvent(
        new CustomEvent("addUserName", {
          detail: { key: "userName", value: name },
        }),
      );
    });
  });
}

export function eventFirstAddBudgetForm() {
  window.addEventListener("firstaddbudgetform", function (event) {
    if (event.detail.key === "budget") {
      const addBudgetForm = document.getElementById("firstaddbudgetform");
      const budgetexpensegrid = document.getElementById("budgetexpensegrid");

      checkElementExistThenExecTrue(addBudgetForm, () => {
        if (!event.detail.value?.success) console.log("faild to add budget");
        checkElementExistThenExecTrue(budgetexpensegrid, async () => {
          const data = await fetch(
            "http://localhost/WEB/api/render/renderBudgetExpenseForm.php",
          );
          budgetexpensegrid.innerHTML = await data.text();
        });
      });
    }
  });
}

export function eventAddBudgetForm() {
  window.addEventListener("addbudgetform", function (event) {
    //console.log(event);

    if (event.detail.key === "budget") {
      console.log(event.detail);

      const addBudgetForm = document.getElementById("addbudgetform");

      checkElementExistThenExecTrue(addBudgetForm, () => {
        if (!event.detail.value?.success) {
          console.log("faild to add expense");
          return;
        }
        location.reload();
      });
    }
  });
}

export function eventAddExpenseForm() {
  window.addEventListener("addexpenseform", function (event) {
    if (event.detail.key === "expense") {
      //console.log(event.detail);

      const addExpenseForm = document.getElementById("addexpenseform");

      checkElementExistThenExecTrue(addExpenseForm, () => {
        if (!event.detail.value?.success) {
          console.error("faild to add expense");
          return;
        }
        location.reload();
      });
    }
  });
}

export function eventDeleteExpenseForm() {
  window.addEventListener("deletedexpense", function (event) {
    if (event.detail.key === "deletedexpense") {
      //console.log(event.detail);

      if (!event.detail.value?.success) {
        console.error("faild to add expense");
        return;
      }
      location.reload();
    }
  });
}

export function eventDeletebudgetForm() {
  window.addEventListener("deletedbudget", function (event) {
    if (event.detail.key === "deletedbudget") {
      //console.log(event.detail);

      if (!event.detail.value?.success) {
        console.error("faild to add budget");
        return;
      }
      window.location.href = "/WEB";
    }
  });
}
