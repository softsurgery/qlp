import { BadRequestException, Injectable } from '@nestjs/common';
import { getNextSnapshot } from 'xstate';

@Injectable()
export class AbstractWorkflowService<S, E> {
  machine: any;
  constructor(
    machine: any,
    private readonly eventsEnum: Record<string, E>,
  ) {
    this.machine = machine;
  }

  protected resolveMachine(machine?: any) {
    return machine ?? this.machine;
  }

  canTransition(currentStatus: S, event: E, machine?: any): boolean {
    const snapshot = this.resolveMachine(machine).resolveState({
      value: currentStatus,
    });
    return snapshot.can({ type: event });
  }

  transition(currentStatus: S, event: E, machine?: any): S {
    const resolved = this.resolveMachine(machine);
    const snapshot = resolved.resolveState({
      value: currentStatus,
    });

    if (!snapshot.can({ type: event })) {
      throw new BadRequestException(
        `Cannot perform '${event as string}' with status '${currentStatus as string}'`,
      );
    }

    const nextSnapshot = getNextSnapshot(resolved, snapshot, {
      type: event as any,
    });
    return nextSnapshot.value as S;
  }

  getNextSteps(currentStatus: S, machine?: any): { label: string }[] {
    const snapshot = this.resolveMachine(machine).resolveState({
      value: currentStatus,
    });

    const allEvents = Object.values<E>(this.eventsEnum) as string[];

    return allEvents
      .filter((event) => snapshot.can({ type: event }))
      .map((event) => ({ label: event }));
  }

  isUpdatable(currentStatus: S, machine?: any): boolean {
    const snapshot = this.resolveMachine(machine).resolveState({
      value: currentStatus,
    });

    const meta = snapshot.getMeta();

    // pick the first (and only) meta entry
    const stateMeta = Object.values(meta)[0] as { isUpdatable?: boolean } | undefined;

    return stateMeta?.isUpdatable ?? false;
  }
}
