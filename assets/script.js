document.addEventListener("DOMContentLoaded", function () {
  function handleSearch() {
      var inputValue = document.getElementById("inputValue").value;
      console.log("Search clicked! Input Value:", inputValue);
  }
  document.getElementById("searchButton").addEventListener("click", handleSearch);
});
