// array of objects that contains the data of all the countries displayes in main page
let displayed_data;

// array of objects that contains the data of all the countries
let all_countries = null;

// variale to save the current state of light mode : light | dark
let display_mode = 'light';

// fetches all the countries once the page loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://restcountries.com/v2/all')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data && data.status != 404) {
                displayed_data = data;
                all_countries = data;
                appendCountryCards('All');
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

// light mode button
document.querySelector('#nav-mode-button').addEventListener('click', () => {
    let colors = null;

    // change the value of display_mode variable and the array of color colors to the corresponding mode
    if (display_mode == 'light') {
        display_mode = 'dark';
        document.querySelector('#nav-mode-logo').innerHTML = 'light_mode';
        colors = [
            {
                color: '--clr-background',
                value: 'hsl(207,26%, 17%)',
            },
            {
                color: '--clr-button',
                value: 'hsl(209, 23%, 22%)',
            },
            {
                color: '--clr-text',
                value: 'hsl(0, 0%, 100%)',
            },
        ];
    } else {
        display_mode = 'light';
        document.querySelector('#nav-mode-logo').innerHTML = 'nightlight_round';
        colors = [
            {
                color: '--clr-background',
                value: 'hsl(0, 0%, 98%)',
            },
            {
                color: '--clr-button',
                value: 'hsl(0, 0%, 100%)',
            },
            {
                color: '--clr-text',
                value: 'hsl(0, 0%, 0%)',
            },
        ];
    }

    // change color's properties in the css variales
    colors.forEach((element) => {
        document.documentElement.style.setProperty(
            element.color,
            element.value
        );
    });
});

// filters button function
document.querySelector('#filters-button').addEventListener('click', () => {
    document.querySelector('#filters-dropdown').style.display = 'block';
});

// closes the filters drop down when clicking on the screen
window.addEventListener('click', (event) => {
    if (!event.target.matches('#filters-button')) {
        document.querySelector('#filters-dropdown').style.display = 'none';
    }
});

// function that fetches new data and saves it to displayed_data variable
// url : is the base url
// filter : country name | none
function fetchNewData(url) {
    fetch(`${url}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data && data.status != 404) {
                displayed_data = data;
                appendCountryCards('All');
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

// create country component card
function createCountryElement(data) {
    return `<div class="country-card">
    <div class="country-flag"></div>
    <div class="country-details">
        <h1 class="country-name" onclick="detailsPage('${data.name}')">${
        data.name
    }</h1>
        <p class="country-info">
            <span class="country-label">Population:</span>
            ${numberWithCommas(data.population)}
        </p>
        <p class="country-info">
            <span class="country-label">Region:</span> ${data.region}
        </p>
        <p class="country-info">
            <span class="country-label">Capital:</span> ${data.capital}
        </p>
    </div>
</div>`;
}

// displays the components of the countries in displayed_data variable
function appendCountryCards(region) {
    if (!displayed_data) return;
    const container = document.querySelector('.container');

    // deletes displayed components
    container.innerHTML = '';

    // display the new ones
    const current_display =
        region != 'All'
            ? displayed_data.filter((element) => element.region == region)
            : displayed_data;

    current_display.forEach((element) => {
        const countryData = {
            flag: element.flag,
            name: element.name,
            population: element.population,
            region: element.region,
            capital: element.capital,
        };
        const newElement = createCountryElement(countryData);
        container.innerHTML += newElement;

        // changes the flag's url property in the css
        let all_flags = document.querySelectorAll('.country-flag');
        all_flags[
            all_flags.length - 1
        ].style.backgroundImage = `url('${countryData.flag}')`;
    });
}

// filters currently displayed countries cards to a specific region and re-display the cards
function filter(region) {
    displayed_data = displayed_data.filter(
        (element) => element.region == region
    );
    // appendCountryCards();
}

// display the details page of some country when its card is clicked
function detailsPage(name) {
    // hide the main page
    document.querySelector('#main-page').classList.add('hidden');

    // un-hide the details page
    document.querySelector('#details-page').classList.remove('hidden');

    // getting the data of the country we are displaying its details from the displayed_data array
    const data = displayed_data.find((element) => {
        return element.name == name;
    });

    // update the data in the html page
    [
        { element: '#page-title', value: data.name },
        { element: '#details-native-name', value: data.nativeName },
        { element: '#details-region', value: data.region },
        { element: '#details-sub-region', value: data.subregion },
        { element: '#details-capital', value: data.capital },
        { element: '#details-domain', value: data.topLevelDomain },
        {
            element: '#details-population',
            value: numberWithCommas(data.population),
        },
    ].forEach(({ element, value }) => {
        document.querySelector(element).innerHTML = value;
    });

    // update courencies and languages
    document.querySelector('#details-currency').innerHTML = data.currencies
        .map((element) => {
            return element.name;
        })
        .join(', ');
    document.querySelector('#details-language').innerHTML = data.languages
        .map((element) => {
            return element.name;
        })
        .join(', ');

    // update the flag
    document.querySelector(
        '#page-flag'
    ).style.backgroundImage = `url("${data.flag}")`;

    const borders = document.querySelector('#borders-container');

    console.log('borders', data.borders);

    // check if border countries existe
    if (data.borders) {
        // borders label
        borders.innerHTML =
            '<span class="page-property">Borders Countries: </span>';

        // creating a button for each border country
        data.borders.forEach((element) => {
            borders.innerHTML += `<button class="borders-button">${fullNameFromCode(
                element
            )}</button>`;
        });
    } else {
        // making borders section empty if there is no border countries
        borders.innerHTML = '';
    }
}

// details page back button
document.querySelector('#back-button').addEventListener('click', () => {
    document.querySelector('#main-page').classList.remove('hidden');
    document.querySelector('#details-page').classList.add('hidden');
});

// search bar
document.querySelector('#search-input').addEventListener('change', function () {
    searchNewCountries(this.value);
});
document
    .querySelector('#search-button')
    .addEventListener(
        'click',
        searchNewCountries(document.querySelector('#search-input').value)
    );

function searchNewCountries(name) {
    // if the input value is empty display cards from all_countries array
    if (name == '') {
        displayed_data = all_countries;
        appendCountryCards('All');
    } else {
        // fetch data for specifid name
        fetchNewData('https://restcountries.com/v2/name/' + name);
    }
}

// helper functions
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function fullNameFromCode(code) {
    for (let i = 0; i < all_countries.length; i++) {
        if (all_countries[i].alpha3Code == code) return all_countries[i].name;
    }
}
