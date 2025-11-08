# Portal Web ASV-A (Token ERC-20 en BSC)

Este proyecto es una aplicación web (DApp) que permite **conectar una wallet Ethereum (MetaMask)** y **gestionar el token ASV-A** en la Binance Smart Chain. Fue desarrollado con **Ethers.js v6** y puede desplegarse fácilmente en servicios estáticos (como GitHub Pages o Netlify) al no requerir backend.

## Funcionalidades

- **Conexión a MetaMask:** Botón para conectar la cartera del usuario. La app detecta si MetaMask está instalada y solicita permisos.
- **Detección/Cambio de Red:** Verifica que MetaMask esté en BSC Mainnet (chainId 56). Si no, pide automáticamente cambiar de red; incluso agrega la red BSC a MetaMask si es necesario.
- **Mostrar Balance:** Muestra el balance de tokens ASV-A del usuario conectado, consultando on-chain el contrato ERC-20 y formateando según sus decimales.
- **Transferencia de Tokens:** Permite enviar una cantidad ingresada de ASV-A a cualquier dirección válida. Incluye validaciones de dirección y monto antes de enviar, y muestra mensajes de éxito o error.
- **Interfaz en Español:** Todos los textos de la aplicación están en español para mejorar la comprensión de usuarios hispanoparlantes.
- **Diseño Responsivo Moderno:** Apariencia oscura con acentos en colores neón, evocando un estilo tecnológico futurista. La UI se adapta a móviles y desktop.
- **Advertencia KYC/AML:** Indicador visible avisando que la aplicación **no realiza** controles KYC/AML (Know Your Customer / Anti-Money Laundering).

## Cómo Usar

1. **Preparación:** Necesitas una wallet Ethereum instalada en tu navegador (recomendado MetaMask) y tener configurada la **BNB Smart Chain (Mainnet)** en ella. Si no la tienes, la DApp te ofrecerá agregarla automáticamente.
2. **Despliegue local:** Abre el archivo `index.html` en un navegador con MetaMask. Alternativamente, sube todos los archivos a un hosting estático.
3. **Conectar Wallet:** Haz clic en "Conectar Wallet". MetaMask solicitará permiso para conectar tu cuenta. Una vez conectado, el botón indicará "Wallet Conectada" y verás los primeros dígitos de tu dirección como confirmación.
4. **Cambiar de Red (si es necesario):** Si tu MetaMask no estaba en BSC, aparecerá una notificación para cambiar. Acepta el cambio de red a BSC Mainnet. Si BSC no estaba añadida, también pedirá agregarla (confirma ambas solicitudes).
5. **Ver Balance:** Tras la conexión, en la sección "Balance" aparecerá la cantidad de tokens ASV-A que posee tu cuenta. El balance se actualiza automáticamente después de cada transferencia que hagas en la DApp.
6. **Enviar Tokens:** Para transferir, ingresa la **dirección destino** y el **monto** de ASV-A a enviar. Luego pulsa "Enviar". MetaMask te pedirá confirmar la transacción. Tras aceptar, espera la confirmación on-chain; la aplicación te notificará cuando la transferencia se haya completado exitosamente (o mostrará un error si ocurrió algún problema).
7. **Mensajes e Indicadores:** Observa los mensajes informativos debajo del botón enviar. Cualquier error (dirección inválida, transacción rechazada, etc.) se mostrará en rojo. Los éxitos en verde. El borde superior puede mostrar mensajes naranja si necesitas cambiar a la red BSC.
8. **KYC/AML:** Ten en cuenta la nota al pie: *esta aplicación no realiza verificación KYC/AML*. Úsala bajo tu propia responsabilidad, especialmente en entornos que requieran cumplimiento regulatorio.

## Configuración del Contrato ASV-A

Por defecto, la aplicación está configurada con un **placeholder** para la dirección del contrato ASV-A. Para hacerla funcionar con el token real, actualiza la variable `tokenConfig.address` en `script.js` con la dirección correcta del contrato ASV-A en BSC. Verifica también que el ABI mínimo incluido coincida con las funciones del contrato:
- `balanceOf(address)` 
- `decimals()` 
- `transfer(address, uint256)`

Si el contrato difiere del estándar ERC-20 en estos métodos, sería necesario ajustar el ABI.

## Dependencias

- **Ethers.js 6.x** – Se carga desde CDN en el HTML. Provee las herramientas para conexión web3, manejo de cuentas y llamadas al contrato.
- **MetaMask** u otra wallet inyectada compatible con EIP-1193 – Debe estar instalada en el navegador para que la DApp funcione.
- No se utilizan frameworks JS ni librerías CSS adicionales, todo el código es vanilla JS y CSS puro, lo que facilita la compatibilidad.

## Seguridad y Consideraciones

- Esta DApp es **solo de ejemplo**. No almacena claves privadas ni información sensible; toda transacción debe ser firmada por el usuario en MetaMask.
- **Nunca expongas tu clave privada**. La conexión se hace mediante MetaMask precisamente para mantener la seguridad de la firma de transacciones.
- Al ser un proyecto de ejemplo, no está auditado. Úsalo con precaución y, de ser para uso real, considera buenas prácticas adicionales (manejo avanzado de errores, limitar montos, etc.).
- La advertencia de KYC/AML recuerda que, en un entorno productivo, posiblemente debas implementar verificaciones de usuario fuera de la blockchain. Esta herramienta no lo hace.

## Deploy en GitHub Pages/Netlify

Basta con subir estos cuatro archivos (index.html, styles.css, script.js, README.md) a un repositorio o servicio estático. Asegúrate de actualizar la dirección del contrato antes del despliegue. Luego:
- **GitHub Pages:** hostea el repositorio y habilita Pages (branch principal / carpeta raíz). Visita la URL proporcionada por GitHub para tu página.
- **Netlify:** puedes arrastrar y soltar la carpeta del proyecto en Netlify Drop, o conectar tu repo. Netlify detectará el sitio estático y lo publicará con una URL temporal que puedes personalizar.
- **Otros:** cualquier servidor estático básico (Apache, Nginx, etc.) servirá, ya que no hay requerimientos de servidor dinámico.

Una vez desplegado, abre la URL del portal en tu navegador con MetaMask y repite los pasos de uso mencionados arriba.

¡Disfruta gestionando el token **ASV-A** con tu nuevo portal web! Si encuentras problemas, revisa la consola del navegador para detalles técnicos (se han dejado algunos `console.log` y `console.error` para ayudar en depuración).
