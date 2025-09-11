import React, { useState } from 'react';

const CommunityReports = ({ userLocation }) => {
  const [description, setDescription] = useState('');
  const [imageData, setImageData] = useState(null);
  const [reports, setReports] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }
    const newReport = {
      id: Date.now(),
      description,
      image: imageData,
      location: userLocation,
      timestamp: new Date().toISOString(),
    };
    setReports([newReport, ...reports]);
    setDescription('');
    setImageData(null);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Share Your Local Weather</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <textarea
          placeholder="Describe current weather..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imageData && (
          <img
            src={imageData}
            alt="Preview"
            style={{ maxWidth: '100%', marginTop: 10, borderRadius: 10 }}
          />
        )}
        <button
          type="submit"
          style={{
            marginTop: 10,
            backgroundColor: '#007acc',
            color: '#fff',
            padding: '8px 15px',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Submit Report
        </button>
      </form>

      <div>
        <h4>Recent Reports</h4>
        {reports.length === 0 && <p>No reports yet.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {reports.map((r) => (
            <div
              key={r.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: 12,
                padding: 15,
                backgroundColor: '#f9faff',
              }}
            >
              <p>
                <strong>Description:</strong> {r.description}
              </p>
              {r.image && (
                <img
                  src={r.image}
                  alt="User upload"
                  style={{ maxWidth: '100%', borderRadius: 12, marginTop: 8 }}
                />
              )}
              <p style={{ fontSize: 'small', color: '#666', marginTop: 8 }}>
                Reported at: {new Date(r.timestamp).toLocaleString()}
              </p>
              {r.location && (
                <p style={{ fontSize: 'small', color: '#666' }}>
                  Location: {r.location.lat.toFixed(3)},{' '}
                  {r.location.lon.toFixed(3)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityReports;
