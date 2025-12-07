import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator((data: unknown, context: ExecutionContext) => {
  let req: any
  switch (context.getType<string>()) {
    case "http":
      req = context.switchToHttp().getRequest()
      break
    case "ws":
      req = context.switchToWs().getClient()
      break
    case "graphql":
      //req = GqlExecutionContext.create(context).getContext().req
      break
    default:
      break
  }
  return req.credentials.user
})
