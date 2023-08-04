import { AuthReturn } from 'auth/auth.interface';

export const authDataStub = (): AuthReturn => ({
  data: {
    user: {
      id: 'id',
      email: 'email@gmail.com',
      fullName: 'Alex Alex Alex',
      phone: '+915243',
      birthday: new Date('2003-06-20 00:00:00'),
      address: 'address',
      avatar: '123.jpg',
      companyId: 'company-id',
      description: 'user-descr',
      position: { id: 'position-id', value: 'owner' },
    },
    accessToken: 'access-token',
  },
  refreshToken: 'refresh-token',
});
