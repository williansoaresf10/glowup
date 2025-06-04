import { FacialFeatures, OccasionRecommendations, OccasionType } from "../../types"; //

// Gerar recomendações de maquiagem com base na análise facial
export const generateRecommendations = ( //
  facialFeatures: FacialFeatures //
): OccasionRecommendations[] => { //
  return [ //
    getDiaADiaRecommendations(facialFeatures), //
    getNoiteRecommendations(facialFeatures), //
    getTrabalhoRecommendations(facialFeatures), //
    getCasualRecommendations(facialFeatures), //
    getRomanticoRecommendations(facialFeatures), //
    getEnsaioFotograficoRecommendations(facialFeatures), //
  ]; //
}; //

// Função auxiliar para obter recomendações para formatos de rosto específicos
const getRecommendationsForFaceShape = ( //
  faceShape: FacialFeatures["faceShape"] //
) => { //
  const recommendations = { //
    oval: { //
      foundation: "Base com cobertura leve a média aplicada de forma uniforme.", //
      blush: "Aplique blush nas maçãs do rosto para um rubor natural.", //
      bronzer: "Bronzeado leve ao redor do perímetro do rosto.", //
      highlighter: "Aplique nos pontos altos das maçãs do rosto e no centro da testa.", //
      contour: "Contorno mínimo necessário, foque em uma definição sutil.", //
    }, //
    round: { //
      foundation: "Base de cobertura média para criar uma pele uniforme.", //
      blush: "Aplique blush em direção às têmporas para alongar o rosto.", //
      bronzer: "Aplique bronzer ao longo da mandíbula e têmporas para criar definição.", //
      highlighter: "Ilumine o centro da testa e do queixo para alongar o rosto.", //
      contour: "Contorne as laterais do rosto e abaixo das maçãs para afinar o rosto.", //
    }, //
    square: { //
      foundation: "Cobertura uniforme com suavização ao redor da mandíbula.", //
      blush: "Aplique blush em movimentos circulares nas maçãs do rosto para suavizar os ângulos.", //
      bronzer: "Aplique bronzer nas têmporas e mandíbula com esfumado suave.", //
      highlighter: "Ilumine o centro da testa e do queixo para equilibrar a mandíbula marcada.", //
      contour: "Contorno suave ao longo da mandíbula para suavizar os ângulos.", //
    }, //
    heart: { //
      foundation: "Cobertura uniforme com foco em acabamento suave.", //
      blush: "Aplique blush horizontalmente nas maçãs para ampliar a parte inferior do rosto.", //
      bronzer: "Aplique bronzer nas têmporas e linha do cabelo para equilibrar a testa.", //
      highlighter: "Ilumine o centro do queixo e as maçãs do rosto.", //
      contour: "Contorne as têmporas para reduzir a largura da testa.", //
    }, //
    oblong: { //
      foundation: "Cobertura uniforme com dimensão na testa e queixo.", //
      blush: "Aplique blush horizontalmente nas bochechas para criar largura.", //
      bronzer: "Aplique bronzer no topo da testa e na base do queixo para encurtar o rosto.", //
      highlighter: "Ilumine horizontalmente sobre as maçãs do rosto.", //
      contour: "Contorne o topo da testa e a base do queixo.", //
    }, //
    diamond: { //
      foundation: "Cobertura uniforme com suavidade nas maçãs do rosto.", //
      blush: "Aplique blush em movimentos arredondados nas maçãs para suavizar os ângulos.", //
      bronzer: "Aplique bronzer nas têmporas e ao longo da mandíbula para equilibrar a largura do rosto.", //
      highlighter: "Ilumine a testa e o queixo para equilibrar a largura das maçãs do rosto.", // Tradução de "Highlight forehead and chin to balance cheekbone width."
      contour: "Contorne levemente as maçãs do rosto para suavizar sua proeminência.", // Tradução de "Contour cheekbones lightly to soften their prominence."
    }, //
    triangle: { //
      foundation: "Cobertura uniforme focando na suavidade.", // Tradução de "Even coverage focusing on smoothness."
      blush: "Aplique blush na parte superior das maçãs do rosto para levantar o rosto.", // Tradução de "Apply blush at top of cheekbones to lift the face."
      bronzer: "Aplique bronzer ao longo da linha da mandíbula para minimizar a largura.", // Tradução de "Apply bronzer along the jawline to minimize width."
      highlighter: "Ilumine o centro da testa e as maçãs do rosto.", // Tradução de "Highlight center of forehead and cheekbones."
      contour: "Contorne as laterais da linha da mandíbula para reduzir a largura e equilibrar o rosto.", // Tradução de "Contour sides of jawline to reduce width and balance face."
    }, //
  }; //

  return recommendations[faceShape]; //
}; //

