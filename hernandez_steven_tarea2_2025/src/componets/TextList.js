import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const TextList = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const textsRef = ref(database, 'texts');
    
    const unsubscribe = onValue(textsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const textsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        
        setTexts(textsArray);
      } else {
        setTexts([]);
      }
      
      setLoading(false);
      setError('');
    }, (error) => {
      console.error('Error:', error);
      setError('Error al cargar textos');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES');
  };

  if (loading) {
    return <div>Cargando textos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Textos Guardados ({texts.length})</h2>
      
      {texts.length === 0 ? (
        <div>
          <p>No hay textos guardados.</p>
        </div>
      ) : (
        <div>
          {texts.map((item) => (
            <div key={item.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <small>ID: {item.id.substring(0, 8)}...</small>
                <small>{formatDate(item.timestamp)}</small>
              </div>
              <div>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextList;