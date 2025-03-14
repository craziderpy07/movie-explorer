const API_KEY = '06d428727d36517520fc86c0efa21424';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let movies = [];
let currentPage = 1;
let totalPages = 1;
let searchQuery = '';
let sortBy = '';

async function fetchMovies(page = 1) {
    try {
        let url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
        if (searchQuery) {
            url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        movies = data.results.slice(0, 20);
        
        if (searchQuery) {
            totalPages = Math.ceil(data.total_results / 20);
        } else if (totalPages === 1) {
            totalPages = data.total_pages;
        }
        
        displayMovies();
        updatePageNumber();
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function displayMovies() {
    let filteredMovies = [...movies];

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
    movieContainer.style.display = 'grid';

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
    
    movieContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
}

function searchMovies() {
    searchQuery = document.getElementById('search').value;
    currentPage = 1;
    fetchMovies(currentPage);
}

function sortMovies() {
    sortBy = document.getElementById('sort').value;
    if (!sortBy) {
        fetchMovies(currentPage);
    } else {
        displayMovies();
    }
}

function changePage(step) {
    currentPage += step;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    fetchMovies(currentPage);
}

function updatePageNumber() {
    document.getElementById('pageNumber').textContent = `Page ${currentPage} of ${totalPages}`;
}

fetchMovies(currentPage);