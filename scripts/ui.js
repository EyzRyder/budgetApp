export function showIntro() {
  const introElement = document.getElementById("intro");
  const dashElement = document.getElementById("dashboard");

  if (introElement || dashElement) {
    introElement.style.display = "flex";
    dashElement.style.display = "none";
  } else {
    console.error("element not found");
  }
}

export function showApp(name) {
  const introElement = document.getElementById("intro");
  const dashElement = document.getElementById("dashboard");
  const spanElement = document.getElementById("usernamespan");

  if (introElement || dashElement || spanElement) {
    introElement.style.display = "none";
    dashElement.style.display = "grid";
    spanElement.textContent = name;
  } else {
    console.error("element not found");
  }
}
