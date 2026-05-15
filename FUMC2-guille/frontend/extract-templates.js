const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  { path: 'src/app/components/dashboard/dashboard.component.ts', html: './dashboard.component.html' },
  { path: 'src/app/components/reports/reports.component.ts', html: './reports.component.html' },
  { path: 'src/app/components/login/login.component.ts', html: './login.component.html' },
  { path: 'src/app/components/register/register.component.ts', html: './register.component.html' },
  { path: 'src/app/components/login/forgot-password.component.ts', html: './forgot-password.component.html' },
  { path: 'src/app/components/admin/form-preview.component.ts', html: './form-preview.component.html' },
  { path: 'src/app/components/admin/process-management.component.ts', html: './process-management.component.html' },
  { path: 'src/app/components/shared/phase-indicator.component.ts', html: './phase-indicator.component.html' },
  { path: 'src/app/components/shared/notification.component.ts', html: './notification.component.html' },
  { path: 'src/app/components/form-container/form-container.component.ts', html: './form-container.component.html' },
  { path: 'src/app/components/phases/phase1.component.ts', html: './phase1.component.html' },
  { path: 'src/app/components/phases/phase2.component.ts', html: './phase2.component.html' },
  { path: 'src/app/components/phases/phase3.component.ts', html: './phase3.component.html' },
  { path: 'src/app/components/phases/phase4.component.ts', html: './phase4.component.html' },
  { path: 'src/app/components/phases/phase5.component.ts', html: './phase5.component.html' }
];

filesToUpdate.forEach(fileInfo => {
  const fullPath = path.join(__dirname, fileInfo.path);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace template: `...` with templateUrl: './...html'
  // and extract the HTML content
  const regex = /template:\s*`([\s\S]*?)`,?\s*(styleUrls:|})/m;
  const match = content.match(regex);
  
  if (match) {
    const htmlContent = match[1].trim();
    const htmlPath = fullPath.replace(/\.ts$/, '.html');
    
    // Save HTML
    fs.writeFileSync(htmlPath, htmlContent);
    
    // Replace in TS
    // Since we matched the trailing part (styleUrls: or }), we need to put it back
    const tail = match[2];
    const newTemplateString = `templateUrl: '${fileInfo.html}',\n  ${tail}`;
    
    content = content.replace(regex, newTemplateString);
    fs.writeFileSync(fullPath, content);
    console.log(`Extracted HTML for ${fileInfo.path}`);
  } else {
    console.log(`No inline template found in ${fileInfo.path}`);
  }
});

console.log("Done extracting templates.");
