# Bloom Academy - Premier Special Education & Inclusive School Web Platform

A highly accessible, high-fidelity landing page and brand showcase for a premier Special Education and Inclusive School. Designed with a calming, neurodiversity-supportive color palette and built to meet WCAG 2.1 AA accessibility guidelines.

## 🎨 Design Philosophy & Colors
To accommodate sensory sensitivities and support neurodiverse learners, the platform avoids aggressive neon values and visual noise in favor of comforting, grounded organic tones:
- **Warm Ivory Background (#FAFAFA):** Soft, low-contrast backdrop that reduces eye strain compared to harsh whites.
- **Soft Sage Green (#7DA493):** Dominant accent color symbolizing growth, peace, and cognitive calm.
- **Pastel Blue (#92B4D6):** Supporting color bringing a sense of safety, reliability, and emotional reassurance.
- **Deep Charcoal Grey (#2D3748):** Selected for text layers to guarantee optimal contrast scores without the harshness of pure black.

## 🛠️ Accessibility Options Panel
The top-right "Accessibility Settings" toggle triggers an interactive control panel allowing pupils, parents, and teachers to adjust their reading environment:
1. **Dynamic Font Scaler:** Toggle body scaling between **Normal (100%)**, **Large (125%)**, and **Extra Large (150%)**.
2. **Dyslexic-Friendly Font (Lexend):** Switches the standard sans-serif (`Inter`) to `Lexend`—a typeface engineered specifically to improve reading speed, fluency, and word tracking for dyslexic learners.
3. **Adaptive Visual Themes:**
   - **Calming Pastel:** Standard pastel palette.
   - **High Contrast Black:** High-contrast yellow/cyan/white text on pure black backdrops for low-vision users.
   - **Soothing Dark Mode:** A comforting, low-stimulation dark green-grey palette.
   - **Monochrome:** Grayscale rendering to remove color distraction variables.
4. **Focused Reading Guide (Line Reading Mask):** A custom horizontal highlighter overlay that follows the mouse cursor to help readers focus on one line of text at a time.
5. **Interactive Voice Guidance:** A built-in text-to-speech reader that synthesizes text aloud on hover/focus using the browser's Web Speech API.
6. **Reduce Motion:** Instantly pauses all CSS transitions and animations.

## 🎮 Interactive Features & Widgets
- **Student IEP Profile Builder:** A custom rule-based strategy generator mapping classroom accommodations based on a child's learning strengths (e.g., Kinesthetic, Visual) and support requirements.
- **Sensory Calming Simulator:** A functional preview card allowing custom ambient room light adjustment, bubble tube speed toggles, and fully synthesized pink/brown ambient noise generators using the **Web Audio API** (simulating gentle rain and deep ocean waves).
- **Behance Portfolio View:** A toggled workspace displaying the design case study and the high-fidelity 8K desktop mockup shot directly inside the browser.

## 🚀 Getting Started Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/tolgaosman/ozelEgitim.git
   ```
2. Navigate into the folder:
   ```bash
   cd ozelEgitim
   ```
3. Run a local web server (e.g. using `http-server` or `live-server`):
   ```bash
   npx http-server -p 8000
   ```
4. Open your browser and navigate to `http://127.0.0.1:8000`.