import { signalProcessing } from '../utils/signalProcessing';

export default class SensorDataProcessor {
  constructor() {
    this.accelerationBuffer = [];
    this.stepTimes = [];
    this.lastStepTime = null;
    this.bufferSize = 20;
    this.smoothedMetrics = {
      cadence: 0,
      verticalOscillation: 0,
      groundContactTime: 0
    };
  }

  processAccelerometerData(data) {
    const { x, y, z } = data;
    
    const totalAcceleration = Math.sqrt(x*x + y*y + z*z) - 1.0;
    
    this.accelerationBuffer.push({
      timestamp: Date.now(),
      acceleration: totalAcceleration,
      verticalAcc: y
    });

    if (this.accelerationBuffer.length > this.bufferSize) {
      this.accelerationBuffer.shift();
    }

    const cadence = this.calculateCadence();
    const verticalOscillation = this.calculateVerticalOscillation();
    const groundContactTime = this.estimateGroundContactTime(cadence);

    this.smoothedMetrics.cadence = signalProcessing.smoothValue(
      cadence, this.smoothedMetrics.cadence, 0.3
    );
    this.smoothedMetrics.verticalOscillation = signalProcessing.smoothValue(
      verticalOscillation, this.smoothedMetrics.verticalOscillation, 0.2
    );
    this.smoothedMetrics.groundContactTime = signalProcessing.smoothValue(
      groundContactTime, this.smoothedMetrics.groundContactTime, 0.3
    );

    return {
      cadence: Math.round(this.smoothedMetrics.cadence),
      verticalOscillation: this.smoothedMetrics.verticalOscillation,
      groundContactTime: Math.round(this.smoothedMetrics.groundContactTime),
      pace: this.calculatePace(this.smoothedMetrics.cadence)
    };
  }

  processGyroscopeData(data) {
    // 陀螺仪数据可用于未来增强
  }

  calculateCadence() {
    if (this.accelerationBuffer.length < 10) return 0;

    const accelerations = this.accelerationBuffer.map(d => d.acceleration);
    const peaks = signalProcessing.detectPeaks(accelerations, 0.3, 3);

    if (peaks.length > 0) {
      const currentTime = Date.now();
      if (this.lastStepTime) {
        const stepInterval = (currentTime - this.lastStepTime) / 1000;
        if (stepInterval > 0.3 && stepInterval < 3) {
          this.stepTimes.push(stepInterval);
          if (this.stepTimes.length > 10) this.stepTimes.shift();
        }
      }
      this.lastStepTime = currentTime;
    }

    if (this.stepTimes.length === 0) return 0;
    const avgStepTime = this.stepTimes.reduce((a, b) => a + b) / this.stepTimes.length;
    return 60 / avgStepTime;
  }

  calculateVerticalOscillation() {
    if (this.accelerationBuffer.length < 5) return 0;

    const verticalAccelerations = this.accelerationBuffer.map(d => d.verticalAcc);
    const maxAcc = Math.max(...verticalAccelerations);
    const minAcc = Math.min(...verticalAccelerations);
    
    const oscillation = (maxAcc - minAcc) * 8;
    return Math.max(2, Math.min(20, oscillation));
  }

  estimateGroundContactTime(cadence) {
    if (cadence === 0) return 0;
    const estimatedGCT = 300 - (cadence - 160) * 2;
    return Math.max(180, Math.min(400, estimatedGCT));
  }

  calculatePace(cadence) {
    if (cadence === 0) return '0:00';
    const speed = (cadence * 0.7 * 60) / 1000;
    const paceMinPerKm = 60 / speed;
    const minutes = Math.floor(paceMinPerKm);
    const seconds = Math.round((paceMinPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}