document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#register-form');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Obtener los valores de los campos
        const nombre = document.querySelector('input[name="nombre"]').value.trim();
        const apellido = document.querySelector('input[name="apellido"]').value.trim();
        const correoElectronico = document.querySelector('input[name="email"]').value.trim();
        const contrasena = document.querySelector('input[name="password"]').value.trim();
        const confirmContrasena = document.querySelector('input[name="confirm_password"]').value.trim();
        let nombreUsuario = nombre.replace(' ','_') + '_' + apellido.replace(' ','_');
        nombreUsuario = nombreUsuario.toLowerCase();

        // Limpiar mensajes de error
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Validaciones
        let valid = true;

        if (!nombre) {
            showError('input[name="nombre"]', 'El campo nombre es obligatorio');
            valid = false;
        }

        if (!apellido) {
            showError('input[name="apellido"]', 'El campo apellido es obligatorio');
            valid = false;
        }

        if (!correoElectronico) {
            showError('input[name="email"]', 'El campo correo electrónico es obligatorio');
            valid = false;
        }

        if (!contrasena) {
            showError('input[name="password"]', 'El campo contraseña es obligatorio');
            valid = false;
        }

        if (!confirmContrasena) {
            showError('input[name="confirm_password"]', 'El campo confirmar contraseña es obligatorio');
            valid = false;
        }

        if (contrasena !== confirmContrasena) {
            showError('input[name="confirm_password"]', 'Las contraseñas no coinciden');
            valid = false;
        }

        const minLength = 8;
        if (contrasena.length < minLength) {
            showError('input[name="password"]', `La contraseña debe tener al menos ${minLength} caracteres`);
            valid = false;
        }

        if (!valid) {
            return;
        }

        // Verificar si el correo electrónico ya está registrado
        try {
            const emailCheckResponse = await fetch('http://localhost:4000/auth/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: correoElectronico })
            });

            if (emailCheckResponse.ok) {
                const response = await fetch('http://localhost:4000/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombreUsuario, nombre, apellido, correoElectronico, contrasena })
                });

                if (response.ok) {
                    const result = await response.json();
                    window.location.href = 'login.html'; // Redirige al usuario después de registrarse
                } else {
                    const error = await response.json();
                    showError('input[name="email"]', `Error: ${error.message}`);
                }
            } else {
                const emailError = await emailCheckResponse.json();
                showError('input[name="email"]', emailError.message);
            }
        } catch (error) {
            console.error('Error:', error);
            showError('input[name="email"]', 'Hubo un problema con el servidor. Inténtalo de nuevo más tarde.');
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
