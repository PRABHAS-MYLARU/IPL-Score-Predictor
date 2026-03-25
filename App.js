import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [form, setForm] = useState({
    batting_team: 'CSK', bowling_team: 'MI', overs: '10.5', 
    wickets: '2', run_rate: '8.5'
  });
  const [result, setResult] = useState('');
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);

  const predictScore = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://192.168.1.100:8000/predict_win', form);
      setResult(`🎯 Score: ${res.data.predicted_score} runs\n⭐ Win: ${res.data.win_probability}`);
      setMetrics(res.data.metrics);
    } catch (error) {
      Alert.alert('Backend', 'Run: cd C:\\IPL && uvicorn app:app --reload');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏏 IPL Score Predictor Round 2</Text>
      
      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Batting Team (CSK)" 
          value={form.batting_team} onChangeText={t=>setForm({...form,batting_team:t})} />
        <TextInput style={styles.input} placeholder="Bowling Team (MI)" 
          value={form.bowling_team} onChangeText={t=>setForm({...form,bowling_team:t})} />
        <TextInput style={styles.input} placeholder="Overs (10.5)" keyboardType="numeric"
          value={form.overs} onChangeText={t=>setForm({...form,overs:t})} />
        <TextInput style={styles.input} placeholder="Wickets (2)" keyboardType="numeric" 
          value={form.wickets} onChangeText={t=>setForm({...form,wickets:t})} />
        <TextInput style={styles.input} placeholder="Run Rate (8.5)" keyboardType="numeric"
          value={form.run_rate} onChangeText={t=>setForm({...form,run_rate:t})} />
      </View>

      <TouchableOpacity style={[styles.btn, loading && styles.disabled]} 
        onPress={predictScore} disabled={loading}>
        <Text style={styles.btnText}>{loading ? '🔄 Predicting...' : '🚀 PREDICT'}</Text>
      </TouchableOpacity>

      {result ? <View style={styles.result}><Text style={styles.resultText}>{result}</Text></View> : null}
      {Object.keys(metrics).length ? (
        <View style={styles.metrics}>
          <Text>📊 MAE: {metrics.mae?.toFixed(1)} runs</Text>
          <Text>R²: {(metrics.r2*100)?.toFixed(1)}%</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'#f0f8ff', padding:20},
  title: {fontSize:28, fontWeight:'bold', textAlign:'center', margin:20, color:'#1e3a8a'},
  card: {backgroundColor:'white', padding:20, borderRadius:15, marginBottom:20, elevation:5},
  input: {borderWidth:1, borderColor:'#d1d5db', padding:15, borderRadius:10, marginBottom:10, fontSize:16},
  btn: {backgroundColor:'#3b82f6', padding:18, borderRadius:12, alignItems:'center'},
  btnText: {color:'white', fontSize:18, fontWeight:'bold'},
  disabled: {backgroundColor:'#9ca3af'},
  result: {backgroundColor:'#10b981', padding:20, borderRadius:15, marginVertical:10},
  resultText: {color:'white', fontSize:18, lineHeight:25},
  metrics: {backgroundColor:'#f59e0b', padding:20, borderRadius:15}
});
