document.addEventListener('DOMContentLoaded', () => {
    if (!isUserLoggedIn()) {
        alert('Por favor, inicie sesión para ver sus cursos.');
        window.location.href = '../VistasBasicas/login.html';
        return;
    }

    fetchMisCursos();

    // Añadir evento de búsqueda
    const searchInput = document.querySelector('#searchInput');
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        filterCursos(searchTerm);
    });

    // Prevenir el comportamiento por defecto al presionar Enter
    const searchForm = document.querySelector('.course-search form');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const searchTerm = searchInput.value.toLowerCase();
        filterCursos(searchTerm);
    });
});

function isUserLoggedIn() {
    const token = localStorage.getItem('token');
    return token !== null;
}

async function fetchMisCursos() {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken(token);
    console.log('Fetching courses for user ID:', userId); // Log para verificar la llamada a la API

    try {
        const response = await fetch('http://localhost:4000/matriculacion/mis-cursos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const cursos = await response.json();
            console.log('Courses:', cursos); // Log para verificar los datos recibidos
            displayCursos(cursos);
        } else {
            const error = await response.json();
            console.error('Error al obtener los cursos:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayCursos(cursos) {
    const courseList = document.querySelector('.course-list');
    courseList.innerHTML = ''; // Limpiar lista de cursos

    if (cursos.length === 0) {
        const noCoursesMessage = document.createElement('p');
        noCoursesMessage.textContent = 'No estás matriculado en ningún curso.';
        courseList.appendChild(noCoursesMessage);
        return;
    }

    cursos.forEach(curso => {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.dataset.nombreCurso = curso.nombre.toLowerCase(); // Añadir dataset para el nombre del curso
        if(!curso.imagen){
            curso.imagen = '../img/default-course.jpg';
        }
        courseItem.innerHTML = `
            <div class="image-container">
                <img src="${curso.imagen ? `data:image/jpeg;base64,${bufferToBase64(curso.imagen)}` : '../img/default-course.jpg'}" alt="${curso.nombre}">
            </div>
            <h3>${curso.nombre}</h3>
            <p>${curso.descripcion}</p>
            <div class="course-details">
                <a href="class_detail_lg.html?idCurso=${curso.idCurso}">Ir al curso</a>
            </div>
        `;
        courseList.appendChild(courseItem);
    });

    console.log('Courses displayed'); // Log para verificar la actualización del DOM
}

function bufferToBase64(buffer) {
    const binary = String.fromCharCode.apply(null, new Uint8Array(buffer.data));
    return btoa(binary);
}

function getUserIdFromToken(token) {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    } catch (e) {
        console.error('Error al decodificar el token:', e);
        return null;
    }
}

function filterCursos(searchTerm) {
    const courseItems = document.querySelectorAll('.course-item');
    courseItems.forEach(courseItem => {
        const nombreCurso = courseItem.dataset.nombreCurso;
        if (nombreCurso.includes(searchTerm)) {
            courseItem.style.display = 'block';
        } else {
            courseItem.style.display = 'none';
        }
    });
}
