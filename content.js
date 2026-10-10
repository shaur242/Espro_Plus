/**
 * ============================================
 * ESPro+
 * content.js
 * ============================================
 */

console.log("🚀 ESPro+ Started");

let injected = false;
let timer = null;

/**
 * Inject ESPro+
 */
function inject() {

    // Only run on attendance page
    if (!location.pathname.includes("/attendence")) {

        injected = false;
        return;

    }

    const subjects = Parser.getSubjects();
    const overall = Parser.getOverallAttendance();

    // Wait until React finishes rendering baseline components
    if (subjects.length === 0 || !overall)
        return;

    // Already injected
    if (injected)
        return;

    Renderer.render();

    injected = true;
    console.count("inject()");

    console.log("✅ ESPro+ Injected");

}

/**
 * Start polling
 */
function startPolling() {

    if (timer)
        return;

    timer = setInterval(() => {

        // If user left attendance page,
        // reset and wait.
        if (!location.pathname.includes("/attendence")) {

            injected = false;
            return;

        }

        // Detect if React dynamically recreated cards/headers
        const injectedPanels = document.querySelectorAll(".attendance-plus").length;
        const totalExpected = Parser.getSubjects().length + (Parser.getOverallAttendance() ? 1 : 0);

        if (injectedPanels !== totalExpected) {

            injected = false;

        }

        inject();

    }, 500);

}

startPolling();