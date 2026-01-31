import { Component, Renderer2, Inject, PLATFORM_ID } from '@angular/core'; // Import Renderer2
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{ 

  birthDate: Date = new Date('2001-08-31T14:29:00');
  realTimeAge: string = '';
  isDarkMode: boolean = false; 

  // Inject Renderer2
  constructor(private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) {
    this.calculateRealTimeAge();
    this.checkTimeForDarkMode(); 
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
      const diff = now.getTime() - this.birthDate.getTime();

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
      const hours = now.getHours().toFixed(0).padStart(2, '0');
      const minutes = now.getMinutes().toFixed(0).padStart(2, '0');
      const seconds = now.getSeconds();
      
      // this.realTimeAge = `${years} years, ${months} months, ${days} days, ${hours}:${minutes}:${seconds}`;
      this.realTimeAge = `${years}.${months} years`;
  }

}