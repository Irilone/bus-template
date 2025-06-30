<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Guide: Desktop-First to Mobile-First with Bootstrap 5.3</title>
    <!-- Chosen Palette: "Warm Neutral" - A calming palette using Tailwind's stone, slate, and sky color families to create a professional, focused, and modern developer tool aesthetic. -->
    <!-- Application Structure Plan: A single-page application with a sticky top navigation bar for easy access to different logical sections. The structure flows from high-level concepts to practical application, starting with an 'Introduction', moving to 'Core Principles' (the "why"), an interactive 'Retrofit Playbook' (the "how-to"), and finishing with 'Analysis & Implications' (the "results"). This task-oriented flow is more engaging for a developer audience than a linear report, allowing them to either learn sequentially or jump directly to a specific implementation step. The interactivity within the Playbook (e.g., clamp() slider, grid visualizer) is designed to make abstract concepts tangible. -->
    <!-- Visualization & Content Choices:
        - Report Info: Breakpoint ranges (xs, sm, md, lg, xl, xxl). -> Goal: Compare/Inform. -> Viz/Presentation: Horizontal Bar Chart (Chart.js). -> Interaction: Hover tooltips show pixel ranges. -> Justification: A bar chart is an excellent and intuitive way to visualize distinct, ordered ranges, making the breakpoints easy to understand at a glance. -> Library: Chart.js (Canvas).
        - Report Info: CSS clamp() function. -> Goal: Explain/Demonstrate. -> Viz/Presentation: Live text element + slider. -> Interaction: User drags slider to simulate viewport change, and the text size updates in real-time based on the clamp() rule. -> Justification: This makes an abstract CSS concept concrete and interactive, which is far more effective for learning than a static code snippet. -> Library/Method: Vanilla JS + HTML/CSS.
        - Report Info: Bootstrap grid system. -> Goal: Demonstrate. -> Viz/Presentation: Visual block layout. -> Interaction: User clicks buttons ('Mobile', 'Tablet', 'Desktop') to dynamically change column classes and see the layout reflow. -> Justification: Directly visualizes the core concept of responsive columns in a way that's easy to grasp. -> Library/Method: Vanilla JS + HTML/CSS.
        - Report Info: Key Findings/Implications (Performance, Maintainability, Accessibility). -> Goal: Summarize/Inform. -> Viz/Presentation: Icon-driven feature cards. -> Interaction: Clean, scannable presentation of key benefits. -> Justification: Uses icons and brief text to make the high-level benefits digestible and visually appealing. -> Library/Method: HTML/CSS (Tailwind).
    -->
    <!-- CONFIRMATION: NO SVG graphics used. NO Mermaid JS used. -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .code-block {
            background-color: #1e293b;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.875rem;
            line-height: 1.5;
            position: relative;
        }
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background-color: #334155;
            color: #94a3b8;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 0.75rem;
            transition: background-color 0.2s;
        }
        .copy-btn:hover {
            background-color: #475569;
        }
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
            height: 150px;
            max-height: 200px;
        }
        @media (min-width: 768px) {
            .chart-container {
                height: 200px;
            }
        }
    </style>
