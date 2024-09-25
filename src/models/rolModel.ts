// models/rolModel.ts
export interface Rol {
    id_rol: string;
    nombre_rol: string;
    estado_rol: boolean;
  }
  
  // Simulamos algunos roles predefinidos
  export const roles: Rol[] = [
    { id_rol: '1', nombre_rol: 'admin', estado_rol: true },
    { id_rol: '2', nombre_rol: 'user', estado_rol: true},
  ];
  
  // Función para buscar un rol por su nombre
  export const findRoleByName = (roleName: string): Rol | undefined => {
    return roles.find(role => role.nombre_rol === roleName);
  };
  