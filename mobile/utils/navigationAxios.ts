// lib/navigation.ts
import { Router } from 'expo-router';

let routerRef: Router | null = null;

export function setRouter(router: Router) {
  routerRef = router;
}

export function navigate(path: any) {
  if (routerRef) {
    routerRef.replace(path);
  } else {
    console.warn("Router não inicializado");
  }
}
