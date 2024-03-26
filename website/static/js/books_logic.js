document.addEventListener("DOMContentLoaded", function(){

    // Fetch data from the /print_sample_data_uk route for the United Kingdom
    fetch('/book_4_you')
        .then(response => response.json())
        .then(data => {
            cleanedData = JSON.parse(data.books_data);
            console.log(cleanedData)

    // Get the "Show more" button element by its ID
    var button = document.getElementById("more");

    // Add an event listener for the "click" event
    button.addEventListener("click", function() {
        // Add your desired functionality here
        console.log("You clicked the button!");
        // For example, you can show/hide other books, load more books, etc.
    });
});
});