import { PreloadedQA } from '../types';

export const PRELOADED_QA: PreloadedQA[] = [
  {
    id: 'qa-tomato-wilting',
    keywords: [
      'thakkali chedi vadiruchu',
      'thakkali vadiruchu',
      'vadiruchu',
      'vadipochu',
      'chedi vadiruchu',
      'thakkali vadipochu',
      'enna pannradhu',
      'thakkali',
      'tomato wilt',
      'wilting',
      'வாடிருச்சு',
      'தக்காளி வாடல்',
      'வாடிவிட்டது',
    ],
    cropTag: 'tomato',
    questionEn: 'Tomato plants are wilting, what should I do?',
    questionTa: 'தக்காளி செடி வாடிவிட்டது என்ன செய்வது?',
    questionTanglish: 'Thakkali chedi vadiruchu enna pannradhu?',
    answerTanglish: `🍅 **Thakkali Chedi Vaduvadhu (Wilting) - Kaaranam & Udanadi Theervu:**

1. **Kaaranam Enna (First Identify the Cause):**
   - **Bacterial Wilt (Vadal Noi):** Pagal nerathula nalla pachaiyave irundhu thideernu vadidum, ilai manjalaaga maaradhu. Thandodu keezh pagudhi puzhungina maari azhugi irukkum.
   - **Root Rot / Ver Azhugal:** Adhiga thanneer thenginaal fungal thakkudhal vandhu ver azhugi vadum.
   - **Ver Mudichu (Nematode):** Ver-la urundai mudichu irundha sathu mela pogaama chedi vadum.

2. **Udanadi Theervu (Action Steps):**
   - **Thanneer Thenga Koodadhu:** Paasanam kuraiyunga. Thakkali-ku seriyaana vadikaal irukka vendum.
   - **Biocontrol Ver Drenching:** 1 liter thanneer-ku **Pseudomonas fluorescens 10g** + **Trichoderma viride 5g** kalandhu chediyoda ver pagudhiyila nannaga oothunga (Soil Drenching). Idhu marubadiyum spread aaguradha thadukkum.
   - **Emergency Remedy:** Copper Oxychloride (COC) 2.5 gram/liter thanneeril kalandhu verla oothunga.
   - **Badhykkapatta Chedi:** Rombave azhugina chediyai verodu pidungi veliyila theeyittu azhichudunga; illana matha chedikku paravum.

⚠️ *Mukkiya Kurippu: Marundhu adikkurathukku munnaadi local KVK or Vivasaya Extension Officer kitta alavu confirm pannunga.*`,
    answerEn: `🍅 **Tomato Plant Wilting (Bacterial Wilt & Root Rot) Management:**

1. **Identify the Cause:**
   - **Bacterial Wilt:** Plants suddenly wilt while still green without yellowing.
   - **Fungal Root Rot / Damping off:** Water stagnation rots the taproot system.
   - **Root-Knot Nematodes:** Galls/knots on roots prevent water uptake.

2. **Immediate Remedial Actions:**
   - **Drain Excess Water:** Ensure immediate field drainage. Keep soil moist but never waterlogged.
   - **Bio-Agent Drenching:** Drench root zone with **Pseudomonas fluorescens @ 10g/L** + **Trichoderma viride @ 5g/L** of water.
   - **Protective Treatment:** Drench Copper Oxychloride (COC) @ 2.5 g/L around affected stems.
   - **Rogue Out Dead Plants:** Immediately pull out and burn completely wilted plants to prevent pathogen spread to healthy rows.

⚠️ *Farmer Advisory: Verify exact dosage with your local Agricultural Officer or KVK.*`,
    answerTa: `🍅 **தக்காளி செடி வாடல் நோய் மேலாண்மை:**

1. **காரணத்தை கண்டறிதல்:**
   - **பாக்டீரியா வாடல்:** செடி பச்சையாக இருக்கும் போதே பகல் வேளையில் தொய்ந்து வாடிவிடும்.
   - **வேர் அழுகல்:** வயலில் நீர் தேங்குவதால் வேர்ப்பகுதி அழுகி செடி வாடிவிடும்.

2. **உடனடி தீர்வுகள்:**
   - நீர் தேங்காமல் வடித்து விடவும்.
   - **உயிரியல் கரைசல்:** ஒரு லிட்டர் தண்ணீருக்கு **சூடோமோனாஸ் 10 கிராம்** + **டிரைக்கோடெர்மா 5 கிராம்** கலந்து வேர்ப்பகுதியில் ஊற்றவும்.
   - தீவிரமாக இருந்தால் காப்பர் ஆக்ஸிகுளோரைடு 2.5 கிராம்/லிட்டர் கலந்து வேரில் ஊற்றவும்.
   - முற்றிலும் வாடிய செடிகளை பிடுங்கி தீயிட்டு அழிக்கவும்.

⚠️ *முக்கிய குறிப்பு: உள்ளூர் வேளாண்மை அலுவலரிடம் ஆலோசனை பெறவும்.*`,
  },
  {
    id: 'qa-paddy-stem-borer',
    keywords: [
      'paddy',
      'rice',
      'stem borer',
      'dead heart',
      'white ear',
      'kuruthupuchi',
      'nel',
      'kuruthu puchi',
      'நெல்',
      'தண்டு துளைப்பான்',
      'வெண்குருத்து',
    ],
    cropTag: 'paddy',
    questionEn: 'How to manage yellow stem borer in paddy?',
    questionTa: 'நெல்லில் மஞ்சள் தண்டு துளைப்பானை எவ்வாறு கட்டுப்படுத்துவது?',
    questionTanglish: 'Nel la kuruthupuchi thollaikku enna marundhu adikkanum?',
    answerTanglish: `🌾 **Nel-la Kuruthupuchi (Yellow Stem Borer) Kattuppeduthal:**

1. **Arikurigal (Symptoms):**
   - Thoor kattura nerathula nadu kuruthu kaaindhu "Venkuruthu" (Dead heart) varum.
   - Kadhir varum podhu manigal illadha "Venkadhir" (White ear) aagum.

2. **Iyarkai & Bio Theervu:**
   - 1 acre-ku **5 Inakavarchi Porigal (Pheromone traps)** vayal-la vachikonga.
   - Nadavu senju 30-am naal Trichogramma japonicum ottunni attai acre-ku 2 cc veedham vaaram orumurai kattunga.
   - Adhiga Urea poduradha kuraiyunga.

3. **Recommended Marundhu (If >10% thakkudhal):**
   - **Chlorantraniliprole 18.5% SC** @ 60 ml acre-ku 200 liter thanneeril kalandhu thelikkavum, OR
   - **Cartap Hydrochloride 50% SP** @ 400 gram acre-ku.

⚠️ *Mukkiya Kurippu: Local Agricultural Extension Officer or KVK kitta alavu ketu thelikkavum.*`,
    answerEn: `🌾 **Yellow Stem Borer Management in Paddy:**

1. **Scouting & Symptoms:**
   - Look for drying central shoots ("Dead hearts") during the tillering stage and empty whitish panicles ("White ears") during heading.

2. **Eco-Friendly & Biological Controls:**
   - Install sex pheromone traps @ 5 per acre to monitor moth flight activity.
   - Release the egg parasitoid *Trichogramma japonicum* @ 2 cc per acre, 3 times at weekly intervals.
   - Avoid excessive basal Nitrogen application.

3. **Recommended Field Interventions:**
   - Spray **Chlorantraniliprole 18.5% SC** @ 60 ml/acre, OR
   - **Cartap Hydrochloride 50% SP** @ 400 g/acre.

⚠️ *Farmer Advisory: Always confirm chemical dosages with your local Agricultural Officer or KVK.*`,
    answerTa: `🌾 **நெல்லில் மஞ்சள் தண்டு துளைப்பான் மேலாண்மை:**

1. **அறிகுறிகள்:**
   - தூர்க்கட்டும் பருவத்தில் நடுக்குருத்து காய்ந்து "வெண்குருத்து" தோன்றுதல் மற்றும் கதிர் பருவத்தில் தானியமற்ற "வெண்கதிர்" ஏற்படுதல்.

2. **இயற்கை & உயிரியல் கட்டுப்பாடு:**
   - ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறிகள் வைக்கவும்.
   - *டிரைக்கோகிரம்மா ஜப்பானிக்கம்* அட்டை ஏக்கருக்கு 2 சிசி வீதம் வாரம் ஒருமுறை என 3 முறை கட்டவும்.
   - அதிக யூரியாவைத் தவிர்க்கவும்.

3. **பரிந்துரைக்கப்படும் தீர்வுகள்:**
   - **குளோரான்ட்ரனிலிப்ரோல் 18.5% SC** ஏக்கருக்கு 60 மி.லி, அல்லது **கார்டாப் ஹைட்ரோகுளோரைடு 50% SP** 400 கிராம் தெளிக்கவும்.

⚠️ *முக்கிய குறிப்பு: வேளாண் அலுவலரிடம் ஆலோசனை பெறவும்.*`,
  },
  {
    id: 'qa-cotton-pink-bollworm',
    keywords: [
      'cotton',
      'pink bollworm',
      'bollworm',
      'rosette',
      'paruthi',
      'kaypuzhu',
      'kay puzhu',
      'பருத்தி',
      'காய் புழு',
      'இளஞ்சிவப்பு',
    ],
    cropTag: 'cotton',
    questionEn: 'How to control Pink Bollworm in cotton?',
    questionTa: 'பருத்தியில் இளஞ்சிவப்பு காய்ப்புழுவை எவ்வாறு கட்டுப்படுத்துவது?',
    questionTanglish: 'Paruthi-la ilansivappu kaai puzhuvai eppadi kattuppeduthuvadhu?',
    answerTanglish: `🌱 **Paruthi Kaai Puzhu (Pink Bollworm) Kattuppeduthal:**

1. **Arikurigal (Symptoms):**
   - Poo viriyama roja poo maari thirugi irukkum (Rosette flower).
   - Kaai mela thulaigal pottu, ullukulla panju-la brown stain aaidum.

2. **IPM Iyarkai Melanmai:**
   - Acre-ku **5 Gossyplure Inakavarchi porigal** vaiyunga.
   - 5% Veppankottai saaru (NSKE) or Veppenney (3 ml/L) thelithu thai poochi muttai iduvadha thadukkavum.
   - Surungina roja poo-ai kaiyala parithu theeyittu azhikkavum.

3. **Recommended Spray:**
   - **Emamectin Benzoate 5% SG** acre-ku 88-100 gram, OR
   - **Spinosad 45% SC** acre-ku 75 ml thelikkavum.

⚠️ *Mukkiya Kurippu: Local Vivasaya Officer kitta spray details verify pannunga.*`,
    answerEn: `🌱 **Pink Bollworm (PBW) Management in Cotton:**

1. **Early Signs & Scouting:**
   - Rosette flowers (petals twisted tightly like unopened rosebuds) and stained lint inside green bolls.

2. **Integrated Management:**
   - Install **Gossyplure pheromone traps** @ 5 per acre.
   - Spray **5% Neem Seed Kernel Extract (NSKE)** at square formation.
   - Handpick and safely destroy rosette flowers.

3. **Field Application:**
   - Spray **Emamectin Benzoate 5% SG** @ 88-100 g/acre, OR
   - **Spinosad 45% SC** @ 75 ml/acre.

⚠️ *Farmer Advisory: Verify recommendations with local agriculture extension workers.*`,
    answerTa: `🌱 **பருத்தியில் இளஞ்சிவப்பு காய்ப்புழு மேலாண்மை:**

1. **அறிகுறிகள்:**
   - பூக்கள் விரிவடையாமல் ரோஜா பூ போல சுருங்கி இருக்கும். காய்களில் துளைகள் மற்றும் பஞ்சில் கறை தோன்றும்.

2. **ஒருங்கிணைந்த பூச்சி மேலாண்மை:**
   - ஏக்கருக்கு 5 காஸிப்ளூர் இனக்கவர்ச்சி பொறிகள் வைக்கவும்.
   - 5% வேப்பங்கொட்டை சாறு தெளிக்கவும். சுருங்கிய பூக்களை கைகளால் பறித்து அழிக்கவும்.

3. **பரிந்துரைக்கப்படும் தெளிப்பு:**
   - **எமாமெக்டின் பென்சோயேட் 5% SG** 88-100 கிராம், அல்லது **ஸ்பைனோசட் 45% SC** 75 மி.லி தெளிக்கவும்.`,
  },
  {
    id: 'qa-tomato-leaf-curl',
    keywords: [
      'tomato',
      'leaf curl',
      'whitefly',
      'virus',
      'curling',
      'thakkali ilai suruttu',
      'ilai suruttu',
      'vellai ee',
      'தக்காளி',
      'இலைச்சுருட்டு',
      'வெள்ளை ஈ',
    ],
    cropTag: 'tomato',
    questionEn: 'How to prevent and treat Tomato Leaf Curl Virus?',
    questionTa: 'தக்காளி இலைச்சுருட்டு நோயை எவ்வாறு தடுப்பது?',
    questionTanglish: 'Thakkali ilai suruttu noi poga enna pannanum?',
    answerTanglish: `🍅 **Thakkali Ilai Suruttu Noi (Leaf Curl) Melanmai:**

1. **Noiyin Thanmai:**
   - Idhu **Vellai Eekkal (Whiteflies)** moolam dhaan paravudhu.
   - Virus noi aanaalaal chedi mela vandha pin gunamaakkuradhu kashtam; Vellai ee-ai kattuppeduthuvadhe mukkiyam.

2. **Thaduppu Muraigal:**
   - Nizhalvalai nursery-la naatru thayar pannunga.
   - Silver-Black plastic moodakku (Mulching) use pannunga.
   - Acre-ku **15 Manjal Ottum Attaigal (Yellow Sticky Traps)** kattunga.

3. **Vellai Ee Spray:**
   - 1% Veppa enney (10 ml/L) soap powder kalandhu vaaram orumurai thelikkavum.
   - Theevirama irundha: **Diafenthiuron 50% WP** 240g/acre or **Cyantraniliprole 10.26% OD** 360 ml/acre.

⚠️ *Mukkiya Kurippu: Surungina noipatta chediyai aarambathilaye pidungi azhichudunga.*`,
    answerEn: `🍅 **Tomato Leaf Curl Virus (ToLCV) Management:**

1. **Vector Control:**
   - Caused by virus spread solely by Whiteflies. Focus on vector eradication.
2. **Preventative Measures:**
   - Raise nursery under 40-mesh net.
   - Use silver-black plastic mulch. Install 15 Yellow Sticky Traps per acre.
3. **Spraying:**
   - Spray Neem oil 1% (10 ml/L) weekly.
   - Chemical: Diafenthiuron 50% WP @ 240 g/acre.`,
    answerTa: `🍅 **தக்காளி இலைச்சுருட்டு நோய் தடுப்பு முறை:**

1. **நோயின் தன்மை:**
   - வெள்ளை ஈக்கள் மூலம் பரவும் நச்சுயிரி நோய்.
2. **தடுப்பு முறைகள்:**
   - ஏக்கருக்கு 15 மஞ்சள் ஒட்டும் அட்டைகளை வைக்கவும். 1% வேப்ப எண்ணெய் வாரம் ஒருமுறை தெளிக்கவும்.
   - ரசாயன தெளிப்பு: டயாபென்தியூரான் 50% WP 240 கிராம் ஏக்கருக்கு தெளிக்கவும்.`,
  },
  {
    id: 'qa-coconut-button-shedding',
    keywords: [
      'coconut',
      'button shedding',
      'drop',
      'nuts',
      'thennai',
      'kurumbai',
      'kurumbai udhirudhu',
      'thengai',
      'தென்னை',
      'குரும்பை',
      'உதிர்தல்',
    ],
    cropTag: 'coconut',
    questionEn: 'Why are coconut buttons shedding and how to stop it?',
    questionTa: 'தென்னையில் குரும்பை உதிர்வதற்கான காரணங்கள் மற்றும் தீர்வு என்ன?',
    questionTanglish: 'Thennai-la kurumbai udhirudhu enna pannanum?',
    answerTanglish: `🥥 **Thennai-la Kurumbai Udhirvadharkana Theervu:**

1. **Mukkiya Kaaranangal:**
   - **Thanneer Patraakkurai:** Kodai-la paasanam illama dry aavadhu.
   - **Sathu Kuraipaadu:** Potash and Boron micronutrient kuraivaaga iruppadhu.
   - **Poochi / Mite:** Eriophyid spider mite thakkudhal.

2. **Udanadi Theervugal:**
   - **Vattapaathi Paasanam:** Marathukku naalukku 40-50 liter thanneer kidaikkanum. Mattai or thengai naar moodakku podunga.
   - **Borax Sathu:** Maram ondrukku varudathirku 50 gram **Borax powder** vattapaathiyila podunga.
   - **Planofix Spray:** Paalai veditha 30 mattrum 60-am naal Planofix (NAA) 1 ml-ai 4 liter thanneeril kalandhu poongothula thelikkavum.
   - **Thennai Tonic:** TNAU Coconut Tonic 200 ml + 200 ml thanneer kalandhu ver valiyaaga seluthunga.

⚠️ *Mukkiya Kurippu: Varusham thorum marathukku 2 kg Potash uram thavaraama podunga.*`,
    answerEn: `🥥 **Coconut Button Shedding Remedies:**

1. **Causes:** Moisture stress, Boron deficiency, and poor pollination.
2. **Action Plan:**
   - Ensure 40-50 liters daily water in summer. Mulch basin with fronds.
   - Apply 50g Borax per tree twice a year.
   - Spray Planofix @ 1ml in 4L water at 1 and 2 months after spathe opening.
   - Root feed TNAU Coconut tonic 200ml per palm.`,
    answerTa: `🥥 **தென்னையில் குரும்பை உதிர்வதைத் தடுக்கும் வழிகள்:**

1. மரத்திற்கு நாள் ஒன்றுக்கு 40-50 லிட்டர் நீர் பாய்ச்சவும்.
2. மரம் ஒன்றுக்கு ஆண்டுக்கு 50 கிராம் போராக்ஸ் தூள் வட்டப்பாத்தியில் இடவும்.
3. பாளை வெடித்த 30, 60-ஆம் நாளில் பிளனோபிக்ஸ் (1 மி.லி / 4 லிட்டர்) தெளிக்கவும்.`,
  },
  {
    id: 'qa-sugarcane-fertilizer-schedule',
    keywords: [
      'sugarcane',
      'fertilizer',
      'urea',
      'potash',
      'dap',
      'karumbu',
      'uram',
      'கரும்பு',
      'உர மேலாண்மை',
      'யூரியா',
    ],
    cropTag: 'sugarcane',
    questionEn: 'What is the optimal fertilizer schedule for sugarcane?',
    questionTa: 'கரும்பு சாகுபடிக்கான உகந்த உர அட்டவணை என்ன?',
    questionTanglish: 'Karumbu-kku sariyana ura schedule enna?',
    answerTanglish: `🎋 **Karumbu Ura Melanmai Schedule (Acre-ku):**

Recommended Total: **NPK 110 : 25 : 45 kg/acre**

1. **Adi Uram (Basal - Nadavu appo):**
   - Super Phosphate 155 kg muzhuvadhum podunga.
   - Urea 48 kg + 10 ton Thozhu uram + Azospirillum 2 kg.

2. **First Top Dressing (30-35 Naal):**
   - Urea 48 kg + Potash 25 kg. Lesaana paasanam pannunga.

3. **Second Top Dressing (60 Naal):**
   - Urea 72 kg (theevira thoor kattum paruvam).

4. **Third Top Dressing & Man Anaitthal (90-100 Naal):**
   - Urea 72 kg + Potash 50 kg. Uram pottu udane man anaikkavum.
   - *MUKKIYAM:* 100 naatkalukku mela Urea poda koodadhu.

⚠️ *Mukkiya Kurippu: Drip system-ku water soluble urangalai vaara thavanaiyila podalam.*`,
    answerEn: `🎋 **Sugarcane Fertilizer Schedule (Per Acre):**
- Total NPK: 110 : 25 : 45 kg/acre
- Basal: 100% Super Phosphate (155 kg) + Urea 48 kg
- 30-35 Days: Urea 48 kg + Potash 25 kg
- 60 Days: Urea 72 kg
- 90-100 Days: Urea 72 kg + Potash 50 kg + Earthing up`,
    answerTa: `🎋 **கரும்பு உர அட்டவணை (ஏக்கருக்கு):**
- மொத்தம் NPK: 110 : 25 : 45 கிலோ
- அடியுரம்: சூப்பர் பாஸ்பேட் 155 கிலோ + யூரியா 48 கிலோ
- 30-35 நாள்: யூரியா 48 கிலோ + பொட்டாஷ் 25 கிலோ
- 60 நாள்: யூரியா 72 கிலோ
- 90-100 நாள்: யூரியா 72 கிலோ + பொட்டாஷ் 50 கிலோ மற்றும் மண் அணைத்தல்`,
  },
];
