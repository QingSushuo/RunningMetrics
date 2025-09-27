import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import SensorDataProcessor from './SensorDataProcessor';

const { width } = Dimensions.get('window');

export default function RunningMetrics() {
  const [metrics, setMetrics] = useState({
    cadence: 0,
    verticalOscillation: 0,
    groundContactTime: 0,
    pace: '0:00'
  });

  const [sensorAvailable, setSensorAvailable] = useState(true);

  useEffect(() => {
    const sensorProcessor = new SensorDataProcessor();
    let accelerometerSubscription;
    let gyroscopeSubscription;

    const startSensors = async () => {
      try {
        const accAvailable = await Accelerometer.isAvailableAsync();
        const gyroAvailable = await Gyroscope.isAvailableAsync();
        
        if (!accAvailable || !gyroAvailable) {
          setSensorAvailable(false);
          return;
        }

        Accelerometer.setUpdateInterval(100);
        Gyroscope.setUpdateInterval(100);

        accelerometerSubscription = Accelerometer.addListener((data) => {
          const newMetrics = sensorProcessor.processAccelerometerData(data);
          setMetrics(newMetrics);
        });

        gyroscopeSubscription = Gyroscope.addListener((data) => {
          sensorProcessor.processGyroscopeData(data);
        });

      } catch (error) {
        console.error('传感器错误:', error);
        setSensorAvailable(false);
      }
    };

    startSensors();

    return () => {
      accelerometerSubscription && accelerometerSubscription.remove();
      gyroscopeSubscription && gyroscopeSubscription.remove();
    };
  }, []);

  const MetricCard = ({ title, value, unit, color = '#4CAF50' }) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );

  if (!sensorAvailable) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ 传感器不可用</Text>
        <Text style={styles.errorSubtext}>请确保您的设备支持加速度计和陀螺仪</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>跑步经济性分析</Text>
      
      <View style={styles.metricsGrid}>
        <MetricCard 
          title="步频" 
          value={metrics.cadence} 
          unit="步/分钟" 
          color="#FF6B6B"
        />
        <MetricCard 
          title="垂直振幅" 
          value={metrics.verticalOscillation.toFixed(1)} 
          unit="厘米" 
          color="#4ECDC4"
        />
        <MetricCard 
          title="触地时间" 
          value={metrics.groundContactTime} 
          unit="毫秒" 
          color="#45B7D1"
        />
        <MetricCard 
          title="配速" 
          value={metrics.pace} 
          unit="/公里" 
          color="#FFA726"
        />
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>▶️ 跑步中 - 实时监测</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 60) / 2,
    backgroundColor: '#2d2d2d',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  metricUnit: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  metricTitle: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 8,
  },
  statusBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 15,
    alignItems: 'center',
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 24,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 100,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
});