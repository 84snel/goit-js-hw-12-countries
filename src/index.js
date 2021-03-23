import './styles.css';
import './js/theme-switch';
import { notific } from './js/notific';

import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';

import countryInfoTpl from './templates/countryInfo.hbs';
import countriesListTpl from './templates/countriesList.hbs';

const countriesWrapperRef = document.querySelector('.countries__wrapper');
const inputRef = document.getElementById('country-input');

inputRef.addEventListener('input', debounce(handleQuery, 500));

function handleQuery({ target: { value } }) {
  if (!value.trim()) {
    clearPage();
    return notific.myAlert('Start typing the country name');
  }
  fetchCountries(value.trim())
    .then(countriesList => {
      if (countriesList.status === 404) {
        clearPage();
        return notific.myError('country not found. Re-enter');
      }
      renderePage(countriesList);
    })
    .catch(err => {
      notific.myError(err);
    });
}

function renderePage(countries) {
  clearPage();
  if (countries.length > 10) {
    return notific.myAlert(
      'Too many matches found. PLease enter a more specific query!',
    );
  }

  if (countries.length === 1) {
    countriesWrapperRef.insertAdjacentHTML(
      'beforeend',
      countryInfoTpl(...countries),
    );
  }

  if (countries.length > 1 && countries.length < 10) {
    countriesWrapperRef.insertAdjacentHTML(
      'beforeend',
      countriesListTpl(countries),
    );
    addListener(countries);
  }
}

function clearPage() {
  countriesWrapperRef.innerHTML = '';
}
function addListener(countries) {
  countriesWrapperRef.addEventListener('click', onClick);
  function onClick({ target: { innerText } }) {
    const count = countries.findIndex(c => c.name === innerText);
    countriesWrapperRef.removeEventListener('click', onClick);
    renderePage([countries[count]]);
  }
}
