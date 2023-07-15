import { Test } from '@nestjs/testing';
import { TokensModule } from 'tokens/tokens.module';
import { TokensService } from 'tokens/tokens.service';
import { TokensServiceMock } from 'auth/test/mocks';
import { ConfigModule } from '@nestjs/config';
import { RefreshCommandHandler } from './refresh.command-handler';
import { RefreshCommand } from './refresh.command';
import { userStub } from 'auth/test/stubs';

describe('when refresh is called', () => {
  let refreshCommandHandler: RefreshCommandHandler;
  let tokensService: TokensService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RefreshCommandHandler],
      imports: [ConfigModule.forRoot({ isGlobal: true }), TokensModule],
    })
      .overrideProvider(TokensService)
      .useValue(TokensServiceMock())
      .compile();

    refreshCommandHandler = moduleRef.get<RefreshCommandHandler>(RefreshCommandHandler);
    tokensService = moduleRef.get<TokensService>(TokensService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when it is called correctly', () => {
    beforeAll(() => {
      tokensService.validateRefreshToken = jest.fn().mockResolvedValue({ userId: userStub().id });
      tokensService.generateTokens = jest
        .fn()
        .mockResolvedValue({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    let response;

    beforeEach(async () => {
      response = await refreshCommandHandler.execute(new RefreshCommand('refresh-token'));
    });

    it('should call tokensService validate refresh token', () => {
      expect(tokensService.validateRefreshToken).toBeCalledTimes(1);
      expect(tokensService.validateRefreshToken).toBeCalledWith('refresh-token');
    });

    it('should call tokensService generate tokens', () => {
      expect(tokensService.generateTokens).toBeCalledTimes(1);
      expect(tokensService.generateTokens).toBeCalledWith(userStub().id);
    });

    it('should return tokens', () => {
      expect(response).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });
  });

  describe('when refresh token is not valid', () => {
    beforeAll(() => {
      tokensService.validateRefreshToken = jest.fn().mockResolvedValue(undefined);
      tokensService.generateTokens = jest
        .fn()
        .mockResolvedValue({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    let response;
    let error;

    beforeEach(async () => {
      try {
        response = await refreshCommandHandler.execute(new RefreshCommand('refresh-token'));
      } catch (responseError) {
        error = responseError;
      }
    });

    it('should call tokensService validate refresh token', () => {
      expect(tokensService.validateRefreshToken).toBeCalledTimes(1);
      expect(tokensService.validateRefreshToken).toBeCalledWith('refresh-token');
    });

    it('should not call tokensService generate tokens', () => {
      expect(tokensService.generateTokens).not.toBeCalled();
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
