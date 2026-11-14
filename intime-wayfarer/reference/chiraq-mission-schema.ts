// Reference only; not imported by the temporal game.
// Recovered via read-only Replit source response, Chiraq City Saga.
// Reported HEAD: 8bdc4ab625c0c49cdd84438288ebeed13157e77f
// Source: artifacts/3d-game/src/game/types.ts
export interface Vec3 { x: number; y: number; z: number }
export interface MissionCheckpoint {
  pos: Vec3;
  radius: number;
  label: string;
  dialogue?: { speaker: string; text: string };
}
export interface Mission {
  id: string;
  title: string;
  description: string;
  checkpoints: MissionCheckpoint[];
  rewards: { cash: number; reputation: number };
  startDialogue: { speaker: string; text: string };
  endDialogue: { speaker: string; text: string };
}
