import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { Test } from '@nestjs/testing';
import { CommandBusMock, RequestMock, ResponseMock } from './test/mocks';
import { LoginCommand, LogoutCommand, RefreshCommand, RegisterCommand, SetSessionCommand } from './commands';
import { LoginUserDto, UserSessionDto } from './dto';
import { TokensModule } from 'tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { CreateCompanyDto } from 'companies/dto';
import { authDataStub } from './test/stubs';
import { CreateUserDto } from 'users/dto';
import { REFRESH_TOKEN_TIME } from 'tokens/tokens.constants';

describe('auth controller', () => {
  let controller: AuthController;
  let commandBus: CommandBus;

  const responseMock = ResponseMock();
  const requestMock = RequestMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [CqrsModule, TokensModule, ConfigModule.forRoot({ isGlobal: true })],
    })
      .overrideProvider(CommandBus)
      .useValue(CommandBusMock())
      .compile();

    controller = moduleRef.get<AuthController>(AuthController);
    commandBus = moduleRef.get<CommandBus>(CommandBus);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when set session is called', () => {
    const dto: UserSessionDto = {
      password: '',
      email: '',
      fullName: '',
      phone: '',
      companyId: '',
    };
    const sessionObj = { userAuth: null };

    beforeAll(() => {
      commandBus.execute = jest.fn().mockResolvedValue(dto);
    });

    let response;

    beforeEach(async () => {
      response = await controller.setSession(sessionObj, dto);
    });

    it('should call command bus execute', () => {
      expect(commandBus.execute).toBeCalledTimes(1);
      expect(commandBus.execute).toBeCalledWith(new SetSessionCommand(dto));
    });

    it('should set session auth data', () => {
      expect(sessionObj?.userAuth).toEqual(dto);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when register is called', () => {
    const userDto: CreateUserDto = {
      password: '',
      email: '',
      fullName: '',
      phone: '',
      companyId: '',
      positionId: 'position-id',
    };
    const companyDto: CreateCompanyDto = {
      name: 'company-name',
    };
    const sessionObj = { userAuth: userDto };

    beforeAll(() => {
      commandBus.execute = jest.fn().mockResolvedValue(authDataStub());
    });

    let response;

    beforeEach(async () => {
      response = await controller.register(sessionObj, companyDto, responseMock);
    });

    it('should call command bus execute', () => {
      expect(commandBus.execute).toBeCalledTimes(1);
      expect(commandBus.execute).toBeCalledWith(new RegisterCommand({ company: companyDto, user: userDto }));
    });

    it('should call res cookie', () => {
      expect(responseMock.cookie).toBeCalledTimes(1);
      expect(responseMock.cookie).toBeCalledWith('refreshToken', authDataStub().refreshToken, {
        maxAge: REFRESH_TOKEN_TIME,
        httpOnly: true,
      });
    });

    it('should call res json', () => {
      expect(responseMock.json).toBeCalledTimes(1);
      expect(responseMock.json).toBeCalledWith(authDataStub().data);
    });

    it('should return undefined (uses res.json)', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when login is called', () => {
    const dto: LoginUserDto = {
      password: '',
      email: '',
    };

    beforeAll(() => {
      commandBus.execute = jest.fn().mockResolvedValue(authDataStub());
    });

    let response;

    beforeEach(async () => {
      response = await controller.login(dto, responseMock);
    });

    it('should call command bus execute', () => {
      expect(commandBus.execute).toBeCalledTimes(1);
      expect(commandBus.execute).toBeCalledWith(new LoginCommand(dto));
    });

    it('should call res cookie', () => {
      expect(responseMock.cookie).toBeCalledTimes(1);
      expect(responseMock.cookie).toBeCalledWith('refreshToken', authDataStub().refreshToken, {
        maxAge: REFRESH_TOKEN_TIME,
        httpOnly: true,
      });
    });

    it('should call res json', () => {
      expect(responseMock.json).toBeCalledTimes(1);
      expect(responseMock.json).toBeCalledWith(authDataStub().data);
    });

    it('should return undefined (uses res.json)', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when logout is called', () => {
    beforeAll(() => {
      commandBus.execute = jest.fn().mockResolvedValue(undefined);
    });

    let response;

    beforeEach(async () => {
      response = await controller.logout(requestMock, responseMock);
    });

    it('should call res clear cookie', () => {
      expect(responseMock.clearCookie).toBeCalledTimes(1);
      expect(responseMock.clearCookie).toBeCalledWith('refreshToken');
    });

    it('should call command bus execute', () => {
      expect(commandBus.execute).toBeCalledTimes(1);
      expect(commandBus.execute).toBeCalledWith(new LogoutCommand(authDataStub().refreshToken));
    });

    it('should call res end', () => {
      expect(responseMock.end).toBeCalledTimes(1);
      expect(responseMock.end).toBeCalledWith();
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when refresh is called', () => {
    beforeAll(() => {
      commandBus.execute = jest
        .fn()
        .mockResolvedValue({ accessToken: authDataStub().data.accessToken, refreshToken: authDataStub().refreshToken });
    });

    let response;

    beforeEach(async () => {
      response = await controller.refresh(requestMock, responseMock);
    });

    it('should call command bus execute', () => {
      expect(commandBus.execute).toBeCalledTimes(1);
      expect(commandBus.execute).toBeCalledWith(new RefreshCommand(authDataStub().refreshToken));
    });

    it('should call res cookie', () => {
      expect(responseMock.cookie).toBeCalledTimes(1);
      expect(responseMock.cookie).toBeCalledWith('refreshToken', authDataStub().refreshToken, {
        maxAge: REFRESH_TOKEN_TIME,
        httpOnly: true,
      });
    });

    it('should call res json', () => {
      expect(responseMock.json).toBeCalledTimes(1);
      expect(responseMock.json).toBeCalledWith({ accessToken: authDataStub().data.accessToken });
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });
});
