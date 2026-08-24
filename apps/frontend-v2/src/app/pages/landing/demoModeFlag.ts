/**
 * One real, shared sessionStorage key marking "this session was
 * entered via a demo account" - set right before navigating into a
 * demo portal, read by ExitDemoButton (mounted once at the app root)
 * to decide whether to show a way back. sessionStorage (not
 * localStorage) is deliberate: closing the tab naturally clears it,
 * so a stray demo flag never persists into an unrelated future real
 * session on the same browser.
 */
export const DEMO_MODE_KEY = "ryuzen-demo-mode";