// Função auxiliar para obter recomendações de maquiagem para os olhos com base no formato dos olhos
const getEyeRecommendations = (eyeShape: FacialFeatures["eyeShape"]) => { //
  const recommendations = { //
    round: { //
      eyeshadow: "Aplique sombra mais escura no canto externo para alongar os olhos.", //
      eyeliner: "Delineador gatinho para estender o formato dos olhos.", //
    }, //
    almond: { //
      eyeshadow: "A maioria dos estilos de sombra funciona bem, foque em realçar o formato natural.", //
      eyeliner: "Linha fina ao longo da linha dos cílios com um pequeno gatinho.", //
    }, //
    hooded: { //
      eyeshadow: "Concentre a cor na pálpebra e esfume para cima. Use tons matte.", //
      eyeliner: "Linha fina perto dos cílios, ligeiramente mais grossa na borda externa.", //
    }, //
    monolid: { //
      eyeshadow: "Crie dimensão com um gradiente de cores, mais escuro na linha dos cílios.", //
      eyeliner: "Delineador grosso para definir o formato dos olhos.", //
    }, //
    downturned: { //
      eyeshadow: "Concentre cores mais escuras no canto externo e esfume para cima.", //
      eyeliner: "Delineador gatinho angulando para cima para levantar os olhos.", //
    }, //
    upturned: { //
      eyeshadow: "Equilibre adicionando profundidade à linha inferior externa dos cílios.", //
      eyeliner: "Delineador gatinho clássico seguindo o formato natural dos olhos.", //
    }, //
  }; //

  return recommendations[eyeShape]; //
}; //

// Função para cada tipo de ocasião
const getDiaADiaRecommendations = ( //
  features: FacialFeatures //
): OccasionRecommendations => { //
  const faceRecs = getRecommendationsForFaceShape(features.faceShape); //
  const eyeRecs = getEyeRecommendations(features.eyeShape); //

  return { //
    occasion: "everyday", //
    title: "Beleza do Dia a Dia", //
    description: "Maquiagem fresca e natural que realça seus traços sem exageros, perfeita para o uso diário.", //
    products: [ //
      { //
        productType: "foundation", //
        technique: "Aplicação leve", // Tradução de "Light application"
        description: faceRecs.foundation, //
      }, //
      { //
        productType: "blush", //
        technique: "Rubor natural", // Tradução de "Natural flush"
        description: faceRecs.blush, //
      }, //
      { //
        productType: "eyeshadow", //
        technique: "Pincelada simples de cor", // Tradução de "Simple wash of color"
        description: eyeRecs.eyeshadow, //
      }, //
      { //
        productType: "mascara", //
        technique: "Camada leve", // Tradução de "Light coat"
        description: "Uma ou duas camadas para definição sutil.", //
      }, //
      { //
        productType: "lipstick", //
        technique: "Cor natural", // Tradução de "Natural tint"
        description: "Um tom rosa ou malva neutro e translúcido, próximo à cor natural dos lábios.", // Tradução de "A sheer, neutral pink or mauve shade close to your natural lip color."
      }, //
    ], //
  }; //
}; //

const getNoiteRecommendations = ( //
  features: FacialFeatures //
): OccasionRecommendations => { //
  const faceRecs = getRecommendationsForFaceShape(features.faceShape); //
  const eyeRecs = getEyeRecommendations(features.eyeShape); //

  return { //
    occasion: "evening", //
    title: "Glamour Noturno", // Tradução de "Evening Glam"
    description: "Maquiagem sofisticada e dramática que causa impacto para saídas noturnas e eventos especiais.", // Tradução de "Sophisticated, dramatic makeup that makes a statement for nights out and special events."
    products: [ //
      { //
        productType: "foundation", //
        technique: "Cobertura média a alta", // Tradução de "Medium to full coverage"
        description: "Cobertura total para um acabamento impecável que fotografa bem sob iluminação noturna.", // Tradução de "Full coverage for a flawless finish that photographs well under evening lighting."
      }, //
      { //
        productType: "contour", //
        technique: "Contorno definido", // Tradução de "Defined contour"
        description: faceRecs.contour, //
      }, //
      { //
        productType: "eyeshadow", //
        technique: "Olho esfumado ou cor ousada", // Tradução de "Smoky eye or bold color"
        description: `Olho esfumado dramático com profundidade no côncavo. ${eyeRecs.eyeshadow}`, // Tradução de "Dramatic smoky eye with depth at the crease."
      }, //
      { //
        productType: "eyeliner", //
        technique: "Definição precisa", // Tradução de "Precise definition"
        description: eyeRecs.eyeliner, //
      }, //
      { //
        productType: "lipstick", //
        technique: "Batom de destaque ousado", // Tradução de "Bold statement lip"
        description: "Cor rica e saturada em tons de ameixa, vermelho ou vinho, dependendo do evento.", // Tradução de "Rich, saturated color in deep berry, red, or plum depending on the event."
      }, //
      { //
        productType: "highlighter", //
        technique: "Brilho estratégico", // Tradução de "Targeted glow"
        description: faceRecs.highlighter, //
      }, //
    ], //
  }; //
}; //

