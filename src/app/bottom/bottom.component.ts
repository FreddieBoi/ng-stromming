import { Component } from '@angular/core';
import { IServiceInfo } from '../shared/services/service-info';
import { SfAnytimeService } from '../shared/services/sf-anytime.service';
import { SvtPlayService } from '../shared/services/svt-play.service';
import { ViaplayService } from '../shared/services/viaplay.service';
import { CmoreService } from '../shared/services/cmore.service';

@Component({
  selector: 'app-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.scss']
})
export class BottomComponent {
  serviceInfos: IServiceInfo[] = [
    SfAnytimeService.info,
    SvtPlayService.info,
    ViaplayService.info,
    CmoreService.info,
  ];
}
