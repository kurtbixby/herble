

// function toggleModal(modalID){
//     document.getElementById(modalID).classList.toggle("hidden");
//     document.getElementById(modalID + "-backdrop").classList.toggle("hidden");
//     document.getElementById(modalID).classList.toggle("flex");
//     document.getElementById(modalID + "-backdrop").classList.toggle("flex");
// }

//This function loads recent searches from local storage when page is loaded
function loadRecentSearches() {
    let retrievedSearchesString = localStorage.getItem("recentSearches");
    if (retrievedSearchesString == null) {
      return;
    }
  
    // parses the stringified data back into an array
    let storedSearches = JSON.parse(retrievedSearchesString);
    let filteredSearches = storedSearches.filter(search => search.trim().length)
    recentSearches = filteredSearches;
    
    // Console log for testing purposes
    console.log(filteredSearches);
    // For each item in the array,
    for (var i = 0; i < filteredSearches.length; i++) {
      // A new button is revealed
      var button = $(`#rs${i + 1}`);
      $(button.parent()).show();
      // The button displays the search term
      button.text(filteredSearches[i]);
      //on click calls a function defined below, figured we would need it later
      // button.on("click", onclickhandler);
    }
}
  
//this function is called every time the submit button is clicked.
function searchFunction(userInput, recentSearch = false) {
  let searchBox = $('#'+SUBMIT_BUTTON_ID);
  let recentButtons = $('.'+RECENT_BUTTON_CLASS);
  searchBox.addClass(BUTTON_LOADING_CLASS);
  recentButtons.addClass(BUTTON_LOADING_CLASS);
  if (!userInput) {
    searchBox.removeClass(BUTTON_LOADING_CLASS);
    recentButtons.removeClass(BUTTON_LOADING_CLASS);
    return;
  }

  if (!recentSearch) {
    console.log(userInput);
    // Check if empty
  
      // pushes eaten value into an empty array
      recentSearches.unshift(userInput);
  
      // If there are more than 4 recent searches, the oldest one is removed from the array
      if (recentSearches.length > 4) {
        recentSearches.pop();
      }
      //Converts recentSearches array into something that can be stored in local storage.
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }
}