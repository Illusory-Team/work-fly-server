import { UsersService } from 'users/users.service';
import { Test } from '@nestjs/testing';
import { UsersModule } from 'users/users.module';
import { TokensModule } from 'tokens/tokens.module';
import { PositionsModule } from 'positions/positions.module';
import { TokensService } from 'tokens/tokens.service';
import { PositionsService } from 'positions/positions.service';
import { CompanyServiceMock, PositionsServiceMock, TokensServiceMock, UsersServiceMock } from 'auth/test/mocks';
import { authDataStub, companyStub, userStub } from 'auth/test/stubs';
import { AuthReturn } from 'auth/auth.interface';
import { RegisterUserOwnerDto } from 'auth/dto';
import { ConfigModule } from '@nestjs/config';
import { RegisterCommandHandler } from './register.command-handler';
import { RegisterCommand } from './register.command';
import { CompaniesModule } from 'companies/companies.module';
import { CompaniesService } from 'companies/companies.service';
import { NO_SESSION, USER_EXISTS } from '@constants/error';

// overriding default behavior to test with passwords which are unequal
jest.mock('bcrypt', () => ({
  compare: jest.fn((item1, item2) => Promise.resolve(item1 === item2)),
}));

describe('when register is called', () => {
  let registerCommandHandler: RegisterCommandHandler;
  let usersService: UsersService;
  let tokensService: TokensService;
  let positionsService: PositionsService;
  let companiesService: CompaniesService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RegisterCommandHandler],
      imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, TokensModule, PositionsModule, CompaniesModule],
    })
      .overrideProvider(UsersService)
      .useValue(UsersServiceMock())
      .overrideProvider(TokensService)
      .useValue(TokensServiceMock())
      .overrideProvider(PositionsService)
      .useValue(PositionsServiceMock())
      .overrideProvider(CompaniesService)
      .useValue(CompanyServiceMock())
      .compile();

    registerCommandHandler = moduleRef.get<RegisterCommandHandler>(RegisterCommandHandler);
    usersService = moduleRef.get<UsersService>(UsersService);
    tokensService = moduleRef.get<TokensService>(TokensService);
    positionsService = moduleRef.get<PositionsService>(PositionsService);
    companiesService = moduleRef.get<CompaniesService>(CompaniesService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      usersService.getByEmail = jest.fn().mockResolvedValue(undefined);
      usersService.create = jest.fn().mockResolvedValue(userStub());
      companiesService.create = jest.fn().mockResolvedValue(companyStub());
      positionsService.create = jest.fn().mockResolvedValue({ id: 'position-id', value: 'owner' });
      tokensService.generateTokens = jest
        .fn()
        .mockResolvedValue({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    let response: AuthReturn;
    const dto: RegisterUserOwnerDto = {
      user: {
        password: 'password',
        email: 'email',
        fullName: 'full-name',
        phone: 'phone',
        companyId: 'company-id',
        positionId: 'position-id',
      },
      company: {
        name: 'google',
      },
    };

    beforeEach(async () => {
      response = await registerCommandHandler.execute(new RegisterCommand(dto));
    });

    it('should call usersService get by email', () => {
      expect(usersService.getByEmail).toBeCalledTimes(1);
      expect(usersService.getByEmail).toBeCalledWith(dto.user.email);
    });

    it('should call companiesService create', () => {
      expect(companiesService.create).toBeCalledTimes(1);
      expect(companiesService.create).toBeCalledWith(dto.company);
    });

    it('should call positionsService create', () => {
      expect(positionsService.create).toBeCalledTimes(1);
      expect(positionsService.create).toBeCalledWith(companyStub().id, 'Owner');
    });

    it('should call usersService create', () => {
      expect(usersService.create).toBeCalledTimes(1);
      expect(usersService.create).toBeCalledWith({
        ...dto.user,
        companyId: companyStub().id,
        positionId: 'position-id',
      });
    });

    it('should call tokensService getById', () => {
      expect(tokensService.generateTokens).toBeCalledTimes(1);
      expect(tokensService.generateTokens).toBeCalledWith(userStub().id);
    });

    it('should return user data', () => {
      expect(response).toEqual(authDataStub());
    });
  });

  describe('when there is no user-session data', () => {
    beforeAll(() => {
      usersService.getByEmail = jest.fn().mockResolvedValue(undefined);
      usersService.create = jest.fn().mockResolvedValue(userStub());
      companiesService.create = jest.fn().mockResolvedValue(companyStub());
      positionsService.create = jest.fn().mockResolvedValue({ id: 'position-id', value: 'owner' });
      tokensService.generateTokens = jest
        .fn()
        .mockResolvedValue({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    let response: AuthReturn;
    let error;
    const dto = {
      company: {
        name: 'google',
      },
    };

    beforeEach(async () => {
      try {
        response = await registerCommandHandler.execute(new RegisterCommand(dto as RegisterUserOwnerDto));
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should not call usersService get by email', () => {
      expect(usersService.getByEmail).not.toBeCalled();
    });

    it('should not call companiesService create', () => {
      expect(companiesService.create).not.toBeCalled();
    });

    it('should not call positionsService create', () => {
      expect(positionsService.create).not.toBeCalled();
    });

    it('should not call usersService create', () => {
      expect(usersService.create).not.toBeCalled();
    });

    it('should not call tokensService getById', () => {
      expect(tokensService.generateTokens).not.toBeCalled();
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(403);
      expect(error.message).toEqual(NO_SESSION);
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when such email-address is already used', () => {
    beforeAll(() => {
      usersService.getByEmail = jest.fn().mockResolvedValue(userStub());
      usersService.create = jest.fn().mockResolvedValue(userStub());
      companiesService.create = jest.fn().mockResolvedValue(companyStub());
      positionsService.create = jest.fn().mockResolvedValue({ id: 'position-id', value: 'owner' });
      tokensService.generateTokens = jest
        .fn()
        .mockResolvedValue({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    let response: AuthReturn;
    let error;
    const dto: RegisterUserOwnerDto = {
      user: {
        password: 'password',
        email: 'email',
        fullName: 'full-name',
        phone: 'phone',
        companyId: 'company-id',
        positionId: 'position-id',
      },
      company: {
        name: 'google',
      },
    };

    beforeEach(async () => {
      try {
        response = await registerCommandHandler.execute(new RegisterCommand(dto));
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call usersService get by email', () => {
      expect(usersService.getByEmail).toBeCalledTimes(1);
      expect(usersService.getByEmail).toBeCalledWith(dto.user.email);
    });

    it('should not call companiesService create', () => {
      expect(companiesService.create).not.toBeCalled();
    });

    it('should not call positionsService create', () => {
      expect(positionsService.create).not.toBeCalled();
    });

    it('should not call usersService create', () => {
      expect(usersService.create).not.toBeCalled();
    });

    it('should not call tokensService getById', () => {
      expect(tokensService.generateTokens).not.toBeCalled();
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
