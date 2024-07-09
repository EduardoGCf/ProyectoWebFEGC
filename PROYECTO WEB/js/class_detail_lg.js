document.addEventListener('DOMContentLoaded', () => {
    if (!isUserLoggedIn()) {
        alert('Por favor, inicie sesión para acceder a los detalles del curso.');
        window.location.href = '../VistasBasicas/login.html';
        return;
    }

    const courseId = new URLSearchParams(window.location.search).get('idCurso');
    console.log('Course ID:', courseId); // Log para verificar el courseId
    if (courseId) {
        fetchCourseDetails(courseId);
        fetchLecciones(courseId);
        fetchProgreso(courseId);
    }

    const unenrollButton = document.querySelector('.desmatricular');
    unenrollButton.addEventListener('click', () => {
        unenrollFromCourse(courseId);
    });
});

function isUserLoggedIn() {
    const token = localStorage.getItem('token');
    return token !== null;
}

async function fetchCourseDetails(courseId) {
    const token = localStorage.getItem('token');
    console.log('Fetching course details for ID:', courseId); // Log para verificar la llamada a la API
    try {
        const response = await fetch(`http://localhost:4000/curso/${courseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const course = await response.json();
            console.log('Course details:', course); // Log para verificar los datos recibidos
            displayCourseDetails(course);
        } else {
            const error = await response.json();
            console.error('Error al obtener los detalles del curso:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayCourseDetails(course) {
    const courseTitle = document.querySelector('.class-info h1');
    const courseDescription = document.querySelector('.class-description');
    const courseBodyText = document.querySelector('.body-text');
    const courseImage = document.querySelector('.image-container img');

    courseTitle.textContent = course.nombre;
    courseDescription.textContent = 'DESCRIPCION DE LA CLASE';
    courseBodyText.textContent = course.descripcion;
    
    if (course.imagen) {
        courseImage.src = `data:image/jpeg;base64,${course.imagen}`;
       
        console.log('Imagen', course.imagen);
    }
    courseImage.src = course.imagen ? `data:image/jpeg;base64,${course.imagen}` : '../img/default-curse.jpg';
    console.log('Course details displayed'); // Log para verificar la actualización del DOM
}

async function fetchLecciones(courseId) {
    const token = localStorage.getItem('token');
    console.log('Fetching lessons for course ID:', courseId); // Log para verificar la llamada a la API
    try {
        const response = await fetch(`http://localhost:4000/leccion?cursoId=${courseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const lecciones = await response.json();
            console.log('Lessons:', lecciones); // Log para verificar los datos recibidos
            displayLecciones(lecciones);
            fetchProgreso(courseId);
        } else {
            const error = await response.json();
            console.error('Error al obtener las lecciones del curso:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayLecciones(lecciones) {
    const lessonsContainer = document.querySelector('.lesson-list');
    lessonsContainer.innerHTML = ''; // Limpiar lista de lecciones

    lecciones.forEach(leccion => {
        console.log('Lección:', leccion); // Log para verificar los datos de la lección

        let imageUrl = leccion.banner ? `data:image/jpeg;base64,${bufferToBase64(leccion.banner)}` : '../img/default-lesson.jpg'; // Usa una imagen por defecto si no hay imagen
        
        const lessonItem = document.createElement('li');
        lessonItem.className = 'lesson';
        lessonItem.dataset.idLeccion = leccion.idLeccion; // Añadir data-id-leccion
        lessonItem.innerHTML = `
            <div>
                <a href="leccion.html#idLeccion=${leccion.idLeccion}" class="lesson-link">${leccion.titulo}</a>
                <p class="lesson-info">Informacion de la leccion</p>
                <p class="lesson-text">${leccion.descripcion}</p>
            </div>
            <div class="img__conta">
                <checkbox>
                    <input type="checkbox" class="checkbox-custom" disabled>
                </checkbox>
                <img src="${imageUrl}" alt="Lesson Image" id="bannerleccion">
            </div>
        `;
       
        lessonsContainer.appendChild(lessonItem);
    });

    document.querySelectorAll('.lesson-link').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const lessonId = event.target.closest('.lesson').dataset.idLeccion;
            if (isUserLoggedIn()) {
                await crearProgreso(lessonId);
                window.location.href = event.target.href;
            } else {
                alert('Por favor, inicie sesión para continuar.');
                window.location.href = '../VistasBasicas/login.html';
            }
        });
    });

    console.log('Lessons displayed'); // Log para verificar la actualización del DOM
}

async function fetchProgreso(courseId) {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken(token);
    console.log('Fetching progress for course ID:', courseId); // Log para verificar la llamada a la API

    try {
        const response = await fetch(`http://localhost:4000/progreso/${courseId}/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const progresos = await response.json();
            console.log('Progress:', progresos); // Log para verificar los datos recibidos
            if (progresos.length > 0){
                updateProgress(progresos);
            }
            
        } else {
            const error = await response.json();
            console.error('Error al obtener el progreso del curso:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateProgress(progresos) {
    const lessons = document.querySelectorAll('.lesson');
    let completedCount = 0;

    lessons.forEach(lesson => {
        const lessonId = parseInt(lesson.dataset.idLeccion);
        const checkbox = lesson.querySelector('.checkbox-custom');

        if (progresos.some(progreso => progreso.idLeccion === lessonId)) {
            checkbox.checked = true;
            completedCount++;
        }
    });

    const totalLessons = lessons.length;
    const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `${progressPercentage.toFixed(0)}%`;
}



async function crearProgreso(lessonId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Por favor, inicie sesión para continuar.');
        window.location.href = '../VistasBasicas/login.html';
        return;
    }

    const userId = getUserIdFromToken(token);
    console.log('Creating progress for lesson ID:', lessonId); 

    try {
        const response = await fetch('http://localhost:4000/progreso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idEstudiante: userId, idLeccion: lessonId })
        });

        if (response.ok) {
            console.log('Progreso creado exitosamente');
        } else {
            const error = await response.json();
            console.error('Error al crear el progreso:', error.message);
            alert(`Error: ${error.message}`);
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

async function unenrollFromCourse(courseId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Por favor, inicie sesión para continuar.');
        window.location.href = '../VistasBasicas/login.html';
        return;
    }

    const userId = getUserIdFromToken(token);
    console.log('Unenrolling user ID:', userId, 'from course ID:', courseId); // Log para verificar la desmatriculación

    try {
        const response = await fetch(`http://localhost:4000/matriculacion/${userId}/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            window.location.href = '../index.html'; // Redirigir a la página de inicio
        } else {
            const error = await response.json();
            console.error('Error al desmatricularse del curso:', error.message);
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
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

