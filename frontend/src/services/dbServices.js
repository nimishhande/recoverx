import { supabase } from '../supabase';

/**
 * 🚀 Supabase Database Services (Cloud Persistence)
 * 
 * Instructions:
 * Create the following tables in your Supabase SQL Editor to use this service:
 * 
 * CREATE TABLE projects (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES auth.users,  -- Cloud Identity UUID
 *   name TEXT NOT NULL,
 *   client TEXT,
 *   price DECIMAL(10,2) DEFAULT 0,
 *   estimated_hours DECIMAL(10,2) DEFAULT 0,
 *   logged_hours DECIMAL(10,2) DEFAULT 0,
 *   status TEXT DEFAULT 'Active',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
 * );
 * 
 * CREATE TABLE logs (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES auth.users,
 *   project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
 *   category TEXT,
 *   hours DECIMAL(10,2),
 *   description TEXT,
 *   date DATE DEFAULT CURRENT_DATE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
 * );
 */

export const addProjectToDB = async (userId, projectData) => {
  if (!supabase) return { success: false, error: 'Database not initialized' };
  if (!userId) throw new Error('User ID required for data integrity');
  
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      user_id: userId,
      name: projectData.name,
      client: projectData.client,
      price: Number(projectData.price) || 0,
      estimated_hours: Number(projectData.estimatedHours) || 0,
      logged_hours: 0,
      status: 'Active'
    }])
    .select();

  if (error) {
    console.error('Supabase project creation error:', error);
    return { success: false, error: error.message };
  }
  return { success: true, id: data[0].id };
};

export const getProjectsFromDB = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }
  
  // Transform back to expected UI format
  return data.map(p => ({
    ...p,
    estimatedHours: p.estimated_hours,
    loggedHours: p.logged_hours,
    minRate: p.min_rate,
    createdAt: { toMillis: () => new Date(p.created_at).getTime() }
  }));
};

export const getProjectFromDB = async (id) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return {
    ...data,
    estimatedHours: data.estimated_hours,
    loggedHours: data.logged_hours,
    minRate: data.min_rate,
    createdAt: { toMillis: () => new Date(data.created_at).getTime() }
  };
};

export const addTimeLogToDB = async (userId, projectId, logData) => {
  if (!supabase) return { success: false, error: 'Database not initialized' };
  if (!userId || !projectId) throw new Error('User and Project IDs required');

  // 1. Add Log
  const { data, error } = await supabase
    .from('logs')
    .insert([{
      user_id: userId,
      project_id: projectId,
      category: logData.category,
      hours: Number(logData.hours) || 0,
      description: logData.description || '',
      date: logData.date || new Date().toISOString().split('T')[0]
    }])
    .select();

  if (error) {
    console.error('Supabase logging error:', error);
    return { success: false, error: error.message };
  }

  // 2. Increment project logged_hours
  const project = await getProjectFromDB(projectId);
  if (project) {
    const updatedHours = (project.loggedHours || 0) + (Number(logData.hours) || 0);
    await supabase
      .from('projects')
      .update({ logged_hours: updatedHours })
      .eq('id', projectId);
  }

  return { success: true, id: data[0].id };
};

export const getTimeLogsFromDB = async (projectId) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('project_id', projectId)
    .order('date', { ascending: false });

  if (error) return [];
  return data.map(l => ({
    ...l,
    createdAt: { toMillis: () => new Date(l.created_at).getTime() }
  }));
};

export const getAllTimeLogsFromDB = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) return [];
  return data.map(l => ({
    ...l,
    createdAt: { toMillis: () => new Date(l.created_at).getTime() }
  }));
};
