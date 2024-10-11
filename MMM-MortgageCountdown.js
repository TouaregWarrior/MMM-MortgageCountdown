Module.register("MMM-MortgageCountdown", {
    defaults: {
        lastPaymentDate: "2030-01-01",   // Anticipated last mortgage payment date
        nextSwitchDate: "2026-04-01",    // Next deal switch date
        originalCompletionDate: "2032-01-01",  // Original mortgage completion date
        updateInterval: 1000 * 60 * 60 * 24    // Update every 24 hours
    },

    getStyles: function () {
        return [
            "MMM-MortgageCountdown.css", // Ensure this is the updated CSS file
            "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300&display=swap"  // Load Roboto Condensed font
        ];
    },

    start: function () {
        this.totalMonthsRemaining = 0;
        this.yearsRemaining = 0;
        this.monthsRemaining = 0;

        this.switchYearsRemaining = 0;
        this.switchMonthsRemaining = 0;

        this.monthsAhead = 0;
        this.scheduleStatus = "ahead"; // Default status as "ahead"

        this.calculateTimeRemaining();
        this.calculateSwitchTimeRemaining();
        this.calculateMonthsAhead();
        this.scheduleUpdate();
    },

    calculateTimeRemaining: function () {
        const currentDate = new Date();
        const lastPaymentDate = new Date(this.config.lastPaymentDate);

        let totalMonths;
        totalMonths = (lastPaymentDate.getFullYear() - currentDate.getFullYear()) * 12;
        totalMonths -= currentDate.getMonth();
        totalMonths += lastPaymentDate.getMonth();

        if (currentDate.getDate() > 1) {
            totalMonths--;
        }

        this.totalMonthsRemaining = totalMonths <= 0 ? 0 : totalMonths;
        this.yearsRemaining = Math.floor(this.totalMonthsRemaining / 12);
        this.monthsRemaining = this.totalMonthsRemaining % 12;
    },

    calculateSwitchTimeRemaining: function () {
        const currentDate = new Date();
        const nextSwitchDate = new Date(this.config.nextSwitchDate);

        let totalSwitchMonths;
        totalSwitchMonths = (nextSwitchDate.getFullYear() - currentDate.getFullYear()) * 12;
        totalSwitchMonths -= currentDate.getMonth();
        totalSwitchMonths += nextSwitchDate.getMonth();

        if (currentDate.getDate() > 1) {
            totalSwitchMonths--;
        }

        this.switchYearsRemaining = Math.floor(totalSwitchMonths / 12);
        this.switchMonthsRemaining = totalSwitchMonths % 12;
    },

    calculateMonthsAhead: function () {
        const currentDate = new Date();
        const originalCompletionDate = new Date(this.config.originalCompletionDate);
        const lastPaymentDate = new Date(this.config.lastPaymentDate);

        let originalMonthsRemaining;
        originalMonthsRemaining = (originalCompletionDate.getFullYear() - currentDate.getFullYear()) * 12;
        originalMonthsRemaining -= currentDate.getMonth();
        originalMonthsRemaining += originalCompletionDate.getMonth();

        if (currentDate.getDate() > 1) {
            originalMonthsRemaining--;
        }

        let newMonthsRemaining;
        newMonthsRemaining = (lastPaymentDate.getFullYear() - currentDate.getFullYear()) * 12;
        newMonthsRemaining -= currentDate.getMonth();
        newMonthsRemaining += lastPaymentDate.getMonth();

        if (currentDate.getDate() > 1) {
            newMonthsRemaining--;
        }

        this.monthsAhead = originalMonthsRemaining - newMonthsRemaining;

        if (this.monthsAhead >= 0) {
            this.scheduleStatus = "ahead";
        } else {
            this.scheduleStatus = "behind";
            this.monthsAhead = Math.abs(this.monthsAhead);
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");

        let paymentsColorClass = "";
        if (this.totalMonthsRemaining > 100) {
            paymentsColorClass = "red-text";
        } else if (this.totalMonthsRemaining >= 50 && this.totalMonthsRemaining <= 99) {
            paymentsColorClass = "yellow-text";
        } else {
            paymentsColorClass = "green-text";
        }

        const monthsToNextSwitch = this.switchYearsRemaining * 12 + this.switchMonthsRemaining;
        let switchColorClass = "";
        if (monthsToNextSwitch < 6) {
            switchColorClass = "red-text";
        } else if (monthsToNextSwitch >= 7 && monthsToNextSwitch <= 12) {
            switchColorClass = "yellow-text";
        } else {
            switchColorClass = "green-text";
        }

        const aheadColorClass = this.scheduleStatus === "ahead" ? "green-text" : "red-text";
        let scheduleText = "";

        if (this.scheduleStatus === "ahead") {
            scheduleText = `Months ahead of schedule: <span class="${aheadColorClass}">${this.monthsAhead}</span>`;
        } else {
            scheduleText = `Months behind schedule: <span class="${aheadColorClass}">${this.monthsAhead}</span>`;
        }

        wrapper.innerHTML = `
            <table class="mortgage-table">
                <tr>
                    <td colspan="3" class="title">Mortgage Progress</td>
                </tr>
                <tr>
                    <td colspan="3" class="divider"></td>
                </tr>
                <tr>
                    <td>Payments remaining:</td>
                    <td style="width: 20px;"></td>
                    <td class="${paymentsColorClass}">${this.totalMonthsRemaining}</td>
                </tr>
                <tr>
                    <td>Months to next switch:</td>
                    <td style="width: 20px;"></td>
                    <td class="${switchColorClass}">${monthsToNextSwitch}</td>
                </tr>
                <tr>
                    <td>${this.scheduleStatus === "ahead" ? "Months ahead of schedule:" : "Months behind schedule:"}</td>
                    <td style="width: 20px;"></td>
                    <td class="${aheadColorClass}">${this.monthsAhead}</td>
                </tr>
            </table>
        `;

        return wrapper;
    }
});
