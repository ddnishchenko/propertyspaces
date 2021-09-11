import { Injectable } from '@nestjs/common';
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Action } from './actions.enum';
import { Role } from '../roles/role.enum';
import { Project } from './entities/project';
import { User } from './entities/user';
type Subjects = InferSubjects<typeof Project | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.roles.includes(Role.Admin)) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    if (user.roles.includes(Role.User)) {
      can([Action.Create, Action.Update, Action.Delete], Project, { userId: user.id });
      can([Action.Read, Action.Update, Action.Delete], User, { id: user.id });
      // cannot(Action.Delete, {}, { isPublished: true });
    }



    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
    });
  }
}
