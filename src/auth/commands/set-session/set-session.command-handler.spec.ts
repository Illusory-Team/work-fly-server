import { UsersService } from 'users/users.service';
import { Test } from '@nestjs/testing';
import { UsersModule } from 'users/users.module';
import { TokensModule } from 'tokens/tokens.module';
import { PositionsModule } from 'positions/positions.module';
import { UsersServiceMock } from 'auth/test/mocks';
import { userStub } from 'auth/test/stubs';
import { SetSessionReturnDto, UserSessionDto } from 'auth/dto';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from 'companies/companies.module';
import { SetSessionCommandHandler } from './set-session.command-handler';
import { SetSessionCommand } from './set-session.command';
import { USER_EXISTS } from '@constants/error';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('when set session is called', () => {
  let setSessionCommandHandler: SetSessionCommandHandler;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SetSessionCommandHandler],
      imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, TokensModule, PositionsModule, CompaniesModule],
    })
      .overrideProvider(UsersService)
      .useValue(UsersServiceMock())
      .compile();

    setSessionCommandHandler = moduleRef.get<SetSessionCommandHandler>(SetSessionCommandHandler);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      usersService.getByEmail = jest.fn().mockResolvedValue(undefined);
      usersService.create = jest.fn().mockResolvedValue(userStub());
    });

    let response: SetSessionReturnDto;
    const dto: UserSessionDto = {
      password: 'password',
      email: 'email',
      fullName: 'full-name',
      phone: 'phone',
      companyId: 'company-id',
    };

    beforeEach(async () => {
      response = await setSessionCommandHandler.execute(new SetSessionCommand(dto));
    });

    it('should call usersService get by email', () => {
      expect(usersService.getByEmail).toBeCalledTimes(1);
      expect(usersService.getByEmail).toBeCalledWith(dto.email);
    });

    it('should return user data', () => {
      expect(response).toEqual({ ...dto, password: 'hashed-password' });
    });
  });

  describe('when such email-address is already used', () => {
    beforeAll(() => {
      usersService.getByEmail = jest.fn().mockResolvedValue(userStub());
      usersService.create = jest.fn().mockResolvedValue(userStub());
    });

    let response: SetSessionReturnDto;
    let error;
    const dto: UserSessionDto = {
      password: 'password',
      email: 'email',
      fullName: 'full-name',
      phone: 'phone',
      companyId: 'company-id',
    };

    beforeEach(async () => {
      try {
        response = await setSessionCommandHandler.execute(new SetSessionCommand(dto));
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call usersService get by email', () => {
      expect(usersService.getByEmail).toBeCalledTimes(1);
      expect(usersService.getByEmail).toBeCalledWith(dto.email);
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(403);
      expect(error.message).toEqual(USER_EXISTS);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });
});
