import { Logger, LogLevel } from '@pnp/logging'
import { IProjectSetupData } from 'projectSetup'
import { IProjectSetupSettings } from 'projectSetup/ProjectSetupSettings'
import { OnProgressCallbackFunction } from '../OnProgressCallbackFunction'
import { IBaseTask } from './IBaseTask'
import { IBaseTaskParams } from './IBaseTaskParams'

export abstract class BaseTask implements IBaseTask {
  public settings: IProjectSetupSettings
  public params: IBaseTaskParams
  public onProgress: OnProgressCallbackFunction

  constructor(public taskName: string, public data: IProjectSetupData) {
    this.settings = data.settings.values
  }

  /**
   * Execute task
   *
   * @param params Task parameters
   * @param onProgress Progress function
   */
  public abstract execute(
    params: IBaseTaskParams,
    onProgress: OnProgressCallbackFunction
  ): Promise<IBaseTaskParams>

  /**
   * Log error
   *
   * @param message Message
   * @param data Data
   */
  public logError(message: string, data?: any) {
    this._log(`(ProjectSetup) [${this.taskName}]: ${message}`, data, LogLevel.Error)
  }

  /**
   * Log warning
   *
   * @param message Message
   * @param data Data
   */
  public logWarning(message: string, data?: any) {
    this._log(`(ProjectSetup) [${this.taskName}]: ${message}`, data, LogLevel.Warning)
  }

  /**
   * Log information
   *
   * @param message Message
   * @param data Data
   */
  public logInformation(message: string, data?: any) {
    this._log(`(ProjectSetup) [${this.taskName}]: ${message}`, data, LogLevel.Info)
  }

  /**
   * Log
   *
   * @param message Message
   * @param data Data
   * @param level Level
   */
  protected _log(message: string, data: any, level: LogLevel) {
    Logger.log({ message, data, level })
  }
}

export * from './BaseTaskError'
export * from './IBaseTask'
export * from './IBaseTaskParams'
