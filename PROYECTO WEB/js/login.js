document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const correoElectronico = document.querySelector('#username').value.trim();
        const contrasena = document.querySelector('#password').value.trim();

        // Limpiar mensajes de error
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Validaciones
        let valid = true;

        if (!correoElectronico) {
            showError('input#username', 'El campo correo electrónico es obligatorio');
            valid = false;
        }

        if (!contrasena) {
            showError('input#password', 'El campo contraseña es obligatorio');
            valid = false;
        }

        if (!valid) {
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Esto asegura que las cookies se incluyan en las solicitudes
                body: JSON.stringify({ correoElectronico, contrasena })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Resultado:', result);
                localStorage.setItem('token', result.token); // Almacena el token en localStorage
                window.location.href = '../index.html'; // Redirige al usuario después de iniciar sesión
            } else {
                const error = await response.json();
                showError('input#username', `Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            showError('input#username', 'Hubo un problema con el servidor. Inténtalo de nuevo más tarde.');
        }
    });

    function showError(selector, message) {
        const input = document.querySelector(selector);
        const errorSpan = input.nextElementSibling;
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
        }
    }
});