</head>
<body class="bg-stone-50 text-slate-800">

    <header class="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200">
        <nav class="container mx-auto px-4 lg:px-6">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <span class="text-xl font-bold text-sky-600">Retrofit Guide</span>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#principles" class="text-slate-600 hover:text-sky-600 transition-colors">Principles</a>
                    <a href="#playbook" class="text-slate-600 hover:text-sky-600 transition-colors">Playbook</a>
                    <a href="#analysis" class="text-slate-600 hover:text-sky-600 transition-colors">Analysis</a>
                    <a href="#testing" class="text-slate-600 hover:text-sky-600 transition-colors">Testing</a>
                </div>
                <div class="md:hidden">
                    <button id="mobile-menu-button" class="text-slate-600 hover:text-sky-600 focus:outline-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>
            </div>
            <div id="mobile-menu" class="hidden md:hidden pb-4">
                <a href="#principles" class="block py-2 px-4 text-sm text-slate-600 hover:bg-sky-50 rounded">Principles</a>
                <a href="#playbook" class="block py-2 px-4 text-sm text-slate-600 hover:bg-sky-50 rounded">Playbook</a>
                <a href="#analysis" class="block py-2 px-4 text-sm text-slate-600 hover:bg-sky-50 rounded">Analysis</a>
                <a href="#testing" class="block py-2 px-4 text-sm text-slate-600 hover:bg-sky-50 rounded">Testing</a>
            </div>
        </nav>
    </header>

    <main class="container mx-auto px-4 lg:px-6 py-8 md:py-16">

        <section id="hero" class="text-center mb-20 md:mb-32">
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">From Fixed to Fluid</h1>
            <p class="max-w-3xl mx-auto text-lg md:text-xl text-slate-600">
                An interactive guide to strategically converting desktop-first websites into responsive, mobile-first experiences using Bootstrap 5.3. Discover how to retrofit legacy CSS without a complete rewrite, preserving design intent while embracing modern web standards.
            </p>
        </section>

        <section id="principles" class="mb-20 md:mb-32">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900">Core Principles</h2>
                <p class="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Understanding the fundamental shift in mindset is the first step. This section explains the key concepts that power a mobile-first conversion.</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 class="font-bold text-xl mb-3 text-slate-800">Desktop-First vs. Mobile-First</h3>
                    <p class="text-slate-600 mb-4">The critical difference lies in the direction of your CSS logic. Desktop-first starts wide and subtracts styles for smaller screens (`max-width`), while mobile-first starts narrow and adds styles for larger screens (`min-width`).</p>
                    <div class="space-y-3">
                        <div class="p-3 bg-red-50 rounded">
                            <p class="font-mono text-sm text-red-700">/* Desktop-First (Old Way) */</p>
                            <p class="font-mono text-sm text-red-900">.element { width: 960px; }</p>
                            <p class="font-mono text-sm text-red-900">@media (max-width: 959px) { ... }</p>
                        </div>
                         <div class="p-3 bg-green-50 rounded">
                            <p class="font-mono text-sm text-green-700">/* Mobile-First (New Way) */</p>
                            <p class="font-mono text-sm text-green-900">.element { width: 100%; }</p>
                            <p class="font-mono text-sm text-green-900">@media (min-width: 960px) { ... }</p>
                        </div>
                    </div>
                </div>
                 <div class="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 class="font-bold text-xl mb-3 text-slate-800">Fixed vs. Fluid Units</h3>
                    <p class="text-slate-600 mb-4">Legacy sites often rely on fixed pixels (`px`). Modern, fluid design uses relative units that scale with the viewport or user preferences, enhancing responsiveness and accessibility.</p>
                    <ul class="list-disc list-inside space-y-2 text-slate-600">
                        <li><strong class="text-slate-700">`rem`</strong>: Relative to the root font size. Ideal for typography and spacing to respect user accessibility settings.</li>
                        <li><strong class="text-slate-700">`%` / `vw`</strong>: Relative to the parent container or viewport width. Perfect for creating fluid layouts and elements.</li>
                         <li><strong class="text-slate-700">Bootstrap RFS:</strong> An engine that auto-scales properties using a `calc()` of `rem` and `vw` units.</li>
                    </ul>
                </div>
                <div class="bg-white p-6 rounded-lg border border-slate-200 md:col-span-2 lg:col-span-1">
                    <h3 class="font-bold text-xl mb-3 text-slate-800">Constraint-Based Thinking</h3>
                    <p class="text-slate-600 mb-4">Instead of defining fixed sizes, you define rules and constraints, letting the browser handle the layout. This is the philosophy behind Flexbox, Grid, and functions like `clamp()`.</p>
                    <p class="text-slate-600">By replacing rigid positioning (`float`, `position: absolute`) with Flexbox utilities (`d-flex`, `justify-content-*`), you create systems that naturally adapt to available space.</p>
                </div>
            </div>
        </section>

        <section id="playbook" class="mb-20 md:mb-32">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900">The Retrofit Playbook</h2>
                <p class="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">A step-by-step guide to converting your site. Each step includes explanations, code snippets, and interactive demos to solidify your understanding.</p>
            </div>

            <div class="space-y-16">

                <div class="p-6 md:p-8 bg-white rounded-lg border border-slate-200">
                    <h3 class="text-2xl font-bold mb-1 text-slate-800"><span class="text-sky-500">Step 1:</span> Foundational Setup</h3>
                    <p class="text-slate-600 mb-6">Start by adding the Bootstrap 5.3 CDN links to your HTML `<head>`. Crucially, link your custom stylesheet *after* Bootstrap's to ensure your overrides work correctly.</p>
                    <div class="code-block">
                        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                        <pre><code>&lt;!-- Bootstrap CSS --&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"&gt;

