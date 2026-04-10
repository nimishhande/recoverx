const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'recoverx-secret-key-2026';

// Initialize Supabase (Backend side)
const supabaseUrl = 'https://cixniiquleiqwyzgrazk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpeG5paXF1bGVpcXd5emdyYXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjMxMzcsImV4cCI6MjA5MTEzOTEzN30.X7pAUCCiHasG06Y9rKSXqjvu9ljTNOMqmc_hyp6aWnw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'RecoverX API is running' });
});

// POST /api/v1/auth/authenticate
app.post('/api/v1/auth/authenticate', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Login using Supabase Native Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({ message: authError?.message || 'Invalid credentials' });
    }

    // Fetch profile details (for role/name)
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // -- Self-Healing Profile Logic --
    // If profile is missing but user exists, let's create it on the fly
    if (!profile) {
      console.log('Self-healing profile for:', email);
      const metadata = authData.user.user_metadata || {};
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          firstname: metadata.firstname || email.split('@')[0],
          lastname: metadata.lastname || '',
          email: email,
          role: 'USER'
        }])
        .select()
        .single();
      profile = newProfile;
    }

    const metadata = authData.user.user_metadata || {};
    const fname = profile?.firstname || metadata.firstname || email.split('@')[0];
    const lname = profile?.lastname || metadata.lastname || '';

    // Generate JWT for current frontend compatibility
    const token = jwt.sign(
      { 
        id: authData.user.id, 
        email: authData.user.email, 
        role: profile?.role || 'USER', 
        firstname: fname, 
        lastname: lname 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/v1/auth/register
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1. Sign up in Supabase Native Auth with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstname,
          lastname
        }
      }
    });

    if (authError || !authData.user) {
      return res.status(400).json({ message: authError?.message || 'Registration failed' });
    }

    // 2. Create the profile record (linked to the Auth ID)
    try {
      await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          firstname,
          lastname,
          email,
          role: 'USER'
        }]);
    } catch (profileError) {
      console.error('Profile creation error (continuing anyway):', profileError);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: authData.user.id, email, role: 'USER', firstname, lastname },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, userId: authData.user.id, message: 'Registration successful' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ RecoverX Backend running on http://localhost:${PORT}`);
  console.log(`📡 Auth API: http://localhost:${PORT}/api/v1/auth`);
  console.log(`🔍 Health:   http://localhost:${PORT}/api/v1/health\n`);
});
