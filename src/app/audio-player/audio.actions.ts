import { Action } from "@ngrx/store";
export const SET_AUDIO = "[AUDIO] Set Audio";
import * as Tone from "tone";

export class SetAudio implements Action {
  readonly type = SET_AUDIO;
  constructor(public payload: any[]) {}
}

export type AudioActions = SetAudio;
