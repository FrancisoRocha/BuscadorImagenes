const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registroPagina = 40;
let totalPaginas;
let iterador;
let paginaActula = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}


function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino de busqueda');
        return;
    }

    buscarImagenes();
}

// MUESTRA ALERTA DE ERROR
function mostrarAlerta(mensaje) {

    const alertaExiste = document.querySelector('.bg-red-100');

    if (!alertaExiste) {
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3',
            'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong  class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
    `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000)
    }
}

function buscarImagenes(){

    const termino = document.querySelector('#termino').value;

    const key = '48809709-4b081f399b94cd72ea9d9f619';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPagina}&page=${paginaActula}`;

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => {
            totalPaginas = calcularPagina(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

//GENERADOR DE PAGINAS DE ACUERDO A LOS ELEMENTOS
function *generarPaginas(total){
    for( let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPagina(total){
    return parseInt(Math.ceil(total / registroPagina));
}

function mostrarImagenes(imagenes){
    console.log(imagenes);

    //LIMPIA EL HTML
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    //ITERAR SOBRE LAS IMAGENES E IMPRIMIR EL HTML
    imagenes.forEach( imagen => {
        const { previewURL, likes,views ,largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
                <div class="bg-white ">
                    <img class="w-full" src=${previewURL} alt={tags} />
                    <div class="p-4">
                        <p class="card-text font-bold">${likes} <span class="font-light">Me Gusta</span></p>
                        <p class="card-text font-bold">${views} <span class="font-light">Vistas</span></p>
        
                        <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                    </div>
                </div>
            </div>
            `;
    })

    //LIMPIAR EL PAGINADO PREVIO
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    imprimirPaginador()
}


function imprimirPaginador(){
    iterador = generarPaginas(totalPaginas)

    while(true){
        const { value, done } = iterador.next();
        if(done) return;

        // CASO CONTRARIO GENERA UN BOTON POR CADA ELEMENTO
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'mx-auto', 'mb-10', 'font-bold', 'rounded');
        boton.onclick = () => {
            paginaActula = value;
            buscarImagenes();
        }
        paginacionDiv.appendChild(boton);
    }
}
