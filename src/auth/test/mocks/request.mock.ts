import { authDataStub } from '../stubs';

export const RequestMock = jest.fn().mockReturnValue({
  cookies: { refreshToken: authDataStub().refreshToken },
});
