const API_KEY = '06d428727d36517520fc86c0efa21424'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let movies = [];
let currentPage = 1;
let searchQuery = '';
let sortBy = '';

async function fetchMovies(page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        const data = await response.json();
        movies = data.results.slice(0, 20); // Ensure 20 movies per page
        displayMovies();
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function displayMovies() {
    let filteredMovies = movies;

    if (searchQuery) {
        filteredMovies = filteredMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (sortBy) {
        filteredMovies.sort((a, b) => {
            if (sortBy === 'release_asc') return new Date(a.release_date) - new Date(b.release_date);
            if (sortBy === 'release_desc') return new Date(b.release_date) - new Date(a.release_date);
            if (sortBy === 'rating_asc') return a.vote_average - b.vote_average;
            if (sortBy === 'rating_desc') return b.vote_average - a.vote_average;
        });
    }

    const movieContainer = document.getElementById('movies');
    movieContainer.innerHTML = '';

    filteredMovies.forEach(movie => {
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
}

function searchMovies() {
    searchQuery = document.getElementById('search').value;
    displayMovies();
}

function sortMovies() {
    sortBy = document.getElementById('sort').value;
    displayMovies();
}

function changePage(step) {
    currentPage += step;
    if (currentPage < 1) currentPage = 1;
    document.getElementById('pageNumber').textContent = `Page ${currentPage}`;
    fetchMovies(currentPage);
}

// Initial Fetch
fetchMovies(currentPage);
