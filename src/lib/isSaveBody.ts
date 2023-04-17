import { Body } from "matter-js";

const safeBodies = [
  "Lower Left Arm",
  "Lower Left Leg",
  "Lower Right Arm",
  "Lower Right Leg",
];

export function isSaveBody(value: Body): boolean {
  return safeBodies.includes(value.label);
}
