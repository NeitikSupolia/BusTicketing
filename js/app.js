/**
 * NexaBus Global Application Logic
 * Supports multi-country selection, local routes, regional operators, currencies & terminals
 */

// Application State
const state = {
  country: 'US',
  fromCity: 'NYC',
  toCity: 'BOS',
  journeyDate: '',
  returnDate: '',
  classFilter: 'all',
  buses: [],
  selectedBus: null,
  selectedDeck: 'lower',
  selectedSeats: [],
  boardingPoint: '',
  droppingPoint: '',
  passengers: [],
  appliedCoupon: null,
  activeSort: 'cheapest',
  filters: {
    timeSlots: [],
    operators: [],
    types: [],
    maxPrice: 99999
  },
  currency: 'USD',
  currencyRates: {
    USD: { symbol: '$', rate: 1 },
    INR: { symbol: '₹', rate: 84 },
    GBP: { symbol: '£', rate: 0.78 },
    EUR: { symbol: '€', rate: 0.92 },
    CAD: { symbol: 'C$', rate: 1.36 },
    AUD: { symbol: 'A$', rate: 1.52 },
    JPY: { symbol: '¥', rate: 152 },
    AED: { symbol: 'AED ', rate: 3.67 },
    BRL: { symbol: 'R$ ', rate: 5.45 }
  }
};

// DOM Content Loaded Initializer
document.addEventListener('DOMContentLoaded', () => {
  initDatePickers();
  initTheme();
  setupEventListeners();
  initCountry();
  updateBookingsBadge();
  init3DBusExperience();
  renderIndianStatesGrid();
  renderIndianHornsSoundboard();
  initIndianHornsEvents();
  initFirebaseSync();
});

// Initialize Country Selection
function initCountry() {
  const savedCountry = localStorage.getItem('nexabus_country');
  if (savedCountry && COUNTRIES_DATA[savedCountry]) {
    selectCountry(savedCountry, false);
    performSearch();
  } else {
    // First time visitor: select US as default, and prompt country modal
    selectCountry('US', false);
    performSearch();
    setTimeout(() => {
      openCountryModal();
    }, 500);
  }
}

// Initialize Date Pickers with Today's Date
function initDatePickers() {
  const today = new Date().toISOString().split('T')[0];
  const journeyInput = document.getElementById('journeyDate');
  const returnInput = document.getElementById('returnDate');
  
  if (journeyInput) {
    journeyInput.min = today;
    journeyInput.value = today;
    state.journeyDate = today;
  }
  if (returnInput) {
    returnInput.min = today;
  }
}

// Populate City Select Dropdowns for the active country
function populateCityDropdowns() {
  const fromSelect = document.getElementById('fromCitySelect');
  const toSelect = document.getElementById('toCitySelect');
  
  if (!fromSelect || !toSelect) return;

  const country = COUNTRIES_DATA[state.country] || COUNTRIES_DATA.US;
  const cities = country.cities;

  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  cities.forEach(city => {
    const optFrom = document.createElement('option');
    optFrom.value = city.id;
    optFrom.textContent = `${city.name} (${city.state})`;
    if (city.id === country.defaultFrom) optFrom.selected = true;
    fromSelect.appendChild(optFrom);

    const optTo = document.createElement('option');
    optTo.value = city.id;
    optTo.textContent = `${city.name} (${city.state})`;
    if (city.id === country.defaultTo) optTo.selected = true;
    toSelect.appendChild(optTo);
  });
}

// Populate Popular Route Corridor Shortcuts for active country
function populatePopularRoutes() {
  const row = document.getElementById('quickRoutesRow');
  if (!row) return;

  const country = COUNTRIES_DATA[state.country] || COUNTRIES_DATA.US;
  row.innerHTML = `
    <span class="quick-routes-label">Popular Corridors:</span>
    ${country.popularRoutes.map(r => `
      <button class="quick-route-btn" data-from="${r.from}" data-to="${r.to}">
        ${r.label} (${r.price})
      </button>
    `).join('')}
  `;

  // Attach click listeners to new quick route buttons
  row.querySelectorAll('.quick-route-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const from = btn.dataset.from;
      const to = btn.dataset.to;
      const fromSelect = document.getElementById('fromCitySelect');
      const toSelect = document.getElementById('toCitySelect');
      if (fromSelect && toSelect) {
        fromSelect.value = from;
        toSelect.value = to;
        performSearch();
      }
    });
  });
}

// Update Price Slider Limits Based on Country Currency Range
function updatePriceSliderLimits() {
  const country = COUNTRIES_DATA[state.country] || COUNTRIES_DATA.US;
  const [minPrice, maxPrice] = country.basePriceRange;
  const slider = document.getElementById('priceRangeSlider');
  const priceDisplay = document.getElementById('maxPriceVal');

  if (slider && priceDisplay) {
    const sliderMax = Math.round(maxPrice * 1.5);
    const sliderMin = Math.round(minPrice * 0.8);
    slider.min = sliderMin;
    slider.max = sliderMax;
    slider.value = sliderMax;
    state.filters.maxPrice = sliderMax;
    priceDisplay.textContent = formatPrice(sliderMax);
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Country Selector Modal Triggers
  const countryNavBtn = document.getElementById('btnCountrySelect');
  if (countryNavBtn) {
    countryNavBtn.addEventListener('click', openCountryModal);
  }

  const countryHeroPill = document.getElementById('heroCountryPill');
  if (countryHeroPill) {
    countryHeroPill.addEventListener('click', openCountryModal);
  }

  const countrySearchInput = document.getElementById('countrySearchInput');
  if (countrySearchInput) {
    countrySearchInput.addEventListener('input', (e) => {
      renderCountriesGrid(e.target.value);
    });
  }

  // City Swap Button
  const swapBtn = document.getElementById('btnSwapCities');
  if (swapBtn) {
    swapBtn.addEventListener('click', swapCities);
  }

  // Search Button
  const searchBtn = document.getElementById('btnSearchBuses');
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  // Theme Toggle
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Currency Select
  const currencySelect = document.getElementById('currencySelector');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      state.currency = e.target.value;
      renderBusResults();
      if (state.selectedBus) updateSeatSummary();
    });
  }

  // Sort Buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeSort = btn.dataset.sort;
      renderBusResults();
    });
  });

  // Price Slider Filter
  const priceSlider = document.getElementById('priceRangeSlider');
  const priceDisplay = document.getElementById('maxPriceVal');
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      state.filters.maxPrice = Number(e.target.value);
      priceDisplay.textContent = formatPrice(state.filters.maxPrice);
      renderBusResults();
    });
  }

  // Time Slot Filter Buttons
  document.querySelectorAll('.time-slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const slot = btn.dataset.slot;
      const idx = state.filters.timeSlots.indexOf(slot);
      if (idx > -1) state.filters.timeSlots.splice(idx, 1);
      else state.filters.timeSlots.push(slot);
      renderBusResults();
    });
  });

  // Operator & Bus Type Checkboxes
  document.querySelectorAll('.operator-filter-check').forEach(chk => {
    chk.addEventListener('change', () => {
      const op = chk.value;
      if (chk.checked) state.filters.operators.push(op);
      else state.filters.operators = state.filters.operators.filter(o => o !== op);
      renderBusResults();
    });
  });

  // Reset Filters
  const resetFiltersBtn = document.getElementById('btnResetFilters');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  // My Bookings Open
  const myBookingsBtn = document.getElementById('btnMyBookings');
  if (myBookingsBtn) {
    myBookingsBtn.addEventListener('click', openMyBookingsModal);
  }

  // Live Tracking Modal Open
  const trackBusNav = document.getElementById('navLiveTracker');
  if (trackBusNav) {
    trackBusNav.addEventListener('click', (e) => {
      e.preventDefault();
      openLiveTrackerModal();
    });
  }
}

