import React from "react";

export const ActivityStates = Object.freeze({
  default: 0,
  acitve: 1,
  cancelled: 2,
  ended: 3,
});

export function GetActivityState(ticket) {
  if (ticket.DataAnulaty) return ActivityStates.cancelled;
  else if (ticket.Zakonczone) return ActivityStates.ended;
  else if (ticket.Trwa) return ActivityStates.acitve;
  return ActivityStates.default;
}
