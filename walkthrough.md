# Walkthrough del Prototipo E-commerce A1Click

Hemos completado el prototipo de flujo B2C para **A1Click**. El proyecto cuenta con un catálogo de productos, carrito de compras responsivo, simulador de pasarela Webpay Plus y un comprobante electrónico imprimible. Todo funciona del lado del cliente a través de `localStorage`.

El servidor de pruebas local está actualmente corriendo y sirviendo la aplicación en: **[http://localhost:8000/](http://localhost:8000/)**

## Cambios Implementados

### 1. Catálogo & Carrito (`index.html`, `css/style.css`, `js/app.js`)
- **Interfaz moderna y corporativa**: Colores corporativos basados en azules y grises oscuros, con tipografía premium `Outfit` de Google Fonts.
- **Catálogo de 4 productos**:
  - Resma Papel Carta 500u ($4.990)
  - Carpeta Plastificada ($1.490)
  - Lápiz Pasta ($490)
  - Tóner Impresora ($49.990)
  - Cada producto tiene su imagen realista generada y efecto hover zoom.
- **Carrito de Compras Lateral Deslizable**:
  - Abre de forma fluida desde el lateral derecho.
  - Permite modificar cantidades (+/-), eliminar artículos y ver en tiempo real el Subtotal, el cálculo automático de IVA (19%) y el Total a pagar.
  - Guarda los datos de checkout en `localStorage` al hacer clic en "Ir a Pagar (Webpay)".

### 2. Simulador Webpay Plus (`webpay.html`, `css/webpay.css`, `js/webpay.js`)
- **Réplica visual**: Imita el diseño de Transbank Webpay Plus, usando color rojo de la marca, paneles de resumen en gris oscuro y formularios de tarjeta limpios.
- **Validaciones en tiempo real**: Formatea números de tarjeta con espacios cada 4 dígitos y detecta automáticamente las marcas Visa, Mastercard o Amex cambiando el icono.
- **Pantalla de carga**: Al hacer clic en "Autorizar Pago", muestra un overlay con loaders y cambios de estado dinámicos de conexión antes de redirigir tras 2.2 segundos.

### 3. Comprobante / Voucher (`voucher.html`, `css/voucher.css`, `js/voucher.js`)
- **Formato de boleta térmica**: Estilo estético tipo ticket físico con divisores punteados, código de barras simulado y fuentes monoespaciadas.
- **Información Dinámica**: Recupera la información de `localStorage` y muestra un número de orden aleatorio, la fecha actual del sistema, detalle ítem por ítem y el total exacto.
- **Optimización para Impresión**: Reglas CSS `@media print` para ocultar los botones de acción e imprimir de forma nativa limpia y en blanco y negro (o guardar en PDF) con `window.print()`.
- **Botón de reinicio**: El botón "Volver al Inicio" limpia el carrito de compras e inicia un nuevo flujo de prueba.

---

## Resultados de las Pruebas

El flujo completo fue simulado y verificado mediante el agente de navegador automatizado. Se detectó y corrigió exitosamente un bug de markup en el código de verificación del comprobante. A continuación se presentan las capturas de pantalla tomadas durante la validación:

### Captura del Comprobante Generado Correjido
A continuación se puede ver la boleta generada con el número de orden dinámico, fecha formateada y el código de verificación aleatorio calculado correctamente:

![Boleta de Pago Exitosa](file:///C:/Users/leofa/.gemini/antigravity-ide/brain/1531732b-d096-4ce4-801b-8eca8e97ccb8/corrected_voucher_1782845828967.png)

---

## Cómo Probar el Prototipo

1. Abre tu navegador y dirígete a: **[http://localhost:8000/](http://localhost:8000/)**
2. Agrega algunos productos al carro desde el catálogo.
3. Abre el menú lateral del carro haciendo clic en el icono del carro o al agregar un producto.
4. Presiona **"Ir a Pagar (Webpay)"**.
5. Rellena los datos simulados de tarjeta en Webpay Plus:
   - **Número de Tarjeta**: ingresa cualquier número de 16 dígitos que empiece con 4 (Visa) o 5 (Mastercard) (ej. `4590 1234 5678 9012`).
   - **Expiración**: ingresa un mes y año futuro (ej. `12/29`).
   - **CVV**: ingresa 3 dígitos cualquiera (ej. `123`).
6. Presiona **"Autorizar Pago"** y observa la simulación de autorización de Transbank.
7. En el Voucher de éxito, presiona **"Imprimir Comprobante"** para simular la impresión física o guardar en PDF, o presiona **"Volver al Inicio"** para reiniciar.
