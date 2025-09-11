import React from 'react';
import CommunityReports from './CommunityReports';

const WeatherAppLayout = ({
  location, setLocation, handleFetch, addFavorite, favorites, fetchFavorite,
  weather, forecast, selectedDayIndex, selectDay, suggestions,
  userMood, handleMoodSelect, listening, speaking, startListening,
  error, iconMap, userCoords,
}) => {

  return (
    <div className="container" style={{ maxWidth: 800, margin: '30px auto', padding: 30, background: 'white', borderRadius: 20, boxShadow: '0 8px 32px #cce8ff80' }}>
      {/* Search */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 36 }}>
        <input
          style={{ flex: 1, padding: 16, borderRadius: 12, border: '1.5px solid #aaa', fontSize: 18 }}
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city or coordinates"
          disabled={listening || speaking}
        />
        <button style={{ fontSize: 18, borderRadius: 12, padding: '12px 20px' }} onClick={handleFetch} disabled={listening || speaking}>Get Weather</button>
        <button style={{ fontSize: 18, borderRadius: 12, padding: '12px 20px' }} onClick={addFavorite} disabled={!weather || listening || speaking}>Save to Favorites</button>
        <button style={{ fontSize: 18, borderRadius: 12, padding: '12px 20px' }} onClick={startListening} disabled={listening || speaking}>
          {listening ? '🎙️ Listening...' : '🎤 Speak'}
        </button>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: '#007acc', marginBottom: 6 }}>Favorites</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {favorites.map(city => (
              <button key={city} style={{ background: '#eaf4fb', borderRadius: 8, padding: '6px 16px', color: '#1681c2', fontWeight: 600, fontSize: 16, border: '1px solid #c6e2fa' }} onClick={() => fetchFavorite(city)}>{city}</button>
            ))}
          </div>
        </div>
      )}

      {/* Current Weather */}
      {weather && (
        <div style={{ background: '#eaf7ff', borderRadius: 18, padding: 28, textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, color: '#1681c2', marginBottom: 16 }}>
            <i className={`wi ${iconMap[weather.condition.split(',')[0]]}`} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 40, color: '#007acc', marginBottom: 8 }}>{weather.temperature}°C</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{weather.condition}</div>
          <div style={{ fontSize: 18, color: '#1681c2' }}>{weather.location}</div>
          {weather.alert && <div style={{ marginTop: 12, color: '#ef3b29', fontWeight: 600 }}>Alert: {weather.alert}</div>}
        </div>
      )}

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, color: '#007acc', fontSize: 20, marginBottom: 12 }}>5-Day Forecast</div>
          <div style={{ display: 'flex', gap: 18, overflowX: 'auto' }}>
            {forecast.slice(0, 5).map((day, idx) => (
              <div
                key={day.date}
                style={{
                  flex: '0 0 110px',
                  padding: 12,
                  borderRadius: 14,
                  background: selectedDayIndex === idx ? '#b2e2fa' : '#f4faff',
                  boxShadow: selectedDayIndex === idx ? '0 6px 18px #bcdff870' : '0 1px 6px #dde4ee',
                  border: selectedDayIndex === idx ? '2px solid #1681c2' : '1.5px solid #afd9f7',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => selectDay(idx)}
              >
                <div style={{ fontWeight: 600 }}>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short'})}</div>
                <div style={{ fontSize: 28, margin: '10px 0 4px 0' }}>
                  <i className={`wi ${iconMap[day.conditions.split(',')[0]]}`} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{day.temperature}°C</div>
                <div style={{ fontSize: 14 }}>{day.conditions}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hourly Forecast */}
      {forecast.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontWeight: 700, color: '#1681c2', marginBottom: 10 }}>Hourly Forecast</div>
          <div style={{ display: 'flex', gap: 11, overflowX: 'auto' }}>
            {forecast[selectedDayIndex].hours.map((hour, idx) => (
              <div key={idx} style={{ minWidth: 65, background: '#f5f7fa', borderRadius: 8, textAlign: 'center', padding: 8, fontSize: 14 }}>
                <div><i className={`wi ${iconMap[hour.conditions] || 'wi-day-sunny'}`} style={{ fontSize: 20, color: '#007acc' }} /></div>
                <div>{hour.time}</div>
                <div style={{ fontWeight: 700 }}>{hour.temperature}°C</div>
                <div style={{ fontSize: 11 }}>{hour.conditions}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ color: '#1681c2', marginBottom: 12 }}>Suggested Activity</h3>
        <p style={{ fontSize: 18, fontStyle: 'italic' }}>{suggestions.activity}</p>
        <h3 style={{ color: '#1681c2', marginTop: 18, marginBottom: 8 }}>Mood Playlist</h3>
        <a href={suggestions.playlistUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007acc', fontWeight: 700, fontSize: 18 }}>{suggestions.playlistName}</a>
        <h3 style={{ color: '#1681c2', marginTop: 18, marginBottom: 8 }}>Motivational Quote</h3>
        <blockquote style={{ borderLeft: '4px solid #007acc', margin: '5px 0 0 0', paddingLeft: 12 }}>{suggestions.motivationalQuote}</blockquote>
      </div>
  
      {/* Community Reports - add CommunityReports component here if available */}
      {/* <CommunityReports userLocation={userCoords} /> */}

      {/* Mood Feedback */}
      <div style={{ backgroundColor: '#eef4fb', padding: '15px 25px', borderRadius: 12, boxShadow: '0 2px 8px #b3c9ee', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <label style={{ fontWeight: 700, fontSize: '1.2rem', color: '#1681c2' }}>How are you feeling today?</label>
        {['😃', '🙂', '😐', '🙁'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleMoodSelect(emoji)}
            style={{
              fontSize: 28,
              borderRadius: 8,
              border: userMood === emoji ? '2px solid #064e9d' : '2px solid transparent',
              padding: '6px 12px',
              backgroundColor: userMood === emoji ? '#0a74da' : 'transparent',
              color: userMood === emoji ? 'white' : '#222',
              cursor: 'pointer',
              transition: 'all 0.25s'
            }}
            title={`Select mood ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeatherAppLayout;
