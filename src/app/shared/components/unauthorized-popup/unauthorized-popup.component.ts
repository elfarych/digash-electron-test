import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-unauthorized-popup',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './unauthorized-popup.component.html',
  styleUrls: ['./unauthorized-popup.component.scss']
})
export class UnauthorizedPopupComponent {
  public redirectToLogin(): void {

  }

  public close(): void {

  }
}
