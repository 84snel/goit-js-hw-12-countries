function fetchCountries(searchQuery) {
  const options = {};
  const url = `https://restcountries.eu/rest/v2/name/${searchQuery}`;
  return fetch(url, options).then(respond => respond.json());
}

export default fetchCountries;
