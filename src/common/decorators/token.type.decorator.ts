import { SetMetadata } from "@nestjs/common";
import { TokenEnum } from "../enums";

export const tokenName = "tokenType";
export const Token = (type: TokenEnum = TokenEnum.Access) => {
  return SetMetadata(tokenName, type);
};
