export interface Monument {
  id: string;
  name: string;
  city: string;
  state: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
  yearBuilt: string;
  dynasty: string;
  primaryModel: string; // This would be the model path in a real app
  historicalModels: {
    past: string; // ~100 years ago
    ancient: string; // Original construction
  };
  facts: string[];
  visitingHours: string;
  entryFee?: string;
  UNESCO?: boolean;
}

// India's major historical monuments
export const monuments: Monument[] = [
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    city: "Agra",
    state: "Uttar Pradesh",
    coordinates: [78.0421, 27.1751],
    description: "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, Uttar Pradesh, India. It was commissioned in 1631 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself.",
    yearBuilt: "1632-1653",
    dynasty: "Mughal Empire",
    primaryModel: "/models/taj_mahal.glb",
    historicalModels: {
      past: "/models/taj_mahal_1920.glb",
      ancient: "/models/taj_mahal_original.glb"
    },
    facts: [
      "The Taj Mahal's construction took about 22 years to complete",
      "Over 20,000 workers were employed for its construction",
      "The main dome is 73 meters high",
      "The entire structure is made of white marble from Rajasthan"
    ],
    visitingHours: "6:00 AM to 6:30 PM (Closed on Fridays)",
    entryFee: "₹1,100 for foreign tourists, ₹50 for Indian citizens",
    UNESCO: true
  },
  {
    id: "qutub-minar",
    name: "Qutub Minar",
    city: "Delhi",
    state: "Delhi",
    coordinates: [77.1855, 28.5245],
    description: "The Qutub Minar is a 73-metre tall minaret built in the early 13th century. It is a UNESCO World Heritage Site and has survived natural disasters and invasions throughout its history. The tower is known for its intricate carvings, inscriptions from the Quran, and distinctive architectural style that showcases a blend of Indo-Islamic influences.",
    yearBuilt: "1199-1220",
    dynasty: "Mamluk Dynasty",
    primaryModel: "/models/qutub_minar_new.glb",
    historicalModels: {
      past: "/models/qutub_minar_1920.glb",
      ancient: "/models/qutub_minar_original.glb"
    },
    facts: [
      "It is the tallest brick minaret in the world",
      "Construction was started by Qutub-ud-din Aibak and completed by his successor Iltutmish",
      "The tower has five distinct storeys, each marked by a projecting balcony",
      "The first three storeys are made of red sandstone, while the fourth and fifth are made of marble and sandstone"
    ],
    visitingHours: "7:00 AM to 5:00 PM (All days)",
    entryFee: "₹600 for foreign tourists, ₹35 for Indian citizens",
    UNESCO: true
  },
  {
    id: "red-fort",
    name: "Red Fort",
    city: "Delhi",
    state: "Delhi",
    coordinates: [77.2410, 28.6562],
    description: "The Red Fort is a historic fort that served as the main residence of the emperors of the Mughal dynasty for nearly 200 years. Built in 1639 by Emperor Shah Jahan, it was the ceremonial and political center of the Mughal government. The massive red sandstone walls rise 33 meters above the surrounding area and encompass several impressive structures including the Diwan-i-Aam (Hall of Public Audience) and the Diwan-i-Khas (Hall of Private Audience).",
    yearBuilt: "1639-1648",
    dynasty: "Mughal Empire",
    primaryModel: "/models/red_fort_improved.glb",
    historicalModels: {
      past: "/models/red_fort_past.glb",
      ancient: "/models/red_fort_original.glb"
    },
    facts: [
      "The fort derives its name from its massive red sandstone walls",
      "It was the ceremonial and political center of the Mughal government",
      "The Indian Prime Minister hoists the national flag here on Independence Day",
      "It houses several museums and was declared a UNESCO World Heritage Site in 2007"
    ],
    visitingHours: "9:30 AM to 4:30 PM (Closed on Mondays)",
    entryFee: "₹600 for foreign tourists, ₹35 for Indian citizens",
    UNESCO: true
  },
  {
    id: "hawa-mahal",
    name: "Hawa Mahal",
    city: "Jaipur",
    state: "Rajasthan",
    coordinates: [75.8267, 26.9239],
    description: "Hawa Mahal (Palace of Winds) is an extraordinary five-story palace in Jaipur, constructed of red and pink sandstone. Built in 1799 by Maharaja Sawai Pratap Singh, this architectural marvel features 953 small windows (jharokhas) with intricate lattice designs that create a honeycomb-like facade. The palace was ingeniously designed to allow royal women to observe street festivals and everyday city life without being seen, while also providing natural cooling through the breeze that flows through its many windows.",
    yearBuilt: "1799",
    dynasty: "Rajput",
    primaryModel: "/models/hawa_mahal.glb",
    historicalModels: {
      past: "/models/hawa_mahal_past.glb",
      ancient: "/models/hawa_mahal_ancient.glb"
    },
    facts: [
      "The palace has 953 small windows called jharokhas decorated with intricate latticework",
      "The unique five-story exterior is akin to a honeycomb with its 953 small windows",
      "It was built to allow royal ladies to observe everyday life and festivals without being seen",
      "The building has no foundation and is the tallest building in the world without a foundation"
    ],
    visitingHours: "9:00 AM to 5:00 PM (All days)",
    entryFee: "₹200 for foreign tourists, ₹50 for Indian citizens",
    UNESCO: false
  },
  {
    id: "konark-sun-temple",
    name: "Konark Sun Temple",
    city: "Konark",
    state: "Odisha",
    coordinates: [86.0945, 19.8876],
    description: "The Konark Sun Temple is a magnificent 13th-century CE temple at Konark, about 35 kilometers northeast from Puri on the coastline of Odisha, India. Dedicated to the Hindu Sun God Surya, this UNESCO World Heritage site is one of India's most stunning architectural marvels. The temple is designed in the form of a gigantic chariot of the Sun God with twelve pairs of elaborately carved stone wheels and pulled by seven horses. The temple's walls showcase exquisite stone carvings depicting various aspects of life, mythological narratives, and celestial beings.",
    yearBuilt: "1250 CE",
    dynasty: "Eastern Ganga Dynasty",
    primaryModel: "/models/konark_sun_temple.glb",
    historicalModels: {
      past: "/models/konark_sun_temple.glb", // We'll use the same model for now
      ancient: "/models/konark_sun_temple.glb" // We'll use the same model for now
    },
    facts: [
      "The temple is designed in the form of a colossal chariot with 24 wheels, pulled by 7 horses",
      "The wheels of the temple are sundials which can be used to calculate time accurately",
      "The temple was built by King Narasimhadeva I of the Eastern Ganga Dynasty",
      "It is a UNESCO World Heritage Site since 1984"
    ],
    visitingHours: "6:00 AM to 8:00 PM (All days)",
    entryFee: "₹600 for foreign tourists, ₹40 for Indian citizens",
    UNESCO: true
  },
  {
    id: "hampi",
    name: "Hampi",
    city: "Hampi",
    state: "Karnataka", 
    coordinates: [76.4700, 15.3350],
    description: "Hampi is an awe-inspiring ancient village in Karnataka that transports visitors to the glorious past of the Vijayanagara Empire (1336-1646 CE). This UNESCO World Heritage Site features a breathtaking landscape of massive boulders balanced precariously amidst lush palm groves, interspersed with over 1,600 surviving remains of temples, palaces, and other structures. Once the capital of one of the greatest Hindu kingdoms and among the richest and largest cities in the world, Hampi's architectural marvels include the iconic Virupaksha Temple, the magnificent Vittala Temple with its famous stone chariot and musical pillars, and the elegant Lotus Mahal.",
    yearBuilt: "1336-1646 CE",
    dynasty: "Vijayanagara Empire",
    primaryModel: "/models/vittala_temple_highres.glb",
    historicalModels: {
      past: "/models/vittala_temple_past_highres.glb",
      ancient: "/models/hampi_detailed.glb"
    },
    facts: [
      "Hampi was the second-largest medieval-era city after Beijing",
      "It is a UNESCO World Heritage Site since 1986",
      "The site contains over 1,600 surviving remains of the last great Hindu kingdom in South India",
      "The iconic stone chariot at the Vittala Temple is featured on the Indian ₹50 note"
    ],
    visitingHours: "6:00 AM to 6:00 PM (All days)",
    entryFee: "₹600 for foreign tourists, ₹40 for Indian citizens",
    UNESCO: true
  },
  {
    id: "ajanta-ellora",
    name: "Ajanta & Ellora Caves",
    city: "Aurangabad",
    state: "Maharashtra",
    coordinates: [75.7010, 20.5500],
    description: "The Ajanta and Ellora Caves represent the pinnacle of ancient Indian rock-cut architecture and artistry. The Ajanta Caves comprise 30 Buddhist cave monuments carved into a horseshoe-shaped cliff, dating from the 2nd century BCE to about 480 CE. They feature exquisite paintings and sculptures depicting Buddha's life and Jataka tales, preserved remarkably through centuries of abandonment. The Ellora Caves, located about 100 km away, include 34 monasteries and temples spanning Buddhism, Hinduism, and Jainism, carved between the 6th and 10th centuries CE. The crown jewel of Ellora is the magnificent Kailasa Temple (Cave 16), the world's largest monolithic structure, carved top-down from a single massive rock, representing Mount Kailash, the abode of Lord Shiva.",
    yearBuilt: "2nd century BCE to 7th century CE",
    dynasty: "Various dynasties including Satavahana, Vakataka, and Rashtrakuta",
    primaryModel: "/models/ajanta_ellora.glb",
    historicalModels: {
      past: "/models/ajanta_ellora_past.glb",
      ancient: "/models/ajanta_ellora.glb"
    },
    facts: [
      "The Ajanta Caves contain paintings and sculptures considered to be masterpieces of Buddhist religious art",
      "The Ellora Caves demonstrate the religious harmony prevalent during this period through dedicated Hindu, Buddhist, and Jain cave temples",
      "The Kailasa temple in Ellora is the largest monolithic rock excavation in the world",
      "Both cave complexes are UNESCO World Heritage Sites"
    ],
    visitingHours: "9:00 AM to 5:30 PM (Closed on Tuesdays)",
    entryFee: "₹600 for foreign tourists, ₹40 for Indian citizens",
    UNESCO: true
  },
  {
    id: "gol-gumbaz",
    name: "Gol Gumbaz",
    city: "Bijapur",
    state: "Karnataka",
    coordinates: [75.7101, 16.8302],
    description: "Gol Gumbaz is the mausoleum of Mohammed Adil Shah, Sultan of Bijapur. The tomb, located in Bijapur, Karnataka, was completed in 1656 and is remarkable for its massive dome, which is the second largest dome in the world after St. Peter's Basilica in Rome. The acoustics of the central chamber are particularly notable - even the faintest sound is echoed several times.",
    yearBuilt: "1626-1656",
    dynasty: "Adil Shahi Dynasty",
    primaryModel: "/models/gol_gumbaz_improved.glb",
    historicalModels: {
      past: "/models/gol_gumbaz_past.glb",
      ancient: "/models/gol_gumbaz_ancient.glb"
    },
    facts: [
      "The dome of Gol Gumbaz is 44 meters in diameter, making it one of the largest single chamber spaces in the world",
      "The whispering gallery around the dome allows sounds to be heard across the diameter of the dome due to its acoustic properties",
      "The structure features four seven-story octagonal towers at each corner which served as minarets",
      "The name 'Gol Gumbaz' means 'circular dome' in reference to its distinctive architecture"
    ],
    visitingHours: "6:00 AM to 6:00 PM (All days)",
    entryFee: "₹300 for foreign tourists, ₹25 for Indian citizens",
    UNESCO: false
  },
  {
    id: "sanchi-stupa",
    name: "Sanchi Stupa",
    city: "Sanchi",
    state: "Madhya Pradesh",
    coordinates: [77.7375, 23.4794],
    description: "The Great Stupa at Sanchi is one of the oldest stone structures in India and was originally commissioned by Emperor Ashoka in the 3rd century BCE. Located about 46 km from Bhopal, this UNESCO World Heritage site is a remarkable Buddhist monument with four intricately carved gateways (toranas) depicting scenes from Buddha's life and previous incarnations. The hemispherical dome, built over the relics of the Buddha, represents the cosmic mountain, with the harmika at the top symbolizing heaven. This magnificently preserved stupa exemplifies the development of Buddhist art and architecture over many centuries.",
    yearBuilt: "3rd century BCE",
    dynasty: "Mauryan Empire",
    primaryModel: "/models/sanchi_stupa_authentic.glb",
    historicalModels: {
      past: "/models/sanchi_stupa_past_authentic.glb",
      ancient: "/models/sanchi_stupa_detailed.glb"
    },
    facts: [
      "It was commissioned by Emperor Ashoka the Great in the 3rd century BCE",
      "The four gateways (toranas) were added during the 1st century BCE",
      "It houses the relics of Buddha",
      "It is one of the oldest existing stone structures in India"
    ],
    visitingHours: "8:30 AM to 5:30 PM (All days)",
    entryFee: "₹600 for foreign tourists, ₹50 for Indian citizens",
    UNESCO: true
  },
  {
    id: "gwalior-fort",
    name: "Gwalior Fort",
    city: "Gwalior",
    state: "Madhya Pradesh",
    coordinates: [78.1690, 26.2230],
    description: "Gwalior Fort, perched on a steep sandstone hill, is one of India's most impregnable fortresses with a rich history dating back to at least the 8th century. This architectural marvel combines Hindu and Islamic styles and features stunning palaces, temples, and water tanks within its massive walls. The most spectacular elements include the Man Mandir Palace with its distinctive blue-tiled domes and intricate stone carvings, the Gujari Mahal (now an archaeological museum), the Teli Ka Mandir with its unique blend of Dravidian and North Indian architectural styles, and the imposing Hathi Pol (Elephant Gate). The fort stands as a testament to the power and artistic vision of various dynasties that ruled central India.",
    yearBuilt: "8th century",
    dynasty: "Various including Tomars, Mughals, Marathas",
    primaryModel: "/models/gwalior_fort_highres.glb",
    historicalModels: {
      past: "/models/gwalior_fort_past_highres.glb",
      ancient: "/models/gwalior_fort_detailed.glb"
    },
    facts: [
      "The fort is known as 'The Pearl in the Necklace of Forts of India'",
      "It has been controlled by many different rulers over its long history",
      "The Man Mandir Palace features stunning tilework and intricate carvings",
      "It houses one of the oldest records of zero as a numerical figure in its inscriptions"
    ],
    visitingHours: "8:00 AM to 6:00 PM (All days)",
    entryFee: "₹250 for foreign tourists, ₹35 for Indian citizens",
    UNESCO: false
  },
  {
    id: "mahakal-temple",
    name: "Mahakaleshwar Temple",
    city: "Ujjain",
    state: "Madhya Pradesh",
    coordinates: [75.7682, 23.1828],
    description: "The Mahakaleshwar Temple in Ujjain is one of the 12 sacred Jyotirlingas (shrines of Lord Shiva) in India. This temple's unique south-facing black lingam is believed to be swayambhu (self-manifested) and is situated underground in a silver-plated sanctuary. The temple complex houses five levels, with the distinctive shikhara (spire) rising above the sanctum sanctorum. Known for its powerful tantric rituals and daily bhasma aarti (in which sacred ash is applied to the lingam), the temple draws millions of devotees yearly. The temple's architecture features a blend of North and South Indian styles with a main black stone structure, ornate mandapam (hall), and the sacred Nandi statue.",
    yearBuilt: "Unknown (ancient)",
    dynasty: "Various, with significant renovations under Marathas",
    primaryModel: "/models/mahakal_temple.glb",
    historicalModels: {
      past: "/models/mahakal_temple_past_highres.glb",
      ancient: "/models/mahakal_temple_detailed.glb"
    },
    facts: [
      "It houses one of the 12 sacred Jyotirlinga shrines of Shiva",
      "The lingam faces south, unlike most Shiva temples where the lingam faces east",
      "The temple is famous for its Bhasma Aarti ritual performed at 4 AM daily",
      "The temple has undergone multiple renovations over centuries, with the most recent major one completed in 2022"
    ],
    visitingHours: "4:00 AM to 11:00 PM (All days)",
    entryFee: "Free entry (Special darshan tickets available)",
    UNESCO: false
  },
  {
    id: "fatehpur-sikri",
    name: "Fatehpur Sikri",
    city: "Fatehpur Sikri",
    state: "Uttar Pradesh",
    coordinates: [77.6609, 27.0945],
    description: "Fatehpur Sikri is a magnificent fortified ancient city that served as the capital of the Mughal Empire from 1571 to 1585 during Emperor Akbar's reign. This UNESCO World Heritage site, located just 40 km from Agra, is a masterpiece of Mughal architecture, showcasing a unique blend of Persian, Islamic, and Hindu styles. The city includes remarkable structures such as the imposing Buland Darwaza (Victory Gate), one of the tallest gateways in the world; the Jama Masjid with its grand courtyard; the white marble tomb of Sufi saint Salim Chishti with intricate jali screens; the unique Diwan-i-Khas (Hall of Private Audience) with its central column supporting hanging walkways; the five-tiered Panch Mahal; and the Jodha Bai Palace complex with its blend of Hindu and Muslim architectural elements.",
    yearBuilt: "1571-1585",
    dynasty: "Mughal Empire",
    primaryModel: "/models/fatehpur_sikri_improved.glb",
    historicalModels: {
      past: "/models/fatehpur_sikri_improved.glb",
      ancient: "/models/fatehpur_sikri_improved.glb"
    },
    facts: [
      "The city was built to honor Sufi saint Salim Chishti, who predicted the birth of Akbar's son",
      "It was abandoned shortly after completion due to water shortages",
      "The Buland Darwaza stands 54 meters high and was built to commemorate Akbar's victory over Gujarat",
      "It demonstrates Akbar's philosophy of religious tolerance with elements from various architectural traditions"
    ],
    visitingHours: "6:00 AM to 6:00 PM (All days)",
    entryFee: "₹610 for foreign tourists, ₹50 for Indian citizens",
    UNESCO: true
  },
  {
    id: "golden-temple",
    name: "Golden Temple",
    city: "Amritsar",
    state: "Punjab",
    coordinates: [74.8765, 31.6200],
    description: "The Harmandir Sahib, commonly known as the Golden Temple, is the holiest shrine in Sikhism. Located in Amritsar, Punjab, this magnificent structure features a distinctive gold-plated upper section that gleams brilliantly over the sacred Amrit Sarovar (Pool of Nectar). The temple is built on a square platform, surrounded by the sacred pool, with four entrances symbolizing openness to all people regardless of religion, caste, or background. A marble causeway leads to the main shrine, which houses the Guru Granth Sahib (the holy scripture of Sikhism). The complex also includes the Akal Takht (the supreme seat of religious authority for Sikhs) and offers langar (free community kitchen) to all visitors regardless of background. The architecture beautifully blends Hindu and Islamic styles, with intricate gold and marble work throughout.",
    yearBuilt: "1588-1604",
    dynasty: "Sikh Gurus (Guru Arjan)",
    primaryModel: "/models/golden_temple_highres.glb",
    historicalModels: {
      past: "/models/golden_temple_past_highres.glb",
      ancient: "/models/golden_temple_detailed.glb"
    },
    facts: [
      "The foundation stone was laid by Muslim Sufi saint Mian Mir",
      "The temple serves free meals (langar) to over 100,000 people daily",
      "The upper floors were covered with gold foil during Maharaja Ranjit Singh's era",
      "Water from the sacred pool is believed to have healing properties"
    ],
    visitingHours: "Open 24 hours (All days)",
    entryFee: "Free entry",
    UNESCO: false
  },
  {
    id: "meenakshi-temple",
    name: "Meenakshi Temple",
    city: "Madurai",
    state: "Tamil Nadu",
    coordinates: [78.1197, 9.9195],
    description: "The Meenakshi Amman Temple in Madurai is a breathtaking example of Dravidian architecture and one of the most important Hindu temples in South India. Dedicated to Goddess Meenakshi (a form of Parvati) and her consort Sundareswarar (Lord Shiva), this massive temple complex spans 14 acres and features 14 spectacular gopurams (gateway towers) covered with thousands of colorful sculpted figures. The tallest southern tower rises to 170 feet. The temple's structure follows a concentric rectangular layout with multiple prakarams (corridors), housing numerous shrines, the Golden Lotus Tank, and the celebrated Thousand Pillar Hall with its ornately carved pillars. The vibrant painted sculptures on the gopurams depict mythological scenes and deities in a riot of blues, greens, reds, and yellows, making it one of India's most visually striking temples.",
    yearBuilt: "1600s (current structure)",
    dynasty: "Nayak Dynasty",
    primaryModel: "/models/meenakshi_temple_highres_exact.glb",
    historicalModels: {
      past: "/models/meenakshi_temple_past_highres_exact.glb",
      ancient: "/models/meenakshi_temple_detailed.glb"
    },
    facts: [
      "The temple has approximately 33,000 sculptures",
      "According to legend, Lord Shiva came to Madurai to marry Goddess Meenakshi",
      "The temple hosts the famous Meenakshi Thirukalyanam (celestial wedding) festival annually",
      "The Thousand Pillar Hall contains exactly 985 intricately carved pillars"
    ],
    visitingHours: "5:00 AM to 12:30 PM and 4:00 PM to 10:00 PM (All days)",
    entryFee: "₹100 for foreign tourists, free for Indian citizens (special darshan tickets available)",
    UNESCO: false
  },
  {
    id: "gateway-of-india",
    name: "Gateway of India",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: [72.8347, 18.9220],
    description: "The Gateway of India is an iconic arch monument built during the 20th century in the city of Mumbai. This magnificent structure, facing the vast Arabian Sea, was erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder on their visit to India in 1911. Designed in Indo-Saracenic style by architect George Wittet, the monument blends elements of Hindu and Muslim architectural styles. The central dome, rising 26 meters above the ground, is flanked by four turrets and intricate latticework carved into the yellow basalt stone. Built to be a symbolic ceremonial entrance to India for important colonial personnel, it ironically became the exit point for the last British troops leaving independent India in 1948. Today, the Gateway stands as one of Mumbai's most visited landmarks, offering boat trips to nearby attractions and spectacular views of the sunset over the Arabian Sea.",
    yearBuilt: "1911-1924",
    dynasty: "British Raj",
    primaryModel: "/models/gateway_of_india_exact.glb",
    historicalModels: {
      past: "/models/gateway_of_india_exact.glb",
      ancient: "/models/gateway_of_india_exact.glb"
    },
    facts: [
      "It was built to commemorate the visit of King George V and Queen Mary to Mumbai in 1911",
      "The foundation stone was laid in 1913, but the actual construction was completed in 1924",
      "The last British troops to leave India after independence passed through the Gateway in 1948",
      "The monument is built from yellow basalt and reinforced concrete with intricate latticework carved into the stone"
    ],
    visitingHours: "Open 24 hours (All days)",
    entryFee: "Free entry",
    UNESCO: false
  },
  {
    id: "somnath-temple",
    name: "Somnath Temple",
    city: "Prabhas Patan",
    state: "Gujarat",
    coordinates: [70.4022, 20.8880],
    description: "The magnificent Somnath Temple, located on the western coast of Gujarat, is one of the twelve sacred Jyotirlingas (shrines of Lord Shiva) in India. Rebuilt multiple times after repeated destruction, the current structure was completed in 1951 and stands as a symbol of India's resilience and cultural endurance. This stunning temple is constructed in the Chalukya style with intricate carvings throughout its limestone structure. The temple features a towering shikhara (spire) adorned with a golden kalash and flag, multiple ornate halls with open pillared architecture, and pyramidal roofs covered with small decorative spires. Located on the shores of the Arabian Sea, the temple complex includes beautifully carved supporting pillars, open galleries, and detailed sculpture work depicting various deities and mythological scenes. The Somnath Temple is not just an architectural marvel but also a site of profound spiritual significance, attracting millions of devotees who come to worship at this ancient seat of Lord Shiva.",
    yearBuilt: "1951 (current structure)",
    dynasty: "Post-Independence India",
    primaryModel: "/models/somnath_temple_exact.glb",
    historicalModels: {
      past: "/models/somnath_temple_exact.glb",
      ancient: "/models/somnath_temple_exact.glb"
    },
    facts: [
      "The temple has been destroyed and rebuilt multiple times throughout history, with the first temple believed to date back to ancient times",
      "It is mentioned in ancient texts as having been built originally with gold by the Moon God Soma",
      "Mahmud of Ghazni's raid in 1024 CE was one of the most notable destructions of the temple",
      "The current structure was completed in 1951 after India's independence, with Sardar Vallabhbhai Patel playing a key role in its reconstruction"
    ],
    visitingHours: "6:00 AM to 9:30 PM (All days)",
    entryFee: "Free entry",
    UNESCO: false
  }
];
