import { PrismaClient, Role, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@example.com';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('Super Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('superadmin123', 10);

  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      status: Status.ACTIVE,
    },
  });

  console.log('Super Admin created successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => prisma.$disconnect());
