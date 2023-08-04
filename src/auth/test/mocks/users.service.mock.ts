export const UsersServiceMock = jest.fn().mockReturnValue({
  getByEmail: jest.fn(),
  create: jest.fn(),
});
