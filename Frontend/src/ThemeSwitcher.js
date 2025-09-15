import React, { useState, useEffect } from 'react';

const themeOptions = ['light', 'dark', 'blue', 'green', 'purple', 'gold', 'orange', 'yellow', 'neon', 'radium'];


function ThemeSwitcher() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div style={{ marginBottom: 18, textAlign: 'right' }}>
      <label style={{ fontWeight: '600', marginRight: 8 }}>Theme:</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        style={{ padding: '6px 10px', borderRadius: '6px', fontWeight: 600 }}
      >
        {themeOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSwitcher;
