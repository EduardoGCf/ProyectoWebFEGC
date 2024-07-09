async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/profile/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (response.ok) {
            const user = await response.json();
            console.log('Usuario autenticado:', user);
            
        } else {
            const error = await response.json();
            console.error('Error al obtener el perfil del usuario:', error.message);
            window.location.href = '../VistasBasicas/login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '../VistasBasicas/login.html';
    }
}
