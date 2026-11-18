const deferRanAfterParsing = document.readyState !== "loading";
const deferResult = document.getElementById("defer-result");

if (deferResult) {
  deferResult.textContent = deferRanAfterParsing
    ? "Confirmed: the deferred script ran after HTML parsing."
    : "The browser reported an unexpected parsing state.";
}
