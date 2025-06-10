// Combined Property Mapping System for Express.js with MongoDB

const propertyMappings = {
  // JGE - Jumeirah Golf Estates
  JGE: {
    projects: {
      "Hillside": ["Hillside", "Hillside at Jumeirah Golf Estates"],
      "Signature Mansions": ["Signature Mansions", "The Jasmine Collection", "The Magnolia Collection"]
    },
    masterProjects: {
      "Jumeirah Golf Estates": ["Jumeirah Golf Estates", "Earth", "Fire"]
    }
  },

  // JLT - Jumeirah Lake Towers
  JLT: {
    projects: {
      "Silver Tower": ["Silver Tower (Ag Tower)", "Silver Tower"],
      "Gold Tower": ["Gold Tower (Au Tower)", "Gold Tower"],
      "Dubai Arch Tower": ["Dubai Arch Tower", "Dubai Arch"],
      "SEVEN CITY JLT": ["SEVEN CITY JLT", "Golf Views Seven City"],
      "The Residences JLT": ["The Residences JLT", "The Residences JLT (Taj)"]
    },
    masterProjects: {
      "Jumeirah Lake Towers": ["Jumeirah Lake Towers", "JLT Cluster C", "Jumeirah Lake Towers (JLT)"],
      "JLT Cluster P": ["JLT Cluster P", "ARMADA TOWERS"],
      "Mazaya Business Avenue AA-1": ["Mazaya Business Avenue AA-1", "Mazaya Business Avenue AA1"],
      "Mazaya Business Avenue BB-1": ["Mazaya Business Avenue BB-1", "Mazaya Business Avenue BB1"],
      "Mazaya Business Avenue BB-2": ["Mazaya Business Avenue BB-2", "Mazaya Business Avenue BB2"],
      "MBL Royal": ["MBL Royal", "Jumeirah Lake Towers"],
      "JLT Cluster X": ["JLT Cluster X (Jumeirah Bay Towers)", "JLT Cluster X"]
    }
  },

  // Jumeirah Heights - Complete A to F
  "Jumeirah Heights": {
    projects: {
      "Jumeirah Heights A": ["Jumeirah Heights A", "cluster A"],
      "Jumeirah Heights B": ["Jumeirah Heights B", "cluster B"],
      "Jumeirah Heights C": ["Jumeirah Heights C", "cluster C"],
      "Jumeirah Heights D": ["Jumeirah Heights D", "cluster D"],
      "Jumeirah Heights E": ["Jumeirah Heights E", "cluster E"],
      "Jumeirah Heights F": ["Jumeirah Heights F", "cluster F"]
    },
    masterProjects: {}
  },

  // JVC - Jumeirah Village Circle
  JVC: {
    projects: {
      "AURA by Grovy": ["AURA by Grovy", "AURA"],
      "Elitz By Danube": ["Elitz By Danube", "Elitz By Danube Tower 1", "Elitz By Danube Tower 2"],
      "Elitz 2 By Danube": ["Elitz 2 By Danube", "Elitz 2 By Danube Tower 1", "Elitz 2 By Danube Tower 2"],
      "Elitz 3 By Danube": ["Elitz 3 By Danube", "Elitz 3 By Danube Tower 1", "Elitz 3 By Danube Tower 2"],
      "DIAMOND VIEW": ["DIAMOND VIEW 1,2,3,4", "DIAMOND VIEW 1", "DIAMOND VIEW 2", "DIAMOND VIEW 3", "DIAMOND VIEW 4"],
      "ERANTIS": ["ERANTIS", "ERANTIS villas"],
      "FIVE at Jumeirah Village Circle": ["FIVE at Jumeirah Village Circle", "FIVE Jumeirah Village"],
      "GHALIA": ["GHALIA", "DAMAC Ghalia"],
      "Zaya Hameni": ["Zaya Hameni", "Hameni tower", "Hameni"],
      "Haven Villas": ["Haven Villas", "Haven Villas at the Sanctuary"],
      "Haven Villas 1": ["Haven Villas 1", "Haven Villas 1 at the Sanctuary"],
      "Living Garden II": ["Living Garden II", "Living Garden 2"],
      "LOLENA BUILDING": ["LOLENA BUILDING", "LOLENA TOWER", "LOLENA"],
      "LUCKY RESIDENCE": ["LUCKY RESIDENCE", "LUCKY 1 RESIDENCE"],
      "Luxur Tower By Imtiaz": ["Luxur Tower By Imtiaz", "Luxur By Imtiaz"],
      "Luxury Family Residence": ["Luxury Family Residence", "Luxury Family Residence 1"],
      "Maison Elysee I": ["Maison Elysee I", "Maison Elysee 1"],
      "Maison Elysee II": ["Maison Elysee II", "Maison Elysee 2"],
      "THE MANHATTAN": ["THE MANHATTAN", "THE MANHATTAN TOWER"],
      "Milano Giovanni Boutique Suites": ["Milano Giovanni Boutique Suites", "MILANO by Giovanni Botique Suites"],
      "NORTH 43": ["NORTH 43", "North 43 Residences"],
      "Pearl House I By Imtiaz": ["Pearl House I By Imtiaz", "Pearl House 1", "Pearl House I", "Pearl House 1 By Imtiaz", "Pearl House By Imtiaz"],
      "Pearl House II By Imtiaz": ["Pearl House II By Imtiaz", "Pearl House 2", "Pearl House II", "Pearl House 2 By Imtiaz"],
      "Pearl House III By Imtiaz": ["Pearl House III By Imtiaz", "Pearl House 3", "Pearl House III", "Pearl House 3 By Imtiaz"],
      "Roma Residences by JRP": ["Roma Residences by JRP", "Roma Residences"],
      "ROYAL PARK SOUTH": ["ROYAL PARK SOUTH", "ROYAL PARK SOUTH 1", "ROYAL PARK SOUTH Villas"],
      "SAMANA MIAMI": ["SAMANA MIAMI", "Miami by Samana"],
      "Samana Waves": ["Samana Waves", "Samana Waves 1"],
      "THE FIFTH TOWER": ["THE FIFTH TOWER", "The F1fth"],
      "THE HAVEN GARDEN": ["THE HAVEN GARDEN", "THE HAVEN GARDENS"],
      "The One at Jumeirah Village Circle": ["The One at Jumeirah Village Circle", "The One"],
      "WESTAR LA RESIDENCIA DEL SOL": ["WESTAR LA RESIDENCIA DEL SOL", "LA RESIDENCIA DEL SOL"],
      "Westwood Grande by Imtiaz": ["Westwood Grande by Imtiaz", "Westwood Grande"],
      "Westwood Grande II by Imtiaz": ["Westwood Grande II by Imtiaz", "Westwood Grande 2 by Imtiaz", "Westwood Grande II", "Westwood Grande 2"],
      "Gateway by Premier Choice": ["Gateway by Premier Choice", "Gateway"],
      "Sky Suites by Peace Homes": ["Sky Suites by Peace Homes", "Sky Suites"],
      "Tuscan Residences": ["Tuscan Residences", "Tuscan Residence"]
    },
    masterProjects: {
      "Jumeirah Village Circle": ["Jumeirah Village Circle", "JVC District 14", "Belgravia Indigo Ville", "Sandoval Garden", "Sandoval Gardens", "Shamal Residences"],
      "JVC District 17": ["Jumeirah Village Circle", "JVC District 17"],
      "JVC District 18": ["Jumeirah Village Circle", "JVC District 18", "Cello Residences"],
      "JVC District 15": ["Jumeirah Village Circle", "JVC District 15", "Bloom Heights", "Indigo Ville", "Seasons Community"],
      "JVC District 12": ["Jumeirah Village Circle", "JVC District 12", "Emirates Gardens", "Roxana Residences", "The Orchard Place"],
      "Diamond Views": ["Jumeirah Village Circle", "Diamond Views"],
      "Emirates Gardens": ["Emirates Gardens 1", "Emirates Gardens"],
      "Maimoon Gardens": ["Maimoon Gardens", "JVC District 11", "Jumeirah Village Circle", "Jumeirah Village Circle (JVC)"],
      "TUSCAN RESIDENCES - Siena": ["TUSCAN RESIDENCES - Siena", "TUSCAN RESIDENCES", "Siena"],
      "TUSCAN RESIDENCES - FLORENCE": ["TUSCAN RESIDENCES - FLORENCE", "TUSCAN RESIDENCES", "FLORENCE"],
      "TUSCAN RESIDENCES - AREZZO": ["TUSCAN RESIDENCES - AREZZO", "TUSCAN RESIDENCES", "AREZZO"]
    }
  },

  // JVT - Jumeirah Village Triangle
  JVT: {
    projects: {
      "Al Jawhara Tower": ["Al Jawhara Tower", "Al Jawhara Residences"],
      "Lum1nar Towers": ["Lum1nar Towers", "Lum1nar Towers 1", "Lum1nar Towers 2"],
      "Adagio Hotel Apartments": ["Adagio Hotel Apartments", "Adagio Jumeirah Village Triangle"],
      "Pacific Edmonton": ["Pacific Edmonton", "Edmonton Elm"],
      "Red Square": ["Red Square", "Red Square Tower 1", "Red Square Tower 2"],
      "Terhab Hotel and Towers": ["Terhab Hotel and Towers", "Terhab Hotels & Towers"],
      "Jeera V": ["Jeera V", "BQ2 Residence"],
      "Miami 2 by Samana": ["Miami 2 by Samana", "Samana Miami 2"],
      "The Imperial Residence": ["The Imperial Residence B", "The Imperial Residence 2", "The Imperial Residence A", "The Imperial Residence 1", "The Imperial Residence"],
      "The One at Jumeirah Village Triangle": ["The One at Jumeirah Village Triangle", "The One"]
    },
    masterProjects: {
      "JVT District 2": ["Jumeirah Village Triangle (JVT)", "JVT District 2", "Cloud Tower", "Lum1nar Towers"],
      "JVT District 3": ["Jumeirah Village Triangle (JVT)", "JVT District 3", "Red Square"],
      "JVT District 5": ["Jumeirah Village Triangle (JVT)", "JVT District 5", "The Imperial Residence"]
    }
  },

  // Dubai Marina
  "Dubai Marina": {
    projects: {
      "Al Anbar Tower": ["Al Anbar Tower", "Al Anbar"],
      "Barcelo Residences": ["Barcelo Residences", "Al Dar Tower"],
      "Murjan Tower": ["Murjan Tower", "Al Murjan Tower"],
      "Atlantic": ["Atlantic Tower 2", "Atlantic Tower 1", "Atlantic"],
      "ATTESSA": ["ATTESSA", "ATTESSA Tower"],
      "Trident Marinascape Avant Tower": ["Trident Marinascape Avant Tower", "Marinascape Avant"],
      "Bay Central": ["Bay Central (Central Tower)", "Central Tower"],
      "Beauport": ["Beauport", "Beauport Tower"],
      "CASCADES": ["CASCADES", "The CASCADES", "CASCADES Tower"],
      "Delphine": ["Delphine", "Delphine Tower"],
      "ESCAN MARINA TOWER": ["ESCAN MARINA TOWER", "ESCAN TOWER"],
      "MAG 218": ["MAG 218", "MAG 218 Tower"],
      "Manchester Tower": ["Manchester Tower", "Manchester"],
      "MARINA ARCADE Tower": ["MARINA ARCADE Tower", "MARINA ARCADE"],
      "Dubai Marina 1": ["Dubai Marina 1", "Dubai Marina I"],
      "Marina Wharf 1": ["Marina Wharf 1", "Marina Wharf I"],
      "Marina Wharf 2": ["Marina Wharf 2", "Marina Wharf II"],
      "OPAL TOWER": ["OPAL TOWER", "OPAL TOWER MARINA", "MARINA OPAL TOWER"],
      "Orra Harbour Residences": ["Orra Harbour Residences", "Orra Harbour Residences and Hotel Apartments", "ORRA HARBOUR TOWER 1", "ORRA HARBOUR TOWER 2"],
      "PANORAMIC": ["PANORAMIC", "PANORAMIC Tower"]
    },
    masterProjects: {
      "Dubai Marina": ["Emaar 6 Towers", "Dubai marina", "Dubai Marina Towers", "Dubai Marina"],
      "The Atlantic": ["The Atlantic", "Dubai marina"],
      "Trident Marinascape": ["Trident Marinascape", "Dubai marina"],
      "MARINA PROMENADE": ["MARINA PROMENADE", "dubai marina"],
      "Marina Quay": ["Marina Quay", "Dubai Marina"],
      "AL SAHAB": ["AL SAHAB", "Dubai marina"],
      "Marina Promenade": ["Marina Promenade", "Dubai marina"],
      "Silverene": ["Silverene", "Dubai marina"],
      "Sparkle Tower 1": ["Sparkle Tower 1", "Dubai marina"],
      "The Jewels": ["The Jewels", "Dubai marina"],
      "THE WAVES": ["THE WAVES", "Dubai marina"]
    }
  },

  // Meydan District
  "Meydan District": {
    projects: {
      "Azizi Riviera Beachfront": ["Azizi Riviera Beachfront", "Riviera Beachfront"],
      "Azizi Riviera Reve": ["Azizi Riviera Reve", "Riviera Reve"],
      "Azizi Riviera AZURE": ["Azizi Riviera AZURE", "Riviera AZURE"],
      "District One": ["District One", "District One Phase III", "District One Phase 3", "District One Phase 1", "District One Phase I"],
      "WILTON PARK RESIDENCES": ["WILTON PARK RESIDENCES", "WILTON PARK RESIDENCES 1", "WILTON PARK RESIDENCES 2", "WILTON PARK RESIDENCES I", "WILTON PARK RESIDENCES II"],
      "Park Avenue I": ["Park Avenue I", "Azizi Park Avenue"],
      "Polo Residence": ["Polo Residence", "the Polo Residence"],
      "Prime Views": ["Prime Views", "Prime Views by Prescott"],
      "The Galleries": ["The Galleries", "The Galleries at meydan Avenue"],
      "Wadi Villas": ["Wadi Villas", "Wadi Villas by Arista"],
      "Sobha Creek Vistas Heights": ["Sobha Creek Vistas Heights Tower B", "Sobha Creek Vistas Heights", "Sobha Creek Vistas Heights Tower A"],
      "Sobha Creek Vistas Reserve": ["Sobha Creek Vistas Reserve Tower A", "Sobha Creek Vistas Reserve"],
      "Kensington Waters": ["Kensington Waters Tower A", "Kensington Waters A", "Kensington Waters Tower B", "Kensington Waters B"],
      "The Terraces": ["The Terraces North", "The Terraces South", "The Terraces"],
      "Creek Vistas Grande": ["Creek Vistas Grande", "sobha Creek Vistas Grande"],
      "Hartland Waves": ["Hartland Waves", "sobha Hartland Waves"],
      "Sobha Hartland Estates": ["Sobha Hartland Estates", "Sobha Hartland Estates-Townhouses"],
      "Waves Opulence": ["Waves Opulence", "sobha hartland Waves Opulence"],
      "District One West": ["District One West", "District One West Phase I", "District One West phase II"]
    },
    masterProjects: {
      "Azizi Riviera": ["Azizi Riviera", "Meydan One"],
      "District One": ["District One", "Mohammed Bin Rashid City", "Mohammed Bin Rashid Al Maktoum City", "The Terraces North", "Wilton Park Residences"],
      "Sobha Hartland": ["Sobha Hartland", "Sobha Creek Vistas", "The Crest", "Mohammed Bin Rashid City", "Mohammed Bin Rashid Al Maktoum City"],
      "Meydan Avenue": ["Meydan Avenue", "Meydan"],
      "Polo Residence": ["Polo Residence", "The Polo Residence", "Meydan Avenue"]
    }
  },

  // Additional simple name mappings
  nameVariations: {
    'Chorisia I': ['CHORISIA 1', 'CHORISIA 1 VILLAS'],
    'Chorisia II': ['Chorisia 2', 'Chorisia 2 Villas'],
    'Reem': ['Reem Community'],
    'LA FONTANA DI TREVI': ['La Fontana', 'La Fontana Apartments'],
    'Lincoln Park - Sheffield': ['Lincoln Park Sheffield'],
    'Lincoln Park - West Side': ['Lincoln Park WestSide'],
    'Al Ghaf 1 Residence': ['Al Ghaf 1'],
    'Elz Residence by Danube': ['Elz by Danube'],
    'Green Diamond 1 Tower B': ['Green Diamond 1 B'],
    'Green Diamond 1 Tower A': ['Green Diamond 1 A'],
    'Joya Dorado': ['Joya Dorado Residence'],
    'The Light Tower': ['The Light Commercial Tower'],
    '15 Northside - Tower 2': ['15 Northside Tower 2'],
    '15 Northside - Tower 1': ['15 Northside Tower 1'],
    '51@BUSINESS BAY': ['Fifty One @ Business Bay', 'Fifty One Tower'],
    'DAMAC Maison Aykon City': ['Aykon City Tower B'],
    'DAMAC Maison Bay\'s Edge': ['BAY\'S EDGE', 'Bay\'s Edge'],
    'Bayswater Tower': ['Bayswater'],
    'Bayz 101 By Danube': ['Bayz101 by Danube', 'Bayz 101'],
    'Binghatti Canal Building': ['Binghatti Canal'],
    'Bugatti Residences by Binghatti': ['Bugatti Residences'],
    'Burj Binghatti Jacob & Co Residences': ['Burj Binghatti Jacob & Co'],
    'Burlington': ['Burlington Tower', 'The Burlington'],
    'Damac Business Tower': ['Business Tower'],
    'Canal Crown 1': ['Canal Crown Tower 1'],
    'Canal Crown 2': ['Canal Crown Tower 2'],
    'Capital Bay': ['Capital Bay Towers'],
    'Capital Bay Tower B': ['Capital Bay B'],
    'Capital Bay Tower A': ['Capital Bay A'],
    'Churchill Executive': ['Churchill Executive Tower'],
    'Churchill Residence': ['Churchill Residency Tower'],
    'The Citadel Tower': ['The Citadel', 'Citadel Tower'],
    'DAMAC TOWERS BY PARAMOUNT': ['DAMAC Towers by Paramount Hotels and Resorts'],
    'DG1 Living': ['DG1'],
    'The Lana Residences Dorchester Collection': ['Dorchester Collection Dubai'],
    'Executive Bay Tower A': ['Executive Bay A'],
    'Executive Bay Tower B': ['Executive Bay B'],
    'Executive Bay Tower P': ['Executive Bay P'],
    'The Executive Bay': ['Executive Bay'],
    'Eywa': ['Eywa Tower'],
    'Hamilton Residency': ['Hamilton Tower'],
    'DAMAC Maison Majestine': ['DAMAC Majestine'],
    'MARQUISE SQUARE TOWER': ['MARQUISE SQUARE'],
    'PARAMOUNT TOWER HOTEL & RESIDENCES': ['DAMAC Paramount Tower (Midtown) Hotel And Residences'],
    'DAMAC Maison Privé': ['DAMAC Maison Prive'],
    'PRIVE BY DAMAC (B)': ['Damac Maison Prive Tower B'],
    'PRIVE BY DAMAC (A)': ['Damac Maison Prive Tower A'],
    'Damac Maison Prive Podium': ['PRIVE BY DAMAC (PODIUM)'],
    'SILVER TOWER': ['Silver Tower Business Bay'],
    'SOBHA IVORY 1': ['SOBHA IVORY I', 'Sobha Ivory Tower 1'],
    'SOBHA IVORY 2': ['SOBHA IVORY II', 'Sobha Ivory Tower 2'],
    'Sobha Ivory Towers': ['Sobha Ivory'],
    'TAMANI ARTS OFFICES': ['Tamani Art Tower'],
    'Millennium Atria': ['ATRIA SA'],
    'ATRIA RA': ['The Atria Residences'],
    'Atria Residences': ['THE ATRIA'],
    'The Binary Tower': ['The Binary'],
    'The Cosmopolitan (Damac Maison)': ['THE COSMOPOLITAN'],
    'THE EXCHANGE': ['The Exchange Business Bay'],
    'Metropolis Tower': ['The Metropolis'],
    'DAMAC Maison The Vogue': ['THE VOGUE'],
    'Trillionaire Residences by Binghatti': ['Trillionaire Residences'],
    'U-BORA TOWER 1': ['Ubora Tower 1'],
    'U-BORA TOWER 2': ['Ubora Tower 2'],
    'U-BORA TOWER 3': ['Ubora Tower 3'],
    'U-BORA TOWER 4': ['Ubora Tower 4'],
    'U-BORA TOWER': ['Ubora Towers'],
    'UPSIDE Living': ['UPSIDE'],
    'SLS Dubai Hotel & Residences': ['SLS DUBAI'],
    'Urban Oasis by Missoni': ['URBAN OASIS'],
    'The Vela Dorchester Collection': ['Vela by Omniyat'],
    'Volante Tower': ['VOLANTE'],
    'West Five Business Bay Residences': ['Marriott Residences (West Five)'],
    'Art XIV14': ['ART XIV'],
    'Art XV Tower': ['Art XV'],
    'ART 18': ['Art XVIII Tower'],
    'Sky Bay Hotel': ['The First Collection Business Bay'],
    'THE RESIDENCE AT BUSINESS CENTRAL': ['THE RESIDENCES AT BUSINESS CENTRAL'],
    'The Ritz-Carlton Residences': ['The Ritz - Carlton Residences'],
    'The Sterling West': ['THE STERLING WEST HOUSE'],
    'The Sterling East': ['THE STERLING EAST HOUSE'],
    'Vela Viento': ['Vela Viento By Omniyat'],
    'VERA TOWER': ['Vera Residences'],
    'Vezul Tower': ['Vezul Residence'],
    'WATER\'S EDGE': ['Waters Edge'],
    'West Wharf': ['WEST WHAREF TOWER'],
    'Carson - The Drive': ['CARSON'],
    'CARSON A': ['Carson Tower A'],
    'CARSON B': ['Carson Tower B'],
    'CARSON C': ['Carson Tower C'],
    'CARSON PODIUM': ['Carson Tower PODIUM'],
    'Golf Veduta Hotel Apartments': ['Golf Veduta'],
    'Vezul Residence': ['Vezul Tower'],
    'Prime Gardens by Prescott': ['Prime Gardens'],
    'DAMAC Hills 2 (Akoya by DAMAC)': ['DAMAC Hills 2'],
    'Avencia': ['Avencia 2'],
    'Viridis A': ['Viridis Tower A'],
    'Viridis B': ['Viridis Tower B'],
    'Viridis C': ['Viridis Tower C'],
    'Viridis D': ['Viridis Tower D'],
    'VIRIDIS PODIUM': ['Viridis Tower PODIUM'],
    'Victoria': ['Victoria 2']
  },

  // Numbered series mappings
  numberedSeries: {
    'Bay Square': { min: 1, max: 13, format: (num) => `Bay Square Building ${num}` },
    'Bluewaters Residences': { min: 1, max: 10, format: (num) => `Apartment Building ${num}` }
  },

  // Complex conditional mappings
  conditionalMappings: {
    'AL MANARA': {
      project: 'AL MANARA',
      masterProject: null
    },
    'Savannah 1': {
      project: 'Savannah',
      masterProject: 'Arabian Ranches'
    },
    'Elie Saab 2': {
      project: 'Elie Saab 2',
      masterProject: 'Arabian Ranches 3',
      alternatives: ['Elie Saab II']
    },
    'Elie Saab 1': {
      project: 'Elie Saab',
      masterProject: 'Arabian Ranches 3'
    },
    'Saheel 1': {
      project: 'Saheel',
      masterProject: 'Arabian Ranches'
    },
    'JOYA DORADO RESIDENCE': {
      project: 'Joya Dorado',
      masterProject: 'Arjan'
    },
    'NAS 3': {
      project: 'NAS 3',
      masterProject: 'Arjan'
    },
    'Resortz by Danube': {
      project: 'Resortz by Danube',
      masterProject: 'Resortz by Danube',
      alternatives: ['RESORTZ RESIDENCE BLOCK 1', 'RESORTZ RESIDENCE BLOCK 2', 'RESORTZ RESIDENCE BLOCK 3']
    },
    'SYANN PARK 1': {
      project: 'SYANN PARK 1',
      masterProject: 'Arjan'
    },
    'The Central Downtown': {
      project: 'The Central Downtown',
      masterProject: 'The Central Downtown',
      alternatives: ['The Central Downtown Tower A', 'The Central Downtown Tower B', 'The Central Downtown Tower C', 'The Central Downtown Tower D']
    },
    'Q Gardens Boutique Residences': {
      project: 'Q Gardens Boutique Residences',
      masterProject: 'Q Gardens Boutique Residences',
      alternatives: ['Q Gardens Boutique Residences Block A', 'Q Gardens Boutique Residences Block B']
    },
    'Torino': {
      project: 'Torino',
      masterProject: 'Torino by ORO24',
      alternatives: ['Torino by ORO24 Building 1', 'Torino by ORO24 Building 2', 'Torino by ORO24 Building 3', 'Torino by ORO24 Building 4', 'Torino by ORO24 Building 5', 'Torino by ORO24 Building 6']
    },
    'Diamond Business Centre': {
      project: 'Diamond Business Centre',
      masterProject: 'Diamond Business Centre',
      alternatives: ['Diamond Business Centre Block A', 'Diamond Business Centre Block B', 'Diamond Business Centre Block C']
    },
    'Mama Shelter (Luxury Family Residences II)': {
      project: 'Luxury Family Residences II',
      masterProject: 'Luxury Family Residence'
    },
    'Vincitore Boulevard': {
      project: 'Vincitore Boulevard',
      masterProject: 'Vincitore Boulevard',
      alternatives: ['Vincitore Boulevard A', 'Vincitore Boulevard B', 'Vincitore Boulevard C', 'Vincitore Boulevard D', 'Vincitore Boulevard E', 'Vincitore Boulevard F']
    },
    'Safeer Tower 1': {
      project: 'Safeer Tower 1',
      masterProject: 'Safeer Towers'
    },
    'Safeer Tower 2': {
      project: 'Safeer Tower 2',
      masterProject: 'Safeer Towers'
    },
    'The EDGE': {
      project: 'The EDGE',
      masterProject: 'The EDGE',
      alternatives: ['The Edge Tower A', 'The Edge Tower B']
    },
    // Executive Towers mappings
    'Executive Tower C': {
      project: 'EAST HEIGHTS 3',
      masterProject: 'Business Bay'
    },
    'Executive Tower B (East Heights 4)': {
      project: 'EAST HEIGHTS 4',
      masterProject: 'Business Bay',
      alternatives: ['Executive Tower B']
    },
    'Executive Tower F (East Heights - 1)': {
      project: 'EAST HEIGHTS 1',
      masterProject: 'Business Bay',
      alternatives: ['Executive Tower F']
    },
    'Executive Tower J': {
      project: 'WEST HEIGHTS 4',
      masterProject: 'Business Bay'
    },
    'Executive Tower M (West Heights 1)': {
      project: 'WEST HEIGHTS 1',
      masterProject: 'Business Bay',
      alternatives: ['Executive Tower M']
    },
    'Executive Tower D (Aspect Tower)': {
      project: 'ASPECT TOWER',
      masterProject: 'Business Bay',
      alternatives: ['Executive Tower D']
    },
    'Executive Tower H': {
      project: 'EAST HEIGHTS 5',
      masterProject: 'Business Bay'
    },
    'Executive Tower E': {
      project: 'EAST HEIGHTS 2',
      masterProject: 'Business Bay'
    },
    'Executive Tower G': {
      project: 'WEST HEIGHTS 6',
      masterProject: 'Business Bay'
    },
    'Executive Tower K': {
      project: 'WEST HEIGHTS 3',
      masterProject: 'Business Bay'
    },
    'Executive Tower L': {
      project: 'WEST HEIGHTS 2',
      masterProject: 'Business Bay'
    },
    // DAMAC Hills projects
    'Richmond': {
      project: 'Richmond',
      masterProject: 'DAMAC Hills'
    },
    'TOPANGA': {
      project: 'TOPANGA',
      masterProject: 'DAMAC Hills'
    },
    'Brookfield': {
      project: 'Brookfield',
      masterProject: 'Brookfield',
      alternatives: ['Brookfield 1', 'Brookfield 2', 'Brookfield 3']
    },
    'CALERO': {
      project: 'CALERO',
      masterProject: 'DAMAC Hills'
    },
    'LONGVIEW': {
      project: 'LONGVIEW',
      masterProject: 'DAMAC HILLS'
    },
    'ROCHESTER': {
      project: 'ROCHESTER',
      masterProject: 'DAMAC HILLS'
    },
    'ROCKWOOD': {
      project: 'ROCKWOOD',
      masterProject: 'DAMAC HILLS'
    },
    'THE FIELD': {
      project: 'THE FIELD',
      masterProject: 'DAMAC HILLS'
    },
    'TRINITY': {
      project: 'TRINITY',
      masterProject: 'DAMAC HILLS'
    },
    'PELHAM': {
      project: 'PELHAM',
      masterProject: 'DAMAC HILLS'
    },
    'BelAir The Trump Estates': {
      project: 'Belair Damac Hills - By Trump Estates',
      masterProject: 'DAMAC HILLS'
    },
    'SILVER SPRINGS': {
      project: 'SILVER SPRINGS',
      masterProject: 'SILVER SPRINGS',
      alternatives: ['SILVER SPRINGS 1', 'SILVER SPRINGS 2', 'SILVER SPRINGS 3']
    },
    'Whitefield': {
      project: 'Whitefield',
      masterProject: 'Whitefield',
      alternatives: ['Whitefield 1', 'Whitefield 2']
    },
    // Golf projects
    'Golf Greens Tower A': {
      project: 'Golf Greens Tower A',
      masterProject: 'Golf Greens',
      alternatives: ['Golf Greens 1 - Tower A', 'Golf Greens 2 - Tower A']
    },
    'Golf Greens Tower B': {
      project: 'Golf Greens Tower B',
      masterProject: 'Golf Greens',
      alternatives: ['Golf Greens 1 - Tower B', 'Golf Greens 2 - Tower B']
    },
    'Golf Promenade 2A': {
      project: 'Golf Promenade 2A',
      masterProject: 'Golf Promenade'
    },
    'Golf Promenade 2B': {
      project: 'Golf Promenade 2B',
      masterProject: 'Golf Promenade'
    },
    'Golf Promenade 3A': {
      project: 'Golf Promenade A',
      masterProject: 'Golf Promenade'
    },
    'Golf Promenade 3B': {
      project: 'Golf Promenade 3B',
      masterProject: 'Golf Promenade'
    },
    'Golf Promenade 4A': {
      project: 'Golf Promenade 4A',
      masterProject: 'Golf Promenade'
    },
    'Golf Promenade 4B': {
      project: 'Golf Promenade 4B',
      masterProject: 'Golf Promenade'
    },
    'Golf Promenade 5A': {
      project: 'Golf Promenade 5A',
      masterProject: 'Golf Promenade'
    },
    'Golf Promenade 5B': {
      project: 'Golf Promenade 5B',
      masterProject: 'Golf Promenade'
    },
    // Loreto projects
    'Loreto 1A': {
      project: 'Loreto 1 A',
      masterProject: 'LORETO'
    },
    'Loreto 1B': {
      project: 'Loreto 1 B',
      masterProject: 'LORETO'
    },
    'Loreto 2A': {
      project: 'Loreto 2 A',
      masterProject: 'LORETO'
    },
    'Loreto 2B': {
      project: 'Loreto 2 B',
      masterProject: 'LORETO'
    },
    'Loreto 3A': {
      project: 'Loreto 3 A',
      masterProject: 'LORETO'
    },
    'Loreto 3B': {
      project: 'Loreto 3 B',
      masterProject: 'LORETO'
    },
    // Other projects
    'Park Residences 4': {
      project: 'Park Residences 4',
      masterProject: 'Park Residences'
    },
    'Veneto': {
      project: 'Veneto',
      masterProject: 'Veneto Villas'
    },
    'Aurum Villas': [
      {
        project: 'Sanctnary',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Sanctnary'
      },
      {
        project: 'Claret',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Claret'
      },
      {
        project: 'Juniper',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Juniper'
      },
      {
        project: 'Odora',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Odora'
      },
      {
        project: 'Zinnia',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Zinnia'
      },
      {
        project: 'Sycamore',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Sycamore'
      },
      {
        project: 'ASTER',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'ASTER'
      }
    ],
    'Casablanca Boutique Villas': [
      {
        project: 'Sanctnary',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Sanctnary'
      },
      {
        project: 'Pacifica',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Pacifica'
      },
      {
        project: 'Zinnia',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Zinnia'
      },
      {
        project: 'ASTER',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'ASTER'
      }
    ],
    'Acuna': {
      project: 'Acuna',
      masterProject: 'DAMAC HILLS 2'
    },
    'Amazonia EX': {
      project: 'Amazonia',
      masterProject: 'DAMAC HILLS 2'
    },
    'Aknan Villas': [
      {
        project: 'Amazonia',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Amazonia'
      },
      {
        project: 'Vardon',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Vardon'
      },
      {
        project: 'Victoria',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Victoria'
      },
      {
        project: 'Avencia',
        masterProject: 'DAMAC HILLS 2',
        contextMasterProject: 'Avencia'
      }
    ],
    'Just Cavalli Villas': {
      project: 'AQUILEGIA',
      masterProject: 'DAMAC HILLS 2'
    },
    'Centaury': {
      project: 'CENTAURY',
      masterProject: 'DAMAC HILLS 2'
    },
    'Janusia': {
      project: 'Janusia',
      masterProject: 'DAMAC HILLS 2'
    },
    'Madinat Hind': {
      project: 'Mulberry',
      masterProject: 'DAMAC HILLS 2'
    },
    'Park Greens': {
      project: 'Park Greens',
      masterProject: 'DAMAC HILLS 2',
      alternatives: ['PARK GREENS 1', 'PARK GREENS 3']
    },
    'Trixis': {
      project: 'Trixis',
      masterProject: 'DAMAC HILLS 2'
    },
    'Hajar Stone Villas': {
      project: 'Victoria',
      masterProject: 'DAMAC HILLS 2'
    },
  }
};

