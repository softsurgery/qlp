export enum ParticipantRole {
  HOST = 'host',
  STUDENT = 'student',
  OBSERVER = 'observer',
}

export const PARTICIPANT_ROLE_RANK: Readonly<Record<ParticipantRole, number>> = Object.freeze({
  [ParticipantRole.OBSERVER]: 1,
  [ParticipantRole.STUDENT]: 2,
  [ParticipantRole.HOST]: 3,
});
