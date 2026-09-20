const LOCATIONS = {
  detroit: { name: 'Detroit', latitude: '42.33', longitude: '-83.05', displayLongitude: '83.05 W' },
  draper: { name: 'Draper', latitude: '40.52', longitude: '-111.86', displayLongitude: '111.86 W' }
};

const temperatureElement = document.querySelector('#temperature');
const descriptionElement = document.querySelector('#weather-description');
const detailElement = document.querySelector('#weather-detail');
const iconElement = document.querySelector('#weather-icon');
const updatedElement = document.querySelector('#updated-label');
const errorElement = document.querySelector('#error-message');
const refreshButton = document.querySelector('#refresh-button');
const unitButtons = document.querySelectorAll('.unit-button');
const locationSelect = document.querySelector('#location-select');
const latitudeElement = document.querySelector('#latitude');
const longitudeElement = document.querySelector('#longitude');
const footerLocationElement = document.querySelector('#footer-location');

let celsiusTemperature = null;
let selectedUnit = 'celsius';
let selectedLocation = 'detroit';

function formatTemperature() {
  if (celsiusTemperature === null) return '--';
  const temperature = selectedUnit === 'fahrenheit'
    ? (celsiusTemperature * 9 / 5) + 32
    : celsiusTemperature;
  return `${Math.round(temperature)}°`;
}

function updateTemperature() {
  temperatureElement.textContent = formatTemperature();
  detailElement.textContent = `Temperature at 2 meters / ${selectedUnit === 'fahrenheit' ? '°F' : '°C'}`;
  unitButtons.forEach((button) => {
    const isActive = button.dataset.unit === selectedUnit;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

async function loadWeather() {
  refreshButton.disabled = true;
  errorElement.hidden = true;
  updatedElement.textContent = 'Updating...';

  try {
    const location = LOCATIONS[selectedLocation];
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Weather request failed');

    const data = await response.json();
    celsiusTemperature = data.current.temperature_2m;
    latitudeElement.textContent = `${location.latitude} N`;
    longitudeElement.textContent = location.displayLongitude;
    footerLocationElement.textContent = `Updated from ${location.name}`;
    updateTemperature();
    descriptionElement.textContent = 'Clear read on the air';
    iconElement.textContent = '°';
    updatedElement.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } catch (error) {
    updatedElement.textContent = 'Unavailable';
    errorElement.hidden = false;
  } finally {
    refreshButton.disabled = false;
  }
}

unitButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedUnit = button.dataset.unit;
    updateTemperature();
  });
});

refreshButton.addEventListener('click', loadWeather);
locationSelect.addEventListener('change', () => {
  selectedLocation = locationSelect.value;
  loadWeather();
});
loadWeather();
