/**
 * NexaBus Global Data Model & Multi-Country Catalog
 */

const COUNTRIES_DATA = {
  US: {
    id: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    phoneCode: '+1',
    defaultFrom: 'NYC',
    defaultTo: 'BOS',
    basePriceRange: [28, 48],
    popularRoutes: [
      { from: 'NYC', to: 'BOS', label: 'NYC → Boston', price: '$28' },
      { from: 'NYC', to: 'WAS', label: 'NYC → Washington DC', price: '$32' },
      { from: 'SFO', to: 'LAX', label: 'San Francisco → LA', price: '$38' },
      { from: 'CHI', to: 'DET', label: 'Chicago → Detroit', price: '$30' },
      { from: 'LAX', to: 'LAS', label: 'Los Angeles → Las Vegas', price: '$35' }
    ],
    cities: [
      { id: 'NYC', name: 'New York', state: 'NY', terminals: ['Port Authority Terminal (Gate 42)', 'Penn Station Transit Concourse', 'GW Bridge Station'] },
      { id: 'BOS', name: 'Boston', state: 'MA', terminals: ['South Station Gate 18', 'Back Bay Station', 'Logan Airport Express Terminal'] },
      { id: 'WAS', name: 'Washington DC', state: 'DC', terminals: ['Union Station Bus Concourse', 'Dupont Circle Depot', 'Silver Spring Metro Hub'] },
      { id: 'PHL', name: 'Philadelphia', state: 'PA', terminals: ['30th Street Station', 'Market St Transit Lounge', 'Center City Depot'] },
      { id: 'CHI', name: 'Chicago', state: 'IL', terminals: ['Union Station Canal St', 'Cumberland Transit Center', 'Midway Bus Plaza'] },
      { id: 'SFO', name: 'San Francisco', state: 'CA', terminals: ['Salesforce Transit Center', 'Fisherman Wharf Depot', 'Civic Center Hub'] },
      { id: 'LAX', name: 'Los Angeles', state: 'CA', terminals: ['Union Station Patsaouras Plaza', 'Downtown Transit Arcade', 'LAX City Center'] },
      { id: 'LAS', name: 'Las Vegas', state: 'NV', terminals: ['Strip South Terminal', 'Downtown Fremont Depot', 'Airport Express Concourse'] },
      { id: 'DET', name: 'Detroit', state: 'MI', terminals: ['Rosa Parks Transit Center', 'Campus Martius Hub', 'Metro Airport Express'] }
    ],
    operators: [
      { id: 'us1', name: 'NexaGlide Royal Multi-Axle', rating: 4.9, reviews: 1420, tag: '⚡ Top Rated', type: 'Volvo 9600 2+1 Luxury Sleeper AC', amenities: ['wifi', 'ac', 'charging', 'water', 'blanket', 'gps', 'reading-light', 'washroom'], cancellationPolicy: 'Free cancellation up to 6 hrs before departure' },
      { id: 'us2', name: 'Zephyr Intercity Cruiser', rating: 4.8, reviews: 980, tag: '🌟 Luxury Class', type: 'Scania Metrolink HD Semi-Sleeper AC', amenities: ['wifi', 'ac', 'charging', 'water', 'snack', 'gps', 'entertainment'], cancellationPolicy: 'Refund 90% if cancelled 12 hrs before' },
      { id: 'us3', name: 'EcoVolt GreenLine Electric', rating: 4.7, reviews: 812, tag: '🌱 100% Zero-Emission EV', type: 'BYD Electric Supercoach 2+2 AC', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'snack'], cancellationPolicy: 'Free cancellation up to 2 hrs before' },
      { id: 'us4', name: 'NightLiner Express Sleeper', rating: 4.8, reviews: 1150, tag: '🌙 Premium Bed Rest', type: 'Mercedes Benz StarCoach Sleeper 2+1', amenities: ['wifi', 'ac', 'charging', 'blanket', 'pillow', 'water', 'gps', 'washroom'], cancellationPolicy: 'Free reschedule anytime before 4 hrs' }
    ]
  },

  IN: {
    id: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    phoneCode: '+91',
    defaultFrom: 'BOM',
    defaultTo: 'PUN',
    basePriceRange: [550, 1600],
    popularRoutes: [
      { from: 'BOM', to: 'PUN', label: 'Mumbai → Pune', price: '₹450' },
      { from: 'BOM', to: 'GOA', label: 'Mumbai → Goa', price: '₹1,250' },
      { from: 'DEL', to: 'JAI', label: 'Delhi → Jaipur', price: '₹650' },
      { from: 'BLR', to: 'CHE', label: 'Bengaluru → Chennai', price: '₹850' },
      { from: 'HYD', to: 'BLR', label: 'Hyderabad → Bengaluru', price: '₹1,150' }
    ],
    cities: [
      // Western India
      { id: 'BOM', name: 'Mumbai', state: 'Maharashtra', terminals: ['Borivali Nancy Colony', 'Dadar TT Circle (Swami Narayan)', 'Vashi Toll Plaza Gate 2'] },
      { id: 'PUN', name: 'Pune', state: 'Maharashtra', terminals: ['Swargate Bus Terminal', 'Wakad Hinjewadi Bridge', 'Shivajinagar Station Hub'] },
      { id: 'NAG', name: 'Nagpur', state: 'Maharashtra', terminals: ['Ganeshpeth Central Bus Stand', 'Mor Bhavan Sitabuldi', 'Chhatrapati Square'] },
      { id: 'AMD', name: 'Ahmedabad', state: 'Gujarat', terminals: ['Geeta Mandir Central Bus Stand', 'Paldi Cross Road Lounge', 'ISCON Circle SG Highway'] },
      { id: 'SUR', name: 'Surat', state: 'Gujarat', terminals: ['Central Bus Station Ring Road', 'Kamrej Char Rasta Hub', 'Adajan Bus Depot'] },
      { id: 'GOA', name: 'Goa', state: 'Goa', terminals: ['Panaji KTC Bus Stand', 'Madgaon Railway Station Terminal', 'Mapusa New Bus Depot'] },

      // Northern India
      { id: 'DEL', name: 'Delhi', state: 'Delhi NCR', terminals: ['Kashmere Gate ISBT Counter 12', 'Anand Vihar Pacific Mall Depot', 'Dhaula Kuan Express Terminal'] },
      { id: 'JAI', name: 'Jaipur', state: 'Rajasthan', terminals: ['Sindhi Camp Bus Stand Gate 3', 'Narayan Singh Circle', 'Transport Nagar Bypass'] },
      { id: 'UDZ', name: 'Udaipur', state: 'Rajasthan', terminals: ['Udiapole Bus Terminal', 'Fatehpura Circle Lounge', 'Reticola Bus Stand'] },
      { id: 'JOD', name: 'Jodhpur', state: 'Rajasthan', terminals: ['Paota Bus Stand', 'Railway Station Kalpataru Hub', 'Pal Road Depot'] },
      { id: 'LKO', name: 'Lucknow', state: 'Uttar Pradesh', terminals: ['Alambagh ISBT Gate 4', 'Charbagh Bus Depot', 'Polytechnic Chauraha'] },
      { id: 'VNS', name: 'Varanasi', state: 'Uttar Pradesh', terminals: ['Cantt Railway Station Bus Concourse', 'Lanka BHU Transit Hub', 'Babatpur Airport Road'] },
      { id: 'AGR', name: 'Agra', state: 'Uttar Pradesh', terminals: ['Idgah Bus Stand', 'ISBT Transport Nagar', 'Taj Express Interchange'] },
      { id: 'AYD', name: 'Ayodhya', state: 'Uttar Pradesh', terminals: ['Dham Bus Concourse', 'Naya Ghat Transit Point', 'Rambabu Bus Depot'] },
      { id: 'CHD', name: 'Chandigarh', state: 'Chandigarh', terminals: ['ISBT Sector 43 Platform 8', 'ISBT Sector 17 Plaza', 'Housing Board Chowk'] },
      { id: 'ATQ', name: 'Amritsar', state: 'Punjab', terminals: ['Shahid Madan Lal Dhingra ISBT', 'Golden Temple Bus Terminal', 'Hall Gate Concourse'] },
      { id: 'SHI', name: 'Shimla', state: 'Himachal Pradesh', terminals: ['Tutikandi ISBT Shimla Gate 2', 'Victory Tunnel Depot', 'Old Bus Stand Concourse'] },
      { id: 'MNL', name: 'Manali', state: 'Himachal Pradesh', terminals: ['Mall Road Private Volvo Stand', 'Rangri Green Tax Barrier Hub', 'Patlikuhl Depot'] },
      { id: 'DED', name: 'Dehradun', state: 'Uttarakhand', terminals: ['ISBT Haridwar Road Gate 3', 'Clock Tower Depot', 'Mussoorie Diversion Hub'] },
      { id: 'RSH', name: 'Rishikesh', state: 'Uttarakhand', terminals: ['Yatayat Bus Stand Natraj Chowk', 'Tapovan Swiss Cottage Stop', 'AIIMS Bypass'] },
      { id: 'SXR', name: 'Srinagar', state: 'Jammu & Kashmir', terminals: ['TRC Tourist Reception Centre', 'Batmaloo Bus Depot', 'Lal Chowk Terminal'] },
      { id: 'IXL', name: 'Leh', state: 'Ladakh', terminals: ['New Bus Stand Skalzangling', 'Main Bazaar Tourist Terminal', 'Choglamsar Hub'] },

      // Southern India
      { id: 'BLR', name: 'Bengaluru', state: 'Karnataka', terminals: ['Majestic KBS Gate 4', 'Madiwala St. Johns Hospital', 'Electronic City Toll Plaza'] },
      { id: 'MYQ', name: 'Mysuru', state: 'Karnataka', terminals: ['KSRTC Suburb Bus Stand Gate 2', 'Columbia Asia Hospital Ring Road', 'Infy Circle'] },
      { id: 'CHE', name: 'Chennai', state: 'Tamil Nadu', terminals: ['CMBT Koyambedu Platform 7', 'Guindy Asoka Pillar', 'Tambaram Railway Station Depot'] },
      { id: 'CJB', name: 'Coimbatore', state: 'Tamil Nadu', terminals: ['Gandhipuram Central Bus Stand', 'Omni Bus Stand Sathy Road', 'Singanallur Hub'] },
      { id: 'MDU', name: 'Madurai', state: 'Tamil Nadu', terminals: ['Mattuthavani Integrated Bus Terminal', 'Arapalayam Depot', 'Periyar Bus Concourse'] },
      { id: 'HYD', name: 'Hyderabad', state: 'Telangana', terminals: ['MGBS Imlibun Terminal', 'Ameerpet Metro Station Hub', 'Gachibowli ORR Junction'] },
      { id: 'VTZ', name: 'Visakhapatnam', state: 'Andhra Pradesh', terminals: ['Dwaraka Bus Station (RTC Complex)', 'Maddilapalem Bus Depot', 'Gajuwaka Junction'] },
      { id: 'TIR', name: 'Tirupati', state: 'Andhra Pradesh', terminals: ['Central Bus Station (CBS)', 'Alipiri Balaji Bus Terminal', 'Renigunta Road'] },
      { id: 'COK', name: 'Kochi', state: 'Kerala', terminals: ['Vyttila Mobility Hub Platform 5', 'Edappally Toll Toll Gate', 'Kaloor Private Bus Stand'] },
      { id: 'TRV', name: 'Thiruvananthapuram', state: 'Kerala', terminals: ['Thampanoor KSRTC Central Stand', 'Kazhakoottam Technopark Hub', 'East Fort Concourse'] },
      { id: 'PDY', name: 'Puducherry', state: 'Puducherry', terminals: ['New Bus Stand Maraimalai Adigal Salai', 'East Coast Road Beach Junction', 'Auroville Express Hub'] },

      // Central & Eastern India
      { id: 'IDR', name: 'Indore', state: 'Madhya Pradesh', terminals: ['Sarwate Bus Stand', 'Navlakha Bus Terminal', 'Vijay Nagar Square Lounge'] },
      { id: 'BHO', name: 'Bhopal', state: 'Madhya Pradesh', terminals: ['Kushabhau Thakre ISBT Habibganj', 'Nadra Bus Stand', 'Lalghati Square'] },
      { id: 'PAT', name: 'Patna', state: 'Bihar', terminals: ['Bairiya ISBT Pataliputra', 'Mithapur Bus Stand', 'Gandhi Maidan Concourse'] },
      { id: 'IXR', name: 'Ranchi', state: 'Jharkhand', terminals: ['Khadgarha Bus Stand Kantatoli', 'ITDC Ranchi Hub', 'Birsa Munda Bus Depot'] },
      { id: 'BBI', name: 'Bhubaneswar', state: 'Odisha', terminals: ['Baramunda ISBT Gate 3', 'Master Canteen Railway Plaza', 'Jayadev Vihar Hub'] },
      { id: 'CCU', name: 'Kolkata', state: 'West Bengal', terminals: ['Esplanade Bus Terminal Platform 12', 'Babughat Depot', 'Karunamoyee Salt Lake Terminal'] },
      { id: 'IXB', name: 'Siliguri', state: 'West Bengal', terminals: ['Tenzing Norgay Central Bus Terminal', 'Junction Bus Depot', 'Bagdogra Express Point'] },
      { id: 'RPR', name: 'Raipur', state: 'Chhattisgarh', terminals: ['Sri Balaji Swami ISBT Bhatagaon', 'Pandri Old Bus Stand', 'Telibandha Chowk'] },

      // North-Eastern India
      { id: 'GAU', name: 'Guwahati', state: 'Assam', terminals: ['ISBT Betkuchi Platform 4', 'Paltan Bazaar ASTC Terminal', 'Khanapara Flyover Point'] },
      { id: 'SHL', name: 'Shillong', state: 'Meghalaya', terminals: ['Polo Ground Tourist Bus Stand', 'Iewduh Anjalee Cinema Depot', 'Police Bazar Concourse'] },
      { id: 'GTO', name: 'Gangtok', state: 'Sikkim', terminals: ['SNT Bus Station Paljor Stadium Road', 'Deorali Taxi & Coach Stand', 'Tadong Hub'] }
    ],
    operators: [
      { id: 'in1', name: 'Zingbus Premium Electric', rating: 4.9, reviews: 3120, tag: '⚡ Top Rated EV', type: 'Volvo B11R Multi-Axle Sleeper AC', amenities: ['wifi', 'ac', 'charging', 'water', 'blanket', 'gps', 'reading-light', 'washroom'], cancellationPolicy: 'Free cancellation up to 4 hrs before' },
      { id: 'in2', name: 'IntrCity SmartBus Lounge', rating: 4.8, reviews: 2450, tag: '☕ Smart Lounge Included', type: 'Scania Metrolink HD Sleeper AC', amenities: ['wifi', 'ac', 'charging', 'water', 'snack', 'gps', 'entertainment'], cancellationPolicy: '100% refund on boarding cancellation' },
      { id: 'in3', name: 'VRL Royal Cruiser', rating: 4.8, reviews: 4890, tag: '👑 Royal Class', type: 'Volvo 9600 Multi-Axle 2+1 Sleeper', amenities: ['wifi', 'ac', 'charging', 'water', 'blanket', 'gps', 'washroom'], cancellationPolicy: 'Free date change up to 6 hrs' },
      { id: 'in4', name: 'Orange Travels Sleeper', rating: 4.7, reviews: 1820, tag: '🌙 Luxury Overnight', type: 'BharatBenz Executive AC Sleeper', amenities: ['ac', 'charging', 'blanket', 'water', 'gps'], cancellationPolicy: 'Instant 90% refund on cancel' },
      { id: 'in5', name: 'SRS Travels Super Luxury', rating: 4.8, reviews: 3600, tag: '🌟 South Express', type: 'Scania Touring HD Multi-Axle', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'washroom'], cancellationPolicy: 'Instant reschedule free' }
    ]
  },

  GB: {
    id: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    phoneCode: '+44',
    defaultFrom: 'LON',
    defaultTo: 'MAN',
    basePriceRange: [18, 42],
    popularRoutes: [
      { from: 'LON', to: 'MAN', label: 'London → Manchester', price: '£22' },
      { from: 'LON', to: 'EDI', label: 'London → Edinburgh', price: '£36' },
      { from: 'LON', to: 'BIR', label: 'London → Birmingham', price: '£18' },
      { from: 'LON', to: 'BRI', label: 'London → Bristol', price: '£19' },
      { from: 'MAN', to: 'LIV', label: 'Manchester → Liverpool', price: '£12' }
    ],
    cities: [
      { id: 'LON', name: 'London', state: 'ENG', terminals: ['Victoria Coach Station (Gate 14)', 'Golders Green Station', 'Stratford City Bus Station'] },
      { id: 'MAN', name: 'Manchester', state: 'ENG', terminals: ['Chorlton Street Coach Station', 'Shudehill Interchange', 'Manchester Airport Terminal 1'] },
      { id: 'EDI', name: 'Edinburgh', state: 'SCT', terminals: ['St Andrew Square Bus Station', 'Haymarket Station Interchange', 'Ingliston Park & Ride'] },
      { id: 'BIR', name: 'Birmingham', state: 'ENG', terminals: ['Digbeth Coach Station', 'Birmingham Airport Hub', 'Brunel Street Interchange'] },
      { id: 'BRI', name: 'Bristol', state: 'ENG', terminals: ['Marlborough Street Bus Station', 'Bristol Parkway Station', 'Cribbs Causeway Depot'] },
      { id: 'GLA', name: 'Glasgow', state: 'SCT', terminals: ['Buchanan Bus Station Gate 8', 'Central Station Concourse', 'Queen Street Depot'] },
      { id: 'LIV', name: 'Liverpool', state: 'ENG', terminals: ['Liverpool ONE Bus Station', 'Edge Lane Drive Interchange', 'Lime Street Hub'] },
      { id: 'OXF', name: 'Oxford', state: 'ENG', terminals: ['Gloucester Green Bus Station', 'Thornhill Park and Ride', 'Headington Shops'] }
    ],
    operators: [
      { id: 'gb1', name: 'National Express Platinum', rating: 4.9, reviews: 2200, tag: '👑 Britain Choice', type: 'Caetano Levante III Scania Luxury', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'reading-light', 'washroom'], cancellationPolicy: 'Free change of journey anytime before departure' },
      { id: 'gb2', name: 'Megabus Gold Sleeper', rating: 4.7, reviews: 1650, tag: '⚡ Fast Track', type: 'Van Hool Astromega Double Decker', amenities: ['wifi', 'ac', 'charging', 'gps', 'snack'], cancellationPolicy: 'Refund voucher issued on cancel' },
      { id: 'gb3', name: 'Oxford Tube Executive', rating: 4.8, reviews: 890, tag: '🌟 24/7 Service', type: 'Plaxton Elite Volvo B11R Luxury', amenities: ['wifi', 'ac', 'charging', 'gps', 'reading-light'], cancellationPolicy: 'Free cancellation up to 2 hours' },
      { id: 'gb4', name: 'Scottish Citylink Gold', rating: 4.8, reviews: 1400, tag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Highland Express', type: 'Irizar i8 Luxury Coach', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'washroom'], cancellationPolicy: 'Full refund 12 hours prior' }
    ]
  },

  DE: {
    id: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    phoneCode: '+49',
    defaultFrom: 'BER',
    defaultTo: 'MUC',
    basePriceRange: [22, 49],
    popularRoutes: [
      { from: 'BER', to: 'MUC', label: 'Berlin → Munich', price: '€29' },
      { from: 'FRA', to: 'COL', label: 'Frankfurt → Cologne', price: '€21' },
      { from: 'BER', to: 'HAM', label: 'Berlin → Hamburg', price: '€24' },
      { from: 'MUC', to: 'STU', label: 'Munich → Stuttgart', price: '€23' },
      { from: 'HAM', to: 'HAN', label: 'Hamburg → Hannover', price: '€19' }
    ],
    cities: [
      { id: 'BER', name: 'Berlin', state: 'BE', terminals: ['ZOB am Funkturm (Platform 11)', 'Berlin Südkreuz Station', 'Alexanderplatz Concourse'] },
      { id: 'MUC', name: 'Munich', state: 'BY', terminals: ['ZOB München Hackerbrücke', 'Fröttmaning P+R Bus Station', 'Munich Airport Terminal 2'] },
      { id: 'FRA', name: 'Frankfurt', state: 'HE', terminals: ['Frankfurt Main Hbf Stuttgarter Str', 'Frankfurt Airport Terminal 1 Hub', 'Südbahnhof Depot'] },
      { id: 'HAM', name: 'Hamburg', state: 'HH', terminals: ['ZOB Hamburg Adenauerallee', 'Hamburg-Harburg Station', 'Airport Express Concourse'] },
      { id: 'COL', name: 'Cologne', state: 'NW', terminals: ['Köln Bonn Airport Terminal 2', 'Köln Messe/Deutz Station', 'Breslauer Platz Hbf'] },
      { id: 'STU', name: 'Stuttgart', state: 'BW', terminals: ['SAB Stuttgart Airport Busterminal', 'Stuttgart Obertürkheim', 'Zuffenhausen Station'] },
      { id: 'HAN', name: 'Hannover', state: 'NI', terminals: ['ZOB Hannover Rundestraße', 'Hannover Messe Nord', 'Airport Concourse'] }
    ],
    operators: [
      { id: 'de1', name: 'FlixBus Premium Electric', rating: 4.8, reviews: 3500, tag: '🌱 100% Green Energy', type: 'Setra S 531 DT Double-Decker', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'reading-light', 'washroom'], cancellationPolicy: 'Free cancellation voucher up to 15 mins before' },
      { id: 'de2', name: 'Pinkbus Express Non-Stop', rating: 4.9, reviews: 1120, tag: '⚡ Direct No Stops', type: 'Neoplan Skyliner VIP Coach', amenities: ['wifi', 'ac', 'charging', 'water', 'snack', 'gps', 'washroom'], cancellationPolicy: 'Free cancellation up to 24 hrs' },
      { id: 'de3', name: 'RegioJet Fun&Relax', rating: 4.8, reviews: 1980, tag: '☕ Free Hot Drinks', type: 'Irizar i8 Luxury Lounge', amenities: ['wifi', 'ac', 'charging', 'water', 'snack', 'gps', 'entertainment'], cancellationPolicy: 'Free refund up to 15 min prior' }
    ]
  },

  FR: {
    id: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    phoneCode: '+33',
    defaultFrom: 'PAR',
    defaultTo: 'LYO',
    basePriceRange: [24, 52],
    popularRoutes: [
      { from: 'PAR', to: 'LYO', label: 'Paris → Lyon', price: '€27' },
      { from: 'PAR', to: 'BOR', label: 'Paris → Bordeaux', price: '€32' },
      { from: 'MAR', to: 'NIC', label: 'Marseille → Nice', price: '€19' },
      { from: 'PAR', to: 'LIL', label: 'Paris → Lille', price: '€18' },
      { from: 'LYO', to: 'MAR', label: 'Lyon → Marseille', price: '€26' }
    ],
    cities: [
      { id: 'PAR', name: 'Paris', state: 'IDF', terminals: ['Gare de Bercy-Seine (Quai 22)', 'Paris Gallieni Porte de Bagnolet', 'Porte Maillot Terminal'] },
      { id: 'LYO', name: 'Lyon', state: 'ARA', terminals: ['Lyon Perrache Gare Routière', 'Lyon Part-Dieu Villette', 'Aéroport Saint-Exupéry Hub'] },
      { id: 'MAR', name: 'Marseille', state: 'PAC', terminals: ['Gare Saint-Charles Quai 8', 'Marseille Provence Aéroport', 'Place des Marseillaises'] },
      { id: 'BOR', name: 'Bordeaux', state: 'NAQ', terminals: ['Gare Saint-Jean Belcier', 'Bordeaux Bègles Bus Depot', 'Aéroport Mérignac Express'] },
      { id: 'NIC', name: 'Nice', state: 'PAC', terminals: ['Gare Routière Nice Côte d’Azur T1', 'Nice Grand Arenas Interchange', 'Vauban Station'] },
      { id: 'LIL', name: 'Lille', state: 'HDF', terminals: ['Lille Europe Boulevard de Leeds', 'Gare de Lille Flandres', 'Villeneuve d’Ascq Hub'] },
      { id: 'TOU', name: 'Toulouse', state: 'OCC', terminals: ['Gare Routière Pierre Sémard', 'Matabiau Station Concourse', 'Blagnac Airport Terminal'] }
    ],
    operators: [
      { id: 'fr1', name: 'BlaBlaCar Bus Étoile', rating: 4.8, reviews: 2980, tag: '⚡ Top French Carrier', type: 'Mercedes-Benz Tourismo VIP', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'reading-light', 'washroom'], cancellationPolicy: 'Free cancellation up to 30 mins before' },
      { id: 'fr2', name: 'FlixBus France Confort', rating: 4.7, reviews: 2150, tag: '🌿 Clean Euro6 Fleet', type: 'MAN Lion’s Coach L Supreme', amenities: ['wifi', 'ac', 'charging', 'gps', 'snack', 'washroom'], cancellationPolicy: 'Instant reschedule without fee' },
      { id: 'fr3', name: 'Alsa France Express', rating: 4.9, reviews: 870, tag: '👑 Premium Service', type: 'Setra ComfortClass S 517 HD', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'washroom'], cancellationPolicy: 'Full refund up to 48 hrs' }
    ]
  },

  CA: {
    id: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    phoneCode: '+1',
    defaultFrom: 'TOR',
    defaultTo: 'MTL',
    basePriceRange: [32, 65],
    popularRoutes: [
      { from: 'TOR', to: 'MTL', label: 'Toronto → Montreal', price: 'C$45' },
      { from: 'TOR', to: 'OTT', label: 'Toronto → Ottawa', price: 'C$38' },
      { from: 'MTL', to: 'QBC', label: 'Montreal → Quebec City', price: 'C$34' },
      { from: 'VAN', to: 'CAL', label: 'Vancouver → Calgary', price: 'C$62' },
      { from: 'CAL', to: 'EDM', label: 'Calgary → Edmonton', price: 'C$39' }
    ],
    cities: [
      { id: 'TOR', name: 'Toronto', state: 'ON', terminals: ['Union Station Bus Terminal (Bay 38)', 'Yorkdale GO Station Depot', 'Scarborough Town Centre'] },
      { id: 'MTL', name: 'Montreal', state: 'QC', terminals: ['Gare d’Autocars de Montréal (Platform 9)', 'Longueuil Terminus Metro', 'Dorval Airport Express'] },
      { id: 'OTT', name: 'Ottawa', state: 'ON', terminals: ['St. Laurent Bus Transit Station', 'Ottawa VIA Rail Station Hub', 'Fallowfield Transitway'] },
      { id: 'QBC', name: 'Quebec City', state: 'QC', terminals: ['Gare du Palais Terminal', 'Sainte-Foy Station Concourse', 'Laurier Québec Depot'] },
      { id: 'VAN', name: 'Vancouver', state: 'BC', terminals: ['Pacific Central Station Gate 4', 'SkyTrain Main St Depot', 'Richmond Olympic Oval Hub'] },
      { id: 'CAL', name: 'Calgary', state: 'AB', terminals: ['Downtown 4th Ave SW Terminal', 'North Hill Centre Hub', 'Calgary International Airport'] },
      { id: 'EDM', name: 'Edmonton', state: 'AB', terminals: ['Downtown 104 Ave Terminal', 'University Transit Station', 'Southgate Centre Bus Loop'] }
    ],
    operators: [
      { id: 'ca1', name: 'Megabus Canada Express', rating: 4.8, reviews: 1820, tag: '⚡ Reliable & Fast', type: 'Van Hool TD925 Luxury Double Decker', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'washroom'], cancellationPolicy: 'Free reschedule up to 24 hrs' },
      { id: 'ca2', name: 'Rider Express Trans-Canada', rating: 4.7, reviews: 950, tag: '🏔️ Rockies Luxury', type: 'Prevost H3-45 Executive Coach', amenities: ['wifi', 'ac', 'charging', 'blanket', 'water', 'gps', 'washroom'], cancellationPolicy: 'Refund 85% up to 12 hrs before' },
      { id: 'ca3', name: 'Ebus Alberta Prime', rating: 4.8, reviews: 1100, tag: '🍁 Pure Canadian', type: 'Volvo 9700 High Deck Coach', amenities: ['wifi', 'ac', 'charging', 'gps', 'snack'], cancellationPolicy: 'Free cancellation up to 6 hrs' }
    ]
  },

  AU: {
    id: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    phoneCode: '+61',
    defaultFrom: 'SYD',
    defaultTo: 'MEL',
    basePriceRange: [38, 75],
    popularRoutes: [
      { from: 'SYD', to: 'MEL', label: 'Sydney → Melbourne', price: 'A$49' },
      { from: 'SYD', to: 'CAN', label: 'Sydney → Canberra', price: 'A$35' },
      { from: 'BRI', to: 'GOL', label: 'Brisbane → Gold Coast', price: 'A$22' },
      { from: 'MEL', to: 'ADL', label: 'Melbourne → Adelaide', price: 'A$55' },
      { from: 'BRI', to: 'SUN', label: 'Brisbane → Sunshine Coast', price: 'A$26' }
    ],
    cities: [
      { id: 'SYD', name: 'Sydney', state: 'NSW', terminals: ['Central Station Forecourt Bay 1', 'Sydney Airport Terminal 1 Hub', 'Strathfield Station Concourse'] },
      { id: 'MEL', name: 'Melbourne', state: 'VIC', terminals: ['Southern Cross Coach Terminal Bay 68', 'Flinders St Station Depot', 'Tullamarine Airport SkyBus'] },
      { id: 'CAN', name: 'Canberra', state: 'ACT', terminals: ['Jolimont Centre Northbourne Ave', 'Canberra Airport Concourse', 'Kingston Station Hub'] },
      { id: 'BRI', name: 'Brisbane', state: 'QLD', terminals: ['Brisbane Transit Centre Roma St', 'Queen St Underground Mall', 'Eagle Farm Interchange'] },
      { id: 'GOL', name: 'Gold Coast', state: 'QLD', terminals: ['Surfers Paradise Transit Centre', 'Robina Station Bus Depot', 'Coolangatta Airport Hub'] },
      { id: 'ADL', name: 'Adelaide', state: 'SA', terminals: ['Adelaide Central Bus Station Franklin St', 'Adelaide Airport Terminal', 'Mawson Interchange'] }
    ],
    operators: [
      { id: 'au1', name: 'Greyhound Australia Pioneer', rating: 4.8, reviews: 2600, tag: '🦘 Australia Icon', type: 'Irizar i6S Volvo B11R Luxury', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'reading-light', 'washroom'], cancellationPolicy: 'Free date transfer with zero admin fee' },
      { id: 'au2', name: 'Murrays Executive Coaches', rating: 4.9, reviews: 1420, tag: '⭐ Premier Express', type: 'Scania Touring HD Luxury Class', amenities: ['wifi', 'ac', 'charging', 'water', 'snack', 'gps', 'washroom'], cancellationPolicy: 'Full refund up to 2 hours prior' },
      { id: 'au3', name: 'Premier Motor Service', rating: 4.6, reviews: 920, tag: '🌊 Coastal Route', type: 'Mercedes-Benz Coach 2+2 AC', amenities: ['ac', 'charging', 'water', 'gps'], cancellationPolicy: 'Refund 80% on cancellation' }
    ]
  },

  JP: {
    id: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    phoneCode: '+81',
    defaultFrom: 'TYO',
    defaultTo: 'OSA',
    basePriceRange: [3800, 7800],
    popularRoutes: [
      { from: 'TYO', to: 'OSA', label: 'Tokyo → Osaka', price: '¥4,500' },
      { from: 'TYO', to: 'KYO', label: 'Tokyo → Kyoto', price: '¥4,200' },
      { from: 'TYO', to: 'NAG', label: 'Tokyo → Nagoya', price: '¥3,800' },
      { from: 'OSA', to: 'HIR', label: 'Osaka → Hiroshima', price: '¥3,600' },
      { from: 'FUK', to: 'OSA', label: 'Fukuoka → Osaka', price: '¥5,200' }
    ],
    cities: [
      { id: 'TYO', name: 'Tokyo', state: 'Kanto', terminals: ['Busta Shinjuku 4F Bus Terminal', 'Tokyo Station Yaesu South Exit', 'Ikebukuro Sunshine City Depot'] },
      { id: 'OSA', name: 'Osaka', state: 'Kansai', terminals: ['Willer Express Cafe Umeda', 'Namba OCAT Bus Concourse Gate 3', 'Universal Studios Japan Gate'] },
      { id: 'KYO', name: 'Kyoto', state: 'Kansai', terminals: ['Kyoto Station Hachijo Exit G2', 'Karasuma Oike Hub', 'Kawaramachi Shijo Depot'] },
      { id: 'NAG', name: 'Nagoya', state: 'Chubu', terminals: ['Meitetsu Bus Center 3F Gate 1', 'Nagoya Station Taiko-dori Exit', 'Sakae Oasis 21 Concourse'] },
      { id: 'HIR', name: 'Hiroshima', state: 'Chugoku', terminals: ['Hiroshima Station Shinkansen Exit', 'Hiroshima Bus Center Sogo 3F', 'Peace Park Plaza'] },
      { id: 'FUK', name: 'Fukuoka', state: 'Kyushu', terminals: ['Hakata Bus Terminal 3F Platform 35', 'Tenjin Expressway Bus Center', 'Fukuoka Airport Domestic'] }
    ],
    operators: [
      { id: 'jp1', name: 'Willer Express ReBorn Capsule', rating: 4.9, reviews: 4200, tag: '🎌 Private Cocoon Pod', type: 'Mitsubishi Fuso Aero Queen ReBorn Pod', amenities: ['wifi', 'ac', 'charging', 'blanket', 'pillow', 'gps', 'reading-light', 'entertainment'], cancellationPolicy: 'Free change up to 3 hrs before departure' },
      { id: 'jp2', name: 'JamJam Liner Premium Sleeper', rating: 4.8, reviews: 2100, tag: '🌸 3-Row Independent', type: 'Hino Sセレガ Luxury 3-Row Executive', amenities: ['wifi', 'ac', 'charging', 'blanket', 'water', 'gps', 'washroom'], cancellationPolicy: 'Full refund voucher within 24h' },
      { id: 'jp3', name: 'Keio Highway Bus Gold', rating: 4.8, reviews: 1650, tag: '⚡ Express Shinjuku', type: 'Isuzu Gala HD Ultra Luxury', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'washroom'], cancellationPolicy: 'Refund 90% up to 1 hr before' }
    ]
  },

  AE: {
    id: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED ',
    phoneCode: '+971',
    defaultFrom: 'DXB',
    defaultTo: 'AUH',
    basePriceRange: [35, 75],
    popularRoutes: [
      { from: 'DXB', to: 'AUH', label: 'Dubai → Abu Dhabi', price: 'AED 35' },
      { from: 'DXB', to: 'SHJ', label: 'Dubai → Sharjah', price: 'AED 20' },
      { from: 'AUH', to: 'AIN', label: 'Abu Dhabi → Al Ain', price: 'AED 30' },
      { from: 'DXB', to: 'RAK', label: 'Dubai → Ras Al Khaimah', price: 'AED 40' },
      { from: 'DXB', to: 'FUJ', label: 'Dubai → Fujairah', price: 'AED 45' }
    ],
    cities: [
      { id: 'DXB', name: 'Dubai', state: 'DXB', terminals: ['Al Ghubaiba Bus Station Platform 4', 'Ibn Battuta Metro Bus Concourse', 'Union Square Deira Terminal'] },
      { id: 'AUH', name: 'Abu Dhabi', state: 'AUH', terminals: ['Abu Dhabi Central Bus Station Gate 2', 'Mussafah Bus Depot', 'Yas Mall Express Terminal'] },
      { id: 'SHJ', name: 'Sharjah', state: 'SHJ', terminals: ['Al Jubail Bus Station Gate 8', 'Sharjah City Centre Concourse', 'Rolla Square Depot'] },
      { id: 'AIN', name: 'Al Ain', state: 'AUH', terminals: ['Al Ain Central Bus Terminal', 'Tawam Hospital Transit', 'Jebel Hafeet Express Hub'] },
      { id: 'RAK', name: 'Ras Al Khaimah', state: 'RAK', terminals: ['RAK Main Bus Station Al Dhait', 'Al Hamra Mall Stop', 'Corniche Road Concourse'] },
      { id: 'FUJ', name: 'Fujairah', state: 'FUJ', terminals: ['Fujairah City Bus Station', 'Lulu Mall Depot', 'Khorfakkan Beach Terminal'] }
    ],
    operators: [
      { id: 'ae1', name: 'Emirates Royal VIP Coach', rating: 4.9, reviews: 1850, tag: '✨ 7-Star Luxury', type: 'Mercedes-Benz Travego VIP Lounge', amenities: ['wifi', 'ac', 'charging', 'water', 'snack', 'gps', 'entertainment', 'washroom'], cancellationPolicy: 'Free cancellation up to 2 hrs before' },
      { id: 'ae2', name: 'RTA Intercity Supercoach', rating: 4.8, reviews: 3100, tag: '⚡ Non-Stop E101', type: 'Volvo B11R Low Emission Euro 6', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'reading-light'], cancellationPolicy: 'Refund Nol credit instantly' },
      { id: 'ae3', name: 'Hatta Safari Cruiser', rating: 4.7, reviews: 780, tag: '🏔️ Mountain Express', type: 'Scania Touring HD Luxury AC', amenities: ['wifi', 'ac', 'charging', 'water', 'gps'], cancellationPolicy: 'Free reschedule anytime' }
    ]
  },

  BR: {
    id: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$ ',
    phoneCode: '+55',
    defaultFrom: 'SAO',
    defaultTo: 'RIO',
    basePriceRange: [75, 175],
    popularRoutes: [
      { from: 'SAO', to: 'RIO', label: 'São Paulo → Rio de Janeiro', price: 'R$ 95' },
      { from: 'SAO', to: 'CUR', label: 'São Paulo → Curitiba', price: 'R$ 88' },
      { from: 'RIO', to: 'BHZ', label: 'Rio → Belo Horizonte', price: 'R$ 115' },
      { from: 'CUR', to: 'FLN', label: 'Curitiba → Florianópolis', price: 'R$ 79' },
      { from: 'SAO', to: 'BSB', label: 'São Paulo → Brasília', price: 'R$ 160' }
    ],
    cities: [
      { id: 'SAO', name: 'São Paulo', state: 'SP', terminals: ['Terminal Rodoviário Tietê (Plataforma 32)', 'Terminal Barra Funda', 'Terminal Jabaquara'] },
      { id: 'RIO', name: 'Rio de Janeiro', state: 'RJ', terminals: ['Terminal Rodoviário Novo Rio (Gate 18)', 'Aeroporto Galeão Tom Jobim Hub', 'Barra da Tijuca Alvorada'] },
      { id: 'CUR', name: 'Curitiba', state: 'PR', terminals: ['Rodoferroviária de Curitiba', 'Terminal Campina do Siqueira', 'Aeroporto Afonso Pena'] },
      { id: 'BHZ', name: 'Belo Horizonte', state: 'MG', terminals: ['Terminal Rodoviário Governador Israel Pinheiro', 'Estação José Cândido da Silveira', 'Pampulha Concourse'] },
      { id: 'FLN', name: 'Florianópolis', state: 'SC', terminals: ['Terminal Rodoviário Rita Maria', 'Terminal de Integração do Centro', 'Canasvieiras Depot'] },
      { id: 'BSB', name: 'Brasília', state: 'DF', terminals: ['Terminal Rodoviário Interestadual de Brasília', 'Rodoviária do Plano Piloto', 'Aeroporto JK Concourse'] }
    ],
    operators: [
      { id: 'br1', name: 'Viação 1001 Leito Cama', rating: 4.9, reviews: 2400, tag: '👑 180° Full Bed', type: 'Marcopolo Paradiso G8 1800 DD', amenities: ['wifi', 'ac', 'charging', 'blanket', 'pillow', 'water', 'gps', 'washroom'], cancellationPolicy: 'Reembolso integral até 3 horas antes' },
      { id: 'br2', name: 'Cometa Estrela Semi-Leito', rating: 4.8, reviews: 3100, tag: '⚡ Top Paulista', type: 'Scania K440IB Double Decker', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'snack', 'washroom'], cancellationPolicy: 'Troca de bilhete sem taxa' },
      { id: 'br3', name: 'Catarinense Prime', rating: 4.7, reviews: 1540, tag: '🌊 Sul Express', type: 'Volvo B450R 8x2 Super Bus', amenities: ['wifi', 'ac', 'charging', 'water', 'gps', 'washroom'], cancellationPolicy: 'Reembolso 95% direto' }
    ]
  }
};

