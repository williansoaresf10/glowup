import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, FACEMESH_TESSELATION, Results } from '@mediapipe/face_mesh';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { FaceLandmarks, FacialFeatures, FaceShape } from '../../types';

// MediaPipe Face Mesh indexes for key facial landmarks
const LANDMARKS = {
  FACE_OVAL: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
  LEFT_EYE: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],
  RIGHT_EYE: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
  LIPS: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95],
  NOSE: [1, 2, 3, 4, 5, 6, 197, 195, 5, 4, 45, 220, 115, 272],
  LEFT_EYEBROW: [276, 283, 282, 295, 285],
  RIGHT_EYEBROW: [46, 53, 52, 65, 55],
  FOREHEAD: [10, 338, 297, 332],
  JAWLINE: [127, 234, 93, 132, 58, 172, 136, 150, 149, 176, 148, 152]
};

// Create and initialize the FaceMesh detector
export const initFaceDetection = (
  videoElement: HTMLVideoElement, 
  canvasElement: HTMLCanvasElement,
  onResults: (results: Results) => void,
  onFeaturesDetected?: (features: FacialFeatures) => void
): { startDetection: () => void, stopDetection: () => void } => {
  const faceMesh = new FaceMesh({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults((results: Results) => {
    onResults(results);

    if (results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      const facialFeatures = analyzeFacialFeatures(landmarks);
      if (onFeaturesDetected) {
        onFeaturesDetected(facialFeatures);
      }
    }
  });

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({ image: videoElement });
    },
    width: 1280,
    height: 720
  });

  const startDetection = () => camera.start();
  const stopDetection = () => camera.stop();

  return { startDetection, stopDetection };
};

// Draw face mesh on canvas
export const drawFaceMesh = (
  results: Results, 
  canvasElement: HTMLCanvasElement
) => {
  const canvasCtx = canvasElement.getContext('2d');
  
  if (!canvasCtx || !results.multiFaceLandmarks) return;
  
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Set canvas dimensions to match the video
  canvasElement.width = results.image.width;
  canvasElement.height = results.image.height;
  
  // Draw the facial mesh connectors
  for (const landmarks of results.multiFaceLandmarks) {
    // Draw the facial mesh tessellation
    drawConnectors(
      canvasCtx,
      landmarks,
      FACEMESH_TESSELATION,
      { color: 'rgba(244, 114, 182, 0.5)', lineWidth: 1 }
    );

    // Draw specific facial features in different colors
    drawSpecificFeatures(canvasCtx, landmarks);
  }

  canvasCtx.restore();
};

// Draw specific facial features with different colors
const drawSpecificFeatures = (ctx: CanvasRenderingContext2D, landmarks: any) => {
  // Face outline - pink
  drawFeature(ctx, landmarks, LANDMARKS.FACE_OVAL, 'rgba(244, 114, 182, 1)', 2);
  
  // Eyes - blue
  drawFeature(ctx, landmarks, LANDMARKS.LEFT_EYE, 'rgba(14, 165, 233, 1)', 2);
  drawFeature(ctx, landmarks, LANDMARKS.RIGHT_EYE, 'rgba(14, 165, 233, 1)', 2);
  
  // Lips - purple
  drawFeature(ctx, landmarks, LANDMARKS.LIPS, 'rgba(167, 139, 250, 1)', 2);
  
  // Nose - teal
  drawFeature(ctx, landmarks, LANDMARKS.NOSE, 'rgba(45, 212, 191, 1)', 2);
  
  // Eyebrows - orange
  drawFeature(ctx, landmarks, LANDMARKS.LEFT_EYEBROW, 'rgba(251, 146, 60, 1)', 2);
  drawFeature(ctx, landmarks, LANDMARKS.RIGHT_EYEBROW, 'rgba(251, 146, 60, 1)', 2);
};

// Helper function to draw a specific facial feature
const drawFeature = (
  ctx: CanvasRenderingContext2D, 
  landmarks: any, 
  indices: number[], 
  color: string, 
  lineWidth: number
) => {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  
  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    const point = landmarks[index];
    
    if (i === 0) {
      ctx.moveTo(point.x * ctx.canvas.width, point.y * ctx.canvas.height);
    } else {
      ctx.lineTo(point.x * ctx.canvas.width, point.y * ctx.canvas.height);
    }
  }
  
  if (indices === LANDMARKS.FACE_OVAL || 
      indices === LANDMARKS.LEFT_EYE || 
      indices === LANDMARKS.RIGHT_EYE) {
    ctx.closePath();
  }
  
  ctx.stroke();
};

