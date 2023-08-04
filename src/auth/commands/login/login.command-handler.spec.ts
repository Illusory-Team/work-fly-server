import { UsersService } from './../../../users/users.service';
import { Test } from '@nestjs/testing';
import { LoginCommandHandler } from './login.command-handler';
import { UsersModule } from 'users/users.module';
import { TokensModule } from 'tokens/tokens.module';
import { PositionsModule } from 'positions/positions.module';
import { TokensService } from 'tokens/tokens.service';
import { PositionsService } from 'positions/positions.service';
import { PositionsServiceMock, TokensServiceMock, UsersServiceMock } from 'auth/test/mocks';
import { authDataStub, userStub } from 'auth/test/stubs';
import { AuthReturn } from 'auth/auth.interface';
import { LoginCommand } from './login.command';
import { LoginUserDto } from 'auth/dto';
import { ConfigModule } from '@nestjs/config';
import { EMAIL_PASSWORD_INCORRECT, NOT_FOUND } from '@constants/error';

// overriding default behavior to test with passwords which are unequal
jest.mock('bcrypt', () => ({
  compare: jest.fn((item1, item2) => Promise.resolve(item1 === item2)),
}));

describe('when login is called', () => {
  let loginCommandHandler: LoginCommandHandler;
  let usersService: UsersService;
  let tokensService: TokensService;
  let positionsService: PositionsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LoginCommandHandler],
      imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, TokensModule, PositionsModule],
    })
      .overrideProvider(UsersService)
      .useValue(UsersServiceMock())
      .overrideProvider(TokensService)
      .useValue(TokensServiceMock())
      .overrideProvider(PositionsService)
      .useValue(PositionsServiceMock())
      .compile();

    loginCommandHandler = moduleRef.get<LoginCommandHandler>(LoginCommandHandler);
    usersService = moduleRef.get<UsersService>(UsersService);
    tokensService = moduleRef.get<TokensService>(TokensService);
    positionsService = moduleRef.get<PositionsService>(PositionsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      usersService.getByEmail = jest.fn().mockResolvedValue(userStub());
      positionsService.getById = jest.fn().mockResolvedValue({ id: 'position-id', value: 'owner' });
      tokensService.generateTokens = jest
        .fn()
        .mockResolvedValue({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    let response: AuthReturn;
    const dto: LoginUserDto = {
      email: 'email@gmail.com',
      password: '123123',
    };

    beforeEach(async () => {
      response = await loginCommandHandler.execute(new LoginCommand(dto));
    });

    it('should call usersService get by email', () => {
      expect(usersService.getByEmail).toBeCalledTimes(1);
      expect(usersService.getByEmail).toBeCalledWith(dto.email);
    });

    it('should call positionsService get by id', () => {
      expect(positionsService.getById).toBeCalledTimes(1);
      expect(positionsService.getById).toBeCalledWith('position-id');
    });

    it('should call tokensService getById', () => {
      expect(tokensService.generateTokens).toBeCalledTimes(1);
      expect(tokensService.generateTokens).toBeCalledWith(userStub().id);
    });

    it('should return user data', () => {
      expect(response).toEqual(authDataStub());
    });
  });

  describe('when there is no such user', () => {
    beforeAll(() => {
      usersService.getByEmail = jest.fn().mockResolvedValue(undefined);
      positionsService.getById = jest.fn().mockResolvedValue({ id: 'position-id', value: 'owner' });
      tokensService.generateTokens = jest
        .fn()
        .mockResolvedValue({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    let response: AuthReturn;
    let error;
    const dto: LoginUserDto = {
      email: 'email@gmail.com',
      password: '123123',
    };

    beforeEach(async () => {
      try {
        response = await loginCommandHandler.execute(new LoginCommand(dto));
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call usersService get by email', () => {
      expect(usersService.getByEmail).toBeCalledTimes(1);
      expect(usersService.getByEmail).toBeCalledWith(dto.email);
    });

    it('should not call positionsService get by id', () => {
      expect(positionsService.getById).not.toBeCalled();
    });

    it('should not call tokensService getById', () => {
      expect(tokensService.generateTokens).not.toBeCalled();
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual(NOT_FOUND);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when passwords are unequal', () => {
    beforeAll(() => {
      usersService.getByEmail = jest.fn().mockResolvedValue(userStub());
      positionsService.getById = jest.fn().mockResolvedValue({ id: 'position-id', value: 'owner' });
      tokensService.generateTokens = jest
        .fn()
        .mockResolvedValue({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    let response: AuthReturn;
    let error;
    const dto: LoginUserDto = {
      email: 'email@gmail.com',
      password: 'wrong-password',
    };

    beforeEach(async () => {
      try {
        response = await loginCommandHandler.execute(new LoginCommand(dto));
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call usersService get by email', () => {
      expect(usersService.getByEmail).toBeCalledTimes(1);
      expect(usersService.getByEmail).toBeCalledWith(dto.email);
    });

    it('should not call positionsService get by id', () => {
      expect(positionsService.getById).not.toBeCalled();
    });

    it('should not call tokensService getById', () => {
      expect(tokensService.generateTokens).not.toBeCalled();
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(403);
      expect(error.message).toEqual(EMAIL_PASSWORD_INCORRECT);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });
});
