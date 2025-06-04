// Face Analysis Types
export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'oblong' | 'diamond' | 'triangle';

export type FacialFeatures = {
  faceShape: FaceShape;
  eyeDistance: 'close' | 'average' | 'wide';
  eyeShape: 'round' | 'almond' | 'hooded' | 'monolid' | 'downturned' | 'upturned';
  noseBridge: 'narrow' | 'average' | 'wide';
  lipFullness: 'thin' | 'average' | 'full';
  cheekbones: 'high' | 'average' | 'low';
  jawline: 'defined' | 'average' | 'soft';
  foreheadHeight: 'short' | 'average' | 'tall';
};

export type FaceLandmarks = {
  landmarks: number[][];
  boundingBox: {
    topLeft: [number, number];
    bottomRight: [number, number];
  };
};

// Makeup Recommendations
export type OccasionType = 
  | 'everyday' 
  | 'evening' 
  | 'corporate' 
  | 'casual' 
  | 'romantic' 
  | 'photoshoot';

export type ProductType = 
  | 'foundation' 
  | 'concealer' 
  | 'blush' 
  | 'bronzer' 
  | 'eyeshadow' 
  | 'eyeliner' 
  | 'mascara' 
  | 'lipstick' 
  | 'highlighter'
  | 'contour';

export type MakeupRecommendation = {
  productType: ProductType;
  technique: string;
  description: string;
  color?: string;
  imageUrl?: string;
};

export type OccasionRecommendations = {
  occasion: OccasionType;
  title: string;
  description: string;
  products: MakeupRecommendation[];
};

export type ScanStatus = 
  | 'idle' 
  | 'requesting-permission'
  | 'permission-denied' 
  | 'preparing' 
  | 'scanning' 
  | 'processing' 
  | 'completed' 
  | 'error';

export type UserProfileData = {
  facialFeatures: FacialFeatures | null;
  recommendations: OccasionRecommendations[] | null;
  scanDate: Date | null;
  scanStatus: ScanStatus;
};