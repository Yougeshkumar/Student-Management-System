import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AppRouter from './components/AppRouter';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRouter />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;