// Open Country Selector Modal
function openCountryModal() {
  const modal = document.getElementById('countryModal');
  if (!modal) return;
  renderCountriesGrid();
  modal.classList.add('active');
  const input = document.getElementById('countrySearchInput');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 120);
  }
}

// Close Country Selector Modal
function closeCountryModal() {
  const modal = document.getElementById('countryModal');
  if (modal) modal.classList.remove('active');
}

// Render Countries Grid inside Modal
function renderCountriesGrid(query = '') {
  const grid = document.getElementById('countriesGrid');
  if (!grid) return;

  const q = query.toLowerCase().trim();
  const countryList = Object.values(COUNTRIES_DATA).filter(c => {
    return c.name.toLowerCase().includes(q) || c.currency.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  if (countryList.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--text-muted);">
        <i class="fa-solid fa-earth-americas" style="font-size: 2rem; color: var(--text-dim); margin-bottom: 8px;"></i>
        <p>No countries found matching "${query}".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = countryList.map(c => {
    const isActive = state.country === c.id;
    return `
      <div class="country-card ${isActive ? 'active' : ''}" onclick="selectCountry('${c.id}', true)">
        <span class="country-card-flag">${c.flag}</span>
        <div class="country-card-info">
          <span class="country-card-name">${c.name}</span>
          <span class="country-card-currency">${c.currency} (${c.currencySymbol.trim()}) • ${c.cities.length} Cities</span>
        </div>
        ${isActive ? '<i class="fa-solid fa-circle-check country-card-check"></i>' : ''}
      </div>
    `;
  }).join('');
}

// Select a Country and Proceed Further
function selectCountry(countryId, userTriggered = true) {
  const country = COUNTRIES_DATA[countryId] || COUNTRIES_DATA.US;
  state.country = country.id;
  localStorage.setItem('nexabus_country', country.id);

  // Update navbar UI
  const navFlag = document.getElementById('navCountryFlag');
  const navName = document.getElementById('navCountryName');
  if (navFlag) navFlag.textContent = country.flag;
  if (navName) navName.textContent = country.name;

  // Update hero pill
  const heroFlag = document.getElementById('heroCountryFlag');
  const heroName = document.getElementById('heroCountryName');
  if (heroFlag) heroFlag.textContent = country.flag;
  if (heroName) heroName.textContent = country.name;

  // Update currency dropdown
  state.currency = country.currency;
  const currencySelect = document.getElementById('currencySelector');
  if (currencySelect) currencySelect.value = country.currency;

  // Populate city dropdowns for this country
  populateCityDropdowns();

  // Populate popular corridors for this country
  populatePopularRoutes();

  // Update price range slider based on country
  updatePriceSliderLimits();

  // Update phone code placeholder in passenger details
  const phoneInput = document.getElementById('contactPhone');
  if (phoneInput) {
    phoneInput.placeholder = `${country.phoneCode} 555-0199`;
  }

  closeCountryModal();

  if (userTriggered) {
    performSearch();
    showToast(`Welcome to NexaBus ${country.name} ${country.flag}! Local routes & pricing activated.`, 'success');
  }
}

// Swap Origin and Destination Cities
function swapCities() {
  const fromSelect = document.getElementById('fromCitySelect');
  const toSelect = document.getElementById('toCitySelect');
  if (fromSelect && toSelect) {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    showToast('Route flipped!', 'info');
  }
}

// Perform Search
function performSearch() {
  const fromSelect = document.getElementById('fromCitySelect');
  const toSelect = document.getElementById('toCitySelect');
  const dateInput = document.getElementById('journeyDate');
  const country = COUNTRIES_DATA[state.country] || COUNTRIES_DATA.US;

  state.fromCity = fromSelect ? fromSelect.value : country.defaultFrom;
  state.toCity = toSelect ? toSelect.value : country.defaultTo;
  state.journeyDate = dateInput ? dateInput.value : '';

  if (state.fromCity === state.toCity) {
    showToast('Origin and Destination cannot be the same city!', 'error');
    return;
  }

  const fromCityObj = country.cities.find(c => c.id === state.fromCity) || country.cities[0];
  const toCityObj = country.cities.find(c => c.id === state.toCity) || country.cities[1];

  state.buses = generateBusesForRoute(state.country, fromCityObj, toCityObj, state.journeyDate);
  state.selectedBus = null;
  state.selectedSeats = [];
  state.appliedCoupon = null;

  renderBusResults();
}

// Format Price with Currency Symbol
function formatPrice(amount) {
  const country = COUNTRIES_DATA[state.country] || COUNTRIES_DATA.US;
  
  // If the user picked a different currency in the dropdown than the country's native currency
  if (state.currency !== country.currency) {
    const cur = state.currencyRates[state.currency] || state.currencyRates.USD;
    // Normalize to USD then convert
    const baseToUsd = amount / (state.currencyRates[country.currency]?.rate || 1);
    const converted = Math.round(baseToUsd * cur.rate);
    return `${cur.symbol}${converted.toLocaleString()}`;
  }

  return `${country.currencySymbol}${Number(amount).toLocaleString()}`;
}

// Render Bus Results
function renderBusResults() {
  const listContainer = document.getElementById('busResultsList');
  const countEl = document.getElementById('resultsCountNumber');
  const routeHeaderEl = document.getElementById('resultsRouteHeader');

  if (!listContainer) return;

  const country = COUNTRIES_DATA[state.country] || COUNTRIES_DATA.US;
  const fromCityObj = country.cities.find(c => c.id === state.fromCity);
  const toCityObj = country.cities.find(c => c.id === state.toCity);

  if (routeHeaderEl && fromCityObj && toCityObj) {
    routeHeaderEl.textContent = `${fromCityObj.name} → ${toCityObj.name}`;
  }

  // Filter buses
  let filtered = state.buses.filter(bus => {
    // Max price
    if (state.filters.maxPrice && bus.price > state.filters.maxPrice) return false;

    // Operator filter
    if (state.filters.operators.length > 0) {
      const match = state.filters.operators.some(op => bus.operator.toLowerCase().includes(op.toLowerCase()));
      if (!match) return false;
    }

    // Departure Time Slots
    if (state.filters.timeSlots.length > 0) {
      const hour = parseInt(bus.departureTime.split(':')[0], 10);
      const isMorning = hour >= 6 && hour < 12;
      const isAfternoon = hour >= 12 && hour < 18;
      const isEvening = hour >= 18 && hour < 22;
      const isNight = hour >= 22 || hour < 6;

      const slotMatch = (
        (state.filters.timeSlots.includes('morning') && isMorning) ||
        (state.filters.timeSlots.includes('afternoon') && isAfternoon) ||
        (state.filters.timeSlots.includes('evening') && isEvening) ||
        (state.filters.timeSlots.includes('night') && isNight)
      );
      if (!slotMatch) return false;
    }

    return true;
  });

  // Sort
  if (state.activeSort === 'cheapest') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.activeSort === 'fastest') {
    filtered.sort((a, b) => a.durationMinutes - b.durationMinutes);
  } else if (state.activeSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (state.activeSort === 'departure') {
    filtered.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }

  if (countEl) {
    countEl.textContent = filtered.length;
  }

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--glass-border);">
        <i class="fa-solid fa-bus-slash" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 16px;"></i>
        <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No buses match your active filters</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Try adjusting your departure time slots or price filter.</p>
        <button class="btn-search" style="height: 44px; margin: 0 auto;" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered.map(bus => {
    const isSelected = state.selectedBus && state.selectedBus.id === bus.id;
    return `
      <div class="bus-card" id="card-${bus.id}">
        <div class="bus-card-main">
          <!-- Operator Column -->
          <div class="bus-operator-info">
            <div class="operator-badge-row">
              <span class="operator-tag">${bus.tag}</span>
              <span style="font-size: 0.72rem; color: var(--text-dim); font-family: var(--font-mono);">${bus.busNumber}</span>
            </div>
            <h3 class="operator-name">${bus.operator}</h3>
            <p class="bus-model-type">${bus.busType}</p>
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
              <span class="operator-rating-chip"><i class="fa-solid fa-star" style="font-size: 0.7rem;"></i> ${bus.rating}</span>
              <span class="rating-count">(${bus.reviews} ratings)</span>
              <button class="btn-mini-horn" onclick="testBusHorn('${bus.id}', '${bus.busType}')" title="Test Bus Air Horn" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; border-radius: var(--radius-full); padding: 2px 8px; font-size: 0.7rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; margin-left: 4px;">
                <i class="fa-solid fa-bullhorn"></i> Test Horn
              </button>
            </div>
          </div>

          <!-- Schedule Column -->
          <div class="schedule-block">
            <div class="time-node">
              <span class="time-bold">${bus.departureTime}</span>
              <span class="city-small">${bus.fromCity}</span>
              <span class="terminal-sub" title="${bus.boardingPoints[0]?.name}">${bus.boardingPoints[0]?.name}</span>
            </div>

            <div class="duration-line-wrap">
              <span class="duration-text">${bus.duration}</span>
              <div class="duration-line">
                <span class="bus-icon-indicator"><i class="fa-solid fa-bus"></i></span>
              </div>
              ${bus.nextDayBadge ? `<span class="next-day-badge">${bus.nextDayBadge}</span>` : ''}
            </div>

            <div class="time-node" style="text-align: right;">
              <span class="time-bold">${bus.arrivalTime}</span>
              <span class="city-small">${bus.toCity}</span>
              <span class="terminal-sub" title="${bus.droppingPoints[0]?.name}">${bus.droppingPoints[0]?.name}</span>
            </div>
          </div>

          <!-- Pricing & Action Column -->
          <div class="bus-pricing-cta">
            <div class="price-tag-wrap">
              <span class="original-fare">${formatPrice(bus.originalPrice)}</span>
              <span class="current-fare">${formatPrice(bus.price)}</span>
            </div>
            <span class="seats-left-badge"><i class="fa-solid fa-chair"></i> ${bus.availableSeats} seats left</span>
            <button class="btn-select-seats" onclick="toggleSeatSelector('${bus.id}')">
              <span>${isSelected ? 'Hide Seats' : 'Select Seats'}</span>
              <i class="fa-solid ${isSelected ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
            </button>
          </div>
        </div>

        <!-- Amenities Footer -->
        <div class="bus-card-footer">
          <div class="amenities-badges-row">
            ${bus.amenities.map(am => {
              const info = AMENITY_INFO[am];
              if (!info) return '';
              return `<span class="amenity-chip" title="${info.label}"><i class="fa-solid ${info.icon}"></i> ${info.label}</span>`;
            }).slice(0, 5).join('')}
            ${bus.amenities.length > 5 ? `<span class="amenity-chip">+${bus.amenities.length - 5} more</span>` : ''}
          </div>
          <div class="cancellation-note">
            <i class="fa-solid fa-shield-check"></i>
            <span>${bus.cancellationPolicy}</span>
          </div>
        </div>

        <!-- Seat Selection Accordion Drawer -->
        <div class="seat-selection-drawer ${isSelected ? 'open' : ''}" id="drawer-${bus.id}">
          ${isSelected ? renderSeatLayoutHtml(bus) : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Reset All Filters
function resetAllFilters() {
  state.filters.timeSlots = [];
  state.filters.operators = [];
  state.filters.types = [];

  document.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.operator-filter-check').forEach(chk => chk.checked = false);
  
  updatePriceSliderLimits();
  renderBusResults();
  showToast('Filters cleared', 'info');
}

// Toggle Seat Selector Drawer
function toggleSeatSelector(busId) {
  if (state.selectedBus && state.selectedBus.id === busId) {
    state.selectedBus = null;
    state.selectedSeats = [];
  } else {
    state.selectedBus = state.buses.find(b => b.id === busId);
    state.selectedSeats = [];
    state.selectedDeck = 'lower';
    state.boardingPoint = state.selectedBus.boardingPoints[0].name;
    state.droppingPoint = state.selectedBus.droppingPoints[0].name;
  }
  renderBusResults();

  if (state.selectedBus) {
    const cardEl = document.getElementById(`card-${busId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

// Switch Deck (Lower / Upper)
function switchDeck(deck) {
  state.selectedDeck = deck;
  const lowerBtn = document.getElementById('tabLowerDeck');
  const upperBtn = document.getElementById('tabUpperDeck');
  if (lowerBtn && upperBtn) {
    lowerBtn.classList.toggle('active', deck === 'lower');
    upperBtn.classList.toggle('active', deck === 'upper');
  }

  const canvas = document.getElementById('seatsCanvas');
  if (canvas && state.selectedBus) {
    canvas.innerHTML = renderDeckSeatsHtml(state.selectedBus, deck);
  }
}

// Render Seat Layout HTML Inside Drawer
function renderSeatLayoutHtml(bus) {
  return `
    <div class="seat-selector-grid">
      <!-- Coach View -->
      <div class="coach-visual-container">
        <!-- Deck Switcher Tabs -->
        <div class="deck-tabs-switch">
          <button class="deck-tab ${state.selectedDeck === 'lower' ? 'active' : ''}" id="tabLowerDeck" onclick="switchDeck('lower')">
            <i class="fa-solid fa-chair"></i> Lower Deck (Seater)
          </button>
          <button class="deck-tab ${state.selectedDeck === 'upper' ? 'active' : ''}" id="tabUpperDeck" onclick="switchDeck('upper')">
            <i class="fa-solid fa-bed"></i> Upper Deck (Sleeper)
          </button>
        </div>

        <!-- Bus Coach Frame -->
        <div class="bus-coach-shell">
          <div class="bus-driver-cabin">
            <i class="fa-solid fa-dharmachakra"></i>
            <span>DRIVER</span>
          </div>

          <div class="seats-deck-canvas" id="seatsCanvas">
            ${renderDeckSeatsHtml(bus, state.selectedDeck)}
          </div>
        </div>

        <!-- Seat Color Legend -->
        <div class="seat-legend-row">
          <div class="legend-item"><span class="legend-box avail"></span> Available</div>
          <div class="legend-item"><span class="legend-box selected"></span> Selected</div>
          <div class="legend-item"><span class="legend-box booked"></span> Booked</div>
          <div class="legend-item"><span class="legend-box female"></span> Ladies Only</div>
        </div>
      </div>

      <!-- Booking Side Panel -->
      <div class="seat-summary-card">
        <div>
          <h4 class="summary-title"><i class="fa-solid fa-receipt"></i> Booking Summary</h4>

          <div class="point-select-group">
            <label class="point-select-label">Boarding Point</label>
            <select class="point-dropdown" id="selectBoardingPoint" onchange="state.boardingPoint = this.value">
              ${bus.boardingPoints.map(p => `
                <option value="${p.name}" ${state.boardingPoint === p.name ? 'selected' : ''}>
                  ${p.name} (${p.time})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="point-select-group">
            <label class="point-select-label">Dropping Point</label>
            <select class="point-dropdown" id="selectDroppingPoint" onchange="state.droppingPoint = this.value">
              ${bus.droppingPoints.map(p => `
                <option value="${p.name}" ${state.droppingPoint === p.name ? 'selected' : ''}>
                  ${p.name} (${p.time})
                </option>
              `).join('')}
            </select>
          </div>

          <label class="point-select-label" style="margin-top: 14px;">Selected Seats (${state.selectedSeats.length}/6)</label>
          <div class="selected-seats-chips-wrap" id="selectedSeatsChips">
            ${state.selectedSeats.length === 0 ? `
              <span style="font-size: 0.8rem; color: var(--text-dim); margin-top: 6px;">
                Click any available seat on the coach to pick your spot.
              </span>
            ` : state.selectedSeats.map(s => `
              <span class="selected-seat-chip">
                ${s.number} (${formatPrice(s.price)})
                <button class="btn-remove-seat" onclick="toggleSeat('${s.id}')"><i class="fa-solid fa-xmark"></i></button>
              </span>
            `).join('')}
          </div>
        </div>

        <div>
          <div class="fare-breakdown">
            <div class="fare-row">
              <span>Base Fare (${state.selectedSeats.length} seat${state.selectedSeats.length > 1 ? 's' : ''})</span>
              <span id="baseFareAmount">${formatPrice(calcSubtotal())}</span>
            </div>
            <div class="fare-row">
              <span>Taxes & Station Toll</span>
              <span id="taxAmount">${formatPrice(state.selectedSeats.length > 0 ? Math.round(calcSubtotal() * 0.08) : 0)}</span>
            </div>
            <div class="fare-row total">
              <span>Grand Total</span>
              <span id="grandTotalAmount" style="color: var(--cyan-accent); font-family: var(--font-mono); font-size: 1.35rem;">
                ${formatPrice(calcGrandTotal())}
              </span>
            </div>
          </div>

          <button class="btn-continue-booking" id="btnProceedBooking" 
            ${state.selectedSeats.length === 0 ? 'disabled' : ''} 
            onclick="openPassengerDetailsModal()">
            Proceed to Passenger Details <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render Deck Seats Grid HTML
function renderDeckSeatsHtml(bus, deck) {
  const seats = bus.seats.filter(s => s.deck === deck);
  
  if (deck === 'lower') {
    // 5 Rows of 4 seats (A, B, aisle, C, D)
    const rows = [1, 2, 3, 4, 5];
    return rows.map(rowNum => {
      const rowSeats = seats.filter(s => s.row === rowNum);
      const sA = rowSeats.find(s => s.col === 'A');
      const sB = rowSeats.find(s => s.col === 'B');
      const sC = rowSeats.find(s => s.col === 'C');
      const sD = rowSeats.find(s => s.col === 'D');

      return `
        <div class="seats-row">
          ${renderSeatButton(sA)}
          ${renderSeatButton(sB)}
          <div class="aisle-space">AISLE</div>
          ${renderSeatButton(sC)}
          ${renderSeatButton(sD)}
        </div>
      `;
    }).join('');
  } else {
    // Upper Deck: 4 Rows of Sleeper Berths (A single, aisle, B & C double)
    const rows = [1, 2, 3, 4];
    return rows.map(rowNum => {
      const rowSeats = seats.filter(s => s.row === rowNum);
      const sA = rowSeats.find(s => s.col === 'A');
      const sB = rowSeats.find(s => s.col === 'B');
      const sC = rowSeats.find(s => s.col === 'C');

      return `
        <div class="seats-row">
          ${renderSeatButton(sA, true)}
          <div class="aisle-space">AISLE</div>
          ${renderSeatButton(sB, true)}
          ${renderSeatButton(sC, true)}
        </div>
      `;
    }).join('');
  }
}

// Render Individual Seat Button
function renderSeatButton(seat, isSleeper = false) {
  if (!seat) return `<div style="width: 44px;"></div>`;
  const isSelected = state.selectedSeats.some(s => s.id === seat.id);
  const classes = [
    'bus-seat',
    isSleeper ? 'sleeper-berth' : '',
    seat.status === 'booked' ? 'booked' : '',
    seat.status === 'female' ? 'female' : '',
    isSelected ? 'selected' : ''
  ].filter(Boolean).join(' ');

  const title = `${seat.number} • ${isSleeper ? 'Sleeper Berth' : 'Seater'} • ${seat.isWindow ? 'Window' : 'Aisle'} • ${formatPrice(seat.price)}${seat.status === 'female' ? ' (Female Passenger)' : ''}`;

  return `
    <div class="${classes}" title="${title}" onclick="toggleSeat('${seat.id}')">
      <span>${seat.number}</span>
      <span style="font-size: 0.6rem; opacity: 0.8;">${formatPrice(seat.price)}</span>
    </div>
  `;
}

// Toggle Seat Selection
function toggleSeat(seatId) {
  if (!state.selectedBus) return;
  const seat = state.selectedBus.seats.find(s => s.id === seatId);
  if (!seat || seat.status === 'booked') {
    showToast('This seat is already booked', 'error');
    return;
  }

  const existingIdx = state.selectedSeats.findIndex(s => s.id === seatId);
  if (existingIdx > -1) {
    state.selectedSeats.splice(existingIdx, 1);
  } else {
    if (state.selectedSeats.length >= 6) {
      showToast('Maximum 6 seats allowed per booking', 'error');
      return;
    }
    state.selectedSeats.push(seat);
  }

  updateSeatSummary();
}

// Update Seat Summary Panel
function updateSeatSummary() {
  const canvas = document.getElementById('seatsCanvas');
  if (canvas && state.selectedBus) {
    canvas.innerHTML = renderDeckSeatsHtml(state.selectedBus, state.selectedDeck);
  }

  const chipsContainer = document.getElementById('selectedSeatsChips');
  if (chipsContainer) {
    if (state.selectedSeats.length === 0) {
      chipsContainer.innerHTML = `
        <span style="font-size: 0.8rem; color: var(--text-dim); margin-top: 6px;">
          Click any available seat on the coach to pick your spot.
        </span>
      `;
    } else {
      chipsContainer.innerHTML = state.selectedSeats.map(s => `
        <span class="selected-seat-chip">
          ${s.number} (${formatPrice(s.price)})
          <button class="btn-remove-seat" onclick="toggleSeat('${s.id}')"><i class="fa-solid fa-xmark"></i></button>
        </span>
      `).join('');
    }
  }

  const baseFareEl = document.getElementById('baseFareAmount');
  const taxEl = document.getElementById('taxAmount');
  const grandTotalEl = document.getElementById('grandTotalAmount');
  const proceedBtn = document.getElementById('btnProceedBooking');

  const subtotal = calcSubtotal();
  const tax = state.selectedSeats.length > 0 ? Math.round(subtotal * 0.08) : 0;
  const grand = subtotal > 0 ? subtotal + tax : 0;

  if (baseFareEl) baseFareEl.textContent = formatPrice(subtotal);
  if (taxEl) taxEl.textContent = formatPrice(tax);
  if (grandTotalEl) grandTotalEl.textContent = formatPrice(grand);
  if (proceedBtn) proceedBtn.disabled = state.selectedSeats.length === 0;
}

function calcSubtotal() {
  return state.selectedSeats.reduce((acc, s) => acc + s.price, 0);
}

function calcGrandTotal() {
  const sub = calcSubtotal();
  if (sub === 0) return 0;
  const tax = Math.round(sub * 0.08);
  let discount = 0;
  if (state.appliedCoupon) {
    if (state.appliedCoupon.discountPct) {
      discount = Math.min((sub * state.appliedCoupon.discountPct) / 100, state.appliedCoupon.maxDiscount || 9999);
    } else if (state.appliedCoupon.discountFlat) {
      discount = state.appliedCoupon.discountFlat;
    }
  }
  return Math.max(0, Math.round(sub + tax - discount));
}

// Passenger Modal
function openPassengerDetailsModal() {
  if (state.selectedSeats.length === 0) return;
  
  const modal = document.getElementById('passengerModal');
  const container = document.getElementById('passengerFormsContainer');
  if (!modal || !container) return;

  container.innerHTML = state.selectedSeats.map((seat, idx) => `
    <div class="passenger-card">
      <div class="passenger-card-header">
        <span class="passenger-tag"><i class="fa-solid fa-user"></i> Passenger ${idx + 1}</span>
        <span class="passenger-seat-label">Seat: ${seat.number} (${seat.deck.toUpperCase()} DECK)</span>
      </div>
      <div class="passenger-form-grid">
        <div>
          <label class="input-label">Full Legal Name *</label>
          <input type="text" class="input-box passenger-name-input" placeholder="e.g. Alex Morgan" required />
        </div>
        <div>
          <label class="input-label">Age *</label>
          <input type="number" class="input-box passenger-age-input" placeholder="Age" min="1" max="110" value="28" required />
        </div>
        <div>
          <label class="input-label">Gender *</label>
          <select class="input-box passenger-gender-select">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  `).join('');

  updateCheckoutSummary();
  modal.classList.add('active');
}

function closePassengerModal() {
  const modal = document.getElementById('passengerModal');
  if (modal) modal.classList.remove('active');
}

// Apply Coupon Code
function applyCoupon(codeOverride) {
  const input = document.getElementById('couponCodeInput');
  const code = (codeOverride || (input ? input.value : '')).trim().toUpperCase();

  if (!code) {
    showToast('Please enter a promo code', 'error');
    return;
  }

  const promo = PROMO_CODES[code];
  if (promo) {
    state.appliedCoupon = { code, ...promo };
    showToast(`Promo "${code}" applied! ${promo.label}`, 'success');
    updateCheckoutSummary();
  } else {
    showToast('Invalid promo coupon code', 'error');
  }
}

function updateCheckoutSummary() {
  const subtotal = calcSubtotal();
  const tax = Math.round(subtotal * 0.08);
  const total = calcGrandTotal();
  const discount = (subtotal + tax) - total;

  const summaryEl = document.getElementById('checkoutSummaryTotal');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="fare-row">
        <span>Base Seats Fare (${state.selectedSeats.length})</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div class="fare-row">
        <span>Taxes & GST (8%)</span>
        <span>${formatPrice(tax)}</span>
      </div>
      ${discount > 0 ? `
        <div class="fare-row" style="color: var(--emerald-accent); font-weight: 700;">
          <span>Promo Discount (${state.appliedCoupon.code})</span>
          <span>-${formatPrice(discount)}</span>
        </div>
      ` : ''}
      <div class="fare-row total">
        <span>Final Payable Amount</span>
        <span style="color: var(--cyan-accent); font-family: var(--font-mono); font-size: 1.4rem;">${formatPrice(total)}</span>
      </div>
    `;
  }

  const payBtnText = document.getElementById('payBtnTotal');
  if (payBtnText) {
    payBtnText.textContent = formatPrice(total);
  }
}

// Proceed to Payment Modal
function proceedToPayment() {
  // Validate passengers
  const names = document.querySelectorAll('.passenger-name-input');
  const ages = document.querySelectorAll('.passenger-age-input');
  const genders = document.querySelectorAll('.passenger-gender-select');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');

  const passengers = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i].value.trim();
    const age = ages[i].value.trim();
    const gender = genders[i].value;

    if (!name) {
      showToast(`Please enter name for Passenger ${i + 1}`, 'error');
      names[i].focus();
      return;
    }

    passengers.push({
      name,
      age: Number(age) || 25,
      gender,
      seat: state.selectedSeats[i].number
    });
  }

  if (emailInput && !emailInput.value.includes('@')) {
    showToast('Please enter a valid email address for your e-ticket', 'error');
    emailInput.focus();
    return;
  }

  state.passengers = passengers;
  state.contactInfo = {
    email: emailInput ? emailInput.value : 'passenger@vibecoding.com',
    phone: phoneInput ? phoneInput.value : '+1 (555) 234-5678'
  };

  closePassengerModal();
  openPaymentModal();
}

function openPaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.classList.add('active');
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.classList.remove('active');
}

// Process Simulated Payment
function submitPayment() {
  const payBtn = document.getElementById('btnSubmitPayment');
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Secure Payment...`;
  }

  setTimeout(() => {
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Authorize & Confirm Booking`;
    }

    closePaymentModal();
    generateAndShowTicket();
  }, 1400);
}

// Generate PNR & Boarding Pass
function generateAndShowTicket() {
  const pnr = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
  const bookingDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const bus = state.selectedBus;
  const country = COUNTRIES_DATA[state.country] || COUNTRIES_DATA.US;

  const booking = {
    pnr: pnr,
    bookingDate: bookingDate,
    busNumber: bus.busNumber,
    operator: bus.operator,
    busType: bus.busType,
    fromCity: bus.fromCity,
    toCity: bus.toCity,
    departureTime: bus.departureTime,
    arrivalTime: bus.arrivalTime,
    journeyDate: state.journeyDate,
    boardingPoint: state.boardingPoint,
    droppingPoint: state.droppingPoint,
    seats: state.selectedSeats.map(s => s.number),
    passengers: state.passengers,
    amountPaid: calcGrandTotal(),
    currency: state.currency,
    currencySymbol: country.currencySymbol,
    contact: state.contactInfo,
    status: 'CONFIRMED'
  };

  // Save to LocalStorage
  saveBooking(booking);
  updateBookingsBadge();

  // Render Confirmation Modal
  renderBoardingPassTicket(booking);
  const modal = document.getElementById('confirmationModal');
  if (modal) modal.classList.add('active');

  showToast('Booking Successful! Boarding Pass Issued 🎉', 'success');
}

// Render Boarding Pass Details in Confirmation Modal
function renderBoardingPassTicket(booking) {
  const ticketBody = document.getElementById('boardingPassContent');
  if (!ticketBody) return;

  const curSymbol = booking.currencySymbol || '$';

  ticketBody.innerHTML = `
    <div class="ticket-wrapper printable-ticket-area">
      <!-- Ticket Header -->
      <div class="ticket-header">
        <div class="ticket-brand">
          <img src="assets/logo.jpg" alt="Logo" />
          <div>
            <div style="font-size: 1.1rem; font-weight: 800; letter-spacing: -0.01em;">NexaBus Express</div>
            <div style="font-size: 0.72rem; color: #a5b4fc; text-transform: uppercase;">Official E-Boarding Pass</div>
          </div>
        </div>
        <div class="ticket-pnr-badge">
          <div class="pnr-label">PNR NUMBER</div>
          <div class="pnr-code">${booking.pnr}</div>
        </div>
      </div>

      <!-- Ticket Body -->
      <div class="ticket-body">
        <!-- Route Banner -->
        <div class="ticket-route-grid">
          <div>
            <div class="ticket-city">${booking.fromCity}</div>
            <div class="ticket-sub">${booking.boardingPoint}</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-top: 4px;">
              ${booking.departureTime}
            </div>
          </div>

          <div style="text-align: center;">
            <i class="fa-solid fa-arrow-right-long" style="font-size: 1.5rem; color: #6366f1;"></i>
            <div style="font-size: 0.72rem; font-weight: 700; color: #64748b; margin-top: 4px;">${booking.journeyDate}</div>
          </div>

          <div style="text-align: right;">
            <div class="ticket-city">${booking.toCity}</div>
            <div class="ticket-sub">${booking.droppingPoint}</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-top: 4px;">
              ${booking.arrivalTime}
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="ticket-details-grid">
          <div>
            <div class="ticket-field-label">Operator</div>
            <div class="ticket-field-val">${booking.operator}</div>
          </div>
          <div>
            <div class="ticket-field-label">Bus Number</div>
            <div class="ticket-field-val">${booking.busNumber}</div>
          </div>
          <div>
            <div class="ticket-field-label">Seat(s)</div>
            <div class="ticket-field-val" style="color: #4f46e5;">${booking.seats.join(', ')}</div>
          </div>
          <div>
            <div class="ticket-field-label">Total Fare Paid</div>
            <div class="ticket-field-val">${curSymbol}${booking.amountPaid.toLocaleString()}</div>
          </div>
        </div>

        <!-- Passengers List -->
        <div class="ticket-passenger-row">
          <div class="ticket-field-label">Passengers Assigned</div>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px;">
            ${booking.passengers.map(p => `
              <span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 700;">
                <i class="fa-solid fa-user" style="color: #6366f1; margin-right: 4px;"></i>
                ${p.name} (${p.gender}, Age ${p.age}) - Seat ${p.seat}
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Ticket Footer with Barcode -->
      <div class="ticket-footer">
        <div>
          <div style="font-size: 0.72rem; color: #64748b; font-weight: 600;">Status: <span style="color: #10b981; font-weight: 800;">CONFIRMED</span></div>
          <div style="font-size: 0.72rem; color: #64748b;">Issued to: ${booking.contact.email}</div>
        </div>
        <div style="text-align: right;">
          <div class="ticket-barcode">|||||| | |||| ||| |||||</div>
          <div style="font-size: 0.65rem; color: #94a3b8; font-family: var(--font-mono);">${booking.pnr}</div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// Firebase Cloud Firestore & Booking Management
// ==========================================================================

// Initialize Realtime Sync with Firebase Firestore
function initFirebaseSync() {
  const checkFirebase = setInterval(() => {
    if (window.NexaBusFirebase) {
      clearInterval(checkFirebase);
      console.log('⚡ NexaBus Connected to Firebase Firestore Service');
      
      // Perform initial background fetch & merge from Firestore
      syncFirebaseBookings(false);

      // Subscribe to real-time Cloud updates
      if (typeof window.NexaBusFirebase.subscribeToBookings === 'function') {
        window.NexaBusFirebase.subscribeToBookings((cloudBookings) => {
          if (Array.isArray(cloudBookings) && cloudBookings.length > 0) {
            mergeCloudBookings(cloudBookings);
            updateBookingsBadge();
          }
        });
      }
    }
  }, 300);

  // Stop polling after 8 seconds if offline
  setTimeout(() => clearInterval(checkFirebase), 8000);
}

// Merge cloud bookings with local bookings seamlessly
function mergeCloudBookings(cloudBookings) {
  const local = getSavedBookings();
  const map = new Map();

  // Index local bookings
  local.forEach(b => {
    if (b && b.pnr) map.set(b.pnr, b);
  });

  // Merge cloud bookings (cloud is source of truth)
  cloudBookings.forEach(cb => {
    if (cb && cb.pnr) {
      map.set(cb.pnr, cb);
    }
  });

  const merged = Array.from(map.values());
  localStorage.setItem('nexabus_bookings', JSON.stringify(merged));
  updateBookingsBadge();
}

// Fetch & sync bookings manually or on load from Firebase Cloud Firestore
async function syncFirebaseBookings(userInitiated = false) {
  const syncBtnIcon = document.getElementById('syncIcon');
  if (syncBtnIcon && userInitiated) {
    syncBtnIcon.classList.add('fa-spin');
  }

  if (window.NexaBusFirebase && typeof window.NexaBusFirebase.getAllBookings === 'function') {
    try {
      const cloudBookings = await window.NexaBusFirebase.getAllBookings();
      if (cloudBookings && cloudBookings.length > 0) {
        mergeCloudBookings(cloudBookings);
        if (userInitiated) {
          showToast(`⚡ Synced ${cloudBookings.length} booking(s) from Firebase Cloud DB!`, 'success');
        }
      } else if (userInitiated) {
        // If cloud is empty, upload any local bookings to cloud
        const local = getSavedBookings();
        if (local.length > 0) {
          for (const b of local) {
            await window.NexaBusFirebase.saveBooking(b);
          }
          showToast(`☁️ Uploaded ${local.length} local ticket(s) to Firebase Cloud DB!`, 'success');
        } else {
          showToast('☁️ Firebase Cloud Database is in sync (No records yet).', 'info');
        }
      }
    } catch (e) {
      console.warn('Firebase sync warning:', e);
      if (userInitiated) {
        showToast('Using local storage cache. Cloud connection retry in progress.', 'info');
      }
    }
  }

  if (syncBtnIcon && userInitiated) {
    setTimeout(() => syncBtnIcon.classList.remove('fa-spin'), 600);
  }

  updateBookingsBadge();
  const modal = document.getElementById('myBookingsModal');
  if (modal && modal.classList.contains('active')) {
    openMyBookingsModal();
  }
}

// Save & Retrieve Bookings from LocalStorage + Firebase Firestore
function saveBooking(booking) {
  const existing = getSavedBookings();
  existing.unshift(booking);
  localStorage.setItem('nexabus_bookings', JSON.stringify(existing));

  // Async save directly to Firebase Cloud Firestore
  if (window.NexaBusFirebase && typeof window.NexaBusFirebase.saveBooking === 'function') {
    window.NexaBusFirebase.saveBooking(booking).then(res => {
      if (res && res.success) {
        console.log(`☁️ [Firebase Firestore] Booking ${booking.pnr} persisted to Cloud DB`);
      }
    }).catch(err => {
      console.warn('Firestore async save fallback:', err);
    });
  }
}

function getSavedBookings() {
  try {
    const raw = localStorage.getItem('nexabus_bookings');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function updateBookingsBadge() {
  const badge = document.getElementById('bookingsBadge');
  const count = getSavedBookings().length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// My Bookings Modal
function openMyBookingsModal() {
  const modal = document.getElementById('myBookingsModal');
  const list = document.getElementById('myBookingsList');
  if (!modal || !list) return;

  const bookings = getSavedBookings();

  if (bookings.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-ticket-simple" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--text-dim);"></i>
        <h3>No bookings found yet</h3>
        <p style="font-size: 0.85rem; margin-top: 6px;">Search routes above to book your first luxury bus ticket!</p>
      </div>
    `;
  } else {
    list.innerHTML = bookings.map(b => {
      const curSymbol = b.currencySymbol || '$';
      return `
        <div style="background: var(--bg-secondary); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 18px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: var(--font-mono); font-weight: 800; color: var(--cyan-accent);">${b.pnr}</span>
              <span style="font-size: 0.68rem; color: #34d399; background: rgba(16, 185, 129, 0.1); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.25);">
                <i class="fa-solid fa-cloud"></i> Cloud Synced
              </span>
            </div>
            <span style="background: rgba(16, 185, 129, 0.15); color: var(--emerald-accent); padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">
              ${b.status}
            </span>
          </div>
          <div style="font-size: 1.1rem; font-weight: 800; margin-bottom: 4px;">
            ${b.fromCity} → ${b.toCity}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
            <span><i class="fa-regular fa-calendar"></i> ${b.journeyDate} at ${b.departureTime}</span> • 
            <span>Seats: <strong>${b.seats.join(', ')}</strong></span> • 
            <span>Fare: <strong>${curSymbol}${b.amountPaid.toLocaleString()}</strong></span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-apply-coupon" onclick="viewSpecificTicket('${b.pnr}')" style="padding: 6px 12px;">
              <i class="fa-solid fa-print"></i> View / Print Ticket
            </button>
            <button class="btn-reset-filters" style="color: var(--rose-accent); padding: 6px 12px;" onclick="cancelTicket('${b.pnr}')">
              <i class="fa-solid fa-ban"></i> Cancel Booking
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  modal.classList.add('active');
}

function closeMyBookingsModal() {
  const modal = document.getElementById('myBookingsModal');
  if (modal) modal.classList.remove('active');
}

function viewSpecificTicket(pnr) {
  const bookings = getSavedBookings();
  const b = bookings.find(item => item.pnr === pnr);
  if (!b) return;

  closeMyBookingsModal();
  renderBoardingPassTicket(b);
  const modal = document.getElementById('confirmationModal');
  if (modal) modal.classList.add('active');
}

function cancelTicket(pnr) {
  if (!confirm(`Are you sure you want to cancel booking ${pnr}? A 90% refund will be processed immediately.`)) {
    return;
  }

  let bookings = getSavedBookings();
  bookings = bookings.filter(b => b.pnr !== pnr);
  localStorage.setItem('nexabus_bookings', JSON.stringify(bookings));

  // Delete from Firebase Cloud Firestore
  if (window.NexaBusFirebase && typeof window.NexaBusFirebase.deleteBooking === 'function') {
    window.NexaBusFirebase.deleteBooking(pnr);
  }

  updateBookingsBadge();
  openMyBookingsModal();
  showToast(`Booking ${pnr} cancelled and updated across Cloud Database.`, 'info');
}

// Live GPS Tracker Modal
function openLiveTrackerModal() {
  const modal = document.getElementById('liveTrackerModal');
  if (modal) modal.classList.add('active');
}

function closeLiveTrackerModal() {
  const modal = document.getElementById('liveTrackerModal');
  if (modal) modal.classList.remove('active');
}

// Theme Switcher (Dark / Light)
function initTheme() {
  const saved = localStorage.getItem('nexabus_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('nexabus_theme', next);
  updateThemeIcon(next);
  showToast(`Switched to ${next} mode`, 'info');
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

// Toast Alert System
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ==========================================================================
// 3D Highway Luxury Bus Controls
// ==========================================================================
function set3DBusSpeed(speed, btn) {
  if (bus3dApp) bus3dApp.setSpeed(speed);
  document.querySelectorAll('.speed-chip-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function set3DCameraView(mode, btn) {
  if (bus3dApp) bus3dApp.setCameraPreset(mode);
  document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function toggle3DHeadlights() {
  if (bus3dApp) {
    const isOn = bus3dApp.toggleHeadlights();
    const btn = document.getElementById('btnToggleHeadlights');
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-lightbulb" style="color: ${isOn ? '#38bdf8' : '#64748b'};"></i> Headlights: ${isOn ? 'ON' : 'OFF'}`;
    }
  }
}

function set3DHornPreset(hornId) {
  if (window.indianHorns && window.indianHorns.horns[hornId]) {
    window.indianHorns.activeHornKey = hornId;
    const horn = window.indianHorns.horns[hornId];
    showToast(`🎺 Selected Horn: ${horn.name}`, 'info');
  }
}

function sound3DBusHorn() {
  const select = document.getElementById('cockpitHornSelect');
  const hornId = select ? select.value : 'nagin';
  if (bus3dApp) {
    bus3dApp.playHorn(hornId);
  } else if (window.indianHorns) {
    window.indianHorns.play(hornId);
  }
}

// ==========================================================================
// Indian Highway & Truck Musical Horns Soundboard Logic
// ==========================================================================
function openIndianHornsModal() {
  const modal = document.getElementById('indianHornsModal');
  if (!modal) return;
  renderIndianHornsSoundboard();
  modal.classList.add('active');
}

function closeIndianHornsModal() {
  const modal = document.getElementById('indianHornsModal');
  if (modal) modal.classList.remove('active');
}

function renderIndianHornsSoundboard() {
  const grid = document.getElementById('hornsSoundboardGrid');
  if (!grid || !window.indianHorns) return;

  const horns = window.indianHorns.horns;
  grid.innerHTML = Object.values(horns).map(horn => {
    const isCurrentActive = window.indianHorns.activeHornKey === horn.id;
    return `
      <div class="horn-sound-card ${isCurrentActive ? 'active-selected' : ''}" data-horn-id="${horn.id}" onclick="playIndianHorn('${horn.id}')">
        <div class="horn-card-header">
          <div class="horn-name-title">
            <i class="fa-solid fa-bullhorn" style="color: ${horn.color};"></i>
            <span>${horn.name}</span>
          </div>
          <span class="horn-tag-pill">${horn.tag}</span>
        </div>
        <p class="horn-card-desc">${horn.desc}</p>
        <div class="horn-card-footer">
          <span class="horn-duration-badge"><i class="fa-regular fa-clock" style="margin-right: 4px;"></i>${horn.duration}s duration</span>
          <button class="btn-play-horn-item" onclick="event.stopPropagation(); playIndianHorn('${horn.id}')" title="Play ${horn.name}">
            <i class="fa-solid fa-play"></i> Blow Horn
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function playIndianHorn(hornId) {
  if (!window.indianHorns) return;
  const horn = window.indianHorns.play(hornId);
  
  // Sync cockpit selector if open
  const cockpitSelect = document.getElementById('cockpitHornSelect');
  if (cockpitSelect) cockpitSelect.value = hornId;

  // Update active title in soundboard banner
  const activeTitle = document.getElementById('hornActiveTitle');
  if (activeTitle && horn) {
    activeTitle.textContent = horn.name;
    activeTitle.style.color = horn.color || '#fbbf24';
  }

  // Update active card class
  document.querySelectorAll('.horn-sound-card').forEach(c => c.classList.remove('active-selected'));
  const targetCard = document.querySelector(`.horn-sound-card[data-horn-id="${hornId}"]`);
  if (targetCard) targetCard.classList.add('active-selected');
}

function initIndianHornsEvents() {
  // Listen to custom horn events to animate the soundboard equalizer
  window.addEventListener('indianHornHonked', (e) => {
    const eq = document.getElementById('soundboardEqualizer');
    if (eq) {
      eq.classList.add('active');
      const horn = e.detail && e.detail.horn;
      if (horn) {
        setTimeout(() => {
          eq.classList.remove('active');
        }, (horn.duration + 0.3) * 1000);
      }
    }
  });
}

function testBusHorn(busId, busType = '') {
  if (!window.indianHorns) return;
  
  // Pick horn matched to coach type
  const typeLower = (busType || '').toLowerCase();
  let hornId = 'nagin';
  if (typeLower.includes('volvo') || typeLower.includes('scania') || typeLower.includes('multiaxle')) {
    hornId = 'volvoSymphony';
  } else if (typeLower.includes('sleeper') || typeLower.includes('ac')) {
    hornId = 'nagin';
  } else if (typeLower.includes('express') || typeLower.includes('tata')) {
    hornId = 'tataTrumpet';
  } else if (typeLower.includes('deluxe') || typeLower.includes('gold')) {
    hornId = 'dhoom';
  } else {
    hornId = 'hornOk';
  }

  const horn = window.indianHorns.play(hornId);
}

// ==========================================================================
// All States & UTs of India Directory & Explorer Logic
// ==========================================================================
let activeStateZone = 'all';
let activeStateSearchQuery = '';

function renderIndianStatesGrid() {
  const grid = document.getElementById('indianStatesGrid');
  if (!grid || typeof INDIAN_STATES_DATA === 'undefined') return;

  const q = activeStateSearchQuery.toLowerCase().trim();
  const filtered = INDIAN_STATES_DATA.filter(stateItem => {
    // Zone filter
    if (activeStateZone !== 'all') {
      if (activeStateZone === 'Union Territory' && stateItem.zone !== 'Union Territory') return false;
      if (activeStateZone !== 'Union Territory' && stateItem.zone !== activeStateZone) return false;
    }
    // Search query
    if (q) {
      const matchName = stateItem.name.toLowerCase().includes(q);
      const matchCap = stateItem.capital.toLowerCase().includes(q);
      const matchHubs = stateItem.hubs.some(h => h.toLowerCase().includes(q));
      if (!matchName && !matchCap && !matchHubs) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--glass-border);">
        <i class="fa-solid fa-map-location" style="font-size: 2.5rem; color: var(--text-dim); margin-bottom: 12px;"></i>
        <h3>No states match your search</h3>
        <p style="font-size: 0.85rem; margin-top: 6px;">Try searching for a different state name, capital, or city.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="indian-state-card" id="state-card-${item.id}">
      <div>
        <div class="state-card-top">
          <div class="state-badge-circle">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <span class="state-zone-tag">${item.zone}</span>
        </div>
        <h3 class="state-name">${item.name}</h3>
        <div class="state-capital"><i class="fa-solid fa-location-dot"></i> Capital: ${item.capital}</div>
        <p class="state-desc">${item.desc}</p>
        
        <div class="state-hubs-chips">
          ${item.hubs.slice(0, 5).map(h => `<span class="state-hub-chip">${h}</span>`).join('')}
          ${item.hubs.length > 5 ? `<span class="state-hub-chip">+${item.hubs.length - 5} more</span>` : ''}
        </div>
      </div>

      <div>
        <div class="state-top-corridor">
          <div class="corridor-label">Featured Express Route</div>
          <div class="corridor-route">
            <span>${item.topRoute.label}</span>
            <span style="color: var(--amber-accent); font-family: var(--font-mono); font-weight: 800;">${item.topRoute.fare}</span>
          </div>
        </div>

        <button class="btn-book-state-route" onclick="bookStateRoute('${item.topRoute.from}', '${item.topRoute.to}', '${item.name}')">
          <i class="fa-solid fa-ticket"></i> Book ${item.name} Buses
        </button>
      </div>
    </div>
  `).join('');
}

function filterIndianStatesByZone(zone, btn) {
  activeStateZone = zone;
  document.querySelectorAll('.zone-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderIndianStatesGrid();
}

function filterIndianStates(query) {
  activeStateSearchQuery = query;
  renderIndianStatesGrid();
}

function bookStateRoute(fromCityId, toCityId, stateName) {
  // If not already set to India, switch to India
  if (state.country !== 'IN') {
    selectCountry('IN', false);
  }

  const fromSelect = document.getElementById('fromCitySelect');
  const toSelect = document.getElementById('toCitySelect');

  if (fromSelect && toSelect) {
    // Check if options exist
    let optFrom = Array.from(fromSelect.options).find(o => o.value === fromCityId || o.textContent.includes(fromCityId));
    let optTo = Array.from(toSelect.options).find(o => o.value === toCityId || o.textContent.includes(toCityId));

    if (optFrom) fromSelect.value = optFrom.value;
    if (optTo) toSelect.value = optTo.value;

    performSearch();

    // Smooth scroll to search results
    const resultsEl = document.getElementById('busResultsList');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showToast(`Routes for ${stateName} loaded! Choose your bus & seats.`, 'success');
  }
}
