// Obtener el nombre de la categoría por su ID
async function getCategoriaNombreById(categoriaId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:4000/categoria/${categoriaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const categoria = await response.json();
            return categoria ? categoria.nombre : 'Desconocido';
        } else {
            const error = await response.json();
            console.error('Error al obtener la categoría:', error.message);
            return 'Desconocido';
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Desconocido';
    }
}

// Fetch para obtener todos los cursos y mostrar en la lista
window.fetchCursos = async function() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:4000/curso', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const cursos = await response.json();
            const courseList = document.querySelector('#listado__cursos');
            courseList.innerHTML = ''; 

            for (const curso of cursos) {
                const categoriaNombre = await getCategoriaNombreById(curso.idCategoria);
                appendCursoToList(curso, categoriaNombre);
            }
        } else {
            const error = await response.json();
            console.error('Error al obtener los cursos:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Añadir curso a la lista
window.appendCursoToList = function(curso, categoriaNombre) {
    const listItem = document.createElement('li');
    listItem.className = 'curso__item';
    listItem.dataset.idCategoria = curso.idCategoria;
    listItem.innerHTML = `
        <span class="curso__id">${curso.idCurso}</span>
        <a href="cursoadm.html?id=${curso.idCurso}" class="curso__nombre">${curso.nombre}</a>
        <span class="categ" id="categoName">${categoriaNombre}</span>
        <button class="btnEliminarCurso" data-id="${curso.idCurso}">Eliminar</button>
    `;
    const courseList = document.querySelector('#listado__cursos');
    courseList.appendChild(listItem);

    // Agregar evento de eliminación
    listItem.querySelector('.btnEliminarCurso').addEventListener('click', eliminarCurso);
}

// Eliminar curso
async function eliminarCurso(event) {
    const cursoId = event.target.dataset.id;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:4000/curso/${cursoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            event.target.closest('.curso__item').remove();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
        location.reload();

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema con el servidor. Inténtalo de nuevo más tarde.');
    }
}

// Añadir curso
window.addCurso = async function() {
    const courseNameInput = document.querySelector('#nombre_curso_form');
    const courseCategorySelect = document.querySelector('#categoria_curso_form');
    const nombre = courseNameInput.value.trim();
    const categoriaId = courseCategorySelect.value;
    const token = localStorage.getItem('token');

    if (!nombre || !categoriaId) {
        
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', 'Descripción de ejemplo');
    formData.append('idCategoria', categoriaId);
    formData.append('imagen', '../img/default-curse.jpg'); 

    try {
        const response = await fetch('http://localhost:4000/curso', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const nuevoCurso = await response.json();
            const categoriaNombre = await getCategoriaNombreById(categoriaId);
            appendCursoToList(nuevoCurso, categoriaNombre);
            courseNameInput.value = '';
            courseCategorySelect.value = '';
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
