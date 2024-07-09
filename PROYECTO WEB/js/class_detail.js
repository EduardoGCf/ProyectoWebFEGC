document.addEventListener('DOMContentLoaded', () => {
    const courseId = new URLSearchParams(window.location.search).get('idCurso');
    console.log('Course ID:', courseId); // Log para verificar el courseId
    if (courseId) {
        fetchCourseDetails(courseId);
        fetchLecciones(courseId);
    }

    const enrollButton = document.querySelector('#enroll-button');
    enrollButton.addEventListener('click', () => {
        enrollInCourse(courseId);
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
    const courseTitle = document.querySelector('#idNombreClase');
    const courseDescription = document.querySelector('#iddetalleClase');
    const courseImage = document.querySelector('#idImgCurso');

    courseTitle.textContent = course.nombre;
    courseDescription.textContent = course.descripcion;

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
        } else {
            const error = await response.json();
            console.error('Error al obtener las lecciones del curso:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayLecciones(lecciones) {
    const lessonsContainer = document.querySelector('#idlista-leccion');
    lessonsContainer.innerHTML = ''; // Limpiar lista de lecciones

    lecciones.forEach(leccion => {
        const lessonItem = document.createElement('li');
        lessonItem.className = 'lesson-item';
        lessonItem.innerHTML = `${leccion.titulo}`;
        lessonsContainer.appendChild(lessonItem);
    });
    console.log('Lessons displayed'); // Log para verificar la actualización del DOM
}

async function enrollInCourse(courseId) {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken(token);

    try {
        const isEnrolled = await checkEnrollment(userId, courseId);
        if (isEnrolled) {
            window.location.href = `class_detail_lg.html?idCurso=${courseId}`;
        } else {
            const response = await fetch('http://localhost:4000/matriculacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ idEstudiante: userId, idCurso: courseId })
            });
            console.log('Enrolling user in course:', userId, courseId);
            if (response.ok) {
                window.location.href = `class_detail_lg.html?idCurso=${courseId}`; // Redirigir o actualizar la página según sea necesario
            } else {
                const error = await response.json();
                console.error('Error al matricularse en el curso:', error.message);
                alert(`Error: ${error.message}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function checkEnrollment(userId, courseId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:4000/matriculacion/${userId}/${courseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const enrollments = await response.json();
            console.log('Enrollments:', enrollments); // Verificar el contenido de la respuesta
            return enrollments.length > 0;
        } else if (response.status === 404) {
            // Matriculación no encontrada, es válido continuar
            return false;
        } else {
            const error = await response.json();
            console.error('Error al verificar la matrícula:', error.message);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

function getUserIdFromToken(token) {
    if(token){const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;}
    window.location.href = '../VistasBasicas/login.html';
}
