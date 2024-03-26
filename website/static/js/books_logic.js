// Function to open the popup
function openPopup() {
    document.getElementById('bookPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// Function to close the popup
function closePopup() {
    document.getElementById('bookPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function(){

    // Fetch data from the /print_sample_data_uk route for the United Kingdom
    fetch('/book_4_you')
        .then(response => response.json())
        .then(data => {
            cleanedData = JSON.parse(data.books_data);
            console.log(cleanedData)
   
        // Get all coverWrapper elements
        const coverWrappers = document.querySelectorAll('.coverWrapper');

        // Array containing book data (URLs and alt texts)
        const books = cleanedData.map((book, index) => {
            return {
                alt: book.title, // Use book title as alt text
                src: book.thumbnail // Use thumbnail URL as src
            };
        });
    
        // Function to select a random book and set its attributes
        function selectRandomBooks() {
            // Generate an array of five unique random indices within the range of the books array
            const randomIndices = [];
            while (randomIndices.length < 5) {
                const randomIndex = Math.floor(Math.random() * books.length);
                if (!randomIndices.includes(randomIndex)) {
                    randomIndices.push(randomIndex);
                }
            }
        
            // Loop through coverWrapper elements and set src and alt attributes
            coverWrappers.forEach((coverWrapper, index) => {
                // Get the random book corresponding to the current index
                const bookData = cleanedData[randomIndices[index]];
                // Set src and alt attributes for the selected book cover
                const bookImage = coverWrapper.querySelector('.bookImage');
                const tooltip = coverWrapper.querySelector('.tooltip');
                bookImage.src = bookData.thumbnail;
                bookImage.alt = bookData.title;
                tooltip.querySelector('.title').textContent = bookData.title;
                tooltip.querySelector('.author').textContent = bookData.authors;

                // Position tooltip relative to cover
                const coverRect = coverWrapper.getBoundingClientRect();
                tooltip.style.top = (coverRect.top + coverRect.height) + 'px';
                tooltip.style.left = coverRect.left + 'px';

                // Add event listeners for mouse enter and mouse leave
                coverWrapper.addEventListener('mouseenter', (event) => {
                    // Position tooltip relative to the mouse cursor
                    tooltip.style.top = (event.clientY + 10) + 'px';
                    tooltip.style.left = (event.clientX + 10) + 'px';
                    // Show tooltip when mouse enters
                    tooltip.style.visibility = 'visible';
                });

                coverWrapper.addEventListener('mouseleave', () => {
                    // Hide tooltip when mouse leaves
                    tooltip.style.visibility = 'hidden';
                });
            });
        }

        // Call the function to select a random book
        selectRandomBooks();

        // Loop through each coverWrapper element and add a click event listener
        coverWrappers.forEach((coverWrapper, index) => {
            coverWrapper.addEventListener('click', () => {
                // What to do when a book is clicked
                console.log('Clicked on book:', index + 1);
                openPopup();
            });
     });

        // Get the "Show more" button element by its ID
        var button = document.getElementById("more");

        // Add an event listener for the "click" event
        button.addEventListener("click", function() {
            // What to do when the button is clicked
            console.log("You clicked the button!");
            // Select new random books
            selectRandomBooks();
        });
    });
});