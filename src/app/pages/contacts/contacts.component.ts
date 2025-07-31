import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from "../../shared/components/footer/footer.component";
import {DividerModule} from "primeng/divider";
import {PanelModule} from "primeng/panel";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FooterComponent, DividerModule, PanelModule, TranslateModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent {

}