// Fixed applyConditionalMapping function with case-insensitive matching

class PropertyMapper {
  constructor() {
    this.mappings = propertyMappings; // your existing mappings object
  }

  // Normalize string for comparison
  normalizeString(str) {
    if (!str) return '';
    return str.trim().toLowerCase().replace(/[^\w\s]/g, '');
  }

  // Enhanced function to find project matches (includes conditional mappings)
  findProjectMatches(searchTerm, area = null) {
    const normalized = this.normalizeString(searchTerm);
    const matches = [];

    // First, check if this exact term exists in conditional mappings
    if (this.mappings.conditionalMappings && this.mappings.conditionalMappings[searchTerm]) {
      const conditional = this.mappings.conditionalMappings[searchTerm];
      matches.push({
        type: 'project',
        area: 'conditional',
        canonical: conditional.project,
        variant: searchTerm,
        allVariants: conditional.alternatives ? [conditional.project, ...conditional.alternatives] : [conditional.project]
      });
    }

    // Then search in area-based mappings
    if (area && this.mappings[area]) {
      const areaData = this.mappings[area];
      for (const [key, variants] of Object.entries(areaData.projects)) {
        for (const variant of variants) {
          if (this.normalizeString(variant) === normalized) {
            matches.push({
              type: 'project',
              area: area,
              canonical: key,
              variant: variant,
              allVariants: variants
            });
          }
        }
      }
    } else {
      // Search in all areas
      for (const [areaName, areaData] of Object.entries(this.mappings)) {
        if (typeof areaData === 'object' && areaData.projects) {
          for (const [key, variants] of Object.entries(areaData.projects)) {
            for (const variant of variants) {
              if (this.normalizeString(variant) === normalized) {
                matches.push({
                  type: 'project',
                  area: areaName,
                  canonical: key,
                  variant: variant,
                  allVariants: variants
                });
              }
            }
          }
        }
      }
    }

    return matches;
  }