const AMENITY_INFO = {
  'wifi': { icon: 'fa-wifi', label: 'High-Speed Wi-Fi' },
  'ac': { icon: 'fa-snowflake', label: 'Climate Control AC' },
  'charging': { icon: 'fa-plug-circle-bolt', label: 'USB & Power Sockets' },
  'water': { icon: 'fa-bottle-water', label: 'Complimentary Water' },
  'blanket': { icon: 'fa-bed', label: 'Fresh Blanket & Pillow' },
  'gps': { icon: 'fa-location-crosshairs', label: 'Real-Time Live GPS' },
  'reading-light': { icon: 'fa-lightbulb', label: 'Personal Reading Lamp' },
  'washroom': { icon: 'fa-restroom', label: 'Clean Onboard Washroom' },
  'snack': { icon: 'fa-cookie-bite', label: 'Complimentary Snacks' },
  'entertainment': { icon: 'fa-tv', label: 'Entertainment Screen' }
};

const PROMO_CODES = {
  'VIBE25': { discountPct: 25, maxDiscount: 25, label: '25% OFF Vibecoding Special' },
  'NEXA10': { discountFlat: 10, label: 'Flat Discount' },
  'FIRSTBUS': { discountPct: 30, maxDiscount: 35, label: '30% OFF Welcome Bonus' },
  'WEEKEND': { discountPct: 15, maxDiscount: 18, label: '15% Weekend Getaway Discount' }
};

