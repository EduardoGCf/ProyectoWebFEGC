document.addEventListener('DOMContentLoaded', () => {
    const menuUsuario = document.getElementById('menuUsuario');
    const token = localStorage.getItem('token');

    async function fetchUser() {
        try {
            const response = await fetch('http://localhost:4000/profile/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const user = await response.json();
                return user;
            } else {
                console.error('Error al obtener el perfil del usuario:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    function renderMenu(user) {
        menuUsuario.innerHTML = '';
        if (user) {
            // Usuario autenticado
            const logoutItem = document.createElement('li');
            logoutItem.innerHTML = '<a href="#">Logout</a>';
            logoutItem.addEventListener('click', async () => {
                try {
                    const response = await fetch('http://localhost:4000/auth/logout', {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (response.ok) {
                        localStorage.removeItem('token');
                        window.location.href = '../VistasBasicas/login.html';
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Server error. Please try again later.');
                }
            });

            if (user.tipoDeUsuario === 'Administrador') {
                const myUsernameItem = document.createElement('li');
                myUsernameItem.innerHTML = `<p>${user.nombreUsuario}</p>`;
                const editCoursesItem = document.createElement('li');
                editCoursesItem.innerHTML = '<a href="../Administrador/listacursosadm.html">Editar Cursos</a>';
                const myCoursesItem = document.createElement('li');
                myCoursesItem.innerHTML = '<a href="../VistasBasicas/mis_cursos.html">Mis Cursos</a>';
                menuUsuario.appendChild(myUsernameItem);
                menuUsuario.appendChild(editCoursesItem);
                menuUsuario.appendChild(myCoursesItem);
            } else {
                const myUsernameItem = document.createElement('li');
                myUsernameItem.innerHTML = `<p>${user.nombreUsuario}</p>`;
                const myCoursesItem = document.createElement('li');
                myCoursesItem.innerHTML = '<a href="../VistasBasicas/mis_cursos.html">Mis Cursos</a>';
                menuUsuario.appendChild(myUsernameItem);
                menuUsuario.appendChild(myCoursesItem);
                if (estamosEnIndex()) {
                    window.location.href = '../VistasBasicas/mis_cursos.html';
                } 
            }
            menuUsuario.appendChild(logoutItem);
        } else {
            // Usuario no autenticado
            const loginItem = document.createElement('li');
            loginItem.innerHTML = '<a href="../VistasBasicas/login.html">Login</a>';
            const signUpItem = document.createElement('li');
            signUpItem.innerHTML = '<a href="../VistasBasicas/sign_up.html">Sign Up</a>';
            menuUsuario.appendChild(loginItem);
            menuUsuario.appendChild(signUpItem);
            localStorage.removeItem('token');
        }
    }

    if (token) {
        fetchUser().then(user => renderMenu(user));
    } else {
        renderMenu(null);
    }
});
function estamosEnIndex() {
    const pathname = document.location.pathname;
    return pathname === '/' || pathname === '/index.html';
}