// Analyze facial features based on landmarks
const analyzeFacialFeatures = (landmarks: any): FacialFeatures => {
  // Extract face shape by analyzing the face oval proportions
  const faceShape = determineFaceShape(landmarks);
  
  // Calculate the distance between the eyes
  const leftEyeCenter = getFeatureCenter(landmarks, LANDMARKS.LEFT_EYE);
  const rightEyeCenter = getFeatureCenter(landmarks, LANDMARKS.RIGHT_EYE);
  const eyeDistance = calculateDistance(leftEyeCenter, rightEyeCenter);
  
  // Analyze eye shape
  const eyeShape = determineEyeShape(landmarks);
  
  // Analyze nose bridge width
  const noseBridge = determineNoseBridge(landmarks);
  
  // Analyze lip fullness
  const lipFullness = determineLipFullness(landmarks);
  
  // Analyze cheekbones
  const cheekbones = determineCheekbones(landmarks);
  
  // Analyze jawline
  const jawline = determineJawline(landmarks);
  
  // Analyze forehead height
  const foreheadHeight = determineForeheadHeight(landmarks);
  
  return {
    faceShape,
    eyeDistance: normalizeEyeDistance(eyeDistance),
    eyeShape,
    noseBridge,
    lipFullness,
    cheekbones,
    jawline,
    foreheadHeight
  };
};

// Helper functions for feature analysis
const getFeatureCenter = (landmarks: any, indices: number[]) => {
  let sumX = 0, sumY = 0;
  
  for (const index of indices) {
    sumX += landmarks[index].x;
    sumY += landmarks[index].y;
  }
  
  return {
    x: sumX / indices.length,
    y: sumY / indices.length
  };
};

const calculateDistance = (point1: {x: number, y: number}, point2: {x: number, y: number}) => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Determine face shape based on proportions and angles
const determineFaceShape = (landmarks: any): FaceShape => {
  // This is a simplified version - a real implementation would use more complex measurements
  
  // Get face width at cheekbones
  const leftCheek = landmarks[LANDMARKS.FACE_OVAL[21]];
  const rightCheek = landmarks[LANDMARKS.FACE_OVAL[21]];
  const faceWidth = calculateDistance(leftCheek, rightCheek);
  
  // Get face height
  const forehead = landmarks[LANDMARKS.FOREHEAD[0]];
  const chin = landmarks[LANDMARKS.FACE_OVAL[19]];
  const faceHeight = calculateDistance(forehead, chin);
  
  // Get jawline width
  const leftJaw = landmarks[LANDMARKS.JAWLINE[0]];
  const rightJaw = landmarks[LANDMARKS.JAWLINE[11]];
  const jawWidth = calculateDistance(leftJaw, rightJaw);
  
  // Forehead width
  const leftForehead = landmarks[LANDMARKS.FOREHEAD[0]];
  const rightForehead = landmarks[LANDMARKS.FOREHEAD[3]];
  const foreheadWidth = calculateDistance(leftForehead, rightForehead);
  
  // Determine face shape based on proportions
  const widthToHeight = faceWidth / faceHeight;
  const jawToForeheadRatio = jawWidth / foreheadWidth;
  
  if (widthToHeight > 0.8 && widthToHeight < 0.85 && jawToForeheadRatio > 0.75) {
    return 'oval';
  } else if (widthToHeight >= 0.85 && jawToForeheadRatio > 0.9) {
    return 'round';
  } else if (widthToHeight < 0.8 && jawToForeheadRatio > 0.9) {
    return 'square';
  } else if (widthToHeight < 0.8 && jawToForeheadRatio < 0.8) {
    return 'heart';
  } else if (widthToHeight < 0.75) {
    return 'oblong';
  } else if (widthToHeight >= 0.75 && widthToHeight < 0.8 && jawToForeheadRatio < 0.8) {
    return 'diamond';
  } else {
    return 'triangle';
  }
};

// Normalize eye distance into categorical value
const normalizeEyeDistance = (distance: number): 'close' | 'average' | 'wide' => {
  if (distance < 0.15) return 'close';
  if (distance > 0.2) return 'wide';
  return 'average';
};

// Simplified feature detection functions
const determineEyeShape = (landmarks: any): FacialFeatures['eyeShape'] => {
  // In a real implementation, this would analyze eye curvature, lid position, etc.
  return 'almond'; // Default for demo
};

const determineNoseBridge = (landmarks: any): FacialFeatures['noseBridge'] => {
  return 'average'; // Default for demo
};

const determineLipFullness = (landmarks: any): FacialFeatures['lipFullness'] => {
  return 'average'; // Default for demo
};

const determineCheekbones = (landmarks: any): FacialFeatures['cheekbones'] => {
  return 'average'; // Default for demo
};

const determineJawline = (landmarks: any): FacialFeatures['jawline'] => {
  return 'average'; // Default for demo
};

const determineForeheadHeight = (landmarks: any): FacialFeatures['foreheadHeight'] => {
  return 'average'; // Default for demo
};