  // Enhanced function to find master project matches (includes conditional mappings)
  findMasterProjectMatches(searchTerm, area = null) {
    const normalized = this.normalizeString(searchTerm);
    const matches = [];

    // Check if any conditional mapping produces this as a master project
    if (this.mappings.conditionalMappings) {
      for (const [key, conditional] of Object.entries(this.mappings.conditionalMappings)) {
        if (conditional.masterProject && this.normalizeString(conditional.masterProject) === normalized) {
          matches.push({
            type: 'masterProject',
            area: 'conditional',
            canonical: conditional.masterProject,
            variant: searchTerm,
            allVariants: [conditional.masterProject]
          });
        }
      }
    }

    // Then search in area-based mappings
    if (area && this.mappings[area]) {
      const areaData = this.mappings[area];
      for (const [key, variants] of Object.entries(areaData.masterProjects)) {
        for (const variant of variants) {
          if (this.normalizeString(variant) === normalized) {
            matches.push({
              type: 'masterProject',
              area: area,
              canonical: key,
              variant: variant,
              allVariants: variants
            });
          }
        }
      }
    } else {
      // Search in all areas
      for (const [areaName, areaData] of Object.entries(this.mappings)) {
        if (typeof areaData === 'object' && areaData.masterProjects) {
          for (const [key, variants] of Object.entries(areaData.masterProjects)) {
            for (const variant of variants) {
              if (this.normalizeString(variant) === normalized) {
                matches.push({
                  type: 'masterProject',
                  area: areaName,
                  canonical: key,
                  variant: variant,
                  allVariants: variants
                });
              }
            }
          }
        }
      }
    }

    return matches;
  }

