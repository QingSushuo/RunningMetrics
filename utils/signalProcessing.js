export const signalProcessing = {
  detectPeaks(data, threshold = 0.5, minPeakDistance = 3) {
    const peaks = [];
    
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > threshold && 
          data[i] > data[i-1] && 
          data[i] > data[i+1]) {
        
        if (peaks.length === 0 || i - peaks[peaks.length-1] >= minPeakDistance) {
          peaks.push(i);
        }
      }
    }
    
    return peaks;
  },

  smoothValue(currentValue, previousValue = 0, smoothingFactor = 0.3) {
    return previousValue * (1 - smoothingFactor) + currentValue * smoothingFactor;
  },

  movingAverage(data, windowSize = 5) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const average = window.reduce((a, b) => a + b) / window.length;
      result.push(average);
    }
    return result;
  }
};