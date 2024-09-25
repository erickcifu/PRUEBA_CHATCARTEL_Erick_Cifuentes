// src/seed/seedRoles.ts
import { AppDataSource } from '../config/ormconfig';
import { Rol } from '../entities/Rol';

const seedRoles = async () => {
  const roleRepository = AppDataSource.getRepository(Rol);
  
  const roles = ['admin', 'user'];
  
  for (const roleName of roles) {
    const roleExists = await roleRepository.findOneBy({ nombre_Rol: roleName });
    if (!roleExists) {
      const newRole = roleRepository.create({ nombre_Rol: roleName });
      await roleRepository.save(newRole);
      console.log(`Rol ${roleName} creado`);
    }
  }
};

AppDataSource.initialize()
  .then(async () => {
    await seedRoles();
    console.log('Seed completado');
    process.exit(0);
  })
  .catch((error) => console.log('Error en la seed:', error));
