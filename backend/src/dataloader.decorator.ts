import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

type Loaders = 'hotels' | 'floors' | 'rooms' | 'guests';

export const Loader = createParamDecorator((name: Loaders, context: ExecutionContext) => {
  if (!name) throw new InternalServerErrorException(`Invalid name provider to @Loader ('${name}')`);

  const ctx = GqlExecutionContext.create(context).getContext();
  return ctx[`${name}Loader`];
});
