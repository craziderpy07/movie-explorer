const API_KEY = '06d428727d36517520fc86c0efa21424';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let movies = [];

// Tracks the current page number
let currentPage = 1;
let totalPages = 1;

// Tracks user's input when searching for a specific movie
let search = '';

// Tracks user's option when they choose from the drop down menu
let sortOption = '';
let maxTotalPages = null;

// Fetches movie data using The Movie Database (TMDB) API
async function fetchMovies(page = 1) {
    try {
        let apiUrl = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
        
        // When the user is searching for a movie, the URL is updated to use the search endpoint
        if (search) {
            apiUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(search)}&page=${page}`;
        }
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Maintains 20 movies per page
        movies = data.results.slice(0, 20);
        
        // If the user is searching for a specific movie,
        // the total pages are set based on how many of that specific movie(s) is found with
        // that key word.
        if (search) {
            totalPages = Math.ceil(data.total_results / 20);
        } else if (maxTotalPages === null) {
            // Set the total pages only once for popular movies
            maxTotalPages = data.total_pages;
            totalPages = maxTotalPages;
        }
        
        displayMovies();
        updatePageDisplay();
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

// Displays the movies on the page
function displayMovies() {
    let sortedMovies = [...movies];

    if (sortOption) {
        sortedMovies.sort((a, b) => {
            if (sortOption === 'release_asc') {
                return new Date(a.release_date) - new Date(b.release_date); }
            if (sortOption === 'release_desc') {
                return new Date(b.release_date) - new Date(a.release_date); }
            if (sortOption === 'rating_asc') {
                return a.vote_average - b.vote_average; }
            if (sortOption === 'rating_desc') {
                return b.vote_average - a.vote_average; }
        });
    }

    const movieContainer = document.getElementById('movies');
    movieContainer.innerHTML = '';
    movieContainer.style.display = 'grid';

    sortedMovies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <p>Rating: ${movie.vote_average}</p>
        `;
        movieContainer.appendChild(movieElement);
    });
    
    // Maintains that the movies stay to their sizes, even when the browser re-sizes
    movieContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
}

// Searches for movies
function searchMovies() {
    search = document.getElementById('search').value;
    currentPage = 1;
    fetchMovies(currentPage);
}

// Sorts the movies
function sortMovies() {
    sortOption = document.getElementById('sort').value;
    displayMovies();
}

// Changing pages
function changePage(step) {
    currentPage += step;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    fetchMovies(currentPage);
}

// Update page number
function updatePageDisplay() {
    document.getElementById('pageNumber').textContent = `Page ${currentPage} of ${totalPages}`;
}

fetchMovies(currentPage);