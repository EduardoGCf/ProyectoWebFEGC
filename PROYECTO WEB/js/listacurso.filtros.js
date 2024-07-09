// filtros.js
window.filterCursos = function() {
    const filterNameInput = document.querySelector('#filtro-nombre');
    const filterCategorySelect = document.querySelector('#menu__categoria');
    const filterName = filterNameInput.value.toLowerCase();
    const filterCategory = filterCategorySelect.value;

    const items = document.querySelectorAll('.curso__item');
    items.forEach(item => {
        const cursoNombre = item.querySelector('.curso__nombre').textContent.toLowerCase();
        const cursoCategoria = item.dataset.idCategoria;

        if ((filterCategory === 'all' || filterCategory === cursoCategoria) &&
            (filterName === '' || cursoNombre.includes(filterName))) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}
