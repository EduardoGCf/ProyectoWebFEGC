// Obtener el ID de la categoría por su nombre
window.getCategoriaIdByName = async function(nombreCategoria) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:4000/categoria/nombre/${nombreCategoria}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const categoria = await response.json();
            return categoria ? categoria.idCategoria : null;
        } else {
            const error = await response.json();
            console.error('Error al obtener la categoría:', error.message);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Fetch para obtener todas las categorías y mostrarlas en el formulario de cursos y filtros
window.fetchCategorias = async function() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:4000/categoria', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const categorias = await response.json();
            const courseCategorySelect = document.querySelector('#categoria_curso_form');
            const filterCategorySelect = document.querySelector('#menu__categoria');
            const categoriaCrud = document.querySelector('#categoriaCrud');
            
            
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.idCategoria;
                option.textContent = categoria.nombre;
                courseCategorySelect.appendChild(option);
                categoriaCrud.appendChild(option.cloneNode(true));
                filterCategorySelect.appendChild(option.cloneNode(true));
            });
            window.reload();
        } else {
            const error = await response.json();
            console.error('Error al obtener las categorías:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.addCategoria = async function() {
    const categoryNameInput = document.querySelector('#nombre_categoria_form');
    const nombreCategoria = categoryNameInput.value.trim();
    const token = localStorage.getItem('token');

    if (nombreCategoria === '') {
        document.querySelector('#CategoriaError').textContent = 'Por favor, ingrese el nombre de la categoría';
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/categoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombre: nombreCategoria })
        });

        if (response.ok) {
            const categoria = await response.json();
            const courseCategorySelect = document.querySelector('#categoria_curso_form');
            const filterCategorySelect = document.querySelector('#menu__categoria');
            const categoriacrud = document.querySelector('#categoriaCrud');


            const option = document.createElement('option');
            option.value = categoria.idCategoria;
            option.textContent = categoria.nombre;
            courseCategorySelect.appendChild(option);
            categoriacrud.appendChild(option.cloneNode(true));
            filterCategorySelect.appendChild(option.cloneNode(true));
            categoryNameInput.value = '';
            fetchCursos(); // Actualizar la lista de cursos con la nueva categoría
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema con el servidor. Inténtalo de nuevo más tarde.');
    }
}

// Función para eliminar categoría
window.deleteCategoria = async function() {
    const categoryNameInput = document.querySelector('#categoriaCrud');
    const categoriaId = categoryNameInput.value.trim();
    const token = localStorage.getItem('token');


    try {

        const response = await fetch(`http://localhost:4000/categoria/${categoriaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            document.querySelector('#CategoriaError').textContent = '';
            categoryNameInput.value = '';
            // Actualizar el menú de categorías si es necesario
            location.reload();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema con el servidor. Inténtalo de nuevo más tarde.');
    }
}

window.updateCategoria = async function() {
    const categoryNameInput = document.querySelector('#categoriaCrud');
    const nombreEditadoin = document.querySelector('#nombre_categoria_form');
    const nombreEditado = nombreEditadoin.value.trim();
    const idCategoria = categoryNameInput.value.trim();
    const token = localStorage.getItem('token');
    if (idCategoria === '') {
        document.querySelector('#CategoriaError').textContent = 'Por favor, Seleccione una categoría';
        return;
    }
    if (nombreEditado === '') {
        document.querySelector('#CategoriaError').textContent = 'Por favor, ingrese el nombre de la categoría';
        return;
    }

    try {
        // Obtener el ID de la categoría por su nombre

        const response = await fetch(`http://localhost:4000/categoria/${idCategoria}/${nombreEditado}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            document.querySelector('#CategoriaError').textContent = '';
            categoryNameInput.value = '';
            // Actualizar el menú de categorías si es necesario
            location.reload();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema con el servidor. Inténtalo de nuevo más tarde.');
    }
}