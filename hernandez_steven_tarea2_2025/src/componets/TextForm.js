import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push, set } from 'firebase/database';

const TextForm = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      setMessage('Texto guardado correctamente');
      
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Agregar Nuevo Texto</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe tu texto aquí..."
            rows="4"
            style={{ width: '100%', padding: '10px' }}
            disabled={loading}
          />
        </div>
        
        {message && (
          <div>
            <p>{message}</p>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || !text.trim()}
          style={{ marginTop: '10px', padding: '10px' }}
        >
          {loading ? 'Guardando...' : 'Guardar en Firebase'}
        </button>
      </form>
    </div>
  );
};

export default TextForm;