const getTrabalhoRecommendations = ( //
  features: FacialFeatures //
): OccasionRecommendations => { //
  const faceRecs = getRecommendationsForFaceShape(features.faceShape); //
  const eyeRecs = getEyeRecommendations(features.eyeShape); //

  return { //
    occasion: "corporate", //
    title: "Visual Profissional", //
    description: "Maquiagem refinada e sutil que realça seus traços, mantendo uma aparência profissional.", // Tradução de "Refined, subtle makeup that enhances your features while maintaining a professional appearance."
    products: [ //
      { //
        productType: "foundation", //
        technique: "Cobertura média", // Tradução de "Medium coverage"
        description: "Cobertura de aparência natural que dura por reuniões longas.", // Tradução de "Natural-looking coverage that lasts through long meetings."
      }, //
      { //
        productType: "eyeshadow", //
        technique: "Paleta neutra", // Tradução de "Neutral palette"
        description: `Tons neutros matte em cinza, marrom ou taupe. ${eyeRecs.eyeshadow}`, // Tradução de "Matte neutrals in taupe, brown, or gray tones."
      }, //
      { //
        productType: "eyeliner", //
        technique: "Definição sutil", // Tradução de "Subtle definition"
        description: "Linha fina em marrom ou cinza, bem rente à linha dos cílios.", // Tradução de "Thin line in brown or gray, staying close to the lash line."
      }, //
      { //
        productType: "blush", //
        technique: "Calor sutil", // Tradução de "Subtle warmth"
        description: "Aplicação leve de tons neutros de rosa ou pêssego.", // Tradução de "Light application of neutral rose or peach tones."
      }, //
      { //
        productType: "lipstick", //
        technique: "Acabamento polido", // Tradução de "Polished finish"
        description: "Tons de rosa neutro, malva ou nude com acabamento acetinado ou matte.", // Tradução de "Neutral rose, mauve, or nude shades in satin or matte finish."
      }, //
    ], //
  }; //
}; //

const getCasualRecommendations = ( //
  features: FacialFeatures //
): OccasionRecommendations => { //
  const faceRecs = getRecommendationsForFaceShape(features.faceShape); //

  return { //
    occasion: "casual", //
    title: "Casual Sem Esforço", // Tradução de "Effortless Casual"
    description: "Maquiagem rápida e fácil que realça sua beleza natural para saídas casuais.", // Tradução de "Quick, easy makeup that enhances your natural beauty for casual outings."
    products: [ //
      { //
        productType: "foundation", //
        technique: "Hidratante com cor ou BB cream", // Tradução de "Tinted moisturizer or BB cream"
        description: "Cobertura leve com benefícios de skincare para um visual natural.", // Tradução de "Light coverage with skincare benefits for a natural look."
      }, //
      { //
        productType: "blush", //
        technique: "Rubor fresco", // Tradução de "Fresh flush"
        description: "Blush cremoso aplicado nas maçãs do rosto para um brilho natural.", // Tradução de "Cream blush applied to apples of cheeks for a natural glow."
      }, //
      { //
        productType: "mascara", //
        technique: "Cílios definidos", // Tradução de "Defined lashes"
        description: "Uma camada para definição natural e abertura do olhar.", // Tradução de "One coat for natural definition and eye opening."
      }, //
      { //
        productType: "lipstick", //
        technique: "Batom hidratante com cor", // Tradução de "Tinted balm"
        description: "Bálsamo labial hidratante com um toque de cor para uso confortável.", // Tradução de "Hydrating lip balm with a hint of color for comfortable wear."
      }, //
    ], //
  }; //
}; //

