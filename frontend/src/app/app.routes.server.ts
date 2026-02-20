import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'recipe-spring-angular',
    renderMode: RenderMode.Prerender,
  }
];
