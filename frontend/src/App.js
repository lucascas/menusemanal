import React, { useState, useEffect } from 'react';
import './styles.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Menus from './Menus';  // Importar el nuevo componente
import Comidas from './Comidas';  // Importa el archivo correctamente

function App() {
  const [menu, setMenu] = useState({
    Monday: { lunch: '', dinner: '' },
    Tuesday: { lunch: '', dinner: '' },
    Wednesday: { lunch: '', dinner: '' },
    Thursday: { lunch: '', dinner: '' },
    Friday: { lunch: '', dinner: '' },
    Saturday: { lunch: '', dinner: '' },
    Sunday: { lunch: '', dinner: '' },
    ingredients: ''
  });

  const [comidas, setComidas] = useState([]);
  const [savedMenus, setSavedMenus] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/comidas')
      .then((res) => res.json())
      .then((data) => setComidas(data)); // Cargar todas las comidas
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleChange = (day, mealType, value) => {
    setMenu((prevMenu) => ({
      ...prevMenu,
      [day]: {
        ...prevMenu[day],
        [mealType]: value
      }
    }));
  };

  const addRecommendationToMeal = (day, mealType, comida) => {
    setMenu((prevMenu) => ({
      ...prevMenu,
      [day]: {
        ...prevMenu[day],
        [mealType]: comida.nombre  // Agregar el nombre de la comida al campo de Almuerzo o Cena
      }
    }));
  };

  const handleIngredientsChange = (e) => {
    setMenu((prevMenu) => ({
      ...prevMenu,
      ingredients: e.target.value,
    }));
  };

  const handleSubmit = () => {
    fetch('http://localhost:5000/api/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menu),
    })
      .then((response) => response.json())
      .then((data) => {
        setSavedMenus([...savedMenus, data]);
        setMenu({
          Monday: { lunch: '', dinner: '' },
          Tuesday: { lunch: '', dinner: '' },
          Wednesday: { lunch: '', dinner: '' },
          Thursday: { lunch: '', dinner: '' },
          Friday: { lunch: '', dinner: '' },
          Saturday: { lunch: '', dinner: '' },
          Sunday: { lunch: '', dinner: '' },
          ingredients: ''
        });
      })
      .catch((error) => {
        console.error('Error al guardar el menú:', error);
      });
  };

  return (
    <Router>
      <div className="container">
        <header className="header">
          <div className="hamburger-menu" onClick={toggleMenu}>
            &#9776;
          </div>
          <h1 className="title">Menú Semanal</h1>
        </header>

        <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
          <nav>
            <ul>
              <li>
                <Link to="/" onClick={toggleMenu}>Home</Link>
              </li>
              <li>
                <Link to="/menus" onClick={toggleMenu}>Menúes</Link>
              </li>
              <li>
                <Link to="/comidas" onClick={toggleMenu}>Comidas</Link>
              </li>
            </ul>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={
            <div>
              <div className="weekdays">
                {Object.keys(menu).slice(0, 7).map(day => (
                  <div className="day-card" key={day}>
                    <h3>{day}</h3>
                    <div>
                      <label>Almuerzo</label>
                      <input
                        type="text"
                        placeholder="Almuerzo"
                        value={menu[day].lunch}
                        onChange={(e) => handleChange(day, 'lunch', e.target.value)}
                      />
                      {/* Recomendaciones de comida para el almuerzo */}
                      <div className="recommendations">
                        {comidas.filter(c => c.momento === 'Almuerzo').map(comida => (
                          <div key={comida._id} className="pill" onClick={() => addRecommendationToMeal(day, 'lunch', comida)}>
                            {comida.nombre} <span className="add-icon">+</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <label>Cena</label>
                      <input
                        type="text"
                        placeholder="Cena"
                        value={menu[day].dinner}
                        onChange={(e) => handleChange(day, 'dinner', e.target.value)}
                      />
                      {/* Recomendaciones de comida para la cena */}
                      <div className="recommendations">
                        {comidas.filter(c => c.momento === 'Cena').map(comida => (
                          <div key={comida._id} className="pill" onClick={() => addRecommendationToMeal(day, 'dinner', comida)}>
                            {comida.nombre} <span className="add-icon">+</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ingredients-section">
                <h3>Ingredientes</h3>
                <textarea
                  placeholder="Escribe los ingredientes aquí..."
                  value={menu.ingredients}
                  onChange={(e) => handleIngredientsChange(e)}
                  rows="4"
                  cols="50"
                />
              </div>

              <button className="button button-custom" onClick={handleSubmit}>
                Guardar Menú
              </button>
            </div>
          } />
          <Route path="/menus" element={<Menus />} />
          <Route path="/comidas" element={<Comidas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
