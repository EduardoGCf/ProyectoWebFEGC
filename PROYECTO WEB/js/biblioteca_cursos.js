document.addEventListener('DOMContentLoaded', () => {
    const filterNameInput = document.querySelector('#filtro-nombre');
    const filterCategorySelect = document.querySelector('#menu__categoria');
    const courseContainer = document.querySelector('.Curso__list ul');
    
    filterNameInput.addEventListener('input', filterCursos);
    filterCategorySelect.addEventListener('change', filterCursos);

    console.log('Fetching categories and courses...');
    fetchCategorias();
    fetchCursos();
});

async function fetchCategorias() {
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
            const filterCategorySelect = document.querySelector('#menu__categoria');
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.idCategoria;
                option.textContent = categoria.nombre;
                filterCategorySelect.appendChild(option);
            });
            console.log('Categories fetched successfully:', categorias);
        } else {
            const error = await response.json();
            console.error('Error al obtener las categorías:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchCursos() {
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
            console.log('Courses fetched successfully:', cursos);
            displayCursos(cursos);
        } else {
            const error = await response.json();
            console.error('Error al obtener los cursos:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer.data);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function displayCursos(cursos) {
    const courseContainer = document.querySelector('.Curso__list ul');
    courseContainer.innerHTML = ''; // Limpiar lista de cursos

    cursos.forEach(curso => {
        console.log('Processing course:', curso);
        const courseItem = document.createElement('li');
        courseItem.className = 'course-item';
        courseItem.dataset.idCategoria = curso.idCategoria;

        // Convertir imagen buffer a base64 y crear URL
        let imageUrl = '';
        if (curso.imagen && curso.imagen.data) {
            try {
                const base64String = bufferToBase64(curso.imagen);
                imageUrl = `data:image/jpeg;base64,${base64String}`;
               
                console.log('Image URL created:', imageUrl);
            } catch (error) {
                console.error('Error al convertir la imagen buffer a base64:', error);
            }
        } else {
            
            imageUrl = '../img/default-curse.jpg';
            console.log('No image for course:', curso.nombre, imageUrl);
                    

        }
        
        courseItem.innerHTML = `
            <div class="image-container">
                <img src="${imageUrl}" alt="${curso.nombre}">
            </div>
            <div class="course-details">
                <a href="class_detail.html?idCurso=${curso.idCurso}">${curso.nombre}</a>
                <p>${curso.descripcion}</p>
            </div>
        `;
        courseContainer.appendChild(courseItem);
    });
}

function filterCursos() {
    const filterName = document.querySelector('#filtro-nombre').value.toLowerCase();
    const filterCategory = document.querySelector('#menu__categoria').value;
    const courses = document.querySelectorAll('.course-item');

    courses.forEach(course => {
        const courseName = course.querySelector('.course-details a').textContent.toLowerCase();
        const courseCategory = course.dataset.idCategoria;

        if ((filterCategory === 'all' || filterCategory === courseCategory) &&
            (filterName === '' || courseName.includes(filterName))) {
            course.style.display = '';
        } else {
            course.style.display = 'none';
        }
    });
}
