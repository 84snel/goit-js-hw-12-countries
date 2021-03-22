import './styles.css';
import './js/theme-switch';
import { notific } from './js/notific';

import fetchCountries from './js/fetchCountries';
const debounce = require('lodash.debounce');

import countryInfo from './templates/countryInfo.hbs';
import countriesList from './templates/countriesList.hbs';

// const markup = menuTemplate(menuData);

// const menuRef = document.querySelector('ul.js-menu');

// menuRef.insertAdjacentHTML('beforeend', markup);

const countriesWrapperRef = document.querySelector('.countries__wrapper');
const inputRef = document.getElementById('country-input');

inputRef.addEventListener('input', debounce(handleQuery, 500));

function handleQuery({ target: { value } }) {
  fetchCountries(value)
    .then(countriesList => {
      renderePage(countriesList);
    })
    .catch(err => {
      notific.myError(err);
    });
}

function renderePage(countries) {
  countriesWrapperRef.innerHTML = '';
  if (countries.length > 10) {
    return notific.myAlert(
      'Too many matches found. PLease enter a more specific query!',
    );
  }

  if (countries.length === 10)
    return notific.myError(
      'Too many matches found. PLease enter a more specific query!',
    );

  if (countries.length === 1) {
    countriesWrapperRef.insertAdjacentHTML(
      'beforeend',
      countryInfo(...countries),
    );
  }
  if (countries.length > 1 && countries.length < 10) {
    countriesWrapperRef.insertAdjacentHTML(
      'beforeend',
      countriesList(countries),
    );
  }
}
