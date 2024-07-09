// main.js
document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('#btnCrearCurso');
    const categoryAddButton = document.querySelector('#btnCrearCategoria');
    const categoryDeleteButton = document.querySelector('#btnEliminarCategoria'); // Botón para eliminar categoría
    const filterNameInput = document.querySelector('#filtro-nombre');
    const filterCategorySelect = document.querySelector('#menu__categoria');
    const editarCategoria = document.querySelector('#btnActualizarCategoria');
    

    addButton.addEventListener('click', addCurso);
    categoryAddButton.addEventListener('click', addCategoria);
    categoryDeleteButton.addEventListener('click', deleteCategoria); // Añadir el evento al botón de eliminar categoría
    filterNameInput.addEventListener('input', filterCursos);
    filterCategorySelect.addEventListener('change', filterCursos);
    editarCategoria.addEventListener('click', updateCategoria);

    // Verificar el estado de autenticación, cargar las categorías y los cursos
    checkAuthStatus().then(() => {
        fetchCategorias();
        fetchCursos();
    });
});
