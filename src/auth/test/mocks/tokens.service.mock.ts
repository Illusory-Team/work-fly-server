export const TokensServiceMock = jest.fn().mockReturnValue({
  generateTokens: jest.fn(),
  validateRefreshToken: jest.fn(),
});
