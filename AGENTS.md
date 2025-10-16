# AGENTS.md ⚛️ (Frontend React con TypeScript)

Este archivo contiene las instrucciones clave para los agentes de codificación que trabajan en este repositorio. Proporciona el contexto necesario para garantizar la coherencia, calidad y el cumplimiento de los estándares de desarrollo React/Frontend usando **TypeScript**.

---

## 🛠️ Configuración y Ejecución

Los agentes deben usar los siguientes comandos para configurar y validar el código:

* **Instalar Dependencias:**
    ```bash
    npm install
    ```
* **Ejecutar Pruebas Unitarias:** Siempre ejecuta esto al final de cualquier tarea y antes de generar una *pull request*.
    ```bash
    npm test
    ```
* **Ejecutar Linter & Typescript Check:** Asegúrate de que el código cumpla con el estilo y la verificación de tipos antes de *commitear*.
    ```bash
    npm run lint
    npm run typecheck
    ```

---

## 📁 Estructura Modular Obligatoria (Módulos de Característica)

Toda nueva característica o refactorización debe organizarse bajo una **estructura de Módulos** en `src/`, donde cada módulo representa una vista o una funcionalidad compleja (ej: `usuarios`, `carrito`).

### 1. **Estructura de Carpeta Módulo:**

El contenido interno de cada módulo **debe** seguir el siguiente orden y convención, utilizando las extensiones de archivo adecuadas:

src/
└── [nombre-del-modulo]/
├── components/         <-- Componentes pequeños (solo usados en este módulo)
│   └── BotonAgregar.tsx
├── hooks/              <-- Lógica encapsulada y reutilizable (useDatos...)
│   └── useCargarDatos.ts
├── services/           <-- Archivo(s) que gestionan peticiones HTTP (APIs)
│   └── productos.service.ts
├── interfaces/         <-- Definiciones de tipos, props e interfaces de datos.
│   └── Producto.ts
└── index.tsx           <-- Componente principal del Módulo (la "vista" o "página")

### 2. **Reglas de Responsabilidad (Refuerzo Tipado):**

* **Tipado Riguroso:** El agente debe aplicar tipos explícitos de TypeScript a **todas las props, estados y retornos de funciones/hooks**.
* **Centralización de Tipos:** Todas las **interfaces** y **tipos** de dominio (ej: la estructura de un `Usuario`) deben definirse dentro de la carpeta **`interfaces/`** del módulo.
* **Archivos:** Usar `.tsx` para archivos que contienen JSX (componentes) y `.ts` para archivos de lógica pura (hooks, servicios, interfaces, utilidades).

---
## ✏️ Convenciones de Codificación (Código Limpio)

### 1. Nomenclatura

| Elemento | Regla de Nomenclatura | Ejemplo |
| :--- | :--- | :--- |
| **Interfaces/Tipos** | **`PascalCase`** (Nombres de sustantivo singulares) | `Producto` (en Producto.ts) |
| **Funciones & Handlers** | **`camelCase`** | `procesarFormulario()` |
| **Custom Hooks** | **`camelCase`** con prefijo `use` | `useCargarDatos()` |
| **Componentes/Archivos** | **`PascalCase`** | `BotonAgregar.tsx` |

### 2. Principios SOLID y Reutilización de Código (DRY)

* **Código Reutilizable (DRY):** Si se identifica lógica o UI duplicada en **diferentes módulos**, debe ser extraída a una carpeta de **`components/global`** o **`hooks/global`** fuera de los módulos de característica.
* **Separación de Responsabilidades (SRP):** El agente debe asegurar que el código de presentación (*JSX*) no esté mezclado con la lógica de acceso a datos (servicios).

---

## 💡 Consejos para el Agente

### Flujo de Desarrollo (TDD)
El agente debe seguir estrictamente el flujo de **Test-Driven Development (TDD)**:

1.  **RED (Falla):** Escribe una **prueba unitaria** que falle.
2.  **GREEN (Pasa):** Escribe la **cantidad mínima de código** necesario para que esa prueba pase. **Asegura el tipado** en este paso.
3.  **REFACTOR (Refactorizar):** Aplica las reglas de la Estructura Modular, el tipado y DRY para limpiar el código, asegurándote de que la prueba unitaria siga pasando (`npm test`) y no haya errores de tipo (`npm run typecheck`).

### Consejos Generales
* **Prioridad:** Antes de escribir la implementación de un componente o servicio, el agente debe **primero crear su interfaz o tipo** en la carpeta `interfaces/`.
* **Verificación:** Confirma el éxito de las tareas ejecutando `npm test`, `npm run lint` y **`npm run typecheck`** antes de sugerir el cambio.