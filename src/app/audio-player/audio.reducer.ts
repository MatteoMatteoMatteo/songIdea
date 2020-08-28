import { AudioActions, SET_AUDIO } from "./audio.actions";
import * as Tone from "tone";

export interface State {
  audio: any[];
}

const initialState: State = {
  audio: [],
};

export function audioReducer(state = initialState, action: AudioActions) {
  switch (action.type) {
    case SET_AUDIO:
      return {
        ...state,
        audio: action.payload,
      };

    default: {
      return state;
    }
  }
}

export const getAudio = (state: State) => state.audio;
