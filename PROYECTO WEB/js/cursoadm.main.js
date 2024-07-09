document.addEventListener('DOMContentLoaded', async () => {
    const cursoId = new URLSearchParams(window.location.search).get('id');
    if (cursoId) {
        await fetchCursoData(cursoId);
        await fetchLecciones(cursoId);
    }

    const btnGuardarCurso = document.querySelector('#btnGuardarCurso');
    const btnEliminarCurso = document.querySelector('#btnEliminarCurso');
    const formCrearLeccion = document.querySelector('#formCrearLeccion');
    document.querySelector('#imagen_curso').setAttribute('accept', '.jpg,.jpeg,.png,.gif');
    document.querySelector('#imagen_curso').addEventListener('change', mostrarVistaPreviaBanner);
    btnGuardarCurso.addEventListener('click', () => guardarCurso(cursoId));
    btnEliminarCurso.addEventListener('click', () => eliminarCurso(cursoId));
    formCrearLeccion.addEventListener('submit', (event) => {
        guardarCurso(cursoId);
        event.preventDefault();
        crearLeccion(cursoId);
    });
});



function mostrarVistaPreviaBanner(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const bannerPreview = document.querySelector('#img_curso');
            bannerPreview.src = e.target.result;
            bannerPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

async function fetchCursoData(cursoId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:4000/curso/${cursoId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const curso = await response.json();
            document.querySelector('#nombre_curso').value = curso.nombre;
            document.querySelector('#descripcion_curso').value = curso.descripcion;
            
            // Decodificar la imagen del curso
            const imgCurso = document.querySelector('#img_curso');
            if (curso.imagen) {
                const responseImagen = await fetch(`data:image/jpeg;base64,${curso.imagen}`);
                const blob = await responseImagen.blob();
                const objectURL = URL.createObjectURL(blob);
                imgCurso.src = objectURL;
            }

            // Rellenar el select de categorías
            await fetchCategorias(curso.idCategoria);
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function fetchCategorias(selectedCategoryId) {
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
            const selectCategoria = document.querySelector('#categoria_curso');
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.idCategoria;
                option.text = categoria.nombre;
                if (categoria.idCategoria === selectedCategoryId) {
                    option.selected = true;
                }
                selectCategoria.appendChild(option);
            });
        } else {
            const error = await response.json();
            console.error('Error al obtener las categorías:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchLecciones(cursoId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:4000/leccion?cursoId=${cursoId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const lecciones = await response.json();
            const listadoLeccion = document.querySelector('#listado__leccion');
            listadoLeccion.innerHTML = ''; // Limpiar la lista antes de añadir nuevas lecciones
            lecciones.forEach(leccion => {
                const listItem = document.createElement('li');
                listItem.className = 'lecciono__item';
                listItem.innerHTML = `
                    <p class="leccion__id">${leccion.idLeccion}</p>
                    <a href="leccionadm.html?id=${leccion.idLeccion}?&cursoId=${cursoId}" class="leccion__nombre">${leccion.titulo}</a>
                    <button class="leccion__btn" onclick="editarLeccion(${leccion.idLeccion})">Editar</button>
                    <button class="leccion__btn" onclick="eliminarLeccion(${leccion.idLeccion})">Eliminar</button>
                `;
                listadoLeccion.appendChild(listItem);
            });
        } else {
            const error = await response.json();
            console.error('Error al obtener las lecciones:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function guardarCurso(cursoId) {
    const token = localStorage.getItem('token');
    const nombre = document.querySelector('#nombre_curso').value;
    const categoriaId = document.querySelector('#categoria_curso').value;
    const descripcion = document.querySelector('#descripcion_curso').value;
    const imagenInput = document.querySelector('#imagen_curso');

    console.log('Valores del formulario:', { nombre, categoriaId, descripcion });

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('idCategoria', categoriaId);
    formData.append('descripcion', descripcion);

    if (imagenInput.files.length > 0) {
        const file = imagenInput.files[0];
        formData.append('imagen', file);
    } else {
        console.log('No se seleccionó ninguna imagen.');
    }

    try {
        const response = await fetch(`http://localhost:4000/curso/${cursoId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            location.reload();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



async function eliminarCurso(cursoId) {
    const token = localStorage.getItem('token');

    if (!confirm('¿Estás seguro de que quieres eliminar este curso?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/curso/${cursoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            window.location.href = 'listacursosadm.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function crearLeccion(cursoId) {
    const token = localStorage.getItem('token');
    const nombreLeccion = document.querySelector('#nombre_leccion').value;
    if (!nombreLeccion) {
         return;
    }
    const leccionData = {
        idCurso: cursoId,
        titulo: nombreLeccion,
        descripcion: '',
        contenidoTxt: null,
        contenidoVideo: '',
        banner: '../img/default-lesson.jpg'
    };

    try {
        const response = await fetch('http://localhost:4000/leccion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(leccionData)
        });

        if (response.ok) {
            location.reload();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function editarLeccion(leccionId) {
    window.location.href = `leccionadm.html?id=${leccionId}`;
}

async function eliminarLeccion(leccionId) {
    const token = localStorage.getItem('token');

    if (!confirm('¿Estás seguro de que quieres eliminar esta lección?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/leccion/${leccionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            location.reload();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
