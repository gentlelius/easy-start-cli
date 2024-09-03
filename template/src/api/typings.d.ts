// @ts-ignore
/* eslint-disable */

declare namespace API {
  type ApplicationResult = {
    code?: string;
    data?: ApplicationsData[];
    success?: boolean;
  };

  type ApplicationsData = {
    name?: string;
    displayNo?: number;
    systemId?: number;
    id?: number;
  };

  type CommonResponse = {
    success: boolean;
    code: string;
    error: string;
    data: any;
  };

  type CurrentUser = {
    account: string;
    createdBy: string;
    createdTime: string;
    departmentId: number;
    email?: string;
    englishName?: string;
    flagPwdInited: number;
    id: number;
    mobile: string;
    mobileCode: string;
    name: string;
    nickname: string;
    officialName: string;
    password: string;
    pwdExpiredTime: string;
    remark: string;
    roleIds: string;
    roleNames: string;
    status: number;
    updatedBy: string;
    updatedTime: string;
  };

  type LoginFormParams = {
    username: string;
    password: string;
    captcha: {
      captchaCode: string;
    };
    autoLogin: boolean;
  };

  type LoginParams = {
    account: string;
    password: string;
    verifyCode: string;
  };

  type LoginResult = {
    success: boolean;
    code: string;
    error: string;
    data: {
      user: CurrentUser;
      accessToken: string;
      accessTokenExpMs: string;
      refreshToken: string;
      refreshTokenExpMs: string;
      needUpdatePwd: string;
      redirectUrl: string;
    };
  };

  type RefreshTokenParams = {
    refreshToken: string | null;
  };
}
