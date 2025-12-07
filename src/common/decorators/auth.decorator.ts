import { applyDecorators, UseGuards } from "@nestjs/common";
import { RoleEnum, TokenEnum } from "../enums";

import { AuthorizationGuard } from "../guards/authorization/authorization.guard";
import { AuthenticationGuard } from "../guards/authentication/authentication.guard";
import { Roles } from "./role.type.decorator";
import { Token } from "./token.type.decorator";

export function Auth(accessRoles: RoleEnum[], type: TokenEnum = TokenEnum.Access) {
  return applyDecorators(
    Roles(accessRoles),
    Token(type),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}