/**
 * Generate smart realistic bus schedules dynamically based on country, route and date
 */
function generateBusesForRoute(countryId, fromCity, toCity, dateStr) {
  const country = COUNTRIES_DATA[countryId] || COUNTRIES_DATA.US;
  const operators = country.operators;

  const seed = (country.id + fromCity.name + toCity.name + (dateStr || '')).split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const [minBase, maxBase] = country.basePriceRange;
  const priceStep = Math.max(1, Math.round((maxBase - minBase) / 7));

  // Departure slots across the day
  const timeSlots = [
    { depHour: 6, depMin: 30, baseDurationHours: 4.5, slotPrice: minBase },
    { depHour: 8, depMin: 15, baseDurationHours: 4.2, slotPrice: minBase + priceStep * 2 },
    { depHour: 11, depMin: 0, baseDurationHours: 4.8, slotPrice: minBase + priceStep },
    { depHour: 14, depMin: 45, baseDurationHours: 4.3, slotPrice: minBase + priceStep * 2 },
    { depHour: 17, depMin: 30, baseDurationHours: 4.6, slotPrice: minBase + priceStep * 4 },
    { depHour: 20, depMin: 0, baseDurationHours: 4.4, slotPrice: minBase + priceStep * 5 },
    { depHour: 22, depMin: 30, baseDurationHours: 5.0, slotPrice: minBase + priceStep * 6 },
    { depHour: 23, depMin: 50, baseDurationHours: 5.2, slotPrice: minBase + priceStep * 5 }
  ];

  return timeSlots.map((slot, index) => {
    const op = operators[index % operators.length];
    const depTime = `${String(slot.depHour).padStart(2, '0')}:${String(slot.depMin).padStart(2, '0')}`;
    
    // Calculate arrival time
    const totalMinutes = Math.round(slot.baseDurationHours * 60) + ((seed + index * 13) % 25);
    const arrTotalMinutes = slot.depHour * 60 + slot.depMin + totalMinutes;
    const arrHours = Math.floor(arrTotalMinutes / 60) % 24;
    const arrMinutes = arrTotalMinutes % 60;
    const arrTime = `${String(arrHours).padStart(2, '0')}:${String(arrMinutes).padStart(2, '0')}`;
    const nextDay = arrTotalMinutes >= 24 * 60 ? '+1 Day' : '';

    const durHours = Math.floor(totalMinutes / 60);
    const durMins = totalMinutes % 60;
    const duration = `${durHours}h ${durMins}m`;

    const price = Math.round(slot.slotPrice + ((seed * (index + 1)) % priceStep));
    const originalPrice = Math.round(price * 1.25);

    // Dynamic seat configuration (Lower Deck 20 seats, Upper Deck 12 sleeper berths)
    const seats = generateSeatLayout(seed + index * 37, price, country.currencySymbol);

    const availableCount = seats.filter(s => s.status === 'available' || s.status === 'female').length;

    // Pick terminals
    const boardingPoints = fromCity.terminals.map((t, idx) => ({
      name: t,
      time: addMinutesToTime(depTime, idx * 20),
      landmark: `Pickup Pillar ${idx + 1}`
    }));

    const droppingPoints = toCity.terminals.map((t, idx) => ({
      name: t,
      time: addMinutesToTime(arrTime, idx * 25),
      landmark: `Arrival Platform ${idx + 1}`
    }));

    return {
      id: `BUS-${country.id}-${fromCity.id}-${toCity.id}-${index + 101}`,
      busNumber: `NX-${(seed % 899 + 100)}-${String.fromCharCode(65 + (index % 26))}`,
      countryId: country.id,
      operator: op.name,
      rating: op.rating,
      reviews: op.reviews,
      tag: op.tag,
      busType: op.type,
      amenities: op.amenities,
      cancellationPolicy: op.cancellationPolicy,
      departureTime: depTime,
      arrivalTime: arrTime,
      nextDayBadge: nextDay,
      duration: duration,
      durationMinutes: totalMinutes,
      fromCity: fromCity.name,
      toCity: toCity.name,
      fromState: fromCity.state,
      toState: toCity.state,
      currencySymbol: country.currencySymbol,
      currency: country.currency,
      price: price,
      originalPrice: originalPrice,
      discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
      totalSeats: seats.length,
      availableSeats: availableCount,
      seats: seats,
      boardingPoints: boardingPoints,
      droppingPoints: droppingPoints
    };
  });
}

