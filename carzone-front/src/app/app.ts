import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from "./components/shared/navbar/navbar";
import { Footer } from './components/shared/footer/footer';
import AOS from 'aos';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('carzone-front');
  protected readonly showLayout = signal(true);

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.findLastChild(this.activatedRoute)),
    ).subscribe((route) => {
      const noLayout = route.snapshot.data['noLayout'] as boolean | undefined;
      this.showLayout.set(!noLayout);
    });
  }

  private findLastChild(route: ActivatedRoute): ActivatedRoute {
    return route.firstChild ? this.findLastChild(route.firstChild) : route;
  }
}
