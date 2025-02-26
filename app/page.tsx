'use client';

import { useState } from 'react';
import Remixer from './components/Remixer';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Content Remixer</h1>
        <Remixer />
      </div>
    </main>
  );
} 