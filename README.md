# Observatorio Benchmark Hotelero v3

Cambios incluidos:
- Dashboard general solo de competencia: Hilton, Wyndham, Sheraton.
- Dashboards individuales para Hilton, Wyndham, Sheraton y Oro Verde.
- Panel admin con contraseña simple: `admin123`.
- La contraseña se pide cada vez que se entra a `admin.html`.
- Se quitó el texto de “Acceso interno”.
- Métricas dinámicas según formato.
- Categorías reducidas: Gastronomía, Eventos, Hospedaje, Otros.
- Contenidos con mayor impacto calculados con score, no solo views.
- Calendario por día de la semana.

Score de impacto usado:
`views*0.2 + likes + comments*3 + reposts*4 + shares*4 + saves*5`

Firebase:
Pega tu configuración en `firebase.js` y cambia `USE_FIREBASE` a `true`.