  // Enhanced getAllVariants function
  getAllVariants(canonicalName, type = 'project', area = null) {
    const variants = new Set();

    // Add the canonical name itself
    variants.add(canonicalName);

    if (type === 'project') {
      // Search in area-based projects
      if (area && area !== 'conditional' && this.mappings[area] && this.mappings[area].projects[canonicalName]) {
        this.mappings[area].projects[canonicalName].forEach(variant => variants.add(variant));
      } else if (area !== 'conditional') {
        // Search in all areas
        for (const [areaName, areaData] of Object.entries(this.mappings)) {
          if (typeof areaData === 'object' && areaData.projects && areaData.projects[canonicalName]) {
            areaData.projects[canonicalName].forEach(variant => variants.add(variant));
          }
        }
      }

      // Check conditional mappings for alternatives
      if (this.mappings.conditionalMappings) {
        for (const [key, conditional] of Object.entries(this.mappings.conditionalMappings)) {
          if (conditional.project === canonicalName && conditional.alternatives) {
            conditional.alternatives.forEach(variant => variants.add(variant));
          }
        }
      }

    } else if (type === 'masterProject') {
      // Search in area-based master projects
      if (area && area !== 'conditional' && this.mappings[area] && this.mappings[area].masterProjects[canonicalName]) {
        this.mappings[area].masterProjects[canonicalName].forEach(variant => variants.add(variant));
      } else if (area !== 'conditional') {
        // Search in all areas
        for (const [areaName, areaData] of Object.entries(this.mappings)) {
          if (typeof areaData === 'object' && areaData.masterProjects && areaData.masterProjects[canonicalName]) {
            areaData.masterProjects[canonicalName].forEach(variant => variants.add(variant));
          }
        }
      }
    }

    // Check name variations
    if (this.mappings.nameVariations && this.mappings.nameVariations[canonicalName]) {
      this.mappings.nameVariations[canonicalName].forEach(variant => variants.add(variant));
    }

    // Check numbered series
    if (this.mappings.numberedSeries && this.mappings.numberedSeries[canonicalName]) {
      const seriesConfig = this.mappings.numberedSeries[canonicalName];
      for (let i = seriesConfig.min; i <= seriesConfig.max; i++) {
        variants.add(seriesConfig.format(i));
      }
    }

    return Array.from(variants);
  }