const getRomanticoRecommendations = ( //
  features: FacialFeatures //
): OccasionRecommendations => { //
  const faceRecs = getRecommendationsForFaceShape(features.faceShape); //
  const eyeRecs = getEyeRecommendations(features.eyeShape); //

  return { //
    occasion: "romantic", //
    title: "Encontro Romântico", // Tradução de "Romantic Rendezvous"
    description: "Maquiagem suave e feminina que cria um look romântico e sedutor para encontros e ocasiões íntimas.", // Tradução de "Soft, feminine makeup that creates a romantic and alluring look for dates and intimate occasions."
    products: [ //
      { //
        productType: "foundation", //
        technique: "Acabamento luminoso", // Tradução de "Luminous finish"
        description: "Base orvalhada que cria um brilho romântico.", // Tradução de "Dewy foundation that creates a romantic glow."
      }, //
      { //
        productType: "blush", //
        technique: "Rubor suave", // Tradução de "Soft flush"
        description: "Tons rosa suave ou pêssego esfumados em direção às têmporas.", // Tradução de "Soft pink or peachy tones blended up towards temples."
      }, //
      { //
        productType: "eyeshadow", //
        technique: "Definição suave", // Tradução de "Soft definition"
        description: `Tons de ouro rosado suave, malva ou bronze com brilho sutil. ${eyeRecs.eyeshadow}`, // Tradução de "Soft rose gold, mauve, or bronze shades with subtle shimmer."
      }, //
      { //
        productType: "eyeliner", //
        technique: "Definição sutil", // Tradução de "Subtle definition"
        description: "Delineador suave, levemente esfumado para criar profundidade sem rigidez.", // Tradução de "Soft, slightly smudged liner to create depth without harshness."
      }, //
      { //
        productType: "lipstick", //
        technique: "Lábios beijáveis", // Tradução de "Kissable lips"
        description: "Tons cremosos de rosa, pink ou ameixa com acabamento acetinado.", // Tradução de "Creamy rose, pink, or berry tones in satin finish."
      }, //
      { //
        productType: "highlighter", //
        technique: "Brilho romântico", // Tradução de "Romantic glow"
        description: "Iluminador suave nas maçãs do rosto, arco do cupido e cantos internos dos olhos.", // Tradução de "Soft highlight on cheekbones, cupid's bow, and inner corners of eyes."
      }, //
    ], //
  }; //
}; //

const getEnsaioFotograficoRecommendations = ( //
  features: FacialFeatures //
): OccasionRecommendations => { //
  const faceRecs = getRecommendationsForFaceShape(features.faceShape); //
  const eyeRecs = getEyeRecommendations(features.eyeShape); //

  return { //
    occasion: "photoshoot", //
    title: "Pronta para a Câmera", // Tradução de "Camera Ready"
    description: "Maquiagem de longa duração e fotogênica que fica linda em fotos para redes sociais e ensaios profissionais.", // Tradução de "Long-lasting, photogenic makeup that photographs beautifully for social media and professional shoots."
    products: [ //
      { //
        productType: "foundation", //
        technique: "Base pronta para a câmera", // Tradução de "Camera-ready base"
        description: "Base de longa duração e adequada para fotos com esfumado cuidadoso.", // Tradução de "Long-wearing, photo-friendly foundation with careful blending."
      }, //
      { //
        productType: "contour", //
        technique: "Dimensão esculpida", // Tradução de "Sculpted dimension"
        description: faceRecs.contour, //
      }, //
      { //
        productType: "eyeshadow", //
        technique: "Olho dimensional", // Tradução de "Dimensional eye"
        description: `Sombras bem esfumadas com côncavo definido para profundidade. ${eyeRecs.eyeshadow}`, // Tradução de "Well-blended shadows with defined crease for depth."
      }, //
      { //
        productType: "eyeliner", //
        technique: "Linha definida", // Tradução de "Defined line"
        description: eyeRecs.eyeliner, //
      }, //
      { //
        productType: "mascara", //
        technique: "Cílios volumosos", // Tradução de "Volumized lashes"
        description: "Múltiplas camadas para volume e comprimento; considere cílios postiços para drama adicional.", //
      }, //
      { //
        productType: "lipstick", //
        technique: "Aplicação precisa", // Tradução de "Precise application"
        description: "Lábios bem definidos com fórmula de longa duração em tom fotogênico.", //
      }, //
      { //
        productType: "highlighter", //
        technique: "Iluminação estratégica", // Tradução de "Strategic illumination"
        description: "Iluminador direcionado nos pontos altos para dimensão sem parecer oleoso na câmera.", //
      }, //
    ], //
  }; //
}; //