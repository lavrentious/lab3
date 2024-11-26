const UPDATE_TIME_SECONDS = 5;

document.addEventListener("DOMContentLoaded", () => {
  console.log("initializing clock");
  const clock = document.getElementById("clock");
  const clockDate = document.getElementById("clockDate");

  function time() {
    const date = new Date();
    const timeString = date.toLocaleTimeString();
    clock.innerHTML = timeString;

    const dateString = date.toLocaleDateString();
    clockDate.innerHTML = dateString;
  }

  setInterval(time, UPDATE_TIME_SECONDS * 1000);
  time();
});
