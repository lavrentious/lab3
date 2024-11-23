const UPDATE_TIME_SECONDS = 5;

document.addEventListener("DOMContentLoaded", () => {
  console.log("initializing clock");
  const clock = document.getElementById("clock");

  function time() {
    const date = new Date();
    const timeString = date.toLocaleTimeString();
    clock.innerHTML = timeString;
  }

  setInterval(time, UPDATE_TIME_SECONDS * 1000);
  time();
});
