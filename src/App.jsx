import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Form, Card } from 'react-bootstrap';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // API para obtener imágenes (ejemplo utilizando Unsplash API)
  const AccessKey = '95u9CAhw_8gy2l6UgBdmUU8m6YSmfKak2DGp_yK_T0E'
  const API_URL = `https://api.unsplash.com/photos?client_id=${AccessKey}`;
  const API_SEARCH_URL = `https://api.unsplash.com/search/photos?client_id=${AccessKey}&query=`;

  useEffect(() => {
    // Llama a la API cuando el componente se monte para obtener imágenes
    axios.get(API_URL)
      .then(response => {
        setPhotos(response.data);
        setFilteredPhotos(response.data); // Inicialmente, todas las imágenes están en filteredPhotos
        setCategories(['All', 'Nature', 'Technology', 'People', 'Animals', 'Fashion']); // Puedes personalizar las categorías
      })
      .catch(error => console.error(error));
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === 'All') {
      setFilteredPhotos(photos); // Mostrar todas las imágenes
    } else {
      // Filtrar imágenes basadas en categoría
      axios.get(`${API_SEARCH_URL}${category}`)
        .then(response => {
          setFilteredPhotos(response.data.results);
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <Container>
      <h1 className="text-center my-4">Galería de Fotos</h1>
      <Form>
        <Form.Group>
          <Form.Label>Filtrar por categoría</Form.Label>
          <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>

      <Row className="mt-4">
        {filteredPhotos.length > 0 ? (
          filteredPhotos.map((photo) => (
            <Col md={4} key={photo.id} className="mb-4">
              <Card>
                <Card.Img variant="top" src={photo.urls.small} alt={photo.alt_description} />
                <Card.Body>
                  <Card.Title>{photo.description || 'Sin título'}</Card.Title>
                  <Card.Text>
                    Autor: {photo.user.name}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No se encontraron imágenes para esta categoría.</p>
        )}
      </Row>
    </Container>
  );
};

export default App;
