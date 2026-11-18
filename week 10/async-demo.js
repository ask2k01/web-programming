const asyncStartedDuringParsing = document.readyState === "loading";

function showAsyncResult() {
  const result = document.getElementById("async-result");
  if (!result) {
    return;
  }

  result.textContent = asyncStartedDuringParsing
    ? "This async script started while the browser was still parsing HTML."
    : "This async script started after HTML parsing had already completed.";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showAsyncResult, { once: true });
} else {
  showAsyncResult();
}
