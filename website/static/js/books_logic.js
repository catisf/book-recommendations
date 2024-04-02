// Function to close the popup with recommendations
function closePopup() {
    document.getElementById('bookPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function(){
    // Function to calculate Euclidean distance between two points in 2D space
    function euclideanDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // Function to recommend similar books based on Euclidean distance within the same cluster
    function recommendSimilarBooks(clickedBook, dataframe, numRecommendations) {
        console.log(clickedBook)
        const distances = [];

        // Calculate Euclidean distance between clicked book and all other books in the same cluster
        dataframe.forEach(book => {
            if (book.title !== clickedBook.title && book.predicted_clusters === clickedBook.predicted_clusters) {
                const distance = euclideanDistance(clickedBook.PCA1, clickedBook.PCA2, book.PCA1, book.PCA2);
                distances.push({ book, distance });
            }
        });

        // Sort distances in ascending order
        distances.sort((a, b) => a.distance - b.distance);

        // Select top 5 closest books
        const recommendations = distances.slice(0, numRecommendations).map(item => item.book);
        return recommendations;
    }

    // Function to open the popup with recommendations
    function openPopup(recommendedBooks) {
        console.log("Recommended books:", recommendedBooks);
        document.getElementById('bookPopup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block'; 

        // Loop through the recommended books and update the content of each recommendation wrapper
        recommendedBooks.forEach((book, index) => {
            const recommendationWrapper = document.getElementById(`recommendation${index + 1}`);
            // Update the src attribute of the book image
            recommendationWrapper.querySelector('.bookImage').src = book.thumbnail;
            recommendationWrapper.querySelector('.bookImage').alt = book.title;     

            // Update the text content of the title and author
            recommendationWrapper.querySelector('.title').textContent = book.title; 
            recommendationWrapper.querySelector('.author').textContent = book.authors;
            
            // Tooltip
            const tooltipRec = recommendationWrapper.querySelector('.tooltipRec');
            tooltipRec.querySelector('.title').textContent = book.title;
            tooltipRec.querySelector('.author').textContent = book.authors;

            // Show tooltip when mouse enters
            recommendationWrapper.addEventListener('mouseenter', () => {
                tooltipRec.style.visibility = 'visible';
            }); 

            // Hide tooltip when mouse leaves
            recommendationWrapper.addEventListener('mouseleave', () => {
                tooltipRec.style.visibility = 'hidden';
            });
        });
    }

    // Fetch data from the /books_4_you route
    fetch('/book_4_you')
        .then(response => response.json())
        .then(data => {
            clusteredData = JSON.parse(data.books_data);
            console.log(clusteredData)
   
        // Get all coverWrapper elements
        const coverWrappers = document.querySelectorAll('.coverWrapper');
   
        // Function to select 5 random books
        function selectRandomBooks() {
            // Generate an array of five unique random indices within the range of the books array
            const randomIndices = [];
            while (randomIndices.length < 5) {
                const randomIndex = Math.floor(Math.random() * clusteredData.length);
                if (!randomIndices.includes(randomIndex)) {
                    randomIndices.push(randomIndex);
                }
            }
        
            // Loop through coverWrapper elements and set src and alt attributes,
            // as well as tooltip details
            coverWrappers.forEach((coverWrapper, index) => {
                // Get the random book corresponding to the current index
                const bookData = clusteredData[randomIndices[index]];
                // Set src and alt attributes for the selected book cover and the tooltip info
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

                coverWrapper.addEventListener('click', () => {
                    // Get the clicked book's data
                    const clickedBook = clusteredData[randomIndices[index]];
                    // Recommend similar books based on the clicked book
                    const recommendedBooks = recommendSimilarBooks(clickedBook, clusteredData, 5);
                    // Open the popup with recommendations
                    openPopup(recommendedBooks);
                });
            });
        }

        // Call the function to select random books
        selectRandomBooks();

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