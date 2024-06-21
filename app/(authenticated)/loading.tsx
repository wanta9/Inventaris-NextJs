'use client';

import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';

const Loading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Contoh penggunaan useEffect untuk simulasi loading
    const timer = setTimeout(() => {
      setLoading(false); // Setelah 2 detik, set loading ke false
    }, 2000);

    return () => clearTimeout(timer); // Membersihkan timer saat komponen dilepas
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      {loading ? (
        <Spin size="large" tip="Loading..." />
      ) : (
        <div>
          <h1>Content Loaded</h1>
          <p>Your content here.</p>
        </div>
      )}
    </div>
  );
};

export default Loading;
