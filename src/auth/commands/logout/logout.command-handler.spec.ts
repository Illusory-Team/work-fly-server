import { Test } from '@nestjs/testing';
import { TokensModule } from 'tokens/tokens.module';
import { TokensService } from 'tokens/tokens.service';
import { TokensServiceMock } from 'auth/test/mocks';
import { ConfigModule } from '@nestjs/config';
import { LogoutCommandHandler } from './logout.command-handler';
import { LogoutCommand } from './logout.command';

describe('when logout is called', () => {
  let logoutCommandHandler: LogoutCommandHandler;
  let tokensService: TokensService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LogoutCommandHandler],
      imports: [ConfigModule.forRoot({ isGlobal: true }), TokensModule],
    })
      .overrideProvider(TokensService)
      .useValue(TokensServiceMock())
      .compile();

    logoutCommandHandler = moduleRef.get<LogoutCommandHandler>(LogoutCommandHandler);
    tokensService = moduleRef.get<TokensService>(TokensService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      tokensService.clearRefreshToken = jest.fn().mockResolvedValue(undefined);
    });

    let response;

    beforeEach(async () => {
      response = await logoutCommandHandler.execute(new LogoutCommand('refresh-token'));
    });

    it('should call tokensService clear refresh token', () => {
      expect(tokensService.clearRefreshToken).toBeCalledTimes(1);
      expect(tokensService.clearRefreshToken).toBeCalledWith('refresh-token');
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });

  describe('when there is no refreshToken', () => {
    beforeAll(() => {
      tokensService.clearRefreshToken = jest.fn().mockResolvedValue(undefined);
    });

    let response;
    let error;

    beforeEach(async () => {
      try {
        response = await logoutCommandHandler.execute(new LogoutCommand(undefined));
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should not call tokensService clear refresh token', () => {
      expect(tokensService.clearRefreshToken).not.toBeCalled();
    });

    it('should throw an error', () => {
      expect(error.status).toEqual(401);
      expect(error.message).toEqual('Unauthorized');
    });

    it('should return undefined', () => {
      expect(response).toEqual(undefined);
    });
  });
});
