import { setup } from 'xstate';
import { CurriculumStatus } from '../enums/curriculum-status.enum';
import { CurriculumEvent } from '../enums/curriculum-event.enum';

export const curriculumExamMachine = setup({
  types: {
    context: {} as { IsUpdatable: boolean },
    events: {} as
      | { type: CurriculumEvent.Publish }
      | { type: CurriculumEvent.Archive }
      | { type: CurriculumEvent.Restore }
      | { type: CurriculumEvent.Unpublish },
  },
}).createMachine({
  context: {
    IsUpdatable: true,
  },
  id: 'Curriculum Exam Flow',
  initial: CurriculumStatus.Draft,
  states: {
    [CurriculumStatus.Draft]: {
      on: {
        [CurriculumEvent.Publish]: {
          target: CurriculumStatus.Published,
        },
        [CurriculumEvent.Archive]: {
          target: CurriculumStatus.Archived,
        },
      },
      meta: {
        isUpdatable: true,
      },
    },
    [CurriculumStatus.Published]: {
      on: {
        [CurriculumEvent.Archive]: {
          target: CurriculumStatus.Archived,
        },
        [CurriculumEvent.Unpublish]: {
          target: CurriculumStatus.Draft,
        },
      },
      meta: {
        isUpdatable: true,
      },
    },
    [CurriculumStatus.Archived]: {
      on: {
        [CurriculumEvent.Restore]: {
          target: CurriculumStatus.Draft,
        },
      },
      meta: {
        isUpdatable: false,
      },
    },
  },
});
