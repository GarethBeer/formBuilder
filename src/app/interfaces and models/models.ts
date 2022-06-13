export class UserInfo {
  identityProvider: string = '';
  userId: string = '';
  userDetails: string = '';
  userRoles: string[] = [];
}

export class Model {
  constructor(obj:any) {
      Object.assign(this, obj)
    }
}
