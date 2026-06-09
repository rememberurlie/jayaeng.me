import { Component, Renderer2, Inject, PLATFORM_ID, OnDestroy, NgZone } from '@angular/core'; // Import Renderer2
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnDestroy {

  birthDate: Date = new Date('2001-08-31T14:29:00');
  realTimeAge: string = '';
  isDarkMode: boolean = false;
  private ageTimer: any;

  // Inject Renderer2
  constructor(private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {
    this.calculateRealTimeAge();
    this.checkTimeForDarkMode();

    // Tick every second in the browser (works on static hosts like GitHub Pages).
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.ageTimer = setInterval(() => {
          this.ngZone.run(() => this.calculateRealTimeAge());
        }, 1000);
      });
    }
  }

  ngOnDestroy() {
    if (this.ageTimer) {
      clearInterval(this.ageTimer);
    }
  }

  checkTimeForDarkMode() {
    const hour = new Date().getHours();
    
    // Check if we are in the browser to access document/body safely
    if (isPlatformBrowser(this.platformId)) {
        if (hour >= 18 || hour < 6) {
            this.isDarkMode = true;
            // Add class to body
            this.renderer.addClass(document.body, 'dark-mode-body');
        } else {
            this.isDarkMode = false;
            // Remove class from body (optional if default is false)
            this.renderer.removeClass(document.body, 'dark-mode-body');
        }
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkMode) {
        this.renderer.addClass(document.body, 'dark-mode-body');
      } else {
        this.renderer.removeClass(document.body, 'dark-mode-body');
      }
    }
  }

  calculateRealTimeAge() {

      const now = new Date();
      const birth = this.birthDate;

      // Calendar-aware years / months / days.
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      let hours = now.getHours() - birth.getHours();
      let minutes = now.getMinutes() - birth.getMinutes();
      let seconds = now.getSeconds() - birth.getSeconds();

      if (seconds < 0) { seconds += 60; minutes--; }
      if (minutes < 0) { minutes += 60; hours--; }
      if (hours < 0) { hours += 24; days--; }
      if (days < 0) {
        // Borrow days from the previous month.
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
        months--;
      }
      if (months < 0) { months += 12; years--; }

      const pad = (n: number) => n.toString().padStart(2, '0');
      this.realTimeAge =
        `${years} years ${months} months ${days} days ` +
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

}