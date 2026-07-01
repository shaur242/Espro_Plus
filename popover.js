/**
 * ============================================
 * ESPro+
 * popover.js
 * ============================================
 */
console.log("Popover loaded")
const Popover = {

    element: null,

    currentSubject: null,

    currentRefs: null,

    create() {

        if (this.element)
            return;

        this.element = document.createElement("div");

        this.element.className = "espro-popover";

        this.element.style.display = "none";

        document.body.appendChild(this.element);

        // Close when clicking outside
        document.addEventListener("click", (e) => {

            if (!this.element)
                return;

            if (
                this.element.contains(e.target)
            )
                return;

            this.close();

        });

    },

    open(subject, refs, anchor) {

        this.create();

        this.currentSubject = subject;
        this.currentRefs = refs;

        this.render(subject, refs);

        const rect = anchor.getBoundingClientRect();

        this.element.style.left =
            `${window.scrollX + rect.left}px`;

        this.element.style.top =
            `${window.scrollY + rect.bottom + 8}px`;

        this.element.style.display = "block";

    },

    close() {

        if (!this.element)
            return;

        this.element.style.display = "none";

    },

    render(subject, refs) {

        const result =
            Calculator.calculate(subject);

        this.element.innerHTML = `

            <div class="espro-popover-title">

                Attendance Simulator

            </div>

            <div class="espro-slider-labels">

                <span>-20</span>

                <span>+20</span>

            </div>

            <input
                class="espro-slider"
                type="range"
                min="-20"
                max="20"
                value="0"
            >

            <div class="espro-slider-value">

                0

            </div>

            <div class="espro-projected">

                <div class="espro-projection">

                    <div class="espro-projection-item">

                        <span class="projection-title">
                            Attendance
                        </span>

                        <span class="projection-value">

                            ${result.percentage}%

                        </span>

                    </div>

                    <div class="projection-divider"></div>

                    <div class="espro-projection-item">

                        <span class="projection-title">
                            Classes
                        </span>

                        <span class="projection-value">

                            ${result.attended}/${result.total}

                        </span>

                    </div>

                </div>

            </div>

        `;

        const slider =
            this.element.querySelector(".espro-slider");

        const value =
            this.element.querySelector(".espro-slider-value");

        slider.addEventListener("input", () => {

            const offset =
                Number(slider.value);

            value.textContent =
                offset > 0
                    ? "+" + offset
                    : offset;

            const calc =
                Calculator.calculate(subject, offset);

            this.element.querySelector(
                ".projection-value"
            ).textContent =
                calc.percentage + "%";

            this.element.querySelectorAll(
                ".projection-value"
            )[1].textContent =
                `${calc.attended}/${calc.total}`;

            refs.need75.textContent =
                calc.need75 === 0
                    ? "Reached"
                    : calc.need75 + " cls";

            refs.need85.textContent =
                calc.need85 === 0
                    ? "Reached"
                    : calc.need85 + " cls";

            refs.bunks.textContent =
                calc.safeBunks;

            refs.need75.className =
                `espro-badge ${calc.colors.need75}`;

            refs.need85.className =
                `espro-badge ${calc.colors.need85}`;

            refs.bunks.className =
                `espro-badge ${calc.colors.bunks}`;

        });

    }

};