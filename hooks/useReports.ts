import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Report } from '../types/report';
import { getUserToken } from '../utils/storage';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {

    const userToken = await getUserToken();

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
      setReports(data as Report[]);
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