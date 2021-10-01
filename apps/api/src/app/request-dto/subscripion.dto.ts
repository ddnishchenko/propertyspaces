import { IsIn, IsNotEmpty, } from "class-validator";
import { Subscriptions } from "../users/subscriptions.enum";

export class SubscriptionDto {
  @IsNotEmpty()
  @IsIn([Subscriptions.Free, Subscriptions.Economy, Subscriptions.Premium])
  type: Subscriptions.Free | Subscriptions.Economy | Subscriptions.Premium;
}
