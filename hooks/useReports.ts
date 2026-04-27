import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../lib/supabase';

export const useReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    const TOKEN_KEY = 'user_report_token';
    let userToken;

    // Logique de stockage isolée
    if (Platform.OS === 'web') {
      userToken = localStorage.getItem(TOKEN_KEY);
    } else {
      userToken = await SecureStore.getItemAsync(TOKEN_KEY);
    }

    if (!userToken) {
      setReports([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_token', userToken)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReports();
  }, []);

  // On retourne uniquement ce dont le composant a besoin
  return { reports, loading, refreshing, onRefresh };
};