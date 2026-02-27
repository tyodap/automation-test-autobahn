import { Asset } from "./asset.interface";
import { User } from "./user.interface";

export interface Workout {
  name: string;
  instanceId: string;
  workoutId: string;
  effort: string[];
  impact: string;
  workoutStatus: string[];
  tag: string[];
  assetTag: string[];
  issueTag: string[];
  issueAssignee: User[];
  asset: Asset[];
}