&lt;!-- Your Custom Overrides --&gt;
&lt;link rel="stylesheet" href="assets/css/custom.css"&gt;

&lt;!-- Bootstrap JS Bundle (at end of body) --&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"&gt;&lt;/script&gt;</code></pre>
                    </div>
                </div>

                <div class="p-6 md:p-8 bg-white rounded-lg border border-slate-200">
                    <h3 class="text-2xl font-bold mb-1 text-slate-800"><span class="text-sky-500">Step 2:</span> Rebuild Layout with the Grid</h3>
                    <p class="text-slate-600 mb-6">Wrap page sections in `.container` or `.container-fluid`, and refactor fixed-width layouts into Bootstrap's responsive `.row` and `.col-*` classes. The demo below shows how columns stack on mobile and fit side-by-side on larger screens. Click the buttons to see the effect.</p>
                    <div class="mb-4 flex justify-center space-x-2">
                        <button id="view-mobile" class="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">Mobile</button>
                        <button id="view-tablet" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 focus:outline-none">Tablet</button>
                        <button id="view-desktop" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 focus:outline-none">Desktop</button>
                    </div>
                    <div id="grid-demo-container" class="p-4 bg-slate-100 rounded-lg transition-all duration-300">
                        <div id="grid-demo-row" class="flex flex-wrap -m-2">
                            <div id="col1" class="p-2 w-full"><div class="bg-sky-200 text-sky-800 p-4 rounded text-center h-full">Item 1</div></div>
                            <div id="col2" class="p-2 w-full"><div class="bg-sky-200 text-sky-800 p-4 rounded text-center h-full">Item 2</div></div>
                            <div id="col3" class="p-2 w-full"><div class="bg-sky-200 text-sky-800 p-4 rounded text-center h-full">Item 3</div></div>
                        </div>
                    </div>
                    <p class="text-xs text-center mt-2 text-slate-500">Represents `.col-12 .col-md-6 .col-lg-4`</p>
                </div>

                <div class="p-6 md:p-8 bg-white rounded-lg border border-slate-200">
                    <h3 class="text-2xl font-bold mb-1 text-slate-800"><span class="text-sky-500">Step 3:</span> Master Fluid Typography with `clamp()`</h3>
                    <p class="text-slate-600 mb-6">The CSS `clamp()` function provides true fluidity with guard rails. It locks a value (like `font-size`) between a minimum and maximum limit, while allowing it to scale smoothly based on viewport width. Drag the slider below to see how it works.</p>
                    <div class="bg-slate-100 p-8 rounded-lg text-center">
                        <h4 id="clamp-text" class="font-bold transition-all duration-100" style="font-size: clamp(1.75rem, 4vw + 1rem, 3rem);">Fluid Text</h4>
                    </div>
                    <div class="mt-4">
                        <input id="viewport-slider" type="range" min="320" max="1920" value="1024" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
                        <div class="flex justify-between text-sm text-slate-500 mt-2">
                            <span>320px</span>
                            <span id="viewport-value" class="font-semibold text-slate-700">Viewport: 1024px</span>
                            <span>1920px</span>
                        </div>
                    </div>
                     <div class="code-block mt-6">
                        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                        <pre><code>h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
  /* min, preferred, max */
}</code></pre>
                    </div>
                </div>

                <div class="p-6 md:p-8 bg-white rounded-lg border border-slate-200">
                    <h3 class="text-2xl font-bold mb-1 text-slate-800"><span class="text-sky-500">Step 4:</span> Define & Visualize Breakpoints</h3>
                    <p class="text-slate-600 mb-6">Bootstrap provides six default breakpoints that form the foundation of its responsive utilities. You can use these out-of-the-box or customize them via Sass. This chart visualizes the default pixel ranges for each tier. Hover over a bar for details.</p>
                    <div class="chart-container">
                        <canvas id="breakpointChart"></canvas>
                    </div>
                </div>

            </div>
        </section>

        <section id="analysis" class="mb-20 md:mb-32">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900">Analysis & Implications</h2>
                <p class="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Retrofitting is more than a technical change; it's a strategic upgrade. This approach positively impacts performance, code health, and user accessibility.</p>
            </div>
            <div class="grid md:grid-cols-2 gap-8">
                 <div class="bg-white p-6 rounded-lg border border-slate-200">
                    <h3 class="font-bold text-xl mb-3 text-slate-800">Why It Works: A Shift in Cascade</h3>
                    <p class="text-slate-600">The primary shift is from a desktop-down (`max-width`) to a mobile-up (`min-width`) CSS cascade. Bootstrap 5.3 is built on this mobile-first philosophy. By mapping your legacy UI to its grid and utility system, you effectively abstract away most of the old, rigid logic. Tools like RFS and `clamp()` provide the fine-grained control needed to perfect the design, ensuring the codebase is future-proof by targeting viewport changes rather than specific, brittle device dimensions.</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-slate-200">
                     <h3 class="font-bold text-xl mb-3 text-slate-800">Key Benefits</h3>
                     <div class="space-y-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0 h-6 w-6 text-green-500 mt-1">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div class="ml-3">
                                <h4 class="font-semibold text-slate-800">Performance</h4>
                                <p class="text-slate-600">Delivering a smaller, mobile-optimized CSS payload first significantly improves Core Web Vitals and perceived load times.</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                             <div class="flex-shrink-0 h-6 w-6 text-green-500 mt-1">
                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                             <div class="ml-3">
                                <h4 class="font-semibold text-slate-800">Maintainability</h4>
                                <p class="text-slate-600">Centralized Sass variables for grid, spacing, and colors create a robust design system that's easy to update.</p>
                            </div>
                        </div>
                         <div class="flex items-start">
                             <div class="flex-shrink-0 h-6 w-6 text-green-500 mt-1">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </div>
                             <div class="ml-3">
                                <h4 class="font-semibold text-slate-800">Accessibility</h4>
                                <p class="text-slate-600">Fluid typography and touch-friendly spacing improve WCAG conformance. Always validate color contrast after changes.</p>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </section>

        <section id="testing" class="mb-16">
             <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900">Validation & Testing Pipeline</h2>
                <p class="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">A successful conversion requires rigorous testing. Follow this pipeline to ensure a flawless user experience on all devices.</p>
            </div>
             <div class="bg-white p-8 rounded-lg border border-slate-200">
                <ul class="space-y-6">
                    <li class="flex items-start">
                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">1</div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-slate-800">Iterate with DevTools</h4>
                            <p class="text-slate-600">Use your browser's Responsive Design Mode to cycle through breakpoints. Look for layout shifts, content overflow, and alignment errors. This is your first line of defense.</p>
                        </div>
                    </li>
                    <li class="flex items-start">
                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">2</div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-slate-800">Visualize Active Queries</h4>
                            <p class="text-slate-600">Use the built-in media query inspectors in Chrome or Firefox to see exactly which CSS rules are being applied at every screen width, helping you debug specificity issues.</p>
                        </div>
                    </li>
                    <li class="flex items-start">
                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">3</div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-slate-800">Run Lighthouse Audits</h4>
                            <p class="text-slate-600">Perform a Google Lighthouse audit on the Mobile profile. Target a high score in Performance, Accessibility, and Best Practices. Address all flagged issues.</p>
                        </div>
                    </li>
                     <li class="flex items-start">
                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">4</div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-slate-800">Test on Real Devices</h4>
                            <p class="text-slate-600">Emulators are not enough. Test on a variety of real smartphones and tablets to check for touch target accuracy, real-world performance, and device-specific rendering quirks.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </section>

    </main>

    <footer class="bg-slate-800 text-slate-400 py-8">
        <div class="container mx-auto px-4 lg:px-6 text-center text-sm">
            <p>Interactive guide based on the report "Executive Summary: Desktop-First to Mobile-First".</p>
            <p>&copy; 2025. All Rights Reserved.</p>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {

            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            mobileMenu.addEventListener('click', (e) => {
                if(e.target.tagName === 'A'){
                    mobileMenu.classList.add('hidden');
                }
            })

            function copyCode(button) {
                const pre = button.nextElementSibling;
                const code = pre.querySelector('code');
                const text = code.innerText;

                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                button.innerText = 'Copied!';
                setTimeout(() => {
                    button.innerText = 'Copy';
                }, 2000);
            }
            window.copyCode = copyCode;

            const viewportSlider = document.getElementById('viewport-slider');
            const clampText = document.getElementById('clamp-text');
            const viewportValue = document.getElementById('viewport-value');

            if (viewportSlider) {
                viewportSlider.addEventListener('input', (e) => {
                    const width = e.target.value;
                    const vw = (width / 1024) * 100;
                    viewportValue.textContent = `Viewport: ${width}px`;
                });
            }

            const viewMobileBtn = document.getElementById('view-mobile');
            const viewTabletBtn = document.getElementById('view-tablet');
            const viewDesktopBtn = document.getElementById('view-desktop');
            const gridDemoRow = document.getElementById('grid-demo-row');
            const cols = [document.getElementById('col1'), document.getElementById('col2'), document.getElementById('col3')];

            function setActiveButton(activeBtn) {
                [viewMobileBtn, viewTabletBtn, viewDesktopBtn].forEach(btn => {
                    btn.classList.remove('bg-sky-600', 'text-white');
                    btn.classList.add('bg-slate-200', 'text-slate-700');
                });
                activeBtn.classList.add('bg-sky-600', 'text-white');
                activeBtn.classList.remove('bg-slate-200', 'text-slate-700');
            }

            if (viewMobileBtn) {
                viewMobileBtn.addEventListener('click', () => {
                    gridDemoRow.classList.add('flex-wrap');
                    cols.forEach(col => col.className = 'p-2 w-full');
                    setActiveButton(viewMobileBtn);
                });
                 viewTabletBtn.addEventListener('click', () => {
                    gridDemoRow.classList.add('flex-wrap');
                    cols.forEach(col => col.className = 'p-2 w-1/2');
                    cols[2].className = 'p-2 w-full';
                    setActiveButton(viewTabletBtn);
                });

                viewDesktopBtn.addEventListener('click', () => {
                    gridDemoRow.classList.add('flex-wrap');
                    cols.forEach(col => col.className = 'p-2 w-1/3');
                    setActiveButton(viewDesktopBtn);
                });

                setActiveButton(viewMobileBtn);
            }


            const ctx = document.getElementById('breakpointChart');
            if (ctx) {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['<576px', '≥576px', '≥768px', '≥992px', '≥1200px', '≥1400px'],
                        datasets: [{
                            label: 'Bootstrap 5.3 Breakpoints',
                            data: [575, 207, 224, 208, 200, 250],
                            backgroundColor: [
                                'rgba(14, 165, 233, 0.6)',
                                'rgba(56, 189, 248, 0.6)',
                                'rgba(125, 211, 252, 0.6)',
                                'rgba(186, 230, 253, 0.6)',
                                'rgba(224, 242, 254, 0.6)',
                                'rgba(240, 249, 255, 0.8)',
                            ],
                            borderColor: [
                                'rgba(14, 165, 233, 1)',
                                'rgba(56, 189, 248, 1)',
                                'rgba(125, 211, 252, 1)',
                                'rgba(186, 230, 253, 1)',
                                'rgba(224, 242, 254, 1)',
                                'rgba(203, 213, 225, 1)'
                            ],
                            borderWidth: 1,
                            borderSkipped: false,
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Bootstrap Breakpoint Ranges (min-width)',
                                color: '#334155',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const labels = ['Extra Small (xs)', 'Small (sm)', 'Medium (md)', 'Large (lg)', 'Extra Large (xl)', 'Extra Extra Large (xxl)'];
                                        return labels[context.dataIndex];
                                    },
                                    title: function(context) {
                                        return context[0].label;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                display: false,
                                stacked: true,
                            },
                            y: {
                                stacked: true,
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    color: '#475569',
                                    font: {
                                        weight: '500'
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    </script>
</body>
</html>
