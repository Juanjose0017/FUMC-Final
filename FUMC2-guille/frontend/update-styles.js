const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  { path: 'src/app/components/dashboard/dashboard.component.ts', css: './dashboard.component.css' },
  { path: 'src/app/components/reports/reports.component.ts', css: './reports.component.css' },
  { path: 'src/app/components/login/login.component.ts', css: './login.component.css' },
  { path: 'src/app/components/register/register.component.ts', css: './register.component.css' },
  { path: 'src/app/components/login/forgot-password.component.ts', css: './forgot-password.component.css' },
  { path: 'src/app/components/admin/form-preview.component.ts', css: './form-preview.component.css' },
  { path: 'src/app/components/admin/process-management.component.ts', css: './process-management.component.css' },
  { path: 'src/app/components/shared/phase-indicator.component.ts', css: './phase-indicator.component.css' },
  { path: 'src/app/components/shared/notification.component.ts', css: './notification.component.css' },
  { path: 'src/app/components/form-container/form-container.component.ts', css: './form-container.component.css' },
  { path: 'src/app/components/phases/phase1.component.ts', css: './phase1.component.css' },
  { path: 'src/app/components/phases/phase2.component.ts', css: './phase2.component.css' },
  { path: 'src/app/components/phases/phase3.component.ts', css: './phase3.component.css' },
  { path: 'src/app/components/phases/phase4.component.ts', css: './phase4.component.css' },
  { path: 'src/app/components/phases/phase5.component.ts', css: './phase5.component.css' }
];

filesToUpdate.forEach(fileInfo => {
  const fullPath = path.join(__dirname, fileInfo.path);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace styles: [`...`] with styleUrls: ['./...css']
  const regex = /styles:\s*\[\s*`[\s\S]*?`\s*\]/m;
  if (regex.test(content)) {
    content = content.replace(regex, `styleUrls: ['${fileInfo.css}']`);
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${fileInfo.path}`);
  } else {
    console.log(`No inline styles found in ${fileInfo.path}`);
  }
});

console.log("Done");
