
// AI Studio Environment Entry Point:
// This file, `index.tsx`, is the required entry point for this development environment.
// Despite the .tsx extension, this project is a pure Angular application.


import { bootstrapApplication } from '@angular/platform-browser';
// Fix: provideExperimentalZonelessChangeDetection is renamed to provideZonelessChangeDetection in latest Angular
import { ErrorHandler, APP_INITIALIZER, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './src/app.component';
import { authInterceptor } from './src/interceptors/auth.interceptor';
import { mockBackendInterceptor, mockInitialData } from './src/interceptors/mock-backend.interceptor';
import { routes } from './src/app.routes';
import { CustomErrorHandler } from './src/handlers/custom-error-handler';
import { AtsService } from './src/services/ats.service';
import { CandidateService } from './src/services/candidate.service';

// Factory function for APP_INITIALIZER
const appInitializerFactory = (atsService: AtsService, candidateService: CandidateService) => {
  return () => {
    // Synchronously initialize state with pre-loaded mock data
    const initialPipeline = mockInitialData.initialPipelineStages;
    const initialApplications = mockInitialData.initialCandidateApplications;

    atsService.initializeData(initialPipeline);
    candidateService.initializeData(initialApplications);

    return Promise.resolve();
  };
};

bootstrapApplication(AppComponent, {
  providers: [
    // Fix: updated to non-experimental zoneless change detection
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([mockBackendInterceptor, authInterceptor])),
    provideRouter(routes, withHashLocation()),
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [AtsService, CandidateService],
      multi: true,
    }
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.