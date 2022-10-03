import { ProjectPhaseModel } from 'pp365-shared/lib/models'

export interface IProjectPhaseProps {
  /**
   * Phase
   */
  phase: ProjectPhaseModel

  /**
   * Is current phase
   */
  isCurrentPhase?: boolean

  /**
   * Change phase enabled
   */
  changePhaseEnabled?: boolean

  /**
   * On change phase handler
   *
   * @param target Target
   */
  onChangePhaseHandler?: (target: HTMLSpanElement) => void

  /**
   * On open callout
   *
   * @param target Target
   * @param phase Phase
   */
  onOpenCallout: (target: HTMLSpanElement, phase: ProjectPhaseModel) => void
}
