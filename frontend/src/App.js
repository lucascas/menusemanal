import React, { useState, useEffect } from 'react';
import './styles.css';
import emailjs from 'emailjs-com';

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

  const [savedMenus, setSavedMenus] = useState([]);

  // Manejar cambios en los inputs de cada día
  const handleChange = (day, mealType, value) => {
    setMenu(prevMenu => ({
      ...prevMenu,
      [day]: {
        ...prevMenu[day],
        [mealType]: value
      }
    }));
  };

  // Manejar cambios en el campo de ingredientes
  const handleIngredientsChange = (e) => {
    setMenu(prevMenu => ({
      ...prevMenu,
      ingredients: e.target.value
    }));
  };

  // Enviar correo con EmailJS
  const sendEmail = (menuData) => {
    const templateParams = {
      to_email: 'lucas.castillo@gmail.com', // Dirección de correo válida
      to_name: 'Lucas Castillo',
      MondayLunch: menuData.Monday.lunch,
      MondayDinner: menuData.Monday.dinner,
      TuesdayLunch: menuData.Tuesday.lunch,
      TuesdayDinner: menuData.Tuesday.dinner,
      WednesdayLunch: menuData.Wednesday.lunch,
      WednesdayDinner: menuData.Wednesday.dinner,
      ThursdayLunch: menuData.Thursday.lunch,
      ThursdayDinner: menuData.Thursday.dinner,
      FridayLunch: menuData.Friday.lunch,
      FridayDinner: menuData.Friday.dinner,
      SaturdayLunch: menuData.Saturday.lunch,
      SaturdayDinner: menuData.Saturday.dinner,
      SundayLunch: menuData.Sunday.lunch,
      SundayDinner: menuData.Sunday.dinner,
      ingredients: menuData.ingredients
    };

    emailjs.send('service_0isjz8r', 'template_oe1o3vo', templateParams, 'su7bu8tVLFRR-ssfd')
      .then((response) => {
        console.log('Correo enviado exitosamente:', response.status, response.text);
      }, (error) => {
        console.error('Error al enviar el correo:', error);
      });
  };

  // Enviar los datos del menú al backend para guardarlos
  const handleSubmit = () => {
    fetch('http://localhost:5000/api/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menu),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Menú guardado exitosamente:', data);
      setSavedMenus([...savedMenus, data]);

      // Llamar a la función para enviar el correo con EmailJS
      sendEmail(menu);

      // Reiniciar el formulario
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
    .catch(error => {
      console.error('Error al guardar el menú:', error);
    });
  };

  // Obtener menús guardados del backend
  useEffect(() => {
    fetch('http://localhost:5000/api/menus')
      .then(res => res.json())
      .then(data => setSavedMenus(data));
  }, []);

  return (
    <div className="container">
      <h1 className="title">Menú Semanal</h1>

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
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Cena</label>
              <input
                type="text"
                placeholder="Cena"
                value={menu[day].dinner}
                onChange={(e) => handleChange(day, 'dinner', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Campo adicional para Ingredientes */}
      <div className="ingredients-section">
        <h3>Ingredientes</h3>
        <textarea
          placeholder="Escribe los ingredientes aquí..."
          value={menu.ingredients}
          onChange={handleIngredientsChange}
          rows="4"
          cols="50"
        />
      </div>

      <button className="button button-custom" onClick={handleSubmit}>
        Guardar Menú
      </button>

      <h2>Menús Guardados</h2>
      <ul>
        {savedMenus.map((menu, index) => (
          <li key={index}>
            {Object.keys(menu).slice(0, 7).map(day => (
              <div key={day}>
                <strong>{day}:</strong> Almuerzo: {menu[day].lunch}, Cena: {menu[day].dinner}
              </div>
            ))}
            <div>
              <strong>Ingredientes:</strong> {menu.ingredients}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
