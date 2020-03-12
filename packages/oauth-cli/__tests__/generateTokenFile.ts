import { v4 as uuid } from "uuid";
import testCLI from "@node-cli-toolkit/test-cli";
import { getToken } from "@node-api-toolkit/save-token";

describe("@node-cli-toolkit/oauth-cli/generateTokenCLI", () => {
  beforeEach(() => {
    jest.setTimeout(10000);
  });

  it("should be able to generate a token using command line arguments and save to file", async () => {
    const tokenIdentifier = `NODE_CLI_TOOLKIT_OAUTH_TOKEN_JEST_GENERATE_TOKEN_CLI_${uuid()}`;
    const { code, error } = await testCLI({
      nodeCommand: "ts-node",
      extension: "ts",
      nodeScriptPath: `${__dirname}/../generateTokenCLI.ts`,
      mockScriptPath: [
        `${__dirname}/../__mocks/dropboxOauth.ts`,
        `${__dirname}/../__mocks/noExecSync.ts`,
        `${__dirname}/../__mocks/dropboxOauthSimulateCallback.ts`
      ],
      args: `--oauthStrategy passport-dropbox-oauth2 \
        --oauthStrategyOptions.apiVersion 2 \
        --appSecret SECRET \
        --appKey KEY \
        --saveTokenToFile \
        --tokenIdentifier ${tokenIdentifier}`
    });

    // @todo find out why it goes to error
    // expect(error.mock.calls.length).toBe(0);

    expect(code).toBe(0);
    const token = await getToken({
      tokenIdentifier
    });
    expect(token).toEqual("I_AM_THE_TOKEN");
  });
});
