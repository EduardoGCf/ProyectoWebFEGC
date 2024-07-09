document.addEventListener('DOMContentLoaded', () => {
    const leccionId = new URLSearchParams(window.location.search).get('id');
    const idcur = new URLSearchParams(window.location.search).get('cursoId');
    if (leccionId) {
        fetchLeccionData(leccionId);
    }

    document.querySelector('#btnGuardarLeccion').addEventListener('click', () => guardarLeccion(leccionId));
    document.querySelector('#btnEliminarLeccion').addEventListener('click', () => eliminarLeccion(leccionId,idcur));
    document.querySelector('#banner_leccion').addEventListener('change', mostrarVistaPreviaBanner);
    document.querySelector('#leccion__file').setAttribute('accept', '.txt');
    document.querySelector('#btnBorrarFile').addEventListener('click', borrarArchivoLeccion);
    document.querySelector('#btn-process').addEventListener('click', procesarVideo);
    document.querySelector('#btnVolverCurso').addEventListener('click', () => window.location.href = `listacursosadm.html`);
});

async function fetchLeccionData(leccionId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:4000/leccion/${leccionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const leccion = await response.json();
            document.querySelector('#nombre_leccion').value = leccion.titulo;
            document.querySelector('#youtube_link').value = leccion.contenidoVideo;
            document.querySelector('#descripcion_leccion').value = leccion.descripcion;

            if (leccion.banner) {
                const bannerPreview = document.querySelector('#banner-preview');
                bannerPreview.src = `data:image/jpeg;base64,${leccion.banner}`;
                bannerPreview.style.display = 'block';
            }

            if (leccion.contenidoTxt) {
                const leccionIframe = document.querySelector('#leccion__iframe');
                const blob = base64ToBlob(leccion.contenidoTxt, 'text/plain');
                const objectURL = URL.createObjectURL(blob);
                leccionIframe.src = objectURL;
                leccionIframe.style.display = 'block';
            }
            if (leccion.contenidoVideo) {
                mostrarVideo(leccion.contenidoVideo);
            }
        } else {
            const error = await response.json();
            console.error('Error al obtener la lección:', error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function base64ToBlob(base64, mime) {
    const byteChars = atob(base64);
    const byteNumbers = Array.from(byteChars, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
}

function mostrarVistaPreviaBanner(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const bannerPreview = document.querySelector('#banner-preview');
            bannerPreview.src = e.target.result;
            bannerPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}



function borrarArchivoLeccion() {
    const archivoLeccionInput = document.querySelector('#leccion__file');
    archivoLeccionInput.value = ''; // Limpiar el campo de archivo
    archivoLeccionInput.dataset.empty = 'true'; // Indicar que se debe enviar un archivo vacío
    const leccionIframe = document.querySelector('#leccion__iframe');
    leccionIframe.src = '';
}
function procesarVideo() {
    const videoLink = document.querySelector('#youtube_link').value;
    if (videoLink) {
        mostrarVideo(videoLink);
    }
}

function mostrarVideo(videoLink) {
    const videoArea = document.querySelector('#video-area');
    const infoVideo = document.querySelector('#info-video');
    videoArea.innerHTML = `<iframe width="560" height="315" src="${videoLink.replace('watch?v=', 'embed/')}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    infoVideo.style.display = 'block';
}


async function guardarLeccion(leccionId) {
    const token = localStorage.getItem('token');
    let titulo = document.querySelector('#nombre_leccion').value;
    const descripcion = document.querySelector('#descripcion_leccion').value;
    const contenidoVideo = document.querySelector('#youtube_link').value;
    const bannerInput = document.querySelector('#banner_leccion');
    const archivoLeccionInput = document.querySelector('#leccion__file');

if (titulo == "") {
    showError('input#nombre_leccion', 'Tiene que haber un nombre de la lección');
            valid = false;
    return;
}else{
    document.querySelector('#leccionNameError').style.display = 'none';
}

    const formData = new FormData();
    formData.append('cursoId', new URLSearchParams(window.location.search).get('cursoId'));
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('contenidoVideo', contenidoVideo);

    if (bannerInput.files.length > 0) {
        const bannerFile = bannerInput.files[0];
        formData.append('banner', bannerFile);
    }

    if (archivoLeccionInput.files.length > 0) {
        const archivoLeccionFile = archivoLeccionInput.files[0];
        formData.append('contenidoTxt', archivoLeccionFile);
    } else if (archivoLeccionInput.dataset.empty === 'true') {
        formData.append('borrarContenidoTxt', 'true');
    }

    try {
        const response = await fetch(`http://localhost:4000/leccion/${leccionId}`, {
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
async function eliminarLeccion(leccionId,idcur) {
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
            window.location.href = `cursoadm.html?id=${idcur}`;
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function showError(selector, message) {
    const input = document.querySelector(selector);
    const errorSpan = input.nextElementSibling;
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
}