  // Main search function (corrected logic)
  searchProperty(projectName, masterProjectName = null, area = null) {
    const results = {
      project: {
        found: false,
        matches: [],
        canonical: null
      },
      masterProject: {
        found: false,
        matches: [],
        canonical: null
      }
    };

    // Apply conditional mapping first to get the correct canonical names
    const conditionalResult = this.applyConditionalMapping(projectName, masterProjectName);
    const canonicalProjectName = conditionalResult.project;
    const canonicalMasterProjectName = conditionalResult.masterProject;

    // Search for project matches using the canonical project name
    if (canonicalProjectName) {
      const projectMatches = this.findProjectMatches(canonicalProjectName, area);
      if (projectMatches.length > 0) {
        results.project.found = true;
        results.project.matches = projectMatches;
        results.project.canonical = projectMatches[0].canonical;
      } else {
        // If not found in area mappings, create a match from conditional mapping
        results.project.found = true;
        results.project.matches = [{
          type: 'project',
          area: 'conditional',
          canonical: canonicalProjectName,
          variant: projectName,
          allVariants: [canonicalProjectName, projectName]
        }];
        results.project.canonical = canonicalProjectName;
      }
    }

    // Search for master project matches using the canonical master project name
    if (canonicalMasterProjectName) {
      const masterProjectMatches = this.findMasterProjectMatches(canonicalMasterProjectName, area);
      if (masterProjectMatches.length > 0) {
        results.masterProject.found = true;
        results.masterProject.matches = masterProjectMatches;
        results.masterProject.canonical = masterProjectMatches[0].canonical;
      } else {
        // If not found in area mappings, create a match from conditional mapping
        results.masterProject.found = true;
        results.masterProject.matches = [{
          type: 'masterProject',
          area: 'conditional',
          canonical: canonicalMasterProjectName,
          variant: canonicalMasterProjectName,
          allVariants: [canonicalMasterProjectName]
        }];
        results.masterProject.canonical = canonicalMasterProjectName;
      }
    }

    return results;
  }

