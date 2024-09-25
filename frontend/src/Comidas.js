import React, { useState, useEffect } from 'react';

function Comidas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombrePlato, setNombrePlato] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [tipoComida, setTipoComida] = useState('Carne');
  const [momentoComida, setMomentoComida] = useState('Almuerzo');  // Nuevo campo para Almuerzo o Cena
  const [comidas, setComidas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');

  // Función para abrir el modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/Comida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombrePlato,
          ingredientes: ingredientes,
          tipo: tipoComida,
          momento: momentoComida,  // Enviar el momento (Almuerzo o Cena)
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la comida');
      }

      const nuevaComida = await response.json();
      setComidas([...comidas, nuevaComida]);
      setNombrePlato('');
      setIngredientes('');
      setTipoComida('Carne');
      setMomentoComida('Almuerzo');  // Restablecer el valor por defecto
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para obtener las comidas al cargar la página
  useEffect(() => {

    const fetchComidas = async () => {
      try {
        const response = await fetch('https://menusemanal.vercel.app/api/comidas');
        const data = await response.json();
        setComidas(data);
      } catch (error) {
        console.error('Error al obtener las comidas:', error);
      }
    };

    fetchComidas();

    return () => {
      isMounted = false;
    };
  }, []);

  const comidasFiltradas = filtroTipo
    ? comidas.filter((comida) => comida.tipo === filtroTipo)
    : comidas;

  return (
    <div className="comidas-container">
      <h2>Comidas</h2>
      <p>Aquí puedes gestionar las comidas disponibles.</p>

      <button className="agregar-comida-btn" onClick={handleOpenModal}>
        Agregar Comida
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar una nueva comida</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Nombre del Plato:</label>
                <input
                  type="text"
                  value={nombrePlato}
                  onChange={(e) => setNombrePlato(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Ingredientes:</label>
                <textarea
                  value={ingredientes}
                  onChange={(e) => setIngredientes(e.target.value)}
                  rows="4"
                  required
                />
              </div>
              <div>
                <label>Tipo de Comida:</label>
                <select
                  value={tipoComida}
                  onChange={(e) => setTipoComida(e.target.value)}
                  required
                >
                  <option value="Carne">Carne</option>
                  <option value="Vegetales">Vegetales</option>
                  <option value="Pollo">Pollo</option>
                  <option value="Pescado">Pescado</option>
                  <option value="Pastas">Pastas</option>
                </select>
              </div>
              {/* Nuevo campo para elegir entre Almuerzo o Cena */}
              <div>
                <label>¿Cuándo se sirve?:</label>
                <select
                  value={momentoComida}
                  onChange={(e) => setMomentoComida(e.target.value)}
                  required
                >
                  <option value="Almuerzo">Almuerzo</option>
                  <option value="Cena">Cena</option>
                </select>
              </div>
              <button type="submit">Agregar</button>
              <button type="button" onClick={handleCloseModal}>
                Cerrar
              </button>
            </form>
          </div>
        </div>
      )}

      <h3>Lista de Comidas</h3>

      <div className="filtro-tipo">
        {['Carne', 'Vegetales', 'Pollo', 'Pescado', 'Pastas'].map((tipo, index) => (
          <button
            key={index}
            className={`filtro-button ${filtroTipo === tipo ? 'active' : ''}`}
            onClick={() => setFiltroTipo(tipo)}
          >
            {tipo}
          </button>
        ))}
      </div>

      <div className="comidas-grid">
        {comidasFiltradas.map((comida) => (
          <div key={comida._id} className="comida-card">
            <h3>{comida.nombre}</h3>
            <p>Recomendado para: {comida.momento ? comida.momento : "SIN MOMENTO"}</p>
            <p className="comida-tipo">{comida.tipo ? comida.tipo.toUpperCase() : "SIN TIPO"}</p>
            <div className="comida-actions">
              <button className="add-button">+</button>
              <button className="edit-button">✎</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comidas;
