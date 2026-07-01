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

    // Wait until React finishes rendering
    if (subjects.length === 0)
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

        // React recreated the cards
        if (
            document.querySelectorAll(".attendance-plus").length !==
            Parser.getSubjects().length
        ) {

            injected = false;

        }

        inject();

    }, 500);

}

startPolling();