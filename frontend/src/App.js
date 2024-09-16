import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [menu, setMenu] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: ''
  });

  const [savedMenus, setSavedMenus] = useState([]);

  // Manejar cambios en los inputs de los días de la semana
  const handleChange = (day, value) => {
    setMenu({ ...menu, [day]: value });
  };

  // Enviar los datos del menú al backend para guardarlos
  const handleSubmit = () => {
    fetch('http://localhost:5000/api/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menu),  // Convertir el objeto menu a JSON
    })
    .then(response => response.json())
    .then(data => {
      console.log('Menú guardado exitosamente:', data);
      setSavedMenus([...savedMenus, data]);  // Actualizar el estado con el nuevo menú guardado
      setMenu({
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: ''
      });
    })
    .catch(error => {
      console.error('Error al guardar el menú:', error);
    });
  };

  // Obtener los menús guardados del backend cuando se carga la página
  useEffect(() => {
    fetch('http://localhost:5000/api/menus')
      .then(res => res.json())
      .then(data => setSavedMenus(data));
  }, []);

  return (
    <div className="container">
      <h1 className="title">Menú Semanal</h1>

      <div className="weekdays">
        {Object.keys(menu).map(day => (
          <div className="day-card" key={day}>
            <label className="label">{day}:</label>
            <input
              className="input"
              type="text"
              value={menu[day]}
              onChange={(e) => handleChange(day, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button className="button is-primary" onClick={handleSubmit}>
        Guardar Menú
      </button>

      <h2 className="subtitle">Menús Anteriores</h2>
      <ul>
        {savedMenus.map((menu, index) => (
          <li key={index} className="day-card">
            {Object.entries(menu).map(([day, meal]) => (
              <p key={day}>{day}: {meal}</p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
