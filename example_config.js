Use this as the example in your MagicMirror config.js


	{
    		module: "MMM-MortgageCountdown",
    		position: "top_right",  // Choose your preferred position
                header: "Mortgage Progress",
    		config: {
        		lastPaymentDate: "2033-01-01",         // Your last mortgage payment date
        		nextSwitchDate: "2027-01-01",          // Set your next switch date
			originalCompletionDate: "2038-08-30",  // Original mortgage completion date
    		}
	},
