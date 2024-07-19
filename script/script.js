document.addEventListener("DOMContentLoaded", function() {
  // Fetch all movies initially to populate the list
  fetch('https://phase1-backend-sigma.vercel.app/movies')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      populateMovieList(data); // Populate the movie list initially
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

  // Function to populate the movie list
  function populateMovieList(data) {
    const movieList = document.getElementById("movieList");

    // Clear existing options
    movieList.innerHTML = "";

    // Create an option for each movie
    data.forEach(movie => {
      const option = document.createElement("option");
      option.textContent = movie.title;
      option.value = movie.title; // Assuming title can be used as a unique identifier
      movieList.appendChild(option);
    });

    // Add event listener to movieList to update movieDetails on change
    movieList.addEventListener("change", function() {
      const selectedTitle = this.value;
      const selectedMovie = data.find(movie => movie.title === selectedTitle);
      displayMovieDetails(selectedMovie);
    });
  }

  // Function to display movie details in movieDetails
  function displayMovieDetails(movie) {
    const movieDetails = document.getElementById("movieDetails");
    movieDetails.innerHTML = "";

    if (movie) {
      const div = document.createElement("div");
      div.className = "movie-details";
      div.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" class="movie-poster">
        <h3>${movie.title}</h3>
        <p>Year: ${movie.year}</p>
        <p>Rating: ${movie.rating}</p>
        <p>Genre: ${movie.genre}</p>
        <p>Director: ${movie.director}</p>
        <p>Actors: ${movie.actors.join(', ')}</p>
      `;
      movieDetails.appendChild(div);
    } else {
      movieDetails.innerHTML = "<p>No movie details found.</p>";
    }
  }

  // Event listener for searchButton to fetch movies based on search input
  document.getElementById("searchButton").addEventListener("click", function() {
    const searchInput = document.getElementById("search-input").value.trim();

    if (searchInput === "") {
      alert("Please enter a search term.");
      return;
    }

    fetch(`https://phase1-backend-sigma.vercel.app/movies?q=${encodeURIComponent(searchInput)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.length > 0) {
          displayMovieDetails(data[0]); // Display details of the first match
        } else {
          displayMovieDetails(null); // Display message when no results found
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        alert("An error occurred while fetching data.");
      });
  });
});
