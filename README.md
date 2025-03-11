# Personal Portfolio  

This repository contains the source code for my personal portfolio website. I used (Astro)[https://astro.build] to develop the site to improve performance and maintain required site to the minimum.  This site includes i18n support using astro's built-in support.

## Tech Stack  
- **Framework**: Astro  
- **Styling**: Tailwind CSS  
- **Deployment**: Cloudflare
- **Mail forwarding**: Resend 

## Setup & Installation  
1. Clone the repository:  
   ```sh
   git clone https://github.com/alvarolc01/PersonalSite.git
   cd PersonalSite
   ```
2. Install dependencies:  
   ```sh
   npm install
   ```
3. Run for development:  
   ```sh
   npm run dev
   ```
4. Build the page:  
   ```sh
   npm run build
   ```

## Cloudflare Worker  
This project includes a **Cloudflare Worker** to handle form submissions forwarding to my mail. The worker code is in the [`/portfolio-mail-worker`](./portfolio-mail-worker) directory.  

### Testing Cloudflare Worker
1. Install dependencies:  
   ```sh
   cd portfolio-mail-worker
   npm install
   ```
2. Start worker:  
   ```sh
   npm start
   ```

## License  
This project is licensed under the [MIT License](./LICENSE).  
