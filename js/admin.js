/**
 * ==========================================================================
 * Lógica de Control e Ingreso de Nuevos Productos - A1Click Admin
 * ==========================================================================
 * 
 * Este script administra el comportamiento interactivo del formulario de 
 * productos, implementando los "Controles GUI" y "Controles Internos" 
 * (validaciones estrictas) requeridos para el ingreso de datos al inventario.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Selectores de Elementos del DOM
    // ---------------------------------------------------------
    const form = document.getElementById('product-form');
    const inputName = document.getElementById('product-name');
    const inputSku = document.getElementById('product-sku');
    const inputPrice = document.getElementById('product-price');
    const inputStock = document.getElementById('product-stock');
    const inputImage = document.getElementById('product-image');
    const selectCategory = document.getElementById('product-category');
    const checkStockAlert = document.getElementById('stock-alert');
    
    // Botones
    const btnClear = document.getElementById('clear-btn');
    
    // Elementos de Toast de Éxito
    const toast = document.getElementById('success-toast');
    const btnCloseToast = document.getElementById('toast-close-btn');

    // ---------------------------------------------------------
    // 2. Funciones de Feedback Visual (Manejo de Errores)
    // ---------------------------------------------------------

    /**
     * Muestra un mensaje de error visual para un input específico.
     * Agrega la clase 'invalid' al grupo del formulario y define el texto explicativo.
     * 
     * @param {HTMLElement} inputEl Elemento de entrada (input, select, etc.)
     * @param {string} message Mensaje descriptivo del error de validación
     */
    const mostrarError = (inputEl, message) => {
        const formGroup = inputEl.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('invalid');
            const errorSpan = formGroup.querySelector('.error-msg');
            if (errorSpan) {
                errorSpan.textContent = message;
            }
        }
    };

    /**
     * Limpia el estado de error de un input individual.
     * 
     * @param {HTMLElement} inputEl Elemento de entrada a limpiar
     */
    const limpiarErrorInput = (inputEl) => {
        const formGroup = inputEl.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('invalid');
        }
    };

    /**
     * Limpia todos los estados e indicadores de error del formulario.
     */
    const limpiarTodosLosErrores = () => {
        const invalidGroups = form.querySelectorAll('.form-group.invalid');
        invalidGroups.forEach(group => {
            group.classList.remove('invalid');
        });
    };

    // ---------------------------------------------------------
    // 3. Lógica Estricta de Validación (Controles Internos)
    // ---------------------------------------------------------

    /**
     * Valida el formulario completo aplicando reglas estrictas de edición de datos.
     * Retorna verdadero si todos los controles pasan, falso de lo contrario.
     * 
     * @returns {boolean}
     */
    const validarFormulario = () => {
        let esValido = true;
        limpiarTodosLosErrores();

        // --- A. CONTROL DE PRESENCIA ---
        // Verificar que ningún campo obligatorio esté vacío

        // Validación: Nombre del Producto
        const nameVal = inputName.value.trim();
        if (nameVal === '') {
            mostrarError(inputName, 'El nombre del producto no puede estar vacío.');
            esValido = false;
        }

        // Validación: SKU (Código único)
        const skuVal = inputSku.value.trim();
        if (skuVal === '') {
            mostrarError(inputSku, 'El código SKU no puede estar vacío.');
            esValido = false;
        } else {
            // --- B. CONTROL DE FORMATO (SKU) ---
            // Regla: Mínimo 5 caracteres y ser alfanumérico (letras y números únicamente)
            const regexAlfanumerico = /^[a-zA-Z0-9]+$/;
            
            if (skuVal.length < 5) {
                mostrarError(inputSku, 'El SKU debe tener un mínimo de 5 caracteres.');
                esValido = false;
            } else if (!regexAlfanumerico.test(skuVal)) {
                mostrarError(inputSku, 'El SKU debe ser alfanumérico (solo letras y números, sin espacios ni caracteres especiales).');
                esValido = false;
            }
        }

        // Validación: Precio Unitario
        const priceStr = inputPrice.value.trim();
        if (priceStr === '') {
            mostrarError(inputPrice, 'El precio unitario no puede estar vacío.');
            esValido = false;
        } else {
            // --- C. CONTROL DE LÍMITE / RANGO (Precio) ---
            // Regla: No puede ser un número negativo (debe ser >= 0)
            const priceVal = Number(priceStr);
            if (isNaN(priceVal)) {
                mostrarError(inputPrice, 'El precio debe ser un número válido.');
                esValido = false;
            } else if (priceVal < 0) {
                mostrarError(inputPrice, 'El precio unitario no puede ser negativo (debe ser >= 0).');
                esValido = false;
            }
        }

        // Validación: Stock Inicial
        const stockStr = inputStock.value.trim();
        if (stockStr === '') {
            mostrarError(inputStock, 'El stock inicial no puede estar vacío.');
            esValido = false;
        } else {
            // --- D. CONTROL DE LÍMITE / RANGO (Stock) ---
            // Regla: No puede ser un número negativo (debe ser >= 0)
            const stockVal = Number(stockStr);
            if (isNaN(stockVal)) {
                mostrarError(inputStock, 'El stock debe ser un número válido.');
                esValido = false;
            } else if (stockVal < 0) {
                mostrarError(inputStock, 'El stock inicial no puede ser negativo (debe ser >= 0).');
                esValido = false;
            } else if (!Number.isInteger(stockVal)) {
                // Validación adicional: Stock debe ser entero
                mostrarError(inputStock, 'El stock inicial debe ser un número entero.');
                esValido = false;
            }
        }

        // Validación: Categoría / Grupo de Alerta
        const categoryVal = selectCategory.value;
        if (categoryVal === '') {
            mostrarError(selectCategory, 'Debe seleccionar una categoría o grupo de alerta.');
            esValido = false;
        }

        // Validación: Imagen del Producto
        if (inputImage.files.length === 0) {
            mostrarError(inputImage, 'Debe adjuntar una imagen válida.');
            esValido = false;
        }

        return esValido;
    };

    // ---------------------------------------------------------
    // 4. Limpieza Dinámica (Escuchar Eventos Input)
    // ---------------------------------------------------------
    // Remueve el error de forma interactiva apenas el usuario edita o corrige el campo
    const inputsList = [inputName, inputSku, inputPrice, inputStock, selectCategory, inputImage];
    inputsList.forEach(input => {
        input.addEventListener('input', () => {
            limpiarErrorInput(input);
        });
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                limpiarErrorInput(input);
            });
        }
    });

    // ---------------------------------------------------------
    // 5. Manejo del Éxito y Toast
    // ---------------------------------------------------------
    let toastTimeout;

    /**
     * Muestra la notificación flotante de éxito por pantalla
     */
    const mostrarToastExito = () => {
        // Cancelar timeout anterior si el toast ya estaba visible
        clearTimeout(toastTimeout);
        toast.classList.add('show');

        // Cerrar automáticamente después de 4 segundos
        toastTimeout = setTimeout(() => {
            ocultarToast();
        }, 4000);
    };

    /**
     * Oculta la notificación de éxito
     */
    const ocultarToast = () => {
        toast.classList.remove('show');
    };

    btnCloseToast.addEventListener('click', ocultarToast);

    // ---------------------------------------------------------
    // 6. Evento de Envío del Formulario (Submit)
    // ---------------------------------------------------------
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevenir recarga por defecto

        // Ejecutar controles de validación
        if (validarFormulario()) {
            const file = inputImage.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const base64Image = event.target.result;

                // Capturar el valor seleccionado de los Radio Buttons
                const radioStatus = document.querySelector('input[name="status"]:checked');
                const statusVal = radioStatus ? radioStatus.value : 'Activo';

                // Construir el objeto JSON simulado
                const nuevoProducto = {
                    id: Date.now(), // ID incremental simulado usando timestamp
                    name: inputName.value.trim(),
                    sku: inputSku.value.trim().toUpperCase(), // Normalizar a mayúsculas
                    price: parseFloat(inputPrice.value),
                    stock: parseInt(inputStock.value, 10),
                    category: selectCategory.value,
                    status: statusVal,
                    stockAlertActive: checkStockAlert.checked,
                    image: base64Image,
                    createdAt: new Date().toISOString()
                };

                // Imprimir en consola para verificación académica
                console.log('--- Control de Calidad Aceptado ---');
                console.log('Objeto JSON Generado:', nuevoProducto);

                // Recuperar el array de productos guardados previamente o crear uno nuevo
                let productosGuardados = [];
                try {
                    const data = localStorage.getItem('nuevosProductos');
                    if (data) {
                        productosGuardados = JSON.parse(data);
                    }
                } catch(e) {
                    console.error("Error leyendo localStorage:", e);
                }

                // Agregar el nuevo producto al arreglo
                productosGuardados.push(nuevoProducto);

                // Guardar el arreglo completo en el localStorage bajo la llave 'nuevosProductos'
                localStorage.setItem('nuevosProductos', JSON.stringify(productosGuardados));

                // Feedback visual elegante (Toast)
                mostrarToastExito();

                // Deshabilitar botón de guardado temporalmente para evitar doble envío
                const btnSubmit = form.querySelector('button[type="submit"]');
                if (btnSubmit) btnSubmit.disabled = true;

                // Limpiar todos los campos del formulario tras 2 segundos
                setTimeout(() => {
                    form.reset();
                    limpiarTodosLosErrores();
                    if (btnSubmit) btnSubmit.disabled = false;
                }, 2000);
            };

            reader.onerror = () => {
                console.error("Error al leer el archivo de imagen.");
                mostrarError(inputImage, "Hubo un error al procesar la imagen.");
            };

            // Iniciar la lectura del archivo como DataURL (Base64)
            reader.readAsDataURL(file);
        } else {
            console.warn('--- Envío Rechazado: Errores en controles internos de datos ---');
        }
    });

    // ---------------------------------------------------------
    // 7. Evento Botón Limpiar Formulario
    // ---------------------------------------------------------
    btnClear.addEventListener('click', () => {
        // Resetear campos nativos del formulario
        form.reset();
        // Limpiar todas las clases e indicaciones visuales de error
        limpiarTodosLosErrores();
    });
});
