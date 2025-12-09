import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization/authorization.guard';
import { AuthenticationGuard } from '../guards/authentication/authentication.guard';
import { RoleEnum } from '../enums/user.enum';
import { TokenEnum } from '../enums/token.enum';
import { Roles } from './role.type.decorator';
import { Token } from './token.type.decorator';

export function Auth(accessRoles: RoleEnum[],
    type: TokenEnum = TokenEnum.Access) {
    return applyDecorators(
        Roles(accessRoles),
        Token(type),
        UseGuards(AuthenticationGuard, AuthorizationGuard),
    );
}
