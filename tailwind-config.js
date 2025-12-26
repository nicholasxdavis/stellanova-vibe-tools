// Setup Tailwind with EXACT BN custom theme
(function() {
    function configureTailwind() {
        if (typeof tailwind !== 'undefined' && tailwind.config) {
            tailwind.config = {
                darkMode: 'class', // This extension will always be in dark mode
                theme: {
                    extend: {
                        colors: {
                            'bn-dark': '#1A1A1A',
                            'bn-black': '#000000', // Pure black bg
                            'bn-orange': '#d4611c', // Main orange from your CSS
                            'bn-orange-hover': '#e67a35', // Hover orange from your CSS
                        },
                        fontFamily: {
                            sans: ['Inter', 'sans-serif'],
                            heading: ['Poppins', 'sans-serif'], // Poppins for headings
                        },
                        borderRadius: {
                            '2xl': '1rem',
                            '3xl': '1.5rem',
                        }
                    }
                }
            };
            // Force dark mode on html element
            document.documentElement.classList.add('dark');
        } else {
            // Retry if Tailwind isn't loaded yet
            setTimeout(configureTailwind, 100);
        }
    }
    
    // Try to configure immediately
    configureTailwind();
    
    // Also try on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', configureTailwind);
    } else {
        configureTailwind();
    }
})();

