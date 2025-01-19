export function startViewTransition (viewEffect) {
    if (!document.startViewTransition) {
        return void viewEffect();

    }
    // With View Transitions (return promise)
    return document.startViewTransition(viewEffect);
}