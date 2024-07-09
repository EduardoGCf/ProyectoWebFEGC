document.addEventListener('DOMContentLoaded', () => {
    if (!isUserLoggedIn()) {
        alert('Por favor, inicie sesión para acceder a los detalles de la lección.');
        window.location.href = '../VistasBasicas/login.html';
        return;
    }

    const lessonId = new URLSearchParams(window.location.hash.substring(1)).get('idLeccion');
    console.log('Lesson ID:', lessonId); // Log para verificar el lessonId
    if (lessonId) {
        fetchLessonDetails(lessonId);
    }
});

function isUserLoggedIn() {
    const token = localStorage.getItem('token');
    return token !== null;
}

async function fetchLessonDetails(lessonId) {
    const token = localStorage.getItem('token');
    console.log('Fetching lesson details for ID:', lessonId); // Log para verificar la llamada a la API
    try {
        const response = await fetch(`http://localhost:4000/leccion/${lessonId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const lesson = await response.json();
            console.log('Lesson details:', lesson); // Log para verificar los datos recibidos
            displayLessonDetails(lesson);
        } else {
            const error = await response.json();
            console.error('Error al obtener los detalles de la lección:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayLessonDetails(lesson) {
    const lessonTitle = document.querySelector('#lessonTitle');
    const lessonDescription = document.querySelector('#lessonDescription');
    const lessonContent = document.querySelector('#lessonContent');
    const lessonVideo = document.querySelector('#lessonVideo');

    lessonTitle.textContent = lesson.titulo;
    lessonDescription.textContent = lesson.descripcion;

    if (lesson.contenidoTxt) {
        const decodedContent = decodeBase64(lesson.contenidoTxt); // Decodificar base64 a texto
        lessonContent.innerHTML = `<pre>${decodedContent}</pre>`; // Mostrar contenido de texto decodificado en un <pre>
    }

    if (lesson.contenidoVideo) {
        const videoId = getYouTubeVideoId(lesson.contenidoVideo);
        if (videoId) {
            const video = document.createElement('iframe');
            video.src = `https://www.youtube.com/embed/${videoId}`;
            video.width = '560';
            video.height = '315';
            video.frameBorder = '0';
            video.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            video.allowFullscreen = true;
            lessonVideo.appendChild(video);
            lessonVideo.style.display = 'block';
        } else {
            console.error('Error: Video URL no válida');
        }
    }

    console.log('Lesson details displayed'); // Log para verificar la actualización del DOM
}


function decodeBase64(base64String) {
    try {
        const binaryString = atob(base64String);
        return decodeURIComponent(escape(binaryString));
    } catch (error) {
        console.error('Error al decodificar el texto base64:', error);
        return '';
    }
}

function getYouTubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
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
