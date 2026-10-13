import { PRELOADED_QA } from '../data/preloadedQA';
import { CROPS_DATA } from '../data/cropsData';
import { OFFLINE_TIPS } from '../data/offlineTipsData';
import { Language } from '../types';

export function getSmartAgriculturalResponse(
  query: string,
  language: Language
): { reply: string; source: 'preloaded-knowledge' } {
  const qLower = query.toLowerCase().trim();
  const isTanglish =
    language === 'tanglish' ||
    /enna|pannradhu|vadiruchu|vadipochu|chedi|thakkali|puchi|poochi|uram|thanni|thanneer|vayal|marundhu|tholla|irukku|kuruthu|kurumbai/i.test(
      query
    );

  // 1. Direct keyword match against PRELOADED_QA
  for (const item of PRELOADED_QA) {
    const hasKeyword = item.keywords.some((k) => qLower.includes(k.toLowerCase()));
    if (hasKeyword) {
      let selectedReply = item.answerEn;
      if (isTanglish && item.answerTanglish) {
        selectedReply = item.answerTanglish;
      } else if (language === 'ta') {
        selectedReply = item.answerTa;
      }
      return {
        reply: selectedReply,
        source: 'preloaded-knowledge',
      };
    }
  }

  // 2. Check for crop specific questions in CROPS_DATA
  const matchedCrop = CROPS_DATA.find((crop) => {
    return (
      qLower.includes(crop.id) ||
      qLower.includes(crop.nameEn.toLowerCase()) ||
      qLower.includes(crop.nameTa.toLowerCase()) ||
      (crop.id === 'paddy' && qLower.includes('nel')) ||
      (crop.id === 'cotton' && qLower.includes('paruthi')) ||
      (crop.id === 'coconut' && qLower.includes('thennai')) ||
      (crop.id === 'tomato' && qLower.includes('thakkali')) ||
      (crop.id === 'sugarcane' && qLower.includes('karumbu'))
    );
  });

  if (matchedCrop) {
    if (
      qLower.includes('water') ||
      qLower.includes('irrigation') ||
      qLower.includes('பாசனம்') ||
      qLower.includes('நீர்') ||
      qLower.includes('thanni') ||
      qLower.includes('thanneer')
    ) {
      if (isTanglish) {
        return {
          reply: `💧 **${matchedCrop.nameEn} Thanneer Paasana Melanmai:**\n\n- **Paasana Schedule:** ${matchedCrop.watering.scheduleEn}\n\n**Mukkiya Paasana Nilai (Critical Stages):**\n${matchedCrop.watering.criticalStagesEn.map((s) => `  • ${s}`).join('\n')}\n\n**Thanneer Semippu:**\n${matchedCrop.watering.waterSavingMethodEn}\n\n⚠️ *Vayal eerapathathai poruthu thanneer paaychavum.*`,
          source: 'preloaded-knowledge',
        };
      }

      const schedule = language === 'ta' ? matchedCrop.watering.scheduleTa : matchedCrop.watering.scheduleEn;
      const stages = language === 'ta' ? matchedCrop.watering.criticalStagesTa : matchedCrop.watering.criticalStagesEn;
      const saving = language === 'ta' ? matchedCrop.watering.waterSavingMethodTa : matchedCrop.watering.waterSavingMethodEn;
      const title = language === 'ta' ? `${matchedCrop.nameTa} பாசன மேலாண்மை:` : `${matchedCrop.nameEn} Irrigation Management:`;

      return {
        reply: `💧 **${title}**\n\n- ${schedule}\n\n**${language === 'ta' ? 'முக்கிய பாசன நிலைகள்:' : 'Critical Stages:'}**\n${stages.map((s) => `  • ${s}`).join('\n')}\n\n**${language === 'ta' ? 'நீர் சேமிப்பு முறை:' : 'Water Conservation:'}**\n${saving}\n\n⚠️ *${language === 'ta' ? 'உள்ளூர் வேளாண் அலுவலரிடம் ஆலோசனை பெறவும்.' : 'Verify field moisture before application.'}*`,
        source: 'preloaded-knowledge',
      };
    }

    if (
      qLower.includes('pest') ||
      qLower.includes('disease') ||
      qLower.includes('பூச்சி') ||
      qLower.includes('நோய்') ||
      qLower.includes('borer') ||
      qLower.includes('puzhu') ||
      qLower.includes('poochi')
    ) {
      if (isTanglish) {
        const pestList = matchedCrop.pests
          .map((p) => {
            return `• **${p.pestEn} (${p.pestTa})**\n  - Symptoms: ${p.symptomsEn}\n  - Iyarkai Theervu: ${p.organicSolutionEn}\n  - Chemical Marundhu: ${p.chemicalControlEn}`;
          })
          .join('\n\n');

        return {
          reply: `🛡️ **${matchedCrop.nameEn} Poochi & Noi Kattuppeduthal:**\n\n${pestList}\n\n⚠️ *Marundhu adikkum mun local KVK officer kitta alavu ketukonga.*`,
          source: 'preloaded-knowledge',
        };
      }

      const pestList = matchedCrop.pests
        .map((p) => {
          const pName = language === 'ta' ? p.pestTa : p.pestEn;
          const pSym = language === 'ta' ? p.symptomsTa : p.symptomsEn;
          const pOrg = language === 'ta' ? p.organicSolutionTa : p.organicSolutionEn;
          const pChem = language === 'ta' ? p.chemicalControlTa : p.chemicalControlEn;
          return `• **${pName}**\n  - ${language === 'ta' ? 'அறிகுறிகள்' : 'Symptoms'}: ${pSym}\n  - ${language === 'ta' ? 'இயற்கை தீர்வு' : 'Organic'}: ${pOrg}\n  - ${language === 'ta' ? 'பரிந்துரை' : 'Intervention'}: ${pChem}`;
        })
        .join('\n\n');

      return {
        reply: `🛡️ **${language === 'ta' ? `${matchedCrop.nameTa} பூச்சி மற்றும் நோய் கட்டுப்பாடு:` : `${matchedCrop.nameEn} Pest & Disease Management:`}**\n\n${pestList}\n\n⚠️ *${language === 'ta' ? 'அளவுக்கு அதிகமாக பூச்சிக்கொல்லிகளை பயன்படுத்த வேண்டாம். KVK அலுவலரிடம் ஆலோசனை பெறவும்.' : 'Always check exact pesticide concentration with your local Krishi Vigyan Kendra.'}*`,
        source: 'preloaded-knowledge',
      };
    }

    if (
      qLower.includes('fertilizer') ||
      qLower.includes('urea') ||
      qLower.includes('dap') ||
      qLower.includes('உரம்') ||
      qLower.includes('uram')
    ) {
      if (isTanglish) {
        return {
          reply: `🌱 **${matchedCrop.nameEn} Ura Melanmai Schedule:**\n\n${matchedCrop.practices.fertilizerScheduleEn}\n\n**Iyarkai Tips:**\n  • ${matchedCrop.organicTipsEn.join('\n  • ')}\n\n⚠️ *Soil test card keta maari uram podunga.*`,
          source: 'preloaded-knowledge',
        };
      }

      const fert = language === 'ta' ? matchedCrop.practices.fertilizerScheduleTa : matchedCrop.practices.fertilizerScheduleEn;
      const org = language === 'ta' ? matchedCrop.organicTipsTa.join('\n  • ') : matchedCrop.organicTipsEn.join('\n  • ');
      return {
        reply: `🌱 **${language === 'ta' ? `${matchedCrop.nameTa} உர அட்டவணை:` : `${matchedCrop.nameEn} Fertilizer & Nutrition Guide:`}**\n\n${fert}\n\n**${language === 'ta' ? 'இயற்கை வளர்ச்சி குறிப்புகள்:' : 'Organic Growth Tips:'}**\n  • ${org}\n\n⚠️ *${language === 'ta' ? 'மண் பரிசோதனை முடிவுகளுக்கு ஏற்ப உரமிடவும்.' : 'Calibrate fertilizer doses according to soil health card recommendations.'}*`,
        source: 'preloaded-knowledge',
      };
    }
  }

  // 3. Check OFFLINE_TIPS database
  for (const tip of OFFLINE_TIPS) {
    const titleMatch =
      qLower.includes(tip.titleEn.toLowerCase()) ||
      qLower.includes(tip.titleTa.toLowerCase()) ||
      tip.cropTags.some((c) => qLower.includes(c.toLowerCase()));

    if (titleMatch) {
      if (isTanglish) {
        return {
          reply: `💡 **${tip.titleEn}**\n\n${tip.summaryEn}\n\n**Seimurai Steps:**\n${tip.stepsEn.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n🔬 *Agri Science Note:* ${tip.expertNoteEn}`,
          source: 'preloaded-knowledge',
        };
      }

      const title = language === 'ta' ? tip.titleTa : tip.titleEn;
      const summary = language === 'ta' ? tip.summaryTa : tip.summaryEn;
      const steps = language === 'ta' ? tip.stepsTa : tip.stepsEn;
      const note = language === 'ta' ? tip.expertNoteTa : tip.expertNoteEn;

      return {
        reply: `💡 **${title}**\n\n${summary}\n\n**${language === 'ta' ? 'செயல்முறை படிகள்:' : 'Steps to follow:'}**\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n🔬 *${language === 'ta' ? 'அறிவியல் குறிப்பு' : 'Scientific Note'}:* ${note}`,
        source: 'preloaded-knowledge',
      };
    }
  }

  // 4. Default fallback guidance
  if (isTanglish) {
    return {
      reply: `🌾 **AgriSaarthi Vivasaya Vazhikaatti (Thanglish Mode):**

Ungal kelvikku podhuvaana vivasaya tips:
1. **Man Parisodhanai (Soil test):** Nadavu munnaadi man-oda pH & salt level test pannunga.
2. **Iyarkai Uram:** 1 acre-ku 5-10 ton thozhu urathudan **Trichoderma viride 2 kg** kalandhu adi uramaaga podunga. Ver azhugal thadukkalaam.
3. **Poochi Kattuppeduthal:** Chemical marundhu adikkurathukku munnaadi 5% Veppa enney spray, yellow sticky trap, and pheromone traps vaiyunga.
4. **Thanneer Paasanam:** Drip irrigation illana kaychalum paaychalum murai moolam 30-40% thanneer semikkalaam.

Keezhe irukkura **'Crop Guide'** or **'Offline Guide'**-la innum niraiya details paakkalaam!`,
      source: 'preloaded-knowledge',
    };
  }

  if (language === 'ta') {
    return {
      reply: `🌾 **அக்ரிசாரதி விவசாய வழிகாட்டுதல் (ஆஃப்லைன் பயன்முறை):**

உங்கள் கேள்விக்குரிய பொதுவான வேளாண் ஆலோசனை:
1. **மண் பரிசோதனை:** எந்தப் பயிரையும் நடுவதற்கு முன் மண் மாதிரியை எடுத்து கார அமில நிலை (pH) மற்றும் உப்பின் அளவை அறியவும்.
2. **இயற்கை உரம்:** அடி உரமாக 1 ஏக்கருக்கு 5 முதல் 10 டன் மட்கிய தொழுவுரத்துடன் 2 கிலோ டிரைக்கோடெர்மா விரிடி மற்றும் சூடோமோனாஸ் கலந்து இடவும்.
3. **பூச்சி கட்டுப்பாடு:** ரசாயன மருந்துகளை தெளிக்கும் முன் வேப்பெண்ணெய் (3%), மஞ்சள் ஒட்டும் அட்டைகள் மற்றும் இனக்கவர்ச்சி பொறிகளைப் பயன்படுத்தவும்.
4. **நீர் சிக்கனம்:** சொட்டுநீர் பாசனம் அல்லது காய்ச்சலும் பாய்ச்சலும் முறையைப் பயன்படுத்தி 30-40% நீரை மிச்சப்படுத்தலாம்.

கூடுதல் தகவலுக்கு கீழே உள்ள **'பயிர் வழிகாட்டி'** அல்லது **'ஆஃப்லைன் வழிகாட்டி'** பிரிவுகளைப் பார்வையிடவும்!`,
      source: 'preloaded-knowledge',
    };
  }

  return {
    reply: `🌾 **AgriSaarthi Agricultural Guidance (Preloaded Knowledge):**

General recommended agricultural management for your query:
1. **Soil & Basal Nutrition:** Always test soil pH before sowing. Incorporate 5-10 tons of well-rotted FYM mixed with *Trichoderma viride* (2 kg/acre) to suppress soil pathogens.
2. **Integrated Pest Management:** Install yellow sticky traps (10/acre) and sex pheromone traps before spraying synthetic pesticides. Spray 5% Neem Kernel Extract (NSKE) at first sighting.
3. **Smart Irrigation:** Practice Alternate Wetting and Drying (AWD) in paddy, and root-zone drip irrigation with organic mulching in commercial crops to save 30-45% water.
4. **Bio-fertilizers:** Seed treatment with *Azospirillum* / *Rhizobium* (200g/acre seed) saves up to 25% synthetic Nitrogen.

Browse the **Crop Guide** or **Offline Guide** tabs for detailed step-by-step guides!`,
    source: 'preloaded-knowledge',
  };
}
