/**
 * Long-form storefront copy for every seeded product.
 *
 * `description` is newline separated and follows the FAQ style used on the
 * product page: a line ending in "?" is rendered as a bullet question and the
 * line that follows is rendered as its answer.
 */
export interface ProductContent {
  description: string;
  key_benefits: string[];
  how_to_use: string[];
}

const c = (lines: string[], key_benefits: string[], how_to_use: string[]): ProductContent => ({
  description: lines.join("\n"),
  key_benefits,
  how_to_use,
});

export const PRODUCT_CONTENT: Record<string, ProductContent> = {
  // ── Electronics ────────────────────────────────────────────────────────────
  "iphone-15-pro": c(
    [
      "Why is the iPhone 15 Pro worth the upgrade?",
      "The iPhone 15 Pro pairs Apple's A17 Pro chip with a lighter titanium frame, so console-level gaming, 4K ProRes editing and on-device AI features run smoothly while the phone stays comfortable in your hand all day.",
      "How good is the camera system?",
      "A 48MP main sensor with a 5x optical telephoto lens captures far more detail in low light, while Action mode steadies handheld video and ProRAW gives you full editing control.",
      "Does it support 5G and USB-C?",
      "Yes — 5G and dual eSIM for connectivity, plus a USB-C port that finally shares one cable and fast charger with your Mac, iPad and AirPods.",
      "How long does the battery last?",
      "A typical day of mixed use on a single charge, and up to 20 hours of video playback when you need it to last longer.",
      "Is it water resistant?",
      "It carries an IP68 rating, so it survives splashes, rain and brief submersion in fresh water up to 6 metres for 30 minutes.",
    ],
    [
      "A17 Pro chip built for console-level gaming",
      "Lightweight, durable titanium design",
      "48MP Pro camera system with 5x telephoto",
      "USB-C with fast charging and data transfer",
      "IP68 water and dust resistance",
    ],
    [
      "Charge fully with the supplied USB-C cable before first use",
      "Use Quick Start to move photos, apps and messages from your old phone",
      "Sign in with your Apple ID to enable Face ID and iCloud backup",
      "Update to the latest iOS for security fixes and new features",
      "Pair your AirPods or Watch from Settings > Bluetooth",
    ]
  ),

  "samsung-galaxy-s24-ultra": c(
    [
      "What makes the Galaxy S24 Ultra special?",
      "It combines a built-in S Pen, a 200MP camera and Galaxy AI — translate calls live, summarise notes and edit photos with a prompt, all without leaving the phone.",
      "How does the camera perform?",
      "The 200MP main sensor resolves stunning detail, while the 5x periscope telephoto keeps distant subjects sharp and Night mode cleans up low-light shots.",
      "Is the display comfortable for long sessions?",
      "The 6.8-inch QHD+ AMOLED runs at 120Hz with an anti-reflective coating, so scrolling feels fluid and the screen stays readable in direct sunlight.",
      "Does it come with a stylus?",
      "Yes — the S Pen docks inside the body and works for sketching, handwriting notes and precise photo edits.",
      "How is the battery life?",
      "The 5000mAh battery comfortably covers a full day, and 45W charging takes you from empty to over half an hour of use in minutes.",
    ],
    [
      "Built-in S Pen for notes and sketching",
      "200MP camera with 5x optical zoom",
      "Galaxy AI translation, summaries and edits",
      "Corning Gorilla Armor anti-reflective display",
      "All-day 5000mAh battery with 45W charging",
    ],
    [
      "Insert your SIM or eSIM and connect to Wi-Fi",
      "Sign in to your Samsung account to enable backup",
      "Pull out the S Pen to pair it and set handwriting shortcuts",
      "Turn on Galaxy AI features from Settings > Advanced features",
      "Enable Adaptive brightness for comfortable outdoor viewing",
    ]
  ),

  "dell-xps-13": c(
    [
      "Who is the Dell XPS 13 built for?",
      "Students and professionals who want a laptop that disappears into a bag — it is under 1.2kg yet fast enough for heavy spreadsheets, coding and dozens of browser tabs.",
      "How does it perform day to day?",
      "The Intel Core i7 with 16GB of RAM and a fast NVMe SSD boots in seconds and keeps multitasking smooth, even with large files and cloud apps open.",
      "Is the screen good for long work sessions?",
      "The InfinityEdge display has slim bezels and a comfortable anti-glare finish, so you get more screen in a smaller body with less eye strain.",
      "How long does the battery last?",
      "Around 10 to 12 hours of web browsing and document work, which easily covers a full day of classes or meetings.",
      "Can I connect external monitors?",
      "Yes — Thunderbolt 4 ports handle monitors, docks and fast storage through a single cable, and an adapter covers HDMI when needed.",
    ],
    [
      "Intel Core i7 performance in an ultrabook body",
      "16GB RAM and fast NVMe SSD for smooth multitasking",
      "Near-borderless InfinityEdge display",
      "Up to 12 hours of battery life",
      "Thunderbolt 4 for docks and external displays",
    ],
    [
      "Charge fully and let Windows complete its first setup",
      "Sign in to your Microsoft account for sync and backup",
      "Run Windows Update and Dell Update for the latest drivers",
      "Set your power mode to Balanced for the best battery balance",
      "Connect a monitor through Thunderbolt 4 when working at a desk",
    ]
  ),

  "macbook-air-m3": c(
    [
      "What is great about the MacBook Air M3?",
      "It is completely fanless, so it stays silent, yet the M3 chip handles photo editing, coding and 4K video without breaking a sweat — all in a body under 1.24kg.",
      "How is the battery life?",
      "Up to 18 hours of video playback or a full working day of browsing and documents, and it charges quickly over MagSafe or USB-C.",
      "Is the screen good enough for creative work?",
      "The 13.6-inch Liquid Retina display supports one billion colours and reaches 500 nits, so photos and video look accurate and vivid.",
      "Does it have a good webcam and speakers?",
      "A 1080p camera keeps video calls sharp, and a four-speaker sound system with spatial audio fills a room surprisingly well.",
      "How much storage do I need?",
      "256GB suits most students and office users; choose 512GB or more if you keep large photo libraries or video projects locally.",
    ],
    [
      "Apple M3 chip with an 8-core CPU and GPU",
      "Fanless design — silent under heavy load",
      "Up to 18 hours of battery life",
      "13.6-inch Liquid Retina display with True Tone",
      "1080p FaceTime camera and four-speaker audio",
    ],
    [
      "Charge and start up, then follow macOS Setup Assistant",
      "Sign in to your Apple ID to enable iCloud and Find My",
      "Update macOS from System Settings > General > Software Update",
      "Move files from your old computer with Migration Assistant",
      "Turn on Night Shift if you work late to reduce eye strain",
    ]
  ),

  "sony-wh-1000xm5": c(
    [
      "How good is the noise cancellation?",
      "Eight microphones and two processors analyse ambient sound continuously, so engine drone, office chatter and traffic fade away while your music stays clear.",
      "Are they comfortable for long flights?",
      "Soft synthetic-leather cushions and a lightweight 250g frame stay comfortable for hours, and they fold flat into a hard case for travel.",
      "How is the call quality?",
      "Beamforming microphones isolate your voice from wind and background noise, so callers hear you clearly even outside.",
      "How long does the battery last?",
      "Up to 30 hours with noise cancellation on, and a quick 3 minute charge gives roughly 3 hours of playback when you are in a hurry.",
      "Can I pair two devices at once?",
      "Yes — multipoint pairing switches automatically between your laptop and phone, so a video call never interrupts your music.",
    ],
    [
      "Industry-leading active noise cancellation",
      "Up to 30 hours of battery with ANC",
      "Crystal-clear hands-free calling",
      "Multipoint pairing with two devices",
      "Lightweight 250g comfort for long sessions",
    ],
    [
      "Charge fully before your first trip",
      "Install the Sony Headphones app to tune sound and ANC",
      "Hold the power button to pair over Bluetooth",
      "Enable multipoint if you use a laptop and phone together",
      "Wipe the cushions regularly to keep them fresh",
    ]
  ),

  "wireless-bluetooth-speaker": c(
    [
      "Is this speaker loud enough for a room?",
      "Yes — the full-range driver and passive radiator deliver room-filling sound with punchy bass, plenty for a kitchen, balcony or small party.",
      "How long does it last on a charge?",
      "Around 20 hours at moderate volume, so it easily covers a full day outdoors; a full recharge takes about 3 hours over USB-C.",
      "Can I pair two speakers together?",
      "Stereo pairing links two units for true left and right channels, and party mode syncs several speakers across a larger space.",
      "Is it waterproof?",
      "The IPX7 rating means it survives splashes, poolside use and even a quick drop in water — just dry the ports before charging.",
      "Does it support voice assistants?",
      "Tap the assistant button to summon Siri or Google Assistant from your paired phone.",
    ],
    [
      "360° room-filling sound with deep bass",
      "Up to 20 hours of playtime",
      "IPX7 waterproof for pool and beach days",
      "Stereo pairing with a second speaker",
      "USB-C fast charging",
    ],
    [
      "Charge fully with the included USB-C cable",
      "Pair from your phone's Bluetooth menu",
      "Press the stereo button to link a second speaker",
      "Rinse with fresh water after saltwater or pool exposure",
      "Store dry and charged before long storage",
    ]
  ),

  "apple-watch-series-9": c(
    [
      "What can the Apple Watch Series 9 track?",
      "Heart rate, sleep stages, blood oxygen, ECG, workouts and even cycle tracking — with trends that show whether your fitness is improving over months.",
      "What is Double Tap?",
      "Pinch your thumb and finger together to answer calls, dismiss timers or play music, so you can control the watch one-handed.",
      "How is the display?",
      "The 2000-nit display stays readable in direct sunlight and dims to 1 nit in a dark room, with an always-on face.",
      "Do I need an iPhone with it?",
      "Yes — it pairs with an iPhone for setup, notifications, apps and Apple Pay.",
      "How water resistant is it?",
      "Rated to 50 metres and suitable for pool and open-water swimming, though not for diving or high-speed water sports.",
    ],
    [
      "Advanced health, sleep and workout tracking",
      "Double Tap gesture for one-handed control",
      "Bright 2000-nit always-on Retina display",
      "Crash and fall detection with emergency SOS",
      "Swim-proof to 50 metres",
    ],
    [
      "Charge and hold it near your iPhone to pair",
      "Set your wrist, passcode and activity goals",
      "Allow health permissions so trends can build up",
      "Install your favourite apps from the Watch app",
      "Enable Fall Detection if you run or cycle outdoors",
    ]
  ),

  "canon-eos-r50": c(
    [
      "Is the EOS R50 good for beginners?",
      "Yes — guided modes and a flip-out touchscreen make it easy to learn, while the APS-C sensor delivers the blurred backgrounds phones cannot fake.",
      "How is video quality?",
      "It records 4K at 30fps with Dual Pixel autofocus that tracks eyes and faces, plus 1080p at 60fps for smooth slow motion.",
      "What does the kit lens cover?",
      "The 18-45mm zoom covers everything from group shots to travel scenes, and stabilisation keeps handheld shots steady.",
      "How many photos fit on a card?",
      "A 64GB card holds thousands of 24MP stills or roughly an hour of 4K video, so you can shoot all day without swapping cards.",
      "Can I control it from my phone?",
      "The Canon Camera Connect app lets you preview, transfer and even trigger the shutter remotely over Wi-Fi.",
    ],
    [
      "24.2MP APS-C sensor with beautiful background blur",
      "4K 30fps video with eye and face tracking AF",
      "Vari-angle touchscreen for vlogging and selfies",
      "Lightest mirrorless body in its class",
      "Wi-Fi and Bluetooth via Canon Camera Connect",
    ],
    [
      "Insert the battery and SD card, then power on",
      "Set date, time and image quality in the menu",
      "Choose Scene Intelligent Auto while learning the controls",
      "Pair with the Canon Camera Connect app for transfers",
      "Carry a UV filter to protect the front element",
    ]
  ),

  "playstation-5": c(
    [
      "What makes the PS5 faster?",
      "A custom ultra-high-speed SSD cuts loading to a few seconds, while the ray-tracing GPU and 3D audio make games look and sound far more realistic.",
      "Are PS4 games playable?",
      "Yes — thousands of PS4 discs and downloads run on PS5, and many get higher resolution or frame-rate boosts automatically.",
      "How much can I store?",
      "The internal SSD holds a dozen large games, and you can expand it with a standard M.2 NVMe drive or play from an external USB drive.",
      "Does it support 4K and 120fps?",
      "It outputs 4K at up to 120fps on supported TVs, plus HDR for brighter highlights and deeper colour.",
      "What comes in the box?",
      "The console, one DualSense wireless controller, base, HDMI 2.1 cable, power cable and the pre-installed Astro's Playroom.",
    ],
    [
      "Lightning-fast custom SSD loading",
      "Ray tracing and 4K visuals at up to 120fps",
      "DualSense controller with haptic feedback and adaptive triggers",
      "Backwards compatible with most PS4 titles",
      "3D audio for supported headsets",
    ],
    [
      "Connect HDMI to a 4K TV and plug in the power cable",
      "Pair the DualSense controller over USB",
      "Sign in to PlayStation Network and restore your library",
      "Update the system software before installing games",
      "Enable rest mode for background downloads",
    ]
  ),

  "xbox-series-x": c(
    [
      "How powerful is the Xbox Series X?",
      "12 teraflops of GPU power, a fast custom SSD and a 12-core CPU deliver native 4K gaming at up to 120fps with almost no loading screens.",
      "Is it backwards compatible?",
      "Thousands of Xbox One, 360 and original Xbox games run on it, many with improved resolution and faster load times.",
      "How big is the internal drive?",
      "The 1TB SSD leaves roughly 800GB usable, and the expansion slot accepts a Seagate Storage Expansion Card.",
      "Does it support Game Pass?",
      "Yes — Xbox Game Pass gives you hundreds of games on day one, playable on console, PC and cloud.",
      "Is it quiet?",
      "A large vapour-chamber cooler and single 130mm fan keep it surprisingly quiet even under heavy load.",
    ],
    [
      "Native 4K gaming at up to 120fps",
      "1TB ultra-fast custom SSD",
      "Backwards compatible across three generations",
      "Quick Resume switches between games instantly",
      "Smart Delivery gives you the best version automatically",
    ],
    [
      "Place it upright with clear space around the vents",
      "Connect HDMI 2.1 to your TV's gaming port",
      "Sign in to your Microsoft account and restore saves",
      "Update the console before your first session",
      "Enable Instant-on so updates download overnight",
    ]
  ),

  // ── Fashion ────────────────────────────────────────────────────────────────
  "mens-slim-fit-denim-jacket": c(
    [
      "How does this jacket fit?",
      "It is cut slim through the chest and shoulders with a little stretch, so it skims the body without pulling when you reach or layer up.",
      "What is the denim made from?",
      "A mid-weight cotton blend with a touch of elastane gives authentic denim feel while keeping movement comfortable all day.",
      "Can I wear it across seasons?",
      "Yes — wear it over a t-shirt in spring or layer a hoodie underneath through autumn; the washed finish goes with almost anything.",
      "How should I wash it?",
      "Machine wash cold inside out and hang dry to preserve the colour, stitching and shape.",
      "What sizes are available?",
      "It is available from S to XXL — check the size chart for chest and length measurements before ordering.",
    ],
    [
      "Modern slim fit with comfortable stretch",
      "Durable mid-weight denim",
      "Classic button front and chest pockets",
      "Versatile wash that pairs with any colour",
      "Machine washable and easy to care for",
    ],
    [
      "Wash once before first wear to remove factory finish",
      "Pair with a plain tee or a slim shirt",
      "Layer a hoodie underneath in colder weather",
      "Machine wash cold, inside out, with similar colours",
      "Hang dry to keep the fit and colour",
    ]
  ),

  "womens-floral-summer-dress": c(
    [
      "What does the fabric feel like?",
      "A lightweight woven rayon that breathes easily and drapes softly, so you stay cool even on humid afternoons.",
      "Is it lined?",
      "Yes, the bodice is lined for modesty while the skirt stays airy and flowy for movement.",
      "Where can I wear it?",
      "Beach trips, brunch, garden parties or holidays — dress it up with heels or keep it casual with sandals.",
      "How do I care for it?",
      "Machine wash on a gentle cycle in a laundry bag and line dry; the print stays bright wash after wash.",
      "What lengths are available?",
      "The midi length hits around the knee and calf depending on height; refer to the size chart for exact measurements.",
    ],
    [
      "Breathable, lightweight summer fabric",
      "Floral print that does not fade easily",
      "Flattering A-line silhouette",
      "Lined bodice for comfortable coverage",
      "Packable and wrinkle resistant for travel",
    ],
    [
      "Machine wash gentle in a laundry bag",
      "Line dry in shade to protect the colours",
      "Steam or lightly iron on low heat",
      "Pair with sandals for day or heels for evening",
      "Add a denim jacket for cooler nights",
    ]
  ),

  "running-sneakers": c(
    [
      "What kind of runner is this for?",
      "Everyday road runners and gym-goers — the cushioned midsole absorbs impact on pavement while staying responsive for intervals.",
      "Are they good for wide feet?",
      "The engineered mesh upper stretches with your foot, and the roomy toe box lets toes splay naturally as you land.",
      "How much support do they give?",
      "A molded heel counter locks your foot in place and the arch contour guides your stride to reduce fatigue.",
      "Can I use them for walking all day?",
      "Absolutely — the lightweight build and shock-absorbing sole make them comfortable for long shifts on your feet.",
      "How do I clean them?",
      "Wipe the upper with a damp cloth and mild soap, and always air dry away from direct heat.",
    ],
    [
      "Shock-absorbing cushioned midsole",
      "Breathable engineered mesh upper",
      "Lightweight — around 250g per shoe",
      "Non-slip rubber outsole with flex grooves",
      "Supportive heel counter for a locked-in fit",
    ],
    [
      "Wear with your usual running socks for fit",
      "Lace snugly but leave room across the toes",
      "Break in over short walks for the first week",
      "Air dry after every run to control odour",
      "Replace after roughly 600-800km of use",
    ]
  ),

  "leather-crossbody-bag": c(
    [
      "Is the leather genuine?",
      "Yes — full-grain leather that develops a rich patina over time, paired with durable lining and solid metal fittings.",
      "How much can it hold?",
      "Fits a phone, wallet, keys, sunglasses and a small notebook, with an inner zip pocket for cards and a slip pocket at the back.",
      "Is it comfortable to wear?",
      "The adjustable strap lets you wear it crossbody or on one shoulder, and the slim profile sits flat against your body.",
      "Will it fit a tablet?",
      "It comfortably fits phones and small tablets up to 8 inches; larger devices need a dedicated sleeve.",
      "How do I care for leather?",
      "Condition 2-3 times a year and keep it away from prolonged damp or direct sunlight.",
    ],
    [
      "Full-grain genuine leather",
      "Adjustable crossbody strap",
      "Secure zip and slip pockets",
      "Solid metal hardware",
      "Soft, durable interior lining",
    ],
    [
      "Wipe with a dry, soft cloth after use",
      "Apply leather conditioner every few months",
      "Stuff with paper when storing to keep shape",
      "Keep away from direct sun and humidity",
      "Carry across the body for pickpocket protection while travelling",
    ]
  ),

  "sterling-silver-necklace": c(
    [
      "What material is the necklace?",
      "925 sterling silver with a polished finish and a hypoallergenic clasp, so it is safe for sensitive skin.",
      "Will it tarnish?",
      "Sterling silver can dull with time, but storing it dry and using the included polishing cloth keeps it bright for years.",
      "What is the chain length?",
      "The adjustable chain sits at 40-45cm, resting just below the collarbone; extenders are available for longer styles.",
      "Can I wear it every day?",
      "Yes — remove it before swimming, showering or applying perfume to protect the shine.",
      "Does it come gift ready?",
      "It arrives in a jewellery box with a gift pouch, ready to give for birthdays, anniversaries or weddings.",
    ],
    [
      "Hallmarked 925 sterling silver",
      "Hypoallergenic and nickel free",
      "Adjustable chain with secure clasp",
      "Polished pendant with fine detailing",
      "Presented in a gift box",
    ],
    [
      "Fasten the clasp using a mirror for the first time",
      "Put it on after perfume and lotion have dried",
      "Polish gently with the supplied cloth",
      "Store in the pouch provided to prevent scratches",
      "Remove before swimming and showering",
    ]
  ),

  // ── Home & Kitchen ─────────────────────────────────────────────────────────
  "3-seater-fabric-sofa": c(
    [
      "How many people does it seat?",
      "Three adults comfortably, with deep seats and high armrests that make it suitable for movie nights and long conversations.",
      "What is the frame made from?",
      "A solid wood frame on sinuous springs supports the high-density foam cushions, so the seat keeps its shape for years.",
      "Is the cover removable?",
      "Yes — the seat and back covers unzip for machine washing, which makes family life far easier.",
      "How firm is it?",
      "Medium-firm: supportive enough to sit upright, soft enough to nap on.",
      "Does it come assembled?",
      "It arrives 90% assembled — you only attach the legs and arms with the supplied tools, about 15 minutes.",
    ],
    [
      "Solid wood frame with sinuous spring support",
      "High-density foam that retains its shape",
      "Removable, machine-washable covers",
      "Seats three adults comfortably",
      "Quick 15-minute assembly",
    ],
    [
      "Assemble the legs and arms on a soft surface",
      "Vacuum the fabric weekly to keep it fresh",
      "Spot clean spills immediately with a damp cloth",
      "Wash covers on a cold gentle cycle",
      "Rotate the cushions monthly for even wear",
    ]
  ),

  "stand-mixer": c(
    [
      "What can it mix?",
      "Bread dough, cake batter, whipped cream, meringues and cookie dough — the planetary action reaches every part of the bowl.",
      "How powerful is the motor?",
      "The 1000W motor handles heavy yeast doughs without straining, and the speeds stay consistent under load.",
      "What attachments are included?",
      "A flat beater for general mixing, a dough hook for bread and a wire whisk for creams and eggs.",
      "Is the bowl big enough for batches?",
      "The 5-litre stainless bowl makes up to 2kg of dough or batter in one go — enough for two loaves or a full cake.",
      "Is it easy to clean?",
      "Attachments are dishwasher safe and the bowl wipes clean in seconds; the head tilts back for easy access.",
    ],
    [
      "1000W motor for heavy doughs",
      "Planetary mixing action for even results",
      "5-litre stainless steel bowl",
      "Three included attachments",
      "Six speeds plus pulse control",
    ],
    [
      "Place on a stable, dry counter before use",
      "Attach the bowl by twisting it to lock",
      "Start on a low speed, then increase gradually",
      "Unplug before scraping down the bowl",
      "Wash attachments promptly after use",
    ]
  ),

  "wall-art-canvas-set": c(
    [
      "What do I get in the set?",
      "Three coordinated canvas panels with abstract art printed on durable canvas and stretched over wooden frames.",
      "How big is each panel?",
      "Each panel measures 40 x 30cm, so the full set covers a large living-room or bedroom wall.",
      "Do I need frames?",
      "No — they arrive gallery wrapped and ready to hang, with hooks fixed on the back.",
      "Will the colours fade?",
      "The prints use fade-resistant inks rated for years of indoor display away from direct sunlight.",
      "How do I hang them?",
      "Use the pre-attached hooks with the supplied nails; space the panels about 2-3cm apart for the best effect.",
    ],
    [
      "Set of three coordinated abstract panels",
      "Gallery-wrapped canvas on wooden frames",
      "Fade-resistant, vibrant print quality",
      "Ready to hang with pre-attached hooks",
      "Lightweight and easy to rearrange",
    ],
    [
      "Decide the layout on the floor first",
      "Mark hook positions with a pencil",
      "Hang the centre panel first, then the sides",
      "Keep 2-3cm between panels",
      "Dust gently with a dry cloth",
    ]
  ),

  "egyptian-cotton-bedsheet-set": c(
    [
      "What makes Egyptian cotton better?",
      "Its extra-long fibres produce finer, stronger yarn, so the fabric feels smoother and stays soft through hundreds of washes.",
      "What is included in the set?",
      "One flat sheet, one fitted sheet and two pillowcases in a queen size that fits mattresses up to 30cm deep.",
      "Does it sleep cool?",
      "Yes — the 400 thread count weave breathes well, wicking moisture so you stay comfortable in summer and warm in winter.",
      "Will it shrink?",
      "Pre-shrunk fabric holds its size when washed cold and line dried as recommended.",
      "What colours are available?",
      "Neutral tones that coordinate with most bedrooms — see the colour selector for current stock.",
    ],
    [
      "Authentic 400 thread count Egyptian cotton",
      "Silky-smooth, gets softer with every wash",
      "Breathable and moisture wicking",
      "Deep fitted sheet fits mattresses up to 30cm",
      "Pre-shrunk for a lasting fit",
    ],
    [
      "Machine wash separately on first use",
      "Wash cold on a gentle cycle",
      "Line dry or tumble dry on low",
      "Remove promptly to limit wrinkles",
      "Avoid bleach to protect the fibres",
    ]
  ),

  // ── Beauty & Personal Care ────────────────────────────────────────────────
  "vitamin-c-serum": c(
    [
      "Why is a Vitamin C serum important?",
      "A Vitamin C serum brightens dull skin, fades dark spots and defends against pollution and UV damage, making it the most reliable daytime antioxidant step.",
      "Is it suitable for all skin types?",
      "Yes, it is lightweight and non-greasy for normal, dry, combination and oily skin, including sensitive skin when introduced slowly.",
      "How does it work with my routine?",
      "Apply after cleansing and before moisturiser so the active ingredient reaches the skin directly, then always finish with SPF.",
      "When will I see results?",
      "Most people notice brighter, more even skin within 4-6 weeks of consistent morning use.",
      "How should I store it?",
      "Keep the amber bottle away from sunlight and heat — Vitamin C oxidises and loses potency when exposed to air.",
    ],
    [
      "20% stabilised Vitamin C for visible brightness",
      "Fades dark spots and evens skin tone",
      "Antioxidant defence against pollution",
      "Lightweight, non-sticky texture",
      "Suitable for all skin types",
    ],
    [
      "Cleanse and pat the skin slightly damp",
      "Apply 3-4 drops to face and neck",
      "Press gently — do not rub",
      "Follow with moisturiser",
      "Finish with SPF 30+ every morning",
    ]
  ),

  "matte-liquid-lipstick-set": c(
    [
      "How long does the colour last?",
      "The transfer-resistant formula stays vivid for up to 8 hours through coffee, meals and conversation without flaking.",
      "Is matte lipstick drying?",
      "This formula conditions with vitamin E and jojoba oil, so it feels comfortable and flexible instead of tight or cracked.",
      "How many shades do I get?",
      "Six wearable shades — from everyday nudes to classic reds — suitable for office, day wear and evenings out.",
      "Does it come off easily?",
      "It removes cleanly with an oil-based makeup remover or micellar water without harsh scrubbing.",
      "Is it safe for sensitive lips?",
      "It is dermatologically tested, paraben free and never tested on animals.",
    ],
    [
      "Up to 8-hour staying power",
      "Transfer-resistant matte finish",
      "Enriched with vitamin E and jojoba oil",
      "Six versatile shades in one set",
      "Cruelty free and paraben free",
    ],
    [
      "Exfoliate and balm the lips beforehand",
      "Outline with the applicator tip",
      "Fill in the centre and press lips together",
      "Blot once for extra longevity",
      "Remove with an oil-based cleanser",
    ]
  ),

  "argan-oil-hair-serum": c(
    [
      "What does argan oil do for hair?",
      "It smooths the cuticle to kill frizz, adds shine and protects against heat styling, without leaving hair greasy or heavy.",
      "Is it suitable for all hair types?",
      "Yes — fine, thick, curly, colour-treated and chemically treated hair all benefit from a small amount.",
      "How do I use it without weighing hair down?",
      "One or two pumps on damp mid-lengths and ends is enough; avoid the roots.",
      "Can I use it before heat styling?",
      "Absolutely — apply before blow-drying or straightening for up to 230°C heat protection.",
      "Will it make my hair oily?",
      "No — the lightweight, fast-absorbing formula leaves a soft finish rather than a residue.",
    ],
    [
      "Tames frizz and adds mirror-like shine",
      "Protects hair from heat up to 230°C",
      "Nourishes dry, damaged and colour-treated hair",
      "Lightweight and non-greasy",
      "Speeds up blow-drying time",
    ],
    [
      "Rub 1-2 pumps between your palms",
      "Apply to damp mid-lengths and ends",
      "Comb through for even distribution",
      "Style as usual or air dry",
      "Use a little on dry ends between washes",
    ]
  ),

  "eau-de-parfum-amber-rose": c(
    [
      "What does it smell like?",
      "A warm amber base with a heart of rose and a whisper of vanilla — floral at first spray, deeper and muskier as it settles.",
      "How long does the fragrance last?",
      "An Eau de Parfum concentration gives 6-8 hours on skin and even longer on fabric.",
      "When should I apply it?",
      "Spray on pulse points — wrists, neck and behind the ears — after moisturising for the longest wear.",
      "Is it suitable for day and night?",
      "Yes — light enough for the office yet rich enough for evenings and special occasions.",
      "How do I store perfume?",
      "Keep the bottle in its box, away from sunlight and temperature swings, to preserve the scent for years.",
    ],
    [
      "Rich amber, rose and vanilla composition",
      "6-8 hours of lasting wear",
      "Versatile day-to-night scent",
      "Elegant 50ml bottle with fine mist",
      "Cruelty free",
    ],
    [
      "Moisturise skin before spraying",
      "Apply to wrists and neck pulse points",
      "Do not rub — let it dry naturally",
      "Mist lightly on clothes for longer wear",
      "Store boxed, away from sunlight",
    ]
  ),

  // ── Sports & Outdoors ──────────────────────────────────────────────────────
  "adjustable-dumbbell-set": c(
    [
      "What weights are included?",
      "Each dumbbell adjusts from 5kg to 25kg in 5kg steps, replacing an entire rack of weights in one pair.",
      "How does the adjustment work?",
      "Turn the dial to your chosen weight — only the selected plates lift with you, so transitions between exercises take seconds.",
      "Is it safe to use alone?",
      "Yes, the locking mechanism secures the plates before they leave the floor, and the handle has a knurled grip for control.",
      "Can two people train together?",
      "The pair covers most exercises for one person; couples can alternate sets or buy a second set for superset work.",
      "Does it damage floors?",
      "Rubber-coated plates and a compact footprint protect most surfaces — use a mat for extra peace of mind.",
    ],
    [
      "Replaces a full rack of dumbbells",
      "5kg to 25kg per dumbbell",
      "One-dial weight adjustment",
      "Space-saving compact design",
      "Knurled non-slip grip",
    ],
    [
      "Place on a flat surface or exercise mat",
      "Turn the dial until the weight clicks into place",
      "Check the plates are locked before lifting",
      "Use a spotter for heavy sets",
      "Wipe the handles after sweaty sessions",
    ]
  ),

  "4-person-camping-tent": c(
    [
      "How many people fit comfortably?",
      "Four adults with sleeping mats, or two adults with gear and a dog; the centre height lets most people sit up.",
      "Is it genuinely waterproof?",
      "The rainfly carries a 3000mm waterproof rating with taped seams and a raised door sill to keep ground water out.",
      "How long does setup take?",
      "About 10 minutes solo — the fibreglass poles clip on and the rainfly goes over the top.",
      "Does it ventilate well?",
      "Mesh panels on the roof and sides reduce condensation while keeping insects out.",
      "Can it handle wind?",
      "Fibreglass poles with aluminium stakes and guy lines keep it stable in moderate wind when properly pegged.",
    ],
    [
      "Sleeps four adults",
      "3000mm waterproof rainfly with taped seams",
      "About 10-minute setup",
      "Mesh ceiling for ventilation and star gazing",
      "Compact carry bag for transport",
    ],
    [
      "Clear and level the ground before pitching",
      "Insert poles and clip the inner tent",
      "Drape the rainfly and secure the corners",
      "Peg all corners and tension the guy lines",
      "Dry the tent completely before packing away",
    ]
  ),

  "mountain-bike-21-speed": c(
    [
      "What terrain is this bike for?",
      "Mixed trails, gravel and city roads — the suspension fork and wide knurled tyres soak up bumps while rolling efficiently on tarmac.",
      "How do the gears perform?",
      "21-speed Shimano-style gearing gives low ratios for climbs and enough top end for fast descents.",
      "Is it suitable for beginners?",
      "Yes — the geometry is stable and confidence-inspiring, and the components are simple to adjust as you learn.",
      "What rider height does it fit?",
      "The medium frame suits riders around 5'4\" to 5'11\"; the saddle height adjusts for precise fitting.",
      "Does it need assembly?",
      "Around 85% assembled — attach the front wheel, handlebar, saddle and pedals with the supplied tools.",
    ],
    [
      "21-speed gearing for hills and flats",
      "Front suspension fork absorbs trail bumps",
      "Front and rear disc brakes for all-weather stopping",
      "Durable steel/alloy frame",
      "85% pre-assembled for quick setup",
    ],
    [
      "Attach the front wheel and tighten the axle",
      "Fit the handlebar and saddle at hip height",
      "Check brakes and gear shifting before riding",
      "Inflate tyres to 35-50 PSI",
      "Service gears and brakes every few months",
    ]
  ),

  // ── Books ──────────────────────────────────────────────────────────────────
  "the-midnight-library": c(
    [
      "What is the book about?",
      "Between life and death sits a library where every book offers a chance to try another life — the choices you did not make, the paths you did not take.",
      "Who is it written for?",
      "Readers who enjoy thoughtful, uplifting fiction with a touch of magical realism, and anyone facing a crossroads.",
      "How long does it take to read?",
      "Around 5-6 hours — most readers finish it in two or three sittings.",
      "Is it part of a series?",
      "No, it is a standalone novel, so you can start and finish it on its own.",
      "Does it come in good condition?",
      "Yes — brand new paperback with a crisp cover and clean, unread pages.",
    ],
    [
      "Internationally bestselling standalone novel",
      "Compact paperback, easy to carry",
      "Readable, engaging prose",
      "Perfect gift for fiction lovers",
      "Brand new, undamaged copy",
    ],
    [
      "Find a quiet spot and settle in",
      "Read a few chapters to meet Nora",
      "Pause and reflect on your own 'what ifs'",
      "Keep away from moisture to protect the spine",
      "Store upright on a shelf away from direct sun",
    ]
  ),

  "atomic-habits": c(
    [
      "What will I learn?",
      "A practical system for building good habits and breaking bad ones using tiny, one-percent improvements that compound over time.",
      "Is it just theory?",
      "No — every chapter ends with concrete steps, checklists and experiments you can apply the same day.",
      "How long does it take to read?",
      "About 4-5 hours, with chapters short enough for a commute.",
      "Does it work for fitness, work and study?",
      "Yes — the four laws apply to any habit, from morning workouts to focused study sessions.",
      "Is it suitable for beginners?",
      "Absolutely, no prior knowledge of psychology is needed; seasoned readers still find the frameworks useful.",
    ],
    [
      "Proven four-law system for habits",
      "Actionable steps in every chapter",
      "Applies to health, work and learning",
      "Clear, engaging writing style",
      "Ideal for self-improvement reading lists",
    ],
    [
      "Read one chapter per day",
      "Write down the habit you want to build",
      "Make it obvious, attractive, easy and satisfying",
      "Track your progress weekly",
      "Reread the summary chapters after a month",
    ]
  ),

  "introduction-to-algorithms": c(
    [
      "Who is this textbook for?",
      "Computer science students, competitive programmers and engineers who want a rigorous foundation in algorithms and data structures.",
      "What topics does it cover?",
      "Sorting, graph algorithms, dynamic programming, greedy methods, complexity theory, hashing, trees and more.",
      "Is it suitable for self-study?",
      "Yes — each chapter builds steadily with worked examples and end-of-chapter problems of increasing difficulty.",
      "Which edition is this?",
      "The latest edition with updated chapters, corrected exercises and modern algorithmic coverage.",
      "Do I need strong maths background?",
      "Basic discrete mathematics and programming experience are enough to follow the derivations.",
    ],
    [
      "Comprehensive coverage of classic algorithms",
      "Rigorous yet readable explanations",
      "Hundreds of practice exercises",
      "Essential reference for interviews and exams",
      "Durable hardcover built for years of use",
    ],
    [
      "Skim the chapter intro before deep reading",
      "Work through each example with pen and paper",
      "Implement at least one algorithm per chapter",
      "Attempt the exercises without looking at solutions",
      "Revisit difficult sections after a week",
    ]
  ),

  // ── Toys & Games ───────────────────────────────────────────────────────────
  "superhero-action-figure-set": c(
    [
      "What is included in the set?",
      "Four poseable superhero figures with fabric capes and detailed sculpting, each around 15cm tall.",
      "Are the joints durable?",
      "Yes — the figures have articulated heads, arms and legs that hold poses through repeated play.",
      "What ages is it suitable for?",
      "Recommended for ages 6 and up; younger children should play with an adult due to small parts.",
      "Can the figures stand on their own?",
      "They stand securely on flat surfaces, and the wide feet help balance during display.",
      "Is it a good gift?",
      "It arrives in a colourful display box, ready for birthdays, holidays and stocking fillers.",
    ],
    [
      "Four detailed 15cm figures",
      "Multiple articulation points",
      "Fabric capes and accessories",
      "Collectible display box",
      "Made from non-toxic materials",
    ],
    [
      "Open on a clean, dry surface",
      "Move joints gently to avoid stress marks",
      "Stand figures on a flat, stable base",
      "Wipe with a dry cloth to clean",
      "Store in the box when not on display",
    ]
  ),

  "strategy-board-game-settlers": c(
    [
      "How many people can play?",
      "Three to four players, with an expansion-friendly design that scales well at either count.",
      "How long does a game take?",
      "Around 60-90 minutes once players know the rules; the first game usually takes closer to two hours.",
      "Is it good for beginners?",
      "Yes — the rules take 10 minutes to learn and the strategy deepens with every game.",
      "What skills does it build?",
      "Resource management, negotiation, probability awareness and forward planning.",
      "Is it family friendly?",
      "Absolutely — suitable for ages 10 and up with no reading-heavy cards.",
    ],
    [
      "Classic resource-trading strategy gameplay",
      "3-4 players in 60-90 minutes",
      "Family friendly from age 10",
      "High replayability with a modular board",
      "Durable wooden pieces and thick cards",
    ],
    [
      "Build the board randomly each game",
      "Each player picks a colour and pieces",
      "Place two settlements and roads to start",
      "Roll, trade and build in turn order",
      "First to 10 points wins",
    ]
  ),

  "wooden-educational-puzzle-set": c(
    [
      "What skills does it teach?",
      "Shape recognition, colour matching, fine motor control and early problem solving — all through play.",
      "What ages is it appropriate for?",
      "Designed for ages 2-5, with chunky pieces that are easy for small hands to grip.",
      "What is it made from?",
      "Smooth, sanded solid wood finished with non-toxic, water-based paints.",
      "Are the pieces a choking hazard?",
      "Pieces are sized well above choking standards, but adult supervision is still recommended for toddlers.",
      "How do I clean it?",
      "Wipe with a damp cloth — the sealed finish resists moisture and stickers.",
    ],
    [
      "Encourages fine motor development",
      "Teaches shapes, colours and counting",
      "Chunky, toddler-friendly pieces",
      "Non-toxic water-based paint",
      "Sturdy wooden storage tray",
    ],
    [
      "Place on a flat table or play mat",
      "Name colours and shapes as you play",
      "Start with single shapes, then combine",
      "Wipe clean after each use",
      "Store pieces in the tray to keep sets complete",
    ]
  ),

  // ── Automotive ─────────────────────────────────────────────────────────────
  "car-phone-mount-charger": c(
    [
      "Does it charge my phone fast?",
      "Yes — 15W wireless charging tops up compatible phones quickly while they stay firmly mounted for navigation.",
      "Will it hold my phone over bumps?",
      "The auto-clamping arms grip securely and the shock-absorbing pad keeps the phone steady on rough roads.",
      "Where can I install it?",
      "On the air vent or dashboard — the suction and clip options both hold firmly in heat and cold.",
      "Does it work with a case?",
      "Charges through cases up to 5mm thick, as long as the case is not metal-backed.",
      "Is my phone safe in summer heat?",
      "Built-in protection stops overheating, and the mount holds the phone away from direct vent air when cooling.",
    ],
    [
      "15W fast wireless charging",
      "Auto-clamping secure grip",
      "Vent and dashboard mounting",
      "Works with cases up to 5mm",
      "Overheat and short-circuit protection",
    ],
    [
      "Fix the mount on the vent or dash",
      "Adjust the arm angle for easy viewing",
      "Place the phone — arms clamp automatically",
      "Connect the USB-C power cable",
      "Enable battery optimisation for long drives",
    ]
  ),

  "full-face-motorbike-helmet": c(
    [
      "Is this helmet road legal?",
      "Yes — it meets DOT/ECE impact-safety standards with a reinforced shell and energy-absorbing EPS liner.",
      "How good is visibility?",
      "The wide anti-fog visor gives a clear panoramic view and can be swapped quickly for a tinted one.",
      "Is it comfortable on long rides?",
      "Removable, washable padding and a snug cheek fit keep it stable and comfortable for hours.",
      "Does it reduce wind noise?",
      "The aerodynamic shell and sealed visor cut wind roar, so you arrive less fatigued.",
      "How do I choose a size?",
      "Measure your head circumference just above the eyebrows and match the size chart — a snug fit with no pressure points is correct.",
    ],
    [
      "DOT/ECE certified impact protection",
      "Anti-fog, scratch-resistant visor",
      "Removable washable padding",
      "Aerodynamic, low-noise shell",
      "Quick-release chin strap",
    ],
    [
      "Measure your head and check the size chart",
      "Fasten the strap with two fingers of clearance",
      "Break in the padding over short rides",
      "Open the visor in rain briefly to clear mist",
      "Wipe the visor with a soft cloth only",
    ]
  ),

  // ── Grocery ────────────────────────────────────────────────────────────────
  "assorted-namkeen-snack-pack": c(
    [
      "What snacks are inside?",
      "Five assorted savoury Indian favourites — sev, mixture, bhujia and spiced bites — in individual freshness-sealed packs.",
      "Is it fresh?",
      "Each pack is nitrogen flushed and dated, so the crunch stays until you open it.",
      "How spicy is it?",
      "Medium spice — enjoyable on its own with chai, or used as a crunchy topping on salads and chaat.",
      "How long does it keep?",
      "Sealed packs stay fresh for up to 6 months in a cool, dry place; finish within a week of opening.",
      "Is it vegetarian?",
      "Yes — 100% vegetarian ingredients with no added palm oil.",
    ],
    [
      "Five individual freshness-sealed packs",
      "Authentic Indian savoury flavours",
      "Crisp texture that lasts",
      "100% vegetarian ingredients",
      "Perfect with chai or as a topping",
    ],
    [
      "Store in a cool, dry place away from sun",
      "Reseal any opened pack tightly",
      "Enjoy as a tea-time snack",
      "Sprinkle over chaat, salads or yogurt",
      "Consume within a week of opening",
    ]
  ),

  "organic-green-tea-box": c(
    [
      "What are the health benefits?",
      "Green tea is rich in antioxidants that support metabolism, focus and heart health, without the crash of strong coffee.",
      "How does it taste?",
      "Light, clean and slightly grassy with no bitterness when brewed correctly at the right temperature.",
      "How many cups per box?",
      "100 individually wrapped bags — around three months of one cup a day.",
      "Is it caffeinated?",
      "Yes, gently — about a third of a cup of coffee, so it is fine for afternoon drinking.",
      "Is the tea organic?",
      "The leaves are organically grown without synthetic pesticides or fertilisers.",
    ],
    [
      "100 individually wrapped tea bags",
      "Organically grown tea leaves",
      "Naturally rich in antioxidants",
      "Low caffeine for all-day drinking",
      "Resealable freshness box",
    ],
    [
      "Boil water and let it cool to about 80°C",
      "Steep the bag for 2-3 minutes",
      "Remove the bag to avoid bitterness",
      "Enjoy plain or with a little honey",
      "Store the box in a dry cupboard",
    ]
  ),

  "basmati-rice-5kg": c(
    [
      "What makes this basmati special?",
      "Long-grain aged basmati that doubles in length when cooked, stays fluffy and never turns sticky.",
      "How much does it yield?",
      "A 5kg pack makes around 15kg of cooked rice — plenty for a family through the month.",
      "How do I cook it perfectly?",
      "Rinse until the water runs clear, soak for 20 minutes, then cook with 1.5 cups water per cup of rice.",
      "Is it aged?",
      "Yes — the grains are aged to deepen the aroma and improve texture after cooking.",
      "How should I store it?",
      "Transfer to an airtight container in a cool, dry place to keep moisture and pests away.",
    ],
    [
      "Extra-long aromatic grains",
      "Aged for superior flavour",
      "Fluffy, non-sticky texture",
      "5kg family-size pack",
      "Ideal for biryani, pulao and daily meals",
    ],
    [
      "Rinse the rice until water runs clear",
      "Soak for 20 minutes before cooking",
      "Use 1.5 cups water per cup of rice",
      "Steam with the lid on for 12-15 minutes",
      "Store in an airtight container",
    ]
  ),

  // ── Health & Wellness ──────────────────────────────────────────────────────
  "whey-protein-powder-2kg": c(
    [
      "Who should take whey protein?",
      "Anyone who struggles to hit daily protein goals — gym-goers, runners and busy professionals who need a quick, complete protein source.",
      "When is the best time to drink it?",
      "Within an hour after training, or as a breakfast or snack shake when protein is low.",
      "How do I mix it?",
      "One scoop in 250ml water, milk or a smoothie — it dissolves smoothly with no clumps in a shaker.",
      "Will it make me gain weight?",
      "It supports lean muscle when combined with training; on its own it is only ~120 calories per serve.",
      "Does it contain added sugar?",
      "No added sugar — lightly sweetened with stevia and cocoa flavouring for the chocolate variant.",
    ],
    [
      "24g protein per serving",
      "Supports muscle recovery and growth",
      "Rich in BCAAs and glutamine",
      "No added sugar",
      "Mixes smoothly without clumps",
    ],
    [
      "Add one scoop to 250ml liquid",
      "Shake for 10-15 seconds",
      "Drink within 30 minutes after training",
      "Store in a cool, dry place with the lid sealed",
      "Keep the scoop dry to prevent clumping",
    ]
  ),

  "digital-blood-pressure-monitor": c(
    [
      "How accurate is it?",
      "Clinically validated upper-arm measurement with irregular-heartbeat detection, accurate to within a few mmHg of a clinic reading.",
      "Is it easy to use at home?",
      "One button, automatic inflation and a large backlit display — anyone can take a reading in 30 seconds.",
      "Does it store past readings?",
      "The memory keeps separate logs for two users, so you can track trends over time and share them with your doctor.",
      "What arm size does it fit?",
      "The cuff fits arms from 22 to 32cm; measure around the bicep to confirm fit.",
      "How is it powered?",
      "Four AAA batteries or the included USB cable, with an auto power-off to save battery.",
    ],
    [
      "Clinically validated one-touch operation",
      "Large backlit display for easy reading",
      "Two-user memory with timestamps",
      "Irregular heartbeat detection",
      "Cuff fits 22-32cm arms",
    ],
    [
      "Sit quietly for 5 minutes before measuring",
      "Wrap the cuff on bare upper arm at heart level",
      "Press START and stay still and silent",
      "Record readings at the same time each day",
      "Replace batteries when the low-power icon appears",
    ]
  ),
};
