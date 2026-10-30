
const rutasNavegacion = {

    "/dashboard": {
        titulo: "Inicio",
        migas: []
    },

    // ======================================
    // GESTIÓN DE USUARIOS
    // ======================================

    "/gestion-usuarios": {
        titulo: "Gestión de usuarios",
        migas: [
            {
                nombre: "Gestión de usuarios",
                ruta: "/gestion-usuarios"
            }
        ],
        rutaAnterior: "/dashboard"
    },

    "/RegistroUsuario": {
        titulo: "Registrar usuario",
        migas: [
            {
                nombre: "Gestión de usuarios",
                ruta: "/gestion-usuarios"
            },
            {
                nombre: "Registrar usuario"
            }
        ],
        rutaAnterior: "/gestion-usuarios"
    },

    "/perfil-usuario": {
        titulo: "Perfil de usuario",
        migas: [
            {
                nombre: "Gestión de usuarios",
                ruta: "/gestion-usuarios"
            },
            {
                nombre: "Perfil de usuario"
            }
        ],
        rutaAnterior: "/gestion-usuarios"
    },

    // ======================================
    // GESTIÓN DE PACIENTES
    // ======================================

    "/gestion-pacientes": {
        titulo: "Gestión de pacientes",
        migas: [
            {
                nombre: "Gestión de pacientes",
                ruta: "/gestion-pacientes"
            }
        ],
        rutaAnterior: "/dashboard"
    },

    "/registro-paciente": {
        titulo: "Registrar paciente",
        migas: [
            {
                nombre: "Gestión de pacientes",
                ruta: "/gestion-pacientes"
            },
            {
                nombre: "Registrar paciente"
            }
        ],
        rutaAnterior: "/gestion-pacientes"
    },

    "/perfil-paciente": {
        titulo: "Perfil de paciente",
        migas: [
            {
                nombre: "Gestión de pacientes",
                ruta: "/gestion-pacientes"
            },
            {
                nombre: "Perfil de paciente"
            }
        ],
        rutaAnterior: "/gestion-pacientes"
    },

    // ======================================
    // GESTIÓN DE MÉDICOS
    // ======================================

    "/gestion-medicos": {
        titulo: "Gestión de médicos",
        migas: [
            {
                nombre: "Gestión de médicos",
                ruta: "/gestion-medicos"
            }
        ],
        rutaAnterior: "/dashboard"
    },

    // ======================================
    // GESTIÓN DE CITAS
    // ======================================

    "/agendar-cita": {
        titulo: "Agendar cita",
        migas: [
            {
                nombre: "Agendar cita"
            }
        ],
        rutaAnterior: "/dashboard"
    },

    "/calendario": {
        titulo: "Calendario",
        migas: [
            {
                nombre: "Calendario"
            }
        ],
        rutaAnterior: "/dashboard"
    },

    // ======================================
    // CONFIGURACIÓN
    // ======================================

    "/configuracion": {
        titulo: "Configuración",
        migas: [
            {
                nombre: "Configuración"
            }
        ],
        rutaAnterior: "/dashboard"
    }

};

// Exportar configuración de navegación
export default rutasNavegacion;
