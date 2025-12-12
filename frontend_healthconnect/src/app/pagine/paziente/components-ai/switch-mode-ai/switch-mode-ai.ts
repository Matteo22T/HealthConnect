import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-switch-mode-ai',
  imports: [],
  templateUrl: './switch-mode-ai.html',
  styleUrl: './switch-mode-ai.css',
})
export class SwitchModeAi {
  @Input() currentMode: 'support' | 'medical' = 'support';
  @Output() modeChanged = new EventEmitter<'support' | 'medical'>();

  onModeClick(mode: 'support' | 'medical') {
    if (this.currentMode !== mode) {
      this.modeChanged.emit(mode);
    }
  }
}