function addMinutesToTime(timeStr, minsToAdd) {
  const [h, m] = timeStr.split(':').map(Number);
  const total = (h * 60 + m + minsToAdd) % (24 * 60);
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

/**
 * Generate 2-deck seat layout (Lower deck: Seater, Upper deck: Sleeper Berths)
 */
function generateSeatLayout(seed, basePrice, currencySymbol) {
  const seats = [];

  // LOWER DECK (20 Seats - 5 rows of 4)
  for (let r = 1; r <= 5; r++) {
    const cols = [
      { col: 'A', type: 'seater', isWindow: true, deck: 'lower' },
      { col: 'B', type: 'seater', isWindow: false, deck: 'lower' },
      { col: 'C', type: 'seater', isWindow: false, deck: 'lower' },
      { col: 'D', type: 'seater', isWindow: true, deck: 'lower' }
    ];

    cols.forEach((c) => {
      const seatNum = `L${r}${c.col}`;
      const hash = (seed * 17 + seatNum.charCodeAt(1) * 31 + seatNum.charCodeAt(2)) % 100;
      
      let status = 'available';
      if (hash < 32) status = 'booked';
      else if (hash < 42) status = 'female';

      const windowExtra = Math.round(basePrice * 0.08);
      const seatPrice = c.isWindow ? basePrice + windowExtra : basePrice;

      seats.push({
        id: seatNum,
        number: seatNum,
        deck: 'lower',
        row: r,
        col: c.col,
        type: 'seater',
        isWindow: c.isWindow,
        price: seatPrice,
        status: status
      });
    });
  }

  // UPPER DECK (12 Sleeper Berths - 4 rows)
  for (let r = 1; r <= 4; r++) {
    const cols = [
      { col: 'A', type: 'sleeper', isWindow: true, berth: 'single', deck: 'upper' },
      { col: 'B', type: 'sleeper', isWindow: false, berth: 'double', deck: 'upper' },
      { col: 'C', type: 'sleeper', isWindow: true, berth: 'double', deck: 'upper' }
    ];

    cols.forEach((c) => {
      const seatNum = `U${r}${c.col}`;
      const hash = (seed * 23 + seatNum.charCodeAt(1) * 19 + seatNum.charCodeAt(2)) % 100;
      
      let status = 'available';
      if (hash < 35) status = 'booked';
      else if (hash < 45) status = 'female';

      const sleeperExtra = Math.round(basePrice * 0.25);
      const seatPrice = basePrice + sleeperExtra;

      seats.push({
        id: seatNum,
        number: seatNum,
        deck: 'upper',
        row: r,
        col: c.col,
        type: 'sleeper',
        berth: c.berth,
        isWindow: c.isWindow,
        price: seatPrice,
        status: status
      });
    });
  }

  return seats;
}

/**
 * Complete Catalog of All 28 States & 8 Union Territories of India
 * with major transit hubs, capitals, zones, and top luxury coach corridors
 */
const INDIAN_STATES_DATA = [
  // Western Zone
  { id: 'MH', name: 'Maharashtra', capital: 'Mumbai', zone: 'West', hubs: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Shirdi', 'Kolhapur', 'Solapur', 'Aurangabad'], topRoute: { from: 'BOM', to: 'PUN', label: 'Mumbai ⇄ Pune (Mumbai-Pune Expressway)', fare: '₹450' }, icon: 'fa-city', desc: 'Financial powerhouse & scenic Western Ghats luxury sleeper corridors.' },
  { id: 'GJ', name: 'Gujarat', capital: 'Gandhinagar', zone: 'West', hubs: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Bhuj', 'Jamnagar'], topRoute: { from: 'AMD', to: 'SUR', label: 'Ahmedabad ⇄ Surat (NE-1 Expressway)', fare: '₹550' }, icon: 'fa-gem', desc: 'Vibrant trade corridor with ultra-luxury multi-axle Volvo & Scania buses.' },
  { id: 'RJ', name: 'Rajasthan', capital: 'Jaipur', zone: 'North', hubs: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Ajmer', 'Kota', 'Bikaner'], topRoute: { from: 'DEL', to: 'JAI', label: 'Delhi ⇄ Jaipur (Delhi-Mumbai Expressway)', fare: '₹650' }, icon: 'fa-monument', desc: 'Royal desert palaces & heritage highways connected with sleeper fleets.' },
  { id: 'GA', name: 'Goa', capital: 'Panaji', zone: 'West', hubs: ['Panaji', 'Madgaon', 'Mapusa', 'Calangute', 'Vasco da Gama'], topRoute: { from: 'BOM', to: 'GOA', label: 'Mumbai ⇄ Goa (NH 66 Coastal Expressway)', fare: '₹1,250' }, icon: 'fa-umbrella-beach', desc: 'World-famous beach paradise with overnight executive luxury sleeper coaches.' },

  // Northern Zone
  { id: 'DL', name: 'Delhi NCR', capital: 'New Delhi', zone: 'North', hubs: ['New Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad'], topRoute: { from: 'DEL', to: 'LKO', label: 'Delhi ⇄ Lucknow (Yamuna & Agra Expressway)', fare: '₹850' }, icon: 'fa-landmark', desc: 'National capital transit epicentre with Kashmere Gate & Anand Vihar ISBTs.' },
  { id: 'UP', name: 'Uttar Pradesh', capital: 'Lucknow', zone: 'North', hubs: ['Lucknow', 'Varanasi', 'Agra', 'Ayodhya', 'Kanpur', 'Prayagraj', 'Mathura', 'Gorakhpur'], topRoute: { from: 'LKO', to: 'VNS', label: 'Lucknow ⇄ Varanasi (Purvanchal Expressway)', fare: '₹680' }, icon: 'fa-om', desc: 'Spiritual heartland & expressway capital of India with nonstop coach lines.' },
  { id: 'HP', name: 'Himachal Pradesh', capital: 'Shimla', zone: 'North', hubs: ['Shimla', 'Manali', 'Dharamshala', 'Kullu', 'Kasol', 'Dalhousie', 'Mandi'], topRoute: { from: 'DEL', to: 'MNL', label: 'Delhi ⇄ Manali (Himalayan Super Volvo)', fare: '₹1,450' }, icon: 'fa-mountain-sun', desc: 'Snow-capped Himalayan luxury bus routes with panoramic glass views.' },
  { id: 'UK', name: 'Uttarakhand', capital: 'Dehradun', zone: 'North', hubs: ['Dehradun', 'Rishikesh', 'Haridwar', 'Nainital', 'Mussoorie', 'Haldwani'], topRoute: { from: 'DEL', to: 'RSH', label: 'Delhi ⇄ Rishikesh (Ganga Yoga Highway)', fare: '₹550' }, icon: 'fa-mountain', desc: 'Land of Gods with sacred river gateways and hill retreat connectivity.' },
  { id: 'PB', name: 'Punjab', capital: 'Chandigarh', zone: 'North', hubs: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Pathankot'], topRoute: { from: 'DEL', to: 'ATQ', label: 'Delhi ⇄ Amritsar (Grand Trunk Road NH-44)', fare: '₹750' }, icon: 'fa-wheat-awn', desc: 'Golden Temple heritage corridor with high-speed executive express coaches.' },
  { id: 'HR', name: 'Haryana', capital: 'Chandigarh', zone: 'North', hubs: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar', 'Karnal'], topRoute: { from: 'DEL', to: 'CHD', label: 'Delhi ⇄ Chandigarh (NH-44 Multi-Axle)', fare: '₹520' }, icon: 'fa-road', desc: 'Strategic transit hub connecting Northern states with seamless motorways.' },
  { id: 'JK', name: 'Jammu & Kashmir', capital: 'Srinagar / Jammu', zone: 'North', hubs: ['Srinagar', 'Jammu', 'Katra (Vaishno Devi)', 'Pahalgam', 'Gulmarg', 'Udhampur'], topRoute: { from: 'DEL', to: 'SXR', label: 'Delhi ⇄ Srinagar (Chenani-Nashri Tunnel Express)', fare: '₹1,850' }, icon: 'fa-snowflake', desc: 'Paradise on Earth with luxury tourist coaches traversing mountain valleys.' },
  { id: 'LA', name: 'Ladakh', capital: 'Leh', zone: 'North', hubs: ['Leh', 'Kargil', 'Nubra Valley', 'Zanskar'], topRoute: { from: 'MNL', to: 'IXL', label: 'Manali ⇄ Leh (Atal Tunnel Trans-Himalayan)', fare: '₹2,400' }, icon: 'fa-cloud-sun', desc: 'High-altitude desert adventure routes with reinforced all-weather coaches.' },
  { id: 'CH', name: 'Chandigarh', capital: 'Chandigarh', zone: 'Union Territory', hubs: ['ISBT Sector 43', 'ISBT Sector 17', 'Zirakpur Concourse'], topRoute: { from: 'CHD', to: 'SHI', label: 'Chandigarh ⇄ Shimla (Himalayan Expressway)', fare: '₹380' }, icon: 'fa-tree', desc: 'Beautiful planned modern city and gateway to Himachal & Punjab corridors.' },

  // Southern Zone
  { id: 'KA', name: 'Karnataka', capital: 'Bengaluru', zone: 'South', hubs: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Hampi', 'Udupi'], topRoute: { from: 'BLR', to: 'MYQ', label: 'Bengaluru ⇄ Mysuru (10-Lane Access-Controlled Expressway)', fare: '₹320' }, icon: 'fa-laptop-code', desc: 'Silicon Valley of India with premier multi-axle Airavat & sleeper networks.' },
  { id: 'TN', name: 'Tamil Nadu', capital: 'Chennai', zone: 'South', hubs: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Ooty', 'Kanyakumari'], topRoute: { from: 'CHE', to: 'CJB', label: 'Chennai ⇄ Coimbatore (Industrial Express NH-544)', fare: '₹750' }, icon: 'fa-gopuram', desc: 'Dravidian temple architecture & textile hubs with 24/7 omni-bus services.' },
  { id: 'TS', name: 'Telangana', capital: 'Hyderabad', zone: 'South', hubs: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'], topRoute: { from: 'HYD', to: 'BLR', label: 'Hyderabad ⇄ Bengaluru (NH-44 Super Sleeper)', fare: '₹1,150' }, icon: 'fa-building-columns', desc: 'Pearl City & tech corridor with round-the-clock luxury sleeper services.' },
  { id: 'AP', name: 'Andhra Pradesh', capital: 'Amaravati', zone: 'South', hubs: ['Visakhapatnam', 'Vijayawada', 'Tirupati', 'Guntur', 'Nellore', 'Kakinada', 'Kurnool'], topRoute: { from: 'VTZ', to: 'HYD', label: 'Visakhapatnam ⇄ Hyderabad (Coastal Highway)', fare: '₹950' }, icon: 'fa-water', desc: 'Scenic Bay of Bengal coastlines & Tirumala Balaji pilgrimage routes.' },
  { id: 'KL', name: 'Kerala', capital: 'Thiruvananthapuram', zone: 'South', hubs: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Munnar', 'Alappuzha', 'Thrissur', 'Wayanad'], topRoute: { from: 'BLR', to: 'COK', label: 'Bengaluru ⇄ Kochi (Western Ghats Luxury Sleeper)', fare: '₹1,100' }, icon: 'fa-spa', desc: 'God’s Own Country with serene backwaters, tea gardens & luxury cruisers.' },
  { id: 'PY', name: 'Puducherry', capital: 'Puducherry', zone: 'Union Territory', hubs: ['White Town French Quarter', 'Auroville Plaza', 'Maraimalai Stand'], topRoute: { from: 'CHE', to: 'PDY', label: 'Chennai ⇄ Puducherry (East Coast Scenic Highway)', fare: '₹280' }, icon: 'fa-sailboat', desc: 'French colonial seafront charm connected by the panoramic East Coast Road.' },

  // Central & Eastern Zone
  { id: 'MP', name: 'Madhya Pradesh', capital: 'Bhopal', zone: 'Central', hubs: ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Khajuraho'], topRoute: { from: 'IDR', to: 'BHO', label: 'Indore ⇄ Bhopal (State Highway Supercoach)', fare: '₹340' }, icon: 'fa-paw', desc: 'Cleanest city corridor, tiger reserves, and Jyotirlinga pilgrimage circuits.' },
  { id: 'CG', name: 'Chhattisgarh', capital: 'Raipur', zone: 'Central', hubs: ['Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Korba', 'Jagdalpur'], topRoute: { from: 'RPR', to: 'NAG', label: 'Raipur ⇄ Nagpur (Central India NH-53)', fare: '₹580' }, icon: 'fa-industry', desc: 'Mineral rich heartland with inter-state express connections to Maharashtra.' },
  { id: 'WB', name: 'West Bengal', capital: 'Kolkata', zone: 'East', hubs: ['Kolkata', 'Siliguri', 'Darjeeling', 'Durgapur', 'Asansol', 'Digha'], topRoute: { from: 'CCU', to: 'IXB', label: 'Kolkata ⇄ Siliguri (North Bengal Royal Cruiser)', fare: '₹1,050' }, icon: 'fa-bridge', desc: 'Cultural capital to tea gardens of Darjeeling with high-deck night coaches.' },
  { id: 'BR', name: 'Bihar', capital: 'Patna', zone: 'East', hubs: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Nalanda'], topRoute: { from: 'PAT', to: 'CCU', label: 'Patna ⇄ Kolkata (Purvanchal Grand Express)', fare: '₹890' }, icon: 'fa-book-open-reader', desc: 'Historic cradle of learning & Buddhist circuit with expanding coach routes.' },
  { id: 'JH', name: 'Jharkhand', capital: 'Ranchi', zone: 'East', hubs: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'], topRoute: { from: 'IXR', to: 'CCU', label: 'Ranchi ⇄ Kolkata (Chota Nagpur Expressway)', fare: '₹720' }, icon: 'fa-mountain-city', desc: 'Steel cities, scenic waterfalls & Baba Baidyanath Jyotirlinga corridors.' },
  { id: 'OD', name: 'Odisha', capital: 'Bhubaneswar', zone: 'East', hubs: ['Bhubaneswar', 'Puri', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur'], topRoute: { from: 'BBI', to: 'CCU', label: 'Bhubaneswar ⇄ Kolkata (Golden Coast Express)', fare: '₹680' }, icon: 'fa-sun', desc: 'Temple city & Puri Jagannath coastal highways with AC sleeper options.' },

  // North-Eastern Zone
  { id: 'AS', name: 'Assam', capital: 'Dispur / Guwahati', zone: 'North-East', hubs: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Kaziranga', 'Tezpur'], topRoute: { from: 'GAU', to: 'SHL', label: 'Guwahati ⇄ Shillong (Cloud Highway NH-6)', fare: '₹350' }, icon: 'fa-feather-pointed', desc: 'Gateway to North-East India & one-horned rhino wildlife corridors.' },
  { id: 'ML', name: 'Meghalaya', capital: 'Shillong', zone: 'North-East', hubs: ['Shillong', 'Cherrapunji', 'Dawki', 'Tura', 'Jowai'], topRoute: { from: 'GAU', to: 'SHL', label: 'Guwahati ⇄ Shillong (Scotland of the East)', fare: '₹350' }, icon: 'fa-cloud-rain', desc: 'Abode of clouds with living root bridges and crystal-clear river routes.' },
  { id: 'SK', name: 'Sikkim', capital: 'Gangtok', zone: 'North-East', hubs: ['Gangtok', 'Pelling', 'Namchi', 'Ravangla', 'Lachung'], topRoute: { from: 'IXB', to: 'GTO', label: 'Siliguri ⇄ Gangtok (Teesta Valley Highway)', fare: '₹480' }, icon: 'fa-eye', desc: 'Organic Himalayan state under Mt. Kanchenjunga with mountain cruisers.' },
  { id: 'AR', name: 'Arunachal Pradesh', capital: 'Itanagar', zone: 'North-East', hubs: ['Itanagar', 'Tawang', 'Pasighat', 'Ziro', 'Bhalukpong'], topRoute: { from: 'GAU', to: 'Itanagar', label: 'Guwahati ⇄ Itanagar (Land of Dawn-lit Mountains)', fare: '₹750' }, icon: 'fa-sun-plant-wilt', desc: 'Easternmost Himalayan frontier with monastery retreats and river valleys.' },
  { id: 'MN', name: 'Manipur', capital: 'Imphal', zone: 'North-East', hubs: ['Imphal', 'Churachandpur', 'Thoubal', 'Ukhrul'], topRoute: { from: 'GAU', to: 'Imphal', label: 'Guwahati ⇄ Imphal (NH-29 Scenic Corridor)', fare: '₹950' }, icon: 'fa-leaf', desc: 'Jewel of India with floating Loktak lake and lush green valleys.' },
  { id: 'MZ', name: 'Mizoram', capital: 'Aizawl', zone: 'North-East', hubs: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib'], topRoute: { from: 'Silchar', to: 'Aizawl', label: 'Silchar ⇄ Aizawl (NH-306 Hill Express)', fare: '₹550' }, icon: 'fa-hill-rockslide', desc: 'Scenic mountain ridges and vibrant cultural heritage connected by bus lines.' },
  { id: 'NL', name: 'Nagaland', capital: 'Kohima', zone: 'North-East', hubs: ['Kohima', 'Dimapur', 'Mokokchung', 'Wokha'], topRoute: { from: 'Dimapur', to: 'Kohima', label: 'Dimapur ⇄ Kohima (Hornbill Heritage Route)', fare: '₹280' }, icon: 'fa-campground', desc: 'Land of festivals and rolling green hills with regional coach links.' },
  { id: 'TR', name: 'Tripura', capital: 'Agartala', zone: 'North-East', hubs: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar'], topRoute: { from: 'Silchar', to: 'Agartala', label: 'Silchar ⇄ Agartala (NH-8 Highway)', fare: '₹620' }, icon: 'fa-place-of-worship', desc: 'Palatial royal heritage & Tripura Sundari temple corridors.' },

  // Remaining Union Territories
  { id: 'DN', name: 'Dadra & Nagar Haveli and Daman & Diu', capital: 'Daman', zone: 'Union Territory', hubs: ['Daman Devka Beach', 'Silvassa Madhuban', 'Diu Fort'], topRoute: { from: 'BOM', to: 'Daman', label: 'Mumbai ⇄ Daman (NH-48 Coastal Link)', fare: '₹390' }, icon: 'fa-anchor', desc: 'Portuguese coastal fortresses and tranquil riverside vacation getaways.' },
  { id: 'AN', name: 'Andaman & Nicobar', capital: 'Port Blair', zone: 'Union Territory', hubs: ['Port Blair Central', 'Havelock Transit', 'Diglipur ATR'], topRoute: { from: 'Port Blair', to: 'Diglipur', label: 'Port Blair ⇄ Diglipur (Andaman Trunk Road)', fare: '₹580' }, icon: 'fa-fish-fins', desc: 'Island highway across tropical rainforests and turquoise sea coasts.' },
  { id: 'LD', name: 'Lakshadweep', capital: 'Kavaratti', zone: 'Union Territory', hubs: ['Kavaratti Island Jetty', 'Agatti Airport Transit'], topRoute: { from: 'Kavaratti', to: 'Agatti', label: 'Island Speedboat Shuttle', fare: '₹350' }, icon: 'fa-compass', desc: 'Coral atolls and pristine marine lagoons in the Arabian Sea.' }
];