  // Helper method to get all possible mappings for a project (useful for debugging)
  getProjectMappingOptions(projectName) {
    if (this.mappings.conditionalMappings && this.mappings.conditionalMappings[projectName]) {
      const conditional = this.mappings.conditionalMappings[projectName];

      if (Array.isArray(conditional)) {
        return conditional.map(mapping => ({
          project: mapping.project,
          masterProject: mapping.masterProject,
          contextMasterProject: mapping.contextMasterProject
        }));
      } else {
        return [{
          project: conditional.project,
          masterProject: conditional.masterProject,
          contextMasterProject: null
        }];
      }
    }
    return null;
  }

  // FIXED: Case-insensitive context matching
  applyConditionalMapping(project, masterProject = null) {
    if (this.mappings.conditionalMappings && this.mappings.conditionalMappings[project]) {
      const conditional = this.mappings.conditionalMappings[project];

      // Check if this is a context-aware mapping (array format)
      if (Array.isArray(conditional)) {
        // Find the matching context based on master project (case-insensitive)
        for (const contextMapping of conditional) {
          if (contextMapping.contextMasterProject && masterProject) {
            // Use case-insensitive comparison
            if (this.normalizeString(contextMapping.contextMasterProject) === this.normalizeString(masterProject)) {
              return {
                project: contextMapping.project || project,
                masterProject: contextMapping.masterProject
              };
            }
          }
        }
        // If no context match found, use the first one as default
        return {
          project: conditional[0].project || project,
          masterProject: conditional[0].masterProject
        };
      } else {
        // Regular conditional mapping (object format)
        return {
          project: conditional.project || project,
          masterProject: conditional.masterProject
        };
      }
    }
    return { project, masterProject };
  }
}

module.exports = PropertyMapper;