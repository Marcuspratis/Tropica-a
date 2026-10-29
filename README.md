# Tropicaña · Sitio web

Sitio de una sola página para los dos restaurantes **Tropicaña**:

| | Dirección | Teléfono |
|---|---|---|
| **O Sombreiro** | Orro, 26 B · 15199 Culleredo, A Coruña | +34 981 67 70 50 |
| **Los Mallos** | Rúa Francisco Catoira, 38, bajo dcha. · 15007 A Coruña | +34 881 06 67 47 |

## Qué incluye
- Selector de restaurante (O Sombreiro / Los Mallos): cambia dirección, mapa, teléfono, WhatsApp, horario, fotos, carta, eventos y opiniones.
- 4 idiomas: gallego, español, inglés y portugués (menú hamburguesa).
- Logo flotante y botones fijos de WhatsApp, llamada y cómo llegar.
- Aviso automático de "abierto ahora / cerrado" según la hora de España.
- Formulario de reserva que prepara el mensaje y lo envía por WhatsApp.
- Enlaces directos: `index.html#sombreiro` y `index.html#mallos`.

## Estructura
```
index.html            Estructura de la página
css/style.css         Diseño (colores, tipografías, maquetación)
js/dados.js           Datos: teléfonos, horarios, direcciones, fotos y textos en 4 idiomas
js/main.js            Lógica: idioma, restaurante, horario, galería y reservas
assets/img/           Logo y fotos de ambos locales
assets/video/         Vídeo de la terraza (O Sombreiro)
docs/                 Presentación del sitio para el cliente (PDF, portugués)
```

## Editar datos
Todo está en `js/dados.js`:
- `LOCS` — dirección, teléfono, WhatsApp, horario, coordenadas y fotos de cada local.
- `T` — textos en los 4 idiomas (comunes / O Sombreiro).
- `M` — textos propios de Los Mallos en los 4 idiomas.

## Publicar con GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
