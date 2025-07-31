import {
  AppFunctionTooltip,
  AppFunctionTooltipIdentifier,
} from './utils/tooltip.model';
import { TooltipsResources } from './tooltips.resources';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TooltipsService {
  constructor(private resources: TooltipsResources) {}

  public async getTooltip(
    identifier: AppFunctionTooltipIdentifier,
  ): Promise<AppFunctionTooltip> {
    return firstValueFrom(this.resources.receiveAppFunctionTooltip(identifier));
  }
}
