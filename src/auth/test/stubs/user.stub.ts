import { User } from '@prisma/client';

export const userStub = (): User => ({
  id: 'id',
  email: 'email@gmail.com',
  password: '123123',
  fullName: 'Alex Alex Alex',
  phone: '+915243',
  birthday: new Date('2003-06-20 00:00:00'),
  address: 'address',
  avatar: '123.jpg',
  companyId: 'company-id',
  description: 'user-descr',
  positionId: 'position-id',
  createdAt: new Date('2003-06-20 00:00:00'),
  updatedAt: new Date('2003-06-20 00:00:00'),
});
