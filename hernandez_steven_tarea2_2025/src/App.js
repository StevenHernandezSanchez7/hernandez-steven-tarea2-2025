import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, push, set, onValue } from 'firebase/database';

function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [texts, setTexts] = useState([]);

  // Cargar textos
  useEffect(() => {
    const textsRef = ref(database, 'texts');
    
    const unsubscribe = onValue(textsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const textsArray = Object.values(data)
          .sort((a, b) => b.timestamp - a.timestamp);
        setTexts(textsArray);
      } else {
        setTexts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Guardar texto
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setMessage('Escribe algo');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const textsRef = ref(database, 'texts');
      const newTextRef = push(textsRef);
      
      const textData = {
        id: newTextRef.key,
        text: text.trim(),
        timestamp: Date.now(),
        date: new Date().toISOString()
      };
      
      await set(newTextRef, textData);
      
      setText('');
      setMessage('Guardado correctamente');
      
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Tarea II - Firebase</h1>
      
      <div>
        <h2>Agregar Texto</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe aquí..."
            rows="4"
            style={{ width: '100%' }}
            disabled={loading}
          />
          <br />
          
          {message && <p>{message}</p>}
          
          <button 
            type="submit" 
            disabled={loading || !text.trim()}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>

      <div>
        <h2>Textos ({texts.length})</h2>
        
        {texts.length === 0 ? (
          <p>No hay textos.</p>
        ) : (
          <ul>
            {texts.map((msg) => (
              <li key={msg.id}>
                <p>{msg.text}</p>
                <small>{new Date(msg.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;