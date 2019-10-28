// _ = helper functions
const _parseMillisecondsIntoReadableTime = function(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
};

// 5 TODO: maak updateSun functie

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
const placeSunAndStartMoving = function(totalMinutes, rest) {
  let percentage_left = 100 - (rest / totalMinutes) * 100;
  let percentage_bottom = 100 - (rest / totalMinutes) * 100;
  if (percentage_left < 50) {
    percentage_bottom = (rest / totalMinutes) * 100;
  }

  let tijd = new Date(Date.now());

  console.log(percentage_left, 'left');
  console.log(percentage_bottom, 'bottom');
  let style = `bottom: ${percentage_bottom}%; left: ${percentage_left}%;">`;
  document.querySelector('.js-sun').setAttribute('style', style);

  let notatie = tijd.toLocaleTimeString('be', { hour: '2-digit', minute: '2-digit' });
  console.log(notatie);
  document.querySelector('.js-sun').setAttribute('data-time', notatie);
};

// 3 Met de data van de API kunnen we de app opvullen
const showResult = function(response) {
  console.log(response);
  document.querySelector('.js-location').innerHTML = `${response.city.name}, ${response.city.country}`;
  document.querySelector('.js-sunrise').innerHTML = _parseMillisecondsIntoReadableTime(response.city.sunrise);
  document.querySelector('.js-sunset').innerHTML = _parseMillisecondsIntoReadableTime(response.city.sunset);

  let huidige_tijd = new Date(Date.now());
  let date = new Date(response.city.sunset * 1000);
  let date2 = new Date(response.city.sunrise * 1000);

  let date_notatie = date.toLocaleTimeString('be', { hour: '2-digit', minute: '2-digit' });
  console.log(date_notatie, 'sunset');

  let restingmin = huidige_tijd.getHours() * 60 + huidige_tijd.getMinutes() - date2.getHours() * 60 + date2.getMinutes();
  console.log(restingmin, 'resterende min');
  let total_min = date.getHours() * 60 + date.getMinutes() - date2.getHours() * 60 + date2.getMinutes();
  console.log(total_min, 'totaal aantal min in dag');
  rest = total_min - restingmin;
  placeSunAndStartMoving(total_min, rest);
  document.querySelector('.js-time-left').innerHTML = rest;
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
const getAPI = async function(lat, lon) {
  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  let endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=95289c63a69b9657528001f4526c41b6`;
  console.log(endpoint);
  const get = await fetch(endpoint);
  const joke = await get.json();
  showResult(joke);
};

document.addEventListener('DOMContentLoaded', function() {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
  // setInterval(getAPI(50.8027841, 3.2097454), 60000);
});
