# P Karthikeya — Cinematic Developer Portfolio

A responsive Next.js portfolio for P Karthikeya, focused on AI engineering and full-stack development.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run build
npm start
```

## Portfolio sections

- Cinematic 3D hero sculpture (React Three Fiber, Three.js shaders, Drei and postprocessing)
- About, education and resume
- Categorized skills with technology marks
- Interactive project case-study carousel
- Achievement and certification highlights
- Contact form that opens a prefilled email in the visitor's email client

## Featured live projects

- Automate-AI: https://automate-ai-frontend-2yam.onrender.com/
- InterviewIQ: https://three-interviewiq-j80k.onrender.com/
- SiteForge AI: https://site-forge-ai-iq6o-three.vercel.app/

GitHub profile: https://github.com/karthikp236
LinkedIn: https://linkedin.com/in/karthikeya-p-288a10337

Technology marks in the Skills section are loaded from Simple Icons CDN. If a network blocks that CDN, the skill names and cards remain visible.

## Notes

The contact form uses `mailto:` and does not submit to a server. The project GitHub actions currently link to the public GitHub profile because individual repository URLs were not supplied. The 3D canvas reduces its rendering load on small screens and when reduced motion is preferred.
