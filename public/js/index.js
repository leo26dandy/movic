const autoCompleteConfig = {
    renderList(movie) {
        const srcImg = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${srcImg}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    optionTitle(movie) {
        return movie.Title;
    },
    async fetchData(searchValue) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: '2a1c9e56',
                s: searchValue
            }
        });

        if (response.data.Error) return [];

        return response.data.Search;
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    dropList: document.querySelector('#left-autocomplete'),
    optionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});

createAutoComplete({
    ...autoCompleteConfig,
    dropList: document.querySelector('#right-autocomplete'),
    optionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftSideDetail;
let rightSideDetail;

const onMovieSelect = async (movie, elementRender, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '2a1c9e56',
            i: movie.imdbID
        }
    });

    console.log(response.data);
    elementRender.innerHTML = movieDetailTemplate(response.data);

    if (side === 'left') {
        leftSideDetail = response.data;
    } else {
        rightSideDetail = response.data;
    }

    if (leftSideDetail && rightSideDetail) compareBoth();

};

const compareBoth = () => {
    const leftStats = document.querySelectorAll('#left-summary .notification');
    const rightStats = document.querySelectorAll('#right-summary .notification');

    leftStats.forEach((leftStat, index) => {
        const rightStat = rightStats[index];

        const leftValue = leftStat.dataset.value;
        const rightValue = rightStat.dataset.value;

        if (rightValue > leftValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};

const movieDetailTemplate = movieData => {
    const awards = movieData.Awards.split(' ').reduce((previous, current) => {
        const value = parseInt(current);

        if (isNaN(value)) {
            return previous;
        } else {
            return previous + value;
        }
    }, 0);

    const boxOfficeValue = parseInt(movieData.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));

    const metaScore = parseInt(movieData.Metascore);

    const imdbRating = parseFloat(movieData.imdbRating);

    return `
        <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieData.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieData.Title}</h1>
                <h4>${movieData.Genre}</h4>
                <p>${movieData.Plot}</p>
            </div>
        </div>
        </article>
        <article data-value="${awards}" class="notification is-primary">
            <p class="subtitle">Awards</p>
            <p class="title">${movieData.Awards}</p>
        </article>
        <article data-value="${boxOfficeValue}" class="notification is-primary">
            <p class="subtitle">Box Office Value: </p>
            <p class="title">${movieData.BoxOffice}</p>
        </article>
        <article data-value="${metaScore}" class="notification is-primary">
            <p class="subtitle">Metascore: </p>
            <p class="title">${movieData.Metascore}</p>
        </article>
        <article data-value="${imdbRating}" class="notification is-primary">
            <p class="subtitle">IMDB Rating: </p>
            <p class="title">${movieData.imdbRating}</p>
        </article>
    `;
};