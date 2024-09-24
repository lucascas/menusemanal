// Menus.js
import React, { useState, useEffect } from 'react';

function Menus() {
  const [savedMenus, setSavedMenus] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/menus')
      .then(res => res.json())
      .then(data => setSavedMenus(data))
      .catch(error => console.error('Error fetching menus:', error));
  }, []);

  return (
    <div>
      <h2>Listado de Menús</h2>
      <ul>
        {savedMenus.map((menu, index) => (
          <li key={index}>
            <h3>Menú {index + 1}</h3>
            {Object.keys(menu).slice(0, 7).map((day) => (
              <div key={day}>
                <strong>{day}:</strong> Almuerzo: {menu[day].lunch}, Cena: {menu[day].dinner}
              </div>
            ))}
            <p><strong>Ingredientes:</strong> {menu.ingredients}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menus;  // Asegúrate de que esto esté presente
