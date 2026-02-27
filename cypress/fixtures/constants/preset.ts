import { Preset } from "../interfaces/preset.interface";

export const presetsProd = {
  "e2e-change-issues": {
    name: "e2e-change-issues",
  } as Preset,
  "Script output check": {
    name: "Script output check",
  } as Preset,
  "update tag issues page - prod": {
    name: "add and remove tag - issues list",
  } as Preset,
};

export const presetsTest = {
  "change-issue-status": {
    name: "change-issue-status",
  } as Preset,
  "update tag issues page - test": {
    name: "add and remove tag - issue list",
  } as Preset